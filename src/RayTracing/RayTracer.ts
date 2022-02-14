import Image, { HexToPixel, Pixel } from "../Image";
import Camera from "./Camera";
import Ray from "./Ray";
import Vector3 from "./Vector3";

type RayTracerOptions = {
  from: Vector3,
  to: Vector3,
  fov: number,
  width: number,
  height: number,
};

// only used temporarily, added types
// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56?permalink_comment_id=2951694#gistcomment-2951694
const map = (value: number, x1: number, y1: number, x2: number, y2: number) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

class RayTracer {
  camera: Camera;

  constructor(options: RayTracerOptions) {
    this.camera = new Camera(options.from, options.to, options.fov, options.width, options.height);
  }

  render(): Image {
    const imagePlane = this.camera.createImagePlane();

    // working for this is in whiteboard
    const topLeftPoint = imagePlane.left.add(imagePlane.top).sub(imagePlane.center);

    const widthWorldSpace: number = imagePlane.right.sub(imagePlane.left).length();
    const heightWorldSpace: number = imagePlane.top.sub(imagePlane.bottom).length();
    const [right, up] = this.camera.getVectors();

    const image = new Image(this.camera.width, this.camera.height, HexToPixel("#09c7b7"));

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

        const pixel: Pixel = {
          r: map(ray.direction.x, -1, 1, 0, 255),
          g: map(ray.direction.y, -1, 1, 0, 255),
          b: map(ray.direction.z, -1, 1, 0, 255),
        };

        image.data[x][y] = pixel;
      }
    }

    return image;
  }
}

export default RayTracer;
export type { RayTracerOptions };
