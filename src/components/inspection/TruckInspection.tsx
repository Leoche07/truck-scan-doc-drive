import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraButton } from '@/components/ui/camera-button';
import { Badge } from '@/components/ui/badge';
import { Camera, Check, ChevronRight, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InspectionPoint {
  id: string;
  name: string;
  description: string;
  photo?: string;
  completed: boolean;
}

const TruckInspection = () => {
  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>([
    { id: 'front', name: 'Front View', description: 'Front bumper, lights, windshield', completed: false },
    { id: 'driver-side', name: 'Driver Side', description: 'Side panel, mirrors, doors', completed: false },
    { id: 'passenger-side', name: 'Passenger Side', description: 'Side panel, mirrors, doors', completed: false },
    { id: 'rear', name: 'Rear View', description: 'Rear bumper, lights, license plate', completed: false },
    { id: 'engine', name: 'Engine Bay', description: 'Engine condition, fluids, belts', completed: false },
    { id: 'cabin', name: 'Cabin Interior', description: 'Dashboard, seats, controls', completed: false },
  ]);

  const [currentInspection, setCurrentInspection] = useState<string | null>(null);

  const handleTakePhoto = (pointId: string) => {
    // Simulate photo capture
    setInspectionPoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, completed: true, photo: `photo-${pointId}-${Date.now()}` }
          : point
      )
    );
    
    setCurrentInspection(null);
    
    toast({
      title: "Photo Captured",
      description: `${inspectionPoints.find(p => p.id === pointId)?.name} photo saved successfully`,
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
      {currentInspection && (
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
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentInspection(null)}
              >
                Cancel
              </Button>
              <CameraButton 
                variant="capture" 
                size="xl"
                onClick={() => handleTakePhoto(currentInspection)}
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
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
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
                  <div>
                    <h3 className="font-medium">{point.name}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {point.completed && (
                    <Badge variant="secondary" className="bg-inspection-success text-white">
                      Done
                    </Badge>
                  )}
                  {!point.completed && (
                    <CameraButton
                      size="sm"
                      onClick={() => setCurrentInspection(point.id)}
                    >
                      <Camera className="h-4 w-4" />
                    </CameraButton>
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