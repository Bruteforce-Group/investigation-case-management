'use client';

import React, { useState, useEffect } from 'react';
import { generateStorylineAnalysis } from '@/lib/db/claude';
import { FileText, AlertTriangle, CheckCircle, RefreshCw, Download, Share2 } from 'lucide-react';

interface StorylineAnalysisProps {
  caseId: string;
  caseData: any;
  onAnalysisComplete?: (analysis: string) => void;
}

const StorylineAnalysis: React.FC<StorylineAnalysisProps> = ({
  caseId,
  caseData,
  onAnalysisComplete
}) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState<string>('narrative');

  useEffect(() => {
    // If there's already an analysis in the case data, use it
    if (caseData.storylineAnalysis && caseData.storylineAnalysis.content) {
      setAnalysis(caseData.storylineAnalysis.content);
      setLastAnalyzed(new Date(caseData.storylineAnalysis.updatedAt));
    }
  }, [caseData]);

  const performAnalysis = async () => {
    if (!caseData) {
      setError('No case data available for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await generateStorylineAnalysis(caseData);
      setAnalysis(result);
      setLastAnalyzed(new Date());
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Error generating storyline analysis:', err);
      setError('Failed to generate storyline analysis. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Parse analysis sections
  const parseAnalysisSections = () => {
    if (!analysis) return {};
    
    const sections: Record<string, string> = {
      narrative: '',
      findings: '',
      motives: '',
      alternatives: '',
      gaps: '',
      confidence: ''
    };
    
    // Simple parsing logic - in a real app, you'd want more robust parsing
    let currentSection = 'narrative';
    
    const lines = analysis.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('key findings') || line.toLowerCase().includes('findings and insights')) {
        currentSection = 'findings';
        sections[currentSection] += line + '\n';
      } else if (line.toLowerCase().includes('potential motives') || line.toLowerCase().includes('motives or explanations')) {
        currentSection = 'motives';
        sections[currentSection] += line + '\n';
      } else if (line.toLowerCase().includes('alternative scenarios') || line.toLowerCase().includes('alternative explanations')) {
        currentSection = 'alternatives';
        sections[currentSection] += line + '\n';
      } else if (line.toLowerCase().includes('gaps') || line.toLowerCase().includes('further investigation')) {
        currentSection = 'gaps';
        sections[currentSection] += line + '\n';
      } else if (line.toLowerCase().includes('confidence') || line.toLowerCase().includes('assessment')) {
        currentSection = 'confidence';
        sections[currentSection] += line + '\n';
      } else {
        sections[currentSection] += line + '\n';
      }
    }
    
    return sections;
  };

  const sections = parseAnalysisSections();

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Storyline Analysis</h2>
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
          <p className="text-gray-600">Generating comprehensive storyline analysis...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a minute as we analyze all evidence and timeline events.</p>
        </div>
      ) : analysis ? (
        <div>
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveSection('narrative')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                  activeSection === 'narrative'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Narrative
              </button>
              <button
                onClick={() => setActiveSection('findings')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                  activeSection === 'findings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Key Findings
              </button>
              <button
                onClick={() => setActiveSection('motives')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                  activeSection === 'motives'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Motives
              </button>
              <button
                onClick={() => setActiveSection('alternatives')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                  activeSection === 'alternatives'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alternatives
              </button>
              <button
                onClick={() => setActiveSection('gaps')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                  activeSection === 'gaps'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gaps
              </button>
              <button
                onClick={() => setActiveSection('confidence')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                  activeSection === 'confidence'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Confidence
              </button>
            </nav>
          </div>
          
          <div className="p-4 prose max-w-none">
            <div className="whitespace-pre-wrap">
              {sections[activeSection] || 'No content available for this section.'}
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
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No storyline analysis yet</h3>
          <p className="text-gray-500 max-w-md mb-6">
            Generate a comprehensive analysis of this case based on all evidence, timeline events, and relationships.
          </p>
          <button
            onClick={performAnalysis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Storyline Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default StorylineAnalysis;
