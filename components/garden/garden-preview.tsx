'use client';

import { PLANT_CONFIGS, GROWTH_STAGES, type PlantType } from './plants';
import type { EffortWeight } from '@/lib/db/schema';
import { PLANT_TYPES } from '@/lib/db/schema';

interface GardenPreviewProps {
  effortWeight: EffortWeight;
}

export function GardenPreview({ effortWeight }: GardenPreviewProps) {
  const possiblePlants = PLANT_TYPES[effortWeight];
  
  return (
    <div className="p-4 rounded-lg bg-muted/50 border">
      <h3 className="font-medium mb-3">What you could grow:</h3>
      <div className="flex gap-4 flex-wrap">
        {possiblePlants.map((plantType) => {
          const config = PLANT_CONFIGS[plantType as PlantType];
          return (
            <div
              key={plantType}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background"
            >
              <span className="text-3xl">{config.emoji}</span>
              <span className="text-sm font-medium">{config.name}</span>
              <span className="text-xs text-muted-foreground">
                {GROWTH_STAGES[5]}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Complete this task honestly to grow one of these plants to full maturity.
      </p>
    </div>
  );
}
