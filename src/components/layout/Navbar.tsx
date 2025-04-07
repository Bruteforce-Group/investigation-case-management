'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut, User, Settings, Home } from 'lucide-react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-lg">Investigation CM</span>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="text-white hover:bg-indigo-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  <Home className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/cases"
                  className="text-indigo-200 hover:bg-indigo-700 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Cases
                </Link>
                <Link
                  href="/evidence"
                  className="text-indigo-200 hover:bg-indigo-700 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Evidence
                </Link>
                <Link
                  href="/timeline"
                  className="text-indigo-200 hover:bg-indigo-700 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Timeline
                </Link>
                <Link
                  href="/analysis"
                  className="text-indigo-200 hover:bg-indigo-700 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Analysis
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated && user ? (
              <div className="ml-3 relative flex items-center">
                <div className="text-indigo-200 mr-4">
                  <span className="text-sm">
                    {user.name} ({user.role})
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href="/profile"
                    className="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                  >
                    <span className="sr-only">View profile</span>
                    <User className="h-6 w-6" />
                  </Link>
                  <Link
                    href="/settings"
                    className="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                  >
                    <span className="sr-only">Settings</span>
                    <Settings className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                  >
                    <span className="sr-only">Sign out</span>
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-indigo-200 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
