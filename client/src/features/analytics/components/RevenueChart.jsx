import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  IndianRupee,
  ShoppingCart,
  Percent,
  TrendingUp,
  AreaChart as AreaIcon,
  BarChart2,
  LineChart as LineIcon,
} from "lucide-react";

const METRIC_CONFIG = {
  revenue: {
    key: "revenue",
    label: "Total Revenue",
    shortLabel: "Revenue",
    icon: IndianRupee,
    unitPrefix: "₹",
    unitSuffix: "",
    stroke: "#10b981", // Emerald
    gradientId: "colorRevenue",
    gradientColor: "#10b981",
    yAxisFormatter: (val) =>
      val >= 100000
        ? `₹${(val / 100000).toFixed(1)}L`
        : val >= 1000
          ? `₹${(val / 1000).toFixed(0)}k`
          : `₹${val}`,
    tooltipFormatter: (val) => `₹${(val || 0).toLocaleString("en-IN")}`,
  },
  orders: {
    key: "orders",
    label: "Total Orders",
    shortLabel: "Orders",
    icon: ShoppingCart,
    unitPrefix: "",
    unitSuffix: " orders",
    stroke: "#0284c7", // Sky Blue
    gradientId: "colorOrders",
    gradientColor: "#0ea5e9",
    yAxisFormatter: (val) => val,
    tooltipFormatter: (val) => `${val || 0} orders`,
  },
  conversion: {
    key: "conversionRate",
    label: "Online Store Conversion Rate",
    shortLabel: "Conversion",
    icon: Percent,
    unitPrefix: "",
    unitSuffix: "%",
    stroke: "#d97706", // Amber
    gradientId: "colorConversion",
    gradientColor: "#f59e0b",
    yAxisFormatter: (val) => `${val}%`,
    tooltipFormatter: (val) => `${val || 0}%`,
  },
  aov: {
    key: "aov",
    label: "Average Order Value (AOV)",
    shortLabel: "Avg Order Value",
    icon: TrendingUp,
    unitPrefix: "₹",
    unitSuffix: "",
    stroke: "#7c3aed", // Purple
    gradientId: "colorAov",
    gradientColor: "#8b5cf6",
    yAxisFormatter: (val) =>
      val >= 1000 ? `₹${(val / 1000).toFixed(1)}k` : `₹${val}`,
    tooltipFormatter: (val) => `₹${(val || 0).toLocaleString("en-IN")}`,
  },
};

const CustomTooltip = ({ active, payload, label, activeMetricKey }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const config = METRIC_CONFIG[activeMetricKey] || METRIC_CONFIG.revenue;

    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800 min-w-[190px]">
        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1.5 mb-2">
          {label}
        </p>

        {/* Primary Selected Metric */}
        <div className="flex items-center justify-between gap-3 text-sm font-extrabold pb-1">
          <span style={{ color: config.stroke }}>{config.shortLabel}:</span>
          <span className="text-white">
            {config.tooltipFormatter(data[config.key])}
          </span>
        </div>

        {/* Supporting Contextual Metrics */}
        <div className="pt-1.5 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
          {activeMetricKey !== "revenue" && (
            <div className="flex items-center justify-between">
              <span>Day Revenue:</span>
              <span className="text-slate-200 font-semibold">
                ₹{(data.revenue || 0).toLocaleString("en-IN")}
              </span>
            </div>
          )}
          {activeMetricKey !== "orders" && (
            <div className="flex items-center justify-between">
              <span>Day Orders:</span>
              <span className="text-slate-200 font-semibold">
                {data.orders || 0}
              </span>
            </div>
          )}
          {activeMetricKey !== "conversion" && (
            <div className="flex items-center justify-between">
              <span>Conversion:</span>
              <span className="text-slate-200 font-semibold">
                {data.conversionRate || 0}%
              </span>
            </div>
          )}
          {activeMetricKey !== "aov" && (
            <div className="flex items-center justify-between">
              <span>Avg Basket:</span>
              <span className="text-slate-200 font-semibold">
                ₹{(data.aov || 0).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data = [], selectedMetric = "revenue", overview }) => {
  // Chart Style / Type State ('area' | 'bar' | 'line') with localStorage persistence
  const [chartType, setChartType] = useState(() => {
    try {
      return localStorage.getItem("shopify_chart_type") || "area";
    } catch {
      return "area";
    }
  });

  const handleChartTypeChange = (type) => {
    setChartType(type);
    try {
      localStorage.setItem("shopify_chart_type", type);
    } catch {
      // ignore
    }
  };

  const activeConfig = METRIC_CONFIG[selectedMetric] || METRIC_CONFIG.revenue;
  const ActiveIcon = activeConfig.icon;

  const formattedData = data.map((item) => {
    const dateObj = new Date(item.date);
    const displayDate = !isNaN(dateObj)
      ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : item.date;

    return {
      ...item,
      displayDate,
    };
  });

  // Calculate Period Totals or Averages
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
  const avgConversion = overview?.current?.conversionRate || 0;
  const avgAov =
    overview?.current?.averageOrderValue ||
    (totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0);

  const getSubtext = () => {
    switch (selectedMetric) {
      case "orders":
        return (
          <>
            Period Total:{" "}
            <span className="font-bold text-slate-900">
              {totalOrders} completed orders
            </span>
            {" • "}
            <span className="text-slate-500">
              ₹
              {totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}{" "}
              net revenue
            </span>
          </>
        );
      case "conversion":
        return (
          <>
            Period Average:{" "}
            <span className="font-bold text-slate-900">{avgConversion}%</span>
            {" • "}
            <span className="text-slate-500">
              {totalOrders} conversions from store visits
            </span>
          </>
        );
      case "aov":
        return (
          <>
            Period Average:{" "}
            <span className="font-bold text-slate-900">
              ₹{avgAov.toLocaleString("en-IN")} per order
            </span>
            {" • "}
            <span className="text-slate-500">
              {totalOrders} orders evaluated
            </span>
          </>
        );
      case "revenue":
      default:
        return (
          <>
            Period Total:{" "}
            <span className="font-bold text-slate-900">
              ₹
              {totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </span>
            {" • "}
            <span className="text-slate-700 font-semibold">
              {totalOrders} orders
            </span>
          </>
        );
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0 w-full overflow-hidden">
      {/* Header with Metric Information and Dual Selectors (Metric & Chart Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: activeConfig.stroke }}
            >
              <ActiveIcon className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {activeConfig.label} Over Time
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{getSubtext()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Chart Style / Type Switcher: Area | Bar | Line */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => handleChartTypeChange("area")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === "area"
                  ? "bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Area Chart (Smooth gradient fill)"
            >
              <AreaIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Area</span>
            </button>

            <button
              onClick={() => handleChartTypeChange("bar")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === "bar"
                  ? "bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Bar Chart (Discrete columns)"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bar</span>
            </button>

            <button
              onClick={() => handleChartTypeChange("line")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === "line"
                  ? "bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Line Chart (Trend line & points)"
            >
              <LineIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Line</span>
            </button>
          </div>

          {/* Selected Card Indicator (Name of currently selected KPI card) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeConfig.stroke }}
            />
            <span className="text-slate-400 font-medium">Selected:</span>
            <span className="text-slate-900 font-extrabold">
              {activeConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Recharts Chart Area (Morphs between Area, Bar, and Line) */}
      <div className="w-full h-64 sm:h-72 lg:h-80 min-w-0 overflow-hidden">
        {formattedData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs sm:text-sm">
            No transaction records available for this date window
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                accessibilityLayer={false}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  minTickGap={25}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  width={50}
                  tickFormatter={activeConfig.yAxisFormatter}
                />
                <Tooltip
                  content={<CustomTooltip activeMetricKey={selectedMetric} />}
                  cursor={false}
                />
                <Bar
                  dataKey={activeConfig.key}
                  name={activeConfig.label}
                  fill={activeConfig.stroke}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                accessibilityLayer={false}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  minTickGap={25}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  width={50}
                  tickFormatter={activeConfig.yAxisFormatter}
                />
                <Tooltip
                  content={<CustomTooltip activeMetricKey={selectedMetric} />}
                  cursor={false}
                />
                <Line
                  type="monotone"
                  dataKey={activeConfig.key}
                  name={activeConfig.label}
                  stroke={activeConfig.stroke}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: activeConfig.stroke }}
                  activeDot={{
                    r: 6,
                    fill: activeConfig.stroke,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            ) : (
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                accessibilityLayer={false}
              >
                <defs>
                  <linearGradient
                    id={activeConfig.gradientId}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="5%"
                      stopColor={activeConfig.gradientColor}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={activeConfig.gradientColor}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  minTickGap={25}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  width={50}
                  tickFormatter={activeConfig.yAxisFormatter}
                />
                <Tooltip
                  content={<CustomTooltip activeMetricKey={selectedMetric} />}
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey={activeConfig.key}
                  name={activeConfig.label}
                  stroke={activeConfig.stroke}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${activeConfig.gradientId})`}
                  activeDot={{
                    r: 6,
                    fill: activeConfig.stroke,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
