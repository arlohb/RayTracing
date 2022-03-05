import Vec from "./Vector3";

type RayType = "primary" | "shadow";

class Ray {
  // this is not needed, but is nice to know
  type: RayType;

  origin: [number, number, number];
  direction: [number, number, number];

  constructor(type: RayType, origin: [number, number, number], direction: [number, number, number]) {
    this.type = type;
    this.origin = origin;

    // this should be passed in normalized anyway, but just in case
    this.direction = Vec.normalize(direction);
  }
}

export default Ray;
