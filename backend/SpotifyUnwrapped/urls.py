from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('mainapp.urls')),  # Changed from api/ to just '' since we'll handle prefixes in mainapp urls
]