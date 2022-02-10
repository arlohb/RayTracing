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
            {
              (!Array.isArray(value))
                ? `${paddedKey} \u00a0\u00a0${fixed !== undefined ? value.toFixed(fixed) : value.toString()} ${units ?? ""}`
                : `${paddedKey} ${value[1] ? "✔" : "❌"} ${fixed !== undefined ? value[0].toFixed(fixed) : value[0].toString()}`
            }
          </p>
        );
      })}
    </div>
  );
};

export default Data;
