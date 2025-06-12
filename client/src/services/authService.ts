import api from './api';
import { User, LoginData, RegisterData, ApiResponse } from '../types';

export const authService = {
  // Login user
  login: async (credentials: LoginData): Promise<{ user: User; token: string }> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      credentials
    );
    return response.data.data!;
  },

  // Register user
  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register',
      userData
    );
    return response.data.data!;
  },
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data.data!;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },
};
