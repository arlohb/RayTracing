import Vector3 from "./Vector3";

const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

const SphericalToCartesian = (theta: number, phi: number): Vector3 => {
  return new Vector3(
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(theta),
  );
};

const CosTheta = (vec: Vector3): number => {
  return vec.z;
};

const SinTheta2 = (vec: Vector3) => {
  return Math.max(vec.x, 1 - CosTheta(vec) ** 2);
};

const SinTheta = (vec: Vector3) => {
  return Math.sqrt(SinTheta2(vec));
};

const SphericalTheta = (vec: Vector3): number => {
  return Math.acos(clamp(vec.z, -1, 1));
};

const CosPhi = (vec: Vector3): number => {
  const sinTheta = SinTheta(vec);
  if (sinTheta === 0) return 1;
  return clamp(vec.x / sinTheta, -1, 1);
};

const SinPhi = (vec: Vector3): number => {
  const sinTheta = SinTheta(vec);
  if (sinTheta === 0) return 0;
  return clamp(vec.y / sinTheta, -1, 1);
};

const sphericalPhi = (vec: Vector3): number => {
  const phi = Math.atan2(vec.y, vec.x);
  // remap from -pi:pi to 0:2pi
  return (phi < 0) ? (phi + (2 * Math.PI)) : phi;
};

export { SphericalToCartesian, SphericalTheta, sphericalPhi, CosTheta, SinTheta2, SinTheta, CosPhi, SinPhi };
