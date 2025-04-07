// Timeline Visualization UI mockup for Investigation Case Management Web Application
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
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronsLeft,
  ChevronsRight,
  List,
  Grid
} from 'lucide-react';

export default function TimelineVisualization() {
  const [viewMode, setViewMode] = useState('timeline');
  const [zoomLevel, setZoomLevel] = useState(3); // 1-5 scale
  const [filterOpen, setFilterOpen] = useState(false);
  
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
                  Back to Case
                </a>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timeline: Financial Fraud Investigation</h1>
              </div>
            </div>
          </div>
          
          {/* Timeline controls */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
              {/* Left controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setViewMode('timeline')}
                  >
                    <List className={`h-5 w-5 ${viewMode === 'timeline' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  </button>
                  <button 
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className={`h-5 w-5 ${viewMode === 'grid' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  </button>
                </div>
                
                <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
                    disabled={zoomLevel === 1}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <div className="text-sm text-gray-700 dark:text-gray-300 w-24 text-center">
                    Zoom: {zoomLevel}/5
                  </div>
                  <button 
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setZoomLevel(Math.min(5, zoomLevel + 1))}
                    disabled={zoomLevel === 5}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Jan 2022 - Dec 2022
                  </div>
                  <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                    <ChevronDown className="h-5 w-5 transform rotate-270" />
                  </button>
                  <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Right controls */}
              <div className="flex items-center space-x-4">
                <button 
                  className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Filter
                </button>
                
                <button className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Event
                </button>
              </div>
            </div>
            
            {/* Filters panel */}
            {filterOpen && (
              <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Event Type
                    </label>
                    <select
                      id="event-type"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>All Types</option>
                      <option>Financial Transaction</option>
                      <option>Communication</option>
                      <option>Meeting</option>
                      <option>Travel</option>
                      <option>Document Creation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="person" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Person
                    </label>
                    <select
                      id="person"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>All Persons</option>
                      <option>Michael Williams (CFO)</option>
                      <option>Sarah Thompson (Controller)</option>
                      <option>David Chen (VP International)</option>
                      <option>Lisa Rodriguez (Accountant)</option>
                      <option>James Wilson (External Consultant)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="importance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Importance
                    </label>
                    <select
                      id="importance"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>All Levels</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 mr-3"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Timeline visualization */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {viewMode === 'timeline' ? (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                {/* Timeline header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex">
                  <div className="w-48 font-medium text-gray-500 dark:text-gray-400">Date</div>
                  <div className="flex-1 font-medium text-gray-500 dark:text-gray-400">Event</div>
                  <div className="w-48 font-medium text-gray-500 dark:text-gray-400">Persons</div>
                  <div className="w-32 font-medium text-gray-500 dark:text-gray-400">Evidence</div>
                </div>
                
                {/* Timeline body */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Month header */}
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">September 2022</h3>
                  </div>
                  
                  {/* Event 1 */}
                  <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-start">
                    <div className="w-48 text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">Sep 15, 2022</div>
                      <div className="text-gray-500 dark:text-gray-400">09:45 AM</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-600 mr-2"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Initial fund transfer to offshore account</span>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Critical
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        First transfer of $150,000 to Cayman Islands account #CH-7523. Transaction initiated by CFO Michael Williams and approved by Controller Sarah Thompson.
                      </p>
                    </div>
                    <div className="w-48">
                      <div className="flex -space-x-2 overflow-hidden">
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-300">
                          MW
                        </div>
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xs font-medium text-purple-600 dark:text-purple-300">
                          ST
                        </div>
                      </div>
                    </div>
                    <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>2 items</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event 2 */}
                  <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-start">
                    <div className="w-48 text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">Sep 18, 2022</div>
                      <div className="text-gray-500 dark:text-gray-400">02:30 PM</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Email exchange regarding "special accounting"</span>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          High
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Email thread between CFO Michael Williams and Controller Sarah Thompson discussing "special accounting procedures" for international subsidiaries.
                      </p>
                    </div>
                    <div className="w-48">
                      <div classN
(Content truncated due to size limit. Use line ranges to read in chunks)