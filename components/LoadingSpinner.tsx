
import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-[1100]"> {/* More subtle bg */}
      <div className="w-16 h-16 border-4 border-[var(--current-primary-color)] border-t-transparent rounded-full animate-spin"></div>
      {message && <p className="mt-4 text-white text-lg font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;