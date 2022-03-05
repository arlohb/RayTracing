import Vec, { Vector3 } from "../RayTracing/TypeScript/Vector3";
import Matrix44 from "../RayTracing/TypeScript/Matrix44";
import Data from "./Data";

const MathsTest = () => {
  const PointA: Vector3 = [2, -7, 4];
  const PointB: Vector3 = [-3, 9, -1];

  const MatT = Matrix44.createScale(3).mul(Matrix44.createTranslation(1, 2, 3));

  return (
    <>
      <Data
        decimalPlaces={2}
        title="Vectors Test"
        data={{
          "Point A": PointA,
          "Point B": PointB,
          "Length of A": [Vec.length(PointA).toFixed(1), "8.3"],
          "A Normalized": Vec.normalize(PointA),
          "Length of A Normalized": [Vec.length(Vec.normalize(PointA)), 1],
          "Cross of X and Y": [Vec.cross(Vec.unitX, Vec.unitY), Vec.unitZ],
          "Dot of X and Y": [Vec.dot(Vec.unitX, Vec.unitY), 0],
          "Dot of A and B": [Vec.dot(PointA, PointB), -73],
          "Sum of A and B": [Vec.add(PointA, PointB), [-1, 2, 3]],
          "Subtract B from A": [Vec.sub(PointA, PointB), [5, -16, 5]],
          "Multiply A by 3": [Vec.mul(PointA, 3), [6, -21, 12]],
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
          "A by identity": [Vec.transformPoint(PointA, Matrix44.identity.values), PointA],
          "Scale A by 3": [Vec.transformPoint(PointA, Matrix44.createScale(3).values), Vec.mul(PointA, 3)],
          "Rotate unit X pi/2 clockwise about Z axis": [Vec.transformPoint(Vec.unitX, Matrix44.createRotation("z", Math.PI / 2).values), Vec.unitY],
          "Unit X (as a vector) by matrix T": [Vec.transformPoint(Vec.unitX, MatT.values), [3, 0, 0]],
          "Unit X (as a point) by matrix T": [Vec.transformPoint(Vec.unitX, MatT.values), [4, 2, 3]],
        }}
      />
    </>
  );
};

export default MathsTest;
