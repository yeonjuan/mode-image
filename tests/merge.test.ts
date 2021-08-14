import * as canvas from "canvas";
import { fixtures, getImageBufferAfter, nodeModeImage } from "./helpers";

const merge = (image: canvas.Image, imageAfter: canvas.Image) => {
  return nodeModeImage(image).merge(imageAfter).toDataURL();
};

const mergeImage = getImageBufferAfter(merge);

describe("merge", () => {
  const img100x50Right = fixtures("right-arrow", "100-50", "png");
  const img100x50Left = fixtures("left-arrow", "100-50", "png");

  it("merge 100x50 & 100&50", async () => {
    const result = await mergeImage(await img100x50Right, await img100x50Left);
    expect(result).toMatchImageSnapshot();
  });
});
