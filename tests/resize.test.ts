import * as canvas from "canvas";
import { fixtures, getImageBufferAfter, nodeModeImage } from "./helpers";
import type { PartialSize } from "../src/types";

const resize = (image: canvas.Image, size: PartialSize) => {
  return nodeModeImage(image).resize(size).toDataURL();
};

const resizeImage = getImageBufferAfter(resize);

describe("resize", () => {
  const img150x150 = fixtures("smile", "150-150", "png");

  it("150x150 to 50x50", async () => {
    const result = await resizeImage(await img150x150, {
      width: 50,
      height: 50,
    });
    expect(result).toMatchImageSnapshot();
  });

  it("150x150 to 100x150", async () => {
    const result = await resizeImage(await img150x150, {
      width: 100,
    });
    expect(result).toMatchImageSnapshot();
  });

  it("150x150 to 150x100", async () => {
    const result = await resizeImage(await img150x150, {
      height: 100,
    });
    expect(result).toMatchImageSnapshot();
  });
});
