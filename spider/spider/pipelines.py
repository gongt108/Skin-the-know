# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


# class ProductItemPipeline:
#     def process_item(self, item, spider):
#         adapter = ItemAdapter(item)
#         adapter["name"] = item["name"]
#         adapter["brand"] = item["brand"]
#         adapter["ingredients"] = item["ingredients"]
#         url = item["incidecoder_url"]
#         adapter["incidecoder_url"] = f"https://incidecoder.com{url}"
#         return item


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
            brand VARCHAR(255),
            incidecoder_url VARCHAR(255)
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

        ## Find or create brand id
        self.cur.execute(
            "SELECT id FROM backend_brand WHERE name = %s",
            (item["brand"],),
        )
        existing_record = self.cur.fetchone()

        if existing_record:
            # If a record exists, return its ID
            brand_id = existing_record[0]
        else:
            # If no record exists, create a new record
            self.cur.execute(
                "INSERT INTO backend_brand (name) VALUES (%s) RETURNING id",
                (item["brand"],),
            )
            # Retrieve the ID of the newly inserted record
            brand_id = self.cur.fetchone()[0]

        # Commit the transaction
        self.connection.commit()

        incidecoder_url = item.get("incidecoder_url")

        # Check if the incidecoder_url is already in the database
        self.cur.execute(
            "SELECT COUNT(*) FROM backend_product WHERE incidecoder_url = %s",
            (incidecoder_url,),
        )
        count = self.cur.fetchone()[0]

        if count == 0:
            try:
                self.cur.execute(
                    """INSERT INTO backend_product (
                        name,
                        brand,
                        incidecoder_url
                    ) VALUES(
                        %s,
                        %s,
                        %s
                    ) RETURNING id""",
                    (item.get("name"), brand_id, incidecoder_url),
                )

                self.connection.commit()
            except Exception as e:
                self.connection.rollback()
                print(f"Error inserting item into database: {e}")

        else:
            print("Product already exists in the database")

        product_id = self.cur.fetchone()[0]

        ## Find ingredient ids
        ingredient_list = []
        for ingredient in item["ingredients"]:
            url = ingredient["url"]

            # Check if a record with the given incidecoder_url exists
            self.cur.execute(
                "SELECT id FROM backend_ingredient WHERE incidecoder_url = %s",
                (url,),
            )
            existing_record = self.cur.fetchone()

            if existing_record:
                # If a record exists, return its ID
                ingredient_id = existing_record[0]
            else:
                # If no record exists, create a new record
                self.cur.execute(
                    "INSERT INTO backend_ingredient (name,incidecoder_url) VALUES (%s, %s) RETURNING id",
                    (
                        ingredient["name"],
                        url,
                    ),
                )
                # Retrieve the ID of the newly inserted record
                ingredient_id = self.cur.fetchone()[0]

            ## create relationship
            try:
                self.cur.execute(
                    "INSERT INTO backend_products_ingredients (product_id, ingredient_id) VALUES (%s, %s)",
                    (
                        product_id,
                        ingredient_id,
                    ),
                )
            except Exception as e:
                self.connection.rollback()
                print(f"Error inserting item into database: {e}")
        # Commit the transaction
        self.connection.commit()

        return item

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
