import type { Vector3 } from "./Vector3";

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

  static createFromVector3(right: Vector3, up: Vector3, forward: Vector3, from: Vector3): Matrix44 {
    return new Matrix44([
      [right[0], right[1], right[2], 0],
      [up[0], up[1], up[2], 0],
      [forward[0], forward[1], forward[2], 0],
      [from[0], from[1], from[2], 1],
    ]);
  }

  values: Matrix44Values;

  constructor(values?: Matrix44Values) {
    this.values = values ?? Matrix44.identity.copy().values;
  }

  copy(): Matrix44 {
    return new Matrix44(this.values.map((arr) => ([...arr])) as Matrix44Values);
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

  transpose(): Matrix44 {
    const newMat = new Matrix44();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        newMat.values[i][j] = this.values[j][i];
      }
    }

    return newMat;
  }

  // I do not currently understand this. I'd love to at some point though
  // We do inverse of a 3x3 in upper 6th further maths
  // https://gist.github.com/husa/5652439
  inverse(): Matrix44 {
    const A: Matrix44Values = this.copy().values;

    let temp;
    const N = this.values.length;
    const E = [];

    for (let i = 0; i < N; i += 1) { E[i] = [0]; }

    for (let i = 0; i < N; i += 1) {
      for (let j = 0; j < N; j += 1) {
        E[i][j] = 0;
        if (i === j) E[i][j] = 1;
      }
    }

    for (let k = 0; k < N; k += 1) {
      temp = A[k][k];

      for (let j = 0; j < N; j += 1) {
        A[k][j] /= temp;
        E[k][j] /= temp;
      }

      for (let i = k + 1; i < N; i += 1) {
        temp = A[i][k];

        for (let j = 0; j < N; j += 1) {
          A[i][j] -= A[k][j] * temp;
          E[i][j] -= E[k][j] * temp;
        }
      }
    }

    for (let k = N - 1; k > 0; k -= 1) {
      for (let i = k - 1; i >= 0; i -= 1) {
        temp = A[i][k];

        for (let j = 0; j < N; j += 1) {
          A[i][j] -= A[k][j] * temp;
          E[i][j] -= E[k][j] * temp;
        }
      }
    }

    for (let i = 0; i < N; i += 1) {
      for (let j = 0; j < N; j += 1) A[i][j] = E[i][j];
    }
    return new Matrix44(A);
  }
}

export default Matrix44;
export type { Matrix44Values };
