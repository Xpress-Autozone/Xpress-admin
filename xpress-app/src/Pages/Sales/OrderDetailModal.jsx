import React from 'react';
import { X, Package, User, MapPin, Truck, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  // Derive some extended dummy details based on the order
  const mockItems = [
    { name: order.items.split('(')[0].trim() || 'Auto Part', qty: order.items.match(/\((\w+)\)/)?.[1] || 'x1', price: order.total }
  ];

  const handleWhatsApp = () => {
    if (!order.whatsapp) return;
    const message = `Hello, this is Xpress Autozone regarding your order ${order.id}. We are ready to arrange your delivery!`;
    window.open(`https://wa.me/${order.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
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
              <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                     <Clock className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-yellow-700 uppercase">Current Status</p>
                     <p className="text-sm font-bold text-gray-900">{order.status}</p>
                   </div>
                 </div>
              </div>

              {/* Items List */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Items</h3>
                </div>
                <div className="divide-y divide-gray-50">
                   {mockItems.map((item, idx) => (
                     <div key={idx} className="p-4 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                             <Package className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-gray-900">{item.name}</p>
                             <p className="text-xs text-gray-500">Qty: {item.qty}</p>
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
                        <p className="text-xs text-gray-500">{order.whatsapp}</p>
                     </div>
                     <button
                        onClick={handleWhatsApp}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                     >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold">Chat</span>
                     </button>
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Delivery Address
                  </h3>
                  <div className="p-4 rounded-xl border border-gray-100 bg-white">
                     <p className="text-sm text-gray-700 leading-relaxed">
                       123 Autozone Ave,<br/>
                       Accra, Ghana<br/>
                       (Pending confirmation)
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
