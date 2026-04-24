import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Mail, Phone, Calendar, ShoppingBag, Edit, ShieldAlert, MessageSquare, Save, Car } from 'lucide-react';
import { formatDisplayId } from '../../../utils/idGenerator';

const CustomerDetailModal = ({ customer, isOpen, onClose, onUpdateTags }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (customer) {
      setTags(customer.tags || []);
    }
  }, [customer]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        setTags(prev => [...prev, newTag]);
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen || !customer) return null;

  // Real orders are now fetched and passed in the customer object from the backend
  const orders = customer.orders || [];
  
  // Some dummy orders for visualization if real ones are empty but count is > 0
  const dummyOrders = [
    { id: 'ORD-100234', status: 'Delivered', date: 'Oct 12, 2025', total: 'GH₵450.00' },
    { id: 'ORD-100192', status: 'Processing', date: 'Nov 05, 2025', total: 'GH₵125.50' }
  ];

  const vehicle = customer.vehicle || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl border-4 border-white shadow-sm">
                {(customer.displayName || customer.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {customer.displayName || 'Unnamed User'}
                {tags?.map(tag => (
                   <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200 uppercase">
                     {tag}
                   </span>
                ))}
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{formatDisplayId(customer.uid, 'customer')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 thin-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Col 1 - Contact & Tags */}
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {customer.email || 'No email provided'}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {customer.phoneNumber || customer.phone || '+233 XX XXX XXXX'}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="break-words">{customer.address || 'Address not listed'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined: {customer.creationTime ? new Date(customer.creationTime).toLocaleDateString() : 'Jan 2026'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Profile Tags</h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-200">
                        {tag}
                        <button 
                          onClick={(e) => { e.preventDefault(); removeTag(tag); }} 
                          className="hover:text-yellow-900 focus:outline-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={handleAddTag}
                    placeholder="Add a tag..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-2">Press 'Enter' to add.</p>
                </div>
              </div>
            </div>

            {/* Col 2 - Vehicle Details */}
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-yellow-500" /> Vehicle Details
              </h3>
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_black] space-y-4">
                {vehicle.make ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Manufacturer</label>
                      <p className="text-lg font-black uppercase italic tracking-tighter text-black">{vehicle.make}</p>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Model</label>
                      <p className="text-lg font-black uppercase italic tracking-tighter text-black">{vehicle.model}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Year</label>
                        <p className="text-sm font-bold text-black">{vehicle.year}</p>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Fuel Type</label>
                        <p className="text-sm font-bold text-black">{vehicle.fuelType}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-lg">
                    <Car className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No vehicle info</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Quick Actions</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
                   <button 
                     onClick={() => onUpdateTags && onUpdateTags(customer.uid, tags)}
                     className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-2 p-2 hover:bg-white rounded transition-all"
                   >
                     <Save className="w-4 h-4 text-green-500" /> Save Profile Tags
                   </button>
                   <button className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-2 p-2 hover:bg-white rounded transition-all">
                     <ShieldAlert className="w-4 h-4 text-red-500" /> Reset Password
                   </button>
                </div>
              </div>
            </div>

            {/* Col 3 - Order History */}
            <div className="text-left">
               <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center justify-between">
                 Order History
                 <span className="text-xs font-semibold text-gray-400">{customer.orderCount || 0} Total Orders</span>
               </h3>
               
               {customer.orderCount > 0 ? (
                 <div className="space-y-3">
                    {/* In a real scenario, we'd map customer.orders, using dummy if empty for demo */}
                   {(customer.orders?.length > 0 ? customer.orders : dummyOrders).map(order => (
                     <div key={order.id} className="p-3 border border-gray-100 rounded-xl hover:border-yellow-300 transition-colors bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-900 font-mono">{order.orderNumber || order.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' || order.orderStatus === 'delivered' ? 'text-green-700 bg-green-50' : 'text-yellow-700 bg-yellow-50'}`}>
                            {order.orderStatus || order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '')}</span>
                          <span className="text-sm font-bold text-gray-900">{order.total}</span>
                        </div>
                     </div>
                   ))}
                   <button className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 text-center border border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                     View All Orders
                   </button>
                 </div>
               ) : (
                 <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm font-medium">No orders yet.</p>
                 </div>
               )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              Close
            </button>
            <button className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
