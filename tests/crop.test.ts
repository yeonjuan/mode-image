import modImage from "../src/index";
import * as canvas from "canvas";
import options from "./options";
import { fixtures, getImageBufferAfter } from "./helpers";
import type { RectArea } from "../src/types";

const crop = (image: canvas.Image, area: RectArea) => {
  return modImage(image, options).crop(area).toDataURL();
};

const cropImage = getImageBufferAfter(crop);

describe("resize", () => {
  const img150x150 = fixtures("smile", "150-150", "png");

  it("resize 150x150 to 50x50", async () => {
    const result = await cropImage(await img150x150, {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    });
    expect(result).toMatchImageSnapshot();
  });

  it("resize 150x150 to 50x50", async () => {
    const result = await cropImage(await img150x150, {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    });
    expect(result).toMatchImageSnapshot();
  });
});
