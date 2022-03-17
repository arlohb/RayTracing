import Ray from "./Ray";
import { SolveQuadratic } from "./Solver";
import Vec from "./Vector3";

const Sphere = {
  intersect: (sphere: [[number, number, number], number, [number, number, number]], ray: Ray): number | null => {
    // working out in whiteboard
    const newOrigin = Vec.sub(ray.origin, sphere[0]);

    const a: number = 1;
    const b: number = 2 * Vec.dot(ray.direction, newOrigin);
    const c: number = Vec.dot(newOrigin, newOrigin) - (sphere[1] ** 2);

    const solutions = SolveQuadratic(a, b, c);

    // doesn't intersect
    if (solutions === null) return null;

    // just touches at 1 point
    if (!Array.isArray(solutions)) return solutions;

    // return the minimum
    return solutions[0] < solutions[1] ? solutions[0] : solutions[1];
  },
  normalAtPoint: (sphere: [[number, number, number], number, [number, number, number]], point: [number, number, number]): [number, number, number] => {
    // simple circle stuff
    const normal = Vec.normalize(Vec.sub(point, sphere[0]));
    return normal;
  },
};

// eslint-disable-next-line import/prefer-default-export
export { Sphere };
