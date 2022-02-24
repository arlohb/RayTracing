import { useCallback, useEffect, useMemo, useState } from "react";
import Canvas from "./Canvas";
import { DrawImageToCanvas } from "./Image";
import Data from "./Data";
import MathsTest from "./MathsTest";
import RayTracer, { RayTracerOptions } from "./TSRayTracing/RayTracer";
import Vector3 from "./TSRayTracing/Vector3";
import Sphere from "./TSRayTracing/Sphere";
import { SphericalToCartesian } from "./TSRayTracing/SphericalCoords";

type PerformanceMetrics = {
  total: number,
  render: number,
  drawToCanvas: number,
};

const App = () => {
  const [showTests, setShowTests] = useState(false);
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(-0.6);
  const [orbitDistance, setOrbitDistance] = useState(10);
  const [position, setPosition] = useState<Vector3>(new Vector3(5.77, 5.77, 5.77));

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
      <div style={{ marginLeft: 50 }}>
        <Data
          title="Performance"
          data={{
            Total: `${metrics.total.toFixed(1)} ms ${(1000 / metrics.total).toFixed(1)} fps`,
            Render: `${metrics.render.toFixed(1)} ms`,
            DrawToCanvas: `${metrics.drawToCanvas.toFixed(1)} ms`,
          }}
        />
        <div style={{ height: 40 }} />
        <button onClick={() => setShowTests((s) => !s)} type="button">
          Show maths tests
        </button>
        {showTests && (
          <MathsTest />
        )}
      </div>
    </div>
  );
};

export default App;
