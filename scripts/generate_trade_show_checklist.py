from pathlib import Path

from reportlab.graphics import renderPDF
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "trade-show-giveaway-planning-checklist.pdf"
SITE_COPY = ROOT / "assets" / "downloads" / "trade-show-giveaway-planning-checklist.pdf"
HERO_IMAGE = ROOT / "assets" / "trade-show-giveaways" / "lead-capture-booth-kit-v2.webp"

PAGE_W, PAGE_H = A4
MARGIN = 42
NAVY = HexColor("#071724")
NAVY_2 = HexColor("#0D2944")
CREAM = HexColor("#F6EFE6")
PAPER = HexColor("#FFFAF3")
INK = HexColor("#0B2034")
TEXT = HexColor("#30465A")
MUTED = HexColor("#68778A")
GOLD = HexColor("#D99B38")
GOLD_2 = HexColor("#F0BF68")
BLUE = HexColor("#1565C0")
LIGHT_BLUE = HexColor("#E5EEF7")
LINE = Color(11 / 255, 32 / 255, 52 / 255, alpha=0.18)


def wrap_text(text, font_name, font_size, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if stringWidth(candidate, font_name, font_size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, y, max_width, font="Helvetica", size=9, leading=12, color=TEXT, max_lines=None):
    lines = wrap_text(text, font, size, max_width)
    if max_lines:
        lines = lines[:max_lines]
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_checkbox(c, x, y, label, checked=False, font_size=8.5, width=220):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.roundRect(x, y - 8, 11, 11, 2, stroke=1, fill=0)
    if checked:
        c.setStrokeColor(BLUE)
        c.setLineWidth(1.4)
        c.line(x + 2.5, y - 2, x + 5, y - 5)
        c.line(x + 5, y - 5, x + 9, y + 1)
    return draw_wrapped(c, label, x + 17, y + 1, width - 17, size=font_size, leading=10.5, color=TEXT)


def draw_field(c, x, y, label, width, value=""):
    c.setFont("Helvetica-Bold", 7.4)
    c.setFillColor(MUTED)
    c.drawString(x, y, label.upper())
    c.setStrokeColor(LINE)
    c.setLineWidth(0.75)
    c.line(x, y - 17, x + width, y - 17)
    if value:
        c.setFont("Helvetica", 9)
        c.setFillColor(TEXT)
        c.drawString(x, y - 13, value)


def draw_section_title(c, number, title, y, subtitle=None):
    c.setFillColor(GOLD)
    c.roundRect(MARGIN, y - 3, 26, 26, 7, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(MARGIN + 13, y + 6, str(number))
    c.setFillColor(INK)
    c.setFont("Times-Bold", 22)
    c.drawString(MARGIN + 38, y + 2, title)
    if subtitle:
        draw_wrapped(c, subtitle, MARGIN + 38, y - 13, PAGE_W - MARGIN * 2 - 38, size=8.5, leading=10.5, color=MUTED)


def draw_header(c, page_num, title):
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 58, PAGE_W, 58, fill=1, stroke=0)
    c.setFont("Times-Bold", 17)
    c.setFillColor(white)
    c.drawString(MARGIN, PAGE_H - 35, "FY PromoGifts")
    c.setFont("Helvetica", 8)
    c.setFillColor(Color(1, 1, 1, alpha=0.72))
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 34, title)
    draw_footer(c, page_num)


def draw_footer(c, page_num):
    c.setStrokeColor(LINE)
    c.line(MARGIN, 29, PAGE_W - MARGIN, 29)
    c.setFont("Helvetica", 7.4)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 17, "fypromogifts.com  |  info@fypromogifts.com  |  +86 158 6911 7529")
    c.drawRightString(PAGE_W - MARGIN, 17, f"{page_num} / 4")


def draw_qr(c, url, x, y, size=58):
    widget = qr.QrCodeWidget(url)
    bounds = widget.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    drawing = Drawing(size, size, transform=[size / width, 0, 0, size / height, -bounds[0], -bounds[1]])
    drawing.add(widget)
    renderPDF.draw(drawing, c, x, y)


def draw_cover(c):
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 64, PAGE_W, 64, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Times-Bold", 20)
    c.drawString(MARGIN, PAGE_H - 40, "FY PromoGifts")
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(GOLD_2)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 38, "BUYER WORKSHEET")

    image = ImageReader(str(HERO_IMAGE))
    image_w = PAGE_W - MARGIN * 2
    image_h = image_w / 1.5
    image_y = PAGE_H - 64 - 24 - image_h
    c.setFillColor(white)
    c.roundRect(MARGIN, image_y, image_w, image_h, 14, fill=1, stroke=0)
    c.saveState()
    path = c.beginPath()
    path.roundRect(MARGIN, image_y, image_w, image_h, 14)
    c.clipPath(path, stroke=0, fill=0)
    c.drawImage(image, MARGIN, image_y, image_w, image_h, preserveAspectRatio=True, anchor="c", mask="auto")
    c.restoreState()

    title_y = image_y - 42
    c.setFillColor(INK)
    c.setFont("Times-Bold", 29)
    c.drawString(MARGIN, title_y, "Trade Show Giveaway")
    c.drawString(MARGIN, title_y - 34, "Planning Checklist")
    draw_wrapped(
        c,
        "A practical briefing worksheet for exhibitors, agencies and event teams.",
        MARGIN,
        title_y - 58,
        405,
        size=10.5,
        leading=14,
        color=TEXT,
    )

    fields_y = title_y - 103
    draw_field(c, MARGIN, fields_y, "Event / campaign", 248)
    draw_field(c, MARGIN + 270, fields_y, "Prepared by", 241)
    draw_field(c, MARGIN, fields_y - 45, "Venue / city / country", 248)
    draw_field(c, MARGIN + 270, fields_y - 45, "Show dates", 115)
    draw_field(c, MARGIN + 396, fields_y - 45, "Must-arrive date", 115)

    note_y = fields_y - 86
    c.setFillColor(PAPER)
    c.roundRect(MARGIN, note_y - 55, PAGE_W - MARGIN * 2, 65, 12, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 15, note_y - 8, "HOW TO USE THIS WORKSHEET")
    draw_wrapped(
        c,
        "Complete the audience and quantity plan first. Shortlist products only after the distribution rule, budget band and must-arrive date are clear. Send the completed pages with your logo files when requesting a quotation.",
        MARGIN + 15,
        note_y - 25,
        395,
        size=8.5,
        leading=11,
    )
    draw_qr(c, "https://www.fypromogifts.com/trade-show-giveaway-kits/", PAGE_W - MARGIN - 58, note_y - 51, 58)
    draw_footer(c, 1)


def draw_page_two(c):
    draw_header(c, 2, "Audience, goal and quantities")
    y = PAGE_H - 92
    draw_section_title(
        c,
        1,
        "Define the event before choosing products",
        y,
        "The distribution plan is the working brief. It prevents premium items from being handed out too early and helps staff know what to offer after each type of interaction.",
    )
    y -= 57
    draw_field(c, MARGIN, y, "Event name", 240)
    draw_field(c, MARGIN + 260, y, "Venue / city", 253)
    draw_field(c, MARGIN, y - 42, "Event dates", 155)
    draw_field(c, MARGIN + 175, y - 42, "Move-in / setup date", 155)
    draw_field(c, MARGIN + 350, y - 42, "Must-arrive date", 163)
    draw_field(c, MARGIN, y - 84, "Project owner", 240)
    draw_field(c, MARGIN + 260, y - 84, "On-site contact and mobile", 253)

    table_y = y - 124
    cols = [88, 125, 64, 72, 164]
    headers = ["Audience tier", "Purpose", "Expected", "Planned qty", "Handoff rule"]
    rows = [
        ("Walk-up traffic", "Start a conversation", "", "", "At aisle, counter or prize station"),
        ("Scanned leads", "Support a qualified exchange", "", "", "After scan, demo or form completion"),
        ("Booth staff", "Equip the working team", "", "", "Packed by person, role or shift"),
        ("VIP / partner", "Recognize priority meetings", "", "", "By appointment or post-show shipment"),
    ]
    x = MARGIN
    c.setFillColor(NAVY_2)
    c.roundRect(MARGIN, table_y - 25, sum(cols), 25, 7, fill=1, stroke=0)
    for header, width in zip(headers, cols):
        c.setFont("Helvetica-Bold", 7.2)
        c.setFillColor(white)
        c.drawString(x + 7, table_y - 16, header.upper())
        x += width
    row_h = 54
    current_y = table_y - 25
    for row_index, row in enumerate(rows):
        c.setFillColor(PAPER if row_index % 2 == 0 else white)
        c.rect(MARGIN, current_y - row_h, sum(cols), row_h, fill=1, stroke=0)
        x = MARGIN
        for value, width in zip(row, cols):
            c.setStrokeColor(LINE)
            c.rect(x, current_y - row_h, width, row_h, fill=0, stroke=1)
            if value:
                draw_wrapped(c, value, x + 7, current_y - 16, width - 14, font="Helvetica-Bold" if x == MARGIN else "Helvetica", size=7.6, leading=10, color=INK if x == MARGIN else TEXT, max_lines=3)
            else:
                c.setStrokeColor(LINE)
                c.line(x + 8, current_y - 31, x + width - 8, current_y - 31)
            x += width
        current_y -= row_h

    y = current_y - 32
    c.setFont("Times-Bold", 17)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Quantity checks")
    y -= 24
    left_items = [
        "Attendance estimate came from the organizer or event history.",
        "Staff quantity includes setup crew, speakers and replacements.",
        "A small reserve is planned for damage, loss and late additions.",
    ]
    right_items = [
        "Giveaway quantities follow an actual handoff rule, not total attendance alone.",
        "VIP names and delivery addresses have an owner and deadline.",
        "Product MOQ will be checked before the item mix is approved.",
    ]
    for index, label in enumerate(left_items):
        draw_checkbox(c, MARGIN, y - index * 28, label, width=245)
    for index, label in enumerate(right_items):
        draw_checkbox(c, MARGIN + 270, y - index * 28, label, width=243)

    y -= 102
    c.setFillColor(LIGHT_BLUE)
    c.roundRect(MARGIN, y - 50, PAGE_W - MARGIN * 2, 62, 10, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 14, y - 8, "WORKING RULE")
    draw_wrapped(c, "Do not assign one giveaway to every attendee by default. Use a low-cost traffic item for reach, a useful item for qualified conversations and a limited premium item for meetings or follow-up.", MARGIN + 14, y - 25, PAGE_W - MARGIN * 2 - 28, size=8.5, leading=11)
    c.showPage()


def draw_page_three(c):
    draw_header(c, 3, "Products, artwork and budget")
    y = PAGE_H - 92
    draw_section_title(
        c,
        2,
        "Use a budget band to narrow the shortlist",
        y,
        "These are product-only planning bands, not quotations. Quantity, material, imprint, setup, packaging, freight, duties and delivery timing can move the final cost.",
    )
    y -= 62
    card_gap = 10
    card_w = (PAGE_W - MARGIN * 2 - card_gap) / 2
    card_h = 105
    cards = [
        ("UNDER $2", "Reach and traffic", "Stickers, wristbands, basic pens, badge accessories and simple lanyards at suitable quantities."),
        ("UNDER $5", "Useful attendee items", "Tote bags, plastic bottles, notebooks, charging cables, phone stands and selected caps."),
        ("UNDER $10", "Qualified lead gifts", "Upgraded drinkware, compact tech, travel pouches and practical two-item combinations."),
        ("UNDER $20", "VIP and meeting value", "Premium drinkware, better power banks, backpacks, tech organizers and compact gift sets."),
    ]
    for index, (band, purpose, items) in enumerate(cards):
        col = index % 2
        row = index // 2
        x = MARGIN + col * (card_w + card_gap)
        cy = y - row * (card_h + card_gap)
        c.setFillColor(PAPER)
        c.setStrokeColor(LINE)
        c.roundRect(x, cy - card_h, card_w, card_h, 12, fill=1, stroke=1)
        c.setFillColor(GOLD if index < 2 else BLUE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 14, cy - 20, band)
        c.setFillColor(INK)
        c.setFont("Times-Bold", 14)
        c.drawString(x + 14, cy - 40, purpose)
        draw_wrapped(c, items, x + 14, cy - 58, card_w - 28, size=8, leading=10.5, color=TEXT, max_lines=4)

    y -= 237
    c.setFont("Times-Bold", 17)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Product shortlist")
    y -= 18
    cols = [113, 52, 67, 96, 92, 93]
    headers = ["Product", "Qty", "Unit band", "Logo method", "Color / material", "Packing"]
    x = MARGIN
    c.setFillColor(NAVY_2)
    c.rect(MARGIN, y - 23, sum(cols), 23, fill=1, stroke=0)
    for header, width in zip(headers, cols):
        c.setFont("Helvetica-Bold", 6.8)
        c.setFillColor(white)
        c.drawString(x + 6, y - 15, header.upper())
        x += width
    current_y = y - 23
    for _ in range(5):
        x = MARGIN
        for width in cols:
            c.setFillColor(white)
            c.setStrokeColor(LINE)
            c.rect(x, current_y - 31, width, 31, fill=1, stroke=1)
            c.line(x + 6, current_y - 21, x + width - 6, current_y - 21)
            x += width
        current_y -= 31

    y = current_y - 26
    c.setFont("Times-Bold", 17)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Budget worksheet")
    y -= 23
    labels = ["Products", "Setup / sampling", "Packaging", "Freight / delivery", "Contingency", "Working total"]
    box_w = (PAGE_W - MARGIN * 2 - 20) / 3
    for index, label in enumerate(labels):
        col = index % 3
        row = index // 3
        x = MARGIN + col * (box_w + 10)
        by = y - row * 48
        c.setFillColor(PAPER)
        c.setStrokeColor(LINE)
        c.roundRect(x, by - 35, box_w, 35, 7, fill=1, stroke=1)
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(x + 9, by - 13, label.upper())
        c.setFillColor(INK)
        c.setFont("Helvetica", 9)
        c.drawRightString(x + box_w - 10, by - 25, "$ __________")
    c.showPage()


def draw_page_four(c):
    draw_header(c, 4, "Approvals, packing and delivery")
    y = PAGE_H - 92
    draw_section_title(
        c,
        3,
        "Work backward from the must-arrive date",
        y,
        "Dates below should include review time. A production-ready artwork approval is not the same as an initial design discussion.",
    )
    y -= 58
    stages = [
        "Brief and quantity split confirmed",
        "Shortlist, MOQ and branding reviewed",
        "Digital mockup approved",
        "Sample or pre-production proof approved",
        "Production complete and QC passed",
        "Cartons labeled and dispatch booked",
        "Delivery received and checked",
    ]
    c.setFont("Times-Bold", 16)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Approval timeline")
    y -= 24
    for index, stage in enumerate(stages):
        c.setFillColor(GOLD if index < 4 else BLUE)
        c.circle(MARGIN + 7, y - index * 27 + 2, 6, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(TEXT)
        c.drawString(MARGIN + 20, y - index * 27, stage)
        c.setFont("Helvetica", 8)
        c.setFillColor(MUTED)
        c.drawRightString(PAGE_W - MARGIN, y - index * 27, "Owner: __________   Due: __________")
        if index < len(stages) - 1:
            c.setStrokeColor(LINE)
            c.line(MARGIN + 7, y - index * 27 - 5, MARGIN + 7, y - (index + 1) * 27 + 8)

    y -= len(stages) * 27 + 6
    c.setFont("Times-Bold", 16)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Artwork and product approval")
    y -= 22
    artwork = [
        "Vector logo supplied (AI, EPS, SVG or production-ready PDF).",
        "Brand colors and acceptable substitutions documented.",
        "Imprint size, location and orientation approved on each item.",
        "Names, QR codes, dates and campaign copy checked by the owner.",
        "Physical sample requirement agreed before production scheduling.",
        "Final proof approval recorded in writing.",
    ]
    for index, label in enumerate(artwork):
        col = index % 2
        row = index // 2
        draw_checkbox(c, MARGIN + col * 270, y - row * 31, label, width=245)

    y -= 112
    c.setFont("Times-Bold", 16)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Packing, venue and handoff")
    y -= 22
    packing = [
        "Carton labels show event, booth number, owner and carton count.",
        "Staff kits are packed by person, size, role or shift where needed.",
        "Venue receiving hours, dock rules and storage limits are confirmed.",
        "Tracking, packing list and local receiving contact are shared.",
        "A reserve quantity is separated from daily booth stock.",
        "Post-show leftovers and return shipping have an owner.",
    ]
    for index, label in enumerate(packing):
        col = index % 2
        row = index // 2
        draw_checkbox(c, MARGIN + col * 270, y - row * 31, label, width=245)

    y -= 112
    c.setFillColor(NAVY)
    c.roundRect(MARGIN, y - 88, PAGE_W - MARGIN * 2, 96, 14, fill=1, stroke=0)
    c.setFillColor(GOLD_2)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 16, y - 10, "READY TO REQUEST A QUOTE")
    c.setFillColor(white)
    c.setFont("Times-Bold", 17)
    c.drawString(MARGIN + 16, y - 33, "Send the completed brief with your logo files.")
    draw_wrapped(c, "Include the event city, must-arrive date, quantity by tier, preferred products and budget direction. We can review feasibility and prepare a coordinated digital mockup.", MARGIN + 16, y - 51, 390, size=8.5, leading=11, color=Color(1, 1, 1, alpha=0.78))
    c.setFillColor(white)
    c.roundRect(PAGE_W - MARGIN - 70, y - 79, 70, 70, 7, fill=1, stroke=0)
    draw_qr(c, "https://www.fypromogifts.com/trade-show-giveaway-kits/#inquiry", PAGE_W - MARGIN - 66, y - 75, 62)
    c.showPage()


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_COPY.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Trade Show Giveaway Planning Checklist")
    c.setAuthor("FY PromoGifts")
    c.setSubject("Trade show giveaway planning worksheet for exhibitors, agencies and event teams")
    draw_cover(c)
    c.showPage()
    draw_page_two(c)
    draw_page_three(c)
    draw_page_four(c)
    c.save()
    SITE_COPY.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(SITE_COPY)


if __name__ == "__main__":
    build_pdf()
