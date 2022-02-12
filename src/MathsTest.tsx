import Vector3 from "./RayTracing/Vector3";
import Matrix33 from "./RayTracing/Matrix33";
import Data from "./Data";

const MathsTest = () => {
  const PointA = new Vector3(2, -7, 4);
  const PointB = new Vector3(-3, 9, -1);

  const MatA = new Matrix33([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  const MatB = new Matrix33([[-3, 2, 1], [-8, 4, -1], [2, 5, 2]]);

  return (
    <>
      <Data
        decimalPlaces={2}
        title="Vectors Test"
        data={{
          "Point A": PointA,
          "Point B": PointB,
          "Length of A": [PointA.length().toFixed(1), "8.3"],
          "A Normalized": PointA.normalize(),
          "Length of A Normalized": [PointA.normalize().length(), 1],
          "Cross of X and Y": [Vector3.unitX.cross(Vector3.unitY), Vector3.unitZ],
          "Dot of X and Y": [Vector3.unitX.dot(Vector3.unitY), 0],
          "Dot of A and B": [PointA.dot(PointB), -73],
          "Sum of A and B": [PointA.add(PointB), new Vector3(-1, 2, 3)],
          "Subtract B from A": [PointA.sub(PointB), new Vector3(5, -16, 5)],
          "Multiply A by 3": [PointA.mul(3), new Vector3(6, -21, 12)],
        }}
      />
      <Data
        decimalPlaces={2}
        title="Transformations Test"
        data={{
          "A by Matrix A": [PointA.transform(MatA), new Vector3(2, 1, 0)],
          "A by identity": [PointA.transform(Matrix33.identity), PointA],
          "Scale A by 3": [PointA.transform(Matrix33.createScale(3)), PointA.mul(3)],
          "Rotate unit X pi/2 clockwise about Z axis": [Vector3.unitX.transform(Matrix33.createRotation("z", Math.PI / 2)), Vector3.unitY],
        }}
      />
      <Data
        decimalPlaces={2}
        title="Matrices Test"
        data={{
          "Matrix A": MatA,
          "Matrix B": MatB,
          "A * B": [MatA.mul(MatB), new Matrix33([[-13, 25, 5], [-40, 58, 11], [-67, 91, 17]])],
          "B * A": [MatB.mul(MatA), new Matrix33([[12, 12, 12], [1, -4, -9], [36, 45, 54]])],
          "Scale by 3": [Matrix33.createScale(3), new Matrix33([[3, 0, 0], [0, 3, 0], [0, 0, 3]])],
        }}
      />
    </>
  );
};

export default MathsTest;
