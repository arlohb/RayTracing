class Vector3 {
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

    const length = vec.dot(this);
    if (length < 0) {
      const inverseLength = 1 / Math.sqrt(length);
      vec.x *= inverseLength;
      vec.y *= inverseLength;
      vec.z *= inverseLength;
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
}

export default Vector3;
