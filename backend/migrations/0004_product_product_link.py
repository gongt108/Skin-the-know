# Generated by Django 5.0.2 on 2024-03-18 17:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0003_alter_ingredient_alias_alter_ingredient_img_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="product_link",
            field=models.URLField(blank=True, null=True),
        ),
    ]
