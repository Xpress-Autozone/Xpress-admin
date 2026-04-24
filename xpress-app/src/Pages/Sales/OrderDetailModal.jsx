import React from 'react';
import { X, Package, User, MapPin, Truck, CheckCircle, Clock, MessageSquare, CreditCard } from 'lucide-react';

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  // Use real items from the order, or fall back to a parsed summary
  const orderItems = order.rawItems?.length > 0
    ? order.rawItems.map(item => ({
        name: item.name || item.itemName || 'Auto Part',
        qty: item.quantity || 1,
        price: `GHC ${(Number(item.price) * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        unitPrice: `GHC ${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      }))
    : [{ name: order.items || 'Order Item', qty: 1, price: order.total, unitPrice: order.total }];

  const handleWhatsApp = () => {
    if (!order.whatsapp) return;
    const message = `Hello, this is Xpress Autozone regarding your order ${order.id}. We are ready to arrange your delivery!`;
    window.open(`https://wa.me/${order.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered' || s === 'completed') return 'border-green-200 bg-green-50 text-green-700';
    if (s === 'shipped' || s === 'out for delivery') return 'border-orange-200 bg-orange-50 text-orange-700';
    if (s === 'cancelled') return 'border-red-200 bg-red-50 text-red-700';
    return 'border-yellow-200 bg-yellow-50 text-yellow-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
              <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-900 font-mono">{order.id}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-700 rounded uppercase tracking-wider">
                      {order.date}
                  </span>
              </div>
              <p className="text-sm text-gray-500 font-medium text-left">Order Details & Logistics</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 thin-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Left Col - Summary & Items */}
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${getStatusStyle(order.status)}`}>
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded-full bg-white/50">
                     <Clock className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs font-bold uppercase">Order Status</p>
                     <p className="text-sm font-bold text-gray-900">{order.status}</p>
                   </div>
                 </div>
                 {order.paymentStatus && (
                   <div className="flex items-center gap-1.5">
                     <CreditCard className="w-3.5 h-3.5" />
                     <span className="text-[10px] font-bold uppercase">{order.paymentStatus}</span>
                   </div>
                 )}
              </div>

              {/* Items List */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Items ({orderItems.length})</h3>
                </div>
                <div className="divide-y divide-gray-50">
                   {orderItems.map((item, idx) => (
                     <div key={idx} className="p-4 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                             <Package className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-gray-900">{item.name}</p>
                             <p className="text-xs text-gray-500">Qty: {item.qty} × {item.unitPrice}</p>
                           </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{item.price}</span>
                     </div>
                   ))}
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-sm font-bold text-gray-900">Total</span>
                   <span className="text-lg font-bold text-gray-900">{order.total}</span>
                </div>
              </div>

              {/* Payment Method */}
              {order.paymentMethod && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase">Payment Method:</span>
                  <span className="text-xs font-bold text-gray-900">{order.paymentMethod}</span>
                </div>
              )}
            </div>

            {/* Right Col - Customer & Logistics */}
            <div className="space-y-6">
               
               <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> Customer
                  </h3>
                  <div className="p-4 rounded-xl border border-gray-100 bg-white flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.whatsapp || 'No phone'}</p>
                     </div>
                     {order.whatsapp && (
                       <button
                          onClick={handleWhatsApp}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                       >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs font-bold">Chat</span>
                       </button>
                     )}
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Delivery Address
                  </h3>
                  <div className="p-4 rounded-xl border border-gray-100 bg-white">
                     <p className="text-sm text-gray-700 leading-relaxed">
                       {order.address || 'Address pending confirmation'}
                     </p>
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" /> Delivery Provider
                  </h3>
                  <div className="p-4 rounded-xl border border-gray-100 bg-white flex justify-between items-center">
                     <div>
                       <p className="text-sm font-bold text-gray-900">Xpress Logistics</p>
                       <p className="text-xs text-gray-500">Standard Delivery</p>
                     </div>
                     <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Assign Driver</span>
                  </div>
               </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
            <button className="px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent">
              Cancel Order
            </button>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                Close
              </button>
              <button className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mark as Processed
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
