# backend/app/middlewares/secure_route.py

from fastapi import Header, HTTPException, Request, status
from app.utils.supabase import supabase
import jwt
from app.utils.auth import SECRET_KEY, ALGORITHM

async def verify_jwt_token(request: Request) -> str:
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(401, "Access token missing")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("✅ Token verified successfully:", payload)  
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(401, "Invalid token payload [secure_route.py]")

        return user_id
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
