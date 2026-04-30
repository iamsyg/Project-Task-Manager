# backend/app/controllers/auth/sign_up_controllers.py

from fastapi import HTTPException, status
from app.utils.supabase import supabase
from app.models.auth.sign_up_model import SignUpRequest
from app.utils.auth import hash_password


async def sign_up_controller(data: SignUpRequest):
    name = data.name.strip()
    email = data.email.strip().lower()
    password = data.password.strip()

    if not name or not email or not password:
        raise HTTPException(400, "All fields are required")

    try:
        # 🔍 Check if user exists
        existing_user = (
            supabase.table("users")
            .select("id")
            .eq("email", email)
            .execute()
        )

        print("🔍 Existing user check:", existing_user)

        if existing_user.data:
            raise HTTPException(409, "User already exists")

        # 🔐 Hash password
        hashed_password = hash_password(password)

        # 💾 Insert user
        res = (
            supabase.table("users")
            .insert({
                "name": name,
                "email": email,
                "password": hashed_password
            })
            .execute()
        )

        if res is None or res.data is None:
            raise HTTPException(500, "Failed to insert user")

        user = res.data[0]

        return {
            "message": "User registered successfully",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"]
            },
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Signup error:", e)
        raise HTTPException(500, "Something went wrong")