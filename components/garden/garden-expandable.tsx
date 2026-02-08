'use client';

import { useState } from 'react';
import { Expand } from 'lucide-react';
import { Garden3D } from './garden-3d';
import { Button } from '@/components/ui/button';
import type { Plant, Task } from '@/lib/db/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GardenExpandableProps {
  plants: (Plant & { task: Task })[];
  health: number;
  completedCount: number;
}

export function GardenExpandable({ plants, health, completedCount }: GardenExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Compact garden with floating expand button */}
      <div className="relative">
        <Garden3D plants={plants} width={360} height={360} />
        
        {/* Floating expand button */}
        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute top-2 right-2 shadow-lg hover:shadow-xl hover:scale-110 transition-all backdrop-blur-sm bg-background/90 hover:bg-background"
              aria-label="Expand garden view"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          
          <DialogContent 
            size="xl" 
            className="max-h-[90vh] p-0 gap-0 overflow-hidden"
          >
            <DialogHeader className="p-4 pb-2">
              <DialogTitle className="text-xl">Your Garden</DialogTitle>
            </DialogHeader>
            
            {/* Large garden view */}
            <div className="px-4 flex items-center justify-center">
              <div className="w-full">
                <Garden3D plants={plants} width={896} height={600} />
              </div>
            </div>
            
            {/* Stats footer */}
            <div className="bg-muted/50 border-t p-4 mt-4">
              <div className="grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-bold text-primary">
                    {plants.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Plants Growing</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-bold text-primary">
                    {health}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Garden Health</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-bold text-primary">
                    {completedCount}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Tasks Completed</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
