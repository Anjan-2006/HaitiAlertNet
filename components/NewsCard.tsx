
import React from 'react';
import { NewsArticle } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Button from './Button'; 


interface NewsCardProps {
  article: NewsArticle;
  style?: React.CSSProperties; // To accept animationDelay from HomePage
}

const NewsCard: React.FC<NewsCardProps> = ({ article, style }) => {
  const { translate, contrastMode, setSelectedNewsArticle } = useAppContext();

  const titleClasses = contrastMode ? 'text-slate-100 hover:text-[var(--alert-red)]' : 'text-slate-800 hover:text-[var(--primary-blue)]';
  const sourceTextClasses = contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-[var(--medium-text)]';

  const handleCardClick = () => {
    setSelectedNewsArticle(article);
  };

  return (
    <div 
        className="glassmorphism-card overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-1 animated-element animate-fadeInUp"
        style={style} // Apply animationDelay if passed
    >
      <img 
        src={article.imageUrl || 'https://picsum.photos/seed/newsfallback/400/200'} 
        alt={translate('newsImageAlt') + `: ${article.title}`} 
        className="w-full h-48 object-cover cursor-pointer" // Ensure image is visible
        onClick={handleCardClick}
      />
      <div className="p-5 md:p-6 flex flex-col flex-grow"> 
        <h3 className={`text-lg font-semibold mb-2.5 ${titleClasses} transition-colors duration-150 leading-tight line-clamp-2`}>
           <a 
            href="#" 
            onClick={(e) => { 
                e.preventDefault(); 
                handleCardClick();
            }} 
            className="focus:outline-none focus:underline focus:decoration-[var(--current-primary-color)] focus:decoration-2 focus:underline-offset-2"
           >
            {article.title}
           </a>
        </h3>
        <p className={`text-sm mb-4 flex-grow leading-relaxed line-clamp-3`}>{article.description.substring(0, 120)}...</p> 
        <div className="text-xs mb-5">
          <span className={`${sourceTextClasses} mr-2.5`}>{article.source}</span>
          <span className={sourceTextClasses}>{new Date(article.publishedDate).toLocaleDateString()}</span>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={handleCardClick}
            className="mt-auto w-full !py-2.5" 
        >
          {translate('readMore')}
        </Button>
      </div>
    </div>
  );
};

export default NewsCard;
