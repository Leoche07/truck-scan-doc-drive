import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraButton } from '@/components/ui/camera-button';
import { Badge } from '@/components/ui/badge';
import { Camera, Check, ChevronRight, Truck, RotateCcw, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InspectionPoint {
  id: string;
  name: string;
  description: string;
  photo?: string;
  completed: boolean;
}

const TruckInspection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<{[key: string]: string}>({});
  
  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>([
    { id: 'front', name: 'Front View', description: 'Front bumper, lights, windshield', completed: false },
    { id: 'driver-side', name: 'Driver Side', description: 'Side panel, mirrors, doors', completed: false },
    { id: 'passenger-side', name: 'Passenger Side', description: 'Side panel, mirrors, doors', completed: false },
    { id: 'rear', name: 'Rear View', description: 'Rear bumper, lights, license plate', completed: false },
    { id: 'engine', name: 'Engine Bay', description: 'Engine condition, fluids, belts', completed: false },
    { id: 'cabin', name: 'Cabin Interior', description: 'Dashboard, seats, controls', completed: false },
  ]);

  const [currentInspection, setCurrentInspection] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

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
        description: "Please allow camera access to take photos",
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

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !currentInspection) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setCapturedPhotos(prev => ({
        ...prev,
        [currentInspection]: imageDataUrl
      }));
      
      setInspectionPoints(prev => 
        prev.map(point => 
          point.id === currentInspection 
            ? { ...point, completed: true, photo: imageDataUrl }
            : point
        )
      );
      
      stopCamera();
      setCurrentInspection(null);
      
      toast({
        title: "Photo Captured",
        description: `${inspectionPoints.find(p => p.id === currentInspection)?.name} photo saved`,
      });
    }
  }, [currentInspection, inspectionPoints, stopCamera]);

  const startInspectionCapture = (pointId: string) => {
    setCurrentInspection(pointId);
    startCamera();
  };

  const retakePhoto = (pointId: string) => {
    setCapturedPhotos(prev => {
      const updated = { ...prev };
      delete updated[pointId];
      return updated;
    });
    
    setInspectionPoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, completed: false, photo: undefined }
          : point
      )
    );
    
    startInspectionCapture(pointId);
  };

  const downloadPhoto = (pointId: string) => {
    const photo = capturedPhotos[pointId];
    if (!photo) return;
    
    const link = document.createElement('a');
    link.download = `${inspectionPoints.find(p => p.id === pointId)?.name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    link.href = photo;
    link.click();
    
    toast({
      title: "Photo Downloaded",
      description: "Photo saved to your device",
    });
  };

  const completedCount = inspectionPoints.filter(point => point.completed).length;
  const totalPoints = inspectionPoints.length;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-white border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Truck className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">Truck Inspection</CardTitle>
          <p className="text-white/90">Complete all inspection points</p>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold">{completedCount}/{totalPoints}</div>
            <div className="text-white/90">Points Completed</div>
          </div>
        </CardContent>
      </Card>

      {/* Camera View */}
      {currentInspection && cameraActive && (
        <Card className="border-inspection-accent bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="text-center">
              {inspectionPoints.find(p => p.id === currentInspection)?.name}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {inspectionPoints.find(p => p.id === currentInspection)?.description}
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  stopCamera();
                  setCurrentInspection(null);
                }}
              >
                Cancel
              </Button>
              <CameraButton 
                variant="capture" 
                size="xl"
                onClick={capturePhoto}
              >
                <Camera className="h-6 w-6" />
              </CameraButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inspection Points */}
      {!currentInspection && (
        <div className="space-y-3">
          {inspectionPoints.map((point) => (
            <Card key={point.id} className="transition-all hover:shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    point.completed 
                      ? 'bg-inspection-success text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {point.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{point.name}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                  {point.completed && (
                    <Badge variant="secondary" className="bg-inspection-success text-white">
                      Done
                    </Badge>
                  )}
                </div>
                
                {/* Photo Preview */}
                {point.completed && capturedPhotos[point.id] && (
                  <div className="mb-3">
                    <img 
                      src={capturedPhotos[point.id]} 
                      alt={point.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!point.completed ? (
                    <CameraButton
                      size="sm"
                      onClick={() => startInspectionCapture(point.id)}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </CameraButton>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retakePhoto(point.id)}
                        className="flex-1"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retake
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPhoto(point.id)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Complete Inspection */}
      {completedCount === totalPoints && (
        <Card className="bg-gradient-accent text-white border-0">
          <CardContent className="text-center p-6">
            <Check className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inspection Complete!</h3>
            <p className="text-white/90 mb-4">All photos captured successfully</p>
            <Button variant="secondary" className="w-full">
              Upload to Drive
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TruckInspection;