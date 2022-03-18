import Ray from "./Ray";
import { SolveQuadratic } from "./Solver";
import Vec from "./Vector3";

type Material = {
  colour: [number, number, number],
  specular: number,
};

class Sphere {
  position: [number, number, number];
  radius: number;
  material: Material;

  constructor(position: [number, number, number], radius: number, material: Material) {
    this.position = position;
    this.radius = radius;
    this.material = material;
  }

  public intersect(ray: Ray): number | null {
    // working out in whiteboard
    const newOrigin = Vec.sub(ray.origin, this.position);

    const a: number = 1;
    const b: number = 2 * Vec.dot(ray.direction, newOrigin);
    const c: number = Vec.dot(newOrigin, newOrigin) - (this.radius ** 2);

    const solutions = SolveQuadratic(a, b, c);

    // doesn't intersect
    if (solutions === null) return null;

    // just touches at 1 point
    if (!Array.isArray(solutions)) return solutions;

    // return the minimum
    return solutions[0] < solutions[1] ? solutions[0] : solutions[1];
  }

  public normalAtPoint(point: [number, number, number]): [number, number, number] {
    // simple circle stuff
    const normal = Vec.normalize(Vec.sub(point, this.position));
    return normal;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { Sphere };
