const HexToPixel = (hex: string): [number, number, number] => (
  [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ]
);

class Image {
  data: [number, number, number][][];

  width: number;

  height: number;

  constructor(width: number, height: number, fillValue: [number, number, number]) {
    this.width = width;
    this.height = height;

    // cannot use fill as that just sets references to the same array
    this.data = Array.from({ length: width }, () => (Array<[number, number, number]>(height).fill(fillValue)));
  }
}

const DrawImageToCanvas = (ctx: CanvasRenderingContext2D, image: Image) => {
  const imageData = ctx.createImageData(image.width, image.height);

  for (let x = 0; x < image.width; x += 1) {
    for (let y = 0; y < image.height; y += 1) {
      const pixel = image.data[x][y];
      const dataIndex = 4 * (x + (y * image.width));

      // eslint-disable-next-line prefer-destructuring
      imageData.data[dataIndex + 0] = pixel[0];
      // eslint-disable-next-line prefer-destructuring
      imageData.data[dataIndex + 1] = pixel[1];
      // eslint-disable-next-line prefer-destructuring
      imageData.data[dataIndex + 2] = pixel[2];

      imageData.data[dataIndex + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export { HexToPixel, DrawImageToCanvas };
export default Image;
