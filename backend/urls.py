from django.urls import path, include
from rest_framework import routers
from . import views

# Create a router and register our viewsets with it.
router = routers.DefaultRouter()
router.register(r"products", views.ProductViewSet, basename="product")
router.register(r"ingredients", views.IngredientViewSet, basename="ingredient")
router.register(r"brands", views.BrandViewSet, basename="brand")
router.register(r"skinconcern", views.SkinConcernViewSet, basename="skinconcern")
router.register(r"weekly_schedule", views.WeekViewSet, basename="week")
router.register(r"schedule", views.ScheduleViewSet, basename="schedule")
router.register(r"profile", views.ProfileViewSet, basename="profile")

urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("hello-world/", views.hello_world, name="hello_world"),
    path("login/", views.login_view, name="api-login"),
    path("register/", views.register_view, name="api-register"),
    path("logout/", views.logout_view, name="api-logout"),
    path("session/", views.session_view, name="api-session"),
    path("whoami/", views.whoami_view, name="api-whoami"),
    # path("allproducts/", views.get_all_products, name="get_all_products"),
    # path("ingredients_list/", views.get_all_ingredients, name="get_ingredients_list"),
    path(
        "product/<str:unique_identifier>",
        views.get_product_data,
        name="get_product_data",
    ),
]
