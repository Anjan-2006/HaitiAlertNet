
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME } from '../constants';


const Footer: React.FC = () => {
  const { translate } = useAppContext(); // Removed contrastMode, will use CSS vars
  const year = new Date().getFullYear();

  // Footer will now use CSS variables directly for theming its distinct background
  const footerStyle: React.CSSProperties = {
    backgroundColor: 'var(--current-footer-bg)',
    color: 'var(--current-footer-text)',
    borderTopColor: 'var(--current-footer-border)',
  };

  const titleStyle: React.CSSProperties = {
    color: 'var(--current-footer-title)',
  };

  const linkStyle: React.CSSProperties = {
    color: 'var(--current-footer-link)',
  };
  
  // Hover effect can be done with a more complex setup or a simple CSS class for links
  // For simplicity, we'll rely on global :hover if defined, or simple inline style for this example.

  return (
    <footer 
        className={`py-12 md:py-16 mt-auto border-t transition-colors duration-300 animated-element animate-fadeInUp`} 
        style={{ ...footerStyle, animationDelay: '0.2s' }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="animated-element animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <h5 className={`font-semibold text-lg mb-3.5`} style={titleStyle}>{translate('aboutUs')}</h5>
            <p className="text-sm leading-relaxed">
              {APP_NAME} - {translate('missionStatement').substring(0,100)}...
            </p>
          </div>
          <div className="animated-element animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <h5 className={`font-semibold text-lg mb-3.5`} style={titleStyle}>{translate('contactInfo')}</h5>
            <p className="text-sm">support@disasterconnect.example</p>
            <p className="text-sm">(555) 123-HELP</p>
          </div>
          <div className="animated-element animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <h5 className={`font-semibold text-lg mb-3.5`} style={titleStyle}>{translate('socialMedia')}</h5>
            <div className="flex justify-center space-x-6">
              <a href="#" style={linkStyle} className="text-2xl transition-colors duration-200 hover:text-[var(--current-footer-link-hover)]" aria-label="Facebook"><i className="fab fa-facebook-square"></i></a>
              <a href="#" style={linkStyle} className="text-2xl transition-colors duration-200 hover:text-[var(--current-footer-link-hover)]" aria-label="Twitter"><i className="fab fa-twitter-square"></i></a>
              <a href="#" style={linkStyle} className="text-2xl transition-colors duration-200 hover:text-[var(--current-footer-link-hover)]" aria-label="Instagram"><i className="fab fa-instagram-square"></i></a>
            </div>
          </div>
        </div>
        <div 
            className={`border-t pt-10 text-sm animated-element animate-fadeInUp`} 
            style={{ borderTopColor: 'var(--current-footer-border)', animationDelay: '0.6s' }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8 mb-4">
            <a href="#" style={linkStyle} className="transition-colors duration-200 hover:text-[var(--current-footer-link-hover)]">{translate('termsOfService')}</a>
            <a href="#" style={linkStyle} className="transition-colors duration-200 hover:text-[var(--current-footer-link-hover)]">{translate('privacyPolicy')}</a>
            <a href="#" style={linkStyle} className="transition-colors duration-200 hover:text-[var(--current-footer-link-hover)]">{translate('joinAsVolunteer')}</a>
          </div>
          <p>&copy; {year} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
