# backend/app/controllers/auth/sign_up_controllers.py

from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from app.utils.supabase import supabase
from app.models.auth.sign_up_model import SignUpRequest
from app.utils.auth import hash_password, create_access_token, create_refresh_token
from app.utils.cookie import set_auth_cookies


async def sign_up_controller(data: SignUpRequest):
    name = data.name.strip()
    email = data.email.strip().lower()
    password = data.password.strip()

    if not name or not email or not password:
        raise HTTPException(400, "All fields are required")

    try:
        existing_user = (
            supabase.table("users")
            .select("id")
            .eq("email", email)
            .execute()
        )

        if existing_user.data:
            raise HTTPException(409, "User already exists")

        hashed_password = hash_password(password)

        res = (
            supabase.table("users")
            .insert({
                "name": name,
                "email": email,
                "password": hashed_password
            })
            .execute()
        )

        user = res.data[0]

        access_token = create_access_token({"sub": user["id"]})
        refresh_token = create_refresh_token({"sub": user["id"]})

        supabase.table("users").update({
            "refresh_token": refresh_token
        }).eq("id", user["id"]).execute()

        response = JSONResponse(content={
            "message": "User registered successfully",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"]
            },
            "token_type": "cookie",
            "status": "success"
        })

        set_auth_cookies(response, access_token, refresh_token)

        return response

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Signup error:", e)
        raise HTTPException(500, "Something went wrong")