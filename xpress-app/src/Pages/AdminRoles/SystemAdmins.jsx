import React, { useState, useEffect } from "react";
import { Shield, Mail, UserCheck, ShieldAlert, Clock, Search, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner";
import AlertModal from "../../Components/AlertModal";
import { API_BASE_URL } from "../../config/api";
import { ROLE_CONFIG, STAFF_ROLES, getAssignableRoles, hasPermission } from "../../config/roles";
import { formatDisplayId } from "../../utils/idGenerator";
import AdminHistoryModal from "./AdminHistoryModal";

const SystemAdmins = () => {

    const { token, user: currentUser } = useSelector((state) => state.auth);
    const currentRole = currentUser?.role || 'customer';
    const canManageRoles = hasPermission(currentRole, 'manage_roles');
    const assignableRoles = getAssignableRoles(currentRole);

    const [admins, setAdmins] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [showRoleGuide, setShowRoleGuide] = useState(false);
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState({});
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

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
            const allUsersList = data.data || [];
            setAllUsers(allUsersList);
            // Filter staff (anyone with a non-customer role)
            const staffList = allUsersList.filter(u => u.role && u.role !== 'customer');
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

    const assignRole = async (userId, role) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ uid: userId, role }),
            });
            if (!response.ok) throw new Error("Failed to assign role");
            setAlert({ isOpen: true, type: 'success', title: 'Role Updated', message: `Successfully assigned ${ROLE_CONFIG[role]?.label || role} role.` });
            fetchAdmins();
        } catch (err) {
            setAlert({ isOpen: true, type: 'error', title: 'Error', message: err.message });
        }
    };

    const getRoleBadge = (role) => {
        return ROLE_CONFIG[role]?.color || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const filteredUsers = allUsers.filter(u =>
        (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" color="yellow" />
        </div>
    );

    return (
        <div className="p-6 mt-20 min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-gray-900">System Administrators</h1>
                        <p className="text-gray-500 text-sm font-medium">Manage platform staff, roles, and access permissions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowRoleGuide(!showRoleGuide)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                        >
                            <Info className="w-4 h-4" /> Role Guide
                        </button>
                        {canManageRoles && (
                            <button
                                onClick={() => setShowAssignPanel(!showAssignPanel)}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors shadow-sm"
                            >
                                <UserCheck className="w-4 h-4" /> {showAssignPanel ? 'Hide' : 'Assign Roles'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Role Guide Panel */}
                {showRoleGuide && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Role-Based Access Control (RBAC)</h2>
                            <button onClick={() => setShowRoleGuide(false)} className="text-gray-400 hover:text-gray-600">
                                <ChevronUp className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 text-left">Each role has specific permissions. Higher roles inherit all access of lower roles. Only admins can assign or change roles.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {STAFF_ROLES.map(([key, config]) => (
                                <div key={key} className={`p-4 rounded-xl border ${config.color} text-left`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{config.icon}</span>
                                        <h3 className="font-bold text-sm uppercase tracking-wider">{config.label}</h3>
                                        <span className="text-[10px] font-bold ml-auto opacity-60">LVL {config.level}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed opacity-80">{config.description}</p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {config.permissions.map(perm => (
                                            <span key={perm} className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/50 opacity-70">
                                                {perm.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assign Roles Panel (Admin Only) */}
                {canManageRoles && showAssignPanel && (
                    <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6 mb-8 animate-in slide-in-from-top duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-left">
                                <h2 className="text-lg font-bold text-gray-900">Assign & Manage Roles</h2>
                                <p className="text-xs text-gray-500">Search for any user and update their role. Changes take effect on their next login.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-72"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-400 font-bold sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Current Role</th>
                                        <th className="px-4 py-3">Assign Role</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.slice(0, 50).map((user) => (
                                        <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                                    {user.displayName || 'N/A'}
                                                    {user.uid === currentUser?.uid && (
                                                        <span className="ml-2 text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-blue-200">You</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getRoleBadge(user.role || 'customer')}`}>
                                                    {ROLE_CONFIG[user.role]?.icon || '⚪'} {user.role || 'customer'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={selectedRole[user.uid] || user.role || 'customer'}
                                                    onChange={(e) => setSelectedRole(prev => ({ ...prev, [user.uid]: e.target.value }))}
                                                    disabled={user.uid === currentUser?.uid}
                                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {assignableRoles.map(role => (
                                                        <option key={role} value={role}>
                                                            {ROLE_CONFIG[role]?.icon || '⚪'} {ROLE_CONFIG[role]?.label || role}
                                                        </option>
                                                    ))}
                                                    {/* Admins can also promote to admin */}
                                                    {currentRole === 'admin' && <option value="admin">🔴 Admin</option>}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => assignRole(user.uid, selectedRole[user.uid] || user.role || 'customer')}
                                                    disabled={(selectedRole[user.uid] || user.role || 'customer') === (user.role || 'customer') || user.uid === currentUser?.uid}
                                                    title={user.uid === currentUser?.uid ? "You cannot change your own role" : ""}
                                                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Active Staff Grid */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Staff ({admins.length})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admins.length === 0 ? (
                         <div className="col-span-full p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                            <ShieldAlert className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No staff members found.</p>
                            <p className="text-gray-400 text-xs mt-1">Use "Assign Roles" above to promote users.</p>
                        </div>
                    ) : (
                        admins.map((admin) => {
                            const roleConfig = ROLE_CONFIG[admin.role] || ROLE_CONFIG.customer;
                            return (
                                <div key={admin.uid} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-lg">
                                            {(admin.displayName || admin.email || 'A').charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${roleConfig.color}`}>
                                            {roleConfig.icon} {roleConfig.label}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 text-left">{admin.displayName || 'System Staff'}</h3>
                                    <div className="text-[10px] text-gray-400 font-mono text-left mb-1">{formatDisplayId(admin.uid, 'admin')}</div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                                        <Mail className="w-3.5 h-3.5" />
                                        {admin.email}
                                    </div>
                                    <p className="text-[11px] text-gray-400 text-left mb-4 leading-relaxed">{roleConfig.description}</p>
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {admin.lastSignInTime ? new Date(admin.lastSignInTime).toLocaleDateString() : 'Never'}
                                        </span>
                                        {hasPermission(currentRole, 'view_admin_logs') && (
                                            <button
                                                onClick={() => handleViewHistory(admin)}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                View History
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <AdminHistoryModal
                isOpen={isHistoryModalOpen}
                admin={selectedAdmin}
                onClose={() => setIsHistoryModalOpen(false)}
            />

            <AlertModal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                type={alert.type}
                title={alert.title}
                message={alert.message}
            />
        </div>
    );
};

export default SystemAdmins;
