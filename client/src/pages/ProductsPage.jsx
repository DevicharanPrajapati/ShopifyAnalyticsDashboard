import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { productsAPI } from '../services/api';
import Badge from '../components/common/Badge';

const ProductsPage = () => {
  const { activeStore, availableStores } = useSelector((state) => state.analytics);
  const currentStore = availableStores.find((s) => s.id === activeStore) || availableStores[0];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productsAPI.getProducts({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        limit: 50,
        storeId: activeStore,
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

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, activeStore]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = ['', 'Electronics', 'Accessories', 'Apparel', 'Footwear', 'Home & Kitchen', 'Bags'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inventory & pricing for <span className="font-bold text-slate-700">{currentStore.name}</span> ({currentStore.owner})
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="inline-flex items-center self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-600 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search */}
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
          No products found for {currentStore.name}
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
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      {margin && (
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
