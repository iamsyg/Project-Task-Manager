# backend/app/middlewares/secure_route.py

import traceback
from fastapi import Header, HTTPException, status
from app.utils.supabase import supabase

async def verify_jwt_token(
    authorization: str = Header(...)
) -> str:
    """
    Verify Supabase JWT and return user_id
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )

    token = authorization.split(" ")[1]

    try:
        user_res = supabase.auth.get_user(token)

        if user_res.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_id = user_res.user.id

        # ✅ Step 2: Verify profile exists (IMPORTANT)
        profile_res = (
            supabase.table("users")
            .select("id")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )

        if not profile_res.data:
            raise HTTPException(
                status_code=401,
                detail="User profile not found"
            )

        # return user_res.user.id
        return user_id
    
    except Exception as e:
        print(f"❌ Token verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
