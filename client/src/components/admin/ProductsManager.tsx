import React, { useState } from 'react';
import { Product } from '../../types';
import { Plus } from 'lucide-react';
import ProductManagement from './ProductManagement';
import ProductForm from './ProductForm';

const ProductsManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductAction = (action: string, product?: Product) => {
    switch (action) {
      case 'create':
        setCurrentView('create');
        setSelectedProduct(null);
        break;
      case 'edit':
        setCurrentView('edit');
        setSelectedProduct(product || null);
        break;
      case 'delete':
      case 'save':
        setCurrentView('list');
        setSelectedProduct(null);
        break;
      default:
        setCurrentView('list');
    }
  };

  const handleFormSave = (product: Product) => {
    handleProductAction('save');
  };

  const handleFormCancel = () => {
    handleProductAction('cancel');
  };

  return (
    <div className="space-y-6">
      {currentView === 'list' && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Product Management</h1>
                <p className="text-pink-100 mt-2">Manage your product inventory and details</p>
              </div>
              <button
                onClick={() => handleProductAction('create')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <ProductManagement onProductAction={handleProductAction} />
          </div>
        </div>
      )}
      {(currentView === 'create' || currentView === 'edit') && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {currentView === 'create' ? 'Create New Product' : 'Edit Product'}
            </h1>
            <p className="text-pink-100 mt-2">
              {currentView === 'create' ? 'Add a new product to your inventory' : 'Update product information'}
            </p>
          </div>
          
          <div className="p-8">
            <ProductForm
              product={selectedProduct || undefined}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
