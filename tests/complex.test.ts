import { fixtures, getImageBufferAfter, nodeModeImage } from "./helpers";
import dataUriToBuffer from "data-uri-to-buffer";

describe("complex", () => {
  const image100x50 = fixtures("right-arrow", "100-50", "png");

  it("rotate, repeatX, repeatY ", async () => {
    const first = await nodeModeImage(await image100x50)
      .rotate((Math.PI / 180) * 90)
      .repeatX(2)
      .repeatY(3)
      .rotate((Math.PI / 180) * 90)
      .toDataURL();
    const second = await nodeModeImage(await image100x50)
      .rotate((Math.PI / 180) * 90)
      .repeatX(2)
      .repeatY(3)
      .toDataURL();
    const result = await nodeModeImage(first).merge(second).toDataURL();
    const buffer = dataUriToBuffer(result);
    expect(buffer).toMatchImageSnapshot();
  });
});
