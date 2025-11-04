import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, ArrowRightLeft, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: CalendarDays },
    { to: '/marketplace', label: 'Marketplace', icon: ArrowRightLeft },
    { to: '/requests', label: 'Requests', icon: Bell }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-2">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SlotSwapper</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to} className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="bg-teal-100 text-teal-700 rounded-full h-8 w-8 flex items-center justify-center font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;