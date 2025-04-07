// Case Detail UI mockup for Investigation Case Management Web Application
// Using Next.js and Tailwind CSS

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronLeft,
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
  Filter,
  Edit,
  Trash2,
  Share2,
  Download,
  MessageSquare,
  Link,
  Tag,
  Eye
} from 'lucide-react';

export default function CaseDetail() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar would be here - omitted for brevity */}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation would be here - omitted for brevity */}
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {/* Case header */}
          <div className="bg-white dark:bg-gray-800 shadow">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center">
                <a href="#" className="inline-flex items-center mr-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back to Cases
                </a>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Fraud Investigation</h1>
                <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Critical
                </span>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Folder className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Case #2023-0142
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Opened on Jan 15, 2023
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Lead: John Doe
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex px-4 sm:px-6 lg:px-8 space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`${
                    activeTab === 'evidence'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Evidence
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`${
                    activeTab === 'timeline'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('persons')}
                  className={`${
                    activeTab === 'persons'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Persons
                </button>
                <button
                  onClick={() => setActiveTab('locations')}
                  className={`${
                    activeTab === 'locations'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Locations
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`${
                    activeTab === 'analysis'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Analysis
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Case details */}
                  <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          Case Details
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                          Key information about this investigation
                        </p>
                      </div>
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Case Number
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            2023-0142
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </span>
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Priority
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Critical
                            </span>
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Start Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            January 15, 2023
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Description
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            Investigation into alleged financial fraud at XYZ Corporation involving misappropriation of funds, falsified financial statements, and potential insider trading.
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Tags
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Financial Fraud
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                Corporate
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Insider Trading
                              </span>
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  {/* Case team */}
                  <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          Case Team
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                          Investigators assigned to this case
                        </p>
                      </div>
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li>
                          <div className="px-4 py-4 flex items-center sm:px-6">
                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                              <div>
                                <div className="flex text-sm">
                                  <p className="font-medium text-indigo-600 dark:text-indigo-400 truncate">John Doe</p>
                                  <p className="ml-1 flex-shrink-0 font-normal text-gray-500 dark:text-gray-400">
                                    (Lead Investigator)
                                  </p>
                                </div>
                                <div className="mt-2 flex">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    john.doe@example.com
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-5 flex-shrink-0">
                              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                                <MessageSquare className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="px-4 py-4 flex items-center sm:px-6">
                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                              <div>
                                <div className="flex text-sm">
                                  <p className="font-medium text-indigo-600 dark:text-indigo-400 truncate">Jane Smith</p>
                                  <p className="ml-1 flex-shrink-0 font-normal text-gray-500 dark:text-gray-400">
                                    (Financial Analyst)
                                  </p>
                                </div>
                                <div className="mt-2 flex">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    jane.smith@example.com
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-5 flex-shrink-0">
                              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                                <MessageSquare className="h-5 w-5" />
    
(Content truncated due to size limit. Use line ranges to read in chunks)