import { useCallback, useState } from "react";
import Canvas from "./Canvas";
import Image, { HexToPixel, DrawImageToCanvas } from "./Image";
import Data from "./Data";
import MathsTest from "./MathsTest";

type PerformanceMetrics = {
  total: number,
  render: number,
  drawToCanvas: number,
};

const App = () => {
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
          height: 500,
        }}
        width={500}
        height={500}
        // wrapped in useCallback so it doesn't rerun when state changes
        draw={useCallback((ctx: CanvasRenderingContext2D): void => {
          const timer: PerformanceMetrics = {
            total: 0,
            render: 0,
            drawToCanvas: 0,
          };

          timer.total = performance.now();

          const { width, height } = ctx.canvas;

          const image = new Image(width, height, HexToPixel("#37aca6"));

          timer.render = performance.now();

          for (let x = 0; x < width; x += 1) {
            for (let y = 0; y < height; y += 1) {
              image.data[x][y] = {
                r: Math.random() * 255,
                g: Math.random() * 255,
                b: Math.random() * 255,
              };
            }
          }

          timer.render = performance.now() - timer.render;
          timer.drawToCanvas = performance.now();

          DrawImageToCanvas(ctx, image);

          timer.drawToCanvas = performance.now() - timer.drawToCanvas;
          timer.total = performance.now() - timer.total;

          setMetrics(timer);
        }, [])}
      />
      <div>
        <Data
          decimalPlaces={1}
          units="ms"
          title="Performance"
          data={{
            Total: metrics.total,
            Render: metrics.render,
            DrawToCanvas: metrics.drawToCanvas,
          }}
        />
        <MathsTest />
      </div>
    </div>
  );
};

export default App;
