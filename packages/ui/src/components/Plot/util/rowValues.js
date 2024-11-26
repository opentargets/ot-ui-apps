import { scaleValue } from "./scaleValue";
import { noInfiniteOrNaN } from "./assert";

export function rowValues({
  rowIndex,
  rowData,
  missing,
  finalAccessors,
  scales,
  mapX,
  mapY,
}) {

  const values = {};

  for (const [channel, accessor] of finalAccessors) {
    let value = accessor;
    if (typeof accessor === 'function') {
      value = accessor(rowData, rowIndex);
      noInfiniteOrNaN(value, channel);
    }
    if (value == null) {
      if (missing === 'throw') {
        throw Error(`missing value (channel: ${channel})`);
      }
      return null;
    }
    if (typeof accessor === 'function') {  // constants already scaled
      value = scaleValue({ input: value, channel, scales, mapX, mapY });
    }
    values[channel] = value;
  }

  return values;

}