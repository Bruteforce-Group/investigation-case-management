// Analysis View UI mockup for Investigation Case Management Web Application
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
  Brain,
  RefreshCw,
  Zap,
  BarChart2,
  PieChart,
  Network,
  FileQuestion,
  Lightbulb
} from 'lucide-react';

export default function AnalysisView() {
  const [activeTab, setActiveTab] = useState('storyline');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };
  
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis: Financial Fraud Investigation</h1>
              </div>
            </div>
          </div>
          
          {/* Analysis tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`${
                    activeTab === 'storyline'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('storyline')}
                >
                  Storyline Analysis
                </button>
                <button
                  className={`${
                    activeTab === 'relationships'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('relationships')}
                >
                  Relationship Network
                </button>
                <button
                  className={`${
                    activeTab === 'insights'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('insights')}
                >
                  AI Insights
                </button>
                <button
                  className={`${
                    activeTab === 'questions'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('questions')}
                >
                  Open Questions
                </button>
              </nav>
            </div>
          </div>
          
          {/* Analysis content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Storyline Analysis Tab */}
            {activeTab === 'storyline' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Dynamic Storyline Analysis</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      AI-generated narrative based on all available evidence and timeline events
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                      Last updated: 10 minutes ago
                    </span>
                    <button 
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isGenerating 
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
                      }`}
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Regenerate Analysis
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Storyline content */}
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <h3>Executive Summary</h3>
                      <p>
                        Based on the collected evidence, this case involves a sophisticated financial fraud scheme orchestrated primarily by CFO Michael Williams and Controller Sarah Thompson at XYZ Corporation. The scheme appears to have begun in September 2022 and involved the diversion of company funds to offshore accounts, manipulation of financial statements, and deliberate concealment of transactions from standard accounting practices.
                      </p>
                      
                      <h3>Key Narrative Elements</h3>
                      <h4>Phase 1: Initiation (September 2022)</h4>
                      <p>
                        The scheme began with an initial transfer of $150,000 to Cayman Islands account #CH-7523 on September 15, 2022. This transfer was initiated by CFO Michael Williams and approved by Controller Sarah Thompson. Three days later, on September 18, Williams and Thompson exchanged emails discussing "special accounting procedures" for international subsidiaries, which appears to be coded language for their fraudulent activities.
                      </p>
                      <p>
                        On September 22, Williams met with VP International David Chen and external consultant James Wilson at an off-site location. No meeting minutes were recorded, but photographic evidence confirms this meeting took place. This meeting likely served to expand the scheme to include international operations, potentially using the recent acquisition of a foreign subsidiary as cover.
                      </p>
                      <p>
                        A second transfer of $300,000 to the same Cayman Islands account occurred on September 28, initiated by Thompson. The total diverted in this initial phase was $450,000.
                      </p>
                      
                      <h4>Phase 2: Cover-up (October 2022)</h4>
                      <p>
                        On October 5, Thompson made significant modifications to Q3 financial statements, particularly regarding international subsidiary revenue reporting. This appears to be an attempt to conceal the diverted funds by manipulating reported revenues.
                      </p>
                      <p>
                        A recorded phone call between Williams and Thompson on October 12 reveals explicit discussion of "cleaning up" financial records before the external audit, creating backdated invoices for "consulting services," and concern about a potential whistleblower in the accounting department.
                      </p>
                      
                      <h4>Phase 3: Discovery (January 2023)</h4>
                      <p>
                        On January 10, 2023, an anonymous whistleblower (likely from the accounting department) submitted a statement detailing allegations of financial fraud at XYZ Corporation, triggering the current investigation.
                      </p>
                      
                      <h3>Alternative Scenarios</h3>
                      <p>
                        While the primary narrative strongly suggests deliberate fraud, two alternative scenarios warrant consideration:
                      </p>
                      <ol>
                        <li>
                          <strong>Legitimate Business Operations:</strong> The transfers could represent legitimate payments for consulting services related to the international acquisition, with poor documentation rather than fraudulent intent. However, the recorded phone call discussing "cleaning up" records and creating backdated invoices significantly undermines this interpretation.
                        </li>
                        <li>
                          <strong>Limited Conspiracy:</strong> Williams may have manipulated Thompson, who might have believed she was following legitimate, if unusual, accounting practices. Her level of awareness and willing participation requires further investigation.
                        </li>
                      </ol>
                      
                      <h3>Confidence Assessment</h3>
                      <p>
                        Based on the current evidence, there is a <strong>high confidence (85-90%)</strong> that financial fraud occurred. The recorded phone call and bank statements provide particularly strong evidence. The primary area of uncertainty is the extent of involvement of other executives, particularly VP International David Chen, whose role appears peripheral but may be more significant.
                      </p>
                      
                      <h3>Gaps and Recommendations</h3>
                      <p>
                        Key information gaps that should be addressed:
                      </p>
                      <ul>
                        <li>Destination of funds after reaching the Cayman Islands account</li>
                        <li>Identity of the account beneficial owner (Global Strategic Partners Ltd.)</li>
                        <li>Complete email correspondence between all involved parties</li>
                        <li>Financial records from the international subsidiary</li>
                        <li>Interview statements from accounting department staff</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Relationship Network Tab */}
            {activeTab === 'relationships' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Relationship Network Analysis</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Visual representation of connections between people, events, and evidence
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                        <Plus className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                        <ChevronDown className="h-5 w-5 transform -rotate-90" />
                      </button>
                    </div>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
                
                {/* Network visualization */}
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {/* This would be a real network visualization in the actual app */}
                    <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Network className="h-16 w-16 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Network visualization would appear here
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                          Showing connections between 5 people, 8 events, and 12 evidence items
                        </p>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">People</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-300 mr-2">
                              MW
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Michael Williams (CFO)</span>
 
(Content truncated due to size limit. Use line ranges to read in chunks)