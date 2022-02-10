type Matrix33Values = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

class Matrix33 {
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
      for (let j = 0; i < 3; j += 1) {
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
