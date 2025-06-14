import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils';

import { ShoppingCart, ChevronDown, User, Settings, LogOut } from 'lucide-react';
const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-pink-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">Your cart is empty</h2>
            <p className="text-xl text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 text-center">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Cart Items ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (                <div key={item._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24">
                      <img
                        src={item.product.images && item.product.images.length > 0 
                          ? getImageUrl(item.product.images[0])
                          : '/placeholder-product.jpg'
                        }
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">{item.product.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                        {item.product.category && (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2">
                          {item.product.category}
                        </span>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-pink-600">
                        Rs. {item.product.price.toLocaleString()}
                      </p>
                        {/* Quantity Controls */}
                      <div className="flex items-center mt-4 space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="text-lg font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </p>                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-red-600 hover:text-red-800 text-sm mt-2 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.quantity >= item.product.stock && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800 text-sm">
                        Only {item.product.stock} items left in stock
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Rs. 500</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-lg font-bold text-pink-600">
                    Rs. {(getTotalPrice() + 500).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CartPage;
