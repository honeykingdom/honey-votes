import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import drawWheel from "./drawWheel";
import rotateCanvas from "./rotateCanvas";
import defaultTimingFunction from "./timingFunction";
import getSegmentAngle from "./utils/getSegmentAngle";
import sliceTextByMaxWidth from "./utils/getTextByMaxWidth";
import getSegmentIndexByAngle from "./utils/getSegmentIndexByAngle";
import useDevicePixelRatio from "./hooks/useDevicePixelRatio";
import type { SpinningWheelRef, WheelColors, WheelSegment } from "./types";

const GLOBAL_FONT = "Roboto, Helvetica, Arial, sans-serif";

const normalizeSegments = (
  segments: WheelSegment[],
  textFont: string,
  maxTextWidth: number
): WheelSegment[] =>
  segments.map(({ title, ...rest }) => ({
    title: sliceTextByMaxWidth(title, textFont, maxTextWidth),
    ...rest,
  }));

const getTextFont = (radius: number) =>
  `${(12 / 200) * radius}px ${GLOBAL_FONT}`;

const defaultWheelColors: WheelColors = {
  wheelBackground: "#fff",
  text: "rgba(0, 0, 0, 0.87)",
  border: "#424242",
};

type Props = {
  size: number;
  segments: WheelSegment[];
  wheelColors?: WheelColors;
  spinningWheelRef?: MutableRefObject<SpinningWheelRef>;
  timingFunction?: (n: number) => number;
  onSegmentChange?: (index?: number) => void;
  onSpinStart?: () => void;
  onSpinEnd?: (winnerIndex?: number) => void;
};

const SpinningWheel = ({
  size,
  segments,
  wheelColors = defaultWheelColors,
  spinningWheelRef,
  timingFunction = defaultTimingFunction,
  onSegmentChange = () => {},
  onSpinStart = () => {},
  onSpinEnd = () => {},
}: Props) => {
  const [cachedWheel, setCachedWheel] = useState<HTMLCanvasElement>();
  const cachedWheelRef = useRef<HTMLCanvasElement>(null);

  cachedWheelRef.current = cachedWheel;

  const functions = useRef({ onSegmentChange, onSpinStart, onSpinEnd });

  functions.current = { onSegmentChange, onSpinStart, onSpinEnd };

  const rotationAngle = useRef(0);
  const requestId = useRef<number>(null);
  const currentSegmentIndex = useRef(0);
  const prevTime = useRef<number>(null);
  const fullTime = useRef(0);

  const radius = size / 2;

  const scale = useDevicePixelRatio();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const textFont = getTextFont(radius);
    const textMaxWidth = (135 / 200) * radius;

    const wheel = drawWheel({
      canvas,
      segments: normalizeSegments(segments, textFont, textMaxWidth),
      size,
      scale,
      textFont,
      wheelColors,
    });

    setCachedWheel(wheel);
  }, [size, radius, segments, wheelColors, scale]);

  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!canvas || !cachedWheel) return;

      const ctx = canvas.getContext("2d");

      const segmentAngle = getSegmentAngle(segments.length);

      canvas.width = size * scale;
      canvas.height = size * scale;

      if (requestId.current === null) {
        window.requestAnimationFrame(() => {
          rotateCanvas({
            ctx,
            canvasToRender: cachedWheel,
            size,
            scale,
            rotationAngle: rotationAngle.current,
          });
        });
      }

      if (!spinningWheelRef) return;

      const animate =
        (secondsToSpin: number, speed: number) => (time: number) => {
          // first draw
          if (prevTime.current === null) {
            currentSegmentIndex.current = getSegmentIndexByAngle(
              rotationAngle.current,
              segmentAngle
            );
            prevTime.current = time;
          }

          const deltaTime = time - prevTime.current;

          prevTime.current = time;
          fullTime.current += deltaTime;

          if (fullTime.current > secondsToSpin * 1000) {
            functions.current.onSpinEnd(currentSegmentIndex.current);
            stopSpinning();

            return;
          }

          const thisSegmentIndex = getSegmentIndexByAngle(
            rotationAngle.current,
            segmentAngle
          );

          if (currentSegmentIndex.current !== thisSegmentIndex) {
            currentSegmentIndex.current = thisSegmentIndex;

            functions.current.onSegmentChange(thisSegmentIndex);
          }

          // NOTE: in "variableI" letter "I" means UnitInterval - [0, 1)

          const timeI = fullTime.current / (secondsToSpin * 1000);
          const speedI = timingFunction(timeI);
          const deltaAngle = ((2 * Math.PI) / 360) * speedI * speed;

          rotationAngle.current += deltaAngle;

          rotateCanvas({
            ctx,
            canvasToRender: cachedWheelRef.current,
            size,
            scale,
            rotationAngle: rotationAngle.current,
          });

          requestId.current = window.requestAnimationFrame(
            animate(secondsToSpin, speed)
          );
        };

      function startSpinning(secondsToSpin: number, speed: number) {
        functions.current.onSpinStart();

        rotationAngle.current = 0;
        currentSegmentIndex.current = 0;
        prevTime.current = null;
        fullTime.current = 0;
        requestId.current = window.requestAnimationFrame(
          animate(secondsToSpin, speed)
        );
      }

      function stopSpinning() {
        if (requestId.current) {
          window.cancelAnimationFrame(requestId.current);
        }

        requestId.current = null;
      }

      spinningWheelRef.current = { startSpinning, stopSpinning };
    },
    [cachedWheel]
  );

  return (
    <canvas
      width={size}
      height={size}
      style={{ width: size, height: size }}
      ref={canvasRef}
    />
  );
};

export default SpinningWheel;
