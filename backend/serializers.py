from rest_framework import serializers
from .models import Product, Ingredient, Brand, SkinConcern


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = "__all__"


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"


class SkinConcernSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkinConcern
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"
