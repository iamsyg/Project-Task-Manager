# backend/app/controllers/auth/refresh_token_controller.py

from fastapi import HTTPException
from fastapi.responses import JSONResponse
import jwt
from app.utils.supabase import supabase
from app.utils.auth import (
    REFRESH_SECRET_KEY,
    ALGORITHM,
    create_access_token
)
from app.utils.cookie import set_access_cookie


async def refresh_token_controller(refresh_token: str):
    try:
        # 🔍 Decode refresh token
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(401, "Invalid refresh token payload")

        # 🔍 Check if token matches DB
        res = (
            supabase.table("users")
            .select("refresh_token")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )

        user = res.data

        if not user or user["refresh_token"] != refresh_token:
            raise HTTPException(401, "Invalid refresh token")

        # 🎟️ Create new access token
        new_access_token = create_access_token({
            "sub": user_id
        })

        response = JSONResponse(content={
            "message": "Access token refreshed",
            "status": "success"
        })

        set_access_cookie(response, new_access_token)

        return response

    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Refresh token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid refresh token")