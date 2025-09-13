import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraButton } from '@/components/ui/camera-button';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, Download, Upload, Scan, RotateCcw, X } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
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

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan documents",
        variant: "destructive",
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const startCapture = (type: string, name: string) => {
    setCurrentCapture({
      type,
      name,
      photos: []
    });
    startCamera();
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !currentCapture) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setCurrentCapture(prev => prev ? {
        ...prev,
        photos: [...prev.photos, imageDataUrl]
      } : null);
      
      toast({
        title: "Page Captured",
        description: `Page ${currentCapture.photos.length + 1} captured successfully`,
      });
    }
  }, [currentCapture]);

  const removePhoto = (index: number) => {
    setCurrentCapture(prev => prev ? {
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    } : null);
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
    stopCamera();
    
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

  const downloadDocument = (doc: CapturedDocument) => {
    if (doc.photos.length === 1) {
      // Single image download
      const link = document.createElement('a');
      link.download = `${doc.name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
      link.href = doc.photos[0];
      link.click();
    } else {
      // Multiple images - would need PDF generation library in real app
      toast({
        title: "Download Started",
        description: `${doc.name} PDF download would start here`,
      });
    }
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document Deleted",
      description: "Document removed successfully",
    });
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
            {cameraActive ? (
              <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {currentCapture.photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentCapture.photos.map((photo, index) => (
                  <div key={index} className="relative w-16 h-20 bg-secondary rounded overflow-hidden">
                    <img src={photo} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  stopCamera();
                  setCurrentCapture(null);
                }}
              >
                Cancel
              </Button>
              {cameraActive && (
                <CameraButton 
                  variant="capture" 
                  size="lg"
                  onClick={capturePhoto}
                >
                  <Camera className="h-6 w-6" />
                </CameraButton>
              )}
              {currentCapture.photos.length > 0 && (
                <Button onClick={finishCapture}>
                  Finish ({currentCapture.photos.length})
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
                  
                  {/* Photo Preview */}
                  {doc.photos.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto">
                      {doc.photos.slice(0, 3).map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`Page ${index + 1}`}
                          className="w-12 h-16 object-cover rounded flex-shrink-0"
                        />
                      ))}
                      {doc.photos.length > 3 && (
                        <div className="w-12 h-16 bg-muted rounded flex items-center justify-center text-xs">
                          +{doc.photos.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteDocument(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
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