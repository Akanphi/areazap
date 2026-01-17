'use client';

import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AlertPopProps } from '@/types/api';

const AlertPop = ({ message, onClose, isVisible, autoHideDuration = 2000 }: AlertPopProps) => {
  
  // This handles the "Auto Hide" logic
  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3 w-80 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 shadow-lg">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />

        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        
        <button 
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-red-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertPop;