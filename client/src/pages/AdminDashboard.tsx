import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { Product, Order } from '../types';
import ProductManagement from '../components/admin/ProductManagement';
import ProductForm from '../components/admin/ProductForm';

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
    { name: 'Overview', key: 'overview', path: '/admin' },
    { name: 'Products', key: 'products', path: '/admin/products' },
    { name: 'Orders', key: 'orders', path: '/admin/orders' },
    { name: 'Users', key: 'users', path: '/admin/users' },
    { name: 'Feedback', key: 'feedback', path: '/admin/feedback' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:flex">
        {/* Sidebar */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <div className="bg-white h-full shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            </div>
            <nav className="mt-6">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`block px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeTab === item.key
                      ? 'bg-pink-50 text-pink-600 border-r-2 border-pink-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
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

// Overview Component
const Overview: React.FC<{ stats: any; loading: boolean }> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.5v3m-13.5-3v3" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 className="font-medium text-gray-900">Manage Products</h3>
            <p className="text-sm text-gray-600 mt-1">Add, edit, or remove products</p>
          </Link>
          <Link
            to="/admin/orders"
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 className="font-medium text-gray-900">Process Orders</h3>
            <p className="text-sm text-gray-600 mt-1">View and update order status</p>
          </Link>
          <Link
            to="/admin/users"
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
          </Link>
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
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Feedback Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Feedback management interface coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">
          This will include viewing customer feedback, responding to inquiries, etc.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
