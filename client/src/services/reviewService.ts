import api from './api';
import { ApiResponse } from '../types';

export interface ReviewData {
  rating: number;
  comment: string;
}

export interface ReviewsResponse {
  reviews: any[];
  ratings: {
    average: number;
    count: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Add a review to a product
export const addProductReview = async (productId: string, reviewData: ReviewData): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add review');
  }
};

// Get reviews for a product
export const getProductReviews = async (productId: string, page = 1, limit = 10): Promise<ApiResponse<ReviewsResponse>> => {
  try {
    const response = await api.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get reviews');
  }
};

// Update a review
export const updateProductReview = async (productId: string, reviewId: string, reviewData: ReviewData): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update review');
  }
};

// Delete a review
export const deleteProductReview = async (productId: string, reviewId: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

export const reviewService = {
  addProductReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview
};
