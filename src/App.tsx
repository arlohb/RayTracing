import { useCallback, useMemo, useState } from "react";
import Canvas from "./Canvas";
import { DrawImageToCanvas } from "./Image";
import Data from "./Data";
import MathsTest from "./MathsTest";
import RayTracer, { RayTracerOptions } from "./RayTracing/RayTracer";
import Vector3 from "./RayTracing/Vector3";
import Sphere from "./RayTracing/Sphere";

type PerformanceMetrics = {
  total: number,
  render: number,
  drawToCanvas: number,
};

const App = () => {
  const [rayTracerOptions] = useState<RayTracerOptions>({
    from: new Vector3(7, 10, 10),
    to: new Vector3(0, 0, 0),
    fov: 90,
    width: 400,
    height: 300,
    scene: [
      new Sphere(new Vector3(0, 0, 0), 2),
      new Sphere(new Vector3(5, 0, 0), 1),
      new Sphere(new Vector3(0, 5, 0), 1),
      new Sphere(new Vector3(0, 0, 5), 1),
    ],
  });

  const rayTracer = useMemo(() => new RayTracer(rayTracerOptions), [rayTracerOptions]);

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
      flexDirection: "row",
    }}
    >
      <Canvas
        style={{
          height: rayTracerOptions.height,
        }}
        width={rayTracerOptions.width}
        height={rayTracerOptions.height}
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
      <div>
        <Data
          title="Performance"
          data={{
            Total: `${metrics.total.toFixed(1)} ms ${(1000 / metrics.total).toFixed(1)} fps`,
            Render: `${metrics.render.toFixed(1)} ms`,
            DrawToCanvas: `${metrics.drawToCanvas.toFixed(1)} ms`,
          }}
        />
        <MathsTest />
      </div>
    </div>
  );
};

export default App;
