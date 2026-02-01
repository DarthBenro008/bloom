/**
 * Plant Types and Rendering Configuration
 * 
 * Plants are mapped to effort levels:
 * - Light: Quick blooming flowers (daisy, tulip, poppy)
 * - Medium: Requires more care (rose, sunflower, lavender)
 * - Heavy: Majestic, slow-growing (oak, cherry_blossom, maple)
 */

export type PlantType = 
  | 'daisy' | 'tulip' | 'poppy'     // Light effort
  | 'rose' | 'sunflower' | 'lavender' // Medium effort
  | 'oak' | 'cherry_blossom' | 'maple'; // Heavy effort

export interface PlantConfig {
  name: string;
  emoji: string;
  baseColor: string;
  healthyColor: string;
  witherColor: string;
  maxHeight: number; // Relative height multiplier
}

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  // Light effort - Flowers
  daisy: {
    name: 'Daisy',
    emoji: '🌼',
    baseColor: '#FFFFFF',
    healthyColor: '#FFE135',
    witherColor: '#8B7355',
    maxHeight: 0.6,
  },
  tulip: {
    name: 'Tulip',
    emoji: '🌷',
    baseColor: '#FF6B6B',
    healthyColor: '#FF4757',
    witherColor: '#8B4513',
    maxHeight: 0.7,
  },
  poppy: {
    name: 'Poppy',
    emoji: '🌺',
    baseColor: '#FF6B6B',
    healthyColor: '#FF4500',
    witherColor: '#8B4513',
    maxHeight: 0.5,
  },

  // Medium effort - Vibrant blooms
  rose: {
    name: 'Rose',
    emoji: '🌹',
    baseColor: '#FF1744',
    healthyColor: '#E91E63',
    witherColor: '#5D4037',
    maxHeight: 0.8,
  },
  sunflower: {
    name: 'Sunflower',
    emoji: '🌻',
    baseColor: '#FFD700',
    healthyColor: '#FFC107',
    witherColor: '#795548',
    maxHeight: 0.9,
  },
  lavender: {
    name: 'Lavender',
    emoji: '💐',
    baseColor: '#9C27B0',
    healthyColor: '#7B1FA2',
    witherColor: '#4A148C',
    maxHeight: 0.6,
  },

  // Heavy effort - Trees
  oak: {
    name: 'Oak Tree',
    emoji: '🌳',
    baseColor: '#228B22',
    healthyColor: '#2E7D32',
    witherColor: '#33691E',
    maxHeight: 1.0,
  },
  cherry_blossom: {
    name: 'Cherry Blossom',
    emoji: '🌸',
    baseColor: '#FFB7C5',
    healthyColor: '#F48FB1',
    witherColor: '#8D6E63',
    maxHeight: 0.95,
  },
  maple: {
    name: 'Maple Tree',
    emoji: '🍁',
    baseColor: '#FF5722',
    healthyColor: '#E64A19',
    witherColor: '#3E2723',
    maxHeight: 1.0,
  },
};

// Growth stage labels
export const GROWTH_STAGES = [
  'Seed',
  'Sprout',
  'Young',
  'Growing',
  'Mature',
  'Flourishing',
] as const;

/**
 * Get the visual properties for a plant based on its state
 */
export function getPlantVisuals(
  plantType: PlantType,
  growthStage: number,
  health: number
) {
  const config = PLANT_CONFIGS[plantType] || PLANT_CONFIGS.daisy;
  
  // Calculate size based on growth stage (0-5)
  const sizeMultiplier = 0.2 + (growthStage / 5) * 0.8;
  
  // Calculate color based on health (0-100)
  const healthRatio = health / 100;
  
  // Opacity decreases with low health
  const opacity = 0.3 + healthRatio * 0.7;
  
  // Calculate height
  const height = config.maxHeight * sizeMultiplier;
  
  return {
    config,
    sizeMultiplier,
    healthRatio,
    opacity,
    height,
    stageName: GROWTH_STAGES[growthStage] || GROWTH_STAGES[0],
    isWithering: health < 50,
    isDead: health < 20,
  };
}

/**
 * Interpolate between two colors based on a ratio
 */
export function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `rgb(${r}, ${g}, ${b})`;
}
