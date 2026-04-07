# gunicorn_conf.py
import multiprocessing
import os

# Gunicorn configuration
bind = "0.0.0.0:3000"
workers = int(os.getenv("WEB_CONCURRENCY", multiprocessing.cpu_count() * 2 + 1))
worker_class = "uvicorn.workers.UvicornWorker"
keepalive = 5
timeout = 120
graceful_timeout = 120

# Logging
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info")
