

import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ReliefResource, ResourceCategory } from '../types';
import Card from '../components/Card'; // Re-evaluate if Card component is suitable or if custom div is better
import Button from '../components/Button'; 

// Helper function to format "last updated" time
const formatLastUpdated = (date: Date | undefined, translate: (key: string, subs?: any) => string): string => {
  if (!date) return translate('unknownTag');
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return translate('updatedMinutesAgo', { minutes: 'Just now' });
  if (diffMinutes < 60) return translate('updatedMinutesAgo', { minutes: diffMinutes });
  if (diffHours < 24) return translate('updatedHoursAgo', { hours: diffHours });
  if (diffDays <= 7) return translate('updatedDaysAgo', { days: diffDays });
  return translate('updatedOnDate', {date: date.toLocaleDateString()});
};


const ReliefResourcesPage: React.FC = () => {
  const { translate, contrastMode, mockResources } = useAppContext(); 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'AllResources'>('AllResources');
  const [sortBy, setSortBy] = useState<'name' | 'distanceKm' | 'availabilityStatus'>('name');

  const categoryCounts = useMemo(() => {
    const counts: { [key in ResourceCategory | 'AllResources']?: number } = { AllResources: mockResources.length };
    mockResources.forEach(resource => {
      counts[resource.category] = (counts[resource.category] || 0) + 1;
    });
    return counts;
  }, [mockResources]);

  const filteredAndSortedResources = useMemo(() => {
    let tempResources = mockResources.filter(resource => { 
      const matchesCategory = activeCategory === 'AllResources' || resource.category === activeCategory;
      const matchesSearch = searchTerm === '' || 
                            resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (resource.services && resource.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesSearch;
    });

    tempResources.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'distanceKm') return (a.distanceKm || Infinity) - (b.distanceKm || Infinity);
      if (sortBy === 'availabilityStatus') {
        const order: Record<ReliefResource['availabilityStatus'], number> = { 'Available': 1, 'Limited': 2, 'Full': 3, 'Unknown': 4 };
        return order[a.availabilityStatus] - order[b.availabilityStatus];
      }
      return 0;
    });

    return tempResources;
  }, [mockResources, searchTerm, activeCategory, sortBy]);

  const getAvailabilityTag = (status: ReliefResource['availabilityStatus']) => {
    switch (status) {
      case 'Available':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300"> <i className="fas fa-check-circle mr-1.5 text-green-600"></i> {translate('availableTag')}</span>;
      case 'Limited':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300"> <i className="fas fa-exclamation-triangle mr-1.5 text-yellow-600"></i> {translate('limitedTag')}</span>;
      case 'Full':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300"> <i className="fas fa-times-circle mr-1.5 text-red-600"></i> {translate('fullTag')}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"> <i className="fas fa-question-circle mr-1.5 text-gray-600"></i> {translate('unknownTag')}</span>;
    }
  };
  
  const getProgressBarColor = (current?: number, max?: number, status?: ReliefResource['availabilityStatus']) => {
    if (status === 'Full' || (typeof current === 'number' && typeof max === 'number' && current >= max)) return 'bg-red-500';
    if (status === 'Limited' || (typeof current === 'number' && typeof max === 'number' && current / max >= 0.75)) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const categoryFilterItems: {id: ResourceCategory | 'AllResources', labelKey: string, icon: string, count: number }[] = [
    { id: 'AllResources', labelKey: 'allResources', icon: 'fa-filter', count: categoryCounts['AllResources'] || 0 },
    { id: ResourceCategory.Medical, labelKey: 'Medical Facilities', icon: 'fa-briefcase-medical', count: categoryCounts[ResourceCategory.Medical] || 0 },
    { id: ResourceCategory.Food, labelKey: 'Food Security', icon: 'fa-utensils', count: categoryCounts[ResourceCategory.Food] || 0 },
    { id: ResourceCategory.Shelter, labelKey: 'Shelters', icon: 'fa-house-chimney', count: categoryCounts[ResourceCategory.Shelter] || 0 },
    { id: ResourceCategory.Water, labelKey: 'Water Source', icon: 'fa-solid fa-water', count: categoryCounts[ResourceCategory.Water] || 0 }, // Updated icon
    { id: ResourceCategory.EmergencyServices, labelKey: 'Emergency Services', icon: 'fa-truck-medical', count: categoryCounts[ResourceCategory.EmergencyServices] || 0 },
  ];

  const textColor = contrastMode ? 'text-gray-200' : 'text-slate-700';
  const inputBgColor = contrastMode ? 'bg-[var(--dm-card-bg-color)]' : 'bg-white';
  const borderColor = contrastMode ? 'border-[var(--dm-border-color)]' : 'border-slate-300';
  const sectionTitleColor = contrastMode ? 'text-slate-100' : 'text-slate-800';

  return (
    <div className="animated-element animate-fadeInUp">
      <header className="mb-10 md:mb-12">
        <h1 className={`text-3xl md:text-4xl font-bold ${sectionTitleColor}`}>{translate('reliefResources')}</h1>
        <p className={`mt-2 text-lg ${contrastMode ? 'text-slate-400' : 'text-slate-600'}`}>{translate('reliefResourcesSubtitle')}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className={`lg:w-1/4 p-6 rounded-xl shadow-lg space-y-6 self-start lg:sticky lg:top-24 ${contrastMode ? 'bg-[var(--dm-card-bg-color)]' : 'bg-white'}`}>
          <div>
            <h3 className={`text-sm font-semibold mb-2 ${textColor}`}>{translate('searchResourcesTitle')}</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder={translate('searchByNameOrService')} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-3 pl-10 text-sm rounded-lg ${inputBgColor} ${borderColor} focus:ring-2 focus:ring-[var(--current-primary-color)] focus:border-[var(--current-primary-color)] placeholder:text-gray-400`}
              />
              <i className={`fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--current-medium-text-color)] opacity-60`}></i> {/* Improved visibility */}
            </div>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-2 ${textColor}`}>{translate('categoriesTitle')}</h3>
            <div className="space-y-1.5">
              {categoryFilterItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors duration-150
                    ${activeCategory === item.id 
                      ? `bg-[var(--primary-blue)] text-white font-medium shadow-sm` 
                      : `${contrastMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'}`}`}
                >
                  <div className="flex items-center">
                    <i className={`fas ${item.icon} w-5 text-center mr-2.5 opacity-80`}></i>
                    <span>{translate(item.labelKey)}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === item.id ? 'bg-white/20' : (contrastMode ? 'bg-gray-600' : 'bg-slate-200')}`}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
           <div>
            <h3 className={`text-sm font-semibold mb-2 ${textColor}`}>{translate('sortByTitle')}</h3>
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'name' | 'distanceKm' | 'availabilityStatus')}
                className={`w-full p-3 text-sm rounded-lg ${inputBgColor} ${borderColor} focus:ring-2 focus:ring-[var(--current-primary-color)] focus:border-[var(--current-primary-color)]`}
            >
              <option value="name">{translate('name')}</option>
              <option value="distanceKm">{translate('distance')}</option>
              <option value="availabilityStatus">{translate('availability')}</option>
            </select>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:w-3/4 space-y-6">
          {filteredAndSortedResources.length > 0 ? (
            filteredAndSortedResources.map((resource, index) => (
              <div 
                key={resource.id} 
                className={`p-6 rounded-xl shadow-lg animated-element animate-fadeInUp ${contrastMode ? 'bg-[var(--dm-card-bg-color)] border border-[var(--dm-border-color)]' : 'bg-white'}`}
                style={{animationDelay: `${0.1 + index * 0.05}s`}}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
                  {/* Left part of card content */}
                  <div className="md:col-span-7 space-y-2.5">
                    <div className="flex items-start justify-between">
                        <h2 className={`text-xl font-bold ${sectionTitleColor}`}>{resource.name}</h2>
                        {getAvailabilityTag(resource.availabilityStatus)}
                    </div>
                    {resource.description && <p className={`text-sm ${textColor} leading-relaxed line-clamp-2`}>{resource.description}</p>}
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
                        {resource.distanceKm !== undefined && <p><i className="fas fa-road w-4 mr-1.5 opacity-70"></i>{resource.distanceKm.toFixed(1)} km</p>}
                        {resource.lastUpdateTime && <p><i className="fas fa-clock w-4 mr-1.5 opacity-70"></i>{formatLastUpdated(resource.lastUpdateTime, translate)}</p>}
                        <p className="col-span-2"><i className="fas fa-map-marker-alt w-4 mr-1.5 opacity-70"></i>{resource.address}</p>
                        <p><i className="fas fa-phone w-4 mr-1.5 opacity-70"></i>{resource.contact}</p>
                        {resource.operatingHours && <p><i className="fas fa-calendar-alt w-4 mr-1.5 opacity-70"></i>{resource.operatingHours}</p>}
                    </div>
                  </div>

                  {/* Right part of card content */}
                  <div className="md:col-span-5 space-y-3 md:pt-1">
                    {(typeof resource.currentCapacity === 'number' && typeof resource.maxCapacity === 'number' && resource.maxCapacity > 0) && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-medium ${textColor}`}>{translate('capacity')}</span>
                            <span className={`text-xs font-semibold ${textColor}`}>{resource.currentCapacity} / {resource.maxCapacity}</span>
                        </div>
                        <div className={`w-full h-2.5 rounded-full ${contrastMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                          <div 
                            className={`h-full rounded-full ${getProgressBarColor(resource.currentCapacity, resource.maxCapacity, resource.availabilityStatus)} transition-all duration-300`}
                            style={{ width: `${(resource.currentCapacity / resource.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {resource.services && resource.services.length > 0 && (
                      <div>
                        <span className={`text-xs font-medium mb-1.5 block ${textColor}`}>{translate('servicesAvailable')}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {resource.services.map(service => (
                            <span key={service} className={`px-2.5 py-1 text-xs rounded-full ${contrastMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-700'}`}>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons across bottom of card */}
                  <div className="md:col-span-12 flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-dashed">
                     <Button 
                        variant="primary" 
                        size="md" 
                        onClick={() => window.open(`tel:${resource.contact}`)}
                        className="flex-1 !py-2.5"
                        leftIcon={<i className="fas fa-phone"></i>}
                     >
                       {translate('callNow')}
                     </Button>
                     <Button 
                        variant="secondary" 
                        size="md" 
                        className={`flex-1 !py-2.5 ${contrastMode ? '!bg-green-600 hover:!bg-green-700 !text-white' : '!bg-green-500 hover:!bg-green-600 !text-white'}`}
                        onClick={() => window.open(`https://maps.google.com/?q=${resource.location.lat},${resource.location.lng}`, "_blank")}
                        leftIcon={<i className="fas fa-directions"></i>}
                     >
                       {translate('getDirections')}
                     </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`p-10 rounded-xl text-center ${contrastMode ? 'bg-[var(--dm-card-bg-color)]' : 'bg-white'}`}>
              <i className={`fas fa-search-minus text-6xl mb-6 ${contrastMode ? 'text-gray-600' : 'text-slate-400'}`}></i>
              <p className={`text-xl ${sectionTitleColor}`}>{translate('noResourcesFound')}</p>
              <p className={`${contrastMode ? 'text-slate-400' : 'text-slate-600'}`}>{translate('tryAdjustingFilters')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReliefResourcesPage;