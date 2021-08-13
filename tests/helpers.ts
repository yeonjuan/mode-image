import path from "path";
import dataUriToBuffer from "data-uri-to-buffer";
import * as canvas from "canvas";

type Name = "right-arrow" | "smile";
type Size = `${number}-${number}`;
type Ext = "png";

const resolveFixture = (filename: string) =>
  path.join(__dirname, "__fixtures__", filename);

const loadFixtureImage = (name: string) => {
  return canvas.loadImage(resolveFixture(name));
};

export const fixtures = (name: Name, size: Size, ext: Ext) => {
  return loadFixtureImage(`${name}-${size}.${ext}`);
};

export const getImageBufferAfter = <
  Run extends (...arg: any[]) => Promise<string>
>(
  run: Run
) => {
  const _run = (...arg: Parameters<Run>) => {
    return run(...arg).then((result) => {
      return dataUriToBuffer(result);
    });
  };
  return _run;
};
