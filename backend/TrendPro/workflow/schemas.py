from ninja import Schema
from pydantic import EmailStr, validator
from datetime import datetime
from typing import Optional, Literal

class ApplicationCreateSchema(Schema):
    applicant_name: str
    applicant_email: EmailStr
    company_name:str
    application_type:str
    description:str

class ApplicationUpdateSchema(Schema):
    applicant_name: Optional[str] = None
    applicant_email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    application_type: Optional[str] = None
    description: Optional[str] = None

class ReviewerDecisionSchema(Schema):
    decision: Literal["approved", "rejected", "need_more_info"]
    reviewer_comment: Optional[str] = None

    @validator("reviewer_comment", always=True)
    def comment_required(cls, v, values):
        if values.get("decision") in ("rejected", "need_more_info") and not (v and v.strip()):
            raise ValueError("A comment is required for Rejected or Need More Information decisions.")
        return v

class ApplicationOut(Schema):
    id: int
    tracking_number: str
    applicant_name: str
    applicant_email: EmailStr
    company_name:str
    application_type:str
    description:str
    status:str
    reviewer_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
