# backend/app/controllers/project/task/create_task.py

from fastapi import HTTPException
from app.utils.supabase import supabase
from app.models.project.task.create_task_model import CreateTaskRequest


VALID_TASK_STATUS = ["pending", "progress", "completed"]


async def create_task_controller(data: CreateTaskRequest, user_id: str):
    try:
        title = data.title.strip()

        if not title:
            raise HTTPException(400, "Task title is required")

        if data.status not in VALID_TASK_STATUS:
            raise HTTPException(400, "Invalid task status")

        # ✅ Check current user is admin of this project
        admin_res = (
            supabase.table("project_members")
            .select("*")
            .eq("project_id", data.project_id)
            .eq("user_id", user_id)
            .eq("role", "admin")
            .execute()
        )

        if not admin_res.data:
            raise HTTPException(403, "Only project admin can create task")

        # ✅ Check assigned user is member of same project
        member_res = (
            supabase.table("project_members")
            .select("*")
            .eq("project_id", data.project_id)
            .eq("user_id", data.assigned_to)
            .execute()
        )

        if not member_res.data:
            raise HTTPException(400, "Assigned user must be a member of this project")

        # ✅ Insert task
        task_res = (
            supabase.table("tasks")
            .insert({
                "project_id": data.project_id,
                "title": title,
                "description": data.description,
                "assigned_to": data.assigned_to,
                "created_by": user_id,
                "status": data.status,
                "due_date": data.due_date.isoformat() if data.due_date else None,
            })
            .execute()
        )

        if not task_res.data:
            raise HTTPException(500, "Failed to create task")

        task = task_res.data[0]

        return {
            "message": "Task created successfully",
            "task": task
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Create task error:", e)
        raise HTTPException(500, "Something went wrong")