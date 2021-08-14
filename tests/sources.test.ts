import DATA_URL from "./__fixtures__/data-url";
import { nodeModeImage } from "./helpers";
import * as canvas from "canvas";

describe("sources", () => {
  it("data-url", async () => {
    const result = await nodeModeImage(DATA_URL).toDataURL();
    expect(result).toEqual(DATA_URL);
  });
  it("Image", async () => {
    const image = new canvas.Image();
    image.src = DATA_URL;
    const result = await nodeModeImage(image).toDataURL();
    expect(result).toEqual(DATA_URL);
  });
});
