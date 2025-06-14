import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils';
import { Search, Filter, Grid, List, ShoppingCart, Star, Eye, Heart } from 'lucide-react';

const ProductsPage: React.FC = () => {  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [sortBy, setSortBy] = useState('name');  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { addToCartSimple } = useCart();

  const categories = ['Cleansers', 'Moisturizers', 'Serums', 'Sunscreens', 'Toners', 'Face Masks', 'Eye Care', 'Treatments', 'Body Care', 'Lip Care'];
  const skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal', 'All Types'];

  useEffect(() => {
    fetchProducts();
  }, []);  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({
        search: searchTerm,
        category: selectedCategory,
        skinType: selectedSkinType ? [selectedSkinType] : undefined,
        sortBy,
      });
      setProducts(data.data?.products || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedSkinType, sortBy]);
  // Cleanup function to clear all pending cart timeouts
  useEffect(() => {
    return () => {
      // No timeouts to clear in simplified version
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log(`[ProductsPage] handleAddToCart called for: ${product.title}, Timestamp: ${Date.now()}`);
    addToCartSimple(product);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSkinType = !selectedSkinType || 
                           (product.skinType && product.skinType.includes(selectedSkinType));
    
    return matchesSearch && matchesCategory && matchesSkinType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.title.localeCompare(b.title);
    }
  });  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover premium skincare products curated for your perfect routine
            </p>
          </div>

          {/* Search and Filters Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for your perfect skincare product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>

            {/* Filter Toggle and View Mode */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Filters */}
            {filtersOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skin Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Type</label>
                  <select
                    value={selectedSkinType}
                    onChange={(e) => setSelectedSkinType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  >
                    <option value="">All Skin Types</option>
                    {skinTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Loading State for Products Only */}
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading our amazing products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover premium skincare products curated for your perfect routine
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for your perfect skincare product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
            />
          </div>

          {/* Filter Toggle and View Mode */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {loading ? 'Loading...' : `Found ${sortedProducts.length} products`}
                </span>
                
                <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          {filtersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skin Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Type</label>
                <select
                  value={selectedSkinType}
                  onChange={(e) => setSelectedSkinType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                >
                  <option value="">All Skin Types</option>
                  {skinTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-sm">
            <div className="flex items-center">
              <span className="font-semibold">Error:</span>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}        {/* Products Grid/List */}
        <div className="relative">
          {/* Loading overlay for products only */}
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          )}          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.has(product._id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map(product => (
                <ProductListItem 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.has(product._id)}
                />
              ))}
            </div>
          )}
        </div>

        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedSkinType('');
                }}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component for Grid View
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product._id}`} className="block">
          <img
            src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Link 
              to={`/products/${product._id}`}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </Link>            <button 
              onClick={() => onToggleWishlist(product._id)}
              className={`p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${
                isWishlisted ? 'bg-pink-100 text-pink-600' : 'bg-white text-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="p-6">        {/* Category */}
        {product.category && (
          <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full mb-3">
            {product.category}
          </span>
        )}

        {/* Title and Description */}
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">(24)</span>
        </div>

        {/* Skin Types */}
        {product.skinType && product.skinType.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.skinType.slice(0, 2).map(type => (                <span key={type} className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {type}
                </span>
              ))}
              {product.skinType.length > 2 && (
                <span className="text-xs text-gray-500">+{product.skinType.length - 2} more</span>
              )}
            </div>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-pink-600">
            Rs. {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg transition-all duration-200 ${
              product.stock > 0
                ? 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-110 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Product List Item Component for List View
const ProductListItem: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 relative">
          <Link to={`/products/${product._id}`}>
            <img
              src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-48 md:h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        <div className="md:w-3/4 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex-1">                {product.category && (
                  <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full mb-2">
                    {product.category}
                  </span>
                )}
                
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                    {product.title}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-bold text-pink-600">
                  Rs. {product.price.toLocaleString()}
                </span>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>

            {product.skinType && product.skinType.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Suitable for:</p>
                <div className="flex flex-wrap gap-2">                  {product.skinType.map(type => (
                    <span key={type} className="inline-block bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex space-x-2">
              <Link 
                to={`/products/${product._id}`}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>              <button 
                onClick={() => onToggleWishlist(product._id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                product.stock > 0
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
