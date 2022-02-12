import Vector3 from "./RayTracing/Vector3";
import Matrix33 from "./RayTracing/Matrix33";
import Data from "./Data";

const MathsTest = () => {
  const Point = new Vector3(2, 7, 4);
  const CrossXY = (new Vector3(1, 0, 0)).cross(new Vector3(0, 1, 0));

  const Mat = new Matrix33([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

  return (
    <>
      <Data
        decimalPlaces={2}
        title="Vectors Test"
        data={{
          Point,
          Length: [Point.length(), Point.length().toFixed(1) === "8.3"],
          Normalized: Point.normalize(),
          NormalizedLength: [Point.normalize().length(), Point.normalize().length() === 1],
          "Cross of X and Y": [CrossXY, CrossXY.toFixed(2) === (new Vector3(0, 0, 1)).toFixed(2)],
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
