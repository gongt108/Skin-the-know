# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from django.utils.text import slugify


class ProductItemPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        field_names = adapter.field_names()
        for field_name in field_names:
            if field_name != "unique_identifier":
                adapter[field_name] = adapter.get(field_name)
            elif field_name == "unique_identifier":
                adapter["unique_identifier"] = adapter.get("unique_identifier").replace(
                    "/products/", ""
                )
        return item


class IngredientListPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        # ingredient = adapter.get("ingredient")
        adapter["name"] = item["name"]
        url = item["incidecoder_url"]
        adapter["incidecoder_url"] = f"https://incidecoder.com{url}"
        return item


import psycopg2


class SaveProductToPostgresPipeline:
    def __init__(self):
        self.host = "localhost"
        self.user = "tiffanygong"
        self.password = "testpass"
        self.database = "skinpair"

        ## Create cursor, used to execute commands
        self.connection = psycopg2.connect(
            host=self.host, user=self.user, password=self.password, dbname=self.database
        )
        self.cur = self.connection.cursor()

        # Create tables if they don't exist
        self.create_tables()

    def create_tables(self):

        ## Create ingredients table if none exists
        self.cur.execute(
            """
        CREATE TABLE IF NOT EXISTS backend_ingredient(
            id serial PRIMARY KEY,
            name text,
            alias text,
            good_list VARCHAR(255),
            avoid_list VARCHAR(255),
            caution_list VARCHAR(255),
            incidecoder_url VARCHAR(255),
            img_url VARCHAR(255),
            skin_concern VARCHAR(255)
        )
        """
        )

        ## Create brands table if none exists
        self.cur.execute(
            """
        CREATE TABLE IF NOT EXISTS backend_brand(
            id serial PRIMARY KEY,
            name text,
            slug VARCHAR(255),
            img_url VARCHAR(255)
            
        )
        """
        )

        ## Create products table if none exists
        self.cur.execute(
            """
        CREATE TABLE IF NOT EXISTS backend_product(
            id serial PRIMARY KEY,
            name text,
            brand_id INT,
            incidecoder_url VARCHAR(255),
            img_url VARCHAR(255),
            unique_identifier VARCHAR(255),
            num_reviews INT,
            rating FLOAT
        )
        """
        )

        ## Create many to many relationship for products and ingredients if none exists
        self.cur.execute(
            """
        CREATE TABLE IF NOT EXISTS backend_product_ingredients(
            product_id INT,
            ingredient_id INT,
            PRIMARY KEY (product_id, ingredient_id),
            FOREIGN KEY (product_id) REFERENCES backend_product(id),
            FOREIGN KEY (ingredient_id) REFERENCES backend_ingredient(id)
        )
        """
        )

    def process_item(self, item, spider):
        # Find or create brand ID
        brand_id = self.find_or_create_brand(item["brand"])

        # Check if the incidecoder_url is already in the database
        product_id = self.find_or_create_product(
            item, item["name"], brand_id, item["incidecoder_url"]
        )

        # Create relationships between product and ingredients
        for ingredient in item["ingredients"]:
            self.create_product_ingredient_relation(
                product_id, ingredient["name"], ingredient["url"]
            )

        return item

    def find_or_create_brand(self, brand_name):

        ## Find or create brand id
        self.cur.execute(
            "SELECT id FROM backend_brand WHERE name = %s",
            (brand_name,),
        )
        existing_record = self.cur.fetchone()

        if existing_record:
            # If a record exists, return its ID
            return existing_record[0]
        else:
            try:
                # If no record exists, create a new record
                self.cur.execute(
                    "INSERT INTO backend_brand (name) VALUES (%s) RETURNING id",
                    (brand_name,),
                )
                # Retrieve the ID of the newly inserted record
                brand_id = self.cur.fetchone()[0]
                brand_id.save()

                # Commit the transaction
                self.connection.commit()
                return brand_id
            except Exception as e:
                self.connection.rollback()
                print(f"Error inserting brand into database: {e}")

    def find_or_create_product(self, item, product_name, brand_id, incidecoder_url):
        # Check if the incidecoder_url is already in the database
        self.cur.execute(
            "SELECT id FROM backend_product WHERE incidecoder_url = %s",
            (incidecoder_url,),
        )
        existing_record = self.cur.fetchone()

        if existing_record:
            # If a record exists, return its ID
            print("Product already exists in the database")
            product_id = existing_record[0]
            return product_id
        else:
            try:
                self.cur.execute(
                    """INSERT INTO backend_product (
                        name,
                        brand_id,
                        incidecoder_url,
                        img_url,
                        unique_identifier,
                        num_reviews,
                        rating
                    ) VALUES(
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    ) RETURNING id""",
                    (
                        product_name,
                        brand_id,
                        incidecoder_url,
                        item["img_url"],
                        item["unique_identifier"],
                        0,
                        0.0,
                    ),
                )
                product_id = self.cur.fetchone()[0]

                self.connection.commit()
                return product_id

            except Exception as e:
                self.connection.rollback()
                print(f"Error inserting item into database: {e}")

    def create_product_ingredient_relation(
        self, product_id, ingredient_name, ingredient_url
    ):
        # Check if a record with the given incidecoder_url exists
        self.cur.execute(
            "SELECT id FROM backend_ingredient WHERE incidecoder_url = %s",
            (ingredient_url,),
        )
        existing_record = self.cur.fetchone()

        if existing_record:
            # If a record exists, return its ID
            ingredient_id = existing_record[0]
        else:
            # If no record exists, create a new record
            try:
                self.cur.execute(
                    "INSERT INTO backend_ingredient (name, incidecoder_url) VALUES (%s, %s) RETURNING id",
                    (ingredient_name, ingredient_url),
                )
                ingredient_id = self.cur.fetchone()[0]
            except Exception as e:
                self.connection.rollback()
                print(f"Error inserting ingredient into database: {e}")
                return

        # Check if the product-ingredient relationship already exists
        self.cur.execute(
            "SELECT COUNT(*) FROM backend_product_ingredients WHERE product_id = %s AND ingredient_id = %s",
            (product_id, ingredient_id),
        )
        count = self.cur.fetchone()[0]

        if count == 0:
            # If the relationship doesn't exist, insert it into the database
            try:
                self.cur.execute(
                    "INSERT INTO backend_product_ingredients (product_id, ingredient_id) VALUES (%s, %s)",
                    (product_id, ingredient_id),
                )
                self.connection.commit()
            except Exception as e:
                self.connection.rollback()
                print(
                    f"Error inserting product-ingredient relationship into database: {e}"
                )

    def close_spider(self, spider):
        ## Close cursor & connection to database
        self.cur.close()
        self.connection.close()


class SaveIngredientToPostgresPipeline:
    def __init__(self):
        self.host = "localhost"
        self.user = "tiffanygong"
        self.password = "testpass"
        self.database = "skinpair"

        ## Create cursor, used to execute commands
        self.connection = psycopg2.connect(
            host=self.host, user=self.user, password=self.password, dbname=self.database
        )
        self.cur = self.connection.cursor()

        ## Create ingredients table if none exists
        self.cur.execute(
            """
        CREATE TABLE IF NOT EXISTS backend_ingredient(
            id serial PRIMARY KEY,
            name text,
            alias text,
            good_list VARCHAR(255),
            avoid_list VARCHAR(255),
            caution_list VARCHAR(255),
            incidecoder_url VARCHAR(255),
            img_url VARCHAR(255),
            skin_concern VARCHAR(255)
        )
        """
        )

    def process_item(self, item, spider):
        print("saving to db")
        incidecoder_url = item.get("incidecoder_url")

        # Check if the incidecoder_url is already in the database
        self.cur.execute(
            "SELECT COUNT(*) FROM backend_ingredient WHERE incidecoder_url = %s",
            (incidecoder_url,),
        )
        count = self.cur.fetchone()[0]

        if count == 0:
            try:
                self.cur.execute(
                    """INSERT INTO backend_ingredient (
                        name,
                        incidecoder_url
                        
                    ) VALUES(
                        %s,
                        %s
                    )""",
                    (item.get("name"), incidecoder_url),
                )
                self.connection.commit()
            except Exception as e:
                self.connection.rollback()
                print(f"Error inserting item into database: {e}")

        else:
            print("Item already exists in the database")

        return item

    def close_spider(self, spider):
        ## Close cursor & connection to database
        self.cur.close()
        self.connection.close()
