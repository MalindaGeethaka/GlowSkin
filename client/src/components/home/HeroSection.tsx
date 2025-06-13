import React from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible }) => {
  return (
    <section 
      className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden flex items-center justify-center"
      style={{ 
        height: 'calc(100vh - 4rem)', // Subtract navbar height (h-16 = 4rem)
        minHeight: '600px' // Ensure minimum height on very small screens
      }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000"></div>
      </div>      {/* Main Content - Perfectly Centered */}
      <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="w-full max-w-6xl mx-auto text-center">
          {/* Brand Introduction */}
          <div className="mb-8 sm:mb-12">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm text-pink-600 font-semibold text-xs sm:text-sm rounded-full border border-pink-200 mb-4 sm:mb-6">
              ✨ Premium Skincare for Everyone
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-gray-800 leading-tight px-2">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                Skincare Routine
              </span>
            </h1>
          </div>

          {/* Value Proposition */}
          <div className="mb-8 sm:mb-12">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
              Transform your skin with our curated collection of premium skincare products. 
              <span className="font-semibold text-pink-600"> From cleansers to serums</span> - 
              find everything you need for healthy, glowing skin.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto mb-8 sm:mb-10 px-2">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 border border-gray-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">100% Authentic</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 border border-gray-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">Fast Delivery</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 border border-gray-200 sm:col-span-2 md:col-span-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">Expert Approved</span>
              </div>
            </div>
          </div>
          
          {/* Clear Call-to-Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-2">
            <Link 
              to="/products" 
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <span className="flex items-center justify-center">
                Shop Now
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/products" 
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-semibold text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center justify-center">
                Browse Products
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>   
        </div>
      </div>      {/* Properly Centered Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20">
        <p className="text-xs sm:text-sm text-gray-500 mb-4 hidden sm:block">Scroll to explore</p>
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-300 rounded-full flex justify-center animate-bounce mx-auto">
          <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-gray-400 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
