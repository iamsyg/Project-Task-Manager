# backend/app/models/project/fetch_project_details_model.py


from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FetchProjectDetailsRequest(BaseModel):
    project_id: str
