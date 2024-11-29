import os

# Retrieve environment variables
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')

# views/testapi.py (create this file)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from ..models import SpotifyWrapHistory

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_create_wrap(request):
    """Test endpoint to create a sample wrap"""
    sample_wrap_data = {
        "top_artists": ["Artist 1", "Artist 2"],
        "top_songs": ["Song 1", "Song 2"],
        "minutes_listened": 12345
    }
    
    wrap = SpotifyWrapHistory.objects.create(
        user_profile=request.user.userprofile,
        wrap_data=sample_wrap_data,
        year=2024
    )
    
    return Response({
        "message": "Test wrap created successfully",
        "wrap_id": wrap.id
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_list_wraps(request):
    """Test endpoint to list all wraps for current user"""
    wraps = SpotifyWrapHistory.objects.filter(
        user_profile=request.user.userprofile
    )
    
    return Response({
        "wraps": [
            {
                "id": wrap.id,
                "created_at": wrap.created_at,
                "year": wrap.year,
                "data": wrap.wrap_data
            } for wrap in wraps
        ]
    })

