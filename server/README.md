# Shopify Store Analytics - Server API

Backend REST API built with **Node.js, Express, and MongoDB** to power the Shopify Store Analytics Dashboard.

## Features

- **Dashboard Metrics**: Total revenue, order count, average order value (AOV), conversion rate (orders vs. store traffic), and previous period comparisons with percentage changes.
- **Revenue Over Time**: Daily and customizable date-range aggregations for line/area charts.
- **Top Products**: Ranked by units sold and revenue.
- **Recent Orders & Status Breakdown**: Real-time order listing and status breakdown (financial & fulfillment).
- **Date-Range Filtering**: Support for presets (`today`, `yesterday`, `7d`, `30d`, `90d`, `1y`) or custom `startDate` and `endDate`.
- **Database Seeder**: Realistic 90-day transaction history generator for instant testing.

---

## Getting Started

### 1. Configure Environment Variables
Ensure `.env` contains your MongoDB Atlas connection string (replace `<db_username>` and password with your credentials):
```env
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.grloqmf.mongodb.net/?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database with Realistic Data
```bash
npm run seed
```

### 4. Start the Server
- Development mode (with auto-reload):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/analytics/dashboard` | All dashboard data in a single optimized response |
| `GET` | `/api/analytics/overview` | KPI summary cards (Revenue, Orders, AOV, Conversion Rate) |
| `GET` | `/api/analytics/revenue-trend` | Daily revenue & order counts for charts |
| `GET` | `/api/analytics/top-products` | Top selling products by revenue |
| `GET` | `/api/analytics/recent-orders` | Latest 10 orders |
| `GET` | `/api/analytics/status-breakdown`| Financial status distribution |
| `GET` | `/api/products` | Paginated product list |
| `GET` | `/api/orders` | Paginated order list with search and filter |

### Query Parameters for Analytics
- `preset`: `today` \| `yesterday` \| `7d` \| `30d` (default) \| `90d` \| `1y`
- `startDate`: `YYYY-MM-DD` (optional, for custom range)
- `endDate`: `YYYY-MM-DD` (optional, for custom range)
- `limit`: number of items (for top products or recent orders)
