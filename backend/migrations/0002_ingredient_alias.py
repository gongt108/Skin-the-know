# Generated by Django 5.0.2 on 2024-03-18 17:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="ingredient",
            name="alias",
            field=models.CharField(max_length=255, null=True),
        ),
    ]
