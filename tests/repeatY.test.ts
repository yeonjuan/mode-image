import modImage from "../src/index";
import * as canvas from "canvas";
import options from "./options";
import { fixtures, getImageBufferAfter } from "./helpers";

const repeatY = (image: canvas.Image, repeat: number) => {
  return modImage(image, options).repeatY(repeat).toDataURL();
};

const repeatYImage = getImageBufferAfter(repeatY);

describe("repeatY", () => {
  const img150x150 = fixtures("walk", "150-150", "png");

  it("repeatY 2 times 150x150 ", async () => {
    const result = await repeatYImage(await img150x150, 2);
    expect(result).toMatchImageSnapshot();
  });
});
