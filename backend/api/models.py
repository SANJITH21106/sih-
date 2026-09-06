from __future__ import annotations
from fastapi import APIRouter

router = APIRouter(tags=["models"])


@router.get("/models")
async def list_models():
    return []
