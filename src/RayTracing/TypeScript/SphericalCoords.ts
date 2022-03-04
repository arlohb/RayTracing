import { Vector3 } from "./Vector3";

const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

const SphericalToCartesian = (theta: number, phi: number): Vector3 => {
  return [
    Math.cos(phi) * Math.sin(theta),
    Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
  ];
};

const CosTheta = (vec: Vector3): number => {
  return vec[2];
};

const SinTheta2 = (vec: Vector3) => {
  return Math.max(vec[0], 1 - CosTheta(vec) ** 2);
};

const SinTheta = (vec: Vector3) => {
  return Math.sqrt(SinTheta2(vec));
};

const SphericalTheta = (vec: Vector3): number => {
  return Math.acos(clamp(vec[2], -1, 1));
};

const CosPhi = (vec: Vector3): number => {
  const sinTheta = SinTheta(vec);
  if (sinTheta === 0) return 1;
  return clamp(vec[0] / sinTheta, -1, 1);
};

const SinPhi = (vec: Vector3): number => {
  const sinTheta = SinTheta(vec);
  if (sinTheta === 0) return 0;
  return clamp(vec[1] / sinTheta, -1, 1);
};

const sphericalPhi = (vec: Vector3): number => {
  const phi = Math.atan2(vec[1], vec[0]);
  // remap from -pi:pi to 0:2pi
  return (phi < 0) ? (phi + (2 * Math.PI)) : phi;
};

export { SphericalToCartesian, SphericalTheta, sphericalPhi, CosTheta, SinTheta2, SinTheta, CosPhi, SinPhi };
