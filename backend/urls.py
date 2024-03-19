from django.urls import path
from . import views

urlpatterns = [
    path("hello-world/", views.hello_world, name="hello_world"),
    path("login/", views.login_view, name="api-login"),
    path("register/", views.register_view, name="api-register"),
    path("logout/", views.logout_view, name="api-logout"),
    path("session/", views.session_view, name="api-session"),
    path("whoami/", views.whoami_view, name="api-whoami"),
    path("allproducts/", views.get_all_products, name="get_all_products"),
    path(
        "product/<str:unique_identifier>",
        views.get_product_data,
        name="get_product_data",
    ),
]
