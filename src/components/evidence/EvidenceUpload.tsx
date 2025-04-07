'use client';

import React, { useState } from 'react';
import { FileUp, X, FileText, Image, FileAudio, FileVideo, Upload } from 'lucide-react';

interface EvidenceUploadProps {
  caseId: string;
  onUploadComplete?: (evidence: any) => void;
  onCancel?: () => void;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  caseId,
  onUploadComplete,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState('DOCUMENT');
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // Auto-detect evidence type based on file type
      const fileType = e.target.files[0].type;
      if (fileType.startsWith('image/')) {
        setEvidenceType('IMAGE');
      } else if (fileType.startsWith('audio/')) {
        setEvidenceType('AUDIO');
      } else if (fileType.startsWith('video/')) {
        setEvidenceType('VIDEO');
      } else if (fileType.startsWith('application/pdf') || 
                fileType.startsWith('text/') || 
                fileType.includes('document')) {
        setEvidenceType('DOCUMENT');
      } else {
        setEvidenceType('OTHER');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('evidenceType', evidenceType);
      formData.append('caseId', caseId);
      
      if (collectionDate) {
        formData.append('collectionDate', collectionDate);
      }
      
      if (collectionLocation) {
        formData.append('collectionLocation', collectionLocation);
      }
      
      if (tags) {
        formData.append('tags', tags);
      }
      
      // In a real implementation, you would send this to your API
      // const response = await fetch('/api/evidence/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to upload evidence');
      // }
      
      // const data = await response.json();
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Simulate successful upload
      const mockResponse = {
        id: `ev-${Date.now()}`,
        title,
        description,
        evidenceType,
        caseId,
        collectionDate: collectionDate || null,
        collectionLocation: collectionLocation || null,
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        tags: tags.split(',').filter(Boolean).map(tag => ({
          id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: tag.trim()
        }))
      };
      
      if (onUploadComplete) {
        onUploadComplete(mockResponse);
      }
      
    } catch (err) {
      console.error('Error uploading evidence:', err);
      setError('Failed to upload evidence. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const getEvidenceTypeIcon = () => {
    switch (evidenceType) {
      case 'DOCUMENT':
        return <FileText className="text-blue-500" />;
      case 'IMAGE':
        return <Image className="text-green-500" />;
      case 'AUDIO':
        return <FileAudio className="text-purple-500" />;
      case 'VIDEO':
        return <FileVideo className="text-red-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Upload Evidence</h3>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="p-1 rounded-full text-indigo-100 hover:bg-indigo-500 hover:text-white"
            title="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="evidenceType" className="block text-sm font-medium text-gray-700">
              Evidence Type
            </label>
            <div className="mt-1 flex items-center">
              {getEvidenceTypeIcon()}
              <select
                id="evidenceType"
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="DOCUMENT">Document</option>
                <option value="IMAGE">Image</option>
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Video</option>
                <option value="PHYSICAL">Physical (Reference)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="collectionDate" className="block text-sm font-medium text-gray-700">
                Collection Date
              </label>
              <input
                type="datetime-local"
                id="collectionDate"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="collectionLocation" className="block text-sm font-medium text-gray-700">
                Collection Location
              </label>
              <input
                type="text"
                id="collectionLocation"
                value={collectionLocation}
                onChange={(e) => setCollectionLocation(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="important, interview, suspect"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              File *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {file ? (
                  <div>
                    <p className="text-sm text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOC, MP3, MP4 up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    Uploading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isUploading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isUploading || !file
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Evidence'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvidenceUpload;
