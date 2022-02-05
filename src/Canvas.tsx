import React, { useRef, useEffect } from "react";

// the props of the native canvas element
type CanvasProps = React.DetailedHTMLProps<
React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement
>;

const Canvas = (props: CanvasProps & { draw: (ctx: CanvasRenderingContext2D) => void }) => {
  // destructure all but native canvas props
  const { draw } = props;

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    // the canvas will be initialised at this point
    const context = (canvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;

    draw(context);
  }, [draw]);

  return (
    <canvas
      ref={ref}
      {...props}
    />
  );
};

export default Canvas;
