import modImage from "../src/index";
import * as canvas from "canvas";
import options from "./options";
import { fixtures, getImageBufferAfter } from "./helpers";

const rotate = (image: canvas.Image, radian: number) => {
  return modImage(image, options).rotate(radian).toDataURL();
};

const rotateImage = getImageBufferAfter(rotate);

const toRadian = (degree: number) => (Math.PI / 180) * degree;

describe("rotate", () => {
  const img100x100 = fixtures("right-arrow", "100-100", "png");
  const img100x50 = fixtures("right-arrow", "100-50", "png");

  it("90 deg 100x100", async () => {
    const result = await rotateImage(await img100x100, toRadian(90));
    expect(result).toMatchImageSnapshot();
  });

  it("90 deg 100x50", async () => {
    const result = await rotateImage(await img100x50, toRadian(90));
    expect(result).toMatchImageSnapshot();
  });

  it("30 deg 100x50", async () => {
    const result = await rotateImage(await img100x50, toRadian(30));
    expect(result).toMatchImageSnapshot();
  });
});
