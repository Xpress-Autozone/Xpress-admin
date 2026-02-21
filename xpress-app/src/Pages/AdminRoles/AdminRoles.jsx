import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Shield } from "lucide-react";
import LoadingSpinner from "../../Components/LoadingSpinner";
import AlertModal from "../../Components/AlertModal";
import { API_BASE_URL } from "../../config/api";

const AdminRoles = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedRole, setSelectedRole] = useState({});

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("[AdminRoles] Fetching all users");
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log(`[AdminRoles] Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log(`[AdminRoles] Fetched ${data.data?.length || 0} users`);
      setUsers(data.data || []);
      setError(null);
    } catch (err) {
      console.error("[AdminRoles] Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedRole((prev) => ({ ...prev, [userId]: newRole }));
  };

  const assignRole = async (userId, role) => {
    try {
      console.log(`[AdminRoles] Assigning role ${role} to user ${userId}`);

      const response = await fetch(`${API_BASE_URL}/users/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ uid: userId, role }),
      });

      console.log(
        `[AdminRoles] Role assignment response status: ${response.status}`
      );

      if (!response.ok) {
        throw new Error("Failed to assign role");
      }

      setAlert({
        isOpen: true,
        type: "success",
        title: "Success",
        message: `Role assigned successfully`,
      });
      fetchUsers();
    } catch (err) {
      console.error("[AdminRoles] Error assigning role:", err);
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: err.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );
  }

  return (
    <div className="flex mt-20">
      <div className="p-6 h-screen w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Role Management
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              Error: {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Display Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Current Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Assign Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.displayName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {user.role || "customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={
                            selectedRole[user.uid] || user.role || "customer"
                          }
                          onChange={(e) =>
                            handleRoleChange(user.uid, e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="vendor">Vendor</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() =>
                            assignRole(
                              user.uid,
                              selectedRole[user.uid] || user.role || "customer"
                            )
                          }
                          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Assign</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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

export default AdminRoles;
