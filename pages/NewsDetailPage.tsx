
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Page } from '../types'; 

const NewsDetailPage: React.FC = () => {
  const { translate, contrastMode, selectedNewsArticle, setSelectedNewsArticle, setCurrentPage } = useAppContext();

  if (!selectedNewsArticle) {
    return (
      <div className="text-center py-10 animated-element animate-fadeInUp">
        <Card useGlassmorphism={true}>
            <p className="text-xl">{translate('articleNotFound')}</p>
            <Button 
                onClick={() => setCurrentPage(Page.Home)}
                variant="primary" 
                className="mt-6"
            >
                {translate('backToHome')}
            </Button>
        </Card>
      </div>
    );
  }

  const handleBack = () => {
    setSelectedNewsArticle(null); // This will trigger navigation to Home via AppContext logic
  };
  
  const titleColor = contrastMode ? 'text-slate-100' : 'text-slate-900';
  const textColor = contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-[var(--medium-text)]';
  const sourceColor = contrastMode ? 'text-[var(--dm-medium-text-color)] opacity-80' : 'text-slate-500';

  return (
    <div className="max-w-4xl mx-auto py-8 animated-element animate-fadeInUp">
      <Button onClick={handleBack} variant="outline" className="mb-8" leftIcon={<i className="fas fa-arrow-left"></i>}>
        {translate('backToHome')}
      </Button>
      
      <Card useGlassmorphism={true} className="!p-0 overflow-hidden">
        <img 
            src={selectedNewsArticle.imageUrl || 'https://picsum.photos/seed/newsdetailfallback/1200/400'} 
            alt={translate('newsImageAlt') + `: ${selectedNewsArticle.title}`}
            className="w-full h-64 md:h-96 object-cover"
        />
        <div className="p-6 md:p-10">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${titleColor}`}>
                {selectedNewsArticle.title}
            </h1>
            <div className={`flex items-center text-sm ${sourceColor} mb-6`}>
                <span>{selectedNewsArticle.source}</span>
                <span className="mx-2">|</span>
                <span>{new Date(selectedNewsArticle.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className={`prose prose-lg md:prose-xl max-w-none ${textColor} leading-relaxed whitespace-pre-line`}>
                {selectedNewsArticle.description}
            </div>
            {selectedNewsArticle.link && selectedNewsArticle.link !== "#" && (
                <div className="mt-8 pt-6 border-t border-[var(--current-border-color)]">
                     <Button 
                        variant="primary" 
                        onClick={() => window.open(selectedNewsArticle.link, "_blank")}
                        leftIcon={<i className="fas fa-external-link-alt"></i>}
                    >
                        {translate('fullStoryDetails')}
                    </Button>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default NewsDetailPage;