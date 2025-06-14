import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, CartItem, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        setItems(cartItems);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity: number = 1): void => {
    console.log(`[CartContext] addToCart called - Product: ${product.title}, Quantity: ${quantity}`);
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product._id === product._id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        console.log(`[CartContext] Updated quantity to: ${updatedItems[existingItemIndex].quantity}`);
        return updatedItems;
      } else {
        const newItem: CartItem = {
          _id: `cart-${product._id}-${Date.now()}`,
          product,
          quantity,
        };
        console.log(`[CartContext] Added new item with quantity: ${quantity}`);
        return [...prevItems, newItem];
      }
    });
  }, []);

  const addToCartSimple = useCallback((product: Product): void => {
    console.log(`[CartContext] addToCartSimple called - Product: ${product.title}`);
    addToCart(product, 1);
  }, [addToCart]);

  const setCartQuantity = useCallback((product: Product, quantity: number): void => {
    console.log(`[CartContext] setCartQuantity called - Product: ${product.title}, Quantity: ${quantity}`);
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product._id === product._id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity = quantity;
        return updatedItems;
      } else {
        const newItem: CartItem = {
          _id: `cart-${product._id}-${Date.now()}`,
          product,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string): void => {
    setItems(prevItems => prevItems.filter(item => item.product._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback((): void => {
    setItems([]);
  }, []);

  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    addToCartSimple,
    setCartQuantity,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};