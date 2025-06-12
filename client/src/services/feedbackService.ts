import api from './api';
import { Feedback, ApiResponse, FeedbackResponse } from '../types';

export interface FeedbackFilters {
  isRead?: boolean;
  userId?: string;
}

export interface FeedbackQueryParams extends FeedbackFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateFeedbackData {
  message: string;
}

export const feedbackService = {
  // Get feedback messages (admin sees all, users see their own)
  getFeedback: async (params: FeedbackQueryParams = {}): Promise<FeedbackResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<FeedbackResponse>(
      `/feedback?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single feedback by ID
  getFeedbackById: async (id: string): Promise<Feedback> => {
    const response = await api.get<ApiResponse<Feedback>>(`/feedback/${id}`);
    return response.data.data!;
  },

  // Create new feedback
  createFeedback: async (feedbackData: CreateFeedbackData): Promise<Feedback> => {
    const response = await api.post<ApiResponse<Feedback>>('/feedback', feedbackData);
    return response.data.data!;
  },

  // Mark feedback as read (admin only)
  markAsRead: async (id: string): Promise<Feedback> => {
    const response = await api.put<ApiResponse<Feedback>>(`/feedback/${id}/read`);
    return response.data.data!;
  },

  // Delete feedback (admin only)
  deleteFeedback: async (id: string): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },

  // Get feedback statistics (admin only)
  getFeedbackStats: async (): Promise<{
    totalFeedback: number;
    unreadFeedback: number;
    recentFeedback: Feedback[];
  }> => {
    const response = await api.get<ApiResponse<any>>('/feedback/stats');
    return response.data.data!;
  },
};
