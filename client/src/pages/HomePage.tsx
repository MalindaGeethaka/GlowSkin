import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import {
  HeroSection,
  FeaturesSection,
  FeaturedProductsSection,
  NewsletterSection,
  TrustIndicatorsSection
} from '../components/home';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsVisible(true);
    
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getProducts({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
        setFeaturedProducts(response.data?.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
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
    <div className="min-h-screen overflow-hidden">
      <HeroSection isVisible={isVisible} />
      <FeaturesSection />
      <FeaturedProductsSection 
        featuredProducts={featuredProducts}
        loading={loading}
        onAddToCart={handleAddToCart}
      />
      <NewsletterSection />
      <TrustIndicatorsSection />
    </div>
  );
};

export default HomePage;
