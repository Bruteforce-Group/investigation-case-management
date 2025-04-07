'use client';

import React from 'react';
import { ExclamationTriangle } from 'lucide-react';

interface ApiErrorProps {
  error: Error | { message: string; code?: string; details?: string[] } | null;
  onRetry?: () => void;
  className?: string;
}

const ApiError: React.FC<ApiErrorProps> = ({ error, onRetry, className = '' }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'object' && 'message' in error ? error.message : 'An unexpected error occurred';
  const errorCode = typeof error === 'object' && 'code' in error ? error.code : undefined;
  const errorDetails = typeof error === 'object' && 'details' in error ? error.details : undefined;

  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
            {errorCode && (
              <p className="mt-1">
                <span className="font-semibold">Code:</span> {errorCode}
              </p>
            )}
            {errorDetails && errorDetails.length > 0 && (
              <ul className="mt-1 list-disc list-inside">
                {errorDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiError;
