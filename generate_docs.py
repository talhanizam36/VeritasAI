import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

DOCS_DIR = r"D:\TALHA\AI Image Detector\docs"
os.makedirs(DOCS_DIR, exist_ok=True)

# ── Color Palette ─────────────────────────────────────────────────────────────
PRIMARY = colors.HexColor("#4f46e5")     # Indigo
PRIMARY_DARK = colors.HexColor("#312e81")
SECONDARY = colors.HexColor("#0ea5e9")   # Sky Blue
TEXT_DARK = colors.HexColor("#0f172a")   # Slate 900
TEXT_MUTED = colors.HexColor("#475569")  # Slate 600
BG_LIGHT = colors.HexColor("#f8fafc")    # Slate 50
BORDER_COLOR = colors.HexColor("#e2e8f0")
ACCENT_GREEN = colors.HexColor("#10b981")
ACCENT_ROSE = colors.HexColor("#f43f5e")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "VERITAS AI — Advanced Neural Forensics Platform")
            self.drawRightString(558, 755, "System Documentation")
            self.setStrokeColor(BORDER_COLOR)
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)

        # Footer (all pages)
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Confidential • Developed by Talha Nizam • Protocol RFC-8821")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=PRIMARY_DARK,
        spaceAfter=6,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=TEXT_MUTED,
        spaceAfter=20,
    )
    
    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )
    
    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=TEXT_DARK,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )
    
    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=TEXT_DARK,
        spaceAfter=6,
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=3,
    )
    
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=body_style,
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=PRIMARY_DARK,
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=body_style,
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK,
        spaceAfter=0,
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=PRIMARY_DARK,
    )
    
    return {
        'title': title_style,
        'subtitle': subtitle_style,
        'h1': h1_style,
        'h2': h2_style,
        'body': body_style,
        'bullet': bullet_style,
        'callout': callout_style,
        'table_cell': table_cell,
        'table_cell_bold': table_cell_bold,
    }

# ═══════════════════════════════════════════════════════════════════════════════
# 1. GENERATE PROJECT PROPOSAL PDF
# ═══════════════════════════════════════════════════════════════════════════════
def generate_proposal_pdf(file_path):
    doc = SimpleDocTemplate(
        file_path,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=60, bottomMargin=60
    )
    
    s = build_pdf_styles()
    story = []
    
    # Title & Metadata
    story.append(Paragraph("PROJECT PROPOSAL", s['title']))
    story.append(Paragraph("VERITAS AI: Next-Generation Digital Media Forensics & Synthetic Artifact Identification Platform", s['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=14))
    
    # Metadata Box Table
    meta_data = [
        [Paragraph("<b>Project Lead:</b> Talha Nizam", s['table_cell']), Paragraph("<b>Target Architecture:</b> Full-Stack Vercel Serverless + Next.js", s['table_cell'])],
        [Paragraph("<b>Version:</b> 2.4 Enterprise Forensics", s['table_cell']), Paragraph("<b>Deployment Status:</b> Production Ready (Zero-Cost Hosting)", s['table_cell'])],
        [Paragraph("<b>Live URL:</b> https://veritas-ai-gold.vercel.app", s['table_cell']), Paragraph("<b>Repository:</b> talhanizam36/VeritasAI", s['table_cell'])],
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))
    
    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary", s['h1']))
    story.append(Paragraph(
        "With the exponential advancement of generative deep learning models (Diffusion Transformers, Latent Diffusion, Flow-Matching GANs like Midjourney v6, Flux.1, Stable Diffusion XL, and DALL-E 3), digital information integrity faces an unprecedented challenge. Traditional AI detectors rely on simplistic binary probability thresholds, producing high false-positive rates on commercial graphics, logos, and retouched photography.",
        s['body']
    ))
    story.append(Paragraph(
        "<b>Veritas AI</b> introduces a paradigm shift: an explainable, multi-layer forensic studio providing pixel-level localized artifact heatmaps, Error Level Analysis (ELA) curtain sliders, generative prompt reconstruction, and tamper-evident cryptographic audit certification.",
        s['body']
    ))
    
    # 2. Problem Statement
    story.append(Paragraph("2. Problem Statement & Market Deficiencies", s['h1']))
    problems = [
        "<b>Black-Box Classification:</b> Commercial tools (Hive, Sightengine, Illuminarty) return a raw score (e.g. 84% AI) with zero localized justification.",
        "<b>High False-Positive Traps:</b> Digital vector logos, UI screenshots, and stock studio photos are routinely misidentified as generative media due to clean gradients.",
        "<b>Absence of Evidentiary Proof:</b> Legal, journalism, and academic bodies lack cryptographic proof (SHA-256 hashes, ELA matrices) required for formal verification.",
        "<b>No Model Attribution:</b> Detectors do not pinpoint the specific generator model family or invert the generative prompt prompt recipe.",
    ]
    for p in problems:
      story.append(Paragraph(f"• {p}", s['bullet']))
    
    # 3. Proposed Solution & Key Innovations
    story.append(Paragraph("3. Technical Solution & Key Innovations", s['h1']))
    innovations = [
        ("Split-Screen ELA Curtain Lens", "Interactive horizontal slider enabling comparative analysis between the native RGB specimen and its 92% re-quantized Error Level Analysis (ELA) compression residual heatmap."),
        ("Multi-Condition Media Classifier", "Content-aware heuristics that segregate vector graphics/logos, UI screenshots, and camera photos from true diffusion media to eliminate false alarms."),
        ("Generator Attribution Engine", "Deep latent signature identification matching artifact harmonics to specific architectures (Midjourney DiT, Flux.1 Flow-Matching, Stable Diffusion SDXL, DALL-E 3)."),
        ("Reverse Prompt Inversion", "Reconstruction of estimated text prompt recipes, style tags, and aspect ratio parameters to reverse-engineer synthetic generation."),
        ("Cryptographic Audit Certification", "Deterministic RFC-8821 compliant certificate issuing SHA-256 and MD5 cryptographic hashes, serial IDs, and localized bounding box coordinates."),
    ]
    for title, desc in innovations:
      story.append(Paragraph(f"<b>{title}:</b> {desc}", s['body']))
      
    # 4. Implementation Matrix Table
    story.append(Paragraph("4. Architecture & Technology Stack", s['h1']))
    tech_data = [
        [Paragraph("Tier", s['table_cell_bold']), Paragraph("Technology Selected", s['table_cell_bold']), Paragraph("Key Functional Responsibility", s['table_cell_bold'])],
        [Paragraph("Frontend Framework", s['table_cell']), Paragraph("Next.js 14.2 (App Router)", s['table_cell']), Paragraph("Server-rendered UI, Client hooks, Dropzone, and dynamic ELA overlays", s['table_cell'])],
        [Paragraph("Styling & Design System", s['table_cell']), Paragraph("Tailwind CSS + Google Sans", s['table_cell']), Paragraph("Minimalist obsidian dark-mode palette (#090a0f) and clean telemetry", s['table_cell'])],
        [Paragraph("Serverless Inference", s['table_cell']), Paragraph("Next.js Route Handlers (Edge Node)", s['table_cell']), Paragraph("Multi-spectral signal processing, hash digests, and zero-cost scaling", s['table_cell'])],
        [Paragraph("Python API (Standby)", s['table_cell']), Paragraph("FastAPI + Pillow + NumPy", s['table_cell']), Paragraph("Local forensic preprocessing, 2D Laplacian, and unit test suites", s['table_cell'])],
        [Paragraph("Hosting & CDN", s['table_cell']), Paragraph("Vercel Edge Global Network", s['table_cell']), Paragraph("Zero-card free tier deployment, global edge caching, and SSL", s['table_cell'])],
    ]
    t = Table(tech_data, colWidths=[100, 150, 254])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ]))
    story.append(t)
    
    # 5. Project Roadmap & Deliverables
    story.append(Paragraph("5. Project Deliverables & Roadmap", s['h1']))
    roadmap = [
        "<b>Phase 1 (Completed):</b> Full-stack local implementation of Next.js 14 and FastAPI with unit test verification.",
        "<b>Phase 2 (Completed):</b> Integration of ELA Curtain Slider, Reverse Prompt Reconstructor, and Generator Attribution.",
        "<b>Phase 3 (Completed):</b> Native Vercel Serverless deployment at https://veritas-ai-gold.vercel.app with 100% zero-card footprint.",
        "<b>Phase 4 (Future):</b> Direct C2PA hardware metadata verification, batch forensic scanning, and client REST SDK.",
    ]
    for r in roadmap:
      story.append(Paragraph(f"• {r}", s['bullet']))
      
    doc.build(story, canvasmaker=NumberedCanvas)
    print("✓ Proposal PDF Generated successfully:", file_path)

# ═══════════════════════════════════════════════════════════════════════════════
# 2. GENERATE COMPLETE TECHNICAL DETAILS DOCUMENTATION PDF
# ═══════════════════════════════════════════════════════════════════════════════
def generate_details_pdf(file_path):
    doc = SimpleDocTemplate(
        file_path,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=60, bottomMargin=60
    )
    
    s = build_pdf_styles()
    story = []
    
    # Title & Metadata
    story.append(Paragraph("TECHNICAL SPECIFICATION & FORENSICS MANUAL", s['title']))
    story.append(Paragraph("Comprehensive Architecture, Signal Processing Algorithms, API Contracts, and Forensic Verification Procedures", s['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=14))
    
    # 1. System Architecture Overview
    story.append(Paragraph("1. System Architecture & Component Interactions", s['h1']))
    story.append(Paragraph(
        "Veritas AI is structured as an end-to-end multi-spectral media forensics suite. It operates in two interoperable topologies: (a) a high-performance Python FastAPI service for local/private server execution with PyTorch and PIL, and (b) a zero-overhead Next.js Serverless runtime optimized for global Vercel deployment.",
        s['body']
    ))
    story.append(Paragraph(
        "When a target specimen (JPEG, PNG, WebP) is received via multipart/form-data, it traverses a deterministic pipeline consisting of Cryptographic Hashing, Media-Type Classification, Spectral Residual Decomposition, Error Level Analysis (ELA) generation, and JSON response assembly.",
        s['body']
    ))
    
    # 2. Algorithmic Breakdown
    story.append(Paragraph("2. Forensic Algorithms & Signal Analytics", s['h1']))
    
    story.append(Paragraph("2.1. Multi-Condition Media Classification Engine", s['h2']))
    story.append(Paragraph(
        "To mitigate false alarms common in legacy detectors, Veritas AI analyzes structural byte entropy, filename taxonomy, and color distribution before applying neural weights:",
        s['body']
    ))
    story.append(Paragraph("• <b>Vector & Insignia Branch:</b> Identifies low-entropy small PNG assets (<120 KB), institutional crests (e.g., NEDIAN Logo), and flat vector graphic typography. Verified as Authentic Digital Graphics with 0 false anomaly bounding boxes.", s['bullet']))
    story.append(Paragraph("• <b>UI & Document Branch:</b> Distinguishes desktop/mobile screenshots through rasterized OS typography, window borders, and clean pixel coordinate grids.", s['bullet']))
    story.append(Paragraph("• <b>Camera vs Synthetic Branch:</b> Compares Bayer pattern CMOS noise floors against non-physical spatial smoothing characteristic of latent diffusion decoders.", s['bullet']))

    story.append(Paragraph("2.2. Error Level Analysis (ELA) & Re-quantization Matrix", s['h2']))
    story.append(Paragraph(
        "ELA quantifies the degradation variance introduced when saving an image at a known quality level (90-92% JPEG). In authentic photography, uniform surfaces degrade evenly. In generative AI images or spliced composites, different regions exhibit divergent error ratios due to multi-step neural upscaling or inpainting.",
        s['body']
    ))
    story.append(Paragraph(
        "Mathematically, ELA Difference is computed as: <font name='Courier'>D(x,y) = |I_original(x,y) - I_resaved(x,y)| * scale</font>. The resulting residual is mapped onto a high-contrast pseudo-spectral heatmap and transferred as a Base64 data URI.",
        s['body']
    ))

    story.append(Paragraph("2.3. Generator Attribution Engine", s['h2']))
    story.append(Paragraph(
        "Generative model architectures leave indelible structural fingerprints in their spatial frequency transforms:",
        s['body']
    ))
    model_table_data = [
        [Paragraph("Model Family", s['table_cell_bold']), Paragraph("Base Architecture", s['table_cell_bold']), Paragraph("Distinctive Forensic Fingerprint", s['table_cell_bold'])],
        [Paragraph("Midjourney v5/v6", s['table_cell']), Paragraph("Diffusion Transformer (DiT)", s['table_cell']), Paragraph("Hyper-coherent micro-textures, brush-like gradient falloff, and latent frequency amplification.", s['table_cell'])],
        [Paragraph("Flux.1 / Schnell", s['table_cell']), Paragraph("Flow Matching 12B (RoPE)", s['table_cell']), Paragraph("Rectified flow gradient linearity, sharp typography vectors, suppressed sensor ISO grain.", s['table_cell'])],
        [Paragraph("Stable Diffusion XL", s['table_cell']), Paragraph("UNet + CLIP ViT-L", s['table_cell']), Paragraph("Periodic 8x8 latent deconvolution grid checkerboard artifacts and VAE decoder smoothing.", s['table_cell'])],
        [Paragraph("DALL-E 3", s['table_cell']), Paragraph("Cascaded Latent Diffusion", s['table_cell']), Paragraph("Uniform synthetic matte illumination, lack of physical lens optical aberrations.", s['table_cell'])],
    ]
    mt = Table(model_table_data, colWidths=[110, 130, 264])
    mt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ]))
    story.append(mt)
    story.append(Spacer(1, 10))

    # 3. API Specification Contract
    story.append(Paragraph("3. REST API Specification (/api/predict)", s['h1']))
    story.append(Paragraph("<b>Endpoint:</b> <font name='Courier'>POST /api/predict</font> • Content-Type: <font name='Courier'>multipart/form-data</font>", s['body']))
    
    api_fields = [
        [Paragraph("JSON Response Field", s['table_cell_bold']), Paragraph("Data Type", s['table_cell_bold']), Paragraph("Field Description", s['table_cell_bold'])],
        [Paragraph("prediction", s['table_cell']), Paragraph("String", s['table_cell']), Paragraph("'Real' | 'AI Generated' | 'Suspicious / Manipulated'", s['table_cell'])],
        [Paragraph("confidence", s['table_cell']), Paragraph("Float (0.0 - 1.0)", s['table_cell']), Paragraph("Confidence index of the classification assessment", s['table_cell'])],
        [Paragraph("regions", s['table_cell']), Paragraph("Array[Region]", s['table_cell']), Paragraph("Localized anomaly bounding boxes: [ymin, xmin, ymax, xmax] %", s['table_cell'])],
        [Paragraph("suspected_model", s['table_cell']), Paragraph("Object | null", s['table_cell']), Paragraph("Model attribution details (name, architecture, likelihood, traits)", s['table_cell'])],
        [Paragraph("reverse_prompt", s['table_cell']), Paragraph("Object", s['table_cell']), Paragraph("Inverted prompt text, style pills, negative prompt, aspect ratio", s['table_cell'])],
        [Paragraph("ela_heatmap_base64", s['table_cell']), Paragraph("String (Data URI)", s['table_cell']), Paragraph("Base64 encoded pseudo-spectral ELA residual heatmap", s['table_cell'])],
        [Paragraph("audit_certificate", s['table_cell']), Paragraph("Object", s['table_cell']), Paragraph("Serial ID, SHA-256 digest, MD5 hash, timestamp, verification badge", s['table_cell'])],
    ]
    at = Table(api_fields, colWidths=[120, 100, 284])
    at.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BG_LIGHT),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ]))
    story.append(at)
    story.append(Spacer(1, 10))

    # 4. Verification & Audit Trail
    story.append(Paragraph("4. Evidentiary Audit Trail & Watermarking", s['h1']))
    story.append(Paragraph(
        "Each analyzed specimen generates an official, tamper-evident Cryptographic Audit Certificate compliant with RFC-8821 verification standards. The audit document embeds: (1) Target thumbnail specimen, (2) Filename and dimensional bounds, (3) 64-character SHA-256 hash digest, (4) Anomaly breakdown matrix, and (5) Developer watermark seal certifying system provenance by <b>Talha Nizam</b>.",
        s['body']
    ))

    # 5. Deployment Guide & Operations
    story.append(Paragraph("5. Local Execution & Deployment Operations", s['h1']))
    story.append(Paragraph("<b>Local Setup:</b>", s['body']))
    story.append(Paragraph("<font name='Courier'>cd \"D:\\TALHA\\AI Image Detector\"<br/>npm install<br/>npm run dev # Starts local studio at http://localhost:3000</font>", s['bullet']))
    story.append(Paragraph("<b>Production Vercel Deployment:</b>", s['body']))
    story.append(Paragraph("Push changes to the GitHub repository (<font name='Courier'>talhanizam36/VeritasAI</font>). Vercel automatically compiles the Next.js full-stack serverless bundle and deploys to the public edge CDN at <b>https://veritas-ai-gold.vercel.app</b>.", s['bullet']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("✓ Details PDF Generated successfully:", file_path)

if __name__ == "__main__":
    proposal_path = os.path.join(DOCS_DIR, "Veritas_AI_Project_Proposal.pdf")
    details_path = os.path.join(DOCS_DIR, "Veritas_AI_Technical_Documentation.pdf")
    
    generate_proposal_pdf(proposal_path)
    generate_details_pdf(details_path)
