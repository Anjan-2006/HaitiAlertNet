
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { DisasterType, UserReport, ReportStatus, UserReportSubmissionData } from '../types';
import { DISASTER_TYPES, HAITI_REGIONS } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import useGeolocation from '../hooks/useGeolocation';
import { analyzeDisasterReport } from '../services/geminiService';


const ReportDisasterPage: React.FC = () => {
  const { translate, showNotification, contrastMode, isLoading: contextIsLoading, addReport, language: appLanguage } = useAppContext();
  const [disasterType, setDisasterType] = useState<DisasterType | ''>('');
  const [description, setDescription] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>(''); // For Haiti regions dropdown
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [contact, setContact] = useState<string>('');
  const [aiAssistance, setAiAssistance] = useState<{ summary?: string; suggestedType?: string; safetyTip?: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: geoData, loading: geoLoading, error: geoError, getPosition } = useGeolocation();


  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCurrentLocation = async () => {
    getPosition();
  };
  
  useEffect(() => {
    if (geoData) {
      showNotification(translate('locationFetched') || `Location fetched: ${geoData.latitude.toFixed(4)}, ${geoData.longitude.toFixed(4)}`, 'success');
    }
     if (geoError) {
        showNotification(`${translate('errorFetchingLocation')}: ${geoError instanceof Error ? geoError.message : String(geoError)}`, 'error');
    }
  }, [geoData, geoError, showNotification, translate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disasterType || !description || !selectedRegion) { 
      showNotification(translate('fillRequiredFields') || "Please fill in disaster type, description, and region/city.", 'error');
      return;
    }
    
    // setIsLoading from context is handled by addReport internally
    
    const reportDataForContext: UserReportSubmissionData = {
      type: disasterType,
      description,
      location: geoData ? { lat: geoData.latitude, lng: geoData.longitude } : null,
      locationText: selectedRegion,
      photoPreview, // photoUrl would be set upon actual upload to a server
      contact,
      // id, timestamp, status, submitter are set by AppContext
    };
    
    addReport(reportDataForContext); 

    // Reset form fields immediately. Success notification and loading state are handled by AppContext after the delay.
    setDisasterType('');
    setDescription('');
    setSelectedRegion(''); 
    setPhoto(null);
    setPhotoPreview(null);
    setContact('');
    setAiAssistance(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAiAssist = async () => {
    if (!description) {
      showNotification(translate('enterDescriptionForAI') || "Please enter a description for AI assistance.", 'info');
      return;
    }
    // Use contextIsLoading to show spinner specifically for AI assist if it's the one loading
    // This assumes contextIsLoading is true ONLY when addReport or AI is running.
    // If addReport sets global setIsLoading, we might need a local loading for AI.
    // For now, let's rely on contextIsLoading for the AI button, assuming it's correctly managed.
    const localAiIsLoading = true; // Placeholder if we need separate AI loading
    if (contextIsLoading && !aiAssistance) { /* AI is likely loading */ }

    setAiAssistance(null); 
    try {
      let imageBase64Data: string | undefined = undefined;
      if (photoPreview && photoPreview.startsWith('data:image')) {
        imageBase64Data = photoPreview.split(',')[1];
      }
      // Consider setting global loading here if AI assist is a longer operation
      // setIsLoading(true); // if handleAiAssist is the only user of global loader
      const result = await analyzeDisasterReport(description, imageBase64Data);
      // setIsLoading(false);
      setAiAssistance(result);
      if (result.suggestedType) {
        const matchedType = Object.values(DisasterType).find(dt => dt.toLowerCase() === result.suggestedType?.toLowerCase());
        if (matchedType) {
            setDisasterType(matchedType);
        } else if (result.suggestedType.toLowerCase() !== "other" && result.suggestedType.trim() !== "") {
            console.warn(`AI suggested type "${result.suggestedType}" not in predefined list.`);
        } else if (result.suggestedType.toLowerCase() === "other") {
            setDisasterType(DisasterType.Other);
        }
      }
      showNotification(translate('aiAssistanceGenerated') || "AI assistance generated!", 'success');
    } catch (error) {
      // setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : translate('errorGemini');
      showNotification(errorMessage, 'error');
      console.error(error);
    }
  };

  const labelClass = `block text-sm font-medium mb-2 ${contrastMode ? 'text-gray-200' : 'text-gray-700'}`; 
  const inputClass = `w-full p-3.5 border rounded-[var(--input-border-radius)] shadow-sm focus:ring-2 focus:outline-none text-base 
    ${contrastMode 
      ? 'bg-[var(--dm-card-bg-color)] text-white border-[var(--dm-border-color)] focus:ring-[var(--alert-red)] focus:border-[var(--alert-red)] placeholder:text-gray-500' 
      : 'bg-white border-[var(--border-color-light)] focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)] placeholder:text-gray-400'
    }`;
  
  // Distinguish AI loading from submit loading based on contextIsLoading state and if AI results are pending
  const aiButtonIsLoading = contextIsLoading && aiAssistance === null && description !== ""; // More specific condition for AI loading
  const submitButtonIsLoading = contextIsLoading && !aiButtonIsLoading; // Submit is loading if context is loading AND AI is not

  return (
    <div className="max-w-2xl mx-auto animated-element animate-fadeInUp">
      <Card 
        title={translate('reportDisasterPage')} 
        icon={<i className="fas fa-bullhorn"></i>}
        useGlassmorphism={true}
        style={{ animationDelay: '0.1s' }}
      >
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8"> 
          <div className="animated-element animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            <label htmlFor="disasterType" className={`${labelClass}`}>
              {translate('disasterType')} <span className="text-[var(--alert-red)]">*</span>
            </label>
            <select id="disasterType" value={disasterType} onChange={(e) => setDisasterType(e.target.value as DisasterType)} required className={inputClass} >
              <option value="" disabled>{translate('selectDisasterType')}</option>
              {DISASTER_TYPES.map(type => ( <option key={type} value={type}>{translate(type) || type}</option> ))}
            </select>
          </div>

          <div className="animated-element animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="description" className={`${labelClass}`}> {translate('description')} <span className="text-[var(--alert-red)]">*</span> </label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required placeholder={translate('enterDescription')} className={inputClass} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 items-center animated-element animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
            <Button type="button" onClick={handleAiAssist} variant="secondary" isLoading={aiButtonIsLoading} className="w-full sm:w-auto" leftIcon={<i className="fas fa-wand-magic-sparkles"></i>}>
              {translate('aiAssist')}
            </Button>
            {aiAssistance && (
              <Button type="button" onClick={() => setAiAssistance(null)} variant="ghost" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                {translate('clearAiHelp') || "Clear AI Help"}
              </Button>
            )}
          </div>
          
          {aiAssistance && (
            <div className={`p-4 rounded-lg overflow-hidden animated-element animate-fadeInUp ${contrastMode ? 'bg-[rgba(var(--alert-red-rgb),0.05)] border border-[var(--dm-border-color)]' : 'bg-[rgba(var(--primary-blue-rgb),0.03)] border border-[var(--border-color-light)]'}`} style={{ animationDelay: '0.3s' }}>
                {aiAssistance.summary && <p className="text-sm mb-2"><strong>{translate('aiSummary')}:</strong> {aiAssistance.summary}</p>}
                {aiAssistance.suggestedType && <p className="text-sm mb-2"><strong>{translate('aiSuggestedType') || "AI Suggested Type"}:</strong> {aiAssistance.suggestedType}</p>}
                {aiAssistance.safetyTip && <p className="text-sm"><strong>{translate('aiHelpfulTip')}:</strong> {aiAssistance.safetyTip}</p>}
            </div>
          )}


          <div className="animated-element animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
            <label htmlFor="haitiRegion" className={`${labelClass}`}>
              {translate('location')} <span className="text-[var(--alert-red)]">*</span> ({translate('selectRegion')})
            </label>
            <div className="flex flex-col sm:flex-row gap-3.5">
              <select 
                id="haitiRegion" 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value)} 
                required 
                className={`${inputClass} flex-grow`}
              >
                <option value="" disabled>{translate('selectRegion')}</option>
                {HAITI_REGIONS.map(region => (
                  <option key={region.value} value={region.value}>{translate(region.name) || region.name}</option>
                ))}
              </select>
              <Button type="button" onClick={handleUseCurrentLocation} variant="outline" isLoading={geoLoading} className="w-full sm:w-auto">
                <i className="fas fa-location-crosshairs mr-2.5"></i> {translate('useCurrentLocation')}
              </Button>
            </div>
            {geoData && <p className="text-xs mt-2 text-[var(--current-medium-text-color)]">GPS: Lat: {geoData.latitude.toFixed(4)}, Lon: {geoData.longitude.toFixed(4)}</p>}
          </div>

          <div className="animated-element animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <label htmlFor="photo" className={`${labelClass}`}>{translate('uploadPhoto')}</label>
            <input type="file" id="photo" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange}
              className={`${inputClass} file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold 
              ${contrastMode 
                ? 'file:bg-[var(--alert-red)] file:text-white hover:file:brightness-110' 
                : 'file:bg-[rgba(var(--primary-blue-rgb),0.1)] file:text-[var(--primary-blue)] hover:file:bg-[rgba(var(--primary-blue-rgb),0.2)]'}`}
            />
            {photoPreview && <img src={photoPreview} alt={translate('disasterImage') || "Preview"} className="mt-4 rounded-xl max-h-56 w-auto shadow-lg"/>}
          </div>

          <div className="animated-element animate-fadeInUp" style={{ animationDelay: '0.45s' }}>
            <label htmlFor="contact" className={`${labelClass}`}>{translate('contactInfoOptional')}</label>
            <input type="text" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={translate('enterContactInfo')} className={inputClass} />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full !py-4 animated-element animate-fadeInUp" style={{ animationDelay: '0.5s' }} isLoading={submitButtonIsLoading}>
            <i className="fas fa-paper-plane mr-2.5"></i> {translate('submitReport')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ReportDisasterPage;
