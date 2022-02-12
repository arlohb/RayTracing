import Matrix33 from "./Matrix33";

class Vector3 {
  static readonly unitX = new Vector3(1, 0, 0);
  static readonly unitY = new Vector3(0, 1, 0);
  static readonly unitZ = new Vector3(0, 0, 1);

  static readonly epsilon = 0.0000001;

  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  length(): number {
    return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
  }

  dot(vec: Vector3): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  normalize(): Vector3 {
    const vec = this;

    const lengthSquared = vec.dot(this);
    if (lengthSquared > 0) {
      const inverseLength = 1 / Math.sqrt(lengthSquared);
      return new Vector3(
        this.x * inverseLength,
        this.y * inverseLength,
        this.z * inverseLength,
      );
    }

    return vec;
  }

  cross(vec: Vector3): Vector3 {
    return new Vector3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x,
    );
  }

  add(vec: Vector3): Vector3 {
    return new Vector3(
      this.x + vec.x,
      this.y + vec.y,
      this.z + vec.z,
    );
  }

  sub(vec: Vector3): Vector3 {
    return new Vector3(
      this.x - vec.x,
      this.y - vec.y,
      this.z - vec.z,
    );
  }

  mul(r: number): Vector3 {
    return new Vector3(
      this.x * r,
      this.y * r,
      this.z * r,
    );
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`;
  }

  toFixed(decimalPlaces: number): string {
    return `x: ${this.x.toFixed(decimalPlaces)}, y: ${this.y.toFixed(decimalPlaces)}, z: ${this.z.toFixed(decimalPlaces)}`;
  }

  equals(vec: Vector3): boolean {
    return (
      Math.abs(this.x - vec.x) < Vector3.epsilon
      && Math.abs(this.y - vec.y) < Vector3.epsilon
      && Math.abs(this.z - vec.z) < Vector3.epsilon
    );
  }

  transform(mat: Matrix33): Vector3 {
    return new Vector3(
      this.x * mat.values[0][0] + this.y * mat.values[1][0] + this.z * mat.values[2][0],
      this.x * mat.values[0][1] + this.y * mat.values[1][1] + this.z * mat.values[2][1],
      this.x * mat.values[0][2] + this.y * mat.values[1][2] + this.z * mat.values[2][2],
    );
  }
}

export default Vector3;
