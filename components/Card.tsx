
import React, { ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';


interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode; // Icon can be any ReactNode, e.g., <i className="fas fa-icon"></i>
  onClick?: () => void;
  titleAction?: ReactNode;
  useGlassmorphism?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ 
    children, 
    className = '', 
    title, 
    icon, 
    onClick, 
    titleAction, 
    useGlassmorphism = true, 
    style,
}) => {
  const { contrastMode } = useAppContext();

  const baseCardClasses = `p-6 md:p-7 transition-shadow duration-300`; 
  
  const glassClasses = useGlassmorphism ? 'glassmorphism-card' : 
    (contrastMode ? 'bg-[var(--dm-card-bg-color)] border border-[var(--dm-border-color)] shadow-xl rounded-[var(--default-border-radius)]' : 
                      'bg-white border border-[var(--border-color-light)] shadow-lg rounded-[var(--default-border-radius)]');

  const titleClasses = contrastMode ? `text-slate-100` : `text-slate-800`;
  const iconColor = contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]';
  const textClasses = contrastMode ? `text-[var(--dm-medium-text-color)]` : `text-[var(--medium-text)]`;
  const borderClass = useGlassmorphism ? 'border-b border-[var(--current-glass-border)]' : `border-b border-[var(--current-border-color)]`;


  return (
    <div 
      className={`${baseCardClasses} ${glassClasses} ${onClick ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 transform' : ''} ${className} animated-element animate-fadeInUp`}
      onClick={onClick}
      style={style} // Keep style for animationDelays
    >
      {/* Icon rendering logic for title line */}
      {title && (
        <div className={`flex justify-between items-center mb-5 pb-4 ${borderClass}`}>
          <div className="flex items-center">
            {icon && ( /* Icon alongside title */
                <span className={`mr-3.5 ${iconColor} text-xl md:text-2xl`}>{icon}</span>
            )}
            <h3 className={`text-xl md:text-2xl font-semibold ${titleClasses}`}>{title}</h3>
          </div>
          {titleAction && <div>{titleAction}</div>}
        </div>
      )}
      
      {/* Content of the card */}
      <div className={`text-sm md:text-base ${textClasses}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
