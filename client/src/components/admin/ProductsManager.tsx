import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Plus, X } from 'lucide-react';
import ProductManagement from './ProductManagement';
import ProductForm from './ProductForm';

const ProductsManager: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleProductAction = (action: string, product?: Product) => {
    switch (action) {
      case 'create':
        setModalMode('create');
        setSelectedProduct(null);
        setShowModal(true);
        break;
      case 'edit':
        setModalMode('edit');
        setSelectedProduct(product || null);
        setShowModal(true);
        break;      case 'delete':
        setRefreshTrigger(prev => prev + 1); // Trigger refresh after delete
        break;
      case 'save':
        setShowModal(false);
        setSelectedProduct(null);
        break;
      default:
        setShowModal(false);
    }
  };
  const handleFormSave = (product: Product) => {
    setShowModal(false);
    setSelectedProduct(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of ProductManagement list
  };
  const handleFormCancel = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        handleFormCancel();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);
  return (
    <div className="space-y-6">
      {/* Main Product Management View */}
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
          <ProductManagement 
            onProductAction={handleProductAction} 
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>      {/* Product Form Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              handleFormCancel();
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
                </h2>
                <p className="text-pink-100 mt-1 text-sm md:text-base">
                  {modalMode === 'create' ? 'Add a new product to your inventory' : 'Update product information'}
                </p>
              </div>
              <button
                onClick={handleFormCancel}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 md:p-8">
                <ProductForm
                  product={selectedProduct || undefined}
                  onSave={handleFormSave}
                  onCancel={handleFormCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
