from pathlib import Path

import scrapy
from spider.items import IngredientListItem, ProductItem
from django.utils.text import slugify


class QuotesSpider(scrapy.Spider):
    name = "products"
    allowed_domains = ["incidecoder.com"]

    custom_settings = {
        "FEEDS": {"booksdata.json": {"format": "json", "overwrite": True}},
        "ITEM_PIPELINES": {
            "spider.pipelines.ProductItemPipeline": 300,
            "spider.pipelines.SaveProductToPostgresPipeline": 400,
        },
    }

    def start_requests(self):
        urls = ["https://incidecoder.com/brands/cos-de-baha"]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        products = response.css("div.paddingb60 a.klavika.simpletextlistitem")
        for product in products:
            relative_url = product.css("::attr(href)").get()
            product_url = "https://incidecoder.com" + relative_url

            yield response.follow(
                product_url,
                callback=self.parse_product_page,
                meta={"product_url": product_url, "relative_url": relative_url},
            )

        next_page = response.css("div.center.fs16 a ::attr(href)").get()
        if next_page is not None:
            next_page_url = "https://incidecoder.com" + next_page
            yield response.follow(next_page_url, callback=self.parse)

    def parse_product_page(self, response):
        product_item = ProductItem()
        product_item["incidecoder_url"] = response.meta.get("product_url")
        product_item["name"] = response.css("span#product-title ::text").get()
        product_item["brand"] = response.css("span#product-brand-title a ::text").get()
        product_item["img_url"] = response.css(
            "div#product-main-image img::attr(src)"
        ).get()
        product_item["unique_identifier"] = response.meta.get("relative_url")

        # ingredient_item = IngredientListItem()
        ingredients = response.css("div#ingredlist-short").css("span")
        ingredient_list = []
        for ingredient in ingredients:
            ingredient_text = ingredient.css("a::text").get()

            # Extract the URL
            ingredient_url = ingredient.css("a").xpath("@href").get()

            # Create a dictionary for the ingredient and its URL
            ingredient_dict = {
                "name": ingredient_text,
                "url": f"https://incidecoder.com{ingredient_url}",
            }

            # Append the dictionary to the list
            if ingredient_text is not None:
                # ingredient_item["ingredient"] = ingredient_dict

                ingredient_list.append(ingredient_dict)
        product_item["ingredients"] = ingredient_list

        yield product_item
