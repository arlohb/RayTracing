const Text = ({ children, fontSize, fontWeight, style }: {
  children: string,
  fontSize?: number,
  fontWeight?: number,
  style?: React.CSSProperties,
}) => {
  return (
    <p
      style={{
        fontSize: fontSize ?? 16,
        fontWeight: fontWeight ?? 300,
        color: "#FFFFFF",
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
};

export default Text;
