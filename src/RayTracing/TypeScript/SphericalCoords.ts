const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

const SphericalToCartesian = (theta: number, phi: number): [number, number, number] => {
  return [
    Math.cos(phi) * Math.sin(theta),
    Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
  ];
};

const CosTheta = (vec: [number, number, number]): number => {
  return vec[2];
};

const SinTheta2 = (vec: [number, number, number]) => {
  return Math.max(vec[0], 1 - CosTheta(vec) ** 2);
};

const SinTheta = (vec: [number, number, number]) => {
  return Math.sqrt(SinTheta2(vec));
};

const SphericalTheta = (vec: [number, number, number]): number => {
  return Math.acos(clamp(vec[2], -1, 1));
};

const CosPhi = (vec: [number, number, number]): number => {
  const sinTheta = SinTheta(vec);
  if (sinTheta === 0) return 1;
  return clamp(vec[0] / sinTheta, -1, 1);
};

const SinPhi = (vec: [number, number, number]): number => {
  const sinTheta = SinTheta(vec);
  if (sinTheta === 0) return 0;
  return clamp(vec[1] / sinTheta, -1, 1);
};

const sphericalPhi = (vec: [number, number, number]): number => {
  const phi = Math.atan2(vec[1], vec[0]);
  // remap from -pi:pi to 0:2pi
  return (phi < 0) ? (phi + (2 * Math.PI)) : phi;
};

export { SphericalToCartesian, SphericalTheta, sphericalPhi, CosTheta, SinTheta2, SinTheta, CosPhi, SinPhi };
