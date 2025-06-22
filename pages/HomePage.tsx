
import React, { useState, useEffect, useMemo } from 'react';
import { Page, NewsArticle, DisasterType } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import NewsCard from '../components/NewsCard';
import { MOCK_NEWS_HAITI, DISASTER_TYPES } from '../constants';


const HomePage: React.FC = () => {
  const { setCurrentPage, translate, contrastMode } = useAppContext();
  const textPrimaryColor = contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]';
  const heroTextColor = contrastMode ? 'text-slate-100' : 'text-slate-900';
  const secondaryTextColor = contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-[var(--medium-text)]';

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(MOCK_NEWS_HAITI);
  const [newsFilter, setNewsFilter] = useState<DisasterType | 'AllTypes'>('AllTypes');

  const filteredNews = useMemo(() => {
    if (newsFilter === 'AllTypes') {
      return newsArticles;
    }
    return newsArticles.filter(article => 
      article.disasterTypeTags && article.disasterTypeTags.includes(newsFilter)
    );
  }, [newsArticles, newsFilter]);


  useEffect(() => {
    // Simulate news updates
    const intervalId = setInterval(() => {
      setNewsArticles(prevNews => {
        const shuffledNews = [...prevNews].sort(() => Math.random() - 0.5);
        return shuffledNews.map(article => ({...article, publishedDate: new Date() })); // Update date to show change
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, []);


  const inputStyles = `p-3 border rounded-[var(--input-border-radius)] shadow-sm text-sm 
    bg-[var(--current-card-bg-color)] text-[var(--current-text-color)] border-[var(--current-border-color)]
    focus:border-[var(--current-primary-color)] focus:ring-2 focus:ring-[var(--current-primary-color)] focus:ring-opacity-50`;
  const sectionTitleColor = contrastMode ? 'text-slate-100' : 'text-slate-800';

  const features = [
    { titleKey: 'realTimeAlertsTitle', descKey: 'realTimeAlertsDesc', icon: <i className="fa-solid fa-bell"></i> }, 
    { titleKey: 'communityReportsTitle', descKey: 'communityReportsDesc', icon: <i className="fas fa-users"></i> },
    { titleKey: 'resourceMappingTitle', descKey: 'resourceMappingDesc', icon: <i className="fas fa-map-location-dot"></i> },
    { titleKey: 'verifiedInformationTitle', descKey: 'verifiedInformationDesc', icon: <i className="fa-solid fa-check"></i> }, 
  ];

  const emergencyContacts = [
    { nameKey: 'police', number: '100' },
    { nameKey: 'fire', number: '101' },
    { nameKey: 'ambulance', number: '108' },
    { nameKey: 'disasterMgmt', number: '1078' },
  ];

  const featureIconBg = contrastMode ? 'bg-[rgba(var(--alert-red-rgb),0.15)]' : 'bg-[rgba(var(--primary-blue-rgb),0.1)]';
  const featureIconColor = contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]';
  
  const takeActionButtonTextColor = !contrastMode ? '!text-sky-400 !opacity-100' : '!text-white !opacity-100';


  return (
    <div className="py-10 md:py-12"> 
      {/* Hero Section */}
      <header className="mb-12 md:mb-16 text-center animated-element animate-fadeInUp">
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${heroTextColor} mb-6 tracking-tight`}>
          <i className="fas fa-satellite-dish mr-3 opacity-80"></i>
          Haiti<span className={textPrimaryColor}>AlertNet</span>
        </h1>
        <p className={`text-lg sm:text-xl ${secondaryTextColor} max-w-3xl mx-auto leading-relaxed animated-element animate-fadeInUp`} style={{ animationDelay: '0.1s' }}>
          {translate('missionStatement')}
        </p>
      </header>

      {/* Emergency Alerts Banner */}
      <section className="mb-16 md:mb-20 animated-element animate-fadeInUp" style={{animationDelay: '0.15s'}}>
        <div 
          className="relative rounded-2xl overflow-hidden shadow-xl text-white h-[350px] md:h-[400px] flex flex-col items-center justify-center text-center p-6 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/seed/haitiView/1200/400')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div> {/* Dark overlay */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{translate('emergencyAlertsTitle')}</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{translate('emergencyAlertsSubtitle')}</p>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => setCurrentPage(Page.LiveMap)}
              className={contrastMode ? '!bg-[var(--alert-red)] hover:!brightness-110' : '!bg-[var(--primary-blue)] hover:!bg-blue-700'}
            >
              {translate('viewAlertsButton')}
            </Button>
          </div>
        </div>
      </section>

      {/* How We Help Communities Section */}
      <section className="mb-16 md:mb-20 text-center animated-element animate-fadeInUp" style={{animationDelay: '0.2s'}}>
        <h2 className={`text-3xl sm:text-4xl font-semibold mb-4 ${sectionTitleColor} tracking-tight`}>
          <i className="fas fa-hands-helping mr-3 opacity-70"></i> {translate('howWeHelpTitle')}
        </h2>
        <p className={`text-lg ${secondaryTextColor} max-w-3xl mx-auto mb-12 leading-relaxed`}>
          {translate('howWeHelpSubtitle')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={feature.titleKey} className="animated-element animate-fadeInUp" style={{animationDelay: `${0.25 + index * 0.07}s`}}>
              <Card 
                useGlassmorphism={false} 
                className={`text-center p-6 md:p-8 h-full ${contrastMode ? 'bg-[var(--dm-card-bg-color)]' : 'bg-slate-50'} shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border ${contrastMode ? 'border-[var(--dm-border-color)]':'border-slate-200' }`}
              >
                <div className={`flex justify-center items-center mb-4 w-16 h-16 mx-auto rounded-full ${featureIconBg}`}>
                    <span className={`${featureIconColor} text-3xl`}>{feature.icon}</span>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${sectionTitleColor}`}>{translate(feature.titleKey)}</h3>
                <p className={`text-sm ${secondaryTextColor} leading-relaxed`}>{translate(feature.descKey)}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>
      
      {/* Emergency Contact Numbers Section */}
      <section className="mb-16 md:mb-20 py-12 md:py-16 bg-[var(--alert-red)] rounded-2xl shadow-xl animated-element animate-fadeInUp" style={{animationDelay: '0.3s'}}>
        <h2 className="text-3xl sm:text-4xl font-semibold text-white text-center mb-10 tracking-tight">
           <i className="fas fa-phone-volume mr-3 opacity-70"></i> {translate('emergencyContactsTitle')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
          {emergencyContacts.map((contact, index) => (
            <div 
              key={contact.nameKey} 
              className="bg-red-700 hover:bg-red-800 transition-colors p-4 md:p-6 rounded-xl text-white text-center shadow-lg animated-element animate-fadeInUp"
              style={{animationDelay: `${0.35 + index * 0.07}s`}}
            >
              <div className="text-3xl md:text-4xl font-bold mb-1">{contact.number}</div>
              <div className="text-sm font-medium">{translate(contact.nameKey)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Take Action Now Buttons */}
      <section className="mb-16 md:mb-20 animated-element animate-fadeInUp" style={{animationDelay: '0.4s'}}>
         <h2 className={`text-3xl sm:text-4xl font-semibold mb-10 text-center ${sectionTitleColor} tracking-tight`}>
            <i className="fas fa-rocket mr-3 opacity-70"></i> {translate('takeActionNow')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Button
            size="lg"
            onClick={() => setCurrentPage(Page.ReportDisaster)}
            className={`w-full !py-6 !text-lg !font-semibold animated-element animate-fadeInUp ${takeActionButtonTextColor}`}
            style={{animationDelay: '0.45s'}}
            leftIcon={<i className={`fas fa-bullhorn mr-2.5 ${takeActionButtonTextColor}`}></i>}
            variant={'primary'} 
          >
            {translate('reportDisaster')}
          </Button>
          <Button
            size="lg"
            onClick={() => setCurrentPage(Page.ReliefResources)}
            className={`w-full !py-6 !text-lg !font-semibold animated-element animate-fadeInUp ${takeActionButtonTextColor}`}
            style={{animationDelay: '0.5s'}}
            leftIcon={<i className={`fas fa-hands-helping mr-2.5 ${takeActionButtonTextColor}`}></i>}
            variant={'primary'}
          >
            {translate('findHelp')}
          </Button>
          <Button
            size="lg"
            onClick={() => setCurrentPage(Page.LiveMap)}
            className={`w-full !py-6 !text-lg !font-semibold animated-element animate-fadeInUp ${takeActionButtonTextColor}`}
            style={{animationDelay: '0.55s'}}
            leftIcon={<i className={`fas fa-map-marked-alt mr-2.5 ${takeActionButtonTextColor}`}></i>}
            variant={'primary'}
          >
            {translate('viewLiveMap')}
          </Button>
        </div>
      </section>
      
      {/* Live Disaster News Section - Background image and overlay REMOVED */}
      <section 
        className="mb-12 md:mb-16 text-left animated-element animate-fadeInUp relative py-12 md:py-16 px-6 md:px-10 rounded-2xl shadow-xl" 
        style={{
            animationDelay: '0.6s', 
            backgroundColor: contrastMode ? 'var(--dm-card-bg-color)' : 'var(--white-bg)' // Use card/page background
        }}
       >
        {/* No overlay div here anymore */}
        <div className="relative z-10"> {/* Ensure content is still layered correctly if needed, but not essential without bg image */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className={`text-3xl sm:text-4xl font-semibold ${sectionTitleColor} tracking-tight`}>
                <i className="far fa-newspaper mr-3.5 opacity-90"></i> {translate('liveDisasterNews')}
            </h2>
            <div>
                <label htmlFor="newsFilterType" className="sr-only">{translate('filterByNewsType')}</label>
                <select
                id="newsFilterType"
                value={newsFilter}
                onChange={(e) => setNewsFilter(e.target.value as DisasterType | 'AllTypes')}
                className={`${inputStyles} ${contrastMode ? '!bg-[var(--dm-bg-color)] !text-white !border-gray-600 focus:!ring-gray-500 focus:!border-gray-500' : ''}`}
                >
                <option value="AllTypes">{translate('allTypes')}</option>
                {DISASTER_TYPES.map(type => (
                    <option key={type} value={type}>{translate(type) || type}</option>
                ))}
                </select>
            </div>
            </div>
            {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredNews.map((article, index) => (
                <NewsCard key={article.id} article={article} style={{animationDelay: `${0.65 + index * 0.07}s`}} />
                ))}
            </div>
            ) : (
            <p className={`text-center py-10 ${secondaryTextColor}`}>{translate('noNewsArticlesFound')}</p>
            )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
