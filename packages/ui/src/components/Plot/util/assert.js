import { validScales } from "../util/scaleChannels";
import { isInfiniteOrNaN } from "./helpers";

export function noInfiniteOrNaN(value, channel) {
  if (isInfiniteOrNaN(value)) {
    throw Error(`invalid value: ${value}, (channel: ${channel})`);
  }
}

export function onlyValidScales(scales) {
  for (let channel of Object.keys(scales)) {
    if (!validScales.has(channel)) {
      throw Error(`unexpected scale: ${channel}`);
    }
  }
}
