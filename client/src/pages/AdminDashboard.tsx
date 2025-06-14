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
  Activity,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Package2
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');  const [sortOrder, setSortOrder] = useState('desc');
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  const fetchOrderStats = async () => {
    try {
      // Get orders for stats (this could be optimized with a dedicated stats endpoint)
      const allOrdersResponse = await orderService.getOrders({ limit: 1000 });
      const allOrders = allOrdersResponse.data?.orders || [];
      
      const stats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        shipped: allOrders.filter(o => o.status === 'shipped').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      };
      
      setOrderStats(stats);
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await orderService.getOrders(params);
      setOrders(response.data?.orders || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof order.user === 'object' && order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{orderStats.processing}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="createdAt">Date Created</option>
            <option value="totalAmount">Total Amount</option>
            <option value="status">Status</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">No orders match your current filters.</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">Order ID</div>
                <div className="col-span-2">Customer</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Order ID */}
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Package2 className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items?.length || 0} items
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-gray-900">
                        {typeof order.user === 'object' ? order.user.name : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {typeof order.user === 'object' ? order.user.email : ''}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-2">
                      <div className="text-sm font-bold text-gray-900">
                        Rs. {(order.totalAmount || order.totalPrice || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onStatusUpdate={(orderId, status) => {
            updateOrderStatus(orderId, status);
            setShowOrderModal(false);
          }}
        />
      )}
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

// Order Detail Modal Component
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>(order.status);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  const handleStatusUpdate = () => {
    if (newStatus !== order.status) {
      onStatusUpdate(order._id, newStatus);
    }
    setShowStatusConfirm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing': return <Activity className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600">Order #{order._id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Order Status</h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="text-lg font-semibold capitalize">{order.status}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Total Amount</h3>
              <div className="text-2xl font-bold text-green-600">
                Rs. {(order.totalAmount || order.totalPrice || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Order Date</h3>
              <div className="text-lg">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
              <div className="text-sm text-gray-600">
                {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Customer Name</span>
                </div>
                <p className="text-gray-700 ml-6">
                  {typeof order.user === 'object' ? order.user.name : 'N/A'}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Email</span>
                </div>
                <p className="text-gray-700 ml-6">
                  {typeof order.user === 'object' ? order.user.email : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
                <p className="text-gray-700">{order.shippingAddress?.address}</p>
                <p className="text-gray-700">{order.shippingAddress?.city}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.shippingAddress?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {typeof item.product === 'object' ? item.product.title : `Product ${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Rs. {item.price.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
            <div className="flex items-center space-x-4">              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {newStatus !== order.status && (
                <button
                  onClick={() => setShowStatusConfirm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showStatusConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Status Update</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to update the order status from "{order.status}" to "{newStatus}"?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowStatusConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
