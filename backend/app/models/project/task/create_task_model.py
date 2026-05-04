# backend/app/models/project/task/create_task_model.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CreateTaskRequest(BaseModel):
    project_id: str
    title: str
    description: Optional[str] = None
    assigned_to: str
    status: Optional[str] = "pending"
    due_date: Optional[datetime] = None