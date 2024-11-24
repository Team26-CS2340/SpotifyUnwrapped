from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import redirect
from ..models import UserProfile, SpotifyWrapHistory, WrapLike
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
from django.shortcuts import get_object_or_404
import os
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import send_mail
from django.conf import settings
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
            
            # Get top artists and extract genres
            top_artists_data = spotify.get_user_top_items(access_token, 'artists', limit=20)
            profile.top_artists = top_artists_data
            
            # Process genres
            genres_list = []
            for artist in top_artists_data.get('items', []):
                genres_list.extend(artist.get('genres', []))
            
            # Count genres and create structured data
            genre_counts = {}
            for genre in genres_list:
                genre_counts[genre] = genre_counts.get(genre, 0) + 1
            
            # Convert to sorted list of dicts
            sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
            profile.top_genres = {
                'items': [
                    {'name': genre, 'count': count} 
                    for genre, count in sorted_genres
                ]
            }
            
            # Get followed artists
            followed_artists_data = spotify.get_followed_artists(access_token)
            profile.favorite_artists_count = followed_artists_data.get('artists', {}).get('total', 0)
            
            # Get other standard data
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
        
        # Token refresh code remains the same...
        
        # Get latest wrap if exists
        latest_wrap = SpotifyWrapHistory.objects.filter(user_profile=profile).first()

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
                'top_genres': profile.top_genres,  # Added this
                'recently_played': profile.recently_played,
                'saved_tracks_count': profile.saved_tracks_count,
                'saved_albums_count': profile.saved_albums_count,
                'playlist_count': profile.playlist_count,
                'favorite_artists_count': profile.favorite_artists_count,  # Added this
            },
            'latest_wrap': latest_wrap.id if latest_wrap else None,
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
def create_spotify_wrap(request):
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
                logger.error(f"Token refresh failed: {str(e)}")
                return Response({
                    'error': 'Token refresh failed',
                    'detail': str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        access_token = profile.spotify_access_token
        current_year = timezone.now().year

        # Get fresh Spotify data
        try:
            # Get top artists
            top_artists_data = spotify.get_user_top_items(access_token, 'artists', limit=20)
            if not top_artists_data.get('items'):
                logger.warning("No top artists found")
                top_artists_data = {'items': []}
            top_artist = top_artists_data['items'][0] if top_artists_data['items'] else {}

            # Get top tracks
            top_tracks_data = spotify.get_user_top_items(access_token, 'tracks', limit=20)
            if not top_tracks_data.get('items'):
                logger.warning("No top tracks found")
                top_tracks_data = {'items': []}
            top_track = top_tracks_data['items'][0] if top_tracks_data['items'] else {}

            # Get user saved albums
            saved_albums_data = spotify.get_user_saved_albums(access_token, limit=20)
            top_albums = {
                'items': saved_albums_data.get('items', [])
            }
            top_album = saved_albums_data['items'][0]['album'] if saved_albums_data.get('items') else {}

            # Get followed artists
            followed_artists_data = spotify.get_followed_artists(access_token, limit=5)
            followed_artists = {
                'artists': {
                    'items': followed_artists_data.get('artists', {}).get('items', []),
                    'total': followed_artists_data.get('artists', {}).get('total', 0)
                }
            }

            # Extract and process genres
            genres_list = []
            for artist in top_artists_data.get('items', []):
                genres_list.extend(artist.get('genres', []))
            
            # Count genre occurrences and structure the data
            genre_counts = {}
            for genre in genres_list:
                genre_counts[genre] = genre_counts.get(genre, 0) + 1
            
            # Format genres as list of dicts with count
            top_genres = [
                {'name': genre, 'count': count}
                for genre, count in sorted(
                    genre_counts.items(), 
                    key=lambda x: x[1], 
                    reverse=True
                )
            ][:10]

            # Create new wrap
            wrap = SpotifyWrapHistory.objects.create(
                user_profile=profile,
                year=current_year,
                top_artists=top_artists_data,
                top_artist=top_artist,
                top_albums=top_albums,
                top_album=top_album,
                top_tracks=top_tracks_data,
                top_track=top_track,
                top_followed_artists=followed_artists,
                top_genres=top_genres
            )
            
            return Response({
    'message': 'Spotify wrap created successfully',
    'wrap_id': wrap.id,
    'data': {
        'top_artist': {
            'name': top_artist.get('name'),
            'genres': top_artist.get('genres', []),
            'popularity': top_artist.get('popularity')
        },
        'top_track': {
            'name': top_track.get('name'),
            'artists': [artist.get('name') for artist in top_track.get('artists', [])]
        },
        'top_album': {
            'name': top_album.get('name'),
            'artists': [artist.get('name') for artist in top_album.get('artists', [])]
        },
        'top_genres': [genre['name'] for genre in top_genres[:5]],
        'top_tracks': {  # Add this section
            'items': [
                {
                    'name': track.get('name'),
                    'artists': track.get('artists', [])
                }
                for track in top_tracks_data.get('items', [])[:5]  # Get only top 5
            ]
        }
    }
})

        except Exception as e:
            logger.error(f"Error creating wrap: {str(e)}")
            return Response({
                'error': 'Failed to create wrap',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_wraps(request):
    try:
        profile = request.user.userprofile
        wraps = SpotifyWrapHistory.objects.filter(user_profile=profile).order_by('-created_at')
        
        wraps_data = []
        for wrap in wraps:
            wrap_data = {
                'id': wrap.id,
                'year': wrap.year,
                'created_at': wrap.created_at,
                'top_artist': {
                    'name': wrap.top_artist.get('name'),
                    'genres': wrap.top_artist.get('genres', []),
                    'popularity': wrap.top_artist.get('popularity')
                },
                'top_track': {
                    'name': wrap.top_track.get('name'),
                    'artists': [artist.get('name') for artist in wrap.top_track.get('artists', [])]
                },
                'top_album': {
                    'name': wrap.top_album.get('name'),
                    'artists': [artist.get('name') for artist in wrap.top_album.get('artists', [])]
                },
                'genre_count': len(wrap.top_genres)
            }
            wraps_data.append(wrap_data)
        
        return Response(wraps_data)
    
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error fetching user wraps: {str(e)}")
        return Response({
            'error': 'Failed to fetch wraps',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_wrap_detail(request, wrap_id):
    try:
        profile = request.user.userprofile
        wrap = SpotifyWrapHistory.objects.get(id=wrap_id, user_profile=profile)

        if request.method == 'DELETE':
            wrap.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Process genres to include counts
        top_genres_with_counts = wrap.top_genres if isinstance(wrap.top_genres, list) else []
        
        response_data = {
            'id': wrap.id,
            'year': wrap.year,
            'created_at': wrap.created_at,
            'top_artists': {
                'items': [
                    {
                        'name': artist.get('name'),
                        'genres': artist.get('genres', []),
                        'popularity': artist.get('popularity'),
                        'images': artist.get('images', [])
                    }
                    for artist in wrap.top_artists.get('items', [])
                ]
            },
            'top_artist': {
                'name': wrap.top_artist.get('name'),
                'genres': wrap.top_artist.get('genres', []),
                'popularity': wrap.top_artist.get('popularity'),
                'images': wrap.top_artist.get('images', [])
            },
            'top_albums': {
                'items': [
                    {
                        'name': item['album'].get('name'),
                        'artists': [artist.get('name') for artist in item['album'].get('artists', [])],
                        'images': item['album'].get('images', [])
                    }
                    for item in wrap.top_albums.get('items', [])
                ]
            },
            'top_album': {
                'name': wrap.top_album.get('name'),
                'artists': [artist.get('name') for artist in wrap.top_album.get('artists', [])],
                'images': wrap.top_album.get('images', [])
            },
            'top_tracks': {
                'items': [
                    {
                        'name': track.get('name'),
                        'artists': [artist.get('name') for artist in track.get('artists', [])],
                        'album': {
                            'name': track.get('album', {}).get('name'),
                            'images': track.get('album', {}).get('images', [])
                        }
                    }
                    for track in wrap.top_tracks.get('items', [])
                ]
            },
            'top_track': {
                'name': wrap.top_track.get('name'),
                'artists': [artist.get('name') for artist in wrap.top_track.get('artists', [])],
                'album': {
                    'name': wrap.top_track.get('album', {}).get('name'),
                    'images': wrap.top_track.get('album', {}).get('images', [])
                }
            },
            'top_followed_artists': {
                'items': [
                    {
                        'name': artist.get('name'),
                        'genres': artist.get('genres', []),
                        'images': artist.get('images', [])
                    }
                    for artist in wrap.top_followed_artists.get('artists', {}).get('items', [])
                ],
                'total': wrap.top_followed_artists.get('artists', {}).get('total', 0)
            },
            'top_genres': top_genres_with_counts,
            'is_public': getattr(wrap, 'is_public', False)
        }
        
        return Response(response_data)
    
    except SpotifyWrapHistory.DoesNotExist:
        return Response({
            'error': 'Wrap not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error processing wrap request: {str(e)}")
        return Response({
            'error': 'Failed to process wrap request',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        
        access_token = profile.spotify_access_token
        
        # Get top artists and process genres
        top_artists_data = spotify.get_user_top_items(access_token, 'artists', limit=20)
        profile.top_artists = top_artists_data
        
        # Extract and process genres
        genres_list = []
        for artist in top_artists_data.get('items', []):
            genres_list.extend(artist.get('genres', []))
        
        # Count genres and create structured data
        genre_counts = {}
        for genre in genres_list:
            genre_counts[genre] = genre_counts.get(genre, 0) + 1
        
        # Convert to sorted list of dicts
        sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
        profile.top_genres = {
            'items': [
                {'name': genre, 'count': count} 
                for genre, count in sorted_genres
            ]
        }
        
        # Get followed artists
        followed_artists_data = spotify.get_followed_artists(access_token)
        profile.favorite_artists_count = followed_artists_data.get('artists', {}).get('total', 0)
        
        # Get other standard data
        profile.top_tracks = spotify.get_user_top_items(access_token, 'tracks', limit=20)
        profile.recently_played = spotify.get_recently_played(access_token, limit=50)
        profile.saved_tracks_count = spotify.get_saved_tracks_count(access_token)
        profile.saved_albums_count = spotify.get_saved_albums_count(access_token)
        profile.playlist_count = spotify.get_playlists_count(access_token)
        profile.last_data_update = timezone.now()
        
        profile.save()
        
        return Response({
            'message': 'Spotify data refreshed successfully',
            'data': {
                'top_genres': profile.top_genres,
                'favorite_artists_count': profile.favorite_artists_count,
                'saved_tracks_count': profile.saved_tracks_count,
                'saved_albums_count': profile.saved_albums_count,
                'playlist_count': profile.playlist_count,
                'last_updated': profile.last_data_update
            }
        })
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def toggle_wrap_visibility(request, wrap_id):
    try:
        profile = request.user.userprofile
        wrap = SpotifyWrapHistory.objects.get(id=wrap_id, user_profile=profile)
        
        wrap.is_public = not wrap.is_public
        wrap.save()
        
        return Response({
            'is_public': wrap.is_public
        }, status=status.HTTP_200_OK)
    except SpotifyWrapHistory.DoesNotExist:
        return Response({
            'error': 'Wrap not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_public_wraps(request):
    filter_type = request.query_params.get('filter', 'all')
    user_profile = request.user.userprofile
    
    queryset = SpotifyWrapHistory.objects.filter(is_public=True)
    
    if filter_type == 'liked':
        liked_wraps = WrapLike.objects.filter(user_profile=user_profile).values_list('wrap_id', flat=True)
        queryset = queryset.filter(id__in=liked_wraps)
    elif filter_type == 'following':
        following = user_profile.following.all()
        queryset = queryset.filter(user_profile__in=following)
    
    wraps = queryset.select_related('user_profile')
    
    # Get the user's likes
    user_likes = WrapLike.objects.filter(
        user_profile=user_profile,
        wrap__in=queryset
    ).values_list('wrap_id', flat=True)
    
    # Get the user's following
    user_following = user_profile.following.values_list('id', flat=True)
    
    return Response([{
        'id': wrap.id,
        'year': wrap.year,
        'created_at': wrap.created_at,
        'user_profile': {
            'id': wrap.user_profile.id,
            'spotify_display_name': wrap.user_profile.spotify_display_name
        },
        'likes_count': WrapLike.objects.filter(wrap=wrap).count(),
        'is_liked': wrap.id in user_likes,
        'is_following': wrap.user_profile.id in user_following,
        'top_artist': wrap.top_artist,
        'top_track': wrap.top_track,
        'genre_count': len(wrap.top_genres) if wrap.top_genres else 0,
    } for wrap in wraps])

@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_wrap_detail(request, wrap_id):
    try:
        wrap = SpotifyWrapHistory.objects.get(id=wrap_id, is_public=True)
        response_data = {
            'id': wrap.id,
            'year': wrap.year,
            'created_at': wrap.created_at,
            'top_artists': wrap.top_artists,
            'top_artist': wrap.top_artist,
            'top_albums': wrap.top_albums,
            'top_album': wrap.top_album,
            'top_tracks': wrap.top_tracks,
            'top_track': wrap.top_track,
            'top_genres': wrap.top_genres,
            'user_profile': {
                'spotify_display_name': wrap.user_profile.spotify_display_name
            }
        }
        return Response(response_data)
    except SpotifyWrapHistory.DoesNotExist:
        return Response({'error': 'Wrap not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_public_wraps(request):
    filter_type = request.query_params.get('filter', 'all')
    user_profile = request.user.userprofile
    
    queryset = SpotifyWrapHistory.objects.filter(is_public=True)
    
    if filter_type == 'liked':
        liked_wraps = WrapLike.objects.filter(user_profile=user_profile).values_list('wrap_id', flat=True)
        queryset = queryset.filter(id__in=liked_wraps)
    elif filter_type == 'following':
        following = user_profile.following.all()
        queryset = queryset.filter(user_profile__in=following)
    
    wraps = queryset.select_related('user_profile')
    
    # Get the likes for the current user
    user_likes = WrapLike.objects.filter(
        user_profile=user_profile,
        wrap__in=queryset
    ).values_list('wrap_id', flat=True)
    
    return Response([{
        'id': wrap.id,
        'year': wrap.year,
        'created_at': wrap.created_at,
        'user_profile': {
            'id': wrap.user_profile.id,
            'spotify_display_name': wrap.user_profile.spotify_display_name
        },
        'likes_count': WrapLike.objects.filter(wrap=wrap).count(),
        'is_liked': wrap.id in user_likes,
        'is_following': user_profile.following.filter(id=wrap.user_profile.id).exists(),
        'top_artist': wrap.top_artist,
        'top_track': wrap.top_track,
        'genre_count': len(wrap.top_genres) if wrap.top_genres else 0,
    } for wrap in wraps])

@ensure_csrf_cookie
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_like(request, wrap_id):
    user_profile = request.user.userprofile
    wrap = get_object_or_404(SpotifyWrapHistory, id=wrap_id)
    
    if request.method == 'POST':
        like, created = WrapLike.objects.get_or_create(
            user_profile=user_profile,
            wrap=wrap
        )
        return Response({'status': 'liked', 'created': created})
    
    elif request.method == 'DELETE':
        WrapLike.objects.filter(
            user_profile=user_profile,
            wrap=wrap
        ).delete()
        return Response({'status': 'unliked'})

@ensure_csrf_cookie
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, profile_id):
    try:
        user_profile = request.user.userprofile
        profile_to_follow = UserProfile.objects.get(id=profile_id)
        
        if user_profile.id == profile_id:
            return Response(
                {'error': 'Cannot follow yourself'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.method == 'POST':
            user_profile.follow(profile_to_follow)
            return Response({
                'status': 'following',
                'profile_id': profile_id
            })
            
        elif request.method == 'DELETE':
            user_profile.unfollow(profile_to_follow)
            return Response({
                'status': 'unfollowed',
                'profile_id': profile_id
            })
            
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['POST'])
def contact_form(request):
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')
        
        if not all([name, email, message]):
            return Response(
                {'error': 'Please provide all required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Format the email
        subject = f'New Contact Form Submission from {name}'
        email_message = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        
        Message:
        {message}
        """
        
        # Send email
        send_mail(
            subject=subject,
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],  # Send to yourself
            fail_silently=False,
        )
        
        return Response({'message': 'Email sent successfully'})
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )