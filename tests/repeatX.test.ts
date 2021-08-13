import * as canvas from "canvas";
import { fixtures, getImageBufferAfter, nodeModeImage } from "./helpers";

const repeatX = (image: canvas.Image, repeat: number) => {
  return nodeModeImage(image).repeatX(repeat).toDataURL();
};

const repeatXImage = getImageBufferAfter(repeatX);

describe("repeatX", () => {
  const img150x150 = fixtures("walk", "150-150", "png");

  it("repeatX 3 times 150x150 ", async () => {
    const result = await repeatXImage(await img150x150, 3);
    expect(result).toMatchImageSnapshot();
  });
});
