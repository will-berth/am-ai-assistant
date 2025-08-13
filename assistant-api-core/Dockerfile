
# Build
FROM python:3.13.5-slim AS builder

WORKDIR /app

COPY assistant-api-core/requirements.txt .

RUN pip install --prefix=/install --no-cache-dir -r requirements.txt gunicorn

COPY assistant-api-core/. .

FROM python:3.13.5-slim

WORKDIR /app

COPY --from=builder /install /usr/local

COPY --from=builder /app /app

EXPOSE 9000

CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:9000"]
