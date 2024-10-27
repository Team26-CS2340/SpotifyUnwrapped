from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    spotify_user_id = models.CharField(max_length=255, null=True, blank=True)
    wrap_summary = models.JSONField(null=True, blank=True)
    last_generated_wrap_date = models.DateTimeField(null=True, blank=True)
    wrap_display_name = models.CharField(max_length=255, null=True, blank=True)
    total_spotify_minutes = models.IntegerField(null=True, blank=True)
    top_artists = models.TextField(null=True, blank=True)
    top_genres = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.username
