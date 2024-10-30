# Generated by Django 5.1.2 on 2024-10-30 19:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="UserProfile",
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
                ("spotify_user_id", models.CharField(max_length=255)),
                ("spotify_display_name", models.CharField(max_length=255)),
                ("spotify_email", models.EmailField(max_length=254, unique=True)),
                ("spotify_country", models.CharField(max_length=10)),
                ("spotify_product", models.CharField(max_length=50)),
                ("spotify_access_token", models.CharField(max_length=255)),
                ("spotify_refresh_token", models.CharField(max_length=255)),
                ("spotify_token_expires", models.DateTimeField()),
                ("total_spotify_minutes", models.IntegerField(default=0)),
                ("top_artists", models.JSONField(default=dict)),
                ("top_tracks", models.JSONField(default=dict)),
                ("top_genres", models.JSONField(default=dict)),
                ("recently_played", models.JSONField(default=dict)),
                ("favorite_artists_count", models.IntegerField(default=0)),
                ("saved_tracks_count", models.IntegerField(default=0)),
                ("saved_albums_count", models.IntegerField(default=0)),
                ("playlist_count", models.IntegerField(default=0)),
                ("last_login", models.DateTimeField(auto_now=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("last_data_update", models.DateTimeField(null=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SpotifyWrapHistory",
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
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("wrap_data", models.JSONField()),
                ("year", models.IntegerField()),
                ("time_range", models.CharField(default="long_term", max_length=20)),
                ("included_genres", models.JSONField(default=list)),
                ("listening_minutes", models.IntegerField(default=0)),
                ("unique_artists_count", models.IntegerField(default=0)),
                ("unique_tracks_count", models.IntegerField(default=0)),
                (
                    "user_profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="mainapp.userprofile",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
