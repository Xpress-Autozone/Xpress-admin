import React from 'react';
import { X, Package, User, MapPin, Truck, CheckCircle, MessageSquare, CreditCard, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';

// ─── Order Status Flow ───────────────────────────────────────────────────────
const ORDER_STATUSES = [
  { value: 'requested',    label: 'Requested',    emoji: '📋', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'payment_made', label: 'Payment Made', emoji: '💳', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'dispatched',   label: 'Dispatched',   emoji: '🚚', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'received',     label: 'Received',     emoji: '✅', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'cancelled',    label: 'Cancelled',    emoji: '❌', color: 'bg-red-100 text-red-700 border-red-200' },
  // legacy statuses for backward compatibility
  { value: 'pending',      label: 'Pending',      emoji: '⏳', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'confirmed',    label: 'Confirmed',    emoji: '📌', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'shipped',      label: 'Shipped',      emoji: '📦', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'delivered',    label: 'Delivered',    emoji: '🏠', color: 'bg-green-100 text-green-700 border-green-200' },
];

const FLOW_STEPS = ['requested', 'payment_made', 'dispatched', 'received'];

const getStatusConfig = (status) =>
  ORDER_STATUSES.find(s => s.value === status?.toLowerCase()) ||
  { value: status, label: status || 'Unknown', emoji: '📋', color: 'bg-gray-100 text-gray-700 border-gray-200' };

// ─── Component ───────────────────────────────────────────────────────────────
const OrderDetailModal = ({ order, isOpen, onClose, onUpdate }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusSuccess, setStatusSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const currentStatusConfig = getStatusConfig(order.status);
  const currentIdx = FLOW_STEPS.indexOf(order.status?.toLowerCase());
  const isCancelled = order.status?.toLowerCase() === 'cancelled';

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDeleteOrder = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(`${API_BASE_URL}/deleteOrder/${order.docId || order.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ hardDelete: true })
      });
      const result = await response.json();
      if (result.success) { onUpdate?.(); onClose(); }
      else alert(result.message || 'Failed to delete order');
    } catch (e) { alert('An error occurred while deleting the order.'); }
    finally { setIsUpdating(false); setShowDeleteConfirm(false); }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!newStatus || newStatus === order.status) return;
    try {
      setIsUpdating(true);
      setStatusSuccess(false);
      const response = await fetch(`${API_BASE_URL}/updateOrderStatus/${order.docId || order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        setStatusSuccess(true);
        setSelectedStatus('');
        onUpdate?.();
        setTimeout(() => setStatusSuccess(false), 2500);
      } else {
        alert(result.message || 'Failed to update order status');
      }
    } catch (e) { alert('An error occurred while updating order status.'); }
    finally { setIsUpdating(false); }
  };

  const handleWhatsApp = () => {
    if (!order.whatsapp) return;
    const msg = `Hello, this is Xpress Autozone regarding your order ${order.id}. We are ready to arrange your delivery!`;
    window.open(`https://wa.me/${order.whatsapp.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Derived Data ─────────────────────────────────────────────────────────────
  const orderItems = order.rawItems?.length > 0
    ? order.rawItems.map(item => ({
        name: item.name || item.itemName || 'Auto Part',
        qty: item.quantity || 1,
        image: item.image || null,
        price: `GHC ${(Number(item.price) * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        unitPrice: `GHC ${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      }))
    : [{ name: order.items || 'Order Item', qty: 1, image: null, price: order.total, unitPrice: order.total }];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900 font-mono">{order.id}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-700 rounded uppercase tracking-wider">{order.date}</span>
            </div>
            <p className="text-sm text-gray-500 font-medium text-left">Order Details & Logistics</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">

            {/* LEFT — Status & Items */}
            <div className="space-y-5">

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${currentStatusConfig.color}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentStatusConfig.emoji}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Current Status</p>
                    <p className="text-sm font-black text-gray-900">{currentStatusConfig.label}</p>
                  </div>
                </div>
                {order.paymentStatus && (
                  <div className="flex items-center gap-1.5 opacity-80">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">{order.paymentStatus}</span>
                  </div>
                )}
              </div>

              {/* Progress Stepper */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Order Progress</h3>
                <div className="flex items-center gap-1">
                  {FLOW_STEPS.map((s, i, arr) => {
                    const cfg = getStatusConfig(s);
                    const isActive = order.status === s;
                    const isDone = !isCancelled && currentIdx > i;
                    return (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all ${
                            isCancelled ? 'border-gray-200 bg-gray-50 text-gray-300' :
                            isActive ? `border-current bg-white shadow-md scale-110 ${cfg.color}` :
                            isDone  ? 'border-green-400 bg-green-50 text-green-600' :
                            'border-gray-200 bg-gray-50 text-gray-400'
                          }`}>
                            {isDone ? '✓' : cfg.emoji}
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 text-center leading-tight ${
                            isActive ? 'text-gray-900' : isDone ? 'text-green-600' : 'text-gray-300'
                          }`}>{cfg.label}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 rounded transition-colors ${isDone && !isCancelled ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                  {isCancelled && (
                    <div className="flex flex-col items-center ml-2">
                      <div className="w-8 h-8 rounded-full border-2 border-red-300 bg-red-50 flex items-center justify-center text-base">❌</div>
                      <span className="text-[8px] font-black uppercase tracking-tighter mt-1 text-red-500">Cancelled</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items ({orderItems.length})</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            : <Package className="w-5 h-5 text-gray-400" />
                          }
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
            </div>

            {/* RIGHT — Customer & Update */}
            <div className="space-y-5">

              {/* Customer */}
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
                    <button onClick={handleWhatsApp} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-bold">Chat</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Delivery Address
                </h3>
                <div className="p-4 rounded-xl border border-gray-100 bg-white">
                  <p className="text-sm text-gray-700 leading-relaxed">{order.address || 'Address pending confirmation'}</p>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" /> Update Status
                </h3>
                <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-3">
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    disabled={isUpdating}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50"
                  >
                    <option value="">— Select new status —</option>
                    {ORDER_STATUSES
                      .filter(s => !['pending','confirmed','shipped','delivered','processing'].includes(s.value))
                      .map(s => (
                        <option key={s.value} value={s.value} disabled={s.value === order.status}>
                          {s.emoji} {s.label}{s.value === order.status ? ' (current)' : ''}
                        </option>
                      ))
                    }
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(selectedStatus)}
                    disabled={!selectedStatus || selectedStatus === order.status || isUpdating}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isUpdating
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                      : statusSuccess
                        ? <><CheckCircle className="w-4 h-4" /> Updated!</>
                        : <>Update Status</>
                    }
                  </button>
                  {statusSuccess && <p className="text-xs text-green-600 font-bold text-center">✓ Status updated successfully</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
          <div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isUpdating}
                className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Order
              </button>
            )}
          </div>
          <button onClick={onClose} disabled={isUpdating} className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50">
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center">
            <div className="p-8">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Order?</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                Permanently remove <span className="font-bold text-gray-900">{order.id}</span> from the system. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteOrder} className="flex-1 py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-700 transition-colors shadow-xl shadow-red-200">
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailModal;
