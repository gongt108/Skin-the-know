from pathlib import Path

import scrapy
from spider.items import IngredientListItem


class QuotesSpider(scrapy.Spider):
    name = "products"
    allowed_domains = ["incidecoder.com"]

    custom_settings = {
        "FEEDS": {"booksdata.json": {"format": "json", "overwrite": True}},
        # "ITEM_PIPELINES": {
        # "spider.pipelines.IngredientListPipeline": 300,
        # "spider.pipelines.SaveToPostgresPipeline": 400,
        # },
    }

    def start_requests(self):
        urls = ["https://incidecoder.com/brands/some-by-mi"]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        products = response.css("div.paddingb60 a.klavika.simpletextlistitem")
        for product in products:
            relative_url = product.css("::attr(href)").get()
            product_url = "https://incidecoder.com" + relative_url

            yield response.follow(product_url, callback=self.parse_product_page)

        next_page = response.css("div.center.fs16 a ::attr(href)").get()
        if next_page is not None:
            next_page_url = "https://incidecoder.com" + next_page
            yield response.follow(next_page_url, callback=self.parse)

    def parse_product_page(self, response):
        ingredient_item = IngredientListItem()
        ingredients = response.css("div#ingredlist-short").css("span")
        # print(ingredients)
        for ingredient in ingredients:
            ingredient_text = ingredient.css("a::text").get()

            # Extract the URL
            ingredient_url = ingredient.css("a").xpath("@href").get()

            # Create a dictionary for the ingredient and its URL
            # ingredient_dict = {"name": ingredient_text, "url": ingredient_url}

            # Append the dictionary to the list
            if ingredient_text is not None:
                # ingredient_item["ingredient"] = ingredient_dict
                ingredient_item["name"] = ingredient_text
                ingredient_item["incidecoder_url"] = ingredient_url
                yield ingredient_item
