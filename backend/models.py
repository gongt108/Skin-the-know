from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, null=True, blank=True)
    good_list = models.ManyToManyField(
        "self", symmetrical=False, related_name="good_for", blank=True
    )
    avoid_list = models.ManyToManyField("self", symmetrical=True, blank=True)
    caution_list = models.ManyToManyField("self", symmetrical=True, blank=True)
    incidecoder_url = models.URLField(unique=True, default="/")
    img_url = models.URLField(null=True, blank=True)


class Brand(models.Model):
    name = models.CharField(max_length=100)
    img_url = models.CharField(max_length=255, null=True, blank=True)
    slug = models.CharField(max_length=255, blank=True, editable=True, null=True)

    def save(self, *args, **kwargs):
        # Generate unique identifier using brand name and product name
        if not self.slug:
            self.slug = self.generate_slug()
        super().save(*args, **kwargs)

    def generate_slug(self):
        brand_slug = slugify(self.name)
        return brand_slug.lower()


class Product(models.Model):
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    ingredients = models.ManyToManyField(Ingredient, blank=True)
    main_active = models.ManyToManyField(
        Ingredient,
        related_name="main_active",
        blank=True,
    )
    img_url = models.CharField(max_length=255, null=True)
    incidecoder_url = models.URLField(null=True)
    product_link = models.URLField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, null=True, blank=True, default=0.0
    )
    num_reviews = models.IntegerField(default=0)
    unique_identifier = models.CharField(
        max_length=255, blank=True, editable=False, unique=True
    )

    def save(self, *args, **kwargs):
        # Generate unique identifier using brand name and product name
        if not self.unique_identifier:
            self.unique_identifier = self.generate_unique_identifier()
        super().save(*args, **kwargs)

    def generate_unique_identifier(self):
        brand_name_slug = slugify(self.brand.name)
        product_name_slug = slugify(self.name)
        return f"{brand_name_slug}-{product_name_slug}"


class SkinConcern(models.Model):
    name = models.CharField(max_length=100)
    slugified_name = models.CharField(max_length=100, blank=True)
    ingredients = models.ManyToManyField(Ingredient, blank=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # image = models.ImageField(default="default.jpg", upload_to="profile_pic")
    img_url = models.CharField(
        default="https://png.pngtree.com/background/20230519/original/pngtree-girl-reading-books-in-a-picture-picture-image_2658551.jpg"
    )
    own_list = models.ManyToManyField(Product, blank=True, related_name="own_list")
    wishlist = models.ManyToManyField(Product, blank=True, related_name="wishlist")


class Schedule(models.Model):
    WEEKDAYS = [
        ("Sunday", "Sunday"),
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
    ]

    WEEK_TIMES = [
        ("AM", "AM"),
        ("PM", "PM"),
    ]

    week = models.ForeignKey("Week", on_delete=models.CASCADE, null=True)
    products = models.ManyToManyField(
        Product, blank=True, related_name="schedule_product"
    )
    day = models.CharField(max_length=10, choices=WEEKDAYS, default="Sunday")
    time = models.CharField(max_length=2, choices=WEEK_TIMES, default="AM")


class Week(models.Model):
    name = models.CharField(max_length=255, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        super().save(
            *args, **kwargs
        )  # Call the original save method to save the Week instance

        # Iterate over each weekday and time combination
        for day, _ in Schedule.WEEKDAYS:
            for time, _ in Schedule.WEEK_TIMES:
                # Create a Schedule instance for the current combination
                Schedule.objects.create(week=self, day=day, time=time)
