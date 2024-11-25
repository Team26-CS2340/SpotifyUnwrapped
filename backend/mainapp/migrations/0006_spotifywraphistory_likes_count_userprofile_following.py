# Generated by Django 5.1.2 on 2024-11-24 19:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mainapp", "0005_wraplike"),
    ]

    operations = [
        migrations.AddField(
            model_name="spotifywraphistory",
            name="likes_count",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="following",
            field=models.ManyToManyField(
                blank=True, related_name="followers", to="mainapp.userprofile"
            ),
        ),
    ]