import type * as types from "canvas";

type Pair<T> = [T, T];

export type NumberPair = Pair<number>;

export type Size = [width: number, height: number];

export type Pos = { x: number; y: number };

export type PublicSize = { width: number; height: number };

export type PartialSize = Partial<PublicSize>;

export type RectArea = { width: number; height: number } & Pos;

export type ImageSource = string | HTMLImageElement | types.Image;

export type CreateCanvas = (size?: NumberPair) => HTMLCanvasElement;

export type CloneCanvas = (old: HTMLCanvasElement) => HTMLCanvasElement;

export type CreateImage = () => HTMLImageElement;

export type Options = {
  createCanvas?: (...arg: any) => any;
  createImage?: (...arg: any) => any;
};

export type DataURLOptions = {
  type?: string;
  quality: number;
};

export type CanvasContext = CanvasRenderingContext2D;

export type CanvasCreator = () => HTMLCanvasElement;

export type Task = () => void | Promise<void>;

export type ImageCreator = () => HTMLImageElement | types.Image;

export type Drawable = HTMLCanvasElement | HTMLImageElement;
