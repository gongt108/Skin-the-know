from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.serializers import serialize
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

from .models import Product


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


def get_all_products(request):
    all_products = Product.objects.all()
    json_data = serialize("json", all_products)
    data = json.loads(json_data)

    # Extract the 'fields' attribute from each dictionary
    fields_data = [item["fields"] for item in data]

    return JsonResponse(fields_data, safe=False)


def get_product_data(request, unique_identifier):
    product_info = Product.objects.filter(unique_identifier=unique_identifier).first()

    if product_info:

        # Serialize the Product object into a dictionary
        product_data = {
            "name": product_info.name,
            "brand": product_info.brand.name if product_info.brand else None,
            "ingredients": [
                ingredient.name for ingredient in product_info.ingredients.all()
            ],
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

        print(product_data)
        return JsonResponse(product_data)
    else:
        # Return a JsonResponse indicating that the product does not exist
        return JsonResponse({"error": "Product not found"}, status=404)
