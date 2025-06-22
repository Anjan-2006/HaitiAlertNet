

import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UserReport, ReportStatus, DisasterType } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';


const getStatusChipClasses = (status: ReportStatus, contrastMode: boolean): string => {
  let base = "text-xs font-semibold px-3.5 py-1.5 rounded-full inline-block border "; 
  if (contrastMode) {
    switch (status) {
      case ReportStatus.Verified: return base + "bg-green-700/80 text-green-100 border-green-600";
      case ReportStatus.UnderReview: return base + "bg-yellow-600/80 text-yellow-100 border-yellow-500";
      case ReportStatus.New: return base + "bg-blue-700/80 text-blue-100 border-blue-500"; 
      default: return base + "bg-gray-600/80 text-gray-200 border-gray-500"; 
    }
  } else {
    switch (status) {
      case ReportStatus.Verified: return base + "bg-green-100 text-green-800 border-green-300";
      case ReportStatus.UnderReview: return base + "bg-yellow-100 text-yellow-800 border-yellow-300";
      case ReportStatus.New: return base + "bg-blue-100 text-blue-800 border-blue-300"; 
      default: return base + "bg-gray-100 text-gray-800 border-gray-300"; 
    }
  }
};

const AdminVerificationPage: React.FC = () => {
  const { translate, contrastMode, reports, updateReportStatus } = useAppContext();
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleSelectReport = (report: UserReport) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (reportId: string, newStatus: ReportStatus) => {
    updateReportStatus(reportId, newStatus);
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const textColor = contrastMode ? 'text-gray-200' : 'text-slate-800';
  const secondaryTextColor = contrastMode ? 'text-[var(--dm-medium-text-color)]' : 'text-[var(--medium-text)]';
  const sectionTitleColor = contrastMode ? 'text-slate-100' : 'text-slate-800';
  const itemTitleColor = contrastMode ? 'text-[var(--alert-red)]' : 'text-[var(--primary-blue)]';

  const sortedReports = [...reports].sort((a, b) => {
    const statusOrder = [ReportStatus.New, ReportStatus.UnderReview, ReportStatus.Verified, ReportStatus.Duplicate];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) || (b.timestamp.getTime() - a.timestamp.getTime());
  });
  

  const getDisasterIcon = (type: DisasterType) => {
     switch(type) {
        case DisasterType.Flood: return 'fa-house-flood-water'; 
        case DisasterType.Earthquake: return 'fa-house-crack';
        case DisasterType.Fire: return 'fa-fire-flame-curved'; 
        case DisasterType.Hurricane: return 'fa-hurricane'; 
        case DisasterType.Storm: return 'fa-cloud-showers-heavy'; 
        case DisasterType.Landslide: return 'fa-hill-rockslide'; 
        default: return 'fa-triangle-exclamation';
     }
  }

  return (
    <div className="animated-element animate-fadeInUp" style={{animationDelay: '0.1s'}}>
      <header className="mb-12 text-center animated-element animate-fadeInUp" style={{animationDelay: '0.15s'}}>
        <h1 className={`text-3xl md:text-4xl font-bold ${sectionTitleColor} tracking-tight`}>{translate('adminVerificationPanel')}</h1>
        <p className={`${secondaryTextColor} mt-2.5 text-lg`}>{translate('manageReportsDesc') || "Review and verify citizen-submitted disaster reports."}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {sortedReports.map((report, index) => (
          <div key={report.id} className="report-card-item"> 
            <Card 
              className="hover:shadow-2xl transition-shadow flex flex-col justify-between h-full" 
              useGlassmorphism={true}
              style={{animationDelay: `${0.2 + index * 0.07}s`}} 
            >
              <div> 
                <div className="flex items-center mb-3.5">
                   <i className={`fas ${getDisasterIcon(report.type)} ${itemTitleColor} text-2xl mr-3.5`}></i>
                   <h3 className={`text-xl font-semibold ${sectionTitleColor} leading-tight`}>{translate(report.type) || report.type} Report</h3>
                </div>
                <p className={`text-sm mb-2.5 line-clamp-3 ${textColor}`}>{report.description}</p>
                {report.locationText && <p className={`text-xs ${secondaryTextColor} mb-1.5`}><i className="fas fa-map-marker-alt mr-2 opacity-70"></i>{report.locationText}</p>}
                <p className={`text-xs ${secondaryTextColor} mb-4`}>
                    <i className="fas fa-clock mr-2 opacity-70"></i>{new Date(report.timestamp).toLocaleString()}
                </p>
                
                <div className={`${getStatusChipClasses(report.status, contrastMode)} mb-5`}>
                    {translate('currentStatus')}: {translate(report.status)}
                </div>

                {(report.photoUrl || report.photoPreview) && <img src={report.photoPreview || report.photoUrl} alt={translate('disasterImage')} className="rounded-xl max-h-44 w-full object-cover mb-5 shadow-lg"/>}
              </div>
              
              <Button onClick={() => handleSelectReport(report)} variant="primary" className="w-full mt-auto">
                <i className="fas fa-edit mr-2.5"></i>{translate('reviewAndVerify') || "Review & Verify"}
              </Button>
            </Card>
          </div>
        ))}
        {reports.length === 0 && (
             <p className={`md:col-span-2 lg:col-span-3 text-center py-16 ${secondaryTextColor} text-xl animated-element animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>{translate('noReportsFound')}</p>
        )}
      </div>

      {selectedReport && (
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedReport(null); }} title={`${translate('verifyReport')}: ${selectedReport.id.substring(0,10)}...`}>
          <div className={`${textColor}`}>
            <h4 className={`text-xl font-semibold mb-2.5 ${itemTitleColor}`}>{translate(selectedReport.type)}</h4>
            <p className="mb-3"><strong>{translate('description')}:</strong> {selectedReport.description}</p>
            {selectedReport.locationText && <p className="mb-3"><strong>{translate('location')}:</strong> {selectedReport.locationText}</p>}
            {(selectedReport.photoPreview || selectedReport.photoUrl) && <img src={selectedReport.photoPreview || selectedReport.photoUrl} alt={translate('disasterImage')} className="my-4 rounded-xl max-h-96 w-auto shadow-lg"/>} 
            <p className="mb-6"><strong>{translate('currentStatus') || "Current Status"}:</strong> <span className={`${getStatusChipClasses(selectedReport.status, contrastMode)}`}>{translate(selectedReport.status)}</span></p>

            <h5 className={`text-md font-semibold mb-3 ${textColor}`}>{translate('tagReportAs')}:</h5>
            <div className="grid grid-cols-2 gap-3.5">
              {[ReportStatus.Verified, ReportStatus.UnderReview, ReportStatus.New, ReportStatus.Duplicate].map(statusOption => (
                <Button
                  key={statusOption}
                  onClick={() => handleUpdateStatus(selectedReport.id, statusOption)}
                  variant={selectedReport.status === statusOption ? 'primary' : 'secondary'}
                  disabled={selectedReport.status === statusOption}
                  className="w-full"
                >
                  {translate(statusOption)}
                </Button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminVerificationPage;