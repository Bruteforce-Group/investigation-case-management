'use client';

import React, { useState, useEffect } from 'react';
import { analyzeTimeline } from '@/lib/db/claude';

interface TimelineAnalysisProps {
  timelineEvents: any[];
  caseId: string;
  onAnalysisComplete?: (analysis: string) => void;
}

const TimelineAnalysis: React.FC<TimelineAnalysisProps> = ({
  timelineEvents,
  caseId,
  onAnalysisComplete
}) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = async () => {
    if (!timelineEvents || timelineEvents.length === 0) {
      setError('No timeline events available for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeTimeline(timelineEvents);
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Error analyzing timeline:', err);
      setError('Failed to analyze timeline. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Timeline Analysis</h2>
        <button
          onClick={performAnalysis}
          disabled={isAnalyzing || timelineEvents.length === 0}
          className={`px-4 py-2 rounded-md ${
            isAnalyzing || timelineEvents.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Timeline'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{analysis}</div>
        </div>
      )}

      {!analysis && !isAnalyzing && !error && (
        <div className="text-center p-8 text-gray-500">
          <p>Click "Analyze Timeline" to generate an AI-powered analysis of the timeline events.</p>
          <p className="text-sm mt-2">The analysis will identify patterns, gaps, and suggest potential connections between events.</p>
        </div>
      )}
    </div>
  );
};

export default TimelineAnalysis;
