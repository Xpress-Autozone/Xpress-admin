import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, MessageSquare, Clock, CheckCircle2, Truck, ExternalLink } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // High-fidelity dummy data for the Order Pipeline
  const [orders] = useState([
    {
      id: 'ORD-A9F3B1',
      customer: 'Kwame Mensah',
      items: 'BOSCH Spark Plug (x4)',
      total: 'GHC 180.00',
      status: 'Pending Inquiry',
      date: '2026-04-16',
      whatsapp: '+233240000001'
    },
    {
      id: 'ORD-B2E8C4',
      customer: 'Abena Osei',
      items: 'Toyota Brake Pads (Front)',
      total: 'GHC 450.00',
      status: 'Arranging',
      date: '2026-04-15',
      whatsapp: '+233240000002'
    },
    {
      id: 'ORD-C7D1E9',
      customer: 'John Doe',
      items: 'Engine Oil 5W-30 (5L)',
      total: 'GHC 320.00',
      status: 'Out for Delivery',
      date: '2026-04-15',
      whatsapp: '+233240000003'
    },
    {
      id: 'ORD-F8A4D2',
      customer: 'Service Center A',
      items: 'Air Filter (x10)',
      total: 'GHC 850.00',
      status: 'Completed',
      date: '2026-04-14',
      whatsapp: '+233240000004'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Inquiry': return 'bg-blue-100 text-blue-700';
      case 'Arranging': return 'bg-yellow-100 text-yellow-700';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending Inquiry': return <MessageSquare className="w-3 h-3" />;
      case 'Arranging': return <Clock className="w-3 h-3" />;
      case 'Out for Delivery': return <Truck className="w-3 h-3" />;
      case 'Completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleWhatsApp = (phone, orderId) => {
    const message = `Hello, this is Xpress Autozone regarding your order ${orderId}. We are ready to arrange your delivery!`;
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="p-6 mt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
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
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-400">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{order.customer}</div>
                      <div className="text-xs text-gray-400">{order.whatsapp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{order.items}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleWhatsApp(order.whatsapp, order.id); }}
                          title="Contact via WhatsApp"
                          className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 border border-green-200"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs font-bold px-1">WhatsApp</span>
                        </button>
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
            <span className="text-xs text-gray-500 font-medium">Showing {orders.length} orders</span>
            <div className="flex gap-2 text-xs font-bold">
               <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-400 cursor-not-allowed">Prev</button>
               <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50">Next</button>
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
