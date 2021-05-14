import getSegmentAngle from "./utils/getSegmentAngle";
import type { WheelColors, WheelSegment } from "./types";

const LINE_WIDTH = 4;

const meanAngleDeg = (angle1: number, angle2: number) =>
  Math.atan2(
    (Math.sin(angle1) + Math.sin(angle2)) / 2,
    (Math.cos(angle1) + Math.cos(angle2)) / 2
  );

const getX = (offset: number, radius: number, angle: number) =>
  offset + radius * Math.sin(angle);

const getY = (offset: number, radius: number, angle: number) =>
  offset + radius * Math.cos(angle);

type DrawWheelArgs = {
  canvas: HTMLCanvasElement;
  segments: WheelSegment[];
  size: number;
  scale: number;
  textFont: string;
  wheelColors: WheelColors;
};

const drawWheel = ({
  canvas,
  segments,
  size,
  scale,
  textFont,
  wheelColors,
}: DrawWheelArgs) => {
  const ctx = canvas.getContext("2d");

  const radius = size / 2;
  const textOffset = (20 / 200) * radius;

  const segmentAngle = getSegmentAngle(segments.length);

  canvas.width = size * scale;
  canvas.height = size * scale;

  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, size, size);

  // circle background
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.fillStyle = wheelColors.wheelBackground;
  ctx.fill();

  // segments background
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];

    ctx.fillStyle = segment.backgroundColor || wheelColors.wheelBackground;
    ctx.strokeStyle = wheelColors.border;

    ctx.beginPath();
    ctx.arc(radius, radius, radius, segmentAngle * i, segmentAngle * (i + 1));
    ctx.lineTo(radius, radius);
    ctx.fill();
  }

  // circle border
  ctx.beginPath();
  ctx.arc(radius, radius, radius - LINE_WIDTH / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = wheelColors.border;
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();

  // segment borders
  ctx.beginPath();

  for (let i = 0; i < segments.length; i += 1) {
    // for (let i = 0; i < 3; i += 1) {
    const fullSegmentAngle = -(i * segmentAngle) + Math.PI / 2;

    const lineX = getX(radius, radius, fullSegmentAngle);
    const lineY = getY(radius, radius, fullSegmentAngle);

    ctx.moveTo(lineX, lineY);
    ctx.lineTo(radius, radius);
  }

  ctx.stroke();

  // segments text
  ctx.font = textFont;

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[segments.length - 1 - i];

    ctx.fillStyle = segment.textColor || wheelColors.text;

    const from = -(i * segmentAngle) + Math.PI / 2 + Math.PI;
    const to = -((i + 1) * segmentAngle) + Math.PI / 2 + Math.PI;

    const meanAngle = meanAngleDeg(from, to);
    const textAngleRotation = meanAngle + Math.PI;
    const textAngle = -meanAngle;
    const textX = getX(radius, radius - textOffset, textAngle);
    const textY = getY(radius, radius - textOffset, textAngle);

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(textAngleRotation);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(segment.title, 0, 4);
    ctx.restore();
  }

  return canvas;
};

export default drawWheel;
