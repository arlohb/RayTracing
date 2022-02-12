type Matrix33Values = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

class Matrix33 {
  static readonly identity = new Matrix33([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

  static readonly epsilon = 0.0000001;

  static createScale(scale: number): Matrix33 {
    return new Matrix33([
      [scale, 0, 0],
      [0, scale, 0],
      [0, 0, scale],
    ]);
  }

  static createRotation(around: "x" | "y" | "z", radians: number): Matrix33 {
    if (around === "x") {
      return new Matrix33([
        [1, 0, 0],
        [0, Math.cos(radians), Math.sin(radians)],
        [0, -Math.sin(radians), Math.cos(radians)],
      ]);
    }
    if (around === "y") {
      return new Matrix33([
        [Math.cos(radians), 0, -Math.sin(radians)],
        [0, 1, 0],
        [Math.sin(radians), 0, Math.cos(radians)],
      ]);
    }

    return new Matrix33([
      [Math.cos(radians), Math.sin(radians), 0],
      [-Math.sin(radians), Math.cos(radians), 0],
      [0, 0, 1],
    ]);
  }

  values: Matrix33Values;

  constructor(values?: Matrix33Values) {
    this.values = values ?? [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  mul(mat: Matrix33): Matrix33 {
    const newMat = new Matrix33();

    // for each element in the final matrix
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        let sum = 0;

        // for each element in a row / column
        for (let x = 0; x < 3; x += 1) {
          sum += this.values[i][x] * mat.values[x][j];
        }

        newMat.values[i][j] = sum;
      }
    }

    return newMat;
  }

  equals(mat: Matrix33): boolean {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (Math.abs(this.values[i][j] - mat.values[i][j]) > Matrix33.epsilon) {
          return false;
        }
      }
    }

    return true;
  }

  toString(): string {
    let str = "[ ";

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        str += `${this.values[i][j]}, `;
      }
      if (i !== 2) {
        str += "],\n[ ";
      }
    }

    str += "]";

    return str;
  }

  toFixed(decimalPlaces: number): string {
    let str = "[ ";

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        str += `${this.values[i][j].toFixed(decimalPlaces)}, `;
      }
      if (i !== 2) {
        str += "],\n[ ";
      }
    }

    str += "]";

    return str;
  }
}

export default Matrix33;
