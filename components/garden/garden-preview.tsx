"use client";

import { PLANT_CONFIGS, GROWTH_STAGES, type PlantType } from "./plants";
import type { EffortWeight } from "@/lib/db/schema";
import { PLANT_TYPES } from "@/lib/db/schema";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GardenPreviewProps {
  effortWeight: EffortWeight;
}

export function GardenPreview({ effortWeight }: GardenPreviewProps) {
  const possiblePlants = PLANT_TYPES[effortWeight];

  return (
    <div className="p-3 rounded-lg bg-muted/50 border">
      {/* Header with info icon */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm">What you could grow:</h3>
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
              aria-label="How the plant system works"
            >
              <Info className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">
                🌱 How Your Garden Grows
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Complete tasks to grow plants in your garden! Each effort level
                grows different plants:
              </p>

              {/* Light Effort Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌱</span>
                  <h4 className="font-medium text-sm">Light Effort</h4>
                  <span className="text-xs text-muted-foreground">
                    Quick tasks, under 1 hour
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["daisy", "tulip", "poppy"] as PlantType[]).map(
                    (plantType) => {
                      const config = PLANT_CONFIGS[plantType];
                      return (
                        <div
                          key={plantType}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background border"
                        >
                          <span className="text-3xl">{config.emoji}</span>
                          <span className="text-xs font-medium text-center">
                            {config.name}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Medium Effort Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌿</span>
                  <h4 className="font-medium text-sm">Medium Effort</h4>
                  <span className="text-xs text-muted-foreground">
                    Focused work, 2-4 hours
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["rose", "sunflower", "lavender"] as PlantType[]).map(
                    (plantType) => {
                      const config = PLANT_CONFIGS[plantType];
                      return (
                        <div
                          key={plantType}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background border"
                        >
                          <span className="text-3xl">{config.emoji}</span>
                          <span className="text-xs font-medium text-center">
                            {config.name}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Heavy Effort Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌳</span>
                  <h4 className="font-medium text-sm">Heavy Effort</h4>
                  <span className="text-xs text-muted-foreground">
                    Deep work, 4+ hours
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["oak", "cherry_blossom", "maple"] as PlantType[]).map(
                    (plantType) => {
                      const config = PLANT_CONFIGS[plantType];
                      return (
                        <div
                          key={plantType}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background border"
                        >
                          <span className="text-3xl">{config.emoji}</span>
                          <span className="text-xs font-medium text-center">
                            {config.name}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Health Explanation */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">💚</span>
                  <div>
                    <p className="text-sm font-medium">
                      Honest work = Flourishing plants
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Complete tasks genuinely and watch your garden thrive
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">💔</span>
                  <div>
                    <p className="text-sm font-medium">
                      Skipping or false claims = Plants wither
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your garden reflects your true effort
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter showCloseButton>
              {/*<Button>Got it!</Button>*/}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compact plant grid */}
      <div className="flex gap-2 justify-center flex-wrap">
        {possiblePlants.map((plantType) => {
          const config = PLANT_CONFIGS[plantType as PlantType];
          return (
            <div
              key={plantType}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background"
            >
              <span className="text-2xl">{config.emoji}</span>
              <span className="text-xs font-medium">{config.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {GROWTH_STAGES[5]}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Complete this task honestly to grow one of these plants.
      </p>
    </div>
  );
}
