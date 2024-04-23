from django.contrib import admin
from .models import (
    Ingredient,
    Brand,
    Product,
    SkinConcern,
    Week,
    Schedule,
    Profile,
    Review,
)


# Register your models here.
class IngredientAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "alias")
    search_fields = ("name", "id", "alias")


admin.site.register(Ingredient, IngredientAdmin)


class BrandAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


admin.site.register(Brand, BrandAdmin)


class ProductAdmin(admin.ModelAdmin):

    list_display = ("id", "name", "unique_identifier")
    search_fields = ("id", "name", "unique_identifier")


admin.site.register(Product, ProductAdmin)


class SkinConcernAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


admin.site.register(SkinConcern, SkinConcernAdmin)


class WeekAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


admin.site.register(Week, WeekAdmin)


admin.site.register(Schedule)
admin.site.register(Profile)
admin.site.register(Review)
