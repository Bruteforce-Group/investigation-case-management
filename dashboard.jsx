// Dashboard UI mockup for Investigation Case Management Web Application
// Using Next.js and Tailwind CSS

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Search, 
  Plus, 
  Folder, 
  FileText, 
  Calendar, 
  Users, 
  MapPin, 
  Activity, 
  Settings, 
  Bell, 
  User,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {sidebarOpen ? (
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Investigation CM</h1>
              ) : (
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">ICM</h1>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronDown className={`h-5 w-5 text-gray-500 transform ${sidebarOpen ? '' : 'rotate-90'}`} />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100">
              <div className="mr-3 text-indigo-500 dark:text-indigo-400">
                <Folder className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Cases</span>}
            </a>
            
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <div className="mr-3 text-gray-400 dark:text-gray-500">
                <FileText className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Evidence</span>}
            </a>
            
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <div className="mr-3 text-gray-400 dark:text-gray-500">
                <Calendar className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Timeline</span>}
            </a>
            
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <div className="mr-3 text-gray-400 dark:text-gray-500">
                <Users className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Persons</span>}
            </a>
            
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <div className="mr-3 text-gray-400 dark:text-gray-500">
                <MapPin className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Locations</span>}
            </a>
            
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <div className="mr-3 text-gray-400 dark:text-gray-500">
                <Activity className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Analysis</span>}
            </a>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <div className="mr-3 text-gray-400 dark:text-gray-500">
                <Settings className="w-5 h-5" />
              </div>
              {sidebarOpen && <span>Settings</span>}
            </a>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center flex-1">
                <div className="max-w-xs w-full">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm"
                      placeholder="Search cases, evidence, persons..."
                      type="search"
                    />
                  </div>
                </div>
              </div>
              
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                </button>
                
                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs bg-gray-100 dark:bg-gray-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Cases
            </h3>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Case
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative inline-flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Closed</option>
                <option>Archived</option>
              </select>
            </div>
            
            <div className="relative inline-flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
              >
                <option>All Priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            <div className="relative inline-flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
              >
                <option>All Dates</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
            </div>
          </div>
          
          {/* Cases list */}
          <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Case 1 */}
              <li>
                <a href="#" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Folder className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            #2023-0142
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Financial Fraud Investigation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Critical
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          5 persons of interest
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                          <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          24 evidence items
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <p>
                          Started on <time dateTime="2023-01-15">Jan 15, 2023</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              
              {/* Case 2 */}
              <li>
                <a href="#" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Folder className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            #2023-0138
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Corporate Espionage Case
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          High
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          3 persons of interest
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                          <Fi
(Content truncated due to size limit. Use line ranges to read in chunks)