import Vec from "./Vector3";

type RayType = "primary" | "shadow";

class Ray {
  // this is not needed, but is nice to know
  type: RayType;

  origin: Vec;
  direction: Vec;

  constructor(type: RayType, origin: Vec, direction: Vec) {
    this.type = type;
    this.origin = origin;

    // this should be passed in normalized anyway, but just in case
    this.direction = direction.normalize();
  }
}

export default Ray;
