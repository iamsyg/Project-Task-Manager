from fastapi import APIRouter, Depends
from app.middlewares.secure_route import verify_jwt_token
from app.models.project.create_project_model import CreateProjectRequest
from app.controllers.project.create_project_controller import create_project_controller

router = APIRouter(prefix="/project")

@router.post("/create")
async def create_project(
    data: CreateProjectRequest,
    user_id: str = Depends(verify_jwt_token)
):
    return await create_project_controller(data, user_id)