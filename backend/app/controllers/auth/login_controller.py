# backend/app/controllers/auth/login_controller.py

from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from app.utils.supabase import supabase
from app.utils.auth import (
    verify_password,
    create_access_token,
    create_refresh_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)


def set_cookie(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
        domain=None,  
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
        domain=None,  
    )


async def login_controller(email: str, password: str):
    email = email.strip().lower()
    password = password.strip()

    if not email or not password:
        raise HTTPException(400, "Email and password are required")

    try:
        res = (
            supabase.table("users")
            .select("id, name, email, password")
            .eq("email", email)
            .maybe_single()
            .execute()
        )

        user = res.data

        if not user:
            raise HTTPException(401, "Invalid email or password")

        if not verify_password(password, user["password"]):
            raise HTTPException(401, "Invalid email or password")

        access_token = create_access_token({"sub": user["id"]})
        refresh_token = create_refresh_token({"sub": user["id"]})

        supabase.table("users").update({
            "refresh_token": refresh_token
        }).eq("id", user["id"]).execute()

        response = JSONResponse(content={
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
            },
            "token_type": "cookie",
            "status": "success",
        })

        set_cookie(response, access_token, refresh_token)

        return response

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Login error:", e)
        raise HTTPException(500, "Something went wrong")