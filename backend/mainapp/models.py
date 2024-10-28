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
    spotify_access_token = models.CharField(max_length=255, null=True, blank=True)
    spotify_refresh_token = models.CharField(max_length=255, null=True, blank=True)
    spotify_token_expires = models.DateTimeField(null=True, blank=True)

class SpotifyWrapHistory(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    wrap_data = models.JSONField()  # Store complete wrap data
    year = models.IntegerField()
    
    class Meta:
        ordering = ['-created_at']  

    def __str__(self):
        return self.user.username
