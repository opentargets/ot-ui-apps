## `HTMLTooltip`

A simple HTML tooltip that is sufficient for most use cases. 

Notes:

- The tooltip anchor is computed automatically based on the quadrant of the plot that the tooltip's x and y values are in.

- The tooltip has only been tested with linear and log x and y scales.

- The tooltip currently only works when the x and y channels are accessor functions - the tooltip will throw when this is not the case.

> Note: Where `HTMLTooltip` is not suitable, it is easy to create a custom tooltip using an HTML mark.