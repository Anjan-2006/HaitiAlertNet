

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import L, { LatLngExpression, Layer } from 'leaflet';
import { useAppContext } from '../contexts/AppContext';
import { DISASTER_TYPES, HAITI_CENTER, HAITI_INITIAL_ZOOM, DEFAULT_USER_REPORT_ZONE_RADIUS } from '../constants';
import { DisasterType, ReportStatus, UserReport, ReliefResource, ResourceCategory, DisasterZone, PointOfInterest } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import useGeolocation from '../hooks/useGeolocation';
import Alert from '../components/Alert'; 


const getStatusColor = (status: ReportStatus, contrastMode: boolean) => {
  if (contrastMode) {
    return status === ReportStatus.Verified ? '#34D399' : // Brighter Green
           status === ReportStatus.UnderReview ? '#FBBF24' : // Amber
           status === ReportStatus.New ? '#60A5FA' :  // Brighter Blue
           '#A0A0A0'; // Gray for Duplicate/Other
  }
  return status === ReportStatus.Verified ? '#10B981' : // Tailwind Green 500
         status === ReportStatus.UnderReview ? '#F59E0B' : // Tailwind Amber 500
         status === ReportStatus.New ? 'var(--primary-blue)' : 
         '#52525B'; // Tailwind Neutral 600 for Duplicate/Other
};

const getResourceIconClass = (category: ResourceCategory) => {
  const icons: { [key in ResourceCategory]: string } = {
    [ResourceCategory.Medical]: 'fa-kit-medical', 
    [ResourceCategory.Food]: 'fa-bowl-food', 
    [ResourceCategory.Shelter]: 'fa-house-chimney-user',
    [ResourceCategory.Water]: 'fa-solid fa-water', // Updated icon
    [ResourceCategory.EmergencyServices]: 'fa-truck-medical',
  };
  return icons[category] || 'fa-map-marker-alt';
};

const getResourceIconColor = (category: ResourceCategory, contrastMode: boolean) => {
  // Define colors for contrast mode first
  if (contrastMode) {
    switch(category) {
        case ResourceCategory.Medical: return 'var(--alert-red)'; // Red for medical in contrast
        case ResourceCategory.Shelter: return '#38BDF8'; // Light Blue for shelter
        case ResourceCategory.Water: return '#0EA5E9'; // Sky Blue for water
        case ResourceCategory.Food: return '#A3E635'; // Lime Green for food
        case ResourceCategory.EmergencyServices: return '#FACC15'; // Yellow for emergency
        default: return '#9CA3AF'; // Default gray
    }
  }
  // Define colors for normal mode
  switch(category) {
      case ResourceCategory.Medical: return 'var(--alert-red)';
      case ResourceCategory.Shelter: return 'var(--primary-blue)';
      case ResourceCategory.Water: return '#0284C7'; // Darker Sky Blue
      case ResourceCategory.Food: return '#65A30D'; // Darker Lime Green
      case ResourceCategory.EmergencyServices: return '#D97706'; // Darker Yellow/Amber
      default: return '#4B5563'; // Default dark gray
  }
};

const createMarkerIcon = (iconClass: string, color: string, faSize: string = '24px') => {
  const textShadow = document.body.classList.contains('contrast-mode') ? '0 0 5px rgba(0,0,0,0.8)' : '0 0 4px rgba(255,255,255,0.8)';
  return L.divIcon({
    html: `<i class="fas ${iconClass}" style="color: ${color}; font-size: ${faSize}; text-shadow: ${textShadow};"></i>`,
    className: 'custom-leaflet-icon', 
    iconSize: [parseInt(faSize,10), parseInt(faSize,10)],
    iconAnchor: [parseInt(faSize,10)/2, parseInt(faSize,10)],
    popupAnchor: [0, -parseInt(faSize,10) - 3] 
  });
};

type MainFilterType = 'All' | 'Disasters' | ResourceCategory;

interface LegendItemConfig {
  labelKey: string;
  displayElement: JSX.Element;
}

interface LegendSectionConfig {
  titleKey: string;
  items: LegendItemConfig[];
}


const LiveMapPage: React.FC = () => {
  const { 
    translate, contrastMode, showNotification, setIsLoading: setAppIsLoading, 
    reports: reportsData, 
    mockResources: resourcesData, 
    mockDisasterZones: disasterZonesData 
  } = useAppContext();
  
  const { data: geoData, loading: geoLoading, error: geoError, getPosition } = useGeolocation();
  
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<L.TileLayer | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  
  const reportLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const reportMarkerInstancesRef = useRef<Map<string, L.Marker>>(new Map());
  const resourceLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const resourceMarkerInstancesRef = useRef<Map<string, L.Marker>>(new Map());
  const zoneLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const zonePolygonInstancesRef = useRef<Map<string, L.Layer>>(new Map());
  
  const [selectedItem, setSelectedItem] = useState<PointOfInterest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeMainFilter, setActiveMainFilter] = useState<MainFilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGpsLocked, setIsGpsLocked] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');


  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: HAITI_CENTER as LatLngExpression, zoom: HAITI_INITIAL_ZOOM, zoomControl: false, 
      });
      L.control.zoom({ position: 'topright' }).addTo(map); // Changed from bottomright
      mapRef.current = map;
      reportLayersRef.current.addTo(map);
      resourceLayersRef.current.addTo(map);
      zoneLayersRef.current.addTo(map);
    }
    return () => {
      mapRef.current?.remove(); mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const allTimestamps = [
        ...reportsData.map(r => r.timestamp.getTime()),
        ...disasterZonesData.map(z => z.lastUpdated.getTime()),
        ...resourcesData.map(res => res.lastUpdateTime ? res.lastUpdateTime.getTime() : 0).filter(t => t > 0)
    ];
    if (allTimestamps.length > 0) {
        const latestTimestamp = Math.max(...allTimestamps);
        setLastUpdatedTime(new Date(latestTimestamp).toLocaleTimeString());
    } else {
        setLastUpdatedTime(new Date().toLocaleTimeString());
    }
  }, [reportsData, disasterZonesData, resourcesData]);


  useEffect(() => {
    if (mapRef.current) {
      const newTileUrl = contrastMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const newAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' + (contrastMode ? ', &copy; <a href="https://carto.com/attributions">CARTO</a>' : '');

      if (activeTileLayer) {
        activeTileLayer.setUrl(newTileUrl);
        // @ts-ignore
        if (activeTileLayer.options.attribution !== newAttribution) {
            mapRef.current.attributionControl.removeAttribution(activeTileLayer.options.attribution);
            mapRef.current.attributionControl.addAttribution(newAttribution);
            // @ts-ignore
            activeTileLayer.options.attribution = newAttribution;
        }
      } else {
        const tileLayer = L.tileLayer(newTileUrl, { attribution: newAttribution, maxZoom: 18, minZoom: 5 });
        tileLayer.addTo(mapRef.current);
        setActiveTileLayer(tileLayer);
      }
    }
  }, [contrastMode, activeTileLayer]);

  const openModalWithItem = (item: UserReport | ReliefResource | DisasterZone, itemType: 'report' | 'resource' | 'zone') => {
    setSelectedItem({ ...item, itemType } as PointOfInterest);
    setIsModalOpen(true);
  };
  
  const filteredData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    let showReports = activeMainFilter === 'All' || activeMainFilter === 'Disasters';
    let showZones = activeMainFilter === 'All' || activeMainFilter === 'Disasters';
    let showResourceCategory: ResourceCategory | null = null;

    if (activeMainFilter !== 'All' && activeMainFilter !== 'Disasters') {
        showResourceCategory = activeMainFilter as ResourceCategory;
        showReports = false;
        showZones = false;
    }

    const finalReports = showReports 
      ? reportsData.filter(r => searchLower === '' || r.description.toLowerCase().includes(searchLower) || (r.locationText && r.locationText.toLowerCase().includes(searchLower)) || r.type.toLowerCase().includes(searchLower)) 
      : [];
      
    const finalResources = resourcesData.filter(r => 
        (activeMainFilter === 'All' || r.category === showResourceCategory) &&
        (searchLower === '' || r.name.toLowerCase().includes(searchLower) || r.address.toLowerCase().includes(searchLower) || r.category.toLowerCase().includes(searchLower))
    );
      
    const finalZones = showZones 
      ? disasterZonesData.filter(z => searchLower === '' || z.name.toLowerCase().includes(searchLower) || z.type.toLowerCase().includes(searchLower)) 
      : [];

    return { reports: finalReports, resources: finalResources, zones: finalZones };
  }, [reportsData, resourcesData, disasterZonesData, activeMainFilter, searchTerm]);


  useEffect(() => {
    if (!mapRef.current) return;
    reportLayersRef.current.clearLayers();
    reportMarkerInstancesRef.current.clear();
    filteredData.reports.forEach(report => {
        if (!report.location) return;
        const iconColor = getStatusColor(report.status, contrastMode);
        const iconClass = report.status === ReportStatus.Verified ? 'fa-check-circle' :
                          report.status === ReportStatus.UnderReview ? 'fa-circle-exclamation' : 
                          report.status === ReportStatus.Duplicate ? 'fa-clone' : 'fa-triangle-exclamation'; 
        const newIcon = createMarkerIcon(iconClass, iconColor, '22px');
        const marker = L.marker([report.location.lat, report.location.lng] as LatLngExpression, { icon: newIcon })
            .bindTooltip(`<b>${translate(report.type)} (${translate(report.status)})</b><br>${report.description.substring(0,50)}...`, {className: 'modern-tooltip'})
            .on('click', () => openModalWithItem(report, 'report'));
        reportLayersRef.current.addLayer(marker);
        reportMarkerInstancesRef.current.set(report.id, marker);

        const reportAgeMs = Date.now() - new Date(report.timestamp).getTime();
        if ((report.status === ReportStatus.New || report.status === ReportStatus.UnderReview) && reportAgeMs < 10000 && report.submitter !== "AutoSim") { 
             mapRef.current?.flyTo([report.location.lat, report.location.lng], 14, { animate: true, duration: 1.5 });
             const markerElement = marker.getElement();
             if (markerElement) {
                markerElement.classList.add('animate-markerBounceIn');
                setTimeout(() => markerElement.classList.remove('animate-markerBounceIn'), 600);
            }
        }
    });
  }, [filteredData.reports, contrastMode, translate]); 


  useEffect(() => {
    if (!mapRef.current) return;
    resourceLayersRef.current.clearLayers();
    resourceMarkerInstancesRef.current.clear();
    filteredData.resources.forEach(resource => {
      const iconClass = getResourceIconClass(resource.category);
      const iconColor = getResourceIconColor(resource.category, contrastMode);
      const newIcon = createMarkerIcon(iconClass, iconColor, '24px'); 
      const marker = L.marker([resource.location.lat, resource.location.lng] as LatLngExpression, { icon: newIcon })
          .bindTooltip(`<b>${resource.name}</b><br>${translate(resource.category)}`, {className: 'modern-tooltip'})
          .on('click', () => openModalWithItem(resource, 'resource'));
      resourceLayersRef.current.addLayer(marker);
      resourceMarkerInstancesRef.current.set(resource.id, marker);
    });
  }, [filteredData.resources, contrastMode, translate]);


  useEffect(() => {
    if (!mapRef.current) return;
    zoneLayersRef.current.clearLayers();
    zonePolygonInstancesRef.current.clear();
    filteredData.zones.forEach(zone => {
      const color = zone.severity === 'High' ? 'var(--alert-red)' : 
                    zone.severity === 'Medium' ? (contrastMode ? '#FBBF24' : '#F59E0B') : 
                    (contrastMode ? '#38BDF8' : '#0EA5E9'); 
      const options = { color, fillColor: color, fillOpacity: 0.35, weight: 1.5 }; 
      let layer: L.Polygon | L.Circle;
      if (Array.isArray(zone.area)) { 
        layer = L.polygon(zone.area.map(p => [p.lat, p.lng]) as LatLngExpression[], options);
      } else { 
        layer = L.circle([zone.area.center.lat, zone.area.center.lng] as LatLngExpression, { ...options, radius: zone.area.radius });
      }
      layer.bindTooltip(`<b>${zone.name}</b><br>${translate('severity')}: ${translate(zone.severity)}`, {className: 'modern-tooltip'})
           .on('click', () => openModalWithItem(zone, 'zone'));
      zoneLayersRef.current.addLayer(layer);
      zonePolygonInstancesRef.current.set(zone.id, layer);
      
      if (zone.id.startsWith('zone-from-') && (Date.now() - new Date(zone.lastUpdated).getTime()) < 10000) {
          if (Array.isArray(zone.area)) {
              if (layer.getBounds) mapRef.current?.flyToBounds(layer.getBounds(), {padding: [50,50], duration: 1.5});
          } else {
              mapRef.current?.flyTo([zone.area.center.lat, zone.area.center.lng], 13, {animate: true, duration: 1.5});
          }
      }
    });
  }, [filteredData.zones, contrastMode, translate]); 

  const handleGpsLock = () => {
    if (!isGpsLocked) { // User is trying to activate GPS lock
      // Explicitly remove any existing user marker *before* trying to get new position
      if (userLocationMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }
      setAppIsLoading(true);
      getPosition();
    } else { // User is trying to disable GPS lock
      setIsGpsLocked(false);
      if (userLocationMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }
      mapRef.current?.flyTo(HAITI_CENTER, HAITI_INITIAL_ZOOM, {duration: 1});
    }
  };

  useEffect(() => {
    if (geoLoading) return; setAppIsLoading(false);
    if (geoData && mapRef.current) {
      setIsGpsLocked(true);
      const userLatLng: LatLngExpression = [geoData.latitude, geoData.longitude];
      mapRef.current.flyTo(userLatLng, 15, {animate: true, duration: 1.5});
      if (userLocationMarkerRef.current) userLocationMarkerRef.current.setLatLng(userLatLng);
      else userLocationMarkerRef.current = L.marker(userLatLng, { icon: L.divIcon({ className: 'leaflet-user-location-marker' }) }).addTo(mapRef.current);
    } else if (geoError) {
      setIsGpsLocked(false); showNotification(`${translate('gpsError')}: ${geoError instanceof Error ? geoError.message : String(geoError)}`, 'error');
    }
  }, [geoData, geoError, geoLoading, setAppIsLoading, showNotification, translate]);

  const mainFilterOptions: {id: MainFilterType, labelKey: string, icon: string}[] = [
    { id: 'All', labelKey: 'all', icon: 'fa-globe' },
    { id: 'Disasters', labelKey: 'disasters', icon: 'fa-triangle-exclamation' },
    { id: ResourceCategory.Medical, labelKey: 'Medical Facilities', icon: 'fa-briefcase-medical' },
    { id: ResourceCategory.Shelter, labelKey: 'Shelters', icon: 'fa-house-chimney' },
    { id: ResourceCategory.Food, labelKey: 'Food Security', icon: 'fa-utensils' },
    { id: ResourceCategory.Water, labelKey: 'Water Source', icon: 'fa-solid fa-water' }, // Updated icon
    { id: ResourceCategory.EmergencyServices, labelKey: 'Emergency Services', icon: 'fa-truck-medical' }
  ];

  const legendSections: LegendSectionConfig[] = useMemo(() => [
    {
      titleKey: 'legendUserReports',
      items: [
        { labelKey: 'legendReportVerified', displayElement: <span style={{height: '14px', width: '14px', backgroundColor: getStatusColor(ReportStatus.Verified, contrastMode), borderRadius: '50%', display: 'inline-block', marginRight: '8px'}}></span> },
        { labelKey: 'legendReportUnderReview', displayElement: <span style={{height: '14px', width: '14px', backgroundColor: getStatusColor(ReportStatus.UnderReview, contrastMode), borderRadius: '50%', display: 'inline-block', marginRight: '8px'}}></span> },
        { labelKey: 'legendReportNew', displayElement: <span style={{height: '14px', width: '14px', backgroundColor: getStatusColor(ReportStatus.New, contrastMode), borderRadius: '50%', display: 'inline-block', marginRight: '8px'}}></span> },
      ]
    },
    {
      titleKey: 'legendReliefResources',
      items: [
        { labelKey: 'legendMedicalFacility', displayElement: <i className={`fas ${getResourceIconClass(ResourceCategory.Medical)} mr-2`} style={{color: getResourceIconColor(ResourceCategory.Medical, contrastMode) }}></i> },
        { labelKey: 'legendShelter', displayElement: <i className={`fas ${getResourceIconClass(ResourceCategory.Shelter)} mr-2`} style={{color: getResourceIconColor(ResourceCategory.Shelter, contrastMode) }}></i> },
        { labelKey: 'legendWaterSource', displayElement: <i className={`fas ${getResourceIconClass(ResourceCategory.Water)} mr-2`} style={{color: getResourceIconColor(ResourceCategory.Water, contrastMode) }}></i> },
      ]
    },
    {
      titleKey: 'legendDisasterZones',
      items: [
        { labelKey: 'legendZoneHigh', displayElement: <span style={{height: '14px', width: '14px', backgroundColor: 'var(--alert-red)', display: 'inline-block', marginRight: '8px', opacity: 0.7}}></span> },
        { labelKey: 'legendZoneMedium', displayElement: <span style={{height: '14px', width: '14px', backgroundColor: (contrastMode ? '#FBBF24' : '#F59E0B'), display: 'inline-block', marginRight: '8px', opacity: 0.7}}></span> },
        { labelKey: 'legendZoneLow', displayElement: <span style={{height: '14px', width: '14px', backgroundColor: (contrastMode ? '#38BDF8' : '#0EA5E9'), display: 'inline-block', marginRight: '8px', opacity: 0.7}}></span> },
      ]
    }
  ], [contrastMode, translate]);
  
  const textColor = contrastMode ? 'text-gray-200' : 'text-slate-700';

  return (
    <div className="flex flex-col h-full animated-element animate-fadeInUp" style={{animationDelay: '0.1s'}}>
        <header className="mb-6 md:mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold ${contrastMode ? 'text-slate-100' : 'text-slate-800'}`}>{translate('liveDisasterMapTitle')}</h1>
            <p className={`${contrastMode ? 'text-slate-400' : 'text-slate-600'} mt-1 text-lg`}>{translate('liveDisasterMapSubtitle')}</p>
        </header>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-theme(space.56)-4rem)]"> {/* Adjusted height calculation */}
            {/* Filters Sidebar */}
            <div className={`lg:col-span-3 bg-white p-6 rounded-xl shadow-lg overflow-y-auto space-y-6 ${contrastMode ? 'bg-[var(--dm-card-bg-color)] border border-[var(--dm-border-color)]' : 'bg-white'}`}>
                <h2 className={`text-xl font-semibold flex items-center ${textColor}`}>
                    <i className="fas fa-filter mr-2.5 opacity-80"></i>
                    {translate('filtersTitle')}
                </h2>
                <div className="space-y-1">
                    {mainFilterOptions.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setActiveMainFilter(opt.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                                ${activeMainFilter === opt.id 
                                    ? `bg-[var(--primary-blue)] text-white shadow-md` 
                                    : `${contrastMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-100'}`}`}
                        >
                            <i className={`fas ${opt.icon} w-5 text-center opacity-90`}></i>
                            <span>{translate(opt.labelKey)}</span>
                        </button>
                    ))}
                </div>

                <div className="pt-4 border-t mt-auto">
                    <h3 className={`text-md font-semibold mb-3 ${textColor}`}>{translate('legendTitle')}</h3>
                    <div className="space-y-4 text-sm">
                        {legendSections.map(section => (
                            <div key={section.titleKey}>
                                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${contrastMode ? 'text-slate-400' : 'text-slate-500'}`}>{translate(section.titleKey)}</h4>
                                <ul className="space-y-1.5">
                                    {section.items.map(item => (
                                    <li key={item.labelKey} className="flex items-center">
                                        {item.displayElement}
                                        <span className={textColor}>{translate(item.labelKey)}</span>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className={`lg:col-span-9 bg-white p-1 md:p-2 rounded-xl shadow-lg flex flex-col ${contrastMode ? 'bg-[var(--dm-card-bg-color)] border border-[var(--dm-border-color)]' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-3 px-4 pt-4 md:pt-2">
                    <h2 className={`text-xl font-semibold ${textColor}`}>{translate('interactiveMapViewTitle')}</h2>
                    <p className={`text-xs ${contrastMode ? 'text-slate-400' : 'text-slate-500'}`}>{translate('lastUpdatedTimestamp', { time: lastUpdatedTime })}</p>
                </div>
                <div ref={mapContainerRef} className="flex-grow h-[calc(100%-3rem)] w-full outline-none relative rounded-lg overflow-hidden">
                    <div className="absolute top-3 right-3 z-[1000] flex flex-col space-y-2.5 custom-map-controls">
                        <div className="custom-map-search flex items-center p-1 rounded-[var(--input-border-radius)] shadow-lg">
                            <input type="text" placeholder={translate('searchLocationPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="text-sm p-2 outline-none w-full placeholder:text-sm placeholder:text-[var(--current-medium-text-color)]"
                            /> <i className={`fas fa-search mx-2 opacity-60 text-[var(--current-medium-text-color)]`}></i>
                        </div>
                        <button onClick={handleGpsLock} title={isGpsLocked ? translate('gpsUnlock') : translate('gpsLock')} aria-pressed={isGpsLocked}
                          className={`p-3 rounded-[var(--input-border-radius)] shadow-lg hover:brightness-110 active:scale-95 transition-all`}
                        > <i className={`fas ${isGpsLocked ? 'fa-location-crosshairs text-[var(--current-primary-color)]' : 'fa-location-arrow'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
      {isModalOpen && selectedItem && (
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null);}} 
            title={translate( selectedItem.itemType === 'report' ? 'reportDetails' : selectedItem.itemType === 'resource' ? 'resourceDetails' : 'disasterZone' )} size="md"
        >
          <div className={`${contrastMode ? 'text-gray-200' : 'text-slate-700'}`}>
            {selectedItem.itemType === 'report' && <>
              <h4 className={`text-lg font-semibold mb-1.5 ${contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]'}`}>{translate(selectedItem.type)} - <span style={{color: getStatusColor(selectedItem.status, contrastMode)}}>{translate(selectedItem.status)}</span></h4>
              <p className="mb-2.5"><strong>{translate('description')}:</strong> {selectedItem.description}</p>
              {selectedItem.locationText && <p className="mb-2.5"><strong>{translate('location')}:</strong> {selectedItem.locationText}</p>}
              <p className="mb-2.5 text-sm text-[var(--current-medium-text-color)]"><strong>{translate('submittedOn')}:</strong> {new Date(selectedItem.timestamp).toLocaleString()}</p>
              {selectedItem.submitter && <p className="mb-2.5 text-sm text-[var(--current-medium-text-color)]"><strong>{translate('submittedBy')}:</strong> {selectedItem.submitter}</p>}
              {(selectedItem.photoUrl || selectedItem.photoPreview) && <img src={selectedItem.photoPreview || selectedItem.photoUrl} alt={translate('disasterImage')} className="mt-3 rounded-lg max-h-60 w-auto shadow-md"/>}
            </>}
             {selectedItem.itemType === 'resource' && <>
              <h4 className={`text-lg font-semibold mb-1.5 ${contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]'}`}>{selectedItem.name}</h4>
              <p className="mb-2.5"><strong>{translate('category')}:</strong> {translate(selectedItem.category)}</p>
              <p className="mb-2.5"><strong>{translate('address')}:</strong> {selectedItem.address}</p>
              <p className="mb-2.5"><strong>{translate('contact')}:</strong> {selectedItem.contact}</p>
              <p className="mb-2.5"><strong>{translate('availabilityStatus')}:</strong> {translate(selectedItem.availabilityStatus) || selectedItem.availabilityStatus}</p>
              {selectedItem.operatingHours && <p className="mb-2.5"><strong>{translate('operatingHours')}:</strong> {selectedItem.operatingHours}</p>}
            </>}
            {selectedItem.itemType === 'zone' && <>
              <h4 className={`text-lg font-semibold mb-1.5 ${contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]'}`}>{selectedItem.name}</h4>
              <p className="mb-2.5"><strong>{translate('disasterType')}:</strong> {translate(selectedItem.type)}</p>
              <p className="mb-2.5"><strong>{translate('severity')}:</strong> <span style={{color: selectedItem.severity === 'High' ? 'var(--alert-red)' : selectedItem.severity === 'Medium' ? (contrastMode ? '#FBBF24' : '#F59E0B') : (contrastMode ? '#60A5FA' : '#0EA5E9')}}>{translate(selectedItem.severity)}</span></p>
              {Array.isArray(selectedItem.area) ? 
                <p className="mb-2.5 text-sm"><strong>{translate('affectedArea')}:</strong> Polygon</p> :
                <p className="mb-2.5 text-sm"><strong>{translate('affectedArea')}:</strong> Circle, Radius: {(selectedItem.area.radius / 1000).toFixed(2)} km</p>
              }
              <p className="mb-2.5 text-sm text-[var(--current-medium-text-color)]"><strong>{translate('lastUpdated')}:</strong> {new Date(selectedItem.lastUpdated).toLocaleDateString()}</p>
              {selectedItem.description && <p className="mb-2.5"><strong>{translate('description')}:</strong> {selectedItem.description}</p>}
            </>}
          </div>
        </Modal>
      )}
      <style>{`
        .modern-tooltip {
          background-color: var(--current-glass-bg) !important;
          color: var(--current-text-color) !important;
          border: 1px solid var(--current-glass-border) !important;
          border-radius: var(--input-border-radius) !important;
          box-shadow: var(--current-glass-shadow) !important;
          backdrop-filter: blur(var(--current-glass-blur)); 
          padding: 8px 12px !important;
          font-size: 0.875rem !important; 
        }
        .leaflet-control-zoom { top: 0.75rem; right: 0.75rem;} /* Reposition zoom to top-right */
      `}</style>
    </div>
  );
};

export default LiveMapPage;