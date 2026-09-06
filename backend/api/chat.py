from __future__ import annotations
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

try:
    from backend import engine_bridge
    from backend.auth_deps import get_current_user
    from backend.schemas.auth import User
    from backend.schemas.shared_schemas import TaskCreatedResponse, TaskState
except ImportError:
    import engine_bridge
    from auth_deps import get_current_user
    from schemas.auth import User
    from schemas.shared_schemas import TaskCreatedResponse, TaskState

router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    files: list[str] = []
    session_id: Optional[str] = None
    # Any client-supplied user_id is removed entirely — current_user.user_id is the source of truth


@router.post("/chat", response_model=TaskCreatedResponse)
async def create_chat_task(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    session_id = req.session_id or str(uuid.uuid4())
    task_id = engine_bridge.start_task(req.message, req.files)
    return TaskCreatedResponse(task_id=task_id, session_id=session_id, status="CREATED")


@router.get("/tasks/{task_id}", response_model=TaskState)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
):
    state = engine_bridge.get_task_state(task_id)
    if state is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return state
