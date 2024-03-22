from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.serializers import serialize
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
import json

from .models import Product, Ingredient
from .serializers import ProductSerializer, IngredientSerializer


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


# def get_all_products(request):
#     all_products = Product.objects.all()
#     json_data = serialize("json", all_products)
#     data = json.loads(json_data)

#     # Extract the 'fields' attribute from each dictionary
#     fields_data = [item["fields"] for item in data]

#     return JsonResponse(fields_data, safe=False)


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


# def get_all_ingredients(request):
#     all_ingredients = Ingredient.objects.all()
#     json_data = serialize("json", all_ingredients)
#     data = json.loads(json_data)

#     ingredients_data = []
#     for item in data:
#         fields = item["fields"]
#         fields["pk"] = item["pk"]  # Add 'pk' to the fields dictionary
#         ingredients_data.append(fields)

#     return JsonResponse(ingredients_data, safe=False)


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
