import React from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible }) => {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000"></div>
      </div>
      
      {/* Main Content - Properly Centered without excessive margins */}
      <div className={` mx-auto px-4 text-center relative z-10 min-h-screen flex flex-col justify-center  transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="max-w-5xl mx-auto">
          {/* Brand Introduction */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm text-pink-600 font-semibold text-sm rounded-full border border-pink-200 mb-6">
              ✨ Premium Skincare for Everyone
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-800 leading-tight">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Skincare Routine
              </span>
            </h1>
          </div>

          {/* Value Proposition */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              Transform your skin with our curated collection of premium skincare products. 
              <span className="font-semibold text-pink-600"> From cleansers to serums</span> - 
              find everything you need for healthy, glowing skin.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl py-4 px-6 border border-gray-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">100% Authentic</span>
              </div>
              
              <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl py-4 px-6 border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Fast Delivery</span>
              </div>
              
              <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl py-4 px-6 border border-gray-200">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Expert Approved</span>
              </div>
            </div>
          </div>
          
          {/* Clear Call-to-Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/products" 
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <span className="flex items-center justify-center">
                Shop Now
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/products" 
              className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center justify-center">
                Browse Products
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 from 2,000+ reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free shipping over LKR 5,000</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>30-day money back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Properly Centered Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20">
        <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center animate-bounce mx-auto">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
