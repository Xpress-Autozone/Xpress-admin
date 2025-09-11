import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Car, 
  Zap, 
  Circle, 
  Disc, 
  Wrench,
  Armchair,
  Sparkles,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/home/overview'
    },
    {
      icon: Settings,
      label: 'Engine Parts',
      path: '/home/engine-parts'
    },
    {
      icon: Car,
      label: 'Suspension & Steering',
      path: '/home/suspension-steering'
    },
    {
      icon: Zap,
      label: 'Electrical Components',
      path: '/home/electrical-components'
    },
    {
      icon: Circle,
      label: 'Tires & Wheels',
      path: '/home/tires-wheels'
    },
    {
      icon: Disc,
      label: 'Brakes',
      path: '/home/brakes'
    },
    {
      icon: Wrench,
      label: 'Exhaust Systems',
      path: '/home/exhaust-systems'
    },
    {
      icon: Armchair,
      label: 'Interior Accessories',
      path: '/home/interior-accessories'
    },
    {
      icon: Sparkles,
      label: 'Exterior Accessories',
      path: '/home/exterior-accessories'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header Section with Logo Space */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Logo placeholder - replace with your actual logo */}
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Auto Parts</h1>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-4">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-600 border-l-4 border-red-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent 
                    className={`w-5 h-5 ${
                      isActive ? 'text-red-500' : 'text-gray-500'
                    }`} 
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;