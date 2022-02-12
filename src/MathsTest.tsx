import Vector3 from "./RayTracing/Vector3";
import Matrix33 from "./RayTracing/Matrix33";
import Data from "./Data";

const MathsTest = () => {
  const PointA = new Vector3(2, -7, 4);
  const PointB = new Vector3(-3, 9, -1);
  const CrossXY = (Vector3.unitX).cross(Vector3.unitY);
  const DotXY = (Vector3.unitX).dot(Vector3.unitY);
  const DotAB = PointA.dot(PointB);
  const SumAB = PointA.add(PointB);
  const SubAB = PointA.sub(PointB);
  const MulA3 = PointA.mul(3);

  const Mat = new Matrix33([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

  return (
    <>
      <Data
        decimalPlaces={2}
        title="Vectors Test"
        data={{
          "Point A": PointA,
          "Length A": [PointA.length(), PointA.length().toFixed(1) === "8.3"],
          "Normalized A": PointA.normalize(),
          "Normalized A Length": [PointA.normalize().length(), PointA.normalize().length() === 1],
          "Cross of X and Y": [CrossXY, CrossXY.equals(Vector3.unitZ)],
          "Dot of X and Y": [DotXY, DotXY === 0],
          "Dot of A and B": [DotAB, DotAB === -73],
          "Sum of A and B": [SumAB, SumAB.equals(new Vector3(-1, 2, 3))],
          "Subtract B from A": [SubAB, SubAB.equals(new Vector3(5, -16, 5))],
          "Multiply A and 3": [MulA3, MulA3.equals(new Vector3(6, -21, 12))],
        }}
      />
      <Data
        decimalPlaces={2}
        title="Matrices Test"
        data={{
          Mat,
        }}
      />
    </>
  );
};

export default MathsTest;
