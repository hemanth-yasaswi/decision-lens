import os
import structlog
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import engine, Base
from api import auth, upload, chat, documents
from config import settings

# Configure Structured Logging
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer() if settings.ENV == "production" else structlog.dev.ConsoleRenderer(),
    ],
)
logger = structlog.get_logger()

# Rate Limiting
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])

# Create database tables (only for dev, use migrations for prod)
if settings.ENV != "production":
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        logger.error("database_init_failed", error=str(exc))

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Decision Analysis System Backend",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware — never allow credentials with wildcard origins
raw_origins = settings.ALLOWED_ORIGINS.split(",") if isinstance(settings.ALLOWED_ORIGINS, str) else settings.ALLOWED_ORIGINS
allowed_origins = [origin.strip() for origin in raw_origins if origin.strip()]
has_wildcard = "*" in allowed_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=not has_wildcard,  # credentials not allowed with wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("request_started", path=request.url.path, method=request.method)
    response = await call_next(request)
    logger.info("request_finished", path=request.url.path, status_code=response.status_code)
    return response

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", path=request.url.path, error=str(exc))
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

# Include Routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(documents.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
