from django.db import models


# Create your models here.
class Application(models.Model):
    tracking_number = models.CharField(max_length=20, unique=True)
    applicant_name = models.CharField(max_length=50)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=50)
    APPLICATION_CHOICES = [
        ('recordation', 'Recordation'),
        ('renewal', 'Renewal'),
        ('change_of_ownership', 'Change of ownership'),
        ('change_of_name', 'Change of name'),
        ('discontinuation', 'Discontinuation'),

    ]
    application_type = models.CharField(max_length=50, choices=APPLICATION_CHOICES)
    description = models.TextField()
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('need_more_info', 'Need more Information'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    reviewer_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
