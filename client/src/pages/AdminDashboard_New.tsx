import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { Product, Order } from '../types';
import ProductsManager from '../components/admin/ProductsManager';
import OrdersManager from '../components/admin/OrdersManager';
import FeedbackManager from '../components/admin/FeedbackManager';
import UsersManager from '../components/admin/UsersManager';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  UserCheck,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const path = location.pathname.split('/admin/')[1];
    if (path) {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch stats from all services
      const [productsData, ordersData, usersData] = await Promise.all([
        productService.getProducts({ limit: 1 }),
        orderService.getOrders({ limit: 1 }),
        userService.getUsers({ limit: 1 })
      ]);      // Calculate total revenue from all orders
      const allOrders = await orderService.getOrders({ limit: 1000 });
      const totalRevenue = allOrders.data?.orders?.reduce((sum, order) => sum + (order.totalAmount || order.totalPrice || 0), 0) || 0;

      setStats({
        totalProducts: productsData.data?.pagination.totalItems || 0,
        totalOrders: ordersData.data?.pagination.totalItems || 0,
        totalUsers: usersData.data?.pagination.totalItems || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const navigation = [
    { name: 'Overview', key: 'overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', key: 'products', path: '/admin/products', icon: Package },
    { name: 'Orders', key: 'orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', key: 'users', path: '/admin/users', icon: Users },
    { name: 'Feedback', key: 'feedback', path: '/admin/feedback', icon: MessageSquare },  ];  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex min-h-screen">
        {/* Modern Sidebar */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <div className="bg-white shadow-2xl border-r border-gray-200/50 h-full">
            <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Panel
                  </h2>
                  <p className="text-sm text-gray-600">GlowSkin Management</p>
                </div>
              </div>
            </div>            <nav className="px-4 py-6">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        activeTab === item.key
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-700'
                      }`}
                      onClick={() => setActiveTab(item.key)}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-transform duration-300 ${
                        activeTab === item.key ? 'scale-110' : 'group-hover:scale-105'
                      }`} />
                      {item.name}
                      {activeTab === item.key && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-full">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Overview stats={stats} loading={loading} />} />
              <Route path="/products" element={<ProductsManager />} />
              <Route path="/orders" element={<OrdersManager />} />
              <Route path="/users" element={<UsersManager />} />
              <Route path="/feedback" element={<FeedbackManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverviewProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
  };
  loading: boolean;
}

const Overview: React.FC<OverviewProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome to GlowSkin Admin</h1>
              <p className="text-pink-100 mt-2">Manage your e-commerce platform with ease</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-sm text-green-600 mt-1">↗ Active inventory</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-sm text-blue-600 mt-1">📦 Orders placed</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-purple-600 mt-1">👥 Registered users</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">💰 Total earnings</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-pink-600" />
            Quick Actions
          </h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/products" 
              className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all duration-300"
            >
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-pink-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-pink-700">Add Product</h3>
                <p className="text-sm text-gray-600">Create new product</p>
              </div>
            </Link>

            <Link 
              to="/admin/orders" 
              className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="text-center">
                <Eye className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-blue-700">View Orders</h3>
                <p className="text-sm text-gray-600">Manage orders</p>
              </div>
            </Link>

            <Link 
              to="/admin/users" 
              className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
            >
              <div className="text-center">
                <UserCheck className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-purple-700">Manage Users</h3>
                <p className="text-sm text-gray-600">User accounts</p>
              </div>
            </Link>

            <Link 
              to="/admin/feedback" 
              className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-300"
            >
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-green-700">View Feedback</h3>
                <p className="text-sm text-gray-600">Customer messages</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Product updated</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-600">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Performance Metrics
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Order Completion Rate</span>
                <span className="text-sm font-bold text-green-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-bold text-blue-600">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Inventory Health</span>
                <span className="text-sm font-bold text-purple-600">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
