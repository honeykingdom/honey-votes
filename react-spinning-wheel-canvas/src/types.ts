export type WheelSegment = {
  title: string;
  textColor?: string;
  backgroundColor?: string;
};

export type WheelColors = {
  wheelBackground: string;
  text: string;
  border: string;
};

export type WheelDrawState = {
  ctx: CanvasRenderingContext2D | null | undefined;
  segments: WheelSegment[];
  radius: number;
  wheelColors: WheelColors;
  textFont: string;
  /** Full canvas rotation angle [0, Math.PI * 2] */
  rotationAngle: number;
  /** Angle of the one segment */
  segmentAngle: number;
  scale: number;
};

export type SpinningWheelRef = {
  startSpinning: (secondsToSpin: number, speed: number) => void;
  stopSpinning: () => void;
};
