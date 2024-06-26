# Generated by Django 5.0.2 on 2024-04-23 04:37

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0023_review"),
    ]

    operations = [
        migrations.AlterField(
            model_name="review",
            name="rating",
            field=models.IntegerField(
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(5),
                ]
            ),
        ),
    ]
