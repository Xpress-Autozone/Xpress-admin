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
  LogOut,
  User,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/overview'
    },
    {
      icon: Settings,
      label: 'Engine Parts',
      path: '/engine-parts'
    },
    {
      icon: Car,
      label: 'Suspension & Steering',
      path: '/suspension-steering'
    },
    {
      icon: Zap,
      label: 'Electrical Components',
      path: '/electrical-components'
    },
    {
      icon: Circle,
      label: 'Tires & Wheels',
      path: '/tires-wheels'
    },
    {
      icon: Disc,
      label: 'Brakes',
      path: '/brakes'
    },
    {
      icon: Wrench,
      label: 'Exhaust Systems',
      path: '/exhaust-systems'
    },
    {
      icon: Armchair,
      label: 'Interior Accessories',
      path: '/interior-accessories'
    },
    {
      icon: Sparkles,
      label: 'Exterior Accessories',
      path: '/exterior-accessories'
    },
    {
      icon: User,
      label: 'Vendors',
      path: '/vendors'
    },
    {
      icon: Shield,
      label: 'Admin Roles',
      path: '/admin-roles'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };


  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r border-gray-200 flex flex-col pt-20">
      {/* Navigation Menu */}
      <nav className="flex-1 py-3">
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
                      ? 'bg-yellow-50 text-yellow-600 border-l-4 border-yellow-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent 
                    className={`w-5 h-5 ${
                      isActive ? 'text-yellow-500' : 'text-gray-500'
                    }`} 
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className='items-center justify-center flex mb-4'>
        <span className='text-gray-400'> v.1.0.0</span>
      </div>
    </div>
  );
};

export default Sidebar;