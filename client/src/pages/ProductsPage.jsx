import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  RefreshCw,
  TrendingUp,
  Layers,
  Boxes,
  PieChart as PieIcon,
  BarChart2,
  CheckCircle2,
  X,
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
import { useSelector } from 'react-redux';
import { productsAPI, analyticsAPI } from '../services/api';
import Badge from '../components/common/Badge';
import DateFilter from '../features/analytics/components/DateFilter';
import ErrorMessage from '../components/common/ErrorMessage';

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

const CustomStockTooltip = ({ active, payload }) => {
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
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';
  const gridStroke = isDark ? '#334155' : '#f1f5f9';
  const axisLineStroke = isDark ? '#475569' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';

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

  const fetchProducts = async (currentSearch = searchQuery, currentCategory = selectedCategory) => {
    try {
      setLoading(true);
      setError(null);
      const res = await productsAPI.getProducts({
        search: currentSearch?.trim() || undefined,
        category: currentCategory || undefined,
        limit: 50,
      });
      if (res.data.success) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || err.message || 'Failed to fetch products');
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
    } catch {
      // Handled silently to avoid polluting console
    } finally {
      setStatsLoading(false);
    }
  };

  // Debounced search & filter effect (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchProductStats();
  }, [dateFilter.preset, dateFilter.startDate, dateFilter.endDate]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    fetchProducts(searchQuery, selectedCategory);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Products & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Catalog inventory, stock velocity, and category performance for <span className="font-bold text-slate-700 dark:text-slate-300">Apex Retailers</span>
          </p>
        </div>

        <button
          onClick={() => {
            fetchProducts();
            fetchProductStats();
          }}
          disabled={loading || statsLoading}
          className="inline-flex items-center self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 text-slate-600 dark:text-slate-400 ${
              loading || statsLoading ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''
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
        <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalCatalogCount}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Active live SKUs in catalog</p>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Units in Stock</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalStockCount}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Total physical inventory units</p>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalUnitsSold}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Volume sold in selected period</p>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Category</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 truncate">
            {topCategory?.category || 'General'}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {topCategory ? `₹${(topCategory.revenue || 0).toLocaleString('en-IN')} (${topCategory.percentage}%)` : 'No sales yet'}
          </p>
        </div>
      </div>

      {/* Analytics Charts: Category Share & Stock vs Units Sold */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category Sales Share (Donut Chart) */}
        <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PieIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Category Sales Share</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Revenue split across product lines</p>
              </div>
            </div>

            <div className="w-full h-56 sm:h-64 relative min-w-0 overflow-hidden">
              {productStats.categoryShare?.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
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
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.category}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold">({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Inventory Stock vs Units Sold (Bar Chart) */}
        <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs min-w-0">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Inventory Stock vs Units Sold</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Sales velocity vs available shelf stock</p>
            </div>
          </div>

          <div className="w-full h-56 sm:h-64 min-w-0 overflow-hidden">
            {productStats.stockComparison?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                No product comparison data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productStats.stockComparison}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    axisLine={{ stroke: axisLineStroke }}
                    tick={{ fill: tickColor, fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: axisLineStroke }}
                    tick={{ fill: tickColor, fontSize: 10 }}
                  />
                  <RechartsTooltip content={<CustomStockTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  />
                  <Bar dataKey="unitsSold" name="Units Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stockRemaining" name="In Stock" fill={isDark ? '#64748b' : '#94a3b8'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Product Catalog Filters & Search */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search title, SKU, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/70 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 active:scale-95 text-white rounded-xl cursor-pointer transition-all shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Active Search & Filter Indicators */}
      {(searchQuery || selectedCategory) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-2xl shadow-2xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium rounded-xl text-[11px]">
              <span>Search: <strong className="font-bold">"{searchQuery}"</strong></span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-full cursor-pointer transition-colors"
                title="Remove search filter"
              >
                <X className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-medium rounded-xl text-[11px]">
              <span>Category: <strong className="font-bold">{selectedCategory}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-full cursor-pointer transition-colors"
                title="Remove category filter"
              >
                <X className="w-3 h-3 text-blue-700 dark:text-blue-400" />
              </button>
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
            ({products.length} {products.length === 1 ? 'item' : 'items'} found)
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
            }}
            className="ml-auto text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold cursor-pointer hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <ErrorMessage
          title="Unable to Load Products"
          message={error}
          onRetry={() => {
            fetchProducts();
            fetchProductStats();
          }}
          isRetrying={loading || statsLoading}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-emerald-600 dark:text-emerald-400" />
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400 dark:text-slate-500" />
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
                className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:shadow-md dark:hover:border-slate-600 transition-all overflow-hidden flex flex-col group"
              >
                {/* Product Image */}
                <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
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
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                      SKU: {product.sku}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                    <div>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                      {margin !== null && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {margin}% profit margin
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {product.inventoryQuantity || 0} in stock
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Inventory</p>
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
