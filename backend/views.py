from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, AnonymousUser
from django.contrib.postgres.search import TrigramSimilarity
from django.core.serializers import serialize
from django.db import models
from django.db.models import Q, Value
from django.db.models.functions import Cast, Length, Greatest
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from functools import reduce

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
import json

from .models import (
    Product,
    Ingredient,
    Brand,
    SkinConcern,
    Schedule,
    Week,
    Profile,
    Review,
)
from .serializers import (
    BrandSerializer,
    IngredientSerializer,
    ProductSerializer,
    ProfileSerializer,
    ScheduleSerializer,
    SkinConcernSerializer,
    UserSerializer,
    WeekSerializer,
)


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
    print(user)

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
    # if not request.user.is_authenticated:
    #     return JsonResponse({"detail": "You are not logged in."}, status=400)
    logout(request)
    print(request.user)

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
            "id": product_info.id,
            "name": product_info.name,
            "brand": product_info.brand.name if product_info.brand else None,
            "ingredients": [],
            "main_active": (
                product_info.main_active.name if product_info.main_active else None
            ),
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

        # Start with an empty queryset
        queryset = (
            Product.objects.annotate(
                similarity=TrigramSimilarity("unique_identifier", search_term),
            )
            .filter(similarity__gte=0.3)
            .order_by("-similarity")
        )

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def get_product_data(self, request):
        slug = request.query_params.get("slug")
        product = Product.objects.get(unique_identifier=slug)
        serializer = ProductSerializer(product, many=False)

        print(serializer.data)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def ingredients(self, request, pk=None):
        product = self.get_object()
        ingredients = product.ingredients.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get", "put"])
    def get_user_rating(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"isauthenticated": False})

        user = request.user
        slug = request.query_params.get("slug")
        product = Product.objects.get(unique_identifier=slug)

        try:
            found_review = product.review_set.get(user=user)
        except Review.DoesNotExist:
            if request.method == "GET":
                return JsonResponse({"isauthenticated": True, "user_review": None})
            elif request.method == "PUT":
                found_review = product.review_set.create(user=user, rating=0.0)

        if request.method == "PUT":
            new_rating = request.data.get("new_rating")
            if new_rating is not None and found_review:
                found_review.rating = new_rating
                found_review.save()

        user_rating = found_review.rating
        return JsonResponse({"isauthenticated": True, "user_review": user_rating})


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


class SkinConcernViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = SkinConcern.objects.all()
        serializer = SkinConcernSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = SkinConcern.objects.all()
        skin_concern = get_object_or_404(queryset, pk=pk)
        serializer = SkinConcernSerializer(skin_concern)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def get_products(self, request, pk=None):
        query = request.query_params.get("query")
        filter = request.query_params.get("filter")

        skin_concern = SkinConcern.objects.filter(slugified_name=query).first()
        skin_concern_serializer = SkinConcernSerializer(skin_concern, many=False)
        ingredients = skin_concern.ingredients.all()
        ingredient_serializer = IngredientSerializer(ingredients, many=True)

        q_objects = Q()

        if filter == "all":
            for ingredient in ingredients:
                q_objects |= Q(main_active__in=[ingredient])
            queryset = Product.objects.filter(q_objects).distinct()
        else:
            ingredient = Ingredient.objects.get(id=filter)
            q_objects = Q(main_active__in=[ingredient.id])
            queryset = Product.objects.filter(
                main_active__in=[ingredient.id]
            ).distinct()
        product_serializer = ProductSerializer(queryset, many=True)
        response_data = {
            "skin_concern": skin_concern_serializer.data,
            "ingredients": ingredient_serializer.data,
            "products": product_serializer.data,
        }

        return JsonResponse(response_data)


class WeekViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Week.objects.all()
        serializer = WeekSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Week.objects.all()
        week = get_object_or_404(queryset, pk=pk)
        serializer = WeekSerializer(week)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def get_schedule(self, request, pk=None):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=HTTP_401_UNAUTHORIZED)
        weeks = user.week_set.all()
        if not weeks.exists():
            return Response(
                "Weekly schedule not found.", status=status.HTTP_404_NOT_FOUND
            )

        if pk == "-1":
            week = weeks.first()
        else:
            week = weeks.get(id=pk)

        weeks_serializer = WeekSerializer(weeks, many=True)

        schedules = week.schedule_set.all()

        schedule_data = []
        for schedule in schedules:
            products = schedule.products.all()
            product_serializer = ProductSerializer(products, many=True)

            # Serialize schedule along with its associated products
            schedule_data.append(
                {
                    "schedule": ScheduleSerializer(schedule).data,
                    "products": product_serializer.data,
                }
            )

        response_data = {
            "weeks": weeks_serializer.data,
            "schedule_data": schedule_data,
            "routine_name": week.name,
            "routine_id": week.id,
        }
        return Response(response_data)

    @action(detail=True, methods=["get"])
    def get_packing_list(self, request, pk=None):
        week = Week.objects.get(id=pk)
        # print(week.name)
        schedules = week.schedule_set.all()

        unique_product_data = set()
        for schedule in schedules:
            products = schedule.products.all()

            unique_product_data.update(products)
        product_serializer = ProductSerializer(unique_product_data, many=True)

        return Response({"name": week.name, "products": product_serializer.data})

    @action(detail=False, methods=["put"])
    def add_routine(self, request):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=400)

        new_week = Week.objects.create(user=user, name="New Routine")
        user.week_set.add(new_week)

        week_serializer = WeekSerializer(new_week, many=False)
        return Response(week_serializer.data)

    def partial_update(self, request, pk=None):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=400)
        new_name = request.data.get("name")

        try:
            week_to_update = user.week_set.get(id=pk)
            week_to_update.name = new_name
            week_to_update.save()
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            "Weekly schedule updated successfully.",
            status=200,
        )

    def destroy(self, request, pk=None):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=400)
        try:
            week_to_delete = user.week_set.get(id=pk)
            week_to_delete.delete()
            return Response(
                "Weekly schedule deleted successfully.",
                status=status.HTTP_204_NO_CONTENT,
            )
        except Week.DoesNotExist:
            return Response(
                "Weekly schedule not found.", status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ScheduleViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Schedule.objects.all()
        serializer = ScheduleSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Schedule.objects.all()
        schedule = get_object_or_404(queryset, pk=pk)
        serializer = ScheduleSerializer(schedule)
        return Response(serializer.data)

    @action(detail=True, methods=["get", "post", "patch"])
    def view_or_update_schedule_details(self, request, pk=None):
        schedule = Schedule.objects.get(id=pk)
        serializer = ScheduleSerializer(schedule, many=False)
        print(serializer.data)

        if request.method == "PATCH":
            # Assuming you have product data in the request
            product_id = request.data.get("product", None)
            action = request.data.get("action", None)
            if product_id is not None and action == "remove":
                product = Product(id=product_id)

                schedule.products.remove(product)
                schedule.save()

                # Serialize the updated schedule and return the response
                serializer = ScheduleSerializer(schedule)
                return Response(serializer.data)
            elif product_id is not None and action == "add":
                product = Product.objects.get(id=product_id)
                schedule.products.add(product)
                schedule.save()

                # Serialize the updated schedule and return the response
                serializer = ScheduleSerializer(schedule)
                print(serializer.data)
                return Response(serializer.data)
            else:
                # If no product data is provided in the request, return a 400 Bad Request response
                return Response(
                    {"error": "Product data is required for updating schedule"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(serializer.data)


class ProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Profile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Profile.objects.all()
        profile = get_object_or_404(queryset, pk=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def account_details(self, request):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=HTTP_401_UNAUTHORIZED)

        queryset = user.profile
        serializer = ProfileSerializer(queryset, many=False)
        return Response(serializer.data)

    @action(detail=False, methods=["put"])
    def update_account(self, request):
        user = request.user

        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=400)

        try:
            for field_name in request.data:
                setattr(user, field_name, request.data.get(field_name).strip())
            user.save()
            queryset = user.profile
            serializer = ProfileSerializer(queryset, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        queryset = user.profile

        serializer = ProfileSerializer(queryset, many=False)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def my_products(self, request):
        user = request.user
        if not isinstance(user, AnonymousUser):
            queryset = user.profile.purchased.all()
            serializer = ProductSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response("User not signed in.", status=400)

    @action(detail=False, methods=["get"])
    def get_list_products(self, request):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=HTTP_401_UNAUTHORIZED)

        list_name = request.query_params.get("list_name")
        try:
            list = getattr(user.profile, list_name)
            queryset = list.all()
            serializer = ProductSerializer(queryset, many=True)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                f"There are no lists named {list_name.capitalize()}.", status=404
            )

        return Response(list_name)

    @action(detail=False, methods=["put"])
    def add_to_list(self, request):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=400)
        list_name = request.data.get("list")
        product_pk = request.data.get("product_pk")
        product = Product.objects.get(id=product_pk)

        try:
            list_to_add = getattr(user.profile, list_name)
            if product in list_to_add.all():
                return Response(f"Already added to {list_name.capitalize()}.")
            else:
                list_to_add.add(product)
                user.profile.save()
                return Response(f"Successfully added to {list_name.capitalize()}.")
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["put"])
    def delete_from_list(self, request):
        user = request.user
        if isinstance(user, AnonymousUser):
            return Response("User not signed in.", status=400)
        list_name = request.data.get("list")
        product_pk = request.data.get("product_pk")
        product = Product.objects.get(id=product_pk)

        try:
            list = getattr(user.profile, list_name)
            if product in list.all():
                list.remove(product)
                user.profile.save()
                queryset = list.all()
                serializer = ProductSerializer(queryset, many=True)
                return Response(serializer.data)

        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
