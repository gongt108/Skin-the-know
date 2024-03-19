from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    alias = models.CharField(max_length=255, null=True, blank=True)
    good_list = models.ManyToManyField(
        "self", symmetrical=False, related_name="good_for", blank=True
    )
    avoid_list = models.ManyToManyField(
        "self", symmetrical=False, related_name="to_avoid", blank=True
    )
    caution_list = models.ManyToManyField(
        "self", symmetrical=False, related_name="use_with_caution", blank=True
    )
    incidecoder_url = models.URLField(null=True)
    img_url = models.URLField(null=True, blank=True)
    skin_concern = models.ManyToManyField("SkinConcern", blank=True)


class Brand(models.Model):
    name = models.CharField(max_length=100)
    img_url = models.CharField(max_length=255, null=True)


class Product(models.Model):
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    ingredients = models.ManyToManyField(Ingredient, blank=True)
    main_active = models.ForeignKey(
        Ingredient, related_name="main_active", on_delete=models.SET_NULL, null=True
    )
    skin_concern = models.ManyToManyField("SkinConcern", blank=True)
    img_url = models.CharField(max_length=255, null=True)
    incidecoder_url = models.URLField(null=True)
    product_link = models.URLField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, null=True, blank=True, default=0.0
    )
    num_reviews = models.IntegerField(default=0)
    unique_identifier = models.CharField(
        max_length=255, blank=True, editable=False, unique=True
    )

    def save(self, *args, **kwargs):
        # Generate unique identifier using brand name and product name
        if not self.unique_identifier:
            self.unique_identifier = self.generate_unique_identifier()
        super().save(*args, **kwargs)

    def generate_unique_identifier(self):
        brand_name_slug = slugify(self.brand.name)
        product_name_slug = slugify(self.name)
        return f"{brand_name_slug}-{product_name_slug}"


class SkinConcern(models.Model):
    name = models.CharField(max_length=100)
