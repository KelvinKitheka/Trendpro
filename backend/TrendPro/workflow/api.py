from ninja import NinjaAPI
from .schemas import ApplicationCreateSchema, ApplicationOut, ApplicationUpdateSchema, ReviewerDecisionSchema
from .models import Application
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils import timezone

api = NinjaAPI()

# Create an application
@api.post("/applications", response=ApplicationOut)
def create_application(request: HttpRequest, payload: ApplicationCreateSchema):
    application = Application.objects.create(**payload.dict())
    return application

# List your applications
@api.get("/applications", response=list[ApplicationOut])
def list_applications(request: HttpRequest):
    return Application.objects.all()

# Get Application detail
@api.get("/applications/{app_id}", response=ApplicationOut)
def get_application(request: HttpRequest, app_id: int):
    return get_object_or_404(Application, id=app_id)
    
#Update an application
@api.patch("/applications/{app_id}", response=ApplicationOut)
def update_application(request: HttpRequest, app_id: int, payload: ApplicationUpdateSchema):
    app = get_object_or_404(Application, id=app_id)

    if app.status != "draft" and app.status != "need_more_info":
        return api.create_response(
            request,
            {"detail": "Only Drafts or Need more Information Applications can be edited"},
            status=400
        )
    
    for field, value in payload.dict(exclude_none=True).items():
        setattr(app, field, value)
    app.save()
    return app

# Submit application
@api.post("/applications/{app_id}/submit", response=ApplicationOut)
def submit_application(request: HttpRequest, app_id: int):
    app = get_object_or_404(Application, id=app_id)

    if app.status != "draft" and app.status != "need_more_info":
        return api.create_response(
            request,
            {"detail": "Only draft applications can be submitted"},
            status=400
        )

    app.status="submitted"
    app.submitted_at=timezone.now()
    app.save()
    return app

# Start review
@api.post("/applications/{app_id}/start-review", response=ApplicationOut)
def start_review(request: HttpRequest, app_id:int):
    app = get_object_or_404(Application, id=app_id)

    if app.status != "submitted":
        return api.create_response(
            request,
            {"detail": "Only Submitted applications can move to Under Review"},
            status=400
        )
    
    app.status="under_review"
    app.save()
    return app

# Reviewer Decision
@api.post("/applications/{app_id}/decision", response=ApplicationOut)
def record_decision(request: HttpRequest, app_id: int, payload: ReviewerDecisionSchema):
    app = get_object_or_404(Application, id=app_id)

    if app.status != "under_review":
        return api.create_response(
            request,
            {"detail": "Only under Review Applications can receive a decision"},
            status=400
        )
    
    app.status = payload.decision
    app.reviewer_comment = payload.reviewer_comment or ""
    app.reviewed_at = timezone.now()
    app.save()
    return app
