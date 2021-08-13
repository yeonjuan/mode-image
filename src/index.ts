import type * as types from "canvas";

type Pair<T> = [T, T];
type NumberPair = Pair<number>;
type Size = { width: number; height: number };
type Pos = { x: number; y: number };
export type PartialSize = Partial<Size>;
export type RectArea = Size & Pos;
export type ImageSource = string | HTMLImageElement | types.Image;
type CreateCanvas = (size?: NumberPair) => HTMLCanvasElement;
type CloneCanvas = (old: HTMLCanvasElement) => HTMLCanvasElement;
type CreateImage = () => HTMLImageElement;
type Options = {
  createCanvas?: (...arg: any) => any;
  createImage?: (...arg: any) => any;
};

const DEFAULT_OPTIONS = {};

class ModImage {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private readonly _tasks: (() => any)[] = [];
  private readonly _createCanvas: CreateCanvas;
  private readonly _cloneCanvas: () => ReturnType<CloneCanvas>;
  private readonly _loadImage: (src: ImageSource) => Promise<HTMLImageElement>;

  constructor(src: ImageSource, options: Options = DEFAULT_OPTIONS) {
    this._createCanvas = this._initCreateCanvas(options);
    this._cloneCanvas = this._initCloneCanvas();
    this._loadImage = this._initLoadImage(options);

    this._canvas = this._createCanvas();
    this._context = this._canvas.getContext("2d")!;
    this._context.imageSmoothingEnabled = true;

    this._pushTask(async () => {
      const image = await this._loadImage(src);
      this._setCanvasSize([image.width, image.height]);
      this._context.drawImage(image, 0, 0);
    });
  }

  /**
   * ------------------------------------------------------------------------
   * Public methods
   * ------------------------------------------------------------------------
   */
  rotate(angle: number): this {
    this._pushTask(() => {
      const clone = this._cloneCanvas();
      this._setCanvasSize(calcRotatedSize(this._canvasSize(), angle));
      this._clearCanvas();
      const [cx, cy] = this._canvasSize().map(half);
      this._context.save();
      this._context.translate(cx, cy);
      this._context.rotate(angle);
      this._context.translate(-cx, -cy);
      this._context.drawImage(
        clone,
        cx - clone.width / 2,
        cy - clone.height / 2,
        clone.width,
        clone.height
      );
      this._context.restore();
    });
    return this;
  }

  resize(size: PartialSize): this {
    this._pushTask(() => {
      const clone = this._cloneCanvas();
      this._clearCanvas();
      const [width, height] = this._canvasSize();
      const targetSize = sizeToPair({
        width: size.width || width,
        height: size.height || height,
      });
      this._setCanvasSize(targetSize);
      this._context.drawImage(clone, 0, 0, ...targetSize);
    });
    return this;
  }

  crop(area: RectArea) {
    this._pushTask(() => {
      const clone = this._cloneCanvas();
      this._clearCanvas();
      const targetSize = sizeToPair(area);
      this._setCanvasSize(sizeToPair(area));
      this._context.drawImage(
        clone,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        ...targetSize
      );
    });
    return this;
  }

  repeatX(num: number) {
    this._pushTask(() => {
      const clone = this._cloneCanvas();
      this._clearCanvas();
      this._setCanvasSize(mul1(this._canvasSize(), num));
      this._context.save();
      const pattern = this._context.createPattern(clone, "repeat-x")!;
      this._context.fillStyle = pattern;
      this._context.fillRect(0, 0, ...this._canvasSize());
      this._context.restore();
    });
    return this;
  }

  repeatY(num: number) {
    this._pushTask(() => {
      const clone = this._cloneCanvas();
      this._clearCanvas();
      this._setCanvasSize(mul2(this._canvasSize(), num));
      this._context.save();
      const pattern = this._context.createPattern(clone, "repeat-y")!;
      this._context.fillStyle = pattern;
      this._context.fillRect(0, 0, ...this._canvasSize());
      this._context.restore();
    });
    return this;
  }

  merge(source: ImageSource) {
    this._pushTask(async () => {
      const clone = this._cloneCanvas();
      this._clearCanvas();
      const image = await this._loadImage(source);
      const mergedSize: NumberPair = [
        max(image.width, clone.width),
        max(image.height, clone.height),
      ];
      this._setCanvasSize(mergedSize);
      this._context.drawImage(clone, 0, 0, clone.width, clone.height);
      this._context.drawImage(image, 0, 0, image.width, image.height);
    });
    return this;
  }

  async toDataURL(): Promise<string> {
    return this._runTasks().then(() => this._canvas.toDataURL("image/png", 1));
  }

  /**
   * ------------------------------------------------------------------------
   * Privates methods
   * ------------------------------------------------------------------------
   */
  private _clearCanvas(): void {
    this._context.clearRect(0, 0, ...this._canvasSize());
  }

  private _canvasSize(): NumberPair {
    return [this._canvas.width, this._canvas.height];
  }

  private _setCanvasSize(size: NumberPair): void {
    [this._canvas.width, this._canvas.height] = size;
  }

  private _pushTask(task: () => any): void {
    this._tasks.push(task);
  }

  private async _runTasks(): Promise<void> {
    for (const task of this._tasks) {
      await task();
    }
  }

  private _initCreateCanvas(options: Options) {
    const _createCanvas = options.createCanvas;
    const createCanvas =
      typeof _createCanvas === "function"
        ? () => _createCanvas()
        : () => window.document.createElement("canvas");
    return initCreateCanvas(createCanvas).bind(this);
  }

  private _initLoadImage(options: Options) {
    const _createImage = options.createImage;
    const createImage =
      typeof _createImage === "function"
        ? _createImage
        : () => new window.Image();
    return initLoadImage(createImage).bind(this);
  }

  private _initCloneCanvas() {
    const _cloneCanvas = initCloneCanvas(this._createCanvas).bind(this);
    return () => _cloneCanvas(this._canvas);
  }
}

const half = (x: number): number => x / 2;
const neg = (x: number): number => -x;

const initCreateCanvas = (createCanvas: CreateCanvas) => {
  return (size?: NumberPair): HTMLCanvasElement => {
    const canvas = createCanvas();
    size && ([canvas.width, canvas.height] = size);
    return canvas;
  };
};

const initCloneCanvas = (createCanvas: CreateCanvas) => {
  return (old: HTMLCanvasElement) => {
    const clone = createCanvas([old.width, old.height]);
    clone.getContext("2d")!.drawImage(old, 0, 0, old.width, old.height);
    return clone;
  };
};

const initLoadImage = (createImage: CreateImage) => {
  return (src: ImageSource): Promise<HTMLImageElement> => {
    if (typeof src === "object") {
      return Promise.resolve(src as HTMLImageElement);
    }
    const image = createImage();
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Load failed"));
      image.crossOrigin = "Anonymous";
      image.src = src;
    });
  };
};

const sin = Math.sign;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;

const calcRotatedSize = (
  [width, height]: NumberPair,
  radian: number
): NumberPair => {
  const cosRadian = cos(radian);
  const sinRadian = sin(radian);
  const rSize: NumberPair = [
    sinRadian * height + cosRadian * width,
    sinRadian * width + cosRadian * height,
  ];
  return rSize;
};

const sizeToPair = ({ width, height }: Size): NumberPair => {
  return [width, height];
};

const mul1 = ([first, second]: NumberPair, num: number): NumberPair => {
  return [first * num, second];
};

const mul2 = ([first, second]: NumberPair, num: number): NumberPair => {
  return [first, second * num];
};

export default (src: ImageSource, options?: Options) =>
  new ModImage(src, options);
