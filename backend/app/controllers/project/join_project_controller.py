# backend/app/controllers/project/join_project_controller.py

from fastapi import HTTPException
from app.utils.supabase import supabase


async def join_project_controller(project_code: str, user_id: str):
    try:
        project_code = project_code.strip().upper()

        if not project_code:
            raise HTTPException(400, "Project code is required")

        user_res = (
            supabase.table("users")
            .select("id")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if not user_res.data:
            raise HTTPException(404, "User account not found")

        project_res = (
            supabase.table("projects")
            .select("id, title, description, status, due_date, project_code, admin_id, created_at")
            .eq("project_code", project_code)
            .limit(1)
            .execute()
        )

        if not project_res.data:
            raise HTTPException(404, "Invalid project code")

        project = project_res.data[0]

        existing_member_res = (
            supabase.table("project_members")
            .select("id, role")
            .eq("project_id", project["id"])
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        if existing_member_res.data:
            role = existing_member_res.data[0]["role"]
            status = "already_joined"
            message = "You are already a part of this project"
        else:
            member_res = (
                supabase.table("project_members")
                .insert({
                    "project_id": project["id"],
                    "user_id": user_id,
                    "role": "member"
                })
                .execute()
            )

            if not member_res.data:
                raise HTTPException(500, "Failed to join project")

            role = "member"
            status = "success"
            message = "Project joined successfully"

        members_count_res = (
            supabase.table("project_members")
            .select("id", count="exact")
            .eq("project_id", project["id"])
            .execute()
        )

        tasks_count_res = (
            supabase.table("tasks")
            .select("id", count="exact")
            .eq("project_id", project["id"])
            .execute()
        )

        project_list_item = {
            "id": project["id"],
            "title": project["title"],
            "description": project["description"],
            "status": project["status"],
            "due_date": project["due_date"],
            "project_code": project["project_code"],

            "members_count": members_count_res.count or 0,
            "tasks_count": tasks_count_res.count or 0,

            "role": role,
            "is_admin": role == "admin",

            "created_at": project["created_at"],
        }

        return {
            "message": message,
            "project": project_list_item,
            "status": status
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Join project error:", e)
        raise HTTPException(500, "Something went wrong")