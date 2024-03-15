from pathlib import Path

import scrapy


class QuotesSpider(scrapy.Spider):
    name = "products"
    allowed_domains = ["incidecoder.com"]

    def start_requests(self):
        urls = ["https://incidecoder.com/products/benton-aloe-bha-skin-toner"]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        ingredients = response.css("div#ingredlist-short").css("span a::text")
        for ingredient in ingredients:
            ingredient = ingredient.get()
            print(ingredient)
