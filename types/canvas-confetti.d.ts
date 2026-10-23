declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: any[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  interface ConfettiFn {
    (options?: ConfettiOptions): Promise<null> | null;
    shapeFromText?: (options: { text: string; scalar?: number }) => any;
    shapeFromPath?: (options: { path: string }) => any;
    reset?: () => void;
  }

  const confetti: ConfettiFn;
  export default confetti;
}
