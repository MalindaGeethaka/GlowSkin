import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { Product, Order } from '../types';
import ProductManagement from '../components/admin/ProductManagement';
import ProductForm from '../components/admin/ProductForm';
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
      const totalRevenue = allOrders.data?.orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;

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
    { name: 'Feedback', key: 'feedback', path: '/admin/feedback', icon: MessageSquare },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="lg:flex">
        {/* Modern Sidebar */}
        <div className="lg:w-72 lg:flex-shrink-0">
          <div className="h-full bg-white shadow-2xl border-r border-gray-200/50">
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
            </div>
            <nav className="mt-8 px-4">
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
        <div className="flex-1 p-8">
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
  );
};

// Modern Overview Component
const Overview: React.FC<{ stats: any; loading: boolean }> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-pink-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UserCheck,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      change: '+15.3%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
              <p className="text-pink-100 text-lg">Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-pink-100 text-sm">Today's Date</p>
                <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-pink-200" />
            </div>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`relative group overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-white/50`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/products"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-medium">Go to Products →</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Process Orders</h3>
                  <p className="text-sm text-gray-600">View and update order status</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-medium">Manage Orders →</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Manage Users</h3>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-medium">View Users →</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              <div className="h-40 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl flex items-center justify-center border border-pink-100">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-pink-500 mx-auto mb-2" />
                  <p className="text-gray-600">Sales chart coming soon</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100">
                <div className="text-center">
                  <Package className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">Product analytics coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Management Component with Full Functionality
const ProductsManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductAction = (action: string, product?: Product) => {
    switch (action) {
      case 'create':
        setCurrentView('create');
        setSelectedProduct(null);
        break;
      case 'edit':
        setCurrentView('edit');
        setSelectedProduct(product || null);
        break;
      case 'delete':
      case 'save':
        setCurrentView('list');
        setSelectedProduct(null);
        break;
      default:
        setCurrentView('list');
    }
  };

  const handleFormSave = (product: Product) => {
    handleProductAction('save');
  };

  const handleFormCancel = () => {
    handleProductAction('cancel');
  };

  return (
    <div>
      {currentView === 'list' && (
        <ProductManagement onProductAction={handleProductAction} />
      )}
      {(currentView === 'create' || currentView === 'edit') && (
        <ProductForm
          product={selectedProduct || undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders({ limit: 50 });
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled');
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No orders found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-600">
                      Customer: {typeof order.user === 'object' ? order.user.name : 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      Total: Rs. {order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {order.items.length} items • Placed on {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UsersManager: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">User management interface coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">
          This will include user listing, role management, account status control, etc.
        </p>
      </div>
    </div>
  );
};

const FeedbackManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      // This would be replaced with actual inquiry service call
      const response = await fetch('/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.data?.inquiries || []);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const handleRespond = async () => {
    if (!selectedInquiry || !responseText.trim()) return;

    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          adminResponse: responseText,
          status: 'resolved'
        })
      });

      if (response.ok) {
        setShowModal(false);
        setResponseText('');
        fetchInquiries();
      }
    } catch (error) {
      console.error('Failed to respond to inquiry:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Customer Inquiries</h1>
          <p className="text-pink-100 mt-2">Manage and respond to customer messages</p>
        </div>

        <div className="p-8">
          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-600">Customer inquiries will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{inquiry.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {inquiry.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          inquiry.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : inquiry.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-pink-600 hover:text-pink-900 mr-4"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Inquiry Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">From:</label>
                <p className="text-gray-900">{selectedInquiry.name} ({selectedInquiry.email})</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject:</label>
                <p className="text-gray-900">{selectedInquiry.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Message:</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedInquiry.message}</p>
              </div>

              {selectedInquiry.adminResponse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Response:</label>
                  <p className="text-gray-900 bg-green-50 p-4 rounded-lg">{selectedInquiry.adminResponse}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Your Response:</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                rows={4}
                placeholder="Type your response here..."
              />
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRespond}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
