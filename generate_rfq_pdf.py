#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, sys, re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER

def setup_chinese_fonts():
    fonts = [
        ('WenQuanYi Micro Hei', '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc'),
        ('Noto Sans CJK SC', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'),
        ('Droid Sans Fallback', '/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf'),
    ]
    for name, path in fonts:
        try:
            if os.path.exists(path):
                pdfmetrics.registerFont(TTFont(name, path))
                print(f"✓ Font: {name}")
                return name
        except: pass
    for d in ['/usr/share/fonts/truetype/wqy/', '/usr/share/fonts/truetype/noto/', '/usr/share/fonts/']:
        if os.path.exists(d):
            for root, dirs, files in os.walk(d):
                for f in files:
                    if f.endswith(('.ttf', '.ttc')):
                        try:
                            pdfmetrics.registerFont(TTFont('ChineseFont', os.path.join(root, f)))
                            print(f"✓ System font: {f}")
                            return 'ChineseFont'
                        except: pass
    print("✗ No Chinese fonts")
    return None

def parse_md(content):
    lines, sections, cur_section, cur_list = content.split('\n'), [], None, None
    for line in lines:
        line = line.rstrip()
        if not line:
            if cur_list:
                cur_section['content'].append(('list', cur_list))
                cur_list = None
            continue
        if line.startswith('#'):
            if cur_list:
                cur_section['content'].append(('list', cur_list))
                cur_list = None
            if cur_section: sections.append(cur_section)
            level, text = len(re.match(r'^#+', line).group()), line.lstrip('#').strip()
            cur_section = {'level': level, 'title': text, 'content': []}
        elif line.strip().startswith(('-', '*', '+')):
            if not cur_list: cur_list = []
            cur_list.append(line.strip().lstrip('-*+').strip())
        else:
            if cur_list:
                cur_section['content'].append(('list', cur_list))
                cur_list = None
            if cur_section: cur_section['content'].append(('para', line))
    if cur_section:
        if cur_list: cur_section['content'].append(('list', cur_list))
        sections.append(cur_section)
    return sections

def gen_pdf(input_file, output_file, font):
    with open(input_file, 'r', encoding='utf-8') as f: content = f.read()
    sections = parse_md(content)
    doc = SimpleDocTemplate(output_file, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    if font:
        styles.add(ParagraphStyle(name='CustomTitle', parent=styles['Heading1'], fontName=font, fontSize=24, textColor='#2E5C8A', spaceAfter=30, alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='CustomH1', parent=styles['Heading1'], fontName=font, fontSize=18, textColor='#2E5C8A', spaceAfter=12))
        styles.add(ParagraphStyle(name='CustomBody', parent=styles['BodyText'], fontName=font, fontSize=10, leading=14, spaceAfter=12))
        styles.add(ParagraphStyle(name='CustomItem', parent=styles['BodyText'], fontName=font, fontSize=10, leading=14, leftIndent=20))
    story = [Paragraph(os.path.basename(input_file).replace('.md', ''), styles['CustomTitle']), Spacer(1, 0.2*inch)]
    for s in sections:
        if s['level'] == 1: story.append(Paragraph(s['title'], styles['CustomH1']))
        story.append(Spacer(1, 0.1*inch))
        for typ, data in s['content']:
            if typ == 'para':
                story.append(Paragraph(data, styles['CustomBody']))
                story.append(Spacer(1, 0.1*inch))
            elif typ == 'list':
                for item in data:
                    story.append(Paragraph(f"• {item}", styles['CustomItem']))
                story.append(Spacer(1, 0.1*inch))
    doc.build(story)
    print(f"✓ PDF: {output_file}")

input_file, output_file = '/home/e/.openclaw/workspace/Flash360_RFQ_Content.md', '/home/e/.openclaw/workspace/Flash360_RFQ_充电柜充电宝询价单.pdf'
if not os.path.exists(input_file):
    print(f"✗ Input not found: {input_file}")
    sys.exit(1)
print("Setting up fonts...")
font = setup_chinese_fonts()
gen_pdf(input_file, output_file, font)
if os.path.exists(output_file):
    size = os.path.getsize(output_file)
    print(f"✓ Size: {size:,} bytes ({size/1024/1024:.2f} MB)")
    print("READY_FOR_QA")
