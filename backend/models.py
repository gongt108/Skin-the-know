from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(max_length=100)
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
    img_url = models.URLField(null=True)
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


class SkinConcern(models.Model):
    name = models.CharField(max_length=100)
