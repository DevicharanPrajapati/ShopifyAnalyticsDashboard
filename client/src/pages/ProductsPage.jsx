import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Layers,
  Boxes,
  PieChart as PieIcon,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { productsAPI, analyticsAPI } from '../services/api';
import Badge from '../components/common/Badge';
import DateFilter from '../features/analytics/components/DateFilter';

const CATEGORY_COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
];

const CustomCategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{data.category}</p>
        <p className="text-emerald-400 font-bold">Revenue: ₹{data.revenue?.toLocaleString('en-IN')}</p>
        <p className="text-slate-300">Units Sold: {data.unitsSold}</p>
        <p className="text-slate-400">Share: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const CustomStockTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{data.title}</p>
        <p className="text-emerald-400 font-bold">Units Sold: {data.unitsSold}</p>
        <p className="text-slate-300">In Stock: {data.stockRemaining}</p>
        <p className="text-slate-400">Sales Value: ₹{data.revenue?.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState({ categoryShare: [], stockComparison: [] });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFilter, setDateFilter] = useState({
    preset: '30d',
    startDate: '',
    endDate: '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productsAPI.getProducts({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        limit: 50,
      });
      if (res.data.success) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      setStatsLoading(true);
      const res = await analyticsAPI.getProductsStats(dateFilter);
      if (res.data.success) {
        setProductStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch product stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    fetchProductStats();
  }, [dateFilter.preset, dateFilter.startDate, dateFilter.endDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleFilterChange = (newFilter) => {
    setDateFilter(newFilter);
  };

  const categories = ['', 'Electronics', 'Accessories', 'Apparel', 'Footwear', 'Home & Kitchen', 'Bags'];

  // Summary Metrics
  const totalCatalogCount = products.length;
  const totalStockCount = products.reduce((sum, p) => sum + (p.inventoryQuantity || 0), 0);
  const totalUnitsSold = productStats.categoryShare?.reduce((sum, c) => sum + (c.unitsSold || 0), 0) || 0;
  const topCategory = productStats.categoryShare?.[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Products & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catalog inventory, stock velocity, and category performance for <span className="font-bold text-slate-700">Apex Retailers</span>
          </p>
        </div>

        <button
          onClick={() => {
            fetchProducts();
            fetchProductStats();
          }}
          disabled={loading || statsLoading}
          className="inline-flex items-center self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 text-slate-600 ${
              loading || statsLoading ? 'animate-spin text-emerald-600' : ''
            }`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Date Range Filter for Product Analytics */}
      <DateFilter
        activePreset={dateFilter.preset}
        startDate={dateFilter.startDate}
        endDate={dateFilter.endDate}
        onFilterChange={handleFilterChange}
      />

      {/* Products KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalCatalogCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active live SKUs in catalog</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Units in Stock</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalStockCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Total physical inventory units</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalUnitsSold}</p>
          <p className="text-[11px] text-slate-400 mt-1">Volume sold in selected period</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Category</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 truncate">
            {topCategory?.category || 'General'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {topCategory ? `₹${(topCategory.revenue || 0).toLocaleString('en-IN')} (${topCategory.percentage}%)` : 'No sales yet'}
          </p>
        </div>
      </div>

      {/* Analytics Charts: Category Share & Stock vs Units Sold */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category Sales Share (Donut Chart) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PieIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Category Sales Share</h3>
                <p className="text-[11px] text-slate-500">Revenue split across product lines</p>
              </div>
            </div>

            <div className="w-full h-56 sm:h-64 relative min-w-0 overflow-hidden">
              {productStats.categoryShare?.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No category sales recorded
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip content={<CustomCategoryTooltip />} />
                    <Pie
                      data={productStats.categoryShare}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {productStats.categoryShare.map((entry, index) => (
                        <Cell
                          key={`cat-cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
              {productStats.categoryShare?.map((item, index) => (
                <div key={item.category} className="flex items-center space-x-1.5 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                  ></span>
                  <span className="text-slate-700 font-medium">{item.category}</span>
                  <span className="text-slate-400 font-semibold">({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Inventory Stock vs Units Sold (Bar Chart) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Inventory Stock vs Units Sold</h3>
              <p className="text-[11px] text-slate-500">Sales velocity vs available shelf stock</p>
            </div>
          </div>

          <div className="w-full h-56 sm:h-64 min-w-0 overflow-hidden">
            {productStats.stockComparison?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                No product comparison data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productStats.stockComparison}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <RechartsTooltip content={<CustomStockTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  />
                  <Bar dataKey="unitsSold" name="Units Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stockRemaining" name="In Stock" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Product Catalog Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search product title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer transition-all active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-emerald-600" />
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No products found matching your search criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => {
            const margin = product.costPrice
              ? Math.round(((product.price - product.costPrice) / product.price) * 100)
              : null;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Product Image */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 right-2.5">
                    <Badge status={product.status || 'active'} />
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      SKU: {product.sku}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-base font-extrabold text-slate-900">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                      {margin !== null && (
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {margin}% profit margin
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">
                        {product.inventoryQuantity || 0} in stock
                      </p>
                      <p className="text-[10px] text-slate-400">Inventory</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
