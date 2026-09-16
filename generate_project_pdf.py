#!/usr/bin/env python3
"""
generate_project_pdf.py
Generates an executive, publication-quality 9-page PDF documentation for the
Shopify Store Analytics Dashboard project, featuring comprehensive documentation
of all filters, mathematical calculations, architecture, schemas, and API contracts.
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
AMBER_BG = colors.HexColor('#FFFBEB')     # Amber 50
AMBER_BORDER = colors.HexColor('#FDE68A') # Amber 200


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
        self.drawString(54, 752, "Shopify Store Analytics Dashboard • Technical & Mathematical Manual")
        self.drawRightString(558, 752, "Apex Retailers | Devicharan Prajapati")
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.6)
        self.line(54, 746, 558, 746)

        # Footer
        self.line(54, 46, 558, 46)
        self.drawString(54, 34, "Confidential • Internal Project Architecture, Filter & Calculation Manual")
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
        leading=29,
        textColor=SECONDARY,
        spaceAfter=5
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=PRIMARY_DARK,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14.5,
        textColor=PRIMARY_DARK,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=SECONDARY,
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=12,
        textColor=TEXT_DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=11,
        firstLineIndent=-7,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.8,
        leading=10,
        textColor=SECONDARY
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=12,
        textColor=TEXT_DARK
    )

    meta_key = ParagraphStyle(
        'MetaKey',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11,
        textColor=SECONDARY
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=TEXT_DARK
    )

    table_hdr = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=10.5,
        textColor=TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.6,
        leading=10.5,
        textColor=SECONDARY
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=4.5, color=PRIMARY, spaceBefore=0, spaceAfter=16))

    story.append(Paragraph("Shopify Store Analytics Dashboard", title_style))
    story.append(Paragraph("Enterprise E-Commerce Intelligence, Filter Architecture & Calculation Manual", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER_COLOR, spaceBefore=3, spaceAfter=14))

    story.append(Paragraph(
        "A full-stack, production-grade analytics platform and merchant control dashboard built with the modern MERN stack "
        "(React 19, Node.js, Express, MongoDB Atlas). Features high-performance MongoDB aggregation pipelines, "
        "multi-period date range filtering, real-time debounced search, dynamic multi-style data visualizations, catalog velocity tracking, "
        "and complete Indian Rupee (INR) currency standardization.",
        body_style
    ))

    story.append(Spacer(1, 12))

    meta_data = [
        [Paragraph("Project Name", meta_key), Paragraph("Shopify Store Analytics Studio", meta_val)],
        [Paragraph("Store Name / Owner", meta_key), Paragraph("Apex Retailers (Devicharan Prajapati)", meta_val)],
        [Paragraph("Core Architecture", meta_key), Paragraph("MERN Stack (React 19, Express.js, Node.js, MongoDB Atlas)", meta_val)],
        [Paragraph("State Management", meta_key), Paragraph("Redux Toolkit (@reduxjs/toolkit, react-redux)", meta_val)],
        [Paragraph("Visualization Suite", meta_key), Paragraph("Recharts (Dynamic Area, Dual Bar, Horizontal Bar, Line, Donut)", meta_val)],
        [Paragraph("Styling & Theme", meta_key), Paragraph("Tailwind CSS v4 (Shopify Clean White & Emerald #10B981)", meta_val)],
        [Paragraph("Base Currency", meta_key), Paragraph("Indian Rupee (INR / Rs.) with en-IN numbering format", meta_val)],
        [Paragraph("Filter Engine", meta_key), Paragraph("Date Range Presets & Custom, Debounced Live Search, Category, Status", meta_val)],
        [Paragraph("GitHub Repository", meta_key), Paragraph("https://github.com/DevicharanPrajapati/ShopifyAnalyticsDashboard.git", meta_val)],
        [Paragraph("Build Release", meta_key), Paragraph("v1.3.0 Production Master Release", meta_val)],
    ]
    meta_table = Table(meta_data, colWidths=[130, 374])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 20))

    callout_data = [[
        Paragraph(
            "<b>Key Architecture Takeaway:</b> Designed strictly as a single-merchant operational cockpit for Apex Retailers, this project "
            "eliminates e-commerce guesswork by marrying MongoDB Atlas multi-stage aggregation pipelines with client-side reactive charts. "
            "It delivers multi-range financial modeling, real-time live search, inventory stock velocity tracking, and comparative period-over-period "
            "growth metrics with sub-second response times.",
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

    story.append(Spacer(1, 5))
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
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tech_table)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: APPLICATION MODULES
    # =========================================================================
    story.append(Paragraph("2. Application Modules: Dashboard, Orders & Products", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("2.1 Store Performance Dashboard (/)", h2_style))
    dash_bullets = [
        "<b>Shopify-Style Interactive KPI Cards:</b> Four primary metric cards displaying Total Revenue, Total Orders, Conversion Rate, and Average Order Value (AOV). Clicking ANY card selects it, applying a highlight border and automatically morphing the primary chart to plot that exact metric.",
        "<b>Primary Dynamic Chart & Style Switcher:</b> Synchronized with the selected card. Displays a 'Selected: <Metric>' badge and features an in-chart style toggle switching between <b>Area Chart</b> (smooth gradient), <b>Bar Chart</b> (discrete columns), and <b>Line Chart</b> (trend line & points) with localStorage persistence.",
        "<b>Traffic vs Orders Trend (Dual Bar Chart):</b> Daily store footfall (visitors) versus conversions, revealing buyer purchase intent across weekdays and weekends.",
        "<b>Category Sales Distribution (Horizontal Bar Chart):</b> Ranks category revenue contributions (Electronics, Apparel, Home & Kitchen, Accessories, Bags, Footwear).",
        "<b>Payment Settlement Breakdown (Donut Chart):</b> Visualizes paid, pending, and refunded transactions with an interactive center counter.",
        "<b>Top Selling Products Leaderboard:</b> Live ranking of top revenue-generating items with SKU codes, unit sales, and gross revenue in INR.",
        "<b>Recent Orders Feed:</b> Live transaction table showing order ID, customer details, payment status badges, and transaction timestamps."
    ]
    for b in dash_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("2.2 Orders Analytics & Management (/orders)", h2_style))
    order_bullets = [
        "<b>Date Range Presets & KPIs:</b> Renders Orders in Range, Net Order Value (INR), Average Order Value (AOV), and Fulfilled Orders count with percentage fulfillment rate.",
        "<b>Order Basket Value Tiers (Bar Chart):</b> Uses MongoDB's <code>$bucket</code> aggregation stage to classify orders into basket size tiers (Under Rs. 1,000; Rs. 1,000 - Rs. 5,000; Rs. 5,000 - Rs. 10,000; Above Rs. 10,000).",
        "<b>Daily AOV Trend (Line Chart):</b> Tracks customer purchasing power fluctuations day-by-day.",
        "<b>Debounced Multi-Field Search:</b> Real-time filtering across Order Number, Customer Name, Email, City, and Item titles/SKUs with 1-click instant clear.",
        "<b>Status Filter Pills:</b> Instant filtering between All Orders, Paid, Pending, and Refunded states."
    ]
    for b in order_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("2.3 Products Catalog & Stock Velocity (/products)", h2_style))
    prod_bullets = [
        "<b>Inventory KPI Cards:</b> Catalog Items count, Units in Stock, Units Sold in period, and Top Category with sales volume and percentage share.",
        "<b>Category Sales Share (Donut Chart):</b> Renders category revenue split with interactive hover tooltips.",
        "<b>Inventory Stock vs Units Sold (Dual Bar Chart):</b> Compares shelf inventory against sales velocity, warning merchants of stockouts.",
        "<b>Catalog Grid & Margins:</b> Displays product imagery, SKU codes, stock levels, INR retail prices, and computed profit margin percentages."
    ]
    for b in prod_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: COMPREHENSIVE FILTER SYSTEM & QUERY LOGIC
    # =========================================================================
    story.append(Paragraph("3. Comprehensive Filter System & Query Logic", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "The application provides a cohesive, multi-layered filtering architecture operating seamlessly between the React client "
        "and MongoDB Atlas backend. All filters maintain URL/Redux synchronization and prevent unnecessary database queries.",
        body_style
    ))

    story.append(Paragraph("3.1 Date Range Filter Engine (DateFilter.jsx & dateHelper.js)", h2_style))
    date_bullets = [
        "<b>Presets Supported:</b> <code>today</code> (00:00:00 to 23:59:59), <code>yesterday</code> (prior full day), <code>7d</code> (past 7 days), <code>30d</code> (past 30 days - default), <code>90d</code> (past 90 days), <code>1y</code> (past 365 days), and <code>custom</code>.",
        "<b>Comparative Previous Period Math:</b> To power period-over-period growth comparisons, <code>dateHelper.js</code> calculates duration <code>Δt = endDate - startDate</code>. The prior period is automatically computed as <code>prevEndDate = startDate</code> and <code>prevStartDate = startDate - Δt</code>, guaranteeing an exact apple-to-apple comparison window.",
        "<b>UTC Time Normalization:</b> Presets use <code>startOfDay()</code> and <code>endOfDay()</code> utilities to normalize timestamps into UTC boundaries, avoiding timezone-induced day clipping."
    ]
    for b in date_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 3))
    story.append(Paragraph("3.2 Real-Time Debounced Live Search Filter", h2_style))
    search_bullets = [
        "<b>300ms Client Debouncing:</b> An intelligent <code>useEffect</code> timer in <code>ProductsPage.jsx</code> and <code>OrdersPage.jsx</code> waits 300ms after the last keystroke before dispatching the API call, preventing request flooding while providing a live typing search experience.",
        "<b>Multi-Field Product Search:</b> Searches simultaneously across <code>title</code>, <code>sku</code>, and <code>category</code> using an unanchored, case-insensitive <code>$or</code> MongoDB regex query.",
        "<b>Multi-Field Order Search:</b> Searches simultaneously across <code>orderNumber</code>, <code>customer.name</code>, <code>customer.email</code>, <code>customer.city</code>, and order item <code>title</code> & <code>sku</code>.",
        "<b>1-Click Instant Clear:</b> An embedded <code>X</code> button appears inside the input whenever text exists, allowing instant clearing and view restoration. Active search chips display below the filter bar with result counts."
    ]
    for b in search_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 3))
    story.append(Paragraph("3.3 Filter Architecture Summary Table", h2_style))

    filter_data = [
        [Paragraph("Filter Type", table_hdr), Paragraph("Scope / Component", table_hdr), Paragraph("Client Logic", table_hdr), Paragraph("Backend MongoDB Pipeline", table_hdr)],
        [
            Paragraph("<b>Date Range</b>", table_cell_bold),
            Paragraph("Global Analytics", table_cell),
            Paragraph("Redux <code>dateFilter</code> state with 6 presets & custom dates", table_cell),
            Paragraph("<code>$match: { orderDate: { $gte: start, $lte: end } }</code>", table_cell)
        ],
        [
            Paragraph("<b>Live Search (Orders)</b>", table_cell_bold),
            Paragraph("Orders Table", table_cell),
            Paragraph("300ms debounced input, resets <code>page=1</code>, 1-click 'X'", table_cell),
            Paragraph("<code>$or: [orderNumber, customer.*, items.*]</code> with regex", table_cell)
        ],
        [
            Paragraph("<b>Live Search (Products)</b>", table_cell_bold),
            Paragraph("Catalog Grid", table_cell),
            Paragraph("300ms debounced input, instant clear 'X', active filter chips", table_cell),
            Paragraph("<code>$or: [title, sku, category]</code> with regex", table_cell)
        ],
        [
            Paragraph("<b>Category Filter</b>", table_cell_bold),
            Paragraph("Products Catalog", table_cell),
            Paragraph("Single-click category pills (Electronics, Apparel, Bags, etc.)", table_cell),
            Paragraph("<code>$match: { category: selectedCategory }</code>", table_cell)
        ],
        [
            Paragraph("<b>Financial Status</b>", table_cell_bold),
            Paragraph("Orders Management", table_cell),
            Paragraph("Pill tabs: All, Paid, Pending, Refunded; resets <code>page=1</code>", table_cell),
            Paragraph("<code>$match: { financialStatus: status }</code>", table_cell)
        ],
        [
            Paragraph("<b>Metric Morph Selector</b>", table_cell_bold),
            Paragraph("Dashboard Chart", table_cell),
            Paragraph("Clicking KPI card updates <code>selectedMetric</code>; selected badge shown", table_cell),
            Paragraph("Combines revenue Trend & traffic Trend into single series", table_cell)
        ],
        [
            Paragraph("<b>Chart Style Switcher</b>", table_cell_bold),
            Paragraph("RevenueChart", table_cell),
            Paragraph("Toggles Area, Bar, Line; persists in <code>localStorage</code>", table_cell),
            Paragraph("Client-side dynamic Recharts component switching", table_cell)
        ],
    ]
    filter_table = Table(filter_data, colWidths=[80, 85, 165, 174])
    filter_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(filter_table)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: ANALYTICAL CALCULATIONS & MATHEMATICAL FORMULAS
    # =========================================================================
    story.append(Paragraph("4. Analytical Calculations & Mathematical Formulas", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "Every KPI, chart trend, and financial statistic in the platform is computed strictly through mathematical algorithms "
        "equipped with defensive zero-division guards and standardized Indian numbering rules.",
        body_style
    ))

    story.append(Paragraph("4.1 Core Financial Formulas & Guard Rules", h2_style))

    calc_data = [
        [Paragraph("Metric Name", table_hdr), Paragraph("Mathematical Formula", table_hdr), Paragraph("Zero-Division & Edge-Case Handling", table_hdr), Paragraph("Formatting & Units", table_hdr)],
        [
            Paragraph("<b>Total Revenue</b>", table_cell_bold),
            Paragraph("Revenue = Σ (order.totalAmount)<br/>for all paid & pending orders", table_cell),
            Paragraph("If no orders exist in period, returns <code>0</code>. Refunded orders are tracked separately.", table_cell),
            Paragraph("INR Currency (₹)<br/>e.g. ₹7,48,282", table_cell)
        ],
        [
            Paragraph("<b>Total Orders</b>", table_cell_bold),
            Paragraph("Orders = Σ 1<br/>for all orders within date window", table_cell),
            Paragraph("Counts every valid transaction document matched in the date range.", table_cell),
            Paragraph("Integer count<br/>e.g. 138 orders", table_cell)
        ],
        [
            Paragraph("<b>Average Order Value (AOV)</b>", table_cell_bold),
            Paragraph("AOV = Total Revenue / Total Orders", table_cell),
            Paragraph("If <code>Total Orders == 0</code>, returns <code>0</code> immediately, preventing <code>DivideByZero</code> / <code>NaN</code>.", table_cell),
            Paragraph("INR Currency (₹)<br/>e.g. ₹5,422", table_cell)
        ],
        [
            Paragraph("<b>Conversion Rate (%)</b>", table_cell_bold),
            Paragraph("CR = (Total Orders / Total Visitors) × 100", table_cell),
            Paragraph("If <code>Total Visitors == 0</code>, returns <code>0.00%</code>. Joins order count with VisitorTraffic aggregate.", table_cell),
            Paragraph("Percentage (%)<br/>e.g. 3.42%", table_cell)
        ],
        [
            Paragraph("<b>Period Growth (% Change)</b>", table_cell_bold),
            Paragraph("Δ% = ((Current - Previous) / Previous) × 100", table_cell),
            Paragraph("• Both 0: <code>0%</code><br/>• Prev 0 & Curr > 0: <code>+100%</code><br/>• Prev 0 & Curr < 0: <code>-100%</code>", table_cell),
            Paragraph("Signed % with arrows<br/>e.g. +14.8%, -3.2%", table_cell)
        ],
        [
            Paragraph("<b>Category Sales Share (%)</b>", table_cell_bold),
            Paragraph("Share = (Category Revenue / Total Revenue) × 100", table_cell),
            Paragraph("MongoDB <code>$unwind</code> items, <code>$lookup</code> products, and compute relative percentage.", table_cell),
            Paragraph("Percentage (%)<br/>e.g. 38.5%", table_cell)
        ],
        [
            Paragraph("<b>Product Profit Margin (%)</b>", table_cell_bold),
            Paragraph("Margin = ((Price - CostPrice) / Price) × 100", table_cell),
            Paragraph("If <code>costPrice</code> is undefined or <code>price == 0</code>, returns <code>N/A</code> safely.", table_cell),
            Paragraph("Percentage (%)<br/>e.g. 45% margin", table_cell)
        ],
        [
            Paragraph("<b>Basket Value Tiers</b>", table_cell_bold),
            Paragraph("Segmented by MongoDB <code>$bucket</code> into:<br/>&lt;₹1k, ₹1k-₹5k, ₹5k-₹10k, &gt;₹10k", table_cell),
            Paragraph("Assigns orders to default overflow bucket if totalAmount exceeds highest boundary.", table_cell),
            Paragraph("Bar chart series with order count & volume", table_cell)
        ],
        [
            Paragraph("<b>Fulfillment Rate (%)</b>", table_cell_bold),
            Paragraph("FR = (Fulfilled Orders / Total Orders) × 100", table_cell),
            Paragraph("If <code>Total Orders == 0</code>, returns <code>0%</code>. Evaluates <code>fulfillmentStatus == 'fulfilled'</code>.", table_cell),
            Paragraph("Percentage (%)<br/>e.g. 88.4%", table_cell)
        ],
    ]
    calc_table = Table(calc_data, colWidths=[80, 150, 164, 110])
    calc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(calc_table)

    story.append(Spacer(1, 6))
    story.append(Paragraph("4.2 Comparative Growth Calculation Implementation", h2_style))
    story.append(Paragraph(
        "In <code>server/src/utils/dateHelper.js</code>, growth is implemented as a standalone, deterministic pure function:",
        body_style
    ))

    code_snippet = (
        "export const calculatePercentageChange = (current = 0, previous = 0) => {\n"
        "  if (previous === 0) return current > 0 ? 100 : 0;\n"
        "  const change = ((current - previous) / previous) * 100;\n"
        "  return Math.round(change * 10) / 10; // Rounded to 1 decimal place\n"
        "};"
    )
    story.append(Paragraph(code_snippet.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: DATABASE SCHEMAS & DATA ENGINEERING
    # =========================================================================
    story.append(Paragraph("5. Database Schemas, Indexing & Data Engineering", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("5.1 Mongoose Schemas & Field Design", h2_style))
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
    story.append(Paragraph("5.2 Index Optimization for Analytical Aggregations", h2_style))
    index_bullets = [
        "<b>Compound Index <code>{ storeId: 1, orderDate: 1 }</code>:</b> Satisfies all date-bounded range queries in <code>$match</code> without collection scans.",
        "<b>Covered Queries:</b> Queries on <code>financialStatus</code> and <code>orderDate</code> execute directly in RAM indexes, keeping response times under 15ms.",
        "<b>Sparse SKU Index:</b> Ensures product uniqueness and rapid exact-match lookups during search and order item mapping."
    ]
    for b in index_bullets:
        story.append(Paragraph(f"&bull; &nbsp; {b}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("5.3 Synthetic Data Seeding Engine", h2_style))
    story.append(Paragraph(
        "A realistic seeding script (<code>server/src/seeds/seedData.js</code>) populates 30 consecutive days of orders and traffic. "
        "It generates authentic Indian customer personas (Mumbai, Bengaluru, Delhi), realistic market pricing in INR (Rs. 1,499 - Rs. 12,999), "
        "and weekend-adjusted footfall delivering a realistic 2.5% - 4.5% conversion rate.",
        body_style
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: BACKEND REST API REFERENCE
    # =========================================================================
    story.append(Paragraph("6. Backend REST API Reference", h1_style))
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
    # PAGE 8: ARCHITECTURAL PATTERNS & UI/UX SYSTEM
    # =========================================================================
    story.append(Paragraph("7. Architectural Patterns & UI/UX Design System", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("7.1 Architectural Patterns & Utilities", h2_style))
    patterns = [
        ("asyncHandler Wrapper (server/src/utils/asyncHandler.js)", "Eliminated repetitive try/catch blocks across every controller action. Automatically catches rejected promises and pipes them to Express's next() handler."),
        ("Centralized dateHelper (server/src/utils/dateHelper.js)", "Provides startOfDay(), endOfDay(), calculatePercentageChange(), and getDateRangeFromQuery(). Standardizes time zone parsing and comparative period generation into a single call."),
        ("Defensive Input Validation", "Integrated mongoose.isValidObjectId() guards to eliminate unhandled CastErrors when querying by ID, gracefully returning HTTP 404 instead of HTTP 500 crashes."),
        ("Safe Pagination Clamping", "Clamps user pagination parameters with upper and lower bounds (Math.max(1, page) and Math.min(100, limit)), protecting the database from malicious unbounded queries."),
        ("Mongoose Lean Read Operations", "Employs .lean() on read-only queries to bypass full Mongoose document instantiation, drastically reducing memory overhead and JSON serialization latency.")
    ]
    for title, desc in patterns:
        story.append(Paragraph(f"&bull; &nbsp; <b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 5))
    story.append(Paragraph("7.2 UI/UX Design System & Navigation", h2_style))
    design_points = [
        ("Clean Shopify Emerald Theme", "Restored the crisp white and emerald green palette (#10B981) authentic to the Shopify merchant aesthetic, featuring clean slate backgrounds and subtle borders."),
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
    # PAGE 9: SETUP & INSTALLATION GUIDE
    # =========================================================================
    story.append(Paragraph("8. Setup, Installation & Verification Guide", h1_style))
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
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Project Completion & Status", h2_style))
    story.append(Paragraph(
        "All features, endpoints, visualizations, responsive layouts, filter systems, calculations, and server optimizations have been verified and "
        "pushed to the main branch of the GitHub repository. The project is completely functional and ready for evaluation.",
        body_style
    ))

    story.append(Spacer(1, 8))

    # Sign-off box
    sign_data = [[
        Paragraph(
            "<b>Author / Developer:</b> Devicharan Prajapati<br/>"
            "<b>Project:</b> Shopify Store Analytics Dashboard<br/>"
            "<b>Store Identity:</b> Apex Retailers (Single Store Architecture)<br/>"
            "<b>Repository:</b> https://github.com/DevicharanPrajapati/ShopifyAnalyticsDashboard.git<br/>"
            "<b>Status:</b> All Requirements Completed, Verified & Documented",
            callout_style
        )
    ]]
    sign_table = Table(sign_data, colWidths=[504])
    sign_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
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
