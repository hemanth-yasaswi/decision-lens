# DecisionLens

An AI-powered document analysis and decision support tool. Upload PDF or TXT documents and chat with an AI that analyzes them using RAG (Retrieval-Augmented Generation) powered by Google Gemini.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| Database | SQLite (default) / PostgreSQL (production) |
| Vector Store | FAISS |
| AI Model | Google Gemini (via `google-genai`) |
| Auth | JWT (python-jose) |

---

## Project Structure

```
decision-lens-main/
├── backend/                  ← FastAPI backend
│   ├── api/                  ← Route handlers (auth, chat, upload, documents)
│   ├── models/               ← SQLAlchemy database models
│   ├── schemas/              ← Pydantic request/response schemas
│   ├── services/             ← Business logic (RAG, embedding, auth, document)
│   ├── rag/                  ← Chunking and retrieval utilities
│   ├── utils/                ← Security helpers, file handler
│   ├── main.py               ← FastAPI app entry point
│   ├── config.py             ← App settings (reads from .env)
│   ├── database.py           ← SQLAlchemy engine and session
│   ├── requirements.txt      ← Python dependencies  ← PLACE HERE
│   └── .env                  ← Backend environment variables  ← CREATE HERE
├── src/                      ← React frontend source
├── index.html
├── vite.config.ts
├── package.json
└── .env                      ← Frontend environment variables  ← CREATE HERE
```

---

## Prerequisites

Make sure the following are installed on your system before starting:

- **Python 3.11 or higher** — [Download](https://www.python.org/downloads/)
- **Node.js 18 or higher** — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

---

## Step 1 — Clone or Extract the Project

If you have the zip file, extract it. If using git:

```bash
git clone <your-repo-url>
cd decision-lens-main
```

---

## Step 2 — Backend Setup (Python venv)

All backend steps are run from inside the `backend/` folder.

### 2.1 — Navigate to the backend folder

```bash
cd backend
```

### 2.2 — Create a Python virtual environment

```bash
python -m venv venv
```

This creates a `venv/` folder inside `backend/`.

### 2.3 — Activate the virtual environment

**On Windows (Command Prompt):**
```cmd
venv\Scripts\activate
```

**On Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal prompt after activation.

### 2.4 — Install Python dependencies

The `requirements.txt` file is located at:

```
decision-lens-main/backend/requirements.txt
```

With the venv activated, run:

```bash
pip install -r requirements.txt
```

This installs all required packages including FastAPI, SQLAlchemy, FAISS, SentenceTransformers, pdfplumber, google-genai, and more.

> **Note:** `sentence-transformers` and `faiss-cpu` are large packages. Installation may take a few minutes.

### 2.5 — Create the backend `.env` file

Create a file named `.env` inside the `backend/` folder:

```
decision-lens-main/backend/.env
```

Paste the following content into it and fill in your values:

```env
# Required — your Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT secret key — use any long random string
SECRET_KEY=your-very-long-and-secure-secret-key-here

# Database — SQLite is used by default, no extra setup needed
DATABASE_URL=sqlite:///./decisionlens.db

# CORS — allow the frontend origin
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENV=development

# Rate limiting (requests per minute per IP)
RATE_LIMIT_PER_MINUTE=60

# Gemini model to use
GEMINI_MODEL=gemini-2.0-flash
```

> **Where to get a Gemini API key:**
> Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), sign in with your Google account, and create a free API key.

### 2.6 — Create the uploads folder

The backend saves uploaded files to an `uploads/` directory. Create it manually:

```bash
mkdir uploads
```

> If you skip this step, the backend will create it automatically on first run.

---

## Step 3 — Frontend Setup (Node.js)

Go back to the project root (not inside `backend/`):

```bash
cd ..
```

You should now be in `decision-lens-main/`.

### 3.1 — Install Node.js dependencies

```bash
npm install
```

### 3.2 — Create the frontend `.env` file

Create a file named `.env` at the root of the project:

```
decision-lens-main/.env
```

Paste the following:

```env
# Optional — only needed if you use the Gemini API directly from the frontend
GEMINI_API_KEY=your_gemini_api_key_here

# The URL your app runs at (used internally)
APP_URL=http://localhost:3000
```

> The frontend communicates with the backend through a Vite proxy (`/api` → `http://localhost:8000`), so no additional API URL configuration is needed.

---

## Step 4 — Running the Project

You need **two terminals** running simultaneously — one for the backend and one for the frontend.

---

### Terminal 1 — Run the Backend

```bash
cd decision-lens-main/backend
```

Activate the virtual environment:

**Windows:**
```cmd
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

Start the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You should see output like:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

The backend is now running at: **http://localhost:8000**

---

### Terminal 2 — Run the Frontend

Open a new terminal and navigate to the project root:

```bash
cd decision-lens-main
```

Start the Vite development server:

```bash
npm run dev:frontend
```

You should see:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

The frontend is now running at: **http://localhost:3000**

---

## Step 5 — Access the Application

Open your browser and go to:

```
http://localhost:3000
```

1. Click **Sign Up** to create an account
2. Log in with your credentials
3. Go to **AI Chat** from the sidebar
4. Upload a PDF or TXT file
5. Wait for the status to show **Ready**
6. Type a question and hit Send

---

## Database Information

| Setting | Value |
|---------|-------|
| Type | SQLite (default) |
| File location | `backend/decisionlens.db` |
| Auto-created | Yes — on first backend startup |
| ORM | SQLAlchemy |

The SQLite database file (`decisionlens.db`) is **automatically created** inside the `backend/` folder when you first run the backend. You do not need to run any migration commands in development mode.

**Tables created automatically:**
- `users` — stores registered user accounts
- `documents` — stores uploaded document records and their processing status

---

## FAISS Vector Index

FAISS stores document embeddings for similarity search. These files are created automatically in the `backend/` folder:

| File | Purpose |
|------|---------|
| `backend/faiss_index.bin` | The binary vector index |
| `backend/faiss_index.bin.metadata` | Chunk metadata (filenames, doc IDs) |

Both files are created on first document upload. Do not delete them while the server is running.

---

## Switching to PostgreSQL (Optional)

If you want to use PostgreSQL instead of SQLite:

1. Install and start PostgreSQL on your machine
2. Create a database (e.g., `decisionlens`)
3. Update `backend/.env`:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/decisionlens
```

The backend will automatically use PostgreSQL connection pooling when a non-SQLite URL is detected.

---

## API Documentation

Once the backend is running, you can view the auto-generated API docs at:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health check:** http://localhost:8000/health

---

## Common Issues & Fixes

### ❌ `ModuleNotFoundError` when starting the backend
**Cause:** Virtual environment is not activated.
**Fix:** Run `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux) before starting uvicorn.

---

### ❌ `GEMINI_API_KEY not set` — chat returns "service unavailable"
**Cause:** The `.env` file is missing or the key is blank.
**Fix:** Ensure `backend/.env` exists and contains a valid `GEMINI_API_KEY`.

---

### ❌ Frontend shows blank page or 404 on `/api` routes
**Cause:** Backend is not running or is on a different port.
**Fix:** Make sure the FastAPI server is running on port `8000` before starting the frontend.

---

### ❌ `OSError` or permission error when creating `uploads/` folder
**Fix:** Manually create the folder:
```bash
mkdir backend/uploads
```

---

### ❌ Document stays in "Processing" status forever
**Cause:** An error occurred during text extraction or embedding.
**Fix:** Check the backend terminal for error logs. Ensure the uploaded file is a valid, non-empty PDF or TXT file.

---

### ❌ `pip install` fails on `faiss-cpu`
**Cause:** Compiler tools missing on some systems.
**Fix (Windows):** Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
**Fix (Linux):** `sudo apt-get install build-essential`

---

## Environment Variables Reference

### `backend/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key |
| `SECRET_KEY` | ✅ Yes | fallback string | JWT signing secret |
| `DATABASE_URL` | No | `sqlite:///./decisionlens.db` | Database connection string |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173,...` | Comma-separated CORS origins |
| `ENV` | No | `development` | `development` or `production` |
| `RATE_LIMIT_PER_MINUTE` | No | `60` | API rate limit per IP |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model name |

### `.env` (root — frontend)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Only needed for direct frontend Gemini usage |
| `APP_URL` | No | Base URL of the app |

---

## Quick Reference — Commands

```bash
# === BACKEND ===
cd backend
python -m venv venv                        # Create venv (only once)
venv\Scripts\activate                      # Activate venv (Windows)
source venv/bin/activate                   # Activate venv (macOS/Linux)
pip install -r requirements.txt            # Install dependencies (only once)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload   # Start backend

# === FRONTEND ===
cd ..                                      # Go back to project root
npm install                                # Install dependencies (only once)
npm run dev:frontend                       # Start frontend
```

---

## Known Limitations

**In-Memory Retrieval Index (TF-IDF):**
The TF-IDF document index is currently stored entirely in memory (RAM). If the FastAPI server restarts, all indexed documents are lost from the active retrieval pool. Users must re-upload their documents to query them again after a server restart. 

This is a known trade-off for simplicity in this offline prototype. 

*Future improvement:* Persist chunk data to SQLite and re-index automatically on startup.
