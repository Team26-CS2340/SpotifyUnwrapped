from django.urls import path
from .views.api import (  # Explicitly import all api views
    spotify_callback, 
    spotify_login, 
    get_current_user_data,
    refresh_spotify_data,
    get_personality_analysis
)
from .views.auth import register, sign_in, sign_out
from .views import api, testapi

# Debug print
print("\nRegistered API Views:")
print(f"get_personality_analysis exists: {hasattr(api, 'get_personality_analysis')}")
print(f"All api attributes: {dir(api)}\n")

# Split URL patterns into two groups
api_urlpatterns = [
    path('api/user/data/', get_current_user_data, name='get_user_data'),
    path('api/user/refresh-spotify/', refresh_spotify_data, name='refresh_spotify_data'),
    path('api/spotify/login/', spotify_login, name='spotify_login'),
    path('api/spotify/callback/', spotify_callback, name='spotify_callback'),
    path('api/user/personality-analysis/', get_personality_analysis, name='personality_analysis'),
]

# Traditional template view patterns
template_urlpatterns = [
    path('register/', register, name='register'),
    path('login/', sign_in, name='sign_in'),
    path('logout/', sign_out, name='sign_out'),
]

# Debug print registered URLs
print("Registered URLs:")
for pattern in api_urlpatterns:
    print(f"- {pattern.pattern}")

# Combine both pattern lists
urlpatterns = api_urlpatterns + template_urlpatterns