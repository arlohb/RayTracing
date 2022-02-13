import Vector3 from "./RayTracing/Vector3";
import Matrix44 from "./RayTracing/Matrix44";
import Data from "./Data";

const MathsTest = () => {
  const PointA = new Vector3(2, -7, 4);
  const PointB = new Vector3(-3, 9, -1);

  const MatT = Matrix44.createScale(3).mul(Matrix44.createTranslation(1, 2, 3));

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
        title="Matrices Test"
        data={{
          "T = scale by 3 followed by\ntranslation by (1, 2, 3)": [MatT, new Matrix44([[3, 0, 0, 0], [0, 3, 0, 0], [0, 0, 3, 0], [1, 2, 3, 1]])],
          "T transposed": [MatT.transpose(), new Matrix44([[3, 0, 0, 1], [0, 3, 0, 2], [0, 0, 3, 3], [0, 0, 0, 1]])],
          "T inverse": [MatT.inverse(), (new Matrix44([[1 / 3, 0, 0, 0], [0, 1 / 3, 0, 0], [0, 0, 1 / 3, 0], [-1 / 3, -2 / 3, -1, 1]]))],
        }}
      />
      <Data
        decimalPlaces={2}
        title="Transformations Test"
        data={{
          "A by identity": [PointA.transformPoint(Matrix44.identity), PointA],
          "Scale A by 3": [PointA.transformPoint(Matrix44.createScale(3)), PointA.mul(3)],
          "Rotate unit X pi/2 clockwise about Z axis": [Vector3.unitX.transformPoint(Matrix44.createRotation("z", Math.PI / 2)), Vector3.unitY],
          "Unit X (as a vector) by matrix T": [Vector3.unitX.transformVector(MatT), new Vector3(3, 0, 0)],
          "Unit X (as a point) by matrix T": [Vector3.unitX.transformPoint(MatT), new Vector3(4, 2, 3)],
        }}
      />
    </>
  );
};

export default MathsTest;
