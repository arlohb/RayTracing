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

          for (let x = 0; x < width; x += 1) {
            for (let y = 0; y < height; y += 1) {
              image.data[x][y] = {
                r: (x / width) * 255,
                g: 127 - ((x * y) / (width * height)),
                b: (y / width) * 255,
              };
            }
          }

          DrawImageToCanvas(ctx, image);
        }}
      />
    </div>
  );
};

export default App;
