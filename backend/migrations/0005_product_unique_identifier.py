# Generated by Django 5.0.2 on 2024-03-19 02:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0004_product_product_link"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="unique_identifier",
            field=models.CharField(blank=True, editable=False, max_length=255),
        ),
    ]
