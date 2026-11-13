"""
Tests for AI Image Detector FastAPI backend.
Run with: python -m pytest test_main.py -v
"""
import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def make_test_image(width=100, height=100, color=(128, 128, 128)) -> bytes:
    """Create a minimal in-memory PNG image for testing."""
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# ---------------------------------------------------------------------------
# GET / – health check
# ---------------------------------------------------------------------------
class TestHealthCheck:
    def test_root_returns_200(self):
        resp = client.get("/")
        assert resp.status_code == 200

    def test_root_contains_status(self):
        resp = client.get("/")
        body = resp.json()
        assert "status" in body
        assert "running" in body["status"].lower()


# ---------------------------------------------------------------------------
# POST /predict – schema and detection
# ---------------------------------------------------------------------------
class TestPredictHappyPath:
    def test_predict_accepts_png_and_returns_200(self):
        image_bytes = make_test_image()
        resp = client.post(
            "/predict",
            files={"file": ("test.png", image_bytes, "image/png")},
        )
        assert resp.status_code == 200

    def test_predict_response_schema(self):
        image_bytes = make_test_image(width=150, height=120)
        resp = client.post(
            "/predict",
            files={"file": ("sample.png", image_bytes, "image/png")},
        )
        assert resp.status_code == 200
        body = resp.json()

        # Schema fields
        assert body["prediction"] in ("Real", "AI Generated", "Suspicious / Manipulated")
        assert 0.0 <= body["confidence"] <= 1.0
        assert body["filename"] == "sample.png"
        assert body["image_size"] == [150, 120]
        assert isinstance(body["overall_analysis"], str) and len(body["overall_analysis"]) > 10

        # Metrics
        assert "metrics" in body
        metrics = body["metrics"]
        for key in ("noise_residual", "high_frequency_energy", "symmetry_score", "compression_anomaly"):
            assert key in metrics
            assert isinstance(metrics[key], (int, float))
            assert 0.0 <= metrics[key] <= 1.0

        # ELA Heatmap
        assert "ela_heatmap_base64" in body
        assert isinstance(body["ela_heatmap_base64"], str)
        assert body["ela_heatmap_base64"].startswith("data:image/png;base64,")
        assert len(body["ela_heatmap_base64"]) > 50

        # Reverse Prompt
        assert "reverse_prompt" in body
        rp = body["reverse_prompt"]
        if rp is not None:
            assert isinstance(rp["full_prompt"], str) and len(rp["full_prompt"]) > 5
            assert isinstance(rp["style_tags"], list) and len(rp["style_tags"]) > 0
            assert isinstance(rp["negative_prompt_hints"], str)
            assert isinstance(rp["suggested_aspect_ratio"], str)

        # Audit Certificate
        assert "audit_certificate" in body
        cert = body["audit_certificate"]
        assert cert["certificate_id"].startswith("VERITAS-2026-")
        assert len(cert["sha256_hash"]) == 64
        assert len(cert["md5_hash"]) == 32
        assert isinstance(cert["issue_timestamp"], str)
        assert cert["verification_status"] in (
            "PASS (AUTHENTIC)",
            "FAIL (SYNTHETIC MEDIA DETECTED)",
            "FLAGGED (INCONCLUSIVE)",
        )
        assert len(cert["signature_digest"]) == 64

        # Regions
        assert "regions" in body
        assert isinstance(body["regions"], list)
        for region in body["regions"]:
            assert "id" in region
            assert "box" in region
            assert len(region["box"]) == 4
            ymin, xmin, ymax, xmax = region["box"]
            assert 0.0 <= ymin <= 100.0
            assert 0.0 <= xmin <= 100.0
            assert 0.0 <= ymax <= 100.0
            assert 0.0 <= xmax <= 100.0
            assert ymax >= ymin
            assert xmax >= xmin
            assert region["severity"] in ("high", "medium", "low")
            assert 0.0 <= region["confidence"] <= 1.0
            assert 0.0 <= region["spectral_score"] <= 1.0
            assert isinstance(region["label"], str) and len(region["label"]) > 0
            assert isinstance(region["description"], str) and len(region["description"]) > 0

    def test_predict_accepts_jpeg(self):
        img = Image.new("RGB", (50, 50), color=(200, 100, 50))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        resp = client.post(
            "/predict",
            files={"file": ("photo.jpg", buf.getvalue(), "image/jpeg")},
        )
        assert resp.status_code == 200

    def test_predict_accepts_webp(self):
        img = Image.new("RGB", (50, 50), color=(10, 20, 30))
        buf = io.BytesIO()
        img.save(buf, format="WEBP")
        resp = client.post(
            "/predict",
            files={"file": ("photo.webp", buf.getvalue(), "image/webp")},
        )
        assert resp.status_code == 200


# ---------------------------------------------------------------------------
# POST /predict – determinism
# ---------------------------------------------------------------------------
class TestPredictDeterminism:
    def test_same_image_gives_same_prediction(self):
        image_bytes = make_test_image(color=(55, 100, 200))
        resp1 = client.post(
            "/predict",
            files={"file": ("a.png", image_bytes, "image/png")},
        )
        resp2 = client.post(
            "/predict",
            files={"file": ("a.png", image_bytes, "image/png")},
        )
        assert resp1.json()["prediction"] == resp2.json()["prediction"]
        assert resp1.json()["confidence"] == resp2.json()["confidence"]
        assert resp1.json()["metrics"] == resp2.json()["metrics"]
        assert resp1.json()["regions"] == resp2.json()["regions"]

    def test_different_images_produce_valid_results(self):
        img_a = make_test_image(color=(0, 0, 0))
        img_b = make_test_image(color=(255, 255, 255))
        for img_bytes, name in [(img_a, "black.png"), (img_b, "white.png")]:
            resp = client.post(
                "/predict",
                files={"file": (name, img_bytes, "image/png")},
            )
            assert resp.status_code == 200
            assert resp.json()["prediction"] in ("Real", "AI Generated", "Suspicious / Manipulated")


# ---------------------------------------------------------------------------
# POST /predict – error handling
# ---------------------------------------------------------------------------
class TestPredictErrors:
    def test_non_image_file_returns_400(self):
        resp = client.post(
            "/predict",
            files={"file": ("notes.txt", b"hello world", "text/plain")},
        )
        assert resp.status_code == 400

    def test_corrupt_image_returns_400(self):
        resp = client.post(
            "/predict",
            files={"file": ("bad.png", b"\x89PNG corrupted bytes!!", "image/png")},
        )
        assert resp.status_code == 400

    def test_empty_file_returns_400(self):
        resp = client.post(
            "/predict",
            files={"file": ("empty.png", b"", "image/png")},
        )
        assert resp.status_code == 400
