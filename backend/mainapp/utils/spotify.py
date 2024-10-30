import os
import base64
import requests
from urllib.parse import urlencode
from datetime import datetime, timedelta

from django.conf import settings

class SpotifyAPI:
    def __init__(self):
        self.client_id = settings.SPOTIFY_CLIENT_ID
        self.client_secret = settings.SPOTIFY_CLIENT_SECRET
        self.redirect_uri = settings.SPOTIFY_REDIRECT_URI
        self.auth_url = 'https://accounts.spotify.com/authorize'
        self.token_url = 'https://accounts.spotify.com/api/token'
        self.base_url = 'https://api.spotify.com/v1'

    def get_auth_url(self, state=None):
        """Generate the Spotify authorization URL"""
        scope = ' '.join([
            'user-read-private',
            'user-read-email',
            'user-top-read',
            'user-read-recently-played',
            'user-library-read',
            'playlist-read-private',
            'user-read-playback-state'
        ])
        
        params = {
            'client_id': self.client_id,
            'response_type': 'code',
            'redirect_uri': self.redirect_uri,
            'scope': scope,
        }
        
        if state:
            params['state'] = state
            
        return f"{self.auth_url}?{urlencode(params)}"

    def get_access_token(self, code):
        """Exchange authorization code for access token"""
        auth_header = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        
        headers = {
            'Authorization': f'Basic {auth_header}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.redirect_uri
        }
        
        print("Attempting to get access token with data:", data)
        response = requests.post(self.token_url, headers=headers, data=data)
        print("Token response status:", response.status_code)
        print("Token response:", response.text)
        
        if response.status_code != 200:
            raise Exception(f"Failed to get access token: {response.text}")
        
        token_data = response.json()
        print("Parsed token data:", token_data)  # Debug print
        return token_data

    def refresh_token(self, refresh_token):
        """Refresh an expired access token"""
        auth_header = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        
        headers = {
            'Authorization': f'Basic {auth_header}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        
        response = requests.post(self.token_url, headers=headers, data=data)
        return response.json()

    def get_user_top_items(self, access_token, item_type, time_range='medium_term', limit=20):
        """Get user's top artists or tracks"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{self.base_url}/me/top/{item_type}",
            headers=headers,
            params={'time_range': time_range, 'limit': limit}
        )
        return response.json()

    def get_recently_played(self, access_token, limit=50):
        """Get user's recently played tracks"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{self.base_url}/me/player/recently-played",
            headers=headers,
            params={'limit': limit}
        )
        return response.json()

    def get_saved_tracks_count(self, access_token):
        """Get the total number of user's saved tracks"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f"{self.base_url}/me/tracks", headers=headers)
        return response.json().get('total', 0)

    def get_saved_albums_count(self, access_token):
        """Get the total number of user's saved albums"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f"{self.base_url}/me/albums", headers=headers)
        return response.json().get('total', 0)

    def get_playlists_count(self, access_token):
        """Get the total number of user's playlists"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f"{self.base_url}/me/playlists", headers=headers)
        return response.json().get('total', 0)
    
    def get_user_profile(self, access_token):
        """Get the user's Spotify profile"""
        headers = {'Authorization': f'Bearer {access_token}'}
        print("Getting user profile with token:", access_token[:20] + "...")  # Debug print

        response = requests.get(f"{self.base_url}/me", headers=headers)
        print("Profile response status:", response.status_code)  # Debug print
        print("Profile response:", response.text)  # Debug print

        if response.status_code != 200:
            raise Exception(f"Failed to get user profile: {response.text}")

        try:
            return response.json()
        except Exception as e:
            print(f"Error parsing profile response: {str(e)}")
            raise