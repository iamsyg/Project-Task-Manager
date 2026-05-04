from fastapi import APIRouter, Depends
from app.middlewares.secure_route import verify_jwt_token
from app.models.project.create_project_model import CreateProjectRequest
from app.controllers.project.create_project_controller import create_project_controller
from app.controllers.project.fetch_project_controller import fetch_all_project_controller
from app.controllers.project.join_project_controller import join_project_controller
from app.models.project.join_project_model import JoinProjectRequest

router = APIRouter(prefix="/project")

@router.post("/create")
async def create_project(
    data: CreateProjectRequest,
    user_id: str = Depends(verify_jwt_token)
):
    return await create_project_controller(data, user_id)

@router.get("/all")
async def fetch_all_projects(
    user_id: str = Depends(verify_jwt_token)
):
    return await fetch_all_project_controller(user_id)


@router.post("/join")
async def join_project(
    data: JoinProjectRequest,
    user_id: str = Depends(verify_jwt_token)
):
    return await join_project_controller(data.project_code, user_id)