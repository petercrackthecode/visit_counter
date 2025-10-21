# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Architecture

This is a visit counter web application with a Flask backend API and an empty web frontend directory structure.

### Structure
- `backend/` - Flask Python API server
  - `app.py` - Main Flask application with heartbeat and visitor endpoints
  - `requirements.txt` - Python dependencies (Flask-based stack)
- `web/` - Frontend directory (currently empty)

## Development Commands

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Running the Application
```bash
cd backend
python app.py
```
The server will run on `http://localhost:5000` with debug mode enabled for auto-reload.

### API Endpoints
- `GET /` - Heartbeat endpoint returning server status
- `POST /visitor` - Visitor counter endpoint (currently under construction)

## Development Notes

- The application uses Flask with debug mode enabled for development
- Host and port are configurable via `HOST` and `PORT` environment variables
- The `/visitor` POST endpoint is a placeholder and needs implementation
- No database or persistence layer is currently configured
- No testing framework or linting tools are set up yet