# backend/app/controllers/project/create_project_model.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreateProjectRequest(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    require_approval: Optional[bool] = True