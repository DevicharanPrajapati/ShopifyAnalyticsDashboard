#!/usr/bin/env python3
"""
generate_project_pdf.py
Generates an executive, publication-quality 7-page PDF documentation for the
Shopify Store Analytics Dashboard project.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Theme Palette (Shopify Emerald & Deep Slate)
PRIMARY = colors.HexColor('#10B981')      # Emerald
PRIMARY_DARK = colors.HexColor('#059669') # Dark Emerald
SECONDARY = colors.HexColor('#0F172A')    # Deep Slate
TEXT_DARK = colors.HexColor('#1E293B')    # Slate 800
TEXT_MUTED = colors.HexColor('#64748B')   # Slate 500
BG_LIGHT = colors.HexColor('#F8FAFC')     # Slate 50
BORDER_COLOR = colors.HexColor('#E2E8F0') # Slate 200
EMERALD_BG = colors.HexColor('#ECFDF5')   # Emerald 50
EMERALD_BORDER = colors.HexColor('#A7F3D0')# Emerald 200


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas that automatically adds running headers and footers
    with dynamic total page counts ('Page X of Y').
    """
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
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        # Omit headers/footers on the cover page
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)

        # Header
        self.drawString(54, 752, "Shopify Store Analytics Dashboard • Technical Documentation")
        self.drawRightString(558, 752, "Devicharan Prajapati | Apex Retailers")
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.6)
        self.line(54, 746, 558, 746)

        # Footer
        self.line(54, 46, 558, 46)
        self.drawString(54, 34, "Confidential • Internal Project Architecture & API Manual")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 34, page_str)

        self.restoreState()


def build_pdf(filename="Shopify_Store_Analytics_Project_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=52
    )

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=SECONDARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=PRIMARY_DARK,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15.5,
        textColor=PRIMARY_DARK,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=SECONDARY,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3.5
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=SECONDARY
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_DARK
    )

    meta_key = ParagraphStyle(
        'MetaKey',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=SECONDARY
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_DARK
    )

    table_hdr = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=SECONDARY
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=4.5, color=PRIMARY, spaceBefore=0, spaceAfter=18))

    story.append(Paragraph("Shopify Store Analytics Dashboard", title_style))
    story.append(Paragraph("Enterprise E-Commerce Performance Intelligence & Catalog Analytics Manual", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER_COLOR, spaceBefore=4, spaceAfter=16))

    story.append(Paragraph(
        "A full-stack, production-grade analytics platform and merchant control dashboard built with the modern MERN stack "
        "(React 19, Node.js, Express, MongoDB Atlas). Features high-performance MongoDB aggregation pipelines, "
        "real-time date range filters, multi-type interactive data visualizations, catalog velocity tracking, and Indian Rupee (INR) "
        "currency standardization.",
        body_style
    ))

    story.append(Spacer(1, 15))

    meta_data = [
        [Paragraph("Project Name", meta_key), Paragraph("Shopify Store Analytics Studio", meta_val)],
        [Paragraph("Store Name / Owner", meta_key), Paragraph("Apex Retailers (Devicharan Prajapati)", meta_val)],
        [Paragraph("Core Architecture", meta_key), Paragraph("MERN Stack (React 19, Express.js, Node.js, MongoDB Atlas)", meta_val)],
        [Paragraph("State Management", meta_key), Paragraph("Redux Toolkit (@reduxjs/toolkit, react-redux)", meta_val)],
        [Paragraph("Visualization Suite", meta_key), Paragraph("Recharts (Area, Dual Bar, Horizontal Bar, Line, Donut)", meta_val)],
        [Paragraph("Styling & Theme", meta_key), Paragraph("Tailwind CSS v4 (Clean White & Emerald #10B981)", meta_val)],
        [Paragraph("Base Currency", meta_key), Paragraph("Indian Rupee (INR / Rs.) with en-IN formatting", meta_val)],
        [Paragraph("Date Filter Range", meta_key), Paragraph("Presets (Today, 7d, 30d, 90d, 1y) & Custom Boundaries", meta_val)],
        [Paragraph("GitHub Repository", meta_key), Paragraph("https://github.com/DevicharanPrajapati/ShopifyAnalyticsDashboard.git", meta_val)],
        [Paragraph("Build Release", meta_key), Paragraph("v1.2.0 Production Release", meta_val)],
    ]
    meta_table = Table(meta_data, colWidths=[130, 374])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 25))

    callout_data = [[
        Paragraph(
            "<b>Key Architecture Takeaway:</b> Designed strictly as a single-merchant powerhouse for Apex Retailers, this project "
            "eliminates retail guesswork by marrying MongoDB Atlas multi-stage aggregation pipelines with client-side reactive charts. "
            "It handles multi-range financial trend modeling, inventory stock comparison, and customer basket-size distributions "
            "with sub-second response times.",
            callout_style
        )
    ]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), EMERALD_BG),
        ('LINELEFT', (0, 0), (-1, -1), 3.5, PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, EMERALD_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(callout_table)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: ARCHITECTURE & TECH STACK
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & System Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "Modern e-commerce merchants require instant, multi-faceted visibility into transaction volume, shopper behavior, and "
        "inventory velocity. The <b>Shopify Store Analytics Dashboard</b> provides a responsive, robust control tower "
        "that converts raw transactional data into high-value financial intelligence.",
        body_style
    ))

    story.append(Paragraph("Decoupled Multi-Tier Architecture", h2_style))
    tiers = [
        "<b>1. Client Layer (SPA):</b> Built on React 19 and Vite. Utilizes Redux Toolkit for centralized analytics and UI collapse state caching, Recharts for responsive SVG visualizations, and Tailwind CSS v4 for clean emerald styling.",
        "<b>2. API & Routing Layer:</b> Node.js and Express.js REST API with standardized request wrappers (<code>asyncHandler</code>), custom response contracts (<code>ApiResponse</code>), and centralized error handling (<code>ApiError</code>).",
        "<b>3. Service & Analytics Engine:</b> Business logic powered by native MongoDB multi-stage aggregation pipelines (<code>$match</code>, <code>$unwind</code>, <code>$group</code>, <code>$bucket</code>, <code>$lookup</code>, <code>$project</code>).",
        "<b>4. Database & Storage Layer:</b> MongoDB Atlas cloud cluster with compound indexes optimized for date-bounded queries across orders, products, and daily visitor footfall."
    ]
    for t in tiers:
        story.append(Paragraph(f"&bull; &nbsp; {t}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Complete Technology Stack", h2_style))

    tech_data = [
        [Paragraph("Domain", table_hdr), Paragraph("Technology", table_hdr), Paragraph("Role & Purpose in Project", table_hdr)],
        [Paragraph("Frontend Core", table_cell_bold), Paragraph("React 19 + Vite", table_cell), Paragraph("High-speed reactive SPA with instant HMR and optimized bundle splitting", table_cell)],
        [Paragraph("Global State", table_cell_bold), Paragraph("Redux Toolkit", table_cell), Paragraph("Centralized date filtering, overview metrics, and UI collapse persistence", table_cell)],
        [Paragraph("Visualizations", table_cell_bold), Paragraph("Recharts", table_cell), Paragraph("Area charts, dual bar charts, horizontal bars, lines, and donut distributions", table_cell)],
        [Paragraph("Styling Engine", table_cell_bold), Paragraph("Tailwind CSS v4", table_cell), Paragraph("Utility-first layout, custom emerald palette, and fully responsive breakpoints", table_cell)],
        [Paragraph("Backend Runtime", table_cell_bold), Paragraph("Node.js (v22) + Express", table_cell), Paragraph("Lightweight, asynchronous REST API serving JSON endpoints", table_cell)],
        [Paragraph("Database", table_cell_bold), Paragraph("MongoDB Atlas (Mongoose)", table_cell), Paragraph("Document storage with aggregation pipelines, indexes, and schema validation", table_cell)],
        [Paragraph("HTTP Client", table_cell_bold), Paragraph("Axios", table_cell), Paragraph("Configured instance with base URLs, timeouts, and automated serialization", table_cell)],
        [Paragraph("Iconography", table_cell_bold), Paragraph("Lucide React", table_cell), Paragraph("Consistent visual icons for navigation, KPI cards, and header toggles", table_cell)],
    ]
    tech_table = Table(tech_data, colWidths=[85, 125, 294])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tech_table)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: DASHBOARD & ORDERS MODULES
    # =========================================================================
    story.append(Paragraph("2. Application Modules: Dashboard & Orders", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("2.1 Store Performance Dashboard (/)", h2_style))
    story.append(Paragraph(
        "The Dashboard serves as the central operational hub, loading 7 analytics streams in parallel via <code>/api/analytics/dashboard</code>:",
        body_style
    ))

    dash_bullets = [
        "<b>Executive KPI Summary Cards:</b> Four responsive cards displaying Total Revenue (INR), Total Completed Orders, Average Order Value (AOV), and Conversion Rate. Each card renders comparative percentage change (+/-) against the preceding matching period.",
        "<b>Revenue Trajectory (Area Chart):</b> Smooth spline Area Chart with emerald gradient fill, showing daily gross revenue over the chosen window with currency tooltips.",
        "<b>Traffic vs Orders Trend (Dual Bar Chart):</b> Side-by-side comparison of daily store footfall (visitors) versus order conversions, revealing buyer purchase intent patterns across weekdays vs weekends.",
        "<b>Category Sales Distribution (Horizontal Bar Chart):</b> Ranks category revenue contribution (Electronics, Apparel, Home & Kitchen, Accessories, Bags, Footwear).",
        "<b>Payment Settlement Breakdown (Donut Chart):</b> Visualizes paid, pending, and refunded transactions with an interactive center counter.",
        "<b>Top Selling Products List:</b> Live ranking of top 5 revenue-generating items with SKU codes, unit sales, and gross revenue in INR.",
        "<b>Recent Orders Feed:</b> Live transaction table showing order ID, customer details, payment status badges, and transaction date."
    ]
    for b in dash_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("2.2 Orders Analytics & Management (/orders)", h2_style))
    story.append(Paragraph(
        "Combines deep aggregate financial analysis with complete transaction fulfillment workflows:",
        body_style
    ))

    order_bullets = [
        "<b>Date Range Filter:</b> Merchants can toggle between presets (Today, Yesterday, 7d, 30d, 90d, 1y) or select custom date boundaries without page reloads.",
        "<b>Orders KPI Cards:</b> Orders in Range, Net Order Value (INR), Average Order Value (AOV), and Fulfilled Orders count with percentage fulfillment rate.",
        "<b>Order Basket Value Tiers (Bar Chart):</b> Uses MongoDB's <code>$bucket</code> aggregation stage to classify orders into basket size tiers (Under Rs. 2,500; Rs. 2,500 - Rs. 5,000; Rs. 5,000 - Rs. 10,000; Rs. 10,000 - Rs. 50,000; Above Rs. 50,000).",
        "<b>Daily AOV Trend (Line Chart):</b> Tracks customer purchasing power fluctuations day-by-day.",
        "<b>Filter Tabs & Search:</b> Status tabs (All, Paid, Pending, Refunded) combined with text search across order ID, customer name, and email.",
        "<b>Dual View Layout:</b> Renders an expansive desktop table with payment badges, and automatically switches to touch-optimized order cards on mobile screens."
    ]
    for b in order_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: PRODUCTS & DATA ENGINEERING
    # =========================================================================
    story.append(Paragraph("3. Products Module & Data Engineering", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("3.1 Products Catalog & Stock Velocity (/products)", h2_style))
    prod_bullets = [
        "<b>Inventory KPI Cards:</b> Catalog SKUs count, Physical Units in Warehouse, Units Sold in period, and Top Performing Category with gross revenue contribution.",
        "<b>Category Sales Share (Donut Chart):</b> Visualizes category revenue share percentages with interactive hover cards.",
        "<b>Inventory Stock vs Units Sold (Dual Bar Chart):</b> Side-by-side comparison of shelf stock remaining vs units sold for bestsellers, alerting merchants to potential stockouts.",
        "<b>Product Catalog Grid:</b> Responsive 4-column card grid displaying product imagery, SKU codes, stock counts, retail prices in INR, and profit margin percentages calculated dynamically."
    ]
    for b in prod_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("3.2 Database Models & Indexing Strategy", h2_style))
    story.append(Paragraph(
        "Mongoose schemas are engineered to support low-latency analytical aggregations over large transaction sets:",
        body_style
    ))

    schema_data = [
        [Paragraph("Model", table_hdr), Paragraph("Key Fields & Subdocuments", table_hdr), Paragraph("Index Architecture", table_hdr)],
        [
            Paragraph("<b>Order</b><br/>(orders)", table_cell_bold),
            Paragraph("orderNumber, customer: { name, email, city }, items: [{ product, title, price, quantity }], totalAmount, subtotal, tax, financialStatus, fulfillmentStatus, orderDate", table_cell),
            Paragraph("• Compound: <code>{ storeId: 1, orderDate: 1, financialStatus: 1 }</code><br/>• Single: <code>orderNumber: 1</code>", table_cell)
        ],
        [
            Paragraph("<b>Product</b><br/>(products)", table_cell_bold),
            Paragraph("title, sku (unique), category, price (INR), costPrice (INR), inventoryQuantity, status (active/draft), image", table_cell),
            Paragraph("• Text: <code>{ title: 'text', category: 'text' }</code><br/>• Single: <code>category: 1</code>, <code>storeId: 1</code>", table_cell)
        ],
        [
            Paragraph("<b>VisitorTraffic</b><br/>(visitortraffics)", table_cell_bold),
            Paragraph("storeId, date, visitorsCount, sessionsCount", table_cell),
            Paragraph("• Unique Compound:<br/><code>{ storeId: 1, date: 1 }</code>", table_cell)
        ],
    ]
    schema_table = Table(schema_data, colWidths=[90, 244, 170])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(schema_table)

    story.append(Spacer(1, 6))
    story.append(Paragraph("3.3 Synthetic Data Seeding Engine", h2_style))
    story.append(Paragraph(
        "A realistic seeding script (<code>server/src/seeds/seedData.js</code>) populates 30 consecutive days of orders and traffic. "
        "It generates authentic Indian customer personas (Mumbai, Bengaluru, Delhi), realistic market pricing in INR (Rs. 1,499 - Rs. 12,999), "
        "and weekend-adjusted footfall delivering a realistic 2.5% - 4.5% conversion rate.",
        body_style
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: BACKEND REST API REFERENCE
    # =========================================================================
    story.append(Paragraph("4. Backend REST API Reference", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "All endpoints adhere to REST conventions, returning standard HTTP codes and JSON payloads encapsulated by <code>ApiResponse</code>:",
        body_style
    ))

    api_data = [
        [Paragraph("Method", table_hdr), Paragraph("Route Path", table_hdr), Paragraph("Query Parameters", table_hdr), Paragraph("Description", table_hdr)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/health</code>", table_cell), Paragraph("None", table_cell), Paragraph("Service health status and UTC timestamp", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/analytics/overview</code>", table_cell), Paragraph("preset, startDate, endDate", table_cell), Paragraph("KPI cards with % comparative growth", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/analytics/revenue-trend</code>", table_cell), Paragraph("preset, startDate, endDate", table_cell), Paragraph("Daily revenue and order volume series", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/analytics/orders-stats</code>", table_cell), Paragraph("preset, startDate, endDate", table_cell), Paragraph("Order value tiers and daily AOV trend", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/analytics/products-stats</code>", table_cell), Paragraph("preset, startDate, endDate", table_cell), Paragraph("Category shares and stock vs units sold", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/analytics/dashboard</code>", table_cell), Paragraph("preset, startDate, endDate", table_cell), Paragraph("Consolidated payload of all dashboard widgets", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/orders</code>", table_cell), Paragraph("status, search, page, limit", table_cell), Paragraph("Paginated order list with search filters", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/orders/:id</code>", table_cell), Paragraph("None (path parameter)", table_cell), Paragraph("Single order details by MongoDB ObjectId", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/products</code>", table_cell), Paragraph("category, search, page, limit", table_cell), Paragraph("Paginated catalog products with search filter", table_cell)],
        [Paragraph("<b>GET</b>", table_cell_bold), Paragraph("<code>/api/products/:id</code>", table_cell), Paragraph("None (path parameter)", table_cell), Paragraph("Single product details by MongoDB ObjectId", table_cell)],
    ]
    api_table = Table(api_data, colWidths=[50, 144, 130, 180])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(api_table)

    story.append(Spacer(1, 8))
    story.append(Paragraph("Standardized JSON Envelopes", h2_style))

    # Envelope table
    env_data = [
        [
            Paragraph("<b>Success Envelope (ApiResponse)</b>", h3_style),
            Paragraph("<b>Error Envelope (ApiError)</b>", h3_style)
        ],
        [
            Paragraph(
                "{\n"
                '  "statusCode": 200,\n'
                '  "success": true,\n'
                '  "message": "Complete dashboard analytics retrieved",\n'
                '  "data": {\n'
                '    "overview": { "current": { ... } },\n'
                '    "revenueTrend": [ ... ],\n'
                '    "categorySales": [ ... ]\n'
                "  }\n"
                "}",
                code_style
            ),
            Paragraph(
                "{\n"
                '  "statusCode": 404,\n'
                '  "success": false,\n'
                '  "message": "Order not found: invalid ID format",\n'
                '  "errors": []\n'
                "}",
                code_style
            )
        ]
    ]
    env_table = Table(env_data, colWidths=[250, 254])
    env_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(env_table)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: ARCHITECTURAL PATTERNS & UI/UX SYSTEM
    # =========================================================================
    story.append(Paragraph("5. Architectural Patterns & UI/UX Design System", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("5.1 Architectural Patterns & Utilities", h2_style))
    patterns = [
        ("asyncHandler Wrapper (server/src/utils/asyncHandler.js)", "Eliminated repetitive try/catch blocks across every controller action. Automatically catches rejected promises and pipes them to Express's next() handler."),
        ("Centralized dateHelper (server/src/utils/dateHelper.js)", "Provides startOfDay(), endOfDay(), calculatePercentageChange(), and getDateRangeFromQuery(). Standardizes time zone parsing and comparative period generation into a single call."),
        ("Defensive Input Validation", "Integrated mongoose.isValidObjectId() guards to eliminate unhandled CastErrors when querying by ID, gracefully returning HTTP 404 instead of HTTP 500 crashes."),
        ("Safe Pagination Clamping", "Clamps user pagination parameters with upper and lower bounds (Math.max(1, page) and Math.min(100, limit)), protecting the database from malicious unbounded queries."),
        ("Mongoose Lean Read Operations", "Employs .lean() on read-only queries to bypass full Mongoose document instantiation, drastically reducing memory overhead and JSON serialization latency.")
    ]
    for title, desc in patterns:
        story.append(Paragraph(f"&bull; &nbsp; <b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("5.2 UI/UX Design System & Navigation", h2_style))
    design_points = [
        ("Clean Shopify Emerald Theme", "Restored the crisp white and emerald green palette (#10B981) authentic to the Shopify merchant aesthetic, featuring clean slate backgrounds and borders."),
        ("Indian Rupee (INR) Standardization", "All currency representations across cards, charts, and tables display formatted in Indian Rupees (₹ / Rs.) with Indian number system comma grouping (e.g. Rs. 7,48,282)."),
        ("Stationary Fixed Desktop Sidebar", "Desktop sidebar is anchored with fixed positioning (fixed inset-y-0 left-0 w-64 z-30), eliminating scrolling misalignment during long page navigation."),
        ("Sidebar Hide/Show Collapse Mode", "Users can toggle the sidebar closed or open via the header icon or the standard Ctrl+B (Cmd+B) keyboard shortcut. When collapsed, the main content area smoothly transitions to full-width (lg:pl-0). State persists in localStorage."),
        ("Custom Vector Logo Component", "Engineered a pure vector SVG logo component featuring an emerald shopping bag embedded with an upward-trending growth chart line and data points. Also exported as the browser favicon."),
        ("Minimalist Clean Footer", "Streamlined footer to a single minimal line with copyright and store identity, removing extraneous clutter.")
    ]
    for title, desc in design_points:
        story.append(Paragraph(f"&bull; &nbsp; <b>{title}:</b> {desc}", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: SETUP & INSTALLATION GUIDE
    # =========================================================================
    story.append(Paragraph("6. Setup, Installation & Verification Guide", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("Prerequisites", h2_style))
    story.append(Paragraph(
        "• Node.js version 18.0.0 or higher &bull; npm or yarn &bull; MongoDB Atlas cluster or local MongoDB (v6.0+) &bull; Git",
        body_style
    ))

    story.append(Paragraph("Step-by-Step Installation", h2_style))

    steps_data = [
        ("Step 1: Clone Repository", "git clone https://github.com/DevicharanPrajapati/ShopifyAnalyticsDashboard.git\ncd ShopifyAnalyticsDashboard"),
        ("Step 2: Server Environment", "Create server/.env with:\nPORT=5000\nMONGODB_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/shopify_store_analytics\nCLIENT_URL=http://localhost:5173"),
        ("Step 3: Install & Seed", "cd server && npm install\nnpm run seed    # Populates 8 products, 138 orders in INR, 30 days traffic"),
        ("Step 4: Launch Server", "npm run dev     # Runs Express API on http://localhost:5000 with nodemon"),
        ("Step 5: Client Setup", "cd ../client && npm install\nnpm run dev     # Launches Vite development server on http://localhost:5173"),
        ("Step 6: Production Build", "npm run build   # Compiles production-ready bundle into client/dist"),
    ]

    for title, code_snippet in steps_data:
        story.append(Paragraph(f"<b>{title}</b>", h3_style))
        story.append(Paragraph(code_snippet.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_style))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Project Completion & Status", h2_style))
    story.append(Paragraph(
        "All features, endpoints, visualizations, responsive layouts, and server optimizations have been verified and "
        "pushed to the main branch of the GitHub repository. The project is completely functional and ready for evaluation.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # Sign-off box
    sign_data = [[
        Paragraph(
            "<b>Author / Developer:</b> Devicharan Prajapati<br/>"
            "<b>Project:</b> Shopify Store Analytics Dashboard<br/>"
            "<b>Store Identity:</b> Apex Retailers (Single Store Architecture)<br/>"
            "<b>Repository:</b> https://github.com/DevicharanPrajapati/ShopifyAnalyticsDashboard.git<br/>"
            "<b>Status:</b> All Requirements Completed & Verified on Main Branch",
            callout_style
        )
    ]]
    sign_table = Table(sign_data, colWidths=[504])
    sign_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(sign_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF successfully generated: {filename}")


if __name__ == '__main__':
    output_filename = os.path.join(os.path.dirname(__file__), "Shopify_Store_Analytics_Project_Documentation.pdf")
    build_pdf(output_filename)
