from __future__ import annotations
import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI

try:
    from backend import auth_store
    from backend.api import auth, chat, health, models, stream
except ImportError:
    import auth_store
    from api import auth, chat, health, models, stream

logger = logging.getLogger("workbench.admin")


async def bootstrap_admin() -> None:
    """Bootstrap a single admin account if no admin user exists in auth_store

    and ADMIN_USERNAME / ADMIN_PASSWORD environment variables are supplied.
    Subsequent boots see the existing admin and do nothing.
    """
    if await auth_store.has_admin_user():
        logger.info("Admin account already exists. Skipping bootstrap.")
        return

    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if admin_username and admin_password:
        try:
            admin_user = await auth_store.create_user(
                admin_username, admin_password, role="admin"
            )
            logger.info(
                f"Admin bootstrap: created initial admin user '{admin_user.username}' (id: {admin_user.user_id})."
            )
        except auth_store.UserAlreadyExistsError:
            logger.warning(
                f"Admin bootstrap: username '{admin_username}' already exists. Skipping."
            )
    else:
        logger.warning(
            "No admin account exists and ADMIN_USERNAME / ADMIN_PASSWORD are not set. "
            "Skipping initial admin bootstrap."
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    await bootstrap_admin()
    yield


app = FastAPI(title="SIH Airgapped Workbench Backend", lifespan=lifespan)


# Authentication endpoints: /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/admin-check
app.include_router(auth.router, prefix="/api")

# Protected chat & task endpoints: /api/chat, /api/tasks/{task_id}
app.include_router(chat.router, prefix="/api")

# Protected stream endpoint: /api/tasks/{task_id}/stream
app.include_router(stream.router, prefix="/api")

# Public status endpoints: /api/health, /api/models
app.include_router(health.router, prefix="/api")
app.include_router(models.router, prefix="/api")
