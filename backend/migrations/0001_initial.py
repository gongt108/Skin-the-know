# Generated by Django 5.0.2 on 2024-03-14 08:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Brand",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("img_url", models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="SkinConcern",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Ingredient",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("incidecoder_url", models.URLField(null=True)),
                ("img_url", models.URLField(null=True)),
                (
                    "avoid_list",
                    models.ManyToManyField(
                        blank=True, related_name="to_avoid", to="backend.ingredient"
                    ),
                ),
                (
                    "caution_list",
                    models.ManyToManyField(
                        blank=True,
                        related_name="use_with_caution",
                        to="backend.ingredient",
                    ),
                ),
                (
                    "good_list",
                    models.ManyToManyField(
                        blank=True, related_name="good_for", to="backend.ingredient"
                    ),
                ),
                (
                    "skin_concern",
                    models.ManyToManyField(blank=True, to="backend.skinconcern"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("img_url", models.CharField(max_length=255, null=True)),
                ("incidecoder_url", models.URLField(null=True)),
                (
                    "brand",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="backend.brand",
                    ),
                ),
                (
                    "ingredients",
                    models.ManyToManyField(blank=True, to="backend.ingredient"),
                ),
                (
                    "main_active",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="main_active",
                        to="backend.ingredient",
                    ),
                ),
                (
                    "skin_concern",
                    models.ManyToManyField(blank=True, to="backend.skinconcern"),
                ),
            ],
        ),
    ]