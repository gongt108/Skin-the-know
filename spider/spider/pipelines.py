# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class IngredientListPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        print(item)
        # ingredient = adapter.get("ingredient")
        adapter["name"] = item["name"]
        url = item["incidecoder_url"]
        adapter["incidecoder_url"] = f"https://incidecoder.com{url}"
        return item


import psycopg2


class SaveToPostgresPipeline:
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
