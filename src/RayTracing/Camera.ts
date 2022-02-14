import Matrix44 from "./Matrix44";
import Vector3 from "./Vector3";

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
    const forward = this.from.sub(this.to).normalize();

    const temp = new Vector3(0, 1, 0);
    const right = temp.normalize().cross(forward).normalize();

    const up = forward.cross(right).normalize();

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
    const center = this.from.add(forward.mul(-1));

    const imagePlane: ImagePlane = {
      left: center.sub(right.mul(halfWidth)),
      right: center.add(right.mul(halfWidth)),
      bottom: center.sub(up.mul(halfHeight)),
      top: center.add(up.mul(halfHeight)),
      center,
    };

    return imagePlane;
  }
}

export default Camera;
