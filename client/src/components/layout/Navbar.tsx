import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

import { ShoppingCart } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full"></div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              GlowSkin
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-500 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-500 transition-colors">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-pink-500 transition-colors">
                Dashboard
              </Link>            )}
          </div>          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/cart" 
              className="relative p-3 text-gray-700 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50 mr-2"
            >
              <ShoppingCart className="w-6 h-6" />
         
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium z-10">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 hover:text-pink-500 transition-colors px-3 py-2 rounded-lg hover:bg-pink-50"
                >
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate max-w-24 text-sm font-medium">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-outline text-sm px-4 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline text-sm px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-pink-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-pink-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-pink-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Link to="/cart" className="text-gray-700 hover:text-pink-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Cart ({getTotalItems()})
              </Link>
              
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-pink-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Profile ({user.name})
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="btn-outline text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 pt-4">
                  <Link to="/login" className="btn-outline flex-1 text-center" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 text-center" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
