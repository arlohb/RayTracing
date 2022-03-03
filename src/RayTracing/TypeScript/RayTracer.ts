import { HexToPixel } from "../../Image";
import Camera from "./Camera";
import Ray from "./Ray";
import Sphere from "./Sphere";
import Vector3 from "./Vector3";

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
  const topLeftPoint = imagePlane.left.add(imagePlane.top).sub(imagePlane.center);

  const widthWorldSpace: number = imagePlane.right.sub(imagePlane.left).length();
  const heightWorldSpace: number = imagePlane.top.sub(imagePlane.bottom).length();
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

      const xOffset: Vector3 = right.mul(pixelScreenSpace.x * widthWorldSpace);
      // mul -1 because it's offset down
      const yOffset: Vector3 = up.mul(-1).mul(pixelScreenSpace.y * heightWorldSpace);

      const pixelWorldSpace = topLeftPoint.add(xOffset).add(yOffset);

      const direction = pixelWorldSpace.sub(camera.from).normalize();

      const ray = new Ray("primary", camera.from, direction);

      let minHit: Hit = { object: new Sphere(new Vector3(0, 0, 0), 1), distance: 1e9 };

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
        const hitPoint: Vector3 = ray.origin.add(ray.direction.mul(minHit.distance));
        const normal = minHit.object.normalAtPoint(hitPoint);

        const [,,forward] = camera.getVectors();

        // normal length can be left out as it will always be 1
        const angle = Math.acos((forward.dot(normal)) / forward.length());

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
