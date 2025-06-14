import api from './api';
import { ApiResponse, Inquiry } from '../types';

export interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'product' | 'order' | 'complaint' | 'support';
  relatedOrder?: string;
  relatedProduct?: string;
}

export interface InquiriesResponse {
  inquiries: Inquiry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Create a new inquiry
export const createInquiry = async (inquiryData: InquiryData): Promise<ApiResponse<Inquiry>> => {
  try {
    const response = await api.post('/inquiries', inquiryData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit inquiry');
  }
};

// Get all inquiries (Admin only)
export const getInquiries = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
  isRead?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<ApiResponse<InquiriesResponse>> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/inquiries?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch inquiries');
  }
};

// Get inquiry by ID (Admin only)
export const getInquiryById = async (id: string): Promise<ApiResponse<Inquiry>> => {
  try {
    const response = await api.get(`/inquiries/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch inquiry');
  }
};

// Update inquiry (Admin only)
export const updateInquiry = async (id: string, updateData: {
  status?: string;
  priority?: string;
  adminResponse?: string;
  tags?: string[];
}): Promise<ApiResponse<Inquiry>> => {
  try {
    const response = await api.put(`/inquiries/${id}`, updateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update inquiry');
  }
};

// Delete inquiry (Admin only)
export const deleteInquiry = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete inquiry');
  }
};

// Get inquiry statistics (Admin only)
export const getInquiryStats = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/inquiries/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch inquiry statistics');
  }
};

export const inquiryService = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiryStats
};
