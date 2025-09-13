import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Cloud, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadSettings {
  destination: 'google-drive' | 'custom-url' | 'local';
  autoUpload: boolean;
  compression: boolean;
}

const UploadManager = () => {
  const [uploadSettings, setUploadSettings] = useState<UploadSettings>({
    destination: 'google-drive',
    autoUpload: false,
    compression: true,
  });

  const [customUrl, setCustomUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const pendingUploads = [
    { id: '1', name: 'Truck Inspection - ABC123', files: 6, size: '12.4 MB' },
    { id: '2', name: 'Bill of Lading - Order #456', files: 3, size: '2.1 MB' },
    { id: '3', name: 'Delivery Manifest - Route 789', files: 2, size: '1.8 MB' },
  ];

  const recentUploads = [
    { id: '1', name: 'Previous Inspection', status: 'completed', timestamp: '2 hours ago' },
    { id: '2', name: 'Manifest Archive', status: 'completed', timestamp: '1 day ago' },
    { id: '3', name: 'Failed Upload', status: 'failed', timestamp: '2 days ago' },
  ];

  const handleUploadAll = async () => {
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsUploading(false);
    
    toast({
      title: "Upload Complete",
      description: `All files uploaded to ${uploadSettings.destination === 'google-drive' ? 'Google Drive' : 'custom destination'}`,
    });
  };

  const connectGoogleDrive = () => {
    toast({
      title: "Integration Required",
      description: "Connect to Supabase first to enable Google Drive integration",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-white border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Upload className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">Upload Manager</CardTitle>
          <p className="text-white/90">Sync files to cloud storage</p>
        </CardHeader>
      </Card>

      {/* Upload Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Upload Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destination">Upload Destination</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={uploadSettings.destination === 'google-drive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadSettings(prev => ({ ...prev, destination: 'google-drive' }))}
              >
                Google Drive
              </Button>
              <Button
                variant={uploadSettings.destination === 'custom-url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadSettings(prev => ({ ...prev, destination: 'custom-url' }))}
              >
                Custom URL
              </Button>
            </div>
          </div>

          {uploadSettings.destination === 'custom-url' && (
            <div>
              <Label htmlFor="custom-url">Upload URL</Label>
              <Input
                id="custom-url"
                placeholder="https://your-server.com/upload"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
          )}

          {uploadSettings.destination === 'google-drive' && (
            <Button variant="outline" className="w-full" onClick={connectGoogleDrive}>
              <Cloud className="h-4 w-4 mr-2" />
              Connect Google Drive
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Pending Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Uploads ({pendingUploads.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingUploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h3 className="font-medium text-sm">{upload.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {upload.files} files • {upload.size}
                </p>
              </div>
              <Badge variant="secondary">Ready</Badge>
            </div>
          ))}
          
          <Button 
            className="w-full" 
            onClick={handleUploadAll}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload All Files
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentUploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {upload.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-inspection-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <h3 className="font-medium text-sm">{upload.name}</h3>
                  <p className="text-xs text-muted-foreground">{upload.timestamp}</p>
                </div>
              </div>
              <Badge 
                variant={upload.status === 'completed' ? 'secondary' : 'destructive'}
                className={upload.status === 'completed' ? 'bg-inspection-success text-white' : ''}
              >
                {upload.status === 'completed' ? 'Success' : 'Failed'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadManager;