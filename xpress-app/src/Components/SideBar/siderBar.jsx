import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const coreMenu = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/overview'
    },
    {
      icon: Package,
      label: 'Total Inventory',
      path: '/products'
    },
    {
      icon: User,
      label: 'Vendors',
      path: '/vendors'
    }
  ];

  const adminMenu = [
    {
      icon: Shield,
      label: 'Admin Roles',
      path: '/admin-roles'
    }
  ];

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

  return (
    <div className="w-64 bg-white h-screen shadow-xl border-r border-gray-100 flex flex-col pt-24 sticky top-0 overflow-y-auto thin-scrollbar">
      <nav className="flex-1 px-4 space-y-8">
        {/* Group 1: Core */}
        <div>
          <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Dashboard & Core
          </h3>
          <ul className="space-y-1">
            {coreMenu.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
        </div>

        {/* Group 2: Categories */}
        <div>
          <div className="flex items-center justify-between px-3 mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Product Categories
            </h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-bold">8</span>
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

        {/* Group 3: Admin */}
        <div>
          <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Management
          </h3>
          <ul className="space-y-1">
            {adminMenu.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-50 flex flex-col items-center">
        <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-xs font-medium">System Version 1.2.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
