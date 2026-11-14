FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install only the package manifests first (caches dependencies)
COPY frontend/package*.json ./
RUN npm ci

# Copy the whole frontend source and build it
COPY frontend/ .
RUN npm run build   # creates ./dist (or ./build) – used later by the backend

# -------------------------------------------------
#  RUNTIME STAGE – FastAPI backend + static files
# -------------------------------------------------
FROM python:3.12-slim AS runtime
WORKDIR /app

# ---- Backend dependencies -------------------------------------------------
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy built frontend --------------------------------------------------
# The React build output is in /app/dist (or /app/build) from the previous stage.
COPY --from=frontend-builder /app/dist ./frontend/dist   # <-- if your build target is "dist"
# If you use Vite‑React (default) the folder is `dist`. If the project uses CRA,
# change the line to `./frontend/build` instead.

# ---- Copy backend source --------------------------------------------------
COPY backend ./backend

# -------------------------------------------------
#  ENV & ENTRYPOINT
# -------------------------------------------------
ENV PORT=8080
EXPOSE 8080

# The backend’s FastAPI entry‑point is `backend/app/main.py`.
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "$PORT"]