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
        for artist in artists[:10]:
            html += f"<li>{artist.get('name', 'Unknown')} - Genres: {', '.join(artist.get('genres', []))}</li>"
        html += "</ol>"
        return format_html(html)
    top_artists_display.short_description = 'Top Artists'

    def top_tracks_display(self, obj):
        if not obj.top_tracks or 'items' not in obj.top_tracks:
            return "No data available"
        tracks = obj.top_tracks.get('items', [])
        html = "<ol>"
        for track in tracks[:10]:
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
        for item in tracks[:10]:
            track = item.get('track', {})
            artists = ', '.join([artist.get('name', '') for artist in track.get('artists', [])])
            played_at = item.get('played_at', 'Unknown time')
            html += f"<li>{track.get('name', 'Unknown')} - {artists}<br/><small>Played at: {played_at}</small></li>"
        html += "</ol>"
        return format_html(html)
    recently_played_display.short_description = 'Recently Played'

@admin.register(SpotifyWrapHistory)
class SpotifyWrapHistoryAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'year', 'created_at')
    list_filter = ('year',)
    search_fields = ('user_profile__spotify_display_name',)
    readonly_fields = ('wrap_content_display', 'created_at')

    fieldsets = (
        ('Basic Info', {
            'fields': (
                'user_profile',
                'year',
                'created_at',
            )
        }),
        ('Wrap Content', {
            'fields': (
                'wrap_content_display',
            )
        }),
        ('Raw Data', {
            'fields': (
                'top_artists',
                'top_artist',
                'top_albums',
                'top_album',
                'top_tracks',
                'top_track',
                'top_followed_artists',
                'top_genres',
            ),
            'classes': ('collapse',)
        })
    )

    def wrap_content_display(self, obj):
        try:
            html = "<div style='margin-bottom: 20px;'>"
            
            # Top Artist
            html += "<h3>Top Artist</h3>"
            if isinstance(obj.top_artist, dict):
                html += f"<p>Artist: {obj.top_artist.get('name', 'Unknown')}</p>"
                if obj.top_artist.get('genres'):
                    html += f"<p>Genres: {', '.join(obj.top_artist.get('genres', []))}</p>"
            
            # Top Album
            html += "<h3>Top Album</h3>"
            if isinstance(obj.top_album, dict):
                html += f"<p>Album: {obj.top_album.get('name', 'Unknown')}</p>"
                if obj.top_album.get('artists'):
                    artist_names = [artist.get('name', 'Unknown') for artist in obj.top_album.get('artists', [])]
                    html += f"<p>Artists: {', '.join(artist_names)}</p>"
            
            # Top Track
            html += "<h3>Top Track</h3>"
            if isinstance(obj.top_track, dict):
                html += f"<p>Track: {obj.top_track.get('name', 'Unknown')}</p>"
                if obj.top_track.get('artists'):
                    artist_names = [artist.get('name', 'Unknown') for artist in obj.top_track.get('artists', [])]
                    html += f"<p>Artists: {', '.join(artist_names)}</p>"
            
            # Top Artists
            html += "<h3>Top Artists</h3><ol>"
            if isinstance(obj.top_artists, dict) and 'items' in obj.top_artists:
                for artist in obj.top_artists['items'][:5]:
                    html += f"<li>{artist.get('name', 'Unknown')}"
                    if artist.get('genres'):
                        html += f" - Genres: {', '.join(artist.get('genres', []))}"
                    html += "</li>"
            html += "</ol>"
            
            # Top Genres
            html += "<h3>Top Genres</h3><ul>"
            if isinstance(obj.top_genres, list):
                for genre_data in obj.top_genres[:5]:
                    if isinstance(genre_data, dict):
                        html += f"<li>{genre_data.get('name', 'Unknown')} ({genre_data.get('count', 0)} occurrences)</li>"
                    else:
                        html += f"<li>{genre_data}</li>"
            html += "</ul>"
            
            # Followed Artists
            html += "<h3>Top Followed Artists</h3><ol>"
            if isinstance(obj.top_followed_artists, dict) and 'artists' in obj.top_followed_artists:
                for artist in obj.top_followed_artists['artists'].get('items', [])[:5]:
                    html += f"<li>{artist.get('name', 'Unknown')}</li>"
            html += "</ol>"
            
            html += "</div>"
            return format_html(html)
        except Exception as e:
            return format_html(f"<div class='error'>Error displaying wrap content: {str(e)}</div>")
    wrap_content_display.short_description = 'Wrap Content Summary'