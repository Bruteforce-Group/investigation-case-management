'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          containerClass: 'bg-green-50 border-green-400 text-green-800',
          iconClass: 'text-green-400',
          icon: <CheckCircle className="h-5 w-5" />,
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 border-red-400 text-red-800',
          iconClass: 'text-red-400',
          icon: <AlertCircle className="h-5 w-5" />,
        };
      case 'warning':
        return {
          containerClass: 'bg-yellow-50 border-yellow-400 text-yellow-800',
          iconClass: 'text-yellow-400',
          icon: <AlertCircle className="h-5 w-5" />,
        };
      case 'info':
      default:
        return {
          containerClass: 'bg-blue-50 border-blue-400 text-blue-800',
          iconClass: 'text-blue-400',
          icon: <Info className="h-5 w-5" />,
        };
    }
  };

  const { containerClass, iconClass, icon } = getAlertStyles();

  return (
    <div className={`border-l-4 p-4 ${containerClass} ${className}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconClass}`}>{icon}</div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'success'
                    ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
                    : type === 'error'
                    ? 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
                    : type === 'warning'
                    ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50'
                    : 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
