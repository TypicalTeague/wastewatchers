from __future__ import annotations

from fastapi import HTTPException
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    code: str
    message: str
    detail: str | None = None


class AppError(Exception):
    def __init__(self, status_code: int, code: str, message: str, detail: str | None = None) -> None:
        self.status_code = status_code
        self.response = ErrorResponse(code=code, message=message, detail=detail)
        super().__init__(message)


def not_found(message: str, detail: str | None = None) -> AppError:
    return AppError(404, "not_found", message, detail)


def conflict(message: str, detail: str | None = None) -> AppError:
    return AppError(409, "conflict", message, detail)


def manual_follow_up(message: str, detail: str | None = None) -> AppError:
    return AppError(409, "manual_follow_up_required", message, detail)


def to_http_exception(error: AppError) -> HTTPException:
    return HTTPException(status_code=error.status_code, detail=error.response.model_dump())

