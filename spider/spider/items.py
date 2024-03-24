# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class IngredientListItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()
    incidecoder_url = scrapy.Field()


class ProductItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()
    brand = scrapy.Field()
    ingredients = scrapy.Field()
    incidecoder_url = scrapy.Field()
