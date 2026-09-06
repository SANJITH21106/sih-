from __future__ import annotations
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from passlib.context import CryptContext

try:
    from backend.schemas.auth import User
except ImportError:
    from schemas.auth import User

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DB_PATH = Path(
    os.getenv(
        "TASK_STORE_DB_PATH",
        Path(__file__).resolve().parent / "workspace" / "tasks.db",
    )
)


class UserAlreadyExistsError(Exception):
    pass


def _get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)"
    )
    return conn


async def create_user(username: str, password: str) -> User:
    """Create a new user with hashed password.

    Raises UserAlreadyExistsError if username is taken.
    Plaintext password is never stored or logged.
    """
    conn = _get_connection()
    try:
        user_id = str(uuid.uuid4())
        password_hash = pwd_context.hash(password)
        created_at = datetime.now(timezone.utc).isoformat()
        try:
            with conn:
                conn.execute(
                    """
                    INSERT INTO users (user_id, username, password_hash, created_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    (user_id, username, password_hash, created_at),
                )
        except sqlite3.IntegrityError:
            raise UserAlreadyExistsError(f"Username '{username}' is already taken")
        return User(user_id=user_id, username=username, created_at=created_at)
    finally:
        conn.close()


async def get_user_by_username(username: str) -> Optional[User]:
    conn = _get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, username, created_at FROM users WHERE username = ?",
            (username,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return User(user_id=row[0], username=row[1], created_at=row[2])
    finally:
        conn.close()


async def get_user_by_id(user_id: str) -> Optional[User]:
    conn = _get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, username, created_at FROM users WHERE user_id = ?",
            (user_id,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return User(user_id=row[0], username=row[1], created_at=row[2])
    finally:
        conn.close()


async def verify_password(username: str, password: str) -> Optional[User]:
    """Verify credentials without logging or exposing password.

    Returns User if valid, None if invalid or user does not exist.
    """
    conn = _get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, username, password_hash, created_at FROM users WHERE username = ?",
            (username,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
        user_id, uname, pwd_hash, created_at = row
        if not pwd_context.verify(password, pwd_hash):
            return None
        return User(user_id=user_id, username=uname, created_at=created_at)
    finally:
        conn.close()
