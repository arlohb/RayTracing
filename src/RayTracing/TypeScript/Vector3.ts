import { Matrix44Values } from "./Matrix44";

const unitX: [number, number, number] = [1, 0, 0];
const unitY: [number, number, number] = [0, 1, 0];
const unitZ: [number, number, number] = [0, 0, 1];

const epsilon = 0.0000001;

const length = (a: [number, number, number]): number => {
  return Math.sqrt((a[0] ** 2) + (a[1] ** 2) + (a[2] ** 2));
};

const dot = (a: [number, number, number], b: [number, number, number]): number => {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
};

const normalize = (a: [number, number, number]): [number, number, number] => {
  const lengthSquared = dot(a, a);

  if (lengthSquared > 0) {
    const inverseLength = 1 / Math.sqrt(lengthSquared);
    return [
      a[0] * inverseLength,
      a[1] * inverseLength,
      a[2] * inverseLength,
    ];
  }

  return a;
};

const cross = (a: [number, number, number], b: [number, number, number]): [number, number, number] => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

const add = (a: [number, number, number], b: [number, number, number]): [number, number, number] => {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
  ];
};

const sub = (a: [number, number, number], b: [number, number, number]): [number, number, number] => {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ];
};

const mul = (a: [number, number, number], r: number): [number, number, number] => {
  return [
    a[0] * r,
    a[1] * r,
    a[2] * r,
  ];
};

const toString = (a: [number, number, number]): string => {
  return `x: ${a[0]}, y: ${a[1]}, z: ${a[2]}`;
};

const toFixed = (a: [number, number, number], decimalPlaces: number): string => {
  return `x: ${a[0].toFixed(decimalPlaces)}, y: ${a[1].toFixed(decimalPlaces)}, z: ${a[2].toFixed(decimalPlaces)}`;
};

const equals = (a: [number, number, number], b: [number, number, number]): boolean => {
  return (
    Math.abs(a[0] - b[0]) < epsilon
    && Math.abs(a[1] - b[1]) < epsilon
    && Math.abs(a[2] - b[2]) < epsilon
  );
};

const transformPoint = (point: [number, number, number], matrix: Matrix44Values): [number, number, number] => {
  // w could also be computed here with this:
  // const w = this.x * mat.values[0][3] + this.y * mat.values[1][3] * mat.values[2][3] + mat.values[3][3];
  // and then each coordinate would be divided by w, to keep w at 1
  // however, w should only be changed by the above formula when doing perspective projection matrices,
  // which are used in rasterization and NOT ray tracing

  return [
    point[0] * matrix[0][0] + point[1] * matrix[1][0] + point[2] * matrix[2][0] + matrix[3][0],
    point[0] * matrix[0][1] + point[1] * matrix[1][1] + point[2] * matrix[2][1] + matrix[3][1],
    point[0] * matrix[0][2] + point[1] * matrix[1][2] + point[2] * matrix[2][2] + matrix[3][2],
  ];
};

const transformVector = (point: [number, number, number], matrix: Matrix44Values): [number, number, number] => {
  return [
    point[0] * matrix[0][0] + point[1] * matrix[1][0] + point[2] * matrix[2][0],
    point[0] * matrix[0][1] + point[1] * matrix[1][1] + point[2] * matrix[2][1],
    point[0] * matrix[0][2] + point[1] * matrix[1][2] + point[2] * matrix[2][2],
  ];
};

const Vec = {
  unitX,
  unitY,
  unitZ,
  epsilon,
  length,
  dot,
  normalize,
  cross,
  add,
  sub,
  mul,
  toString,
  toFixed,
  equals,
  transformPoint,
  transformVector,
};

export default Vec;
