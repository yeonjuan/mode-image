import * as canvas from "canvas";
import { fixtures, getImageBufferAfter, nodeModeImage } from "./helpers";

const repeatY = (image: canvas.Image, repeat: number) => {
  return nodeModeImage(image).repeatY(repeat).toDataURL();
};

const repeatYImage = getImageBufferAfter(repeatY);

describe("repeatY", () => {
  const img150x150 = fixtures("walk", "150-150", "png");

  it("repeatY 2 times 150x150 ", async () => {
    const result = await repeatYImage(await img150x150, 2);
    expect(result).toMatchImageSnapshot();
  });
});
