import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Mail, Phone, Calendar, ShoppingBag, Edit, ShieldAlert, MessageSquare, Save, Car, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDisplayId } from '../../../utils/idGenerator';
import { API_BASE_URL } from '../../../config/api';

const CustomerDetailModal = ({ customer, isOpen, onClose, onUpdateTags, isUpdating }) => {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (customer && isOpen) {
      setTags(customer.tags || []);
      fetchCustomerOrders();
    }
  }, [customer, isOpen]);

  const fetchCustomerOrders = async () => {
    if (!customer?.uid) return;
    try {
      setOrdersLoading(true);
      const response = await fetch(`${API_BASE_URL}/getOrders?customerId=${customer.uid}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching customer orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAddTag = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        if (onUpdateTags) await onUpdateTags(customer.uid, newTags);
      }
      e.target.value = '';
    }
  };

  const removeTag = async (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    if (onUpdateTags) await onUpdateTags(customer.uid, newTags);
  };

  if (!isOpen || !customer) return null;

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
                {customer.name || customer.displayName || 'Unnamed User'}
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
                    {tags.length === 0 && <p className="text-[10px] text-gray-400 italic">No tags assigned</p>}
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
                    disabled={isUpdating}
                    placeholder={isUpdating ? "Saving..." : "Add a tag..."}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm ${isUpdating ? 'bg-gray-50 opacity-70' : ''}`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-gray-500 font-medium italic">Tags auto-save on 'Enter'.</p>
                    {isUpdating && (
                      <span className="text-[10px] text-yellow-600 font-bold animate-pulse">Saving...</span>
                    )}
                  </div>
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
                   <button className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-2 p-2 hover:bg-white rounded transition-all">
                     <ShieldAlert className="w-4 h-4 text-red-500" /> Reset Password
                   </button>
                   <button className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-2 p-2 hover:bg-white rounded transition-all">
                     <ShieldAlert className="w-4 h-4 text-red-500" /> Block User
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
               
               {ordersLoading ? (
                 <div className="py-8 text-center">
                    <Loader2 className="w-6 h-6 text-yellow-500 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading history...</p>
                 </div>
               ) : orders.length > 0 ? (
                 <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="p-3 border border-gray-100 rounded-xl hover:border-yellow-300 transition-colors bg-white">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold text-gray-900 font-mono">{order.orderNumber || order.id}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${['delivered', 'received'].includes(order.orderStatus?.toLowerCase()) ? 'text-green-700 bg-green-50' : 'text-yellow-700 bg-yellow-50'}`}>
                             {order.orderStatus || 'Pending'}
                           </span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-xs text-gray-500">
                             {order.createdAt?._seconds 
                               ? new Date(order.createdAt._seconds * 1000).toLocaleDateString() 
                               : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                           </span>
                           <span className="text-sm font-bold text-gray-900">GH₵{Number(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         </div>
                      </div>
                    ))}
                    {orders.length >= 10 && (
                      <button className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 text-center border border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                        View All Orders
                      </button>
                    )}
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
