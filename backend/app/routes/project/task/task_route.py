# backend/app/routes/project/task/task_route.py

from fastapi import APIRouter, Depends
from app.middlewares.secure_route import verify_jwt_token
from app.models.project.task.create_task_model import CreateTaskRequest
from app.controllers.project.task.create_task_controller import create_task_controller

router = APIRouter(prefix="/task", tags=["Task"])


@router.post("/create")
async def create_task(
    data: CreateTaskRequest,
    user_id: str = Depends(verify_jwt_token)
):
    return await create_task_controller(data, user_id)