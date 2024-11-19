import { channelDefaults } from "../defaults/channelDefaults";
import { noInfiniteOrNaN } from "./assert";
import { scaleChannels } from "./scaleChannels";
import { scaleValue } from "./scaleValue";

const autoScaleChannels = new Set(['x', 'xx', 'width', 'y', 'yy', 'height']);

export function processAccessors({
  markChannels,
  accessors,
  scales,
  mapX,
  mapY,
}) {

  const newAccessors = new Map();

  for (const channel of markChannels) {

    const acc = accessors[channel];

    // channel omitted - use default value or ignore channel
    if (acc == null) {
      const value = channelDefaults[channel];
      if (value != null) {
        newAccessors.set(channel, value);
      }

      // constant channel  
    } else if (typeof acc === 'object' ||
      typeof acc === 'number' ||
      typeof acc === 'string') {
      let input, output;
      if (typeof acc === 'object') {
        ({ input, output } = acc);
      } else {
        autoScaleChannels.has(channel) ? (input = acc) : (output = acc);
      }
      let value = output;
      if (input != null) {
        if (!scaleChannels.has(channel)) {
          throw Error(`cannot use an 'input constant' for ${channel} channel`);
        }
        value = scaleValue({ input, channel, scales, mapX, mapY });
      }
      noInfiniteOrNaN(value, channel);
      if (value == null) {
        value = channelDefaults[channel];
      }
      if (value != null) {
        newAccessors.set(channel, value);
      }

      // dynamic channel`
    } else if (typeof acc === 'function') {
      newAccessors.set(channel, acc);

      // invalid accessor
    } else {
      throw Error(`invalid accessor (channel: ${channel})`);
    }

  }

  return newAccessors;

}