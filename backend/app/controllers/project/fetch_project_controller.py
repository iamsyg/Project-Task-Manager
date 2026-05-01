# backend/app/controllers/project/fetch_all_project_controller.py

from fastapi import HTTPException
from app.utils.supabase import supabase


async def fetch_all_project_controller(user_id: str):
    try:
        # 1. Get all projects where user is a member/admin
        member_res = (
            supabase.table("project_members")
            .select("project_id, role")
            .eq("user_id", user_id)
            .execute()
        )

        if not member_res.data:
            return {
                "message": "No projects found",
                "projects": []
            }

        project_ids = [item["project_id"] for item in member_res.data]

        role_map = {
            item["project_id"]: item["role"]
            for item in member_res.data
        }

        # 2. Fetch project details
        projects_res = (
            supabase.table("projects")
            .select(
                "id, title, description, status, due_date, project_code, admin_id, created_at"
            )
            .in_("id", project_ids)
            .order("created_at", desc=True)
            .execute()
        )

        if not projects_res.data:
            return {
                "message": "No projects found",
                "projects": []
            }

        projects = []

        for project in projects_res.data:
            project_id = project["id"]

            # 3. Count members
            members_res = (
                supabase.table("project_members")
                .select("id", count="exact")
                .eq("project_id", project_id)
                .execute()
            )

            # 4. Count tasks
            tasks_res = (
                supabase.table("tasks")
                .select("id", count="exact")
                .eq("project_id", project_id)
                .execute()
            )

            projects.append({
                "id": project["id"],
                "title": project["title"],
                "description": project["description"],
                "status": project["status"],
                "due_date": project["due_date"],
                "project_code": project["project_code"],

                "members_count": members_res.count or 0,
                "tasks_count": tasks_res.count or 0,

                "role": role_map.get(project_id, "member"),
                "is_admin": project["admin_id"] == user_id,

                "created_at": project["created_at"],
            })

        return {
            "message": "Projects fetched successfully",
            "projects": projects
        }

    except Exception as e:
        print("❌ Fetch all projects error:", e)
        raise HTTPException(500, "Something went wrong")