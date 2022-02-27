import Image, { HexToPixel } from "../../Image";
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

type RayTracerOptions = {
  from: Vector3,
  to: Vector3,
  fov: number,
  width: number,
  height: number,
  scene: Scene,
};

class RayTracer {
  camera: Camera;
  scene: Scene;

  constructor(options: RayTracerOptions) {
    this.camera = new Camera(options.from, options.to, options.fov, options.width, options.height);
    this.scene = options.scene;
  }

  render(): Image {
    const imagePlane = this.camera.createImagePlane();

    // working for this is in whiteboard
    const topLeftPoint = imagePlane.left.add(imagePlane.top).sub(imagePlane.center);

    const widthWorldSpace: number = imagePlane.right.sub(imagePlane.left).length();
    const heightWorldSpace: number = imagePlane.top.sub(imagePlane.bottom).length();
    const [right, up] = this.camera.getVectors();

    const image = new Image(this.camera.width, this.camera.height, HexToPixel("#09c7b7"));

    let minAngle = 1e9;
    let maxAngle = -1e9;

    for (let x = 0; x < image.width; x += 1) {
      for (let y = 0; y < image.height; y += 1) {
        const pixelScreenSpace = {
          x: (x + 0.5) / image.width,
          y: (y + 0.5) / image.height,
        };

        const xOffset: Vector3 = right.mul(pixelScreenSpace.x * widthWorldSpace);
        // mul -1 because it's offset down
        const yOffset: Vector3 = up.mul(-1).mul(pixelScreenSpace.y * heightWorldSpace);

        const pixelWorldSpace = topLeftPoint.add(xOffset).add(yOffset);

        const direction = pixelWorldSpace.sub(this.camera.from).normalize();

        const ray = new Ray("primary", this.camera.from, direction);

        let minHit: Hit = { object: new Sphere(new Vector3(0, 0, 0), 1), distance: 1e9 };

        this.scene.forEach((sphere) => {
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

          const [,,forward] = this.camera.getVectors();

          // normal length can be left out as it will always be 1
          const angle = Math.acos((forward.dot(normal)) / forward.length());

          if (angle < minAngle) minAngle = angle;
          if (angle > maxAngle) maxAngle = angle;

          const brightness = 1 - (angle / Math.PI);

          image.data[x][y] = {
            r: brightness * 255,
            g: brightness * 255,
            b: brightness * 255,
          };
        } else {
          image.data[x][y] = {
            r: 0,
            g: 0,
            b: 0,
          };
        }
      }
    }

    return image;
  }
}

export default RayTracer;
export type { RayTracerOptions };
