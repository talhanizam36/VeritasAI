# AI Image Detector — Backend

A FastAPI backend that accepts image uploads and returns a deterministic AI/Real classification with a confidence score.

## Requirements

- Python 3.9+
- pip

> **Note on Python 3.15+**: The pinned `Pillow==10.3.0` and `numpy==1.26.4` in
> `requirements.txt` require a C compiler on Python 3.15. If you are running
> Python 3.15, install the latest available wheels instead:
> ```
> pip install fastapi==0.111.0 "uvicorn[standard]" python-multipart Pillow numpy
> ```

## Installation

```bash
pip install -r requirements.txt
```

## Running the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

## API Endpoints

| Method | Path       | Description                                       |
|--------|-----------|---------------------------------------------------|
| GET    | `/`        | Health check — returns server status              |
| POST   | `/predict` | Upload an image; returns prediction + confidence  |

### GET `/`

**Response**
```json
{
  "status": "AI Image Detector API is running",
  "version": "1.0.0"
}
```

### POST `/predict`

**Request** — multipart/form-data

| Field | Type | Description          |
|-------|------|----------------------|
| file  | file | Image file to analyse (JPEG, PNG, WebP, …) |

**Response**
```json
{
  "prediction": "Real",
  "confidence": 0.8731,
  "filename": "photo.jpg",
  "image_size": [224, 224]
}
```

`prediction` is either `"Real"` or `"AI Generated"`.  
`confidence` is a float in `[0.70, 0.98]`.  
The result is **deterministic** — the same image always returns the same prediction.

**Error responses**

| Status | Reason                              |
|--------|-------------------------------------|
| 400    | Non-image file, corrupt image, empty file |
| 422    | Missing `file` field in the request |

## Running Tests

```bash
pip install pytest httpx
pytest test_main.py -v
```

## Interactive Docs

Swagger UI: `http://localhost:8000/docs`  
ReDoc:       `http://localhost:8000/redoc`
