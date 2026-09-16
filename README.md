# ShopifyAnalyticsDashboard

A full-stack Shopify Store Analytics Dashboard designed to monitor and visualize store performance metrics in real-time.

---

## 📊 Features

- **Store Performance Metrics (KPIs)**:
  - **Total Revenue**: Aggregate revenue from completed orders.
  - **Orders**: Total order volume across time periods.
  - **Conversion Rate**: Dynamic conversion calculation (`(Orders / Store Visitors) * 100`).
  - **Average Order Value (AOV)**: Average amount spent per transaction.
  - **Period-over-Period Comparison**: Growth/drop percentages compared to the preceding period.
- **Visual Analytics**:
  - **Revenue Over Time**: Interactive daily and custom-interval revenue and order trends.
  - **Top Products**: Ranked breakdown of bestsellers by revenue and units sold.
  - **Order Status Breakdown**: Financial and fulfillment status distributions.
- **Date-Range Filtering**:
  - Pre-set ranges (`Today`, `Yesterday`, `7 Days`, `30 Days`, `90 Days`, `1 Year`).
  - Custom date range picker (`startDate` & `endDate`).
- **Database Seeder**:
  - Realistic 90-day transaction history generator for testing without manual data entry.

---

## 🛠️ Tech Stack

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Redux Toolkit, Tailwind CSS v4, Lucide React
- **Data Visualization**: Recharts (Dynamic Area, Bar, Line, Donut, Horizontal Bar charts)
- **Backend**: Node.js (v20+), Express.js (REST API, `asyncHandler`, `ApiResponse`, `ApiError`)
- **Database**: MongoDB Atlas with Mongoose ODM (multi-stage aggregation pipelines, compound indexes)
- **Currency**: Indian Rupee (INR / ₹) with `en-IN` number grouping

---

## 📁 Project Structure

```text
SopifyStoreAnalytics/
├── .gitignore                                    # Root git ignore
├── README.md                                     # Project documentation
├── Shopify_Store_Analytics_Project_Documentation.pdf # 9-page Technical Manual
├── generate_project_pdf.py                       # PDF generator script
├── client/                                       # Frontend React 19 + Vite App
│   ├── .env.example                              # Client environment template
│   ├── index.html                                # HTML shell with Plus Jakarta Sans
│   ├── package.json                              # Frontend dependencies & scripts
│   ├── vite.config.js                            # Vite build setup
│   └── src/
│       ├── components/
│       │   ├── common/                           # Logo, Badge, SkeletonLoader
│       │   └── layout/                           # AppLayout, Sidebar, Navbar, Footer
│       ├── features/
│       │   ├── analytics/components/             # MetricCard, DateFilter, RevenueChart, TopProducts...
│       │   └── orders/components/                # RecentOrdersTable
│       ├── pages/                                # Dedicated page views
│       │   ├── DashboardPage.jsx                 # Main Analytics Dashboard (/)
│       │   ├── OrdersPage.jsx                    # Full Orders Explorer & Analytics (/orders)
│       │   └── ProductsPage.jsx                  # Catalog Inventory & Stock Velocity (/products)
│       ├── redux/                                # Redux Toolkit store & slices (analytics, ui)
│       └── services/api.js                       # Axios configured API client
└── server/                                       # Backend Node.js Express API
    ├── .env.example                              # Server environment template
    ├── package.json                              # Backend dependencies & scripts
    └── src/
        ├── app.js                                # Express app configuration & middleware
        ├── server.js                             # HTTP server entry point & DB connection
        ├── config/db.js                          # MongoDB Atlas connection handler
        ├── controllers/                          # Analytics, Orders, Products controllers
        ├── middlewares/                          # Centralized error handler & 404 middleware
        ├── models/                               # Order, Product, VisitorTraffic Mongoose models
        ├── routes/                               # REST API routes
        ├── seeds/seedData.js                     # 30-day realistic Shopify sales seeder
        ├── services/analyticsService.js          # MongoDB multi-stage aggregation pipelines
        └── utils/                                # ApiResponse, ApiError, asyncHandler, dateHelper
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas cluster connection string (or local MongoDB)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env     # Configure PORT, MONGODB_URL, CLIENT_URL
npm run seed             # Populates 8 products, 138 orders in INR, 30 days traffic
npm run dev              # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env     # Configure VITE_API_URL if needed
npm run dev              # Runs on http://localhost:5173
npm run build            # Compiles production bundle into client/dist
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and timestamp |
| `GET` | `/api/analytics/dashboard` | Consolidated dashboard payload (overview, trend, top products, orders) |
| `GET` | `/api/analytics/overview` | KPI summaries with comparative growth (Revenue, Orders, AOV, Conversion) |
| `GET` | `/api/analytics/revenue-trend` | Time-series data for revenue charts |
| `GET` | `/api/analytics/orders-stats` | Order value basket tiers & daily AOV trend |
| `GET` | `/api/analytics/products-stats`| Category share & inventory stock vs units sold |
| `GET` | `/api/analytics/top-products` | Top-selling items by revenue in INR |
| `GET` | `/api/analytics/recent-orders` | Recent orders live feed |
| `GET` | `/api/products` | Paginated product catalog with live debounced search |
| `GET` | `/api/orders` | Paginated orders with search and status filters |

---

## 🚢 Deployment Guide

1. **Backend (Render / Railway / Heroku / AWS)**:
   - Set Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: `5000` (or provided dynamically)
     - `MONGODB_URL`: Your MongoDB Atlas connection string
     - `CLIENT_URL`: URL of your deployed frontend (e.g. `https://your-frontend.vercel.app`)
     - `NODE_ENV`: `production`

2. **Frontend (Vercel / Netlify / Cloudflare Pages)**:
   - Set Root Directory: `client`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: Your deployed backend URL + `/api` (e.g. `https://your-backend.onrender.com/api`)

