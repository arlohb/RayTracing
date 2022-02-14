const SolveQuadratic = (a: number, b: number, c: number): null | number | [number, number] => {
  const determinant = (b ** 2) - (4 * a * c);

  if (determinant < 0) return null;

  if (determinant === 0) {
    return (-b) / (2 * a);
  }

  const plus = (-b + Math.sqrt(determinant)) / (2 * a);
  const minus = (-b - Math.sqrt(determinant)) / (2 * a);

  return [plus, minus];
};

// there might be more here in the future
// eslint-disable-next-line import/prefer-default-export
export { SolveQuadratic };
