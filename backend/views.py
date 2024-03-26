from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.postgres.search import TrigramSimilarity
from django.core.serializers import serialize
from django.db import models
from django.db.models import Q, Value
from django.db.models.functions import Cast, Length, Greatest
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from functools import reduce

from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
import json

from .models import Product, Ingredient, Brand
from .serializers import ProductSerializer, IngredientSerializer, BrandSerializer


@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail": "Please enter username and password"})
    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"detail": "User credentials are invalid."}, status=400)
    login(request, user)
    return JsonResponse({"details": "Successfully logged in."})


def register_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    print(username)

    if username is None or password is None:
        return JsonResponse({"detail": "Please enter username and password"})
    else:
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return JsonResponse({"details": "Successfully registered user."})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You are not logged in."}, status=400)
    logout(request)
    return JsonResponse({"detail": "Successfully logged out."})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})
    return JsonResponse({"isauthenticated": True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})
    return JsonResponse({"username": request.user.username})


def get_product_data(request, unique_identifier):
    product_info = Product.objects.filter(unique_identifier=unique_identifier).first()

    if product_info:

        # Serialize the Product object into a dictionary
        product_data = {
            "name": product_info.name,
            "brand": product_info.brand.name if product_info.brand else None,
            "ingredients": [],
            "main_active": (
                product_info.main_active.name if product_info.main_active else None
            ),
            "skin_concern": [
                concern.name for concern in product_info.skin_concern.all()
            ],
            "img_url": product_info.img_url,
            "incidecoder_url": product_info.incidecoder_url,
            "product_link": product_info.product_link,
            "rating": (
                float(product_info.rating) if product_info.rating is not None else None
            ),
            "num_reviews": product_info.num_reviews,
            "unique_identifier": product_info.unique_identifier,
        }
        # Iterate over each ingredient
        for ingredient in product_info.ingredients.all():
            # Get the bad list ingredients for this ingredient
            avoid_list_ingredients = [
                {
                    "name": bad_ingredient.name,
                    "alias": bad_ingredient.alias,
                    "incidecoder_url": bad_ingredient.incidecoder_url,
                    "img_url": bad_ingredient.img_url,
                    # Include other fields as needed
                }
                for bad_ingredient in ingredient.avoid_list.all()
            ]

            # Append the ingredient details along with its bad list to the ingredients list
            product_data["ingredients"].append(
                {
                    "name": ingredient.name,
                    "alias": ingredient.alias,
                    "incidecoder_url": ingredient.incidecoder_url,
                    "img_url": ingredient.img_url,
                    # Include other fields as needed
                    "avoid_list": avoid_list_ingredients,
                }
            )

        print(product_data)
        return JsonResponse(product_data, safe=False)
    else:
        # Return a JsonResponse indicating that the product does not exist
        return JsonResponse({"error": "Product not found"}, status=404)


class ProductViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def get_brand_products(self, request):
        slug = request.query_params.get("slug")
        brand = get_object_or_404(Brand, slug=slug)
        queryset = Product.objects.filter(
            Q(brand=brand) & ~Q(unique_identifier__icontains="discontinued")
        )
        # Serialize products
        product_serializer = ProductSerializer(queryset, many=True)

        # Create a dictionary with brand name and serialized product data
        response_data = {"brand_name": brand.name, "products": product_serializer.data}

        return JsonResponse(response_data)

    @action(detail=False, methods=["get"])
    def best_products(self, request):
        queryset = Product.objects.order_by("-rating")[
            :8
        ]  # Retrieving the best 8 products
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def search_products(self, request):
        search_term = request.query_params.get("search_term")
        words = search_term.split()

        # Start with an empty queryset
        queryset = (
            Product.objects.annotate(
                similarity=TrigramSimilarity("unique_identifier", search_term),
            )
            .filter(similarity__gte=0.5)
            .order_by("-similarity")
        )

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def ingredients(self, request, pk=None):
        product = self.get_object()
        ingredients = product.ingredients.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data)


class IngredientViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Ingredient.objects.all()
        serializer = IngredientSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Ingredient.objects.all()
        ingredient = get_object_or_404(queryset, pk=pk)
        serializer = IngredientSerializer(ingredient)
        return Response(serializer.data)


class BrandViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Brand.objects.all()
        serializer = BrandSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Brand.objects.all()
        brand = get_object_or_404(queryset, pk=pk)
        serializer = BrandSerializer(brand)
        return Response(serializer.data)
