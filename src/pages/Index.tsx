import React, { useState } from 'react';
import TruckInspection from '@/components/inspection/TruckInspection';
import DocumentCapture from '@/components/documents/DocumentCapture';
import FileGallery from '@/components/gallery/FileGallery';
import UploadManager from '@/components/upload/UploadManager';
import BottomNav from '@/components/navigation/BottomNav';

const Index = () => {
  const [activeTab, setActiveTab] = useState('inspection');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'inspection':
        return <TruckInspection />;
      case 'documents':
        return <DocumentCapture />;
      case 'gallery':
        return <FileGallery />;
      case 'upload':
        return <UploadManager />;
      default:
        return <TruckInspection />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {renderActiveComponent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
