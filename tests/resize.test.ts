import modImage from "../src/index";
import * as canvas from "canvas";
import options from "./options";
import { fixtures, getImageBufferAfter } from "./helpers";
import type { PartialSize } from "../src/types";

const resize = (image: canvas.Image, size: PartialSize) => {
  return modImage(image, options).resize(size).toDataURL();
};

const resizeImage = getImageBufferAfter(resize);

describe("resize", () => {
  const img150x150 = fixtures("smile", "150-150", "png");

  it("resize 150x150 to 50x50", async () => {
    const result = await resizeImage(await img150x150, {
      width: 50,
      height: 50,
    });
    expect(result).toMatchImageSnapshot();
  });

  it("resize 150x150 to 100x150", async () => {
    const result = await resizeImage(await img150x150, {
      width: 100,
    });
    expect(result).toMatchImageSnapshot();
  });

  it("resize 150x150 to 150x100", async () => {
    const result = await resizeImage(await img150x150, {
      height: 100,
    });
    expect(result).toMatchImageSnapshot();
  });
});
