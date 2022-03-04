import Vec, { Vector3 } from "./Vector3";

type RayType = "primary" | "shadow";

class Ray {
  // this is not needed, but is nice to know
  type: RayType;

  origin: Vector3;
  direction: Vector3;

  constructor(type: RayType, origin: Vector3, direction: Vector3) {
    this.type = type;
    this.origin = origin;

    // this should be passed in normalized anyway, but just in case
    this.direction = Vec.normalize(direction);
  }
}

export default Ray;
