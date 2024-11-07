import os
import base64
import requests
from urllib.parse import urlencode
import logging
from datetime import datetime, timedelta
from django.conf import settings

logger = logging.getLogger(__name__)

class SpotifyAPI:
    def __init__(self):
        self.client_id = settings.SPOTIFY_CLIENT_ID
        self.client_secret = settings.SPOTIFY_CLIENT_SECRET
        self.redirect_uri = settings.SPOTIFY_REDIRECT_URI
        self.auth_url = 'https://accounts.spotify.com/authorize'
        self.token_url = 'https://accounts.spotify.com/api/token'
        self.base_url = 'https://api.spotify.com/v1'
        self.scope = ' '.join([
            'user-read-private',
            'user-read-email',
            'user-top-read',
            'user-library-read',
            'user-read-recently-played',
            'playlist-read-private',
            'user-read-playback-state',
            'user-follow-read'
        ])

    def get_auth_url(self, state=None):
        """Generate the Spotify authorization URL"""
        params = {
            'client_id': self.client_id,
            'response_type': 'code',
            'redirect_uri': self.redirect_uri,
            'scope': self.scope,  # Fixed: was using undefined 'scope' variable
            'show_dialog': True   # Added to force scope approval
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
            'redirect_uri': self.redirect_uri,
            'scope': self.scope  # Added scope to token request
        }
        
        logger.info("Attempting to get access token with data: %s", data)
        response = requests.post(self.token_url, headers=headers, data=data)
        logger.info("Token response status: %s", response.status_code)
        logger.info("Token response: %s", response.text)
        
        if response.status_code != 200:
            raise Exception(f"Failed to get access token: {response.text}")
        
        token_data = response.json()
        logger.info("Parsed token data: %s", token_data)
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
            'refresh_token': refresh_token,
            'scope': self.scope  # Added scope to refresh request
        }
        
        response = requests.post(self.token_url, headers=headers, data=data)
        if response.status_code != 200:
            logger.error("Token refresh failed: %s", response.text)
            raise Exception(f"Failed to refresh token: {response.text}")
        return response.json()

    def get_user_profile(self, access_token):
        """Get the user's Spotify profile"""
        headers = {'Authorization': f'Bearer {access_token}'}
        logger.info("Getting user profile with token: %s...", access_token[:20])

        response = requests.get(f"{self.base_url}/me", headers=headers)
        logger.info("Profile response status: %s", response.status_code)
        logger.info("Profile response: %s", response.text)

        if response.status_code != 200:
            raise Exception(f"Failed to get user profile: {response.text}")

        return response.json()

    def get_user_top_items(self, access_token, item_type, time_range='medium_term', limit=20):
        """Get user's top artists or tracks"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{self.base_url}/me/top/{item_type}",
            headers=headers,
            params={'time_range': time_range, 'limit': limit}
        )
        
        if response.status_code != 200:
            logger.error("Failed to get top %s: %s", item_type, response.text)
            return {'items': []}
        return response.json()

    def get_recently_played(self, access_token, limit=50):
        """Get user's recently played tracks"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{self.base_url}/me/player/recently-played",
            headers=headers,
            params={'limit': limit}
        )
        
        if response.status_code != 200:
            logger.error("Failed to get recently played: %s", response.text)
            return {'items': []}
        return response.json()

    def get_saved_tracks_count(self, access_token):
        """Get the total number of user's saved tracks"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f"{self.base_url}/me/tracks", headers=headers)
        
        if response.status_code != 200:
            logger.error("Failed to get saved tracks count: %s", response.text)
            return 0
        return response.json().get('total', 0)

    def get_saved_albums_count(self, access_token):
        """Get the total number of user's saved albums"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f"{self.base_url}/me/albums", headers=headers)
        
        if response.status_code != 200:
            logger.error("Failed to get saved albums count: %s", response.text)
            return 0
        return response.json().get('total', 0)

    def get_playlists_count(self, access_token):
        """Get the total number of user's playlists"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f"{self.base_url}/me/playlists", headers=headers)
        
        if response.status_code != 200:
            logger.error("Failed to get playlists count: %s", response.text)
            return 0
        return response.json().get('total', 0)
    
    def get_user_saved_albums(self, access_token, limit=20):
        """Get user's saved albums"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f'{self.base_url}/me/albums',
            headers=headers,
            params={'limit': limit}
        )
        
        if response.status_code != 200:
            logger.error("Failed to get saved albums: %s", response.text)
            return {'items': []}
        return response.json()

    def get_followed_artists(self, access_token, limit=5):
        """Get user's followed artists"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f'{self.base_url}/me/following',
            headers=headers,
            params={
                'type': 'artist',
                'limit': limit
            }
        )
        
        if response.status_code != 200:
            logger.error("Failed to get followed artists: %s", response.text)
            return {'artists': {'items': [], 'total': 0}}
            
        data = response.json()
        # Ensure we have the expected structure
        if 'artists' not in data:
            logger.error("Unexpected response structure for followed artists: %s", data)
            return {'artists': {'items': [], 'total': 0}}
            
        return data