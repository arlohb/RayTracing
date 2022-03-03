import { useCallback, useEffect, useMemo, useState } from "react";

// eslint-disable-next-line import/no-relative-packages
import wasmInit, { get_image } from "./RayTracing/rs-ray-tracing/pkg/rs_ray_tracing";

import Canvas from "./Canvas";
import { DrawImageToCanvas } from "./Image";
import Data from "./Data";
import MathsTest from "./MathsTest";
import RayTracer, { RayTracerOptions } from "./RayTracing/TypeScript/RayTracer";
import Vector3 from "./RayTracing/TypeScript/Vector3";
import Sphere from "./RayTracing/TypeScript/Sphere";
import { SphericalToCartesian } from "./RayTracing/TypeScript/SphericalCoords";
import { useWindowSize } from "./Hooks";
import Text from "./Text";

type PerformanceMetrics = {
  total: number,
  render: number,
  drawToCanvas: number,
};

type Renderer = "rust" | "typescript";

const App = () => {
  const windowSize = useWindowSize();
  const [showTests, setShowTests] = useState(false);
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(-0.6);
  const [orbitDistance, setOrbitDistance] = useState(10);
  const [position, setPosition] = useState<Vector3>(new Vector3(5.77, 5.77, 5.77));
  const [renderer, setRenderer] = useState<Renderer>();

  const [rayTracerOptions] = useState<RayTracerOptions>({
    from: position,
    to: new Vector3(0, 0, 0),
    fov: 90,
    width: 400,
    height: 300,
    scene: [
      new Sphere(new Vector3(0, 0, 0), 2),
      new Sphere(new Vector3(5, 0, 0), 1),
      new Sphere(new Vector3(0, 0, 5), 1),
      new Sphere(new Vector3(-1, 0, 2), 1),
    ],
  });

  const rayTracer = useMemo(() => new RayTracer({ ...rayTracerOptions, from: position }), [rayTracerOptions, position]);

  useEffect(() => {
    setPosition(SphericalToCartesian(phi, theta).normalize().mul(orbitDistance));
  }, [theta, phi, orbitDistance]);

  const spin = useCallback(() => {
    setTheta((t) => t + 0.04);
    setTimeout(spin, 10);
  }, [setTheta]);

  useEffect(() => {
    spin();
  }, [spin]);

  useEffect(() => {
    wasmInit().then(() => {
      const image = get_image(rayTracerOptions.width, rayTracerOptions.height);
      console.log(image);
    });
  }, [rayTracerOptions]);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    total: 0,
    render: 0,
    drawToCanvas: 0,
  });

  return (
    <div style={{
      backgroundColor: "#282c34",
      minHeight: "100vh", // vh = 1% of the viewport, not the parent element like % does
      width: "100%",
      display: "flex",
      flexDirection: windowSize.width > windowSize.height ? "row" : "column",
    }}
    >
      <Canvas
        style={{
          width: rayTracerOptions.width,
          height: rayTracerOptions.height,
        }}
        width={rayTracerOptions.width}
        height={rayTracerOptions.height}
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
        // wrapped in useCallback so it doesn't rerun when state changes
        draw={useCallback((ctx: CanvasRenderingContext2D): void => {
          const timer: PerformanceMetrics = {
            total: 0,
            render: 0,
            drawToCanvas: 0,
          };

          timer.total = performance.now();

          timer.render = performance.now();

          const image = rayTracer.render();

          timer.render = performance.now() - timer.render;
          timer.drawToCanvas = performance.now();

          DrawImageToCanvas(ctx, image);

          timer.drawToCanvas = performance.now() - timer.drawToCanvas;
          timer.total = performance.now() - timer.total;

          setMetrics(timer);
        }, [rayTracer])}
      />
      <div style={{ marginLeft: 20 }}>
        <Data
          title="Performance"
          data={{
            Total: `${metrics.total.toFixed(1)} ms ${(1000 / metrics.total).toFixed(1)} fps`,
            Render: `${metrics.render.toFixed(1)} ms`,
            DrawToCanvas: `${metrics.drawToCanvas.toFixed(1)} ms`,
          }}
        />

        <div style={{
          marginTop: 20,
          marginBottom: 20,
          display: "flex",
          flexDirection: "row",
        }}
        >
          <input
            style={{
              flex: 1,
            }}
            type="checkbox"
            onChange={() => setShowTests(!showTests)}
            checked={showTests}
          />
          <Text style={{ flex: 10 }}>Show Maths Tests</Text>
        </div>

        {showTests && (
          <MathsTest />
        )}
      </div>
    </div>
  );
};

export default App;
