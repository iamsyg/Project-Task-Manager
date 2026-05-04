# backend/app/models/project/join_project_model.py

from pydantic import BaseModel


class JoinProjectRequest(BaseModel):
    project_code: str