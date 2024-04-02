from rest_framework import serializers
from .models import Product, Ingredient, Brand, SkinConcern, Week, Schedule
from django.contrib.auth.models import User


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
    main_active = IngredientSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ScheduleSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Schedule
        fields = "__all__"


class WeekSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, source="schedule_set")

    class Meta:
        model = Week
        fields = "__all__"
