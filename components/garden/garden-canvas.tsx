'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { Plant } from '@/lib/db/schema';
import { PLANT_CONFIGS, getPlantVisuals, interpolateColor, type PlantType } from './plants';

interface GardenCanvasProps {
  plants: Plant[];
  width?: number;
  height?: number;
}

const GRID_SIZE = 8;
const SOIL_COLOR = '#8B7355';
const GRASS_COLOR = '#90EE90';
const SKY_GRADIENT_TOP = '#87CEEB';
const SKY_GRADIENT_BOTTOM = '#E0F7FA';

export function GardenCanvas({ plants, width = 400, height = 400 }: GardenCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGround = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    skyGradient.addColorStop(0, SKY_GRADIENT_TOP);
    skyGradient.addColorStop(1, SKY_GRADIENT_BOTTOM);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, w, h * 0.6);

    // Ground gradient
    const groundGradient = ctx.createLinearGradient(0, h * 0.6, 0, h);
    groundGradient.addColorStop(0, GRASS_COLOR);
    groundGradient.addColorStop(0.3, '#7CCD7C');
    groundGradient.addColorStop(1, SOIL_COLOR);
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    // Add some texture to the ground
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * w;
      const y = h * 0.6 + Math.random() * h * 0.4;
      ctx.fillStyle = Math.random() > 0.5 ? '#654321' : '#228B22';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawPlant = useCallback((
    ctx: CanvasRenderingContext2D,
    plant: Plant,
    cellWidth: number,
    cellHeight: number,
    groundY: number
  ) => {
    const plantType = plant.plantType as PlantType;
    const config = PLANT_CONFIGS[plantType] || PLANT_CONFIGS.daisy;
    const visuals = getPlantVisuals(plantType, plant.growthStage, plant.health);

    // Calculate position
    const centerX = (plant.positionX + 0.5) * cellWidth;
    const baseY = groundY + plant.positionY * (cellHeight * 0.3);

    // Plant color based on health
    const plantColor = interpolateColor(
      config.healthyColor,
      config.witherColor,
      1 - visuals.healthRatio
    );

    ctx.globalAlpha = visuals.opacity;

    // Draw stem
    if (plant.growthStage > 0) {
      const stemHeight = 20 + visuals.height * 40;
      ctx.strokeStyle = interpolateColor('#228B22', '#654321', 1 - visuals.healthRatio);
      ctx.lineWidth = 2 + plant.growthStage * 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX, baseY);
      ctx.lineTo(centerX, baseY - stemHeight);
      ctx.stroke();

      // Draw leaves for trees
      if (['oak', 'cherry_blossom', 'maple'].includes(plantType) && plant.growthStage >= 2) {
        const leafSize = 15 + visuals.sizeMultiplier * 25;
        ctx.fillStyle = plantColor;
        ctx.beginPath();
        ctx.arc(centerX, baseY - stemHeight, leafSize, 0, Math.PI * 2);
        ctx.fill();

        // Additional leaf clusters for bigger trees
        if (plant.growthStage >= 4) {
          ctx.beginPath();
          ctx.arc(centerX - leafSize * 0.6, baseY - stemHeight + leafSize * 0.3, leafSize * 0.7, 0, Math.PI * 2);
          ctx.arc(centerX + leafSize * 0.6, baseY - stemHeight + leafSize * 0.3, leafSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw flower head for flowers
      if (['daisy', 'tulip', 'poppy', 'rose', 'sunflower', 'lavender'].includes(plantType) && plant.growthStage >= 2) {
        const flowerSize = 8 + visuals.sizeMultiplier * 12;
        ctx.fillStyle = plantColor;
        
        if (plantType === 'sunflower') {
          // Draw sunflower with petals
          const petalCount = 12;
          for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalX = centerX + Math.cos(angle) * flowerSize * 1.2;
            const petalY = baseY - stemHeight + Math.sin(angle) * flowerSize * 1.2;
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, flowerSize * 0.5, flowerSize * 0.3, angle, 0, Math.PI * 2);
            ctx.fill();
          }
          // Center
          ctx.fillStyle = '#654321';
          ctx.beginPath();
          ctx.arc(centerX, baseY - stemHeight, flowerSize * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (plantType === 'tulip') {
          // Cup-shaped tulip
          ctx.beginPath();
          ctx.moveTo(centerX - flowerSize, baseY - stemHeight);
          ctx.quadraticCurveTo(centerX, baseY - stemHeight - flowerSize * 1.5, centerX + flowerSize, baseY - stemHeight);
          ctx.quadraticCurveTo(centerX, baseY - stemHeight + flowerSize * 0.5, centerX - flowerSize, baseY - stemHeight);
          ctx.fill();
        } else {
          // Simple circular flower
          ctx.beginPath();
          ctx.arc(centerX, baseY - stemHeight, flowerSize, 0, Math.PI * 2);
          ctx.fill();

          // Center for daisy
          if (plantType === 'daisy') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(centerX, baseY - stemHeight, flowerSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    } else {
      // Draw seed
      ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.ellipse(centerX, baseY - 3, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw background
    drawGround(ctx, w, h);

    if (plants.length === 0) {
      // Draw empty garden message
      ctx.fillStyle = '#666666';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Your garden awaits...', w / 2, h / 2);
      ctx.fillText('Complete tasks to grow plants!', w / 2, h / 2 + 20);
      return;
    }

    // Calculate cell dimensions
    const cellWidth = w / GRID_SIZE;
    const cellHeight = h / GRID_SIZE;
    const groundY = h * 0.7;

    // Draw each plant
    plants.forEach(plant => {
      drawPlant(ctx, plant, cellWidth, cellHeight, groundY);
    });
  }, [plants, drawGround, drawPlant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    draw(ctx, width, height);
  }, [draw, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg border border-border"
      style={{ maxWidth: width, maxHeight: height }}
    />
  );
}
