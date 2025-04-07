'use client';

import React, { useState, useEffect } from 'react';
import { analyzeRelationships } from '@/lib/db/claude';
import { Users, Network, RefreshCw, Download, Share2, AlertTriangle } from 'lucide-react';

interface RelationshipAnalysisProps {
  caseId: string;
  persons: any[];
  relationships: any[];
  onAnalysisComplete?: (analysis: string) => void;
}

const RelationshipAnalysis: React.FC<RelationshipAnalysisProps> = ({
  caseId,
  persons,
  relationships,
  onAnalysisComplete
}) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  const performAnalysis = async () => {
    if (!persons || persons.length === 0) {
      setError('No persons available for relationship analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeRelationships(persons, relationships);
      setAnalysis(result);
      setLastAnalyzed(new Date());
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Error analyzing relationships:', err);
      setError('Failed to analyze relationships. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Relationship Analysis</h2>
        <button
          onClick={performAnalysis}
          disabled={isAnalyzing}
          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Regenerate'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {lastAnalyzed && !isAnalyzing && (
        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
          Last analyzed: {lastAnalyzed.toLocaleString()}
        </div>
      )}

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Analyzing relationships between persons...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment as we analyze all connections and relationships.</p>
        </div>
      ) : analysis ? (
        <div>
          <div className="p-4 prose max-w-none">
            <div className="whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Network className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No relationship analysis yet</h3>
          <p className="text-gray-500 max-w-md mb-6">
            Generate an analysis of the relationships between persons in this case to identify key connections and networks.
          </p>
          <button
            onClick={performAnalysis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Relationship Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default RelationshipAnalysis;
