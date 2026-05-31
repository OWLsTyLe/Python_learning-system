from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from unfold.admin import ModelAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(ModelAdmin, UserAdmin):
    list_display = ['email', 'username', 'is_staff', 'is_active']
    ordering = ['email']
    search_fields = ['email', 'username']
    fieldsets = UserAdmin.fieldsets
    add_fieldsets = UserAdmin.add_fieldsets