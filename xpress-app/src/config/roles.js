/**
 * RBAC Role Definitions for Xpress Autozone Admin Dashboard
 * 
 * Role Hierarchy (highest → lowest):
 *   admin > manager > moderator > vendor > customer
 */

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MODERATOR: 'moderator',
  VENDOR: 'vendor',
  ACCOUNTANT: 'accountant',
  CUSTOMER: 'customer',
};

export const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    description: 'Full system access. Can manage all roles, users, finances, and system settings.',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: '🔴',
    level: 100,
    permissions: [
      'manage_roles',
      'view_admin_logs',
      'manage_users',
      'manage_products',
      'manage_orders',
      'manage_transactions',
      'view_dashboard',
      'manage_vendors',
      'manage_customers',
      'export_data',
    ],
  },
  manager: {
    label: 'Manager',
    description: 'Can manage orders, products, vendors, and customers. Cannot assign roles or access admin logs.',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '🟣',
    level: 75,
    permissions: [
      'manage_users',
      'manage_products',
      'manage_orders',
      'manage_transactions',
      'view_dashboard',
      'manage_vendors',
      'manage_customers',
      'export_data',
    ],
  },
  moderator: {
    label: 'Moderator',
    description: 'Can view and update orders, manage products, and handle customer inquiries. No financial access.',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🔵',
    level: 50,
    permissions: [
      'manage_products',
      'manage_orders',
      'view_dashboard',
      'manage_customers',
    ],
  },
  accountant: {
    label: 'Accountant',
    description: 'Financial auditor. Can view and manage all orders, payments, and ledger entries.',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: '💰',
    level: 40,
    permissions: [
      'manage_orders',
      'manage_transactions',
      'view_dashboard',
      'export_data',
    ],
  },
  vendor: {
    label: 'Vendor',
    description: 'External supplier. Can view assigned orders and update product stock for their items only.',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: '🟠',
    level: 25,
    permissions: [
      'manage_products',
      'manage_orders',
    ],
  },
  customer: {
    label: 'Customer',
    description: 'Standard user. No admin dashboard access.',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '⚪',
    level: 0,
    permissions: [],
  },
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  const config = ROLE_CONFIG[role];
  if (!config) return false;
  return config.permissions.includes(permission);
};

/**
 * Get roles that the current user can assign (only roles below their level)
 */
export const getAssignableRoles = (currentRole) => {
  const currentLevel = ROLE_CONFIG[currentRole]?.level || 0;
  return Object.entries(ROLE_CONFIG)
    .filter(([, config]) => config.level < currentLevel)
    .map(([key]) => key);
};

/**
 * Sorted list of all staff roles (excluding customer)
 */
export const STAFF_ROLES = Object.entries(ROLE_CONFIG)
  .filter(([key]) => key !== 'customer')
  .sort((a, b) => b[1].level - a[1].level);

/**
 * All valid roles for dropdowns
 */
export const ALL_ROLES = Object.keys(ROLE_CONFIG);
