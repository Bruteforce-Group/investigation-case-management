'use client';

import React, { useState, useEffect } from 'react';
import { File, Image, FileAudio, FileVideo, FileText, Upload, Search, Filter, Tag, Trash2, Edit, Eye, Link } from 'lucide-react';

interface EvidenceItemProps {
  evidence: any;
  onSelect: (evidence: any) => void;
  isSelected: boolean;
}

const EvidenceItem: React.FC<EvidenceItemProps> = ({ evidence, onSelect, isSelected }) => {
  // Get icon based on evidence type
  const getEvidenceIcon = () => {
    switch (evidence.evidenceType) {
      case 'DOCUMENT':
        return <FileText className="text-blue-500" />;
      case 'IMAGE':
        return <Image className="text-green-500" />;
      case 'AUDIO':
        return <FileAudio className="text-purple-500" />;
      case 'VIDEO':
        return <FileVideo className="text-red-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  // Format date for display
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`border rounded-md p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(evidence)}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {getEvidenceIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{evidence.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Added: {formatDate(evidence.uploadedAt)}
          </p>
          {evidence.tags && evidence.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {evidence.tags.map((tag: any) => (
                <span 
                  key={tag.id} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                  style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined, color: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {evidence.description && (
        <p className="mt-2 text-xs text-gray-600 line-clamp-2">{evidence.description}</p>
      )}
    </div>
  );
};

interface EvidenceDetailProps {
  evidence: any;
  onClose: () => void;
  onEdit?: (evidence: any) => void;
  onDelete?: (evidence: any) => void;
  onAnalyze?: (evidence: any) => void;
}

const EvidenceDetail: React.FC<EvidenceDetailProps> = ({ 
  evidence, 
  onClose,
  onEdit,
  onDelete,
  onAnalyze
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ocr' | 'analysis' | 'relations'>('details');

  // Format date for display
  const formatDate = (date: string | Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white truncate">{evidence.title}</h3>
        <div className="flex space-x-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(evidence)}
              className="p-1 rounded-full text-indigo-100 hover:bg-indigo-500 hover:text-white"
              title="Edit Evidence"
            >
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(evidence)}
              className="p-1 rounded-full text-indigo-100 hover:bg-indigo-500 hover:text-white"
              title="Delete Evidence"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-indigo-100 hover:bg-indigo-500 hover:text-white"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          {evidence.ocrText && (
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'ocr'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('ocr')}
            >
              OCR Text
            </button>
          )}
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'relations'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('relations')}
          >
            Relations
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'analysis'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
        </nav>
      </div>
      
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {evidence.fileUrl && (
              <div className="mb-4">
                {evidence.evidenceType === 'IMAGE' ? (
                  <img 
                    src={evidence.fileUrl} 
                    alt={evidence.title} 
                    className="max-w-full h-auto rounded-md"
                  />
                ) : evidence.evidenceType === 'DOCUMENT' ? (
                  <div className="flex justify-center">
                    <a 
                      href={evidence.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Document
                    </a>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <a 
                      href={evidence.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View File
                    </a>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
              <p className="mt-1 text-sm text-gray-600">{evidence.description || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Evidence Type</h4>
                <p className="mt-1 text-sm text-gray-600">{evidence.evidenceType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Collection Date</h4>
                <p className="mt-1 text-sm text-gray-600">{formatDate(evidence.collectionDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Collection Location</h4>
                <p className="mt-1 text-sm text-gray-600">{evidence.collectionLocation || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Uploaded By</h4>
                <p className="mt-1 text-sm text-gray-600">{evidence.uploadedBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Upload Date</h4>
                <p className="mt-1 text-sm text-gray-600">{formatDate(evidence.uploadedAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Last Modified</h4>
                <p className="mt-1 text-sm text-gray-600">{formatDate(evidence.modifiedAt)}</p>
              </div>
            </div>
            
            {evidence.tags && evidence.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Tags</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {evidence.tags.map((tag: any) => (
                    <span 
                      key={tag.id} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined, color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {evidence.metadataJson && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Additional Metadata</h4>
                <pre className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(evidence.metadataJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'ocr' && evidence.ocrText && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Extracted Text</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
              {evidence.ocrText}
            </div>
          </div>
        )}
        
        {activeTab === 'relations' && (
          <div className="space-y-4">
            {evidence.timelineEvents && evidence.timelineEvents.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Timeline Events</h4>
                <ul className="divide-y divide-gray-200">
                  {evidence.timelineEvents.map((item: any) => (
                    <li key={item.id} className="py-2">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.timelineEvent.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.timelineEvent.eventDate)}
                          </p>
                        </div>
                        {item.relationship && (
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.relationship}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {evidence.persons && evidence.persons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Related Persons</h4>
                <ul className="divide-y divide-gray-200">
                  {evidence.persons.map((item: any) => (
                    <li key={item.id} className="py-2">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.person.firstName} {item.person.lastName}
                            {item.person.alias && ` (${item.person.alias})`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.person.role || 'No role specified'}
                          </p>
                        </div>
                        {item.relationship && (
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.relationship}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {evidence.locations && evidence.locations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Related Locations</h4>
                <ul className="divide-y divide-gray-200">
                  {evidence.locations.map((item: any) => (
                    <li key={item.id} className="py-2">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.location.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {[
                              item.location.address,
                              item.location.city,
                              item.location.state,
                              item.location.country
                            ].filter(Boolean).join(', ')}
                          </p>
                        </div>
                        {item.relationship && (
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.relationship}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
              
(Content truncated due to size limit. Use line ranges to read in chunks)