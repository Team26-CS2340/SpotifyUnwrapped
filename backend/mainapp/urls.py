from django.urls import path
from .views.api import spotify_callback, spotify_login
from .views.auth import register, sign_in, sign_out
from .views import api, testapi

# Split URL patterns into two groups
api_urlpatterns = [
    # In urls.py, add to api_urlpatterns
    path('api/user/data/', api.get_current_user_data, name='get_user_data'),
    path('api/user/refresh-spotify/', api.refresh_spotify_data, name='refresh_spotify_data'),
    path('api/spotify/login/', api.spotify_login, name='spotify_login'),
    path('api/spotify/callback/', api.spotify_callback, name='spotify_callback'),
]

# Traditional template view patterns
template_urlpatterns = [
    path('register/', register, name='register'),
    path('login/', sign_in, name='sign_in'),
    path('logout/', sign_out, name='sign_out'),
]

# Combine both pattern lists
urlpatterns = api_urlpatterns + template_urlpatterns