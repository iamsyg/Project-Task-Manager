# backend/app/routes/auth/sign_up_route.py

from fastapi import APIRouter
from app.controllers.auth.sign_up_controllers import sign_up_controller
from app.models.auth.sign_up_model import SignUpRequest

router = APIRouter(prefix="/auth")


@router.post("/signup")
async def signup(data: SignUpRequest):
    response = await sign_up_controller(data)
    print("✅ Signup successful:", response)    
    return response


# @router.post("/login")
# async def login(email: str, password: str):
#     return await login_controller(email, password)