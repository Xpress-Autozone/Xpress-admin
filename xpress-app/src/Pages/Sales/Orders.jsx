import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, MessageSquare, Clock, CheckCircle2, Truck, ExternalLink, Package, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';
import LoadingSpinner from '../../Components/LoadingSpinner';
import OrderDetailModal from './OrderDetailModal';

const Orders = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getOrders?page=${pagination.page}&limit=20`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const result = await response.json();
      if (result.success) {
        const mapped = (result.data || []).map(order => ({
          id: order.orderNumber || order.id,
          docId: order.id,
          customer: order.customerName || order.customer?.name || 'Unknown',
          items: order.items?.map(i => `${i.name || i.itemName} (x${i.quantity || 1})`).join(', ') || 'N/A',
          total: `GHC ${(Number(order.total) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          totalRaw: Number(order.total) || 0,
          status: order.orderStatus || order.status || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          paymentMethod: order.paymentMethod || 'N/A',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
          whatsapp: order.customerPhone || order.customer?.phone || '',
          address: order.deliveryAddress || order.address || '',
          rawItems: order.items || [],
        }));
        setOrders(mapped);
        setPagination(prev => ({
          ...prev,
          hasMore: result.pagination?.hasMore || false,
          total: result.pagination?.totalItems || mapped.length,
        }));
      } else {
        setError(result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'confirmed':
      case 'arranging': return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
      case 'out for delivery': return 'bg-orange-100 text-orange-700';
      case 'delivered':
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending': return <MessageSquare className="w-3 h-3" />;
      case 'confirmed':
      case 'arranging': return <Clock className="w-3 h-3" />;
      case 'shipped':
      case 'out for delivery': return <Truck className="w-3 h-3" />;
      case 'delivered':
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      case 'cancelled': return <AlertCircle className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  const handleWhatsApp = (phone, orderId) => {
    if (!phone) return;
    const message = `Hello, this is Xpress Autozone regarding your order ${orderId}. We are ready to arrange your delivery!`;
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredOrders = orders.filter(order =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" color="yellow" />
    </div>
  );

  return (
    <div className="p-6 mt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Order Pipeline</h1>
            <p className="text-gray-500 text-sm">Manage inquiries, deliveries, and Pay-on-Delivery logistics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchOrders}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-bold text-gray-600"
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm italic">
                      {orders.length === 0 ? 'No orders found.' : 'No orders match your search.'}
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr 
                    key={order.docId || order.id} 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-400">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{order.customer}</div>
                      <div className="text-xs text-gray-400">{order.whatsapp || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{order.items}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.whatsapp && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleWhatsApp(order.whatsapp, order.id); }}
                            title="Contact via WhatsApp"
                            className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 border border-green-200"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-bold px-1">WhatsApp</span>
                          </button>
                        )}
                        <button 
                          onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Showing {filteredOrders.length} of {pagination.total || orders.length} orders</span>
            <div className="flex gap-2 text-xs font-bold">
               <button 
                 onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                 disabled={pagination.page <= 1}
                 className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
               >
                 Prev
               </button>
               <button 
                 onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                 disabled={!pagination.hasMore}
                 className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
               >
                 Next
               </button>
            </div>
          </div>
        </div>
      </div>
      <OrderDetailModal 
          order={selectedOrder} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Orders;
