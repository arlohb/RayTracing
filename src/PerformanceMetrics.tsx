type PerformanceMetrics = {
  total: number,
  render: number,
  drawToCanvas: number,
};

const PerformanceMetricsText = ({ metrics }: { metrics: PerformanceMetrics }) => {
  return (
    <div style={{
      paddingLeft: 50,
    }}
    >
      <p style={{ color: "#FFFFFF" }}>
        Total: {metrics.total.toFixed(1)} ms <br />
        Render: {metrics.render.toFixed(1)} ms <br />
        DrawToCanvas: {metrics.drawToCanvas.toFixed(1)} ms
      </p>
    </div>
  );
};

export type { PerformanceMetrics };
export default PerformanceMetricsText;
