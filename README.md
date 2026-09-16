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

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React / Next.js *(planned / in progress)*
- **Data Visualization**: Chart.js / Recharts *(planned)*

---

## 📁 Project Structure

```text
SopifyStoreAnalytics/
├── assignment.txt                    # Project assignment requirements
├── .gitignore                        # Root git ignore
├── README.md                         # Project documentation
├── client/                           # Frontend React 19 + Vite App
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Badge, SkeletonLoader
│   │   │   └── layout/               # AppLayout, Sidebar, Navbar, Footer
│   │   ├── features/                 # Modular feature-based components
│   │   │   ├── analytics/components/ # MetricCard, DateFilter, RevenueChart, TopProducts, OrderStatusChart
│   │   │   └── orders/components/    # RecentOrdersTable
│   │   ├── pages/                    # Dedicated page views
│   │   │   ├── DashboardPage.jsx     # Main Analytics Dashboard (/)
│   │   │   ├── OrdersPage.jsx        # Full Orders Explorer (/orders)
│   │   │   ├── ProductsPage.jsx      # Products Catalog (/products)
│   │   │   └── SettingsPage.jsx      # System & Health Settings (/settings)
│   │   ├── redux/                    # Redux Toolkit store & slices (analytics, ui)
│   │   └── services/api.js           # Axios API client
│   └── vite.config.js                # Vite & Tailwind CSS v4 setup
└── server/                           # Backend API
    ├── .env                          # Environment variables (git-ignored)
    ├── .env.example                  # Environment template
    ├── package.json                  # Backend dependencies & scripts
    └── src/
        ├── app.js                    # Express app configuration & middleware
        ├── server.js                 # HTTP server entry point & DB connection
        ├── config/db.js              # MongoDB connection handler
        ├── controllers/              # Analytics, Orders, Products controllers
        ├── models/                   # Order, Product, VisitorTraffic Mongoose models
        ├── routes/                   # API routes
        ├── seeds/seedData.js         # 30-day realistic Shopify sales seeder
        └── services/analyticsService.js # MongoDB aggregation pipelines
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Environment Configuration
Create or edit `server/.env`:
```env
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.grloqmf.mongodb.net/?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Seed Realistic Data
```bash
npm run seed
```

### 5. Start Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/analytics/dashboard` | Complete dashboard payload (overview, trend, top products, recent orders) |
| `GET` | `/api/analytics/overview` | KPI summaries (Revenue, Orders, AOV, Conversion Rate) |
| `GET` | `/api/analytics/revenue-trend` | Time-series data for revenue charts |
| `GET` | `/api/analytics/top-products` | Top-selling items by revenue |
| `GET` | `/api/analytics/recent-orders` | Recent orders list |
| `GET` | `/api/analytics/status-breakdown`| Financial status distribution |
| `GET` | `/api/products` | Paginated product list |
| `GET` | `/api/orders` | Paginated orders with search and status filters |
