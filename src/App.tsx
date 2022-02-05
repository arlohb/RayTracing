import Canvas from "./Canvas";

const App = () => {
  return (
    <div style={{
      backgroundColor: "#282c34",
      minHeight: "100vh", // vh = 1% of the viewport (NOT THE PARENT ELEMENT)
      width: "100%",
    }}
    >
      <Canvas
        width={1000}
        draw={(ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }}
      />
    </div>
  );
};

export default App;
