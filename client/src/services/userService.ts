import api from './api';
import { User, ApiResponse, UsersResponse } from '../types';

export interface UserFilters {
  role?: 'admin' | 'customer';
  search?: string;
}

export interface UserQueryParams extends UserFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const userService = {
  // Get all users (admin only)
  getUsers: async (params: UserQueryParams = {}): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<UsersResponse>(
      `/users?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single user by ID (admin only)
  getUser: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  // Update user (admin only)
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data!;
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Get user statistics (admin only)
  getUserStats: async (): Promise<{
    totalUsers: number;
    totalCustomers: number;
    totalAdmins: number;
    recentUsers: User[];
  }> => {
    const response = await api.get<ApiResponse<any>>('/users/stats');
    return response.data.data!;
  },

  // Update current user's profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/users/profile', userData);
    return response.data.data!;
  },
};
