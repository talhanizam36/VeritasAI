import os
import re
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib import colors
import html

# Output directly to the root project directory:
target_pdf = r"D:\TALHA\AI Image Detector\Veritas_AI_Defense_Presentation_Script.pdf"
doc = SimpleDocTemplate(
    target_pdf,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

COLOR_NAVY = colors.HexColor('#19273C')
COLOR_ORANGE = colors.HexColor('#FF7029')
COLOR_SLATE_BG = colors.HexColor('#F8FAFC')
COLOR_CARD_BORDER = colors.HexColor('#CBD5E1')
COLOR_TEXT_DARK = colors.HexColor('#0F172A')
COLOR_TEXT_MUTED = colors.HexColor('#64748B')
COLOR_WHITE = colors.HexColor('#FFFFFF')

styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    'DocTitle',
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=COLOR_NAVY
)

style_sub = ParagraphStyle(
    'DocSub',
    fontName='Helvetica',
    fontSize=9.5,
    leading=13,
    textColor=COLOR_TEXT_MUTED
)

style_slide_title = ParagraphStyle(
    'SlideTitle',
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=15,
    textColor=COLOR_NAVY
)

style_visual_hint = ParagraphStyle(
    'VisualHint',
    fontName='Helvetica-Oblique',
    fontSize=8.5,
    leading=11,
    textColor=COLOR_ORANGE
)

style_script = ParagraphStyle(
    'ScriptText',
    fontName='Helvetica',
    fontSize=9,
    leading=13.5,
    textColor=COLOR_TEXT_DARK
)

style_qa_q = ParagraphStyle(
    'QAQuestion',
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=13.5,
    textColor=COLOR_ORANGE,
    spaceBefore=4,
    spaceAfter=2
)

style_qa_a = ParagraphStyle(
    'QAAnswer',
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=COLOR_TEXT_DARK,
    spaceAfter=4
)

def md_to_reportlab(text):
    """Converts markdown bold **text** to <b>text</b> cleanly without unbalanced tags."""
    # Escape basic XML chars first
    text = html.escape(text, quote=False)
    # Convert **word** to <b>word</b>
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    # Convert *word* to <i>word</i>
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    # Convert `code` to <b>code</b>
    text = re.sub(r'`(.+?)`', r'<b>\1</b>', text)
    return text

# Read source markdown
md_path = r"D:\TALHA\AI Image Detector\docs\Veritas_AI_Defense_Presentation_Script.md"
with open(md_path, 'r', encoding='utf-8') as f:
    raw_md = f.read()

story = []

# Header Table
header_cell = [
    Paragraph('<b>VERITAS AI — SEMESTER DEFENSE PRESENTATION SCRIPT</b>', style_title),
    Spacer(1, 4),
    Paragraph('<b>Student Presenter:</b> Talha Nizam (Roll No. CT-050/2025) &nbsp;|&nbsp; <b>Course:</b> Image Processing & Computer Vision (IPCV)', style_sub),
    Paragraph('<b>Live Web System:</b> <font color="#FF7029">https://veritas-ai-gold.vercel.app</font> &nbsp;|&nbsp; <b>GitHub:</b> github.com/talhanizam36/VeritasAI', style_sub),
]
header_table = Table([[header_cell]], colWidths=[540])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), COLOR_SLATE_BG),
    ('BOX', (0,0), (-1,-1), 1.2, COLOR_CARD_BORDER),
    ('LINEBEFORE', (0,0), (0,-1), 4, COLOR_ORANGE),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 14),
    ('RIGHTPADDING', (0,0), (-1,-1), 14),
]))
story.append(header_table)
story.append(Spacer(1, 12))

# Extract Slides 1 to 10
parts = raw_md.split('## 💡 EXAMINER Q&A CHEAT-SHEET')
slides_md = parts[0]
qa_md = parts[1] if len(parts) > 1 else ''

slide_sections = slides_md.split('## 🎙️ ')
for sec in slide_sections[1:]:
    lines = sec.strip().split('\n')
    s_title_raw = lines[0].strip()
    
    hint_text = ''
    script_paragraphs = []
    
    for l in lines[1:]:
        l = l.strip()
        if not l or l.startswith('---'):
            continue
        if l.startswith('*(') and l.endswith(')*'):
            hint_text = l.replace('*(', '').replace(')*', '').strip()
        elif l.startswith('>'):
            clean = l.replace('> ', '').replace('>','')
            clean = clean.replace('**[Spoken Script]**', '').strip()
            # remove leading/trailing quotes if standalone
            clean = clean.strip('"').strip("'")
            if clean:
                script_paragraphs.append(md_to_reportlab(clean))
        else:
            clean = l.strip()
            if clean:
                script_paragraphs.append(md_to_reportlab(clean))
    
    full_script = '<br/><br/>'.join(script_paragraphs)
    
    card_content = [
        Paragraph(f'<b>🎙️ {md_to_reportlab(s_title_raw)}</b>', style_slide_title),
        Paragraph(f'<i>Visual Cue: {html.escape(hint_text)}</i>', style_visual_hint),
        Spacer(1, 4),
        Paragraph(full_script, style_script)
    ]
    
    slide_card = Table([[card_content]], colWidths=[540])
    slide_card.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_WHITE),
        ('BOX', (0,0), (-1,-1), 1, COLOR_CARD_BORDER),
        ('LINEBEFORE', (0,0), (0,-1), 3.5, COLOR_NAVY if '10' not in s_title_raw and '01' not in s_title_raw else COLOR_ORANGE),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    
    story.append(KeepTogether([slide_card, Spacer(1, 8)]))

# Q&A Cheat Sheet Section
if qa_md:
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width='100%', thickness=1.5, color=COLOR_ORANGE, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph('<b>💡 TOP EXAMINER VIVA QUESTIONS & DEFENSE ANSWERS</b>', style_title))
    story.append(Spacer(1, 4))
    
    qa_blocks = qa_md.split('### **')
    for qb in qa_blocks[1:]:
        q_lines = qb.strip().split('\n')
        q_title = q_lines[0].replace('**', '').strip()
        a_lines = []
        for line in q_lines[1:]:
            line = line.strip()
            if not line:
                continue
            clean_l = line.replace('> ', '').replace('>','').strip()
            clean_l = clean_l.replace('Answer:', '<b>Defense Answer:</b>')
            a_lines.append(md_to_reportlab(clean_l))
            
        a_content = ' '.join(a_lines)
        
        qa_content = [
            Paragraph(f'<b>❓ {html.escape(q_title)}</b>', style_qa_q),
            Paragraph(a_content, style_qa_a)
        ]
        qa_table = Table([[qa_content]], colWidths=[540])
        qa_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_SLATE_BG),
            ('BOX', (0,0), (-1,-1), 0.8, COLOR_CARD_BORDER),
            ('LINEBEFORE', (0,0), (0,-1), 2.5, COLOR_ORANGE),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(KeepTogether([qa_table, Spacer(1, 6)]))

doc.build(story)
print("Successfully generated clean, professional PDF:", target_pdf)

# Also copy markdown into same directory
shutil.copyfile(md_path, r"D:\TALHA\AI Image Detector\Veritas_AI_Defense_Presentation_Script.md")
print("Also placed markdown script in D:\\TALHA\\AI Image Detector\\")
