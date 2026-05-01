# backend/app/controllers/project/create_project_controller.py

from fastapi import HTTPException
from app.utils.supabase import supabase
from app.models.project.create_project_model import CreateProjectRequest

import random
import string

def generate_project_code(length: int = 6) -> str:
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=length))

async def create_project_controller(data: CreateProjectRequest, user_id: str):
    try:
        title = data.title.strip()

        if not title:
            raise HTTPException(400, "Project title is required")

        # 🔑 Generate unique project code
        project_code = generate_project_code()

        # 📦 Insert project
        project_res = (
            supabase.table("projects")
            .insert({
                "title": title,
                "description": data.description,
                "due_date": data.due_date.isoformat() if data.due_date else None,
                "admin_id": user_id,
                "project_code": project_code,
                "require_approval": data.require_approval
            })
            .execute()
        )

        if not project_res.data:
            raise HTTPException(500, "Failed to create project")

        project = project_res.data[0]

        # 👑 Add creator as ADMIN in project_members
        supabase.table("project_members").insert({
            "project_id": project["id"],
            "user_id": user_id,
            "role": "admin"
        }).execute()

        return {
            "message": "Project created successfully",
            "project": project
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Create project error:", e)
        raise HTTPException(500, "Something went wrong")