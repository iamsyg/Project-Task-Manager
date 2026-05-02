# backend/app/controllers/auth/me_controller.py

from app.utils.supabase import supabase
from fastapi import HTTPException

async def me_controller(user_id: str):
    try:
        res = (
            supabase.table("users")
            .select("id, name, email")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )

        user = res.data

        if not user:
            raise HTTPException(404, "User not found")

        return {
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
            },
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Me controller error:", e)
        raise HTTPException(500, "Something went wrong")