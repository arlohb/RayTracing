import Text from "./Text";

type ToStringGeneric = {
  toString: () => string,
  toFixed: (decimalPlaces: number) => string,
};

const GridRow = ({ left, right, testPassed }: {
  left: string,
  right: string,
  testPassed?: boolean,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Text style={{ flex: 1 }}>
        {left}
      </Text>

      <div style={{ flex: 0.12 }}>
        <Text>{testPassed === undefined ? "" : (testPassed ? "✅" : "❌")}</Text>
      </div>

      <Text style={{ flex: 1.7 }}>
        {right}
      </Text>
    </div>
  );
};

const Data = ({ data, decimalPlaces, units, title }: {
  data: { [key: string]: ToStringGeneric | [ToStringGeneric, boolean] },
  decimalPlaces?: number,
  units?: string,
  title: string,
}) => {
  return (
    <div style={{
      marginTop: 40,
      marginLeft: 50,
    }}
    >
      <Text fontWeight={600}>
        {title}
      </Text>

      {Object.entries(data).map(([key, value]) => {
        const realValue = Array.isArray(value) ? value[0] : value;

        const roundedValue = decimalPlaces !== undefined
          ? realValue.toFixed(decimalPlaces)
          : realValue.toString();

        return (
          <GridRow
            key={key}
            left={key}
            right={`${roundedValue} ${units ?? ""}`}
            testPassed={Array.isArray(value) ? value[1] : undefined}
          />
        );
      })}
    </div>
  );
};

export default Data;
