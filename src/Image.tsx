type Pixel = {
  r: number,
  g: number,
  b: number,
};

const HexToPixel = (hex: string): Pixel => {
  const pixel = {
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16),
  };

  return pixel;
};

class Image {
  data: Pixel[][];

  width: number;

  height: number;

  constructor(width: number, height: number, fillValue: Pixel) {
    this.width = width;
    this.height = height;

    // cannot use fill as that just sets references to the same array
    this.data = Array.from({ length: width }, () => (Array<Pixel>(height).fill(fillValue)));
  }
}

const DrawImageToCanvas = (ctx: CanvasRenderingContext2D, image: Image) => {
  const imageData = ctx.createImageData(image.width, image.height);

  for (let x = 0; x < image.width; x += 1) {
    for (let y = 0; y < image.height; y += 1) {
      const pixel = image.data[x][y];
      const dataIndex = 4 * (x + (y * image.width));

      imageData.data[dataIndex + 0] = pixel.r;
      imageData.data[dataIndex + 1] = pixel.g;
      imageData.data[dataIndex + 2] = pixel.b;
      imageData.data[dataIndex + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export type { Pixel };
export { HexToPixel, DrawImageToCanvas };
export default Image;
