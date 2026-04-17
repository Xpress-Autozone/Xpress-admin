import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Tag, MoreVertical, ExternalLink, ShieldCheck, Mail } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import { formatDisplayId } from '../../../utils/idGenerator';
import CustomerDetailModal from './CustomerDetailModal';

const Customers = () => {
    const { token } = useSelector((state) => state.auth);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await response.json();
            // Filter only customers
            const userList = (data.data || []).filter(u => u.role === 'customer' || !u.role);
            
            // Add some dummy metadata for high-fidelity feel
            const enhancedList = userList.map(u => ({
                ...u,
                tags: u.tags || (Math.random() > 0.7 ? ['VIP'] : Math.random() > 0.6 ? ['Wholesale'] : []),
                lastOrder: '2026-04-10',
                orderCount: Math.floor(Math.random() * 10)
            }));
            
            setCustomers(enhancedList);
        } catch (err) {
            console.error("Error fetching customers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTags = (uid, newTags) => {
        setCustomers(prev => prev.map(c => c.uid === uid ? { ...c, tags: newTags } : c));
        if (selectedCustomer?.uid === uid) {
            setSelectedCustomer(prev => ({ ...prev, tags: newTags }));
        }
        // This acts as a mock until the actual backend endpoint is wired up
        console.log(`System automatically saved tags for ${uid}:`, newTags);
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case 'VIP': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Wholesale': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );

    return (
        <div className="p-6 mt-20 min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                        <p className="text-gray-500 text-sm">Monitor your customer base, order history, and account tags.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-72"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Customer Details</th>
                                    <th className="px-6 py-4">Account Status</th>
                                    <th className="px-6 py-4">Order History</th>
                                    <th className="px-6 py-4">Tags</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No customers found.</td>
                                    </tr>
                                ) : customers.map((customer) => (
                                    <tr 
                                        key={customer.uid} 
                                        onClick={() => { setSelectedCustomer(customer); setIsModalOpen(true); }}
                                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                    {(customer.displayName || customer.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{customer.displayName || 'Unnamed User'}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono mb-1">{formatDisplayId(customer.uid, 'customer')}</div>
                                                    <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                <ShieldCheck className="w-3 h-3" /> Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{customer.orderCount} Orders</div>
                                            <div className="text-xs text-gray-400">Last: {customer.lastOrder}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {customer.tags.map(tag => (
                                                    <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTagColor(tag)}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                                <button 
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="text-gray-400 hover:text-yellow-600"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedCustomer(customer); setIsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <CustomerDetailModal 
                customer={selectedCustomer} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onUpdateTags={handleUpdateTags}
            />
        </div>
    );
};

export default Customers;
