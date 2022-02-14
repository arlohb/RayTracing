import Matrix44 from "./Matrix44";
import Vector3 from "./Vector3";

class Camera {
  from: Vector3;
  to: Vector3;

  get matrix(): Matrix44 {
    const [right, up, forward] = this.getVectors();
    return Matrix44.createFromVector3(right, up, forward, this.from);
  }

  constructor(from: Vector3, to: Vector3) {
    this.from = from;
    this.to = to;
  }

  getVectors(): [Vector3, Vector3, Vector3] {
    const forward = this.from.sub(this.to).normalize();

    const temp = new Vector3(0, 1, 0);
    const right = temp.normalize().cross(forward);

    const up = forward.cross(right);

    return [right, up, forward];
  }
}

export default Camera;
