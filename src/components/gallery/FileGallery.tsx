import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Image, FileText, Trash2, Share, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: string;
  name: string;
  type: 'photo' | 'pdf';
  category: 'inspection' | 'document';
  size: string;
  timestamp: Date;
  thumbnail?: string;
}

const FileGallery = () => {
  const [galleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      name: 'Front View - Truck ABC123',
      type: 'photo',
      category: 'inspection',
      size: '2.4 MB',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: '2',
      name: 'Bill of Lading - Order #456',
      type: 'pdf',
      category: 'document',
      size: '1.2 MB',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      name: 'Driver Side - Truck ABC123',
      type: 'photo',
      category: 'inspection',
      size: '2.1 MB',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: '4',
      name: 'Delivery Manifest - Route 789',
      type: 'pdf',
      category: 'document',
      size: '0.8 MB',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'inspection' | 'document'>('all');

  const filteredItems = galleryItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-subtle border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FolderOpen className="h-8 w-8 text-inspection-primary" />
          </div>
          <CardTitle className="text-xl">File Gallery</CardTitle>
          <p className="text-muted-foreground">Manage captured photos and documents</p>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'inspection', label: 'Inspections' },
          { id: 'document', label: 'Documents' }
        ].map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id as any)}
            className="flex-1"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="transition-all hover:shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.type === 'photo' ? (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm truncate pr-2">{item.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        item.category === 'inspection' 
                          ? 'bg-inspection-primary/10 text-inspection-primary' 
                          : 'bg-inspection-accent/10 text-inspection-accent'
                      )}
                    >
                      {item.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span>{item.size}</span>
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 px-3">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-3">
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-3 text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="text-center p-8">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No files found</h3>
          <p className="text-sm text-muted-foreground">
            Start by capturing some photos or documents
          </p>
        </Card>
      )}
    </div>
  );
};

export default FileGallery;