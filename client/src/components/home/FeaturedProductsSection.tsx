import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { getImageUrl } from '../../utils';

interface FeaturedProductsSectionProps {
  featuredProducts: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  featuredProducts,
  loading,
  onAddToCart
}) => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most loved skincare essentials, carefully selected for maximum effectiveness
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group relative">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded-lg w-24"></div>
                      <div className="h-10 bg-gray-300 rounded-xl w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product._id} 
                className={`group relative animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/50">
                  <div className="relative h-64 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getImageUrl(product.images[0])} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          </div>
                          <p className="text-gray-400 font-medium">No Image Available</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Product Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Featured
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          LKR {product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                        className="group/btn relative px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <span className="relative z-10">Add to Cart</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            View All Products
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
