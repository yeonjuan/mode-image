# mode-image

Simple image editing library.

- [Installation](#installation)
- [Usage](#Usage)
- [License](#license)

## Installation

- npm
  ```console
  npm install mode-image
  ```
- yarn
  ```console
  yarn add mode-image
  ```

## Usage

- [modeImage](#modeimageimage-source)
- [rotate](#rotateradian)
- [resize](#resizesize)
- [crop](#croparea)
- [repeatX](#repeatxnum)
- [repeatY](#repeatynum)
- [merge](#mergeimage)
- [toDataURL](#todataurl)

### modeImage(_image source_)

We can specify image source to editing using `modeImage(image source)`.

- Data URL

  The URLs string prefixed with the `data:image/...` scheme. see [MDN Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

  <!-- prettier-ignore-start -->

  ```js
  modeImage("data:image/png;base64,R0lGOD....")
    .rotate(angle)
    .crop(area)
    // ...
    .toDataURL()
    .then((result) => {
      result; // data:image/png;base64,R0lGOD....
    });
  ```

  <!-- prettier-ignore-end -->

- HTMLImageElement

  The instance of [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement).

  <!-- prettier-ignore-start -->

  ```js
  const image = new Image();
  image.src = "https://...";

  modeImage(image)
    .rotate(angle)
    .crop(area)
    // ...
    .toDataURL()
    .then((result) => {
      result; // data:image/png;base64,R0lGOD....
    });
  ```

  <!-- prettier-ignore-end -->

- in NodeJS

  In NodeJS, we should use custom image, canvas creator. see [node-canvas](https://github.com/Automattic/node-canvas).

  <!-- prettier-ignore-start -->

  ```js
  import { createCanvas, Image } from "canvas";

  const options = {
    createCanvas: createCanvas,
    createImage: () => new Image(),
  };

  modeImage(src, options)
    .rotate()
    .toDataURL()
    .then((result) => {
      result; // data:image/png;base64,R0lGOD....
    });
  ```

  <!-- prettier-ignore-end -->

### .rotate(_radian_)

- radian (number): The rotation angle, clockwise in radians.

#### example

| /origin.png (100 x 100)                                  | result (100 x 100)                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/right-arrow-100-100.png"> | <img src="./tests/__image_snapshots__/rotate-test-ts-rotate-90-deg-100-x-100-1-snap.png"> |

<!-- prettier-ignore-start -->
```js
import modeImage from "mode-image";

const result = await modeImage("/origin.png")
  .rotate((Math.PI / 180) * 90)
  .toDataUrl();
// data:image/png;base64,...
```
<!-- prettier-ignore-end -->

### .resize(_size_)

- size (object):
  - width (number): The height to change.
  - height (number): The width to change.

#### example

| /origin.png (150 x 150)                            | result (50 x 50)                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/smile-150-150.png"> | <img src="./tests/__image_snapshots__/resize-test-ts-resize-150-x-150-to-50-x-50-1-snap.png"> |

<!-- prettier-ignore-start -->
```js
import modeImage from "mode-image";

const result = await modeImage("/origin.png")
  .resize({
    width: 50,
    height: 50,
  })
  .toDataUrl();
// data:image/png;base64,...
```
<!-- prettier-ignore-end -->

### .crop(_area_)

- area (object):
  - x (number): The pixels from left side.
  - y (number): The Pixels from right side.
  - width (number): The width pixels of the crop.
  - height (number): The height pixels of the crop.

#### example

| /origin.png (150 x 150)                            | result (50 x 50)                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/smile-150-150.png"> | <img src="./tests/__image_snapshots__/crop-test-ts-crop-150-x-150-to-50-x-50-2-snap.png"> |

<!-- prettier-ignore-start -->
```js
import modeImage from "mode-image";

const result = await modeImage("/origin.png")
  .crop({
    x: 50,
    y: 50,
    width: 50,
    height: 50,
  })
  .toDataUrl();
// data:image/png;base64,...
```
<!-- prettier-ignore-end -->

### .repeatX(_num_)

- num (number): The number of times to repeat.

#### example

| /origin.png (150 x 150)                           | result (450 x 150)                                                                             |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/walk-150-150.png"> | <img src="./tests/__image_snapshots__/repeat-x-test-ts-repeat-x-3-times-150-x-150-1-snap.png"> |

<!-- prettier-ignore-start -->
```js
import modeImage from "mode-image";

const result = await modeImage("/origin.png")
  .repeatX(3)
  .toDataUrl();
// data:image/png;base64,...
```
<!-- prettier-ignore-end -->

### .repeatY(_num_)

- num (number): The number of times to repeat.

#### example

| /origin.png (150 x 150)                           | result (150 x 300)                                                                             |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/walk-150-150.png"> | <img src="./tests/__image_snapshots__/repeat-y-test-ts-repeat-y-2-times-150-x-150-1-snap.png"> |

<!-- prettier-ignore-start -->
```js
import modeImage from "mode-image";

const result = await modeImage("/origin.png")
  .repeatY(2)
  .toDataUrl();
// data:image/png;base64,...
```
<!-- prettier-ignore-end -->

### .merge(_image_)

- image (image source): The image source merging with the current image. It support same data type with ``

#### example

| /left.png (100 x 50)                                   | /right.png (100 x 50)                                   | result (100 x 50)                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/left-arrow-100-50.png"> | <img src="./tests/__fixtures__/right-arrow-100-50.png"> | <img src="./tests/__image_snapshots__/merge-test-ts-merge-merge-100-x-50-100-50-1-snap.png"> |

<!-- prettier-ignore-start -->
```js
import modeImage from "mode-image";

const result = await modeImage("/left.png")
  .merge("/right.png")
  .toDataUrl();
// data:image/png;base64,...
```
<!-- prettier-ignore-end -->

## License

[MIT](./LICENSE)
