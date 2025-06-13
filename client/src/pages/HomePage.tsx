import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
        // The API returns data.products, not data directly
        setFeaturedProducts(response.data?.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">GlowSkin</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover premium skincare products curated for your skin's unique needs. 
            Transform your skincare routine with our expertly selected collection.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/products" className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
            <Link to="/products" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">GlowSkin</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best skincare experience through quality products and exceptional service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                All our products are carefully selected and tested to ensure the highest quality for your skin.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery across Sri Lanka. Get your skincare essentials delivered to your doorstep.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Our skincare experts are here to help you choose the perfect products for your skin type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">Discover our most popular skincare solutions</p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getImageUrl(product.images[0])} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">No Image</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-bold">LKR {product.price.toLocaleString()}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-pink-600 text-white text-sm px-4 py-2 rounded hover:bg-pink-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/products" className="border-2 border-pink-600 text-pink-600 px-6 py-2 rounded hover:bg-pink-600 hover:text-white transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and skincare tips.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-pink-600 px-6 py-2 rounded hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
