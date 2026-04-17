import React, { useState } from 'react';
import { DollarSign, Search, Plus, Filter, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for the Cash Ledger (Pay-on-Delivery focussed)
  const [payments] = useState([
    {
      id: 'PAY-8X7Y6Z',
      orderId: 'ORD-F8A4D2',
      amount: 'GHC 850.00',
      method: 'Cash',
      status: 'Confirmed',
      date: '2026-04-14 15:30',
      type: 'Received'
    },
    {
      id: 'PAY-3V2W1X',
      orderId: 'ORD-D3E4F5',
      amount: 'GHC 1,200.00',
      method: 'Mobile Money',
      status: 'Confirmed',
      date: '2026-04-14 11:20',
      type: 'Received'
    },
    {
      id: 'PAY-9T8S7R',
      orderId: 'VND-4A5B6C',
      amount: 'GHC 3,500.00',
      method: 'Bank Transfer',
      status: 'Sent',
      date: '2026-04-13 09:00',
      type: 'Payout'
    },
    {
      id: 'PAY-6Q5P4O',
      orderId: 'ORD-G8H9I0',
      amount: 'GHC 550.00',
      method: 'Cash',
      status: 'Pending Receipt',
      date: '2026-04-13 16:45',
      type: 'Received'
    }
  ]);

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
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Today</span>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Collections</h3>
            <p className="text-2xl font-bold text-gray-900">GHC 2,050.00</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">Scheduled</span>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Payouts</h3>
            <p className="text-2xl font-bold text-gray-900">GHC 3,500.00</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Active</span>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Receipts (PoD)</h3>
            <p className="text-2xl font-bold text-gray-900">GHC 550.00</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-left">Accounting</h1>
            <p className="text-gray-500 text-sm text-left">Track income, payouts, and manual payment confirmations.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors">
              <Plus className="w-4 h-4" /> Record Entry
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
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
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{pay.id}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{pay.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{pay.orderId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{pay.method}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${pay.type === 'Received' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {pay.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold ${pay.type === 'Received' ? 'text-gray-900' : 'text-red-600'}`}>
                      {pay.type === 'Payout' ? '-' : ''}{pay.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${pay.status === 'Confirmed' || pay.status === 'Sent' ? 'text-green-700 bg-green-50' : 'text-yellow-700 bg-yellow-50'}`}>
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
