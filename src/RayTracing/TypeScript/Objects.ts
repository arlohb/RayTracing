import Ray from "./Ray";
import { SolveQuadratic } from "./Solver";
import Vec from "./Vector3";

type Material = {
  colour: [number, number, number],
  specular: number,
};

class Sphere {
  position: Vec;
  radius: number;
  material: Material;

  constructor(position: Vec, radius: number, material: Material) {
    this.position = position;
    this.radius = radius;
    this.material = material;
  }

  public intersect(ray: Ray): number | null {
    // working out in whiteboard
    const newOrigin = ray.origin.sub(this.position);

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

  public normalAtPoint(point: Vec): Vec {
    // simple circle stuff
    return point.sub(this.position).normalize();
  }
}

// eslint-disable-next-line import/prefer-default-export
export { Sphere };
