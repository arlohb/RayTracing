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
    <tr>
      <td style={{ width: 250 }}>
        <Text>
          {left}
        </Text>
      </td>

      <td style={{ width: 20 }}>
        <Text>{testPassed === undefined ? "" : (testPassed ? "✅" : "❌")}</Text>
      </td>

      <td>
        <Text style={{ paddingLeft: 10 }}>
          {right}
        </Text>
      </td>
    </tr>
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
      <Text style={{ marginBottom: 12 }} textStyle={{ fontWeight: 600 }}>
        {title}
      </Text>

      <table style={{ tableLayout: "fixed" }}>
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
};

export default Data;
