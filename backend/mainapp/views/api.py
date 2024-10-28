# mainapp/views/api.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from ..serializers import UserSerializer, RegisterSerializer, UserProfileSerializer, SpotifyWrapHistorySerializer
from django.contrib.auth.models import User
from ..models import UserProfile, SpotifyWrapHistory

@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        })
    return Response({
        'message': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response(
            {'message': 'Profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_wraps(request):
    if request.method == 'GET':
        wraps = SpotifyWrapHistory.objects.filter(user_profile__user=request.user)
        serializer = SpotifyWrapHistorySerializer(wraps, many=True)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        wrap_id = request.data.get('wrap_id')
        try:
            wrap = SpotifyWrapHistory.objects.get(
                id=wrap_id, 
                user_profile__user=request.user
            )
            wrap.delete()
            return Response({'message': 'Wrap deleted successfully'})
        except SpotifyWrapHistory.DoesNotExist:
            return Response(
                {'message': 'Wrap not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()  # This will cascade delete UserProfile due to OneToOneField
    return Response({'message': 'Account deleted successfully'})

