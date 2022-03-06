import { useEffect, useCallback, useState, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-relative-packages
import wasmInit, { rs_render as RSRender } from "../RayTracing/rs-ray-tracing/pkg/rs_ray_tracing";

import Vec from "../RayTracing/TypeScript/Vector3";
import TSRender from "../RayTracing/TypeScript/RayTracer";
import { SphericalToCartesian } from "../RayTracing/TypeScript/SphericalCoords";
import { PerformanceMetrics } from "../App";

const HexToPixel = (hex: string): [number, number, number] => (
  [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ]
);

type RayTracerOptions = {
  from: [number, number, number],
  to: [number, number, number],
  fov: number,
  width: number,
  height: number,
  scene: [
    [number, number, number], // center
    number, // radius
  ][],
};

type Renderer = "rust" | "typescript";

const Viewport = ({ setMetrics, renderer }: {
  setMetrics: (metrics: PerformanceMetrics) => void,
  renderer: Renderer,
}) => {
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(-0.6);
  const [orbitDistance, setOrbitDistance] = useState(10);

  const [options, setOptions] = useState<RayTracerOptions>({
    from: [5.77, 5.77, 5.77],
    to: [0, 0, 0],
    fov: 90,
    width: 400,
    height: 300,
    scene: [
      [[0, 0, 0], 2],
      [[5, 0, 0], 1],
      [[0, 0, 5], 1],
      [[-1, 0, 2], 1],
    ],
  });

  const rayTracer = useMemo<typeof RSRender>(() => {
    if (renderer === "typescript") {
      return TSRender;
    } if (renderer === "rust") {
      return RSRender;
    }

    return TSRender;
  }, [renderer]);

  const draw = useCallback((): void => {
    const timer: PerformanceMetrics = {
      total: 0,
      render: 0,
      drawToCanvas: 0,
    };

    timer.total = performance.now();
    timer.render = performance.now();

    rayTracer(options.from, options.to, options.fov, options.width, options.height, options.scene);

    timer.render = performance.now() - timer.render;
    timer.drawToCanvas = performance.now();

    timer.drawToCanvas = performance.now() - timer.drawToCanvas;
    timer.total = performance.now() - timer.total;

    setMetrics(timer);
  }, [rayTracer, options, setMetrics]);

  useEffect(() => {
    const position = Vec.mul(Vec.normalize(SphericalToCartesian(phi, theta)), orbitDistance);
    setOptions((oldOptions) => ({ ...oldOptions, from: position }));
  }, [theta, phi, orbitDistance]);

  const spin = useCallback(() => {
    setTheta((t) => t + 0.04);
    setTimeout(spin, 10);
  }, [setTheta]);

  useEffect(() => {
    spin();
  }, [spin]);

  useEffect(() => {
    wasmInit();
  }, []);

  useEffect(() => {
    draw();
  }, [draw, theta, phi, orbitDistance]);

  return (
    <canvas
      id="canvas"
      tabIndex={0}
      onClick={draw}
      style={{
        userSelect: "none", // allows the user to double click without selecting everything
        width: options.width,
        height: options.height,
      }}
      width={options.width}
      height={options.height}
      onKeyPressCapture={({ key }) => {
        const speed = 0.2;
        const scrollSpeed = 1;

        if (key === "w") {
          setOrbitDistance(orbitDistance - scrollSpeed);
          return;
        } if (key === "s") {
          setOrbitDistance(orbitDistance + scrollSpeed);
          return;
        }

        if (key === "d") {
          setTheta(theta + speed);
        } else if (key === "a") {
          setTheta(theta - speed);
        } else if (key === "e") {
          setPhi(phi + speed);
        } else if (key === "q") {
          setPhi(phi - speed);
        }
      }}
    />
  );
};

export default Viewport;
export { HexToPixel };
export type { Renderer };
