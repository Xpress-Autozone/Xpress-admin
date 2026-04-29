import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Search, Filter, MessageSquare, Clock, CheckCircle2, Truck, ExternalLink, Package, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, setPage } from '../../orderSlice';
import LoadingSpinner from '../../Components/LoadingSpinner';
import OrderDetailModal from './OrderDetailModal';
import { API_BASE_URL } from '../../config/api';

const Orders = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { items: rawOrders, pagination, status, error, lastFetched } = useSelector((state) => state.orders);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // stores docId
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Only fetch if we don't have data, or it's older than 5 minutes, or page changed
    const shouldFetch = !lastFetched || (Date.now() - lastFetched > 5 * 60 * 1000) || status === 'idle';
    if (token) {
      dispatch(fetchOrders({ page: pagination.page }));
    }
  }, [pagination.page, token, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchOrders({ page: pagination.page }));
  };

  const handleDeleteOrder = async (id) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE_URL}/deleteOrder/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ hardDelete: true })
      });

      if (response.ok) {
        setShowDeleteConfirm(null);
        handleRefresh();
      } else {
        const err = await response.json();
        alert(err.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const orders = useMemo(() => {
    const formatDate = (dateValue) => {
      if (!dateValue) return 'N/A';
      if (typeof dateValue === 'object' && dateValue._seconds) {
        return new Date(dateValue._seconds * 1000).toLocaleDateString();
      }
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    };

    return (rawOrders || []).map(order => {
      // VENDOR SCOPING
      const itemsToDisplay = user?.role === 'vendor' 
        ? (order.items || []).filter(item => item.vendorId === user.uid)
        : (order.items || []);

      const totalDisplay = user?.role === 'vendor'
        ? itemsToDisplay.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0)
        : (Number(order.total) || 0);

      return {
        id: order.orderNumber || order.id,
        docId: order.id,
        customer: order.customerName || order.customer?.name || 'Unknown',
        items: itemsToDisplay.map(i => `${i.productName || i.name || i.itemName || 'Unknown Item'} (x${i.quantity || 1})`).join(', ') || 'N/A',
        total: `GHC ${totalDisplay.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        totalRaw: totalDisplay,
        status: order.orderStatus || order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        paymentMethod: order.paymentMethod || 'N/A',
        date: formatDate(order.createdAt),
        whatsapp: order.customerPhone || order.customer?.phone || '',
        address: order.deliveryAddress || order.address || '',
        rawItems: itemsToDisplay,
      };
    });
  }, [rawOrders, user]);

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

  if (status === 'loading' && orders.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-full">
      <LoadingSpinner size="lg" color="yellow" />
      <p className="mt-4 text-gray-500 font-bold text-xs uppercase tracking-widest animate-pulse">Scanning Orders...</p>
    </div>
  );

  return (
    <div className="p-6 mt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-black text-gray-900">Orders</h1>
            <p className="text-gray-500 text-sm">Manage inquiries, deliveries, and Pay-on-Delivery logistics.</p>
          </div>
          <div className="flex items-center gap-3">
            {status === "loading" && (
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing...
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleRefresh}
              disabled={status === 'loading'}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${status === 'loading' ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                <tr>
                  <th className="px-6 py-5 tracking-widest">ID & Date</th>
                  <th className="px-6 py-5 tracking-widest">Customer</th>
                  <th className="px-6 py-5 tracking-widest">Items</th>
                  <th className="px-6 py-5 tracking-widest">Total</th>
                  <th className="px-6 py-5 tracking-widest">Payment</th>
                  <th className="px-6 py-5 tracking-widest">Status</th>
                  <th className="px-6 py-5 text-right tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center gap-2">
                          <ShoppingCart className="w-8 h-8 text-gray-200" />
                          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">
                            {orders.length === 0 ? 'No orders found.' : 'No orders match your search.'}
                          </p>
                       </div>
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr 
                    key={order.docId || order.id} 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-gray-900">{order.id}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{order.date}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 font-black">{order.customer}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{order.whatsapp || '—'}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs text-gray-500 font-medium max-w-xs truncate">{order.items}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900">{order.total}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50 border-green-100' : 'text-yellow-600 bg-yellow-50 border-yellow-100'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.whatsapp && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleWhatsApp(order.whatsapp, order.id); }}
                            title="Contact via WhatsApp"
                            className="p-2.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 border border-green-100"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-tight pr-1">WhatsApp</span>
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setIsModalOpen(true); }}
                          className="p-2 text-gray-300 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(order.docId); }}
                            className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Showing {filteredOrders.length} of {pagination.total || orders.length} orders</span>
            <div className="flex gap-2">
               <button 
                 onClick={() => dispatch(setPage(Math.max(1, pagination.page - 1)))}
                 disabled={pagination.page <= 1 || status === 'loading'}
                 className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
               >
                 Prev
               </button>
               <button 
                 onClick={() => dispatch(setPage(pagination.page + 1))}
                 disabled={!pagination.hasMore || status === 'loading'}
                 className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
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
          onUpdate={handleRefresh}
      />

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Order?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Permanently remove this order from the system? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteOrder(showDeleteConfirm)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
