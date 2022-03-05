import { useState } from "react";

import Viewport, { Renderer } from "./Components/Viewport";
import Data from "./Components/Data";
import MathsTest from "./Components/MathsTest";
import { useWindowSize } from "./Hooks";
import Text from "./Components/Text";

type PerformanceMetrics = {
  total: number,
  render: number,
  drawToCanvas: number,
};

const RendererButton = ({ setRenderer, name, renderer }: {
  setRenderer: (newRenderer: Renderer) => void,
  name: Renderer,
  renderer: Renderer,
}) => {
  const capitalisedName = `${name[0].toUpperCase()}${name.substring(1)}`;

  return (
    <button
      type="button"
      style={{
        width: 200,
        marginRight: 20,
      }}
      onClick={() => setRenderer(name)}
    >
      {
      name === renderer
        ? <b>{capitalisedName}</b>
        : capitalisedName
      }
    </button>
  );
};

const App = () => {
  const windowSize = useWindowSize();
  const [showTests, setShowTests] = useState(false);
  const [renderer, setRenderer] = useState<Renderer>("typescript");

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
      <Viewport setMetrics={setMetrics} renderer={renderer} />
      <div style={{ marginLeft: 20 }}>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <RendererButton
            setRenderer={setRenderer}
            name="typescript"
            renderer={renderer}
          />
          <RendererButton
            setRenderer={setRenderer}
            name="rust"
            renderer={renderer}
          />
        </div>
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
export type { PerformanceMetrics };
