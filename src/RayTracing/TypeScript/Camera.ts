import Matrix44 from "./Matrix44";
import Vec, { Vector3 } from "./Vector3";

// these are the centers of each edge
type ImagePlane = {
  left: Vector3,
  right: Vector3,
  bottom: Vector3,
  top: Vector3,
  center: Vector3,
};

class Camera {
  from: Vector3;
  to: Vector3;
  fov: number;
  width: number;
  height: number;

  get matrix(): Matrix44 {
    const [right, up, forward] = this.getVectors();
    return Matrix44.createFromVector3(right, up, forward, this.from);
  }

  constructor(from: Vector3, to: Vector3, fov: number, width: number, height: number) {
    this.from = from;
    this.to = to;
    this.fov = fov;
    this.width = width;
    this.height = height;
  }

  getVectors(): [Vector3, Vector3, Vector3] {
    const forward = Vec.normalize(Vec.sub(this.from, this.to));

    const temp: Vector3 = [0, 1, 0];
    const right = Vec.normalize(Vec.cross(Vec.normalize(temp), forward));

    const up = Vec.normalize(Vec.cross(forward, right));

    return [right, up, forward];
  }

  createImagePlane(): ImagePlane {
    // working for this is in whiteboard
    const fovRad = this.fov * (Math.PI / 180);
    const width = 2 * Math.tan(fovRad / 2);
    const halfWidth = width / 2;

    const height = (width / this.width) * this.height;
    const halfHeight = height / 2;

    const [right, up, forward] = this.getVectors();

    // the image plane is 1 unit away from the camera
    // this is - not + because the camera point in the -forward direction
    const center = Vec.add(this.from, Vec.mul(forward, -1));

    const imagePlane: ImagePlane = {
      left: Vec.sub(center, Vec.mul(right, halfWidth)),
      right: Vec.add(center, Vec.mul(right, halfWidth)),
      bottom: Vec.sub(center, Vec.mul(up, halfHeight)),
      top: Vec.add(center, Vec.mul(up, halfHeight)),
      center,
    };

    return imagePlane;
  }
}

export default Camera;
