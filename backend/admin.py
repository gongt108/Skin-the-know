from django.contrib import admin
from .models import Ingredient, Brand, Product, SkinConcern


# Register your models here.
class IngredientAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


admin.site.register(Ingredient, IngredientAdmin)


class BrandAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


admin.site.register(Brand, BrandAdmin)


class ProductAdmin(admin.ModelAdmin):

    list_display = ("id", "name", "unique_identifier")


admin.site.register(Product, ProductAdmin)


class SkinConcernAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


admin.site.register(SkinConcern, SkinConcernAdmin)
