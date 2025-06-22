
import React, { ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string | ReactNode;
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '', onClose }) => {
  const { contrastMode } = useAppContext();

  const baseStyle = 'p-4 rounded-[var(--input-border-radius)] flex items-start shadow-md text-sm'; // Using input-border-radius
  
  const typeStyles = (cm: boolean) => ({
    success: cm 
      ? 'bg-green-700 text-green-100 border border-green-600' 
      : 'bg-green-50 text-green-700 border border-green-200',
    error: cm
      ? 'bg-red-800 text-red-100 border border-red-600' // Darker red bg for dark mode error
      : 'bg-red-50 text-red-700 border border-red-200',
    warning: cm
      ? 'bg-yellow-700 text-yellow-100 border border-yellow-500'
      : 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    info: cm
      ? 'bg-blue-700 text-blue-100 border border-blue-500' // Using theme blue
      : 'bg-blue-50 text-blue-700 border border-blue-200',
  });

  const icons = {
    success: <i className="fas fa-check-circle mr-3 text-xl"></i>,
    error: <i className="fas fa-times-circle mr-3 text-xl"></i>,
    warning: <i className="fas fa-exclamation-triangle mr-3 text-xl"></i>,
    info: <i className="fas fa-info-circle mr-3 text-xl"></i>,
  };
  
  const currentTypeStyle = typeStyles(contrastMode)[type];

  return (
    <div role="alert" className={`${baseStyle} ${currentTypeStyle} ${className}`}>
      {icons[type]}
      <div className="flex-grow">{message}</div>
      {onClose && (
        <button 
            onClick={onClose} 
            className="ml-4 -mt-1 -mr-1 p-1 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-current"
            aria-label="Close alert"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Alert;