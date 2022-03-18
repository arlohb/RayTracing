import { useEffect, useCallback, useState, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-relative-packages
import wasmInit, { rs_render as RSRender } from "../RayTracing/rs-ray-tracing/pkg/rs_ray_tracing";
import Matrix44 from "../RayTracing/TypeScript/Matrix44";

import TSRender from "../RayTracing/TypeScript/RayTracer";
import Vec from "../RayTracing/TypeScript/Vector3";

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
    [number, number, number], // colour
    number, // specular
  ][],
};

type Renderer = "rust" | "typescript";

const Viewport = ({ setFps, renderer, setRollingFps }: {
  setFps: (fps: number) => void,
  renderer: Renderer,
  setRollingFps: (newRollingFps: number[] | ((arg: number[]) => number[])) => void,
}) => {
  const [options, setOptions] = useState<RayTracerOptions>({
    from: [5.77, 5.77, 5.77],
    to: [0, 0, 0],
    fov: 90,
    width: 400,
    height: 300,
    scene: [
      [[0, -3, 0], 2, [1, 0, 0], 10],
      [[5, 0, 0], 1, [0, 0, 1], 500],
      [[0, 0, 5], 1, [0, 1, 0], 500],
      [[-1, 0, 2], 1, [1, 1, 1], 1000],
    ],
  });

  const spin = useCallback(() => {
    setOptions((_options) => ({
      ..._options,
      scene: _options.scene.map((object) => [
        Vec.transformPoint(object[0], Matrix44.createRotation("y", 0.1).values),
        object[1],
        object[2],
        object[3],
      ]),
    }));
    setTimeout(spin, 10);
  }, [setOptions]);

  useEffect(() => {
    spin();
  }, [spin]);

  const rayTracer = useMemo<typeof RSRender>(() => {
    if (renderer === "typescript") {
      return TSRender;
    } if (renderer === "rust") {
      return RSRender;
    }

    return TSRender;
  }, [renderer]);

  const draw = useCallback((): void => {
    let timer = performance.now();

    rayTracer(options.from, options.to, options.fov, options.width, options.height, options.scene);

    timer = performance.now() - timer;

    setRollingFps((_rollingFps) => {
      _rollingFps.shift();
      _rollingFps.push(1000 / timer);
      return _rollingFps;
    });

    setFps(Math.round(10000 / timer) / 10);
  }, [rayTracer, options, setFps, setRollingFps]);

  useEffect(() => {
    wasmInit();
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

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
    />
  );
};

export default Viewport;
export { HexToPixel };
export type { Renderer };
