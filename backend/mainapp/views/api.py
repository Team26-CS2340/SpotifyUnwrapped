from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import redirect
from ..models import UserProfile
from django.contrib.auth import login
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
import secrets
import logging
import json
from ..utils.spotify import SpotifyAPI
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

# Store state in memory (for testing only - should use session/cache in production)
STATE_STORE = {}


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_personality_analysis(request):
    try:
        profile = request.user.userprofile
        
        # Configure Gemini
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-pro')
        
        # Prepare the data for Gemini
        music_data = {
            'top_artists': [],
            'top_genres': set(),
            'top_tracks': []
        }
        
        # Extract top artists and their genres
        if profile.top_artists and 'items' in profile.top_artists:
            for artist in profile.top_artists['items'][:10]:  # Top 10 artists
                music_data['top_artists'].append(artist['name'])
                if 'genres' in artist:
                    music_data['top_genres'].update(artist['genres'])
        
        # Extract top tracks
        if profile.top_tracks and 'items' in profile.top_tracks:
            for track in profile.top_tracks['items'][:10]:  # Top 10 tracks
                artist_names = [artist['name'] for artist in track['artists']]
                music_data['top_tracks'].append({
                    'name': track['name'],
                    'artists': artist_names
                })
        
        # Craft the prompt for Gemini
        prompt = f"""
        Based on this person's music taste, create a fun and creative personality profile. 
        Here's their music data:

        Top Artists: {', '.join(music_data['top_artists'])}
        
        Common Genres: {', '.join(list(music_data['top_genres'])[:10])}
        
        Top Tracks: {', '.join([f"{track['name']} by {', '.join(track['artists'])}" for track in music_data['top_tracks']])}

        Please provide a creative analysis that includes:
        1. Likely personality traits and general vibe
        2. Probable fashion style and aesthetic preferences
        3. Potential hobbies and interests
        4. Social characteristics and friend group dynamics
        5. What their ideal weekend might look like

        Keep the tone light, fun, and engaging. Be specific but not stereotypical. 
        Format the response in a clear, readable way with sections.
        """

        # Generate the analysis
        response = model.generate_content(prompt)
        
        # Return the analysis
        return Response({
            'analysis': response.text,
            'music_data': {
                'top_artists': music_data['top_artists'],
                'top_genres': list(music_data['top_genres']),
                'top_tracks': [f"{track['name']} by {', '.join(track['artists'])}" for track in music_data['top_tracks']]
            }
        })
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in personality analysis: {str(e)}")  # For debugging
        return Response({
            'error': 'Failed to generate personality analysis',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def spotify_login(request):
    spotify = SpotifyAPI()
    state = secrets.token_urlsafe(16)
    STATE_STORE['state'] = state
    auth_url = spotify.get_auth_url(state=state)
    return redirect(auth_url)

@api_view(['GET'])
@permission_classes([AllowAny])
def spotify_callback(request):
    error = request.GET.get('error')
    if error:
        logger.error(f"Error from Spotify: {error}")
        return redirect(f'http://localhost:3000?error={error}')
    
    code = request.GET.get('code')
    state = request.GET.get('state')
    
    if state != STATE_STORE.get('state'):
        logger.error("State mismatch")
        return redirect('http://localhost:3000?error=invalid_state')
    
    spotify = SpotifyAPI()
    
    try:
        logger.info("Getting access token...")
        token_info = spotify.get_access_token(code)
        access_token = token_info.get('access_token')
        refresh_token = token_info.get('refresh_token')
        expires_in = token_info.get('expires_in', 3600)
        
        logger.info("Getting user profile...")
        user_profile = spotify.get_user_profile(access_token)
        
        # Get or create User
        spotify_email = user_profile.get('email')
        spotify_id = user_profile.get('id')
        
        try:
            user = User.objects.get(email=spotify_email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=spotify_id,
                email=spotify_email
            )
        
        # Get or create UserProfile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Update profile with Spotify data
        profile.spotify_user_id = spotify_id
        profile.spotify_display_name = user_profile.get('display_name')
        profile.spotify_email = spotify_email
        profile.spotify_country = user_profile.get('country')
        profile.spotify_product = user_profile.get('product')
        profile.spotify_access_token = access_token
        profile.spotify_refresh_token = refresh_token
        profile.spotify_token_expires = timezone.now() + timedelta(seconds=expires_in)
        
        # Fetch initial Spotify data
        try:
            logger.info("Fetching initial Spotify data...")
            profile.top_artists = spotify.get_user_top_items(access_token, 'artists', limit=20)
            profile.top_tracks = spotify.get_user_top_items(access_token, 'tracks', limit=20)
            profile.recently_played = spotify.get_recently_played(access_token, limit=50)
            profile.saved_tracks_count = spotify.get_saved_tracks_count(access_token)
            profile.saved_albums_count = spotify.get_saved_albums_count(access_token)
            profile.playlist_count = spotify.get_playlists_count(access_token)
            profile.last_data_update = timezone.now()
        except Exception as e:
            logger.error(f"Error fetching initial Spotify data: {str(e)}")
        
        profile.save()
        
        # Log the user in
        login(request, user)
        logger.info("Successfully logged in user, redirecting to dashboard...")
        return redirect('http://localhost:3000/dashboard')
        
    except Exception as e:
        logger.error(f"Error in callback: {str(e)}")
        return redirect(f'http://localhost:3000?error={str(e)}')

@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_current_user_data(request):
    try:
        profile = request.user.userprofile
        
        # Check if token needs refresh
        if profile.spotify_token_expires and profile.spotify_token_expires <= timezone.now():
            spotify = SpotifyAPI()
            try:
                new_token_info = spotify.refresh_token(profile.spotify_refresh_token)
                profile.spotify_access_token = new_token_info['access_token']
                if 'refresh_token' in new_token_info:
                    profile.spotify_refresh_token = new_token_info['refresh_token']
                profile.spotify_token_expires = timezone.now() + timedelta(seconds=new_token_info['expires_in'])
                profile.save()
            except Exception as e:
                return Response({
                    'error': 'Token refresh failed',
                    'detail': str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
            },
            'spotify_profile': {
                'display_name': profile.spotify_display_name,
                'spotify_id': profile.spotify_user_id,
                'country': profile.spotify_country,
                'product': profile.spotify_product,
            },
            'spotify_data': {
                'top_artists': profile.top_artists,
                'top_tracks': profile.top_tracks,
                'recently_played': profile.recently_played,
                'saved_tracks_count': profile.saved_tracks_count,
                'saved_albums_count': profile.saved_albums_count,
                'playlist_count': profile.playlist_count,
            },
            'metadata': {
                'last_updated': profile.last_data_update,
                'token_expires': profile.spotify_token_expires,
            }
        })
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def refresh_spotify_data(request):
    try:
        profile = request.user.userprofile
        spotify = SpotifyAPI()
        
        # Check if token needs refresh
        if profile.spotify_token_expires and profile.spotify_token_expires <= timezone.now():
            try:
                new_token_info = spotify.refresh_token(profile.spotify_refresh_token)
                profile.spotify_access_token = new_token_info['access_token']
                if 'refresh_token' in new_token_info:
                    profile.spotify_refresh_token = new_token_info['refresh_token']
                profile.spotify_token_expires = timezone.now() + timedelta(seconds=new_token_info['expires_in'])
                profile.save()
            except Exception as e:
                return Response({
                    'error': 'Token refresh failed',
                    'detail': str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get fresh data from Spotify
        access_token = profile.spotify_access_token
        
        # Update user's Spotify data
        profile.top_artists = spotify.get_user_top_items(access_token, 'artists', limit=20)
        profile.top_tracks = spotify.get_user_top_items(access_token, 'tracks', limit=20)
        profile.recently_played = spotify.get_recently_played(access_token, limit=50)
        profile.saved_tracks_count = spotify.get_saved_tracks_count(access_token)
        profile.saved_albums_count = spotify.get_saved_albums_count(access_token)
        profile.playlist_count = spotify.get_playlists_count(access_token)
        profile.last_data_update = timezone.now()
        profile.save()
        
        return Response({
            'message': 'Spotify data refreshed successfully',
            'last_updated': profile.last_data_update
        })
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)