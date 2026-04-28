import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Plus, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Download, Building2, X, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';
import LoadingSpinner from '../../Components/LoadingSpinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/Xpress-Autozone-Logo.png';

const Payments = () => {
    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        
        // Handle Firestore Timestamp object
        if (typeof dateValue === 'object' && dateValue._seconds) {
            return new Date(dateValue._seconds * 1000).toLocaleString();
        }
        
        // Handle ISO strings, milliseconds, or Date objects
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    const { user, token } = useSelector((state) => state.auth);
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
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // stores ID of transaction to delete

    useEffect(() => {
        if (token) {
            fetchAccountingData();
        }
    }, [token]);

    const fetchAccountingData = async () => {
        if (!token) return;
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

    const handleDeleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            if (response.ok) {
                setShowDeleteConfirm(null);
                fetchAccountingData();
            } else {
                const err = await response.json();
                alert(err.message || "Failed to delete transaction");
            }
        } catch (err) {
            console.error("Error deleting transaction:", err);
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
        const headers = ["Transaction ID", "Reference/Order", "Method", "Type", "Amount (GHC)", "Status", "Date", "Recorded By"];
        const rows = ledger.map(t => [
            t.transactionId || t.id,
            t.orderId || t.reference || 'Manual',
            t.method,
            t.type,
            t.amount,
            t.status,
            formatDate(t.createdAt),
            t.recordedBy || 'System'
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Xpress_Accounting_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = (transaction) => {
        const doc = new jsPDF();
        const dateStr = formatDate(transaction.createdAt);
        
        // Add Logo
        doc.addImage(logo, 'PNG', 15, 10, 40, 25);
        
        // Header Info
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text("OFFICIAL RECEIPT", 105, 25, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Xpress Autozone Ghana", 195, 15, { align: 'right' });
        doc.text("Premium Auto Parts & Logistics", 195, 20, { align: 'right' });
        doc.text("Accra, Ghana", 195, 25, { align: 'right' });

        // Divider
        doc.setDrawColor(241, 196, 15);
        doc.setLineWidth(1);
        doc.line(15, 40, 195, 40);

        // Transaction Details Section
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        doc.text("Transaction Summary", 15, 50);
        
        autoTable(doc, {
            startY: 55,
            head: [['Description', 'Details']],
            body: [
                ['Transaction ID', transaction.transactionId || transaction.id],
                ['Reference/Order #', transaction.orderId || transaction.reference || 'N/A'],
                ['Payment Method', transaction.method],
                ['Transaction Type', transaction.type],
                ['Date & Time', dateStr],
                ['Status', transaction.status.toUpperCase()],
                ['Recorded By', transaction.recordedBy || 'System/Admin']
            ],
            theme: 'striped',
            headStyles: { fillColor: [241, 196, 15], textColor: 255 },
            styles: { fontSize: 10 }
        });

        // Amount Box
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFillColor(248, 249, 250);
        doc.rect(130, finalY, 65, 25, 'F');
        doc.setDrawColor(230);
        doc.rect(130, finalY, 65, 25, 'D');
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("TOTAL AMOUNT", 135, finalY + 10);
        
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text(`GHC ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 135, finalY + 20);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setFont("helvetica", "italic");
        doc.text("This is a computer-generated document. No signature required.", 105, 280, { align: 'center' });
        doc.text(`Downloaded on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });

        doc.save(`Receipt_${transaction.transactionId || transaction.id}.pdf`);
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
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {ledger.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm italic">No records found in the ledger.</td>
                                    </tr>
                                ) : ledger.map((pay) => (
                                    <tr key={pay.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-left">
                                            <div className="text-sm font-semibold text-gray-900">{pay.transactionId || pay.id}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">
                                                {formatDate(pay.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                {pay.orderId || pay.reference || 'Manual'}
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
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold text-green-700 bg-green-50 border border-green-100">
                                                {pay.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedTransaction(pay)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => exportToPDF(pay)}
                                                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                                                    title="Download Receipt"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                {user?.role === 'admin' && (
                                                    <button 
                                                        onClick={() => setShowDeleteConfirm(pay.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Entry"
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
                                                <div className="text-[10px] text-gray-500">{formatDate(order.date)}</div>
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

            {/* View Transaction Details Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 text-left">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedTransaction.transactionId || selectedTransaction.id}</p>
                            </div>
                            <button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Reference / Order</label>
                                    <p className="text-sm font-bold text-gray-900">{selectedTransaction.orderId || selectedTransaction.reference || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Amount</label>
                                    <p className={`text-sm font-black ${selectedTransaction.type === 'Received' ? 'text-green-600' : 'text-red-600'}`}>
                                        GHC {selectedTransaction.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Payment Method</label>
                                    <p className="text-sm font-medium text-gray-700">{selectedTransaction.method}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date Recorded</label>
                                    <p className="text-sm font-medium text-gray-700">{formatDate(selectedTransaction.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Recorded By</label>
                                    <p className="text-sm font-medium text-gray-700">{selectedTransaction.recordedBy || 'System/Admin'}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                            </div>
                            {selectedTransaction.notes && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Internal Notes</label>
                                    <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedTransaction.notes}"</p>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    onClick={() => exportToPDF(selectedTransaction)}
                                    className="px-4 py-2 bg-yellow-400 text-white rounded-lg text-xs font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" /> Download PDF Receipt
                                </button>
                                <button 
                                    onClick={() => setSelectedTransaction(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Transaction?</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                This action will permanently remove this entry from the ledger. This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDeleteTransaction(showDeleteConfirm)}
                                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
