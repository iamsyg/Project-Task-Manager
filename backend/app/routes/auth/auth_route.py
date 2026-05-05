# backend/app/routes/auth/auth_route.py

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from app.controllers.auth.sign_up_controllers import sign_up_controller
from app.models.auth.sign_up_model import SignUpRequest
from app.controllers.auth.refresh_token_controller import refresh_token_controller
from app.controllers.auth.logout_controller import logout_controller
from app.middlewares.secure_route import verify_jwt_token
from app.controllers.auth.login_controller import login_controller
from app.models.auth.log_in_modal import LoginRequest
from app.controllers.auth.me_controller import me_controller

router = APIRouter(prefix="/auth")


@router.post("/signup")
async def signup(data: SignUpRequest):
    response = await sign_up_controller(data)
    print("✅ Signup successful:", response)    
    return response

@router.post("/refresh")
async def refresh(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(401, "Refresh token missing")

    data = await refresh_token_controller(refresh_token)

    return data

@router.post("/login")
async def login(data: LoginRequest):
    return await login_controller(data.email, data.password)


@router.post("/logout")
async def logout(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    print("Logout requested. Refresh token:", refresh_token)  # Debugging line

    return await logout_controller(refresh_token)

@router.get("/me")
async def me(user_id: str = Depends(verify_jwt_token)):
    return await me_controller(user_id)

@router.post("/debug-cookies")
async def debug_cookies(request: Request):
    print("All cookies received:", request.cookies)
    return {"cookies": dict(request.cookies)}

# @router.post("/login")
# async def login(email: str, password: str):
#     return await login_controller(email, password)