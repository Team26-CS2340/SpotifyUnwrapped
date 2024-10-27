from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'spotify_user_id', 'wrap_display_name', 'total_spotify_minutes')
    search_fields = ('user__username', 'spotify_user_id', 'wrap_display_name')
    list_filter = ('last_generated_wrap_date',)