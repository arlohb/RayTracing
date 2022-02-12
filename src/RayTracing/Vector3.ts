class Vector3 {
  static readonly unitX = new Vector3(1, 0, 0);
  static readonly unitY = new Vector3(0, 1, 0);
  static readonly unitZ = new Vector3(0, 0, 1);

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
      this.x === vec.x
      && this.y === vec.y
      && this.z === vec.z
    );
  }
}

export default Vector3;
