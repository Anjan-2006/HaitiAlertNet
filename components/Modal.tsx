

import React, { ReactNode, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { contrastMode } = useAppContext();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);


  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const modalBg = contrastMode ? 'bg-[var(--dm-card-bg-color)] border border-[var(--dm-border-color)]' : 'bg-white';
  const titleColor = contrastMode ? 'text-slate-100' : 'text-slate-800';
  const closeButtonColor = contrastMode ? 'text-[var(--dm-medium-text-color)] hover:text-white' : 'text-gray-400 hover:text-gray-700';

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animated-element animate-fadeIn" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      style={{ animationDuration: '0.3s' }}
    >
      <div
        className={`${modalBg} rounded-[var(--default-border-radius)] shadow-2xl overflow-hidden w-full ${sizeClasses[size]} animated-element animate-fadeInUp`}
        onClick={(e) => e.stopPropagation()} 
        style={{animationDuration: '0.3s', animationDelay: '0.05s'}} // Slight delay for content
      >
        <div className={`flex items-center justify-between p-5 md:p-6 border-b ${contrastMode ? 'border-[var(--dm-border-color)]' : 'border-[var(--border-color-light)]'}`}>
          {title && <h3 id="modal-title" className={`text-lg md:text-xl font-semibold ${titleColor}`}>{title}</h3>}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${closeButtonColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-[var(--current-primary-color)] focus:ring-offset-2 focus:ring-offset-[var(--current-card-bg-color)]`}
            aria-label="Close modal"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className={`p-6 md:p-7 ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-[var(--medium-text)]'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;