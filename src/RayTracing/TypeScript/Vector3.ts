import { Matrix44Values } from "./Matrix44";

class Vec {
  public x: number;
  public y: number;
  public z: number;

  static unitX: [number, number, number] = [1, 0, 0];
  static unitY: [number, number, number] = [0, 1, 0];
  static unitZ: [number, number, number] = [0, 0, 1];

  static epsilon = 0.0000001;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public length(): number {
    return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
  }

  public dot(b: Vec): number {
    return (this.x * b.x) + (this.y * b.y) + (this.z * b.z);
  }

  public normalize(): Vec {
    const copy = new Vec(this.x, this.y, this.z);

    const lengthSquared = copy.dot(copy);

    if (lengthSquared > 0) {
      const inverseLength = 1 / Math.sqrt(lengthSquared);
      return new Vec(
        copy.x * inverseLength,
        copy.y * inverseLength,
        copy.z * inverseLength,
      );
    }

    return copy;
  }

  public cross(b: Vec): Vec {
    return new Vec(
      this.y * b.z - this.z * b.y,
      this.z * b.x - this.x * b.z,
      this.x * b.y - this.y * b.x,
    );
  }

  public add(b: Vec): Vec {
    return new Vec(
      this.x + b.x,
      this.y + b.y,
      this.z + b.z,
    );
  }

  public sub(b: Vec): Vec {
    return new Vec(
      this.x - b.x,
      this.y - b.y,
      this.z - b.z,
    );
  }

  public mul(r: number): Vec {
    return new Vec(
      this.x * r,
      this.y * r,
      this.z * r,
    );
  }

  public toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`;
  }

  public toFixed(decimalPlaces: number): string {
    return `x: ${this.x.toFixed(decimalPlaces)}, y: ${this.y.toFixed(decimalPlaces)}, z: ${this.z.toFixed(decimalPlaces)}`;
  }

  public toTuple(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public equals(b: Vec): boolean {
    return (
      Math.abs(this.x - b.x) < Vec.epsilon
      && Math.abs(this.y - b.y) < Vec.epsilon
      && Math.abs(this.z - b.z) < Vec.epsilon
    );
  }

  public transformPoint(matrix: Matrix44Values): Vec {
    // w could also be computed here with this:
    // const w = this.x * mat.values[0][3] + this.y * mat.values[1][3] * mat.values[2][3] + mat.values[3][3];
    // and then each coordinate would be divided by w, to keep w at 1
    // however, w should only be changed by the above formula when doing perspective projection matrices,
    // which are used in rasterization and NOT ray tracing

    return new Vec(
      this.x * matrix[0][0] + this.y * matrix[1][0] + this.z * matrix[2][0] + matrix[3][0],
      this.x * matrix[0][1] + this.y * matrix[1][1] + this.z * matrix[2][1] + matrix[3][1],
      this.x * matrix[0][2] + this.y * matrix[1][2] + this.z * matrix[2][2] + matrix[3][2],
    );
  }

  public transformVector(matrix: Matrix44Values): [number, number, number] {
    return [
      this.x * matrix[0][0] + this.y * matrix[1][0] + this.z * matrix[2][0],
      this.x * matrix[0][1] + this.y * matrix[1][1] + this.z * matrix[2][1],
      this.x * matrix[0][2] + this.y * matrix[1][2] + this.z * matrix[2][2],
    ];
  }
}

export default Vec;
