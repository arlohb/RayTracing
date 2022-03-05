import { useRef, useEffect, useCallback, useState, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-relative-packages
import wasmInit, { get_image as RSRender } from "../RayTracing/rs-ray-tracing/pkg/rs_ray_tracing";

import Vec, { Vector3 } from "../RayTracing/TypeScript/Vector3";
import TSRender, { Scene } from "../RayTracing/TypeScript/RayTracer";
import Sphere from "../RayTracing/TypeScript/Sphere";
import { SphericalToCartesian } from "../RayTracing/TypeScript/SphericalCoords";
import { PerformanceMetrics } from "../App";

const HexToPixel = (hex: string): [number, number, number] => (
  [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ]
);

const DrawImageToCanvas = (ctx: CanvasRenderingContext2D, image: [number, number, number][][]) => {
  const width = image.length;
  const height = image[0].length;

  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const pixel = image[x][y];
      const dataIndex = 4 * (x + (y * width));

      // eslint-disable-next-line prefer-destructuring
      imageData.data[dataIndex + 0] = pixel[0];
      // eslint-disable-next-line prefer-destructuring
      imageData.data[dataIndex + 1] = pixel[1];
      // eslint-disable-next-line prefer-destructuring
      imageData.data[dataIndex + 2] = pixel[2];

      imageData.data[dataIndex + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

type RayTracerOptions = {
  from: Vector3,
  to: Vector3,
  fov: number,
  width: number,
  height: number,
  scene: Scene,
};

type Renderer = "rust" | "typescript";

const Viewport = ({ setMetrics }: { setMetrics: (metrics: PerformanceMetrics) => void }) => {
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(-0.6);
  const [orbitDistance, setOrbitDistance] = useState(10);
  const [position, setPosition] = useState<Vector3>([5.77, 5.77, 5.77]);

  const [options] = useState<RayTracerOptions>({
    from: position,
    to: [0, 0, 0],
    fov: 90,
    width: 400,
    height: 300,
    scene: [
      new Sphere([0, 0, 0], 2),
      new Sphere([5, 0, 0], 1),
      new Sphere([0, 0, 5], 1),
      new Sphere([-1, 0, 2], 1),
    ],
  });

  const rayTracer = useMemo<(from: Vector3, to: Vector3, fov: number, width: number, height: number, scene: Scene) => [number, number, number][][]>(() => {
    // if (renderer === "typescript") {
    //   return TSRender;
    // } if (renderer === "rust") {
    //   return RSRender;
    // }
    return TSRender;
  }, []);

  const ref = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((): void => {
    const canvas = ref.current;

    // the canvas will be initialised at this point
    const ctx = (canvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;

    const timer: PerformanceMetrics = {
      total: 0,
      render: 0,
      drawToCanvas: 0,
    };

    timer.total = performance.now();

    timer.render = performance.now();

    const image = rayTracer(options.from, options.to, options.fov, options.width, options.height, options.scene);

    timer.render = performance.now() - timer.render;
    timer.drawToCanvas = performance.now();

    DrawImageToCanvas(ctx, image);

    timer.drawToCanvas = performance.now() - timer.drawToCanvas;
    timer.total = performance.now() - timer.total;

    setMetrics(timer);
  }, [rayTracer, options, setMetrics]);

  useEffect(() => {
    setPosition(Vec.mul(Vec.normalize(SphericalToCartesian(phi, theta)), orbitDistance));
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
  }, [draw]);

  return (
    <canvas
      tabIndex={0}
      ref={ref}
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
