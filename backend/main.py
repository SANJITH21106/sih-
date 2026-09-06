from __future__ import annotations
from fastapi import FastAPI

try:
    from backend.api import auth, chat, health, models, stream
except ImportError:
    from api import auth, chat, health, models, stream

app = FastAPI(title="SIH Airgapped Workbench Backend")

# Authentication endpoints: /api/auth/register, /api/auth/login, /api/auth/me
app.include_router(auth.router, prefix="/api")

# Protected chat & task endpoints: /api/chat, /api/tasks/{task_id}
app.include_router(chat.router, prefix="/api")

# Protected stream endpoint: /api/tasks/{task_id}/stream
app.include_router(stream.router, prefix="/api")

# Public status endpoints: /api/health, /api/models
app.include_router(health.router, prefix="/api")
app.include_router(models.router, prefix="/api")
