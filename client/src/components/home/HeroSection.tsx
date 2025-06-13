import React from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible }) => {
  return (    <section 
      className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden flex items-center justify-center"
      style={{ 
        height: 'calc(100vh - 4rem)', // Subtract navbar height (h-16 = 4rem)
        minHeight: '600px' // Ensure minimum height on very small screens
      }}
    >
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-yellow-300/15 via-pink-300/15 to-blue-300/15 animate-float"></div>
        </div>        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 opacity-20">
          {/* Large decorative circles with morph animation */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-300 to-rose-400 mix-blend-multiply filter blur-xl animate-morph animation-delay-1000"></div>
          <div className="absolute top-32 right-16 w-48 h-48 bg-gradient-to-br from-purple-300 to-violet-400 mix-blend-multiply filter blur-2xl animate-drift animation-delay-2000"></div>
          <div className="absolute bottom-24 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-300 to-blue-400 mix-blend-multiply filter blur-xl animate-float-large animation-delay-4000"></div>
          <div className="absolute top-1/2 right-8 w-28 h-28 bg-gradient-to-br from-yellow-300 to-orange-400 mix-blend-multiply filter blur-lg animate-morph animation-delay-1000"></div>
          
          {/* Medium shapes with drift animation */}
          <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-emerald-300 to-teal-400 mix-blend-multiply filter blur-lg animate-drift animation-delay-3000"></div>
          <div className="absolute top-16 left-2/3 w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-400 mix-blend-multiply filter blur-md animate-float-large animation-delay-5000"></div>
          
          {/* Small floating elements */}
          <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-400 mix-blend-multiply filter blur-md animate-morph animation-delay-2000"></div>
          <div className="absolute bottom-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-amber-300 to-yellow-400 mix-blend-multiply filter blur-sm animate-drift animation-delay-4000"></div>
        </div>        {/* Skincare-themed Floating Elements */}
        <div className="absolute inset-0 opacity-15">
          {/* Droplet shapes with enhanced animations */}
          <div className="absolute top-20 left-1/4 w-6 h-8 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full animate-float animation-delay-1000 transform rotate-45"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full animate-drift animation-delay-3000 transform rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/6 w-5 h-7 bg-gradient-to-b from-purple-400 to-violet-500 rounded-full animate-float-large animation-delay-2000 transform -rotate-25"></div>
          <div className="absolute top-2/3 right-1/6 w-3 h-5 bg-gradient-to-b from-indigo-400 to-blue-500 rounded-full animate-drift animation-delay-4000 transform rotate-75"></div>
          
          {/* Enhanced sparkle effects with twinkle animation */}
          <div className="absolute top-1/4 left-3/4 w-3 h-3 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full animate-twinkle animation-delay-1000"></div>
          <div className="absolute top-3/4 left-1/5 w-2 h-2 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full animate-twinkle animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/5 w-4 h-4 bg-gradient-to-br from-purple-300 to-violet-400 rounded-full animate-twinkle animation-delay-3000"></div>
          <div className="absolute top-1/6 left-1/2 w-2.5 h-2.5 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full animate-twinkle animation-delay-4000"></div>
          <div className="absolute bottom-1/4 right-2/3 w-3.5 h-3.5 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full animate-twinkle animation-delay-5000"></div>
          
          {/* Floating geometric particles */}
          <div className="absolute top-2/5 left-1/3 w-2 h-2 bg-pink-400 transform rotate-45 animate-drift animation-delay-1000"></div>
          <div className="absolute bottom-2/5 right-1/3 w-1.5 h-1.5 bg-purple-400 transform rotate-12 animate-float animation-delay-2000"></div>
          <div className="absolute top-4/5 left-2/5 w-2.5 h-2.5 bg-indigo-400 transform -rotate-30 animate-twinkle animation-delay-3000"></div>
        </div>        {/* Dynamic Wave Pattern */}
        <div className="absolute bottom-0 left-0 w-full opacity-30">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 text-pink-200 animate-wave-motion">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
        
        {/* Top decorative wave */}
        <div className="absolute top-0 left-0 w-full opacity-20 transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-purple-200 animate-wave-motion animation-delay-2000">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
          </svg>
        </div>
        
        {/* Additional middle wave layer for depth */}
        <div className="absolute top-1/2 left-0 w-full opacity-10 transform -translate-y-1/2">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-indigo-200 animate-wave-motion animation-delay-4000">
            <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>{/* Main Content - Perfectly Centered */}
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
