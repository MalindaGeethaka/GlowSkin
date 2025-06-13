import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { getImageUrl } from '../../utils';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    skinType: [] as string[],
    ingredients: '',
    usage: '',
    images: [] as string[]
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categories = [
    'Cleansers',
    'Moisturizers',
    'Serums',
    'Sunscreens',
    'Toners',
    'Face Masks',
    'Eye Care',
    'Treatments',
    'Body Care',
    'Lip Care'
  ];

  const skinTypes = [
    'Oily',
    'Dry',
    'Combination',
    'Sensitive',
    'Normal',
    'All Types'
  ];
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        brand: product.brand || '',
        skinType: product.skinType || [],
        ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients || '',
        usage: product.usage || '',
        images: product.images || []
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkinTypeChange = (skinType: string) => {
    setFormData(prev => ({
      ...prev,
      skinType: prev.skinType.includes(skinType)
        ? prev.skinType.filter(st => st !== skinType)
        : [...prev.skinType, skinType]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };
  const uploadImages = async (): Promise<string[]> => {
    if (!selectedFiles) return [];

    try {
      setUploading(true);
      const imageUrls = await productService.uploadImages(selectedFiles);
      return imageUrls;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Upload new images if any
      let imageUrls = [...formData.images];
      if (selectedFiles && selectedFiles.length > 0) {
        const newImageUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newImageUrls];
      }      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        brand: formData.brand,
        skinType: formData.skinType,
        ingredients: formData.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
        usage: formData.usage,
        images: imageUrls,
        isActive: true
      };

      let savedProduct: Product;
      if (product) {
        savedProduct = await productService.updateProduct(product._id, productData);
      } else {
        savedProduct = await productService.createProduct(productData);
      }

      onSave(savedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Save product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {product ? 'Edit Product' : 'Create New Product'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              placeholder="Enter brand name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (LKR)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 font-normal">(minimum 10 characters)</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Enter detailed product description (minimum 10 characters)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Skin Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suitable Skin Types
          </label>
          <div className="grid grid-cols-3 gap-2">
            {skinTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.skinType.includes(type)}
                  onChange={() => handleSkinTypeChange(type)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients (comma-separated)
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            rows={3}
            placeholder="Aqua, Glycerin, Salicylic Acid, ..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Usage Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Instructions
          </label>
          <textarea
            name="usage"
            value={formData.usage}
            onChange={handleInputChange}
            rows={3}
            placeholder="Apply twice daily after cleansing..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Current Images */}
        {formData.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Images
            </label>
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((image, index) => (                <div key={index} className="relative">
                  <img
                    src={getImageUrl(image)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum 5 images. Supported formats: JPG, PNG, WebP
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || uploading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
