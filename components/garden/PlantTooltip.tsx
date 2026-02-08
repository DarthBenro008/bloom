'use client';

import { Html } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import type { Task } from '@/lib/db/schema';
import { PLANT_CONFIGS, type PlantType } from './plants';

interface PlantTooltipProps {
  plantType: PlantType;
  task: Task | null;
  visible: boolean;
}

export function PlantTooltip({ plantType, task, visible }: PlantTooltipProps) {
  const router = useRouter();

  if (!visible || !task) return null;

  const config = PLANT_CONFIGS[plantType];
  const completedDate = task.completedAt 
    ? new Date(task.completedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'In progress';

  const handleClick = () => {
    router.push(`/tasks/${task.id}`);
  };

  return (
    <Html
      position={[0, 2.5, 0]}
      center
      style={{
        transition: 'all 0.2s',
        opacity: visible ? 1 : 0,
        transform: `scale(${visible ? 1 : 0.5})`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div 
        onClick={handleClick}
        className="bg-card border-2 border-border rounded-xl shadow-2xl p-4 min-w-[300px] max-w-[350px] cursor-pointer hover:bg-accent hover:border-primary transition-all hover:scale-105"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{config.emoji}</span>
          <div className="flex-1">
            <p className="font-semibold text-lg text-foreground">{config.name}</p>
            <p className="text-sm text-muted-foreground">{completedDate}</p>
          </div>
        </div>
        <p className="text-base text-foreground leading-snug line-clamp-3">{task.title}</p>
        <p className="text-xs text-muted-foreground mt-2 italic">Click to view task details</p>
      </div>
    </Html>
  );
}
