# Generated by Django 5.0.2 on 2024-03-31 19:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0019_skinconcern_slugified_name"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name="schedule",
            name="user",
        ),
        migrations.AddField(
            model_name="schedule",
            name="day",
            field=models.CharField(
                choices=[
                    ("Sunday", "Sunday"),
                    ("Monday", "Monday"),
                    ("Tuesday", "Tuesday"),
                    ("Wednesday", "Wednesday"),
                    ("Thursday", "Thursday"),
                    ("Friday", "Friday"),
                    ("Saturday", "Saturday"),
                ],
                default="Sunday",
                max_length=10,
            ),
        ),
        migrations.AlterField(
            model_name="schedule",
            name="time",
            field=models.CharField(
                choices=[("AM", "AM"), ("PM", "PM")], default="AM", max_length=2
            ),
        ),
        migrations.CreateModel(
            name="Week",
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
                ("name", models.CharField(blank=True, max_length=255)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="schedule",
            name="week",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="backend.week",
            ),
        ),
    ]