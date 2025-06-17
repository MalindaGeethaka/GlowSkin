import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import logo from '../layout/logo.png'

import { ShoppingCart, ChevronDown, User, Settings, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Function to get active link classes
  const getNavLinkClass = (path: string) => {
    const baseClasses = "transition-colors font-medium";
    const activeClasses = "text-pink-600 bg-pink-50 px-3 py-2 rounded-lg";
    const inactiveClasses = "text-gray-700 hover:text-pink-500";
    
    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  // Function to get mobile nav link classes
  const getMobileNavLinkClass = (path: string) => {
    const baseClasses = "transition-colors font-medium block py-2";
    const activeClasses = "text-pink-600 bg-pink-50 px-3 rounded-lg";
    const inactiveClasses = "text-gray-700 hover:text-pink-500";
    
    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserDropdownOpen && !target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div><img className='w-14 h-14'  src={logo} alt="" /></div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              GlowSkin
            </span>
          </Link>          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getNavLinkClass('/')}>
              Home
            </Link>
            <Link to="/products" className={getNavLinkClass('/products')}>
              Products
            </Link>
            <Link to="/contact" className={getNavLinkClass('/contact')}>
              Contact
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={getNavLinkClass('/admin')}>
                Dashboard
              </Link>
            )}
          </div>{/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">            <Link 
              to="/cart" 
              className={`relative p-3 transition-colors rounded-lg mr-2 ${
                isActivePath('/cart') 
                  ? 'text-pink-600 bg-pink-50' 
                  : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
         
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium z-10">
                  {getTotalItems()}
                </span>
              )}
            </Link>
              {user ? (
              <div className="flex items-center space-x-4">                {/* User Dropdown */}
                <div 
                  className="relative user-dropdown group"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <div className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors px-3 py-2 rounded-lg hover:bg-pink-50 cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 max-w-32 truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>{/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-100 scale-100 transition-all duration-200 ease-out transform origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-pink-600 capitalize font-medium mt-1">
                          {user.role} Account
                        </div>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Admin Dashboard
                        </Link>
                      )}

                      <hr className="my-2" />
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`text-sm px-4 py-2 transition-colors rounded-lg border ${
                    isActivePath('/login')
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'btn-outline'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`text-sm px-4 py-2 transition-colors rounded-lg ${
                    isActivePath('/register')
                      ? 'bg-pink-700 text-white'
                      : 'btn-primary'
                  }`}
                >
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
        </div>        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className={getMobileNavLinkClass('/')} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className={getMobileNavLinkClass('/products')} onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link to="/contact" className={getMobileNavLinkClass('/contact')} onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={getMobileNavLinkClass('/admin')} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Link 
                to="/cart" 
                className={`${getMobileNavLinkClass('/cart')} flex items-center justify-between`} 
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
                {user ? (
                <>
                  <div className="flex items-center space-x-3 py-3 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role} Account</div>
                    </div>
                  </div>
                    <Link 
                    to="/profile" 
                    className={`flex items-center space-x-2 transition-colors py-2 ${
                      isActivePath('/profile') 
                        ? 'text-pink-600 bg-pink-50 px-3 rounded-lg' 
                        : 'text-gray-700 hover:text-pink-500'
                    }`} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors py-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
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
