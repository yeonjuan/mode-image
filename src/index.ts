import type {
  CreateCanvas,
  CloneCanvas,
  ImageSource,
  Options,
  PartialSize,
  RectArea,
  NumberPair,
  Size,
  CreateImage,
  CanvasContext,
  Task,
  CanvasCreator,
  ImageCreator,
  Drawable,
  DataURLOptions,
} from "./types";

const DEFAULT_OPTIONS = {
  createCanvas: () => window.document.createElement("canvas"),
  createImage: () => new window.Image(),
};

const withDefault = <Value>(
  defaultValue: NonNullable<Value>,
  value?: Value
) => {
  return value ? value : defaultValue;
};

const sin = Math.sin;

const cos = Math.cos;

const getSize = (drawable: { width: number; height: number }): Size => [
  drawable.width,
  drawable.height,
];

const mapSize = (
  size: Size,
  mapFn: (num: number, index: number) => number
): Size => size.map(mapFn) as Size;

const diffSize = (sizeA: Size, sizeB: Size): Size => [
  sizeA[0] - sizeB[0],
  sizeA[1] - sizeB[1],
];

const half = (n: number) => n / 2;

const neg = (n: number) => -n;

const drawRotatedImage = (
  ctx: CanvasContext,
  drawable: Drawable,
  radian: number
) => {
  const cSize = mapSize(getSize(ctx.canvas), half);
  const dSize = getSize(drawable);
  ctx.translate(...cSize);
  ctx.rotate(radian);
  ctx.translate(...mapSize(cSize, neg));
  ctx.drawImage(drawable, ...diffSize(cSize, mapSize(dSize, half)), ...dSize);
};

const drawPattern = (ctx: CanvasContext, pattern: CanvasPattern) => {
  ctx.save();
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, ...getSize(ctx.canvas));
  ctx.restore();
};

const calcRotatedSize = (ctx: CanvasContext, radian: number): Size => {
  const [width, height] = getSize(ctx.canvas);
  const cosVal = cos(radian);
  const sinVal = sin(radian);
  return [sinVal * height + cosVal * width, sinVal * width + cosVal * height];
};

class ModeImage {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasContext;
  private readonly tasks: Task[] = [];
  private readonly canvasCreator: CanvasCreator;
  private readonly imageCreator: ImageCreator;

  public static create(src: ImageSource, options?: Options) {
    return new ModeImage(src, options);
  }

  private constructor(src: ImageSource, options: Options = {}) {
    this.canvasCreator = withDefault(
      DEFAULT_OPTIONS.createCanvas,
      options.createCanvas
    );
    this.imageCreator = withDefault(
      DEFAULT_OPTIONS.createImage,
      options.createImage
    );
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d")!;

    const loadingImage = this.loadImage(src);
    this.schedule(async () => {
      const image = await loadingImage;
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.ctx.drawImage(image, 0, 0);
    });
  }

  private loadImage(src: ImageSource): Promise<HTMLImageElement> {
    if (typeof src === "object")
      return Promise.resolve(src as HTMLImageElement);
    const image = this.imageCreator() as HTMLImageElement;
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Load failed"));
      (image as any).crossOrigin = "Anonymous";
      image.src = src;
    });
  }

  private schedule(task: Task) {
    this.tasks.push(task);
  }

  private createCanvas(size?: Size) {
    const canvas = this.canvasCreator();
    size && ([canvas.width, canvas.height] = size);
    return canvas;
  }

  private setCanvasSize(size: Size) {
    [this.canvas.width, this.canvas.height] = size;
  }

  private copyCanvas() {
    const size = this.getSize();
    const copied = this.createCanvas(size);
    copied.getContext("2d")!.drawImage(this.canvas, 0, 0, ...size);
    return copied;
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, ...this.getSize());
  }

  private getSize() {
    return getSize(this.canvas);
  }

  private async runSchedules() {
    for (const task of this.tasks) {
      await task();
    }
  }

  public rotate(radian: number): this {
    this.schedule(() => {
      const copied = this.copyCanvas();
      this.setCanvasSize(calcRotatedSize(this.ctx, radian));
      this.clearCanvas();
      drawRotatedImage(this.ctx, copied, radian);
    });
    return this;
  }

  public resize(resize: PartialSize): this {
    this.schedule(() => {
      const copied = this.copyCanvas();
      const curSize = this.getSize();
      this.clearCanvas();
      const size: Size = [
        resize.width || curSize[0],
        resize.height || curSize[1],
      ];
      this.setCanvasSize(size);
      this.ctx.drawImage(copied, 0, 0, ...size);
    });
    return this;
  }

  public crop(area: RectArea): this {
    this.schedule(() => {
      const copied = this.copyCanvas();
      this.clearCanvas();
      const size = getSize(area);
      this.setCanvasSize(size);
      this.ctx.drawImage(
        copied,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        ...size
      );
    });
    return this;
  }

  public repeatX(repeat: number): this {
    this.schedule(() => {
      const copied = this.copyCanvas();
      this.clearCanvas();
      const [width, height] = getSize(this.canvas);
      this.setCanvasSize([width * repeat, height]);
      drawPattern(this.ctx, this.ctx.createPattern(copied, "repeat-x")!);
    });
    return this;
  }

  public repeatY(repeat: number): this {
    this.schedule(() => {
      const copied = this.copyCanvas();
      this.clearCanvas();
      const [width, height] = getSize(this.canvas);
      this.setCanvasSize([width, repeat * height]);
      drawPattern(this.ctx, this.ctx.createPattern(copied, "repeat-y")!);
    });
    return this;
  }

  public async toDataURL(options?: DataURLOptions): Promise<string> {
    await this.runSchedules();
    return this.canvas.toDataURL(
      withDefault("image/png", options?.type),
      withDefault(1, options?.quality)
    );
  }
}

export default ModeImage.create;
