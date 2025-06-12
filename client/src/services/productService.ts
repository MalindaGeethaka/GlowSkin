import api from './api';
import { Product, ApiResponse, ProductsResponse } from '../types';

export interface ProductFilters {
  category?: string;
  skinType?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
}

export interface ProductQueryParams extends ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });    const response = await api.get<ProductsResponse>(
      `/products?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  // Create new product (admin only)
  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    return response.data.data!;
  },

  // Update product (admin only)
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data!;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Get product categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/products/categories');
    return response.data.data!;
  },

  // Get skin types
  getSkinTypes: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/products/skin-types');
    return response.data.data!;
  },

  // Upload product images
  uploadImages: async (files: FileList): Promise<string[]> => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post<ApiResponse<string[]>>(
      '/uploads/products',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!;
  },
};
