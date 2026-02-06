'use client';

import { Html } from '@react-three/drei';
import type { Task } from '@/lib/db/schema';
import { PLANT_CONFIGS, type PlantType } from './plants';

interface PlantTooltipProps {
  plantType: PlantType;
  task: Task | null;
  visible: boolean;
}

export function PlantTooltip({ plantType, task, visible }: PlantTooltipProps) {
  if (!visible || !task) return null;

  const config = PLANT_CONFIGS[plantType];
  const completedDate = task.completedAt 
    ? new Date(task.completedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'In progress';

  return (
    <Html
      position={[0, 2, 0]}
      center
      distanceFactor={6}
      style={{
        transition: 'all 0.2s',
        opacity: visible ? 1 : 0,
        transform: `scale(${visible ? 1 : 0.5})`,
        pointerEvents: 'none',
      }}
    >
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{config.emoji}</span>
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">{config.name}</p>
            <p className="text-xs text-muted-foreground">{completedDate}</p>
          </div>
        </div>
        <p className="text-sm text-foreground line-clamp-2">{task.title}</p>
      </div>
    </Html>
  );
}
