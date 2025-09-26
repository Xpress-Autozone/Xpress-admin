import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import XpressLogo from "../../assets/Xpress-Autozone-Logo.png";
import { useAuth } from '../../Contexts/authContext';
import { useNavigate} from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const userMenuRef = useRef(null);
    const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="bg-yellow-400 shadow-xl fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src={XpressLogo} 
                alt="Xpress Autozone Logo" 
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search parts, services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* User Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 bg-yellow-300 bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.photoURL ? (
                    <img
                      src={"https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"|| currentUser.photoURL }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(currentUser?.email)
                  )}
                </div>
                
                {/* User Info */}
                <div className="hidden lg:block text-left">
                  <div className="text-gray-800 font-semibold text-sm">
                    {currentUser?.displayName || 'User'}
                  </div>
                  <div className="text-gray-600 text-xs truncate max-w-32">
                    {currentUser?.email}
                  </div>
                </div>
                
                <ChevronDown className={`h-4 w-4 text-gray-700 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {currentUser?.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          getUserInitials(currentUser?.email)
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {currentUser?.displayName || 'User'}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {currentUser?.email}
                        </div>
                        <div className="text-gray-500 text-xs">
                          ID: {currentUser?.uid.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-3"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:text-gray-600 p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-yellow-300 border-t border-yellow-500">
            {/* Mobile Search */}
            <div className="p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search parts, services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Mobile User Profile */}
            <div className="border-t border-yellow-500 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(currentUser?.email)
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {currentUser?.displayName || 'User'}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {currentUser?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full text-left p-2 text-gray-700 hover:bg-yellow-200 rounded flex items-center space-x-3">
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full text-left p-2 text-gray-700 hover:bg-yellow-200 rounded flex items-center space-x-3">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded flex items-center space-x-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;