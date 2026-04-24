import React, { useState, useEffect } from "react";
import { Shield, Mail, UserCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { API_BASE_URL } from "../../config/api";
import { formatDisplayId } from "../../utils/idGenerator";
import AdminHistoryModal from "./AdminHistoryModal";

const SystemAdmins = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await response.json();
            // Filter only Staff (Admin, Moderator, etc.)
            const staffList = (data.data || []).filter(u => u.role === 'admin' || u.role === 'moderator' || u.role === 'vendor');
            setAdmins(staffList);
        } catch (err) {
            console.error("Error fetching staff:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = (admin) => {
        setSelectedAdmin(admin);
        setIsHistoryModalOpen(true);
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-700 border-red-200';
            case 'moderator': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'vendor': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700';
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
                <div className="flex items-center justify-between mb-8">
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-gray-900">System Administrators</h1>
                        <p className="text-gray-500 text-sm font-medium">Manage platform staff permissions and internal roles.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin-roles')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors shadow-sm"
                    >
                        <UserCheck className="w-4 h-4" /> Manage Permissions
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admins.length === 0 ? (
                         <div className="col-span-full p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                            <ShieldAlert className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No specialized staff found.</p>
                        </div>
                    ) : (
                        admins.map((admin) => (
                            <div key={admin.uid} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-lg">
                                        {(admin.displayName || admin.email || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getRoleBadge(admin.role)}`}>
                                        {admin.role}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-left">{admin.displayName || 'System Staff'}</h3>
                                <div className="text-[10px] text-gray-400 font-mono text-left mb-2">{formatDisplayId(admin.uid, 'admin')}</div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
                                    <Mail className="w-3.5 h-3.5" />
                                    {admin.email}
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400">
                                    <span>Last Active: Today</span>
                                    <button 
                                        onClick={() => handleViewHistory(admin)}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        View History
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AdminHistoryModal 
                isOpen={isHistoryModalOpen} 
                admin={selectedAdmin} 
                onClose={() => setIsHistoryModalOpen(false)} 
            />
        </div>
    );
};

export default SystemAdmins;
