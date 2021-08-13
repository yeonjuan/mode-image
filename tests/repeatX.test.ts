import modImage from "../src/index";
import * as canvas from "canvas";
import options from "./options";
import { fixtures, getImageBufferAfter } from "./helpers";
import type { PartialSize } from "../src";

const repeatX = (image: canvas.Image, repeat: number) => {
  return modImage(image, options).repeatX(repeat).toDataURL();
};

const repeatXImage = getImageBufferAfter(repeatX);

describe("repeatX", () => {
  const img150x150 = fixtures("walk", "150-150", "png");

  it("repeatX 3 times 150x150 ", async () => {
    const result = await repeatXImage(await img150x150, 3);
    expect(result).toMatchImageSnapshot();
  });
});
