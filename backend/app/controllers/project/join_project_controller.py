
from fastapi import HTTPException
from app.utils.supabase import supabase


async def join_project_controller(project_code: str, user_id: str):
    try:
        project_code = project_code.strip().upper()

        if not project_code:
            raise HTTPException(400, "Project code is required")

        # 1. Check valid user
        user_res = (
            supabase.table("users")
            .select("id, name, email")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if not user_res or not user_res.data:
            raise HTTPException(404, "User account not found")

        # 2. Find project by code
        project_res = (
            supabase.table("projects")
            .select("id, title, project_code, admin_id")
            .eq("project_code", project_code)
            .limit(1)
            .execute()
        )

        if not project_res or not project_res.data:
            raise HTTPException(404, "Invalid project code")

        project = project_res.data[0]

        # 3. Check already member
        existing_member_res = (
            supabase.table("project_members")
            .select("id, role")
            .eq("project_id", project["id"])
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        if existing_member_res and existing_member_res.data:
            return {
                "message": "You are already a part of this project",
                "project": project,
                "role": existing_member_res.data[0]["role"],
                "status": "already_joined"
            }

        # 4. Insert member
        member_res = (
            supabase.table("project_members")
            .insert({
                "project_id": project["id"],
                "user_id": user_id,
                "role": "member"
            })
            .execute()
        )

        if not member_res or not member_res.data:
            raise HTTPException(500, "Failed to join project")

        return {
            "message": "Project joined successfully",
            "project": project,
            "member": member_res.data[0],
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Join project error:", e)
        raise HTTPException(500, "Something went wrong")