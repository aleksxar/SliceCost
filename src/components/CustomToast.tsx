import React from 'react';
import { X } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border max-w-sm ${
        type === 'success' 
          ? 'bg-[#1c1c1c] border-[#6c6c6c] text-[#f9fafb]' 
          : 'bg-[#1c1c1c] border-[#6c6c6c] text-[#f9fafb]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-[#f9fafb] hover:text-[#f9fafb] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
