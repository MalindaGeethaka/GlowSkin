import api from './api';
import { Order, ApiResponse, OrdersResponse } from '../types';

export interface OrderFilters {
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderQueryParams extends OrderFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOrderData {
  items: {
    product: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
}

export const orderService = {
  // Get user's orders or all orders (admin)
  getOrders: async (params: OrderQueryParams = {}): Promise<OrdersResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<OrdersResponse>(
      `/orders?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get current user's orders
  getUserOrders: async (params: OrderQueryParams = {}): Promise<OrdersResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<OrdersResponse>(
      `/orders/my?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data!;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data.data!;
  },

  // Cancel order (customer can cancel pending orders)
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data.data!;
  },

  // Get order statistics (admin only)
  getOrderStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
    recentOrders: Order[];
  }> => {
    const response = await api.get<ApiResponse<any>>('/orders/stats');
    return response.data.data!;
  },
};
