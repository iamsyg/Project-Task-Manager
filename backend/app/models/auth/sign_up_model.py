# backend/app/models/auth/sign_up_model.py

from pydantic import BaseModel, EmailStr, field_validator

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower()