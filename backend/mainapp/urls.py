from django.urls import path
from .views.api import (  # Import all API views
    spotify_callback, 
    spotify_login, 
    get_current_user_data,
    refresh_spotify_data,
    get_personality_analysis,
    create_spotify_wrap,
    get_user_wraps,
    get_wrap_detail
)
from .views.auth import register, sign_in, sign_out
from .views.general import contact_developers, api_contact_developers  # Correct import for the contact views

# Split URL patterns into two groups: one for API views, one for traditional views
api_urlpatterns = [
    path('api/user/data/', get_current_user_data, name='get_user_data'),
    path('api/user/refresh-spotify/', refresh_spotify_data, name='refresh_spotify_data'),
    path('api/spotify/login/', spotify_login, name='spotify_login'),
    path('api/spotify/callback/', spotify_callback, name='spotify_callback'),
    path('api/user/personality-analysis/', get_personality_analysis, name='personality_analysis'),
    path('api/wraps/create/', create_spotify_wrap, name='create_wrap'),
    path('api/wraps/', get_user_wraps, name='get_wraps'),
    path('api/wraps/<int:wrap_id>/', get_wrap_detail, name='get_wrap_detail'),
    # Add the API contact form endpoint (to handle feedback submission)
]

# Traditional template view patterns
template_urlpatterns = [
    path('register/', register, name='register'),
    path('login/', sign_in, name='sign_in'),
    path('logout/', sign_out, name='sign_out'),
    # Serve the contact page (where users can fill out the feedback form)
    path('contact/', contact_developers, name='contact_developers'),  # This renders the contact page with the form
    path('api/contact/', api_contact_developers, name='api_contact_developers'),  # This handles POST requests for feedback
]

# Debug print to display the registered URLs (optional, can be removed after confirmation)
print("Registered URLs:")
for pattern in api_urlpatterns + template_urlpatterns:
    print(f"- {pattern.pattern}")

# Combine both API and template URL patterns into one list
urlpatterns = api_urlpatterns + template_urlpatterns
