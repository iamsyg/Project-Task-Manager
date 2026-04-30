# backend/app/controllers/auth/refresh_token_controller.py

from fastapi import HTTPException
import jwt
from app.utils.supabase import supabase
from app.utils.auth import (
    REFRESH_SECRET_KEY,
    ALGORITHM,
    create_access_token
)


async def refresh_token_controller(refresh_token: str):
    try:
        # 🔍 Decode refresh token
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["user_id"]

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
            "user_id": user_id
        })

        return {
            "access_token": new_access_token
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Refresh token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid refresh token")