import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown, Moon, Sun } from 'lucide-react';
import XpressLogo from "../../assets/Xpress-Autozone-Logo.png";
import { useAuth } from '../../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileModal from '../ProfileModal/ProfileModal';
import { ROLE_CONFIG } from '../../config/roles';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'));
  });
  const { currentUser, logout } = useAuth();
  const { token, user: reduxUser } = useSelector((state) => state.auth);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const userRole = reduxUser?.role || 'customer';
  const roleInfo = ROLE_CONFIG[userRole] || ROLE_CONFIG.customer;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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



          {/* User Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-yellow-300 bg-opacity-20 hover:bg-opacity-40 rounded-lg text-gray-800 transition-all duration-200"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 bg-yellow-300 bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden border border-yellow-500 shadow-sm">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
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
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${roleInfo.color.replace('bg-', 'bg-opacity-50 bg-')}`}>
                      {roleInfo.icon} {roleInfo.label}
                    </span>
                  </div>
                </div>
                
                <ChevronDown className={`h-4 w-4 text-gray-700 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold shadow-inner overflow-hidden border-2 border-white">
                        {currentUser?.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getUserInitials(currentUser?.email)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {currentUser?.displayName || 'User'}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {currentUser?.email}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${roleInfo.color}`}>
                            {roleInfo.icon} {roleInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors flex items-center space-x-3 group"
                    >
                      <User className="h-4 w-4 text-gray-400 group-hover:text-yellow-600" />
                      <span className="font-medium">Profile Settings</span>
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
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="text-gray-800 p-2 hover:bg-yellow-300 rounded-lg"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
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
                <button 
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-3 text-gray-700 hover:bg-yellow-200 rounded-xl flex items-center space-x-3 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-bold">Profile Settings</span>
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

      {/* Profile Settings Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentUser={currentUser}
        token={token}
      />
    </nav>
  );
};

export default Navbar;