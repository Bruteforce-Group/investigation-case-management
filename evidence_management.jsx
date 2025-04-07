// Evidence Management UI mockup for Investigation Case Management Web Application
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
  Image,
  FileAudio,
  FileVideo,
  File,
  Upload,
  Grid,
  List,
  MoreHorizontal
} from 'lucide-react';

export default function EvidenceManagement() {
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Evidence: Financial Fraud Investigation</h1>
              </div>
            </div>
          </div>
          
          {/* Evidence controls */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
              {/* Left controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className={`h-5 w-5 ${viewMode === 'grid' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  </button>
                  <button 
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setViewMode('list')}
                  >
                    <List className={`h-5 w-5 ${viewMode === 'list' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  </button>
                </div>
                
                <div className="relative flex-grow max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-3 py-2 w-full border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    placeholder="Search evidence..."
                  />
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
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Evidence
                </button>
              </div>
            </div>
            
            {/* Filters panel */}
            {filterOpen && (
              <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="evidence-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Evidence Type
                    </label>
                    <select
                      id="evidence-type"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>All Types</option>
                      <option>Document</option>
                      <option>Image</option>
                      <option>Audio</option>
                      <option>Video</option>
                      <option>Physical</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tag
                    </label>
                    <select
                      id="tag"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>All Tags</option>
                      <option>Financial Records</option>
                      <option>Emails</option>
                      <option>Statements</option>
                      <option>Photos</option>
                      <option>Key Evidence</option>
                      <option>Supporting Evidence</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="person" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Related Person
                    </label>
                    <select
                      id="person"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>Any Person</option>
                      <option>Michael Williams (CFO)</option>
                      <option>Sarah Thompson (Controller)</option>
                      <option>David Chen (VP International)</option>
                      <option>Lisa Rodriguez (Accountant)</option>
                      <option>James Wilson (External Consultant)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Range
                    </label>
                    <select
                      id="date-range"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                    >
                      <option>All Dates</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Custom range</option>
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
          
          {/* Evidence content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Evidence item 1 */}
                <div 
                  className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-2 ${selectedEvidence === 1 ? 'border-indigo-500 dark:border-indigo-400' : 'border-transparent'}`}
                  onClick={() => setSelectedEvidence(selectedEvidence === 1 ? null : 1)}
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          Bank Statement - Account #4589
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Document • Added 10 minutes ago
                        </p>
                      </div>
                      <div className="ml-2">
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        Bank statement showing suspicious transfers to offshore accounts totaling $450,000 between September 15-30, 2022.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Financial Records
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Key Evidence
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex -space-x-2 overflow-hidden">
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-300">
                          MW
                        </div>
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xs font-medium text-purple-600 dark:text-purple-300">
                          ST
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        PDF • 2.4 MB
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Evidence item 2 */}
                <div 
                  className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-2 ${selectedEvidence === 2 ? 'border-indigo-500 dark:border-indigo-400' : 'border-transparent'}`}
                  onClick={() => setSelectedEvidence(selectedEvidence === 2 ? null : 2)}
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600 dark:text-green-300" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          Email - CFO to Unknown Recipient
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Document • Added 2 days ago
                        </p>
                      </div>
                      <div className="ml-2">
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        Email from CFO Michael Williams to unknown recipient discussing "alternative reporting methods" and "keeping certain transactions off the books."
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Emails
                        </span>
                        <span className="inline
(Content truncated due to size limit. Use line ranges to read in chunks)