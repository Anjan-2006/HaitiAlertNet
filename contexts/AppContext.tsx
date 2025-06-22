
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Page, AppContextType, Language, UserReport, ReportStatus, DisasterType, ReliefResource, DisasterZone, ResourceCategory, NewsArticle, UserReportSubmissionData } from '../types';
import { DEFAULT_LANGUAGE, LANGUAGES, TRANSLATIONS, INITIAL_MOCK_REPORTS, INITIAL_MOCK_RESOURCES, INITIAL_MOCK_DISASTER_ZONES, DEFAULT_USER_REPORT_ZONE_RADIUS, HAITI_REGIONS, DISASTER_TYPE_IMAGE_URLS } from '../constants';


const AppContext = createContext<AppContextType | undefined>(undefined);

const applyThemeVariables = (isDarkMode: boolean) => {
  const docStyle = document.documentElement.style;
  if (isDarkMode) {
    docStyle.setProperty('--current-body-bg-base', 'var(--dm-bg-color)'); // Base body background
    docStyle.setProperty('--current-text-color', 'var(--dm-text-color)');
    docStyle.setProperty('--current-medium-text-color', 'var(--dm-medium-text-color)');
    docStyle.setProperty('--current-primary-color', 'var(--dm-primary-color)');
    docStyle.setProperty('--current-primary-color-rgb', 'var(--dm-primary-color-rgb)');
    docStyle.setProperty('--current-card-bg-color', 'var(--dm-card-bg-color)');
    docStyle.setProperty('--current-link-color', 'var(--dm-link-color)');
    docStyle.setProperty('--current-border-color', 'var(--dm-border-color)');
    docStyle.setProperty('--current-glass-bg', 'var(--glass-bg-dark)');
    docStyle.setProperty('--current-glass-border', 'var(--glass-border-dark)');
    docStyle.setProperty('--current-glass-shadow', 'var(--glass-shadow-dark)');
    docStyle.setProperty('--current-glass-blur', 'var(--glass-blur-dark)');
    docStyle.setProperty('--current-primary-gradient', 'var(--primary-gradient-dark)');
    docStyle.setProperty('--current-alert-gradient', 'var(--alert-gradient-light)'); 
    
    docStyle.setProperty('--current-footer-bg', 'var(--footer-bg-dark)');
    docStyle.setProperty('--current-footer-text', 'var(--footer-text-dark)');
    docStyle.setProperty('--current-footer-link', 'var(--footer-link-dark)');
    docStyle.setProperty('--current-footer-link-hover', 'var(--footer-link-hover-dark)');
    docStyle.setProperty('--current-footer-title', 'var(--footer-title-dark)');
    docStyle.setProperty('--current-footer-border', 'var(--footer-border-dark)');

    document.body.classList.add('contrast-mode'); 
  } else {
    docStyle.setProperty('--current-body-bg-base', 'var(--white-bg)'); // Base body background
    docStyle.setProperty('--current-text-color', 'var(--dark-text)');
    docStyle.setProperty('--current-medium-text-color', 'var(--medium-text)');
    docStyle.setProperty('--current-primary-color', 'var(--primary-blue)');
    docStyle.setProperty('--current-primary-color-rgb', 'var(--primary-blue-rgb)');
    docStyle.setProperty('--current-card-bg-color', 'var(--white-bg)');
    docStyle.setProperty('--current-link-color', 'var(--primary-blue)');
    docStyle.setProperty('--current-border-color', 'var(--border-color-light)');
    docStyle.setProperty('--current-glass-bg', 'var(--glass-bg-light)');
    docStyle.setProperty('--current-glass-border', 'var(--glass-border-light)');
    docStyle.setProperty('--current-glass-shadow', 'var(--glass-shadow-light)');
    docStyle.setProperty('--current-glass-blur', 'var(--glass-blur-light)');
    docStyle.setProperty('--current-primary-gradient', 'var(--primary-gradient-light)');
    docStyle.setProperty('--current-alert-gradient', 'var(--alert-gradient-light)');

    docStyle.setProperty('--current-footer-bg', 'var(--footer-bg-light)');
    docStyle.setProperty('--current-footer-text', 'var(--footer-text-light)');
    docStyle.setProperty('--current-footer-link', 'var(--footer-link-light)');
    docStyle.setProperty('--current-footer-link-hover', 'var(--footer-link-hover-light)');
    docStyle.setProperty('--current-footer-title', 'var(--footer-title-light)');
    docStyle.setProperty('--current-footer-border', 'var(--footer-border-light)');
    
    document.body.classList.remove('contrast-mode');
  }
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);
  const [fontSize, setFontSizeState] = useState<number>(16); 
  const [contrastMode, setContrastModeState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; id: number } | null>(null);
  const notificationTimeoutId = React.useRef<number | null>(null);


  const [reports, setReports] = useState<UserReport[]>(INITIAL_MOCK_REPORTS);
  const [mockResources, setMockResources] = useState<ReliefResource[]>(INITIAL_MOCK_RESOURCES);
  const [mockDisasterZones, setMockDisasterZones] = useState<DisasterZone[]>(INITIAL_MOCK_DISASTER_ZONES);
  const [selectedNewsArticle, setSelectedNewsArticleState] = useState<NewsArticle | null>(null);

  const translate = useCallback((key: string, substitutions?: {[key: string]: string}): string => {
    let template = TRANSLATIONS[language]?.[key] || TRANSLATIONS[DEFAULT_LANGUAGE]?.[key] || key;
    if (substitutions) {
      Object.keys(substitutions).forEach(subKey => {
        template = template.replace(`{${subKey}}`, substitutions[subKey]);
      });
    }
    return template;
  }, [language]);
  
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (notificationTimeoutId.current) {
      clearTimeout(notificationTimeoutId.current);
    }
    const id = Date.now();
    setNotification({ message, type, id });
    notificationTimeoutId.current = setTimeout(() => {
      setNotification(prev => (prev && prev.id === id ? null : prev));
    }, 7000) as unknown as number; 
  }, []);

  const addReport = useCallback(async (reportData: UserReportSubmissionData) => {
    showNotification(translate('submittingReport'), 'info');
    setIsLoading(true); 

    await new Promise(resolveTimeout => setTimeout(resolveTimeout, 10000)); 

    const newReportWithDetails: UserReport = {
      ...reportData,
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
      status: ReportStatus.New,
      submitter: "User", 
    };

    if (!newReportWithDetails.photoPreview && newReportWithDetails.type) {
      newReportWithDetails.photoUrl = DISASTER_TYPE_IMAGE_URLS[newReportWithDetails.type];
      newReportWithDetails.photoPreview = DISASTER_TYPE_IMAGE_URLS[newReportWithDetails.type];
    }

    if (!newReportWithDetails.location && newReportWithDetails.locationText) {
      const regionData = HAITI_REGIONS.find(r => r.value === newReportWithDetails.locationText);
      if (regionData && regionData.coordinates) {
        newReportWithDetails.location = regionData.coordinates;
      }
    }
    
    setReports(prevReports => [newReportWithDetails, ...prevReports]);

    if (newReportWithDetails.location) {
      const newZone: DisasterZone = {
        id: `zone-from-${newReportWithDetails.id}`,
        name: translate('userReportedZoneName', { type: translate(newReportWithDetails.type) || newReportWithDetails.type }),
        type: newReportWithDetails.type,
        area: { center: newReportWithDetails.location, radius: DEFAULT_USER_REPORT_ZONE_RADIUS },
        severity: 'Medium', 
        lastUpdated: newReportWithDetails.timestamp,
        description: translate('userReportedZoneDescription', { type: translate(newReportWithDetails.type) || newReportWithDetails.type }),
      };
      setMockDisasterZones(prevZones => [newZone, ...prevZones]);
    }
    
    setIsLoading(false); 
    showNotification(translate('reportSubmittedMapSuccess'), 'success');

    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(translate('reportSubmittedVoiceConfirmation'));
        utterance.lang = language; 
        window.speechSynthesis.speak(utterance);
      } catch (speechError) {
        console.error("Speech synthesis error:", speechError);
      }
    }

    // --- REVERTED TO TWILIO SMS SIMULATION ---
    // The direct frontend API call to Twilio will fail due to CORS.
    // This simulation logs to console and shows a notification.
    // For actual SMS, a backend service is required.
    const recipientPhoneNumber = "7675072828"; // User specified recipient
    const smsMessageBody = `SIMULATED SMS to ${recipientPhoneNumber}:
New HaitiAlertNet Report:
Type: ${translate(newReportWithDetails.type) || newReportWithDetails.type}
Location: ${newReportWithDetails.locationText || (newReportWithDetails.location ? `Lat: ${newReportWithDetails.location.lat.toFixed(4)}, Lng: ${newReportWithDetails.location.lng.toFixed(4)}` : 'Unknown Location')}
Desc: ${newReportWithDetails.description.substring(0, 100)}...
ID: ${newReportWithDetails.id.substring(7,13)}`;

    console.log("--- SIMULATING TWILIO SMS ---");
    console.log(smsMessageBody);
    console.log("--- END OF SIMULATION ---");
    console.warn("SMS sending via Twilio from the frontend is not possible due to CORS. This is a simulation. A backend service is required for actual SMS delivery.");

    showNotification(
      translate('adminSmsDispatched', { phoneNumber: recipientPhoneNumber, reportId: newReportWithDetails.id.substring(7,13) }) + 
      " (Simulated - Check console. Real SMS requires backend due to CORS.)", 
      'info'
    );
    // --- END OF TWILIO SMS SIMULATION ---

  }, [translate, setIsLoading, showNotification, language, setReports, setMockDisasterZones]);


  const updateReportStatus = useCallback((reportId: string, status: ReportStatus) => {
    let originalReportType: DisasterType | undefined;

    setReports(prevReports =>
      prevReports.map(r => {
        if (r.id === reportId) {
          originalReportType = r.type; 
          return { ...r, status };
        }
        return r;
      })
    );
  
    const zoneIdToUpdate = `zone-from-${reportId}`;
    setMockDisasterZones(prevZones => {
      if (status === ReportStatus.Duplicate) {
        return prevZones.filter(z => z.id !== zoneIdToUpdate);
      } else if (status === ReportStatus.Verified && originalReportType) {
        return prevZones.map(z => {
          if (z.id === zoneIdToUpdate) {
            return {
              ...z,
              severity: 'High', 
              name: `${translate('userReportedZoneName', { type: translate(originalReportType) || originalReportType })} (${translate('verified')})`,
              lastUpdated: new Date(), 
            };
          }
          return z;
        });
      }
      return prevZones; 
    });
  }, [translate]); 

  const setSelectedNewsArticle = (article: NewsArticle | null) => {
    setSelectedNewsArticleState(article);
    if (article) {
      setCurrentPage(Page.NewsDetail);
    } else {
      if (currentPage === Page.NewsDetail) {
        setCurrentPage(Page.Home); 
      }
    }
  };
  

  const setLanguage = (langCode: string) => {
    if (LANGUAGES.find(l => l.code === langCode)) {
      setLanguageState(langCode);
      localStorage.setItem('disasterConnectLang', langCode);
    }
  };
  
  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('disasterConnectFontSize', size.toString());
  };

  const setContrastMode = (enabled: boolean) => {
    setContrastModeState(enabled);
    applyThemeVariables(enabled);
    localStorage.setItem('disasterConnectContrastMode', enabled.toString());
  };
  
  useEffect(() => {
    const storedLang = localStorage.getItem('disasterConnectLang');
    if (storedLang && LANGUAGES.find(l => l.code === storedLang)) {
      setLanguageState(storedLang);
    }

    const storedFontSize = localStorage.getItem('disasterConnectFontSize');
    if (storedFontSize) {
      const size = parseInt(storedFontSize, 10);
      if(!isNaN(size)) setFontSizeState(size); 
    }
    
    const storedContrastMode = localStorage.getItem('disasterConnectContrastMode') === 'true';
    setContrastModeState(storedContrastMode);
    applyThemeVariables(storedContrastMode); 
  }, []);

   useEffect(() => { 
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);
  

  return (
    <AppContext.Provider value={{ 
      currentPage, setCurrentPage, 
      language, setLanguage, translate,
      fontSize, setFontSize,
      contrastMode, setContrastMode,
      isLoading, setIsLoading,
      showNotification,
      reports, addReport, updateReportStatus,
      mockResources, mockDisasterZones,
      selectedNewsArticle, setSelectedNewsArticle
    }}>
      {children}
      {notification && (
        <div 
          className={`fixed bottom-5 right-5 z-[2000] p-4 rounded-xl shadow-2xl min-w-[300px] max-w-md
            ${notification.type === 'success' ? (contrastMode ? 'bg-green-700 text-green-100 border border-green-600' : 'bg-green-100 text-green-700 border border-green-300') : ''}
            ${notification.type === 'error' ? (contrastMode ? 'bg-red-800 text-red-100 border border-red-600' : 'bg-red-100 text-red-700 border border-red-300') : ''}
            ${notification.type === 'info' ? (contrastMode ? 'bg-blue-700 text-blue-100 border border-blue-500' : 'bg-blue-100 text-blue-700 border border-blue-300') : ''}
            animated-element animate-fadeInUp`}
            style={{ animationFillMode: 'forwards' }} 
          >
          <div className="flex items-start">
            <i className={`fas 
              ${notification.type === 'success' ? 'fa-check-circle' : ''}
              ${notification.type === 'error' ? 'fa-times-circle' : ''}
              ${notification.type === 'info' ? 'fa-info-circle' : ''} 
              mr-3 text-xl opacity-80`}
            ></i>
            <span className="flex-grow text-sm">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)} 
              className={`ml-3 -mt-1 -mr-1 p-1 rounded-full hover:bg-black/10 text-current opacity-70 hover:opacity-100`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
