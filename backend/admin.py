from django.contrib import admin
from .models import Ingredient, Brand, Product, SkinConcern

# Register your models here.
admin.site.register(Ingredient)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(SkinConcern)
