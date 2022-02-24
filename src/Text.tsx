import * as React from "react";

const Text = ({ children, style, textStyle }: {
  children: string,
  style?: React.CSSProperties,
  textStyle?: React.CSSProperties
}) => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children.split("\n").map((text, index) => (
        <p
          // eslint-disable-next-line react/no-array-index-key
          key={`${text} ${index}`}
          style={{
            fontSize: 16,
            fontWeight: 300,
            margin: 0,
            padding: 0,
            color: "#FFFFFF",
            textAlign: "left",
            ...textStyle,
          }}
        >
          {text}
          <br />
        </p>
      ))}
    </div>
  );
};

export default Text;
