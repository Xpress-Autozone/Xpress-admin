import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Plus, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Download, Building2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';
import LoadingSpinner from '../../Components/LoadingSpinner';

const Payments = () => {
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [ledger, setLedger] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [stats, setStats] = useState({
        totalCollections: 0,
        pendingPayouts: 0,
        pendingReceipts: 0
    });
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [recordFormData, setRecordFormData] = useState({
        amount: '',
        method: 'Cash',
        type: 'Received',
        notes: '',
        reference: ''
    });

    useEffect(() => {
        fetchAccountingData();
    }, []);

    const fetchAccountingData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const result = await response.json();
            if (result.success) {
                setLedger(result.data.ledger);
                setPendingOrders(result.data.pending);
                
                // Calculate stats
                const collections = result.data.ledger
                    .filter(t => t.type === 'Received')
                    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
                
                const payouts = result.data.ledger
                    .filter(t => t.type === 'Payout')
                    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
                    
                const receipts = result.data.pending.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

                setStats({
                    totalCollections: collections,
                    pendingPayouts: payouts,
                    pendingReceipts: receipts
                });
            }
        } catch (err) {
            console.error("Error fetching accounting data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordEntry = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...recordFormData,
                amount: Number(recordFormData.amount)
            };

            const response = await fetch(`${API_BASE_URL}/transactions/record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowRecordModal(false);
                setRecordFormData({ amount: '', method: 'Cash', type: 'Received', notes: '', reference: '' });
                fetchAccountingData();
            } else {
                const err = await response.json();
                alert(err.message || "Failed to record entry");
            }
        } catch (err) {
            console.error("Error recording entry:", err);
        }
    };

    const exportToCSV = () => {
        const headers = ["ID", "Reference/Order", "Method", "Type", "Amount", "Status", "Date", "Recorded By"];
        const rows = ledger.map(t => [
            t.transactionId || t.id,
            t.orderId,
            t.method,
            t.type,
            t.amount,
            t.status,
            t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A',
            t.recordedBy || 'System'
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `accounting_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /* 
    PAYstack INTEGRATION (Future Flow)
    ----------------------------------
    const initiateOnPlatformPayment = async (orderId, email, amount) => {
        // 1. Initialize transaction with Paystack API
        // 2. Redirect user to paystack checkout URL or use Inline popup
        // 3. Handle callback to /transactions/verify-paystack
        
        const paystackConfig = {
            reference: (new Date()).getTime().toString(),
            email: email,
            amount: amount * 100, // kobo/pesewas
            publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx',
        };
        
        // Example: loadPaystackInline(paystackConfig);
        console.log("Paystack flow triggered for:", orderId);
    }
    */

    if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );

    return (
        <div className="p-6 mt-20 min-h-screen bg-gray-100 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <ArrowDownLeft className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Settled</span>
                        </div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 text-left">Total Collections</h3>
                        <p className="text-2xl font-bold text-gray-900 text-left">GHC {stats.totalCollections.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">Outflow</span>
                        </div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 text-left">Total Payouts</h3>
                        <p className="text-2xl font-bold text-gray-900 text-left">GHC {stats.pendingPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Pending</span>
                        </div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 text-left">Pending PoD Confirmation</h3>
                        <p className="text-2xl font-bold text-gray-900 text-left">GHC {stats.pendingReceipts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-gray-900">Accounting / Cash Ledger</h1>
                        <p className="text-gray-500 text-sm">Track income, payouts, and manual payment confirmations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button 
                            onClick={() => setShowRecordModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Record Entry (INV)
                        </button>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction History</h2>
                        <span className="text-[10px] font-bold text-gray-400">Total Entries: {ledger.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-400 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4 text-center">Type</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {ledger.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm italic">No records found in the ledger.</td>
                                    </tr>
                                ) : ledger.map((pay) => (
                                    <tr key={pay.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{pay.transactionId || pay.id}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">
                                                {pay.createdAt ? new Date(pay.createdAt).toLocaleString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                {pay.orderId}
                                            </div>
                                            {pay.notes && <div className="text-[10px] text-gray-500 mt-1 max-w-[200px] truncate">{pay.notes}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 font-medium">{pay.method}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${pay.type === 'Received' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                                {pay.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${pay.type === 'Received' ? 'text-gray-900' : 'text-red-700'}`}>
                                            {pay.type === 'Payout' ? '-' : ''}GHC {pay.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold text-green-700 bg-green-50 border border-green-100">
                                                {pay.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Confirmation Flow (PoD) */}
                {pendingOrders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
                        <div className="p-4 border-b border-orange-100 bg-orange-50 flex items-center justify-between">
                            <h2 className="text-xs font-bold text-orange-700 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Pending Cash Confirmations (PoD)
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-gray-100">
                                    {pendingOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{order.orderId}</div>
                                                <div className="text-[10px] text-gray-500">{new Date(order.date).toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{order.method}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">GHC {order.amount?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setRecordFormData({
                                                            ...recordFormData,
                                                            amount: order.amount,
                                                            reference: order.orderId,
                                                            orderId: order.id
                                                        });
                                                        setShowRecordModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors"
                                                >
                                                    Process Receipt
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Recording Entry */}
            {showRecordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 text-left">Record Finance Entry</h2>
                            <button onClick={() => setShowRecordModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleRecordEntry} className="p-6 space-y-4 text-left">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-yellow-400 outline-none"
                                        value={recordFormData.type}
                                        onChange={(e) => setRecordFormData({...recordFormData, type: e.target.value})}
                                    >
                                        <option value="Received">Revenue / Receive</option>
                                        <option value="Payout">Payout / Expense</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Method</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-yellow-400 outline-none"
                                        value={recordFormData.method}
                                        onChange={(e) => setRecordFormData({...recordFormData, method: e.target.value})}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Mobile Money">Mobile Money</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (GHC)</label>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    placeholder="0.00"
                                    value={recordFormData.amount}
                                    onChange={(e) => setRecordFormData({...recordFormData, amount: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ref / Order #</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    placeholder="e.g. ORD-123 or Manual"
                                    value={recordFormData.reference || recordFormData.orderId || ''}
                                    onChange={(e) => setRecordFormData({...recordFormData, reference: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Internal Notes</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                                    rows="3"
                                    value={recordFormData.notes}
                                    onChange={(e) => setRecordFormData({...recordFormData, notes: e.target.value})}
                                    placeholder="Add any specific details for the records..."
                                />
                            </div>

                            <button type="submit" className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-xl shadow-sm transition-colors mt-2">
                                Confirm & Record Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
