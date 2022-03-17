import { useState } from "react";

import Viewport, { Renderer } from "./Components/Viewport";
import Data from "./Components/Data";
import { useWindowSize } from "./Hooks";

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
  const [renderer, setRenderer] = useState<Renderer>("typescript");
  const [rollingFps, setRollingFps] = useState<number[]>(Array.from({ length: 20 }, () => 0));

  const [fps, setFps] = useState(0);

  return (
    <div style={{
      backgroundColor: "#282c34",
      minHeight: "100vh", // vh = 1% of the viewport, not the parent element like % does
      width: "100%",
      display: "flex",
      flexDirection: windowSize.width > windowSize.height ? "row" : "column",
    }}
    >
      <Viewport setFps={setFps} renderer={renderer} setRollingFps={setRollingFps} />
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
            AverageFps: `${(rollingFps.reduce((sum, element) => sum + element, 0) / rollingFps.length).toFixed(1)}`,
            Fps: `${fps} fps`,
          }}
        />
      </div>
    </div>
  );
};

export default App;
