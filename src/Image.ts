const HexToPixel = (hex: string): [number, number, number] => (
  [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ]
);

const DrawImageToCanvas = (ctx: CanvasRenderingContext2D, image: [number, number, number][][]) => {
  const width = image.length;
  const height = image[0].length;

  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const pixel = image[x][y];
      const dataIndex = 4 * (x + (y * width));

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
