import { useEffect, useCallback, useState, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-relative-packages
import wasmInit, { rs_render } from "../RayTracing/rs-ray-tracing/pkg/rs_ray_tracing";
import Matrix44 from "../RayTracing/TypeScript/Matrix44";
import { Sphere } from "../RayTracing/TypeScript/Objects";

import TSRender from "../RayTracing/TypeScript/RayTracer";
import Vec from "../RayTracing/TypeScript/Vector3";

const RSRender = (
  from: Vec,
  to: Vec,
  fov: number,
  width: number,
  height: number,
  scene: Sphere[],
): void => {
  rs_render(
    from.toTuple(),
    to.toTuple(),
    fov,
    width,
    height,
    scene.map((object) => ([
      object.position.toTuple(),
      object.radius,
      object.material.colour,
      object.material.specular,
    ])),
  );
};

const HexToPixel = (hex: string): [number, number, number] => (
  [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ]
);

type RayTracerOptions = {
  from: Vec,
  to: Vec,
  fov: number,
  width: number,
  height: number,
  scene: Sphere[],
};

type Renderer = "rust" | "typescript";

const Viewport = ({ setFps, renderer, setRollingFps }: {
  setFps: (fps: number) => void,
  renderer: Renderer,
  setRollingFps: (newRollingFps: number[] | ((arg: number[]) => number[])) => void,
}) => {
  const [options, setOptions] = useState<RayTracerOptions>({
    from: new Vec(5.77, 5.77, 5.77),
    to: new Vec(0, 0, 0),
    fov: 90,
    width: 400,
    height: 300,
    scene: [
      new Sphere(new Vec(0, -3, 0), 2, { colour: [1, 0, 0], specular: 10 }),
      new Sphere(new Vec(5, 0, 0), 1, { colour: [0, 0, 1], specular: 500 }),
      new Sphere(new Vec(0, 0, 5), 1, { colour: [0, 1, 0], specular: 500 }),
      new Sphere(new Vec(-1, 0, 2), 1, { colour: [1, 1, 1], specular: 1000 }),
    ],
  });

  const spin = useCallback(() => {
    setOptions((_options) => ({
      ..._options,
      scene: _options.scene.map((object) => new Sphere(
        object.position.transformPoint(Matrix44.createRotation("y", 0.01).values),
        object.radius,
        object.material,
      )),
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
