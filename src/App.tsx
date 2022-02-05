import Canvas from "./Canvas";
import Image, { HexToPixel, DrawImageToCanvas } from "./Image";

const App = () => {
  return (
    <div style={{
      backgroundColor: "#282c34",
      minHeight: "100vh", // vh = 1% of the viewport, not the parent element like % does
      width: "100%",
    }}
    >
      <Canvas
        width={500}
        height={500}
        draw={(ctx: CanvasRenderingContext2D): void => {
          ctx.imageSmoothingEnabled = false;

          const { width, height } = ctx.canvas;

          const image = new Image(width, height, HexToPixel("#37aca6"));

          DrawImageToCanvas(ctx, image);
        }}
      />
    </div>
  );
};

export default App;
