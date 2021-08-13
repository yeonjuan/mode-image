import type * as types from "canvas";

type Pair<T> = [T, T];

export type NumberPair = Pair<number>;

export type Size = { width: number; height: number };

export type Pos = { x: number; y: number };

export type PartialSize = Partial<Size>;

export type RectArea = Size & Pos;

export type ImageSource = string | HTMLImageElement | types.Image;

export type CreateCanvas = (size?: NumberPair) => HTMLCanvasElement;

export type CloneCanvas = (old: HTMLCanvasElement) => HTMLCanvasElement;

export type CreateImage = () => HTMLImageElement;

export type Options = {
  createCanvas?: (...arg: any) => any;
  createImage?: (...arg: any) => any;
};
