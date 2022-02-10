type ToStringGeneric = {
  toString: () => string,
  toFixed: (decimalPlaces: number) => string,
};

const Data = ({ data, fixed, units, title }: {
  data: { [key: string]: ToStringGeneric | [ToStringGeneric, boolean] },
  fixed?: number,
  units?: string,
  title?: string,
}) => {
  const padding = 20;

  return (
    <div style={{
      marginTop: 40,
      marginLeft: 50,
    }}
    >
      {title ? <p style={{ color: "#FFFFFF", fontWeight: "bolder" }}>{title}</p> : null}
      {Object.entries(data).map(([key, value]) => {
        const paddedKey = padding ? key.padEnd(padding, "\u00a0") : key;
        let separator;
        let realValue: ToStringGeneric;

        if (!Array.isArray(value)) {
          realValue = value;
          separator = "\u00a0\u00a0";
        } else {
          [realValue] = value;
          separator = value[1] ? "✔" : "❌";
        }

        const roundedValue = fixed !== undefined ? realValue.toFixed(fixed) : realValue.toString();

        return (
          <p
            style={{
              fontSize: 16,
              color: "#FFFFFF",
              margin: 0,
              padding: 0,
            }}
            key={key}
          >
            {`${paddedKey} ${separator} ${roundedValue} ${units ?? ""}`}
          </p>
        );
      })}
    </div>
  );
};

export default Data;
