from django.urls import path
from .views.api import register_api, login_api, logout_api, get_user_profile
from .views.auth import register, sign_in, sign_out
from .views import api, testapi

# Split URL patterns into two groups
api_urlpatterns = [
    path('api/auth/register/', register_api, name='register_api'),
    path('api/auth/login/', login_api, name='login_api'),
    path('api/auth/logout/', logout_api, name='logout_api'),
    path('api/profile/', get_user_profile, name='user_profile_api'),
    path('api/wraps/', api.manage_wraps, name='manage_wraps'),
    path('api/account/delete/', api.delete_account, name='delete_account'),
    path('api/test/create-wrap/', testapi.test_create_wrap, name='test_create_wrap'),
    path('api/test/list-wraps/', testapi.test_list_wraps, name='test_list_wraps'),
]

# Traditional template view patterns
template_urlpatterns = [
    path('register/', register, name='register'),
    path('login/', sign_in, name='sign_in'),
    path('logout/', sign_out, name='sign_out'),
]

# Combine both pattern lists
urlpatterns = api_urlpatterns + template_urlpatterns