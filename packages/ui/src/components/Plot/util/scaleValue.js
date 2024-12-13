import { scaleChannels } from "./scaleChannels";

export function scaleValue({ input, channel, scales, mapX, mapY }) {
  if (!scaleChannels.has(channel)) {
    return input;
  }
  if (channel === "x" || channel === "xx" || channel === "width") {
    if (!scales.x) {
      throw Error("missing x scale");
    }
    return mapX(input);
  } else if (channel === "y" || channel === "yy" || channel === "height") {
    if (!scales.y) {
      throw Error("missing y scale");
    }
    return mapY(input);
  } else {
    if (!scales[channel]) {
      throw Error(`missing ${channel} scale`);
    }
    return scales[channel](input);
  }
}
