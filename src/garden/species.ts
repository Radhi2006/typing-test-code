import type { LangId } from '../snippets/languages';

export type LeafShape = 'round' | 'blade' | 'needle' | 'petal' | 'fan' | 'heart';

export interface Species {
  name: string;
  /** angle between a parent and a new limb, in radians */
  spread: number;
  /** how quickly limbs bend upward; negative values droop */
  rise: number;
  /** multiplies trunk height */
  height: number;
  /** multiplies limb length */
  reach: number;
  /** multiplies branch thickness */
  girth: number;
  /** random kink per segment, in radians */
  kink: number;
  leaf: LeafShape;
  leafSize: number;
  /** leaves per line of code */
  density: number;
}

export const SPECIES: Record<LangId, Species> = {
  javascript: { name: 'Cherry', spread: 0.8, rise: 0.12, height: 0.9, reach: 1.05, girth: 0.9, kink: 0.14, leaf: 'petal', leafSize: 9, density: 1.5 },
  typescript: { name: 'Blue spruce', spread: 1.05, rise: 0.05, height: 1.15, reach: 0.72, girth: 0.85, kink: 0.04, leaf: 'needle', leafSize: 12, density: 1.7 },
  python: { name: 'Willow', spread: 0.72, rise: -0.13, height: 0.92, reach: 1.25, girth: 1, kink: 0.08, leaf: 'blade', leafSize: 12, density: 1.7 },
  java: { name: 'Oak', spread: 0.95, rise: 0.09, height: 0.85, reach: 1.15, girth: 1.3, kink: 0.2, leaf: 'round', leafSize: 11, density: 1.3 },
  c: { name: 'Olive', spread: 0.9, rise: 0.08, height: 0.68, reach: 0.95, girth: 1.4, kink: 0.32, leaf: 'blade', leafSize: 8, density: 1.5 },
  cpp: { name: 'Pine', spread: 1.2, rise: 0.04, height: 1.2, reach: 0.68, girth: 1, kink: 0.06, leaf: 'needle', leafSize: 13, density: 1.6 },
  go: { name: 'Aspen', spread: 0.5, rise: 0.2, height: 1.12, reach: 0.82, girth: 0.72, kink: 0.08, leaf: 'round', leafSize: 8, density: 1.6 },
  rust: { name: 'Copper beech', spread: 0.85, rise: 0.1, height: 0.92, reach: 1.1, girth: 1.25, kink: 0.12, leaf: 'heart', leafSize: 11, density: 1.3 },
  php: { name: 'Lilac', spread: 0.65, rise: 0.15, height: 0.74, reach: 0.95, girth: 0.82, kink: 0.18, leaf: 'petal', leafSize: 7, density: 2 },
  csharp: { name: 'Maple', spread: 0.82, rise: 0.11, height: 0.95, reach: 1.08, girth: 1.05, kink: 0.14, leaf: 'heart', leafSize: 12, density: 1.3 },
  sql: { name: 'Birch', spread: 0.55, rise: 0.17, height: 1.1, reach: 0.85, girth: 0.68, kink: 0.1, leaf: 'round', leafSize: 7, density: 1.7 },
  kotlin: { name: 'Ginkgo', spread: 0.75, rise: 0.13, height: 1, reach: 0.95, girth: 0.92, kink: 0.1, leaf: 'fan', leafSize: 11, density: 1.4 },
};
