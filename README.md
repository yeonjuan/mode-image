# mode-image

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

- [rotate](#rotateradian)
- [resize](#resizesize)
- [crop](#croparea)
- [repeatX](#repeatxnum)

### .rotate(_radian_)

- radian (number): The rotation angle, clockwise in radians.

#### example

| /origin.png (100 x 100)                                  | result                                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/right-arrow-100-100.png"> | <img src="./tests/__image_snapshots__/rotate-test-ts-rotate-90-deg-100-x-100-1-snap.png"> |

```js
import modImage from "mode-image";

const result = await modeImage("/origin.png")
  .rotate((Math.PI / 180) * 90)
  .toDataUrl();
// result: data:image/png;base64,...
```

### .resize(_size_)

- size (object):
  - width (number): height to resize
  - height (number): Width to resize

#### example

| /origin.png (150 x 150)                            | result (50 x 50)                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/smile-150-150.png"> | <img src="./tests/__image_snapshots__/resize-test-ts-resize-resize-150-x-150-to-50-x-50-1-snap.png"> |

```js
import modImage from "mode-image";

const result = await modeImage("/origin.png")
  .resize({
    width: 50,
    height: 50,
  })
  .toDataUrl();
// result: data:image/png;base64,...
```

### .crop(_area_)

- area (object):
  - x (number):
  - y (number):
  - width (number):
  - height (number):

#### example

| /origin.png (150 x 150)                            | result (50 x 50)                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/smile-150-150.png"> | <img src="./tests/__image_snapshots__/crop-test-ts-resize-resize-150-x-150-to-50-x-50-2-snap.png"> |

```js
import modImage from "mode-image";

const result = await modeImage("/origin.png")
  .crop({
    x: 50,
    y: 50
    width: 50,
    height: 50,
  })
  .toDataUrl();
// result: data:image/png;base64,...
```

## .repeatX(_num_)

- num (number):

#### example

| /origin.png (150 x 150)                           | result (450 x 150)                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/walk-150-150.png"> | <img src="./tests/__image_snapshots__/repeat-x-test-ts-repeat-x-repeat-x-3-times-150-x-150-1-snap.png"> |

```js
import modImage from "mode-image";

const result = await modeImage("/origin.png").repeatX(3).toDataUrl();
// result: data:image/png;base64,...
```

## License

MIT
