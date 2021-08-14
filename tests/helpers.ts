import path from "path";
import dataUriToBuffer from "data-uri-to-buffer";
import * as canvas from "canvas";
import modeImage from "../src/index";
import { ImageSource } from "../src/types";

type Name = "right-arrow" | "smile" | "walk" | "left-arrow";
type Size = `${number}-${number}`;
type Ext = "png";

const resolveFixture = (filename: string) =>
  path.join(__dirname, "__fixtures__", filename);

const loadFixtureImage = (name: string) => {
  return canvas.loadImage(resolveFixture(name));
};

const options = {
  createCanvas: canvas.createCanvas,
  createImage: () => new canvas.Image(),
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

export const nodeModeImage = (src: ImageSource) => modeImage(src, options);
