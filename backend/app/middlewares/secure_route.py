# backend/app/middlewares/secure_route.py

from fastapi import Header, HTTPException, status
from app.utils.supabase import supabase
import jwt
from app.utils.auth import SECRET_KEY, ALGORITHM

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
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        # ✅ Step 2: Verify profile exists (IMPORTANT)
        # profile_res = (
        #     supabase.table("users")
        #     .select("id")
        #     .eq("id", user_id)
        #     .maybe_single()
        #     .execute()
        # )

        # if not profile_res.data:
        #     raise HTTPException(
        #         status_code=401,
        #         detail="User profile not found"
        #     )

        # return user_res.user.id
        return user_id
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
