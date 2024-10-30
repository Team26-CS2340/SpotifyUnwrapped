from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Spotify Account Info
    spotify_user_id = models.CharField(max_length=255, null=True, blank=True)
    spotify_display_name = models.CharField(max_length=255, null=True, blank=True)
    spotify_email = models.EmailField(null=True, blank=True)
    spotify_country = models.CharField(max_length=10, null=True, blank=True)
    spotify_product = models.CharField(max_length=50, null=True, blank=True)  # premium, free, etc.
    
    # Spotify Authentication
    spotify_access_token = models.CharField(max_length=255, null=True, blank=True)
    spotify_refresh_token = models.CharField(max_length=255, null=True, blank=True)
    spotify_token_expires = models.DateTimeField(null=True, blank=True)
    
    # Spotify Stats (Updated on login)
    total_spotify_minutes = models.IntegerField(default=0)
    top_artists = models.JSONField(default=dict, null=True, blank=True)
    top_tracks = models.JSONField(default=dict, null=True, blank=True)
    top_genres = models.JSONField(default=dict, null=True, blank=True)
    recently_played = models.JSONField(default=dict, null=True, blank=True)
    favorite_artists_count = models.IntegerField(default=0)
    saved_tracks_count = models.IntegerField(default=0)
    saved_albums_count = models.IntegerField(default=0)
    playlist_count = models.IntegerField(default=0)
    
    # Additional Metadata
    last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_data_update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Spotify User: {self.spotify_display_name or self.user.username}"

class SpotifyWrapHistory(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    wrap_data = models.JSONField()
    year = models.IntegerField()
    
    # Additional wrap-specific fields
    time_range = models.CharField(max_length=20, default='long_term')  # short_term, medium_term, long_term
    included_genres = models.JSONField(default=list)
    listening_minutes = models.IntegerField(default=0)
    unique_artists_count = models.IntegerField(default=0)
    unique_tracks_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user_profile.spotify_display_name}'s Wrap - {self.year}"