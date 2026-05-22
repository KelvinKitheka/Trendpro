from django.contrib import admin
from .models import Application

# Register your models here.

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['tracking_number', 'applicant_name', 'company_name', 'status', 'created_at']
    list_filter = ['status', 'application_type']
    search_fields = ['tracking_number', 'applicant_name', 'company_name']