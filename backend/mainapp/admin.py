from django.contrib import admin
from django.utils.html import format_html
from .models import UserProfile, SpotifyWrapHistory

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('spotify_display_name', 'spotify_email', 'spotify_product', 'saved_tracks_count', 'last_data_update')
    search_fields = ('spotify_display_name', 'spotify_email')
    readonly_fields = ('top_artists_display', 'top_tracks_display', 'recently_played_display', 'created_at', 'last_data_update')
    fieldsets = (
        ('User Info', {
            'fields': (
                'user',
                'spotify_display_name',
                'spotify_email',
                'spotify_country',
                'spotify_product',
            )
        }),
        ('Authentication', {
            'fields': (
                'spotify_access_token',
                'spotify_refresh_token',
                'spotify_token_expires',
            )
        }),
        ('Statistics', {
            'fields': (
                'saved_tracks_count',
                'saved_albums_count',
                'playlist_count',
                'total_spotify_minutes',
            )
        }),
        ('Top Content', {
            'fields': (
                'top_artists_display',
                'top_tracks_display',
                'recently_played_display',
            )
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'last_data_update',
            )
        }),
    )

    def top_artists_display(self, obj):
        if not obj.top_artists or 'items' not in obj.top_artists:
            return "No data available"
        artists = obj.top_artists.get('items', [])
        html = "<ol>"
        for artist in artists[:10]:  # Show top 10
            html += f"<li>{artist.get('name', 'Unknown')} - Genres: {', '.join(artist.get('genres', []))}</li>"
        html += "</ol>"
        return format_html(html)
    top_artists_display.short_description = 'Top Artists'

    def top_tracks_display(self, obj):
        if not obj.top_tracks or 'items' not in obj.top_tracks:
            return "No data available"
        tracks = obj.top_tracks.get('items', [])
        html = "<ol>"
        for track in tracks[:10]:  # Show top 10
            artists = ', '.join([artist.get('name', '') for artist in track.get('artists', [])])
            html += f"<li>{track.get('name', 'Unknown')} - {artists}</li>"
        html += "</ol>"
        return format_html(html)
    top_tracks_display.short_description = 'Top Tracks'

    def recently_played_display(self, obj):
        if not obj.recently_played or 'items' not in obj.recently_played:
            return "No data available"
        tracks = obj.recently_played.get('items', [])
        html = "<ol>"
        for item in tracks[:10]:  # Show last 10
            track = item.get('track', {})
            artists = ', '.join([artist.get('name', '') for artist in track.get('artists', [])])
            played_at = item.get('played_at', 'Unknown time')
            html += f"<li>{track.get('name', 'Unknown')} - {artists}<br/><small>Played at: {played_at}</small></li>"
        html += "</ol>"
        return format_html(html)
    recently_played_display.short_description = 'Recently Played'

@admin.register(SpotifyWrapHistory)
class SpotifyWrapHistoryAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'year', 'time_range', 'listening_minutes', 'created_at')
    list_filter = ('year', 'time_range')
    search_fields = ('user_profile__spotify_display_name',)