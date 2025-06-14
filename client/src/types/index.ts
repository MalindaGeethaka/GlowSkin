// Common types used across the application

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  skinType: string[];
  ingredients?: string[];
  usage?: string;
  images: string[];
  isActive: boolean;
  ratings?: {
    average: number;
    count: number;
  };
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string | User;
  items: {
    product: string | Product;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  totalPrice?: number; // Legacy support
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  _id: string;
  user: string | User;
  message: string;
  subject?: string;
  type: 'general' | 'product' | 'order' | 'complaint';
  status: 'pending' | 'resolved' | 'closed';
  isRead: boolean;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'product' | 'order' | 'complaint';
  status: 'pending' | 'resolved' | 'closed';
  isRead: boolean;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addToCartSimple: (product: Product) => void;
  setCartQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationInfo;
}

export interface ProductsResponse extends ApiResponse<{
  products: Product[];
  pagination: PaginationInfo;
}> {}

export interface OrdersResponse extends ApiResponse<{
  orders: Order[];
  pagination: PaginationInfo;
}> {}

export interface UsersResponse extends ApiResponse<{
  users: User[];
  pagination: PaginationInfo;
}> {}

export interface FeedbackResponse extends ApiResponse<{
  feedback: Feedback[];
  pagination: PaginationInfo;
}> {}
