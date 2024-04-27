from rest_framework import serializers
from .models import Product, Ingredient, Brand, SkinConcern, Week, Schedule, Profile
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


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
    brand = BrandSerializer(many=False)
    ingredients = IngredientSerializer(many=True)
    main_active = IngredientSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"


class WeekSerializer(serializers.ModelSerializer):

    class Meta:
        model = Week
        fields = "__all__"


class ScheduleSerializer(serializers.ModelSerializer):
    week = WeekSerializer(many=False, read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Schedule
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=False)
    own_list = ProductSerializer(many=True, read_only=True)
    wishlist = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"
