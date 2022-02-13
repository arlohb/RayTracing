type Matrix44Values = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
];

class Matrix44 {
  static readonly identity = new Matrix44([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);

  static readonly epsilon = 0.0000001;

  static createScale(scale: number): Matrix44 {
    return new Matrix44([
      [scale, 0, 0, 0],
      [0, scale, 0, 0],
      [0, 0, scale, 0],
      [0, 0, 0, 1],
    ]);
  }

  static createRotation(around: "x" | "y" | "z", radians: number): Matrix44 {
    if (around === "x") {
      return new Matrix44([
        [1, 0, 0, 0],
        [0, Math.cos(radians), Math.sin(radians), 0],
        [0, -Math.sin(radians), Math.cos(radians), 0],
        [0, 0, 0, 1],
      ]);
    }
    if (around === "y") {
      return new Matrix44([
        [Math.cos(radians), 0, -Math.sin(radians), 0],
        [0, 1, 0, 0],
        [Math.sin(radians), 0, Math.cos(radians), 0],
        [0, 0, 0, 1],
      ]);
    }

    return new Matrix44([
      [Math.cos(radians), Math.sin(radians), 0, 0],
      [-Math.sin(radians), Math.cos(radians), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  static createTranslation(x: number, y: number, z: number): Matrix44 {
    return new Matrix44([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, z, 1],
    ]);
  }

  values: Matrix44Values;

  constructor(values?: Matrix44Values) {
    this.values = values ?? [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  }

  mul(mat: Matrix44): Matrix44 {
    const newMat = new Matrix44();

    // for each element in the final matrix
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        let sum = 0;

        // for each element in a row / column
        for (let x = 0; x < 4; x += 1) {
          sum += this.values[i][x] * mat.values[x][j];
        }

        newMat.values[i][j] = sum;
      }
    }

    return newMat;
  }

  equals(mat: Matrix44): boolean {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        if (Math.abs(this.values[i][j] - mat.values[i][j]) > Matrix44.epsilon) {
          return false;
        }
      }
    }

    return true;
  }

  toString(): string {
    let str = "[ ";

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        str += `${this.values[i][j]}, `;
      }
      if (i !== 3) {
        str += "],\n[ ";
      }
    }

    str += "]";

    return str;
  }

  toFixed(decimalPlaces: number): string {
    let str = "[ ";

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        str += `${this.values[i][j].toFixed(decimalPlaces)}, `;
      }
      if (i !== 3) {
        str += "],\n[ ";
      }
    }

    str += "]";

    return str;
  }
}

export default Matrix44;
