type RotateCanvasArgs = {
  ctx: CanvasRenderingContext2D;
  canvasToRender: HTMLCanvasElement;
  size: number;
  rotationAngle: number;
  scale: number;
};

const rotateCanvas = ({
  ctx,
  canvasToRender,
  size,
  scale,
  rotationAngle,
}: RotateCanvasArgs) => {
  if (!ctx || !canvasToRender) return;

  const radius = size / 2;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, size, size);

  ctx.translate(radius, radius);
  ctx.rotate(rotationAngle);
  ctx.translate(-radius, -radius);

  ctx.drawImage(canvasToRender, 0, 0, size, size);
};

export default rotateCanvas;
