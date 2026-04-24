import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Settings,
  Package,
  Car,
  Zap,
  Circle,
  Disc,
  Wrench,
  Armchair,
  Sparkles,
  LogOut,
  User,
  Shield,
  LayoutGrid,
  ShoppingCart,
  DollarSign,
  Users,
  ChevronRight
} from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import { hasPermission } from '../../config/roles';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'customer';

  const insightsMenu = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/overview',
      permission: 'view_dashboard'
    }
  ];

  const salesMenu = [
    {
      icon: ShoppingCart,
      label: 'Orders',
      path: '/orders',
      permission: 'manage_orders'
    },
    {
      icon: DollarSign,
      label: 'Accounting',
      path: '/accounting',
      permission: 'manage_transactions'
    }
  ];

  const inventoryMenu = [
    {
      icon: Package,
      label: 'Total Inventory',
      path: '/products',
      permission: 'manage_products'
    }
  ];

  const managementMenu = [
    {
      icon: Shield,
      label: 'System Admins',
      path: '/admin-management',
      permission: 'manage_roles'
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/customers',
      permission: 'manage_customers'
    },
    {
      icon: User,
      label: 'Vendors',
      path: '/vendors',
      permission: 'manage_vendors'
    }
  ];

  const filterByPermission = (items) =>
    items.filter(item => !item.permission || hasPermission(role, item.permission));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const NavItem = ({ item }) => {
    const IconComponent = item.icon;
    const isActive = location.pathname === item.path || (item.slug && location.pathname === `/categories/${item.slug}`);

    return (
      <li>
        <button
          onClick={() => handleNavigation(item.path)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${isActive
            ? 'bg-yellow-50 text-yellow-700 font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <div className="flex items-center space-x-3">
            <IconComponent
              className={`w-5 h-5 ${isActive ? 'text-yellow-500' : 'text-gray-400'
                }`}
            />
            <span className="text-sm">{item.label}</span>
          </div>
          {isActive && <ChevronRight className="w-4 h-4 text-yellow-500" />}
        </button>
      </li>
    );
  };

  const filteredInsights = filterByPermission(insightsMenu);
  const filteredSales = filterByPermission(salesMenu);
  const filteredInventory = filterByPermission(inventoryMenu);
  const filteredManagement = filterByPermission(managementMenu);

  return (
    <div className="w-64 bg-white h-screen shadow-xl border-r border-gray-100 flex flex-col pt-24 sticky top-0 overflow-y-auto thin-scrollbar">
      <nav className="flex-1 px-4 space-y-8 pb-10">
        {/* Group 1: Insights */}
        {filteredInsights.length > 0 && (
          <div>
            <h3 className="px-3 text-[10px] font-extrabold text-gray-400/80 uppercase tracking-[0.15em] mb-4">
              Insights
            </h3>
            <ul className="space-y-1">
              {filteredInsights.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </ul>
          </div>
        )}

        {/* Group 2: Sales */}
        {filteredSales.length > 0 && (
          <div>
            <h3 className="px-3 text-[10px] font-extrabold text-gray-400/80 uppercase tracking-[0.15em] mb-4">
              Sales & Logistics
            </h3>
            <ul className="space-y-1">
              {filteredSales.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </ul>
          </div>
        )}

        {/* Group 3: Inventory */}
        {filteredInventory.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-3 mb-4">
              <h3 className="text-[10px] font-extrabold text-gray-400/80 uppercase tracking-[0.15em]">
                Inventory
              </h3>
            </div>
            <ul className="space-y-1">
              {filteredInventory.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </ul>
            
            <div className="mt-6 mb-4 px-3 border-t border-gray-100 pt-4">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Product Categories
              </h3>
            </div>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <NavItem
                  key={cat.id}
                  item={{
                    icon: cat.icon,
                    label: cat.label,
                    path: `/products?category=${cat.slug}`,
                    slug: cat.slug
                  }}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Group 4: Management */}
        {filteredManagement.length > 0 && (
          <div>
            <h3 className="px-3 text-[10px] font-extrabold text-gray-400/80 uppercase tracking-[0.15em] mb-4">
              Management
            </h3>
            <ul className="space-y-1">
              {filteredManagement.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-50 flex flex-col items-center">
        <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-xs font-medium">System Version 1.3.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
