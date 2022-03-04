import { HexToPixel } from "../../Image";
import Camera from "./Camera";
import Ray from "./Ray";
import Sphere from "./Sphere";
import Vec, { Vector3 } from "./Vector3";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = (v: number, min1: number, max1: number, min2: number, max2: number): number => {
  return min2 + ((v - min1) * (max2 - min1)) / (max1 - min1);
};

type Scene = Sphere[];

type Hit = {
  object: Sphere,
  distance: number,
};

const render = (
  from: Vector3,
  to: Vector3,
  fov: number,
  width: number,
  height: number,
  scene: Scene,
): [number, number, number][][] => {
  const camera = new Camera(from, to, fov, width, height);

  const imagePlane = camera.createImagePlane();

  // working for this is in whiteboard
  const topLeftPoint = Vec.sub(
    Vec.add(imagePlane.left, imagePlane.top),
    imagePlane.center,
  );

  const widthWorldSpace = Vec.length(Vec.sub(imagePlane.right, imagePlane.left));
  const heightWorldSpace = Vec.length(Vec.sub(imagePlane.top, imagePlane.bottom));
  const [right, up] = camera.getVectors();

  const image: [number, number, number][][] = Array.from({ length: width }, () => (Array<[number, number, number]>(height).fill(HexToPixel("#09c7b7"))));

  let minAngle = 1e9;
  let maxAngle = -1e9;

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const pixelScreenSpace = {
        x: (x + 0.5) / width,
        y: (y + 0.5) / height,
      };

      const xOffset = Vec.mul(right, pixelScreenSpace.x * widthWorldSpace);
      // mul -1 because it's offset down
      const yOffset = Vec.mul(Vec.mul(up, -1), pixelScreenSpace.y * heightWorldSpace);

      const pixelWorldSpace = Vec.add(topLeftPoint, Vec.add(xOffset, yOffset));

      const direction = Vec.normalize(Vec.sub(pixelWorldSpace, camera.from));

      const ray = new Ray("primary", camera.from, direction);

      let minHit: Hit = { object: new Sphere([0, 0, 0], 1), distance: 1e9 };

      scene.forEach((sphere) => {
        const distance = sphere.intersect(ray);

        // if it hits
        if (distance !== null) {
          const hit: Hit = {
            object: sphere,
            distance,
          };

          if (minHit.distance > distance) minHit = hit;
        }
      });

      if (minHit.distance !== 1e9) {
        const hitPoint = Vec.add(ray.origin, Vec.mul(ray.direction, minHit.distance));
        const normal = minHit.object.normalAtPoint(hitPoint);

        const [,,forward] = camera.getVectors();

        // normal length can be left out as it will always be 1
        const angle = Math.acos((Vec.dot(forward, normal)) / Vec.length(forward));

        if (angle < minAngle) minAngle = angle;
        if (angle > maxAngle) maxAngle = angle;

        const brightness = 1 - (angle / Math.PI);

        image[x][y] = [
          brightness * 255,
          brightness * 255,
          brightness * 255,
        ];
      } else {
        image[x][y] = [
          0,
          0,
          0,
        ];
      }
    }
  }

  return image;
};

export default render;
export type { Scene };
