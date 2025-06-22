
import React, { useState } from 'react';
import { Page } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME, LANGUAGES } from '../constants';
import Button from './Button';


const NavLink: React.FC<{ page: Page; labelKey: string; current: Page; onClick: (page: Page) => void }> = ({ page, labelKey, current, onClick }) => {
  const { translate, contrastMode } = useAppContext();
  const isActive = page === current;
  
  const activeClasses = contrastMode 
    ? 'bg-[var(--alert-red)] text-white font-semibold shadow-md' 
    : 'bg-[var(--primary-blue)] text-white font-semibold shadow-md';
  const inactiveClasses = contrastMode 
    ? 'text-[var(--current-medium-text-color)] hover:text-white hover:bg-[rgba(var(--alert-red-rgb),0.25)]'
    : 'text-[var(--current-medium-text-color)] hover:text-[var(--primary-blue)] hover:bg-[rgba(var(--primary-blue-rgb),0.08)]';
  
  return (
    <button
      onClick={() => onClick(page)}
      className={`px-3 lg:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {translate(labelKey)}
    </button>
  );
};

const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, language, setLanguage, translate, fontSize, setFontSize, contrastMode, setContrastMode } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const baseFontSize = 16; 
  const fontSizes = [
    { label: 'S', value: baseFontSize * 0.875 }, 
    { label: 'M', value: baseFontSize }, 
    { label: 'L', value: baseFontSize * 1.125 }, 
    { label: 'XL', value: baseFontSize * 1.25 }, 
  ];
  
  const navLinkDetails = [
    { page: Page.Home, labelKey: 'home' },
    { page: Page.LiveMap, labelKey: 'map' },
    { page: Page.ReportDisaster, labelKey: 'report' },
    { page: Page.ReliefResources, labelKey: 'resources' },
    { page: Page.AdminVerification, labelKey: 'admin' },
  ];

  const navbarBg = contrastMode ? 'bg-[var(--dm-card-bg-color)] border-b border-[var(--dm-border-color)]' : 'bg-white/80 backdrop-blur-md border-b border-[var(--border-color-light)]';
  const appNameColor = contrastMode ? 'text-white' : 'text-[var(--primary-blue)]';
  const iconColor = contrastMode ? 'text-[var(--dm-medium-text-color)] hover:text-[var(--alert-red)]' : 'text-[var(--medium-text)] hover:text-[var(--primary-blue)]';
  const settingsDropdownBg = contrastMode ? 'bg-[var(--dm-bg-color)]' : 'bg-white';


  return (
    <nav className={`sticky-nav shadow-lg ${navbarBg} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center animated-element animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <span className={`font-bold text-xl md:text-2xl ${appNameColor}`}>
              <i className="fas fa-satellite-dish mr-2.5"></i>
              {APP_NAME}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5 animated-element animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {navLinkDetails.map(item => (
              <NavLink key={item.page} page={item.page} labelKey={item.labelKey} current={currentPage} onClick={setCurrentPage} />
            ))}
          </div>
          <div className="flex items-center space-x-2 animated-element animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="relative hidden md:block">
              <button onClick={() => setSettingsOpen(!settingsOpen)} className={`p-2.5 rounded-full ${iconColor} focus:outline-none focus:ring-2 focus:ring-[var(--current-primary-color)] focus:ring-opacity-50`}>
                <i className="fas fa-cog text-xl"></i>
              </button>
              {settingsOpen && (
                <div className={`settings-dropdown absolute right-0 mt-3 w-72 p-5 rounded-2xl shadow-2xl ${settingsDropdownBg} z-20 border border-[var(--current-border-color)] animated-element animate-fadeIn`} style={{ animationDuration: '0.3s' }}>
                  <div className="mb-4">
                    <label htmlFor="language-select" className={`block text-sm font-medium mb-1.5 ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-gray-700'}`}>{translate('language')}:</label>
                    <select
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`mt-1 block w-full pl-3 pr-10 py-2.5 text-sm rounded-md focus:outline-none
                        bg-[var(--current-card-bg-color)] text-[var(--current-text-color)] border-[var(--current-border-color)] 
                        focus:ring-2 focus:ring-[var(--current-primary-color)] focus:border-[var(--current-primary-color)]`}
                    >
                      {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                     <span className={`block text-sm font-medium mb-1.5 ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-gray-700'}`}>{translate('fontSize')}:</span>
                    <div className="flex space-x-2.5 mt-1">
                      {fontSizes.map(sizeOpt => (
                        <Button
                          key={sizeOpt.label}
                          onClick={() => setFontSize(sizeOpt.value)}
                          variant={fontSize === sizeOpt.value ? 'primary' : 'secondary'}
                          size="sm"
                          className={`flex-1 !py-2 ${fontSize === sizeOpt.value ? 
                            (contrastMode ? '!bg-[var(--alert-red)] !text-white' : '!bg-[var(--primary-blue)] !text-white') : 
                            (contrastMode ? '!bg-gray-700 !text-gray-200 hover:!bg-gray-600' : 'hover:!bg-slate-300 !text-slate-700')}`}
                        >
                          {sizeOpt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`flex items-center cursor-pointer ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-gray-700'}`}>
                      <input
                        type="checkbox"
                        checked={contrastMode}
                        onChange={(e) => setContrastMode(e.target.checked)}
                        className={`form-checkbox h-5 w-5 rounded-md transition-colors duration-150 
                          ${contrastMode ? 'text-[var(--alert-red)] focus:ring-[var(--alert-red)]' : 'text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]'}
                          bg-[var(--current-card-bg-color)] border-[var(--current-border-color)]`}
                      />
                      <span className="ml-2.5 text-sm">{translate('contrastMode')}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
             <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2.5 rounded-md ${iconColor} focus:outline-none`}>
                <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div 
            className={`absolute top-16 left-0 w-full md:hidden pb-4 pt-2 space-y-1.5 
                       ${contrastMode ? 'bg-[var(--dm-card-bg-color)]/60 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm'} 
                       shadow-xl border-t 
                       ${contrastMode ? 'border-[var(--dm-border-color)]' : 'border-[var(--border-color-light)]'} 
                       animated-element animate-fadeIn`} 
            style={{ animationDuration: '0.3s', zIndex: 1000 }} 
          >
            {navLinkDetails.map((item, index) => (
              <div className="mobile-menu-item px-4 animated-element animate-fadeInUp" key={item.page + '-mobile'} style={{ animationDelay: `${index * 0.05}s`}}> {/* Added px-4 for padding */}
                <NavLink page={item.page} labelKey={item.labelKey} current={currentPage} onClick={(page) => { setCurrentPage(page); setMenuOpen(false); }} />
              </div>
            ))}
             <div className={`mobile-menu-item mt-4 px-4 pt-4 border-t ${contrastMode ? 'border-[var(--dm-border-color)]' : 'border-[var(--border-color-light)]'} animated-element animate-fadeInUp`} style={{ animationDelay: `${navLinkDetails.length * 0.05}s`}}>
                <h3 className={`text-sm font-semibold mb-3 ${contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]'}`}>{translate('settings')}</h3>
                 <div className="mb-4">
                    <label htmlFor="language-select-mobile" className={`block text-sm font-medium mb-1.5 ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-gray-700'}`}>{translate('language')}:</label>
                     <select
                      id="language-select-mobile"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`mt-1 block w-full pl-3 pr-10 py-2.5 text-sm rounded-md focus:outline-none
                        bg-[var(--current-card-bg-color)] text-[var(--current-text-color)] border-[var(--current-border-color)]
                        focus:ring-2 focus:ring-[var(--current-primary-color)] focus:border-[var(--current-primary-color)]`}
                    >
                      {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                     <span className={`block text-sm font-medium mb-1.5 ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-gray-700'}`}>{translate('fontSize')}:</span>
                    <div className="flex space-x-2.5 mt-1">
                      {fontSizes.map(sizeOpt => (
                        <Button
                          key={sizeOpt.label + "-mobile"}
                          onClick={() => setFontSize(sizeOpt.value)}
                           variant={fontSize === sizeOpt.value ? 'primary' : 'secondary'}
                          size="sm"
                           className={`flex-1 !py-2 ${fontSize === sizeOpt.value ? 
                             (contrastMode ? '!bg-[var(--alert-red)] !text-white' : '!bg-[var(--primary-blue)] !text-white') : 
                             (contrastMode ? '!bg-gray-700 !text-gray-200 hover:!bg-gray-600' : 'hover:!bg-slate-300 !text-slate-700')}`}
                        >
                          {sizeOpt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`flex items-center cursor-pointer ${contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-gray-700'}`}>
                       <input
                        type="checkbox"
                        checked={contrastMode}
                        onChange={(e) => setContrastMode(e.target.checked)}
                        className={`form-checkbox h-5 w-5 rounded-md transition-colors duration-150 
                          ${contrastMode ? 'text-[var(--alert-red)] focus:ring-[var(--alert-red)]' : 'text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]'}
                          bg-[var(--current-card-bg-color)] border-[var(--current-border-color)]`}
                      />
                      <span className="ml-2.5 text-sm">{translate('contrastMode')}</span>
                    </label>
                  </div>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
