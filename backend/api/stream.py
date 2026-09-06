from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Query, WebSocket, status

try:
    from backend import engine_bridge
    from backend.auth_deps import get_current_user_ws
except ImportError:
    import engine_bridge
    from auth_deps import get_current_user_ws

router = APIRouter(tags=["stream"])


@router.websocket("/tasks/{task_id}/stream")
async def task_stream_ws(
    websocket: WebSocket,
    task_id: str,
    token: Optional[str] = Query(None),
):
    """WebSocket stream for task execution events.

    Authentication: token provided via query parameter `?token=<jwt>`
    or Bearer authorization header.
    """
    user = await get_current_user_ws(websocket, token)
    if user is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    async for event in engine_bridge.subscribe(task_id):
        await websocket.send_json(event)
