import React, { useState, useEffect } from 'react';
import { X, Clock, User, Shield, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useSelector } from 'react-redux';

const AdminHistoryModal = ({ admin, isOpen, onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && admin) {
      fetchLogs();
    }
  }, [isOpen, admin]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${admin.uid}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch history");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'ASSIGN_ROLE': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'UPDATE_USER_TAGS': return <User className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900">Admin Action History</h2>
              <p className="text-sm text-gray-500">History for {admin.displayName || admin.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
              <p className="text-gray-500 font-medium">Fetching history...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-900 font-bold">Error loading history</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-900 font-bold uppercase italic tracking-tighter">No History Found</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">This administrator hasn't performed any logged actions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm transition-all text-left">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm font-bold text-gray-900">{formatAction(log.action)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">Target ID:</span> {log.targetId}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-100 text-[11px] text-gray-500 font-mono">
                        {JSON.stringify(log.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryModal;
