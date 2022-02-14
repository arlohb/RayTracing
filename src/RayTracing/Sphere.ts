import Ray from "./Ray";
import { SolveQuadratic } from "./Solver";
import Vector3 from "./Vector3";

class Sphere {
  origin: Vector3;
  radius: number;

  constructor(origin: Vector3, radius: number) {
    this.origin = origin;
    this.radius = radius;
  }

  intersect(ray: Ray): number | null {
    // working out in whiteboard
    const newOrigin = ray.origin.sub(this.origin);

    const a: number = 1;
    const b: number = 2 * ray.direction.dot(newOrigin);
    const c: number = newOrigin.dot(newOrigin) - (this.radius ** 2);

    const solutions = SolveQuadratic(a, b, c);

    // doesn't intersect
    if (solutions === null) return null;

    // just touches at 1 point
    if (!Array.isArray(solutions)) return solutions;

    // return the minimum
    return solutions[0] < solutions[1] ? solutions[0] : solutions[1];
  }

  normalAtPoint(point: Vector3): Vector3 {
    // simple circle stuff
    const normal = point.sub(this.origin).normalize();
    return normal;
  }
}

export default Sphere;
