from django.urls import path
from .views.api import (  # Explicitly import all api views
    spotify_callback, 
    spotify_login, 
    get_current_user_data,
    refresh_spotify_data,
    get_personality_analysis,
    create_spotify_wrap,
    get_user_wraps,
    get_wrap_detail,
    toggle_wrap_visibility,
    get_public_wrap_detail,
    get_public_wraps,
    toggle_follow,
    toggle_like,
    contact_form
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
    path('api/wraps/create/', create_spotify_wrap, name='create_wrap'),
    path('api/wraps/', get_user_wraps, name='get_wraps'),
    path('api/wraps/<int:wrap_id>/', get_wrap_detail, name='get_wrap_detail'),
    path('api/user/wraps/', get_user_wraps, name='get-user-wraps'),
    path('api/user/wrap/<int:wrap_id>/', get_wrap_detail, name='get-wrap-detail'),
    path('api/user/wrap/<int:wrap_id>/toggle-visibility/', toggle_wrap_visibility, name='toggle-wrap-visibility'),
    path('api/wraps/public/', get_public_wraps, name='public-wraps'),
    path('api/wrap/<int:wrap_id>/public/', get_public_wrap_detail, name='public-wrap-detail'),
    path('api/wraps/public/', get_public_wraps, name='get_public_wraps'),
    path('api/wraps/<int:wrap_id>/like/', toggle_like, name='toggle_like'),
    path('api/profile/<int:profile_id>/follow/', toggle_follow, name='toggle_follow'),
    path('api/contact/', contact_form, name='contact_form'),

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