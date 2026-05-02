# backend/app/models/auth/log_in_modal.py

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str