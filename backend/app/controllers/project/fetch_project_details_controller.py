# backend/app/controllers/project/fetch_project_details_controller.py

from fastapi import HTTPException
from app.utils.supabase import supabase


async def fetch_project_details_controller(project_id: str, user_id: str):
    try:
        # 1. Check project exists
        project_res = (
            supabase.table("projects")
            .select(
                "id, title, description, status, due_date, project_code, admin_id, created_at, updated_at"
            )
            .eq("id", project_id)
            .limit(1)
            .execute()
        )

        if not project_res.data:
            raise HTTPException(status_code=404, detail="Project not found")

        project = project_res.data[0]

        # 2. Check current user is project member
        current_member_res = (
            supabase.table("project_members")
            .select("id, role")
            .eq("project_id", project_id)
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        if not current_member_res.data:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this project"
            )

        current_user_role = current_member_res.data[0]["role"]

        # 3. Fetch project creator/admin
        creator_res = (
            supabase.table("users")
            .select("id, name, email")
            .eq("id", project["admin_id"])
            .limit(1)
            .execute()
        )

        created_by = creator_res.data[0] if creator_res.data else None

        # 4. Fetch members
        members_res = (
            supabase.table("project_members")
            .select("id, role, joined_at, user_id")
            .eq("project_id", project_id)
            .execute()
        )

        members = []

        for member in members_res.data or []:
            user_res = (
                supabase.table("users")
                .select("id, name, email")
                .eq("id", member["user_id"])
                .limit(1)
                .execute()
            )

            user = user_res.data[0] if user_res.data else None

            members.append({
                "id": member["id"],
                "role": member["role"],
                "joined_at": member["joined_at"],
                "user": user
            })

        # 5. Fetch tasks
        tasks_res = (
            supabase.table("tasks")
            .select(
                "id, title, description, status, assigned_to, created_by, due_date, created_at, updated_at"
            )
            .eq("project_id", project_id)
            .order("created_at", desc=True)
            .execute()
        )

        tasks = tasks_res.data or []

        # 6. Attach assigned user and creator details to each task
        formatted_tasks = []

        for task in tasks:
            assigned_user = None
            creator_user = None

            if task.get("assigned_to"):
                assigned_res = (
                    supabase.table("users")
                    .select("id, name, email")
                    .eq("id", task["assigned_to"])
                    .limit(1)
                    .execute()
                )
                assigned_user = assigned_res.data[0] if assigned_res.data else None

            formatted_tasks.append({
                "id": task["id"],
                "title": task["title"],
                "description": task["description"],
                "status": task["status"],
                "due_date": task["due_date"],
                "created_at": task["created_at"],
                "updated_at": task["updated_at"],
                "assigned_to": assigned_user,
            })

        return {
            "message": "Project details fetched successfully",
            "status": "success",
            "project": {
                "id": project["id"],
                "title": project["title"],
                "description": project["description"],
                "status": project["status"],
                "due_date": project["due_date"],
                "project_code": project["project_code"],
                "created_by": created_by,
                "created_at": project["created_at"],
                "updated_at": project["updated_at"],

                "is_admin": current_user_role == "admin",
                
                "members_count": len(members),
                "tasks_count": len(formatted_tasks),
                "current_user_role": current_user_role,
                
                "members": members,
                "tasks": formatted_tasks,
                
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        print("❌ Fetch project details error:", e)
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while fetching project details"
        )