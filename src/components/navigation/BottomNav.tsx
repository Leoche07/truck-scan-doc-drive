import React from 'react';
import { Truck, Scan, FolderOpen, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'inspection', label: 'Inspection', icon: Truck },
    { id: 'documents', label: 'Documents', icon: Scan },
    { id: 'gallery', label: 'Gallery', icon: FolderOpen },
    { id: 'upload', label: 'Upload', icon: Upload },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 py-3 px-2 flex flex-col items-center gap-1 transition-all",
                isActive 
                  ? "text-inspection-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconComponent className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-inspection-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;