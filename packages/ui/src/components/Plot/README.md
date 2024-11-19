
__NOT COMPLETE!!__

## Vis

For an interactive plot - e.g. to use the `hover` prop of marks - wrap the plot in a `<Vis>` component. This provides a context which is used internally to set and access selected data.

We can also wrap multiple plots in a single `Vis` component to coordinate interaction across the plots. For example, hovering on a point in one plot and highlight the corresponding point in another plot. It's also possible to include non-plot content in the `Vis`. In this case the `useVisSelection` and `useVisUpdateSelection` hooks can be used explicitly to get/set selected data.

> Note: CSS should be used to layout groups of plots - flex or grid is typically the most useful.

## Plot

An individual plot is created with the `<Plot>` component. This creates its own context which makes the plot's data and options available to components inside the plot.

Use the `responsive` prop of `Plot` (no value required) to have the width of the plot adapt to the parent container. Use `minWidth` and `maxWidth` to specify min and max widths for a responsive plot 

> Note: Props for widths, heights, minimum widths etc. should not include units.

## Frame

Use a `Frame` to use different scales on the same plot.

Frames allow us to overlay multiple plots on the same panel. A frame goes inside a plot element but can take its own `data`, `scales`, `xTick`, `yTick`, `xReverse` and `yReverse` props - where used, these override those inherited from the plot.

A frame can contain any of the components that a plot can contain - except for another frame.

### Panel

A plot's marks are drawn in a rectangular _panel_ computed from the the plot's size and padding. Including a `<Panel>` inside a plot adds a `<rect>` at the correct size and position. Use props such as `fill` to style the rectangle - all props passed to the `Panel` are passed directly to the `rect`.

### Scales

The `x`, `y`, `fill`, `stroke`, `area` and `shape` channels require _scales_: functions that map values from 'data space' to 'plot space'. A scale should be a [D3 scale](https://d3js.org/d3-scale). The `x` and `y` scales should have domains but not ranges - these are added to the scale based on the panel dimensions. The other scales should have domains and ranges.

Scales are passed inside a single `scales` prop of `Plot`, e.g.

```jsx
<Plot
  scales={{
    x: d3.scaleLinear().domain([0, 100]),  // x - omit range
    y: d3.scalePoint().domain(['France', 'Italy', 'Spain']), // y - omit range
    fill: d3.scaleSequential([0, 100], d3.interpolateBlues),
    stroke: d3.scaleOrdinal(['a', 'b', 'c'], ['gold', 'crimson', 'sienna']),
  }}
>
```

Notes:

- If a D3 scale method is passed a single argument (e.g. `d3.scaleLinear([0, 100])`), the argument is interpreted as the range - use the `domain` method as in the example above to only specify a domain.

- The domain used for the x and y scales determines the x and y limits of the plot.

- The `xx` and `width` channels use the `x` scale. The `yy` and `height` channels use the `y` scale.

- If different scales for the same channel are required within the same plot, frames can be used to overlay plots.

- Channels not discussed in this section do not require scales - values in 'plot space' are used directly.

- To use a flipped `x` scale that increases from right to left use the `xReverse` prop - it need not be given a value. Similarly, use `yReverse` for a flipped `y` scale.

### Ticks

There is an `XTick` component for creating and rendering the x ticks. An array of tick values can be passed to a `Plot` (or `Frame`) using the `xTick` prop. If no values are passed, default values are automatically created from the x scale.

The `xTick` values from `Plot` are passed to `XTick`, `XGrid` and `XLabel` as the default `values` prop. Overwrite these values by using `values` explicitly. Alternatively, `values` can be a function - it is passed the `xTick` values from `Plot` and should return a new array of values.

The `XLabel` component can take a `format` prop. This is a function that takes a tick value, its index, the array of tick values and the original array of tick values from `Plot`. The function should return the label value.

The behavior described above is identical for the y dimension.

## Data

Data flows through a visualisation: `Plot` -> (`Frame` ->) mark components.

Any of these components can take a `data` prop. The `data` component can be a data set or a function that is passed the data from the component above and should return a transformed data set for the component.

If the `data` prop is not used, data is passed down from the parent component as is.

The data used by mark components such as `<Circle>` must be an iterable. A `<Circle>` can still use data passed down to it that is not iterable, but the `data` prop must be used to transform the data into an iterable.

## Marks

### Multi marks

__NOT ALL IMPLEMENTED__

One mark per data point:

| Mark      | Description |
|-----------|-------------|
| <code>circle</code>  | circles |
| <code>point</code>   | points |
| <code>hBar</code>    | horizontal bars |
| <code>vBar</code>    | vertical bars |
| <code>rect</code>    | rectangles |
| <code>arc</code>     | circular/annular sectors |
| <code>segment</code> | line segments |
| <code>hLink</code>   | horizontal links |
| <code>vLink</code>   | vertical links |
| <code>edge</code>    | circular edges |
| <code>text</code>    | text |
| <code>path</code>    | path |

### Single mark for multiple data points:

__NOT IMPLEMENTED__

| Mark    | Description |
|---------|-------------|
| <code>line</code>  | line |
| <code>hBand</code> | horizontal band |
| <code>vBand</code> | vertical band |

### Missing Data

TODO: NAN AND INIFINITE THROW, NULL/UNDEFINED HANDLED BY MISSING PROP OF MARKS

## Channels

_Accessor functions_ are used to map data to channels. Each data point is passed to the accessor function along with its index; the function returns the value for that channel. Accessor functions are often very simple, e.g. `x={d => d.year}`. 

[???] For single marks such as lines, all channels except `x`, `xx`, `y`, `yy` must be constant. Accessor functions can still be used for these constant channels, but each function is only called once with arguments `null`, `null`, `data`. When an accessor is used, the channel is still constant in that the channel default is used if the accessor returns `null` or `undefined`.

### Constants

To set a channel value (e.g. `x` or `fill`) to be constant use an object as the channel prop, e.g.

```jsx
<Circle 
  x={d => d.cost}           // use "cost" property of data
  y={{ input: 10 }}         // constant y value
  fill={{ output: 'red' }}  // constant fill value
/>
```

For channels that rely on a scale, use the `input` or `output` property to indicate if the constant value should be scaled (`input`) or used as-is (`output`). For channels such as `markDash` that do not rely on a scale, use the `output` property.

For convenience, we can pass a number or string (the constant value) rather than an object. For channels that use the `x` or `y` scale, the constant is interpreted as an 'input' - i.e. the constant will be scaled. For all other channels, a number or string is interpreted as an output. Using this shorthand, the above example can be written as:

```jsx
<Circle 
  x={d => d.cost}  // use "cost" property of data
  y={10}           // the y scale will be used to to get the actual y position
  fill="red"       // fill will be red - the fill scale will not be used
/>
```

To draw a single mark with all constant channels, use a data set of length 1:

```jsx
<Circle
  data={[1]}  // value doesn't matter since it isn't used
  x={5}
  y={10}
  fill="red"
/>
```

## Interaction

ADD HOVER DOCS
