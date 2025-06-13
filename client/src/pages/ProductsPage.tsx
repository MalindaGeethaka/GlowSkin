import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();

  const categories = ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'treatment', 'mask'];
  const skinTypes = ['normal', 'dry', 'oily', 'combination', 'sensitive'];

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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
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
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Products</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Skin Type</label>
              <select
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Skin Types</option>
                {skinTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-pink-600">
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {product.category && (
                <div className="mb-3">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>
              )}

              {product.skinType && product.skinType.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600">Suitable for:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.skinType.map(type => (
                      <span key={type} className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  product.stock > 0
                    ? 'bg-pink-600 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
