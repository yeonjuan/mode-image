# mod-image

## Usage

### `rotate`

```js
.rotate(radian);
```

| `/origin.png`                                            | result                                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| <img src="./tests/__fixtures__/right-arrow-100-100.png"> | <img src="./tests/__image_snapshots__/rotate-test-ts-rotate-90-deg-100-x-100-1-snap.png"> |

```js
import modImage from "mod-image";

const result = await modeImage("/origin/png")
  .rotate((Math.PI / 180) * 90)
  .toDataUrl();
// result: data:image/png;base64,...
```
