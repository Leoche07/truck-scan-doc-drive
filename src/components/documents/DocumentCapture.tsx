import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraButton } from '@/components/ui/camera-button';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, Download, Upload, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CapturedDocument {
  id: string;
  name: string;
  type: 'bill-of-lading' | 'manifest' | 'inspection-report' | 'other';
  photos: string[];
  pdfGenerated: boolean;
  timestamp: Date;
}

const DocumentCapture = () => {
  const [documents, setDocuments] = useState<CapturedDocument[]>([]);
  const [currentCapture, setCurrentCapture] = useState<{
    type: string;
    name: string;
    photos: string[];
  } | null>(null);

  const documentTypes = [
    { id: 'bill-of-lading', name: 'Bill of Lading', icon: FileText },
    { id: 'manifest', name: 'Delivery Manifest', icon: FileText },
    { id: 'inspection-report', name: 'Inspection Report', icon: Scan },
    { id: 'other', name: 'Other Document', icon: FileText },
  ];

  const startCapture = (type: string, name: string) => {
    setCurrentCapture({
      type,
      name,
      photos: []
    });
  };

  const capturePhoto = () => {
    if (!currentCapture) return;
    
    const newPhoto = `photo-${Date.now()}`;
    setCurrentCapture(prev => prev ? {
      ...prev,
      photos: [...prev.photos, newPhoto]
    } : null);
    
    toast({
      title: "Photo Captured",
      description: `Page ${currentCapture.photos.length + 1} captured`,
    });
  };

  const finishCapture = () => {
    if (!currentCapture || currentCapture.photos.length === 0) return;
    
    const newDocument: CapturedDocument = {
      id: `doc-${Date.now()}`,
      name: currentCapture.name,
      type: currentCapture.type as any,
      photos: currentCapture.photos,
      pdfGenerated: false,
      timestamp: new Date()
    };
    
    setDocuments(prev => [newDocument, ...prev]);
    setCurrentCapture(null);
    
    // Simulate PDF generation
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocument.id 
            ? { ...doc, pdfGenerated: true }
            : doc
        )
      );
      
      toast({
        title: "PDF Generated",
        description: `${newDocument.name} converted to PDF successfully`,
      });
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-accent text-white border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Scan className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">Document Scanner</CardTitle>
          <p className="text-white/90">Capture and convert to PDF</p>
        </CardHeader>
      </Card>

      {/* Active Capture */}
      {currentCapture && (
        <Card className="border-inspection-accent bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="text-center">{currentCapture.name}</CardTitle>
            <p className="text-center text-muted-foreground">
              {currentCapture.photos.length} pages captured
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {currentCapture.photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentCapture.photos.map((photo, index) => (
                  <div key={photo} className="w-16 h-20 bg-secondary rounded flex items-center justify-center">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentCapture(null)}
              >
                Cancel
              </Button>
              <CameraButton 
                variant="capture" 
                size="lg"
                onClick={capturePhoto}
              >
                <Camera className="h-6 w-6" />
              </CameraButton>
              {currentCapture.photos.length > 0 && (
                <Button onClick={finishCapture}>
                  Finish
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Types */}
      {!currentCapture && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Document Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {documentTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={type.id} 
                  className="cursor-pointer transition-all hover:shadow-card hover:scale-105"
                  onClick={() => startCapture(type.id, type.name)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-2 text-inspection-primary" />
                    <p className="text-sm font-medium">{type.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Captured Documents */}
      {documents.length > 0 && !currentCapture && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Documents</h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="transition-all hover:shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.photos.length} pages • {doc.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.pdfGenerated ? (
                        <Badge className="bg-inspection-success text-white">
                          PDF Ready
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Processing...
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCapture;