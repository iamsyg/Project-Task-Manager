# backend/app/controllers/auth/logout_controller.py

import jwt
from fastapi.responses import JSONResponse
from app.utils.auth import REFRESH_SECRET_KEY, ALGORITHM
from app.utils.supabase import supabase
from app.utils.cookie import delete_auth_cookies

async def logout_controller(refresh_token: str | None):
    if refresh_token:
        try:
            payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")

            if user_id:
                supabase.table("users").update({
                    "refresh_token": None
                }).eq("id", user_id).execute()

        except Exception as e:
            print("Logout token invalid/expired:", e)

    response = JSONResponse(content={
        "message": "Logged out successfully",
        "status": "success"
    })

    delete_auth_cookies(response)

    return response