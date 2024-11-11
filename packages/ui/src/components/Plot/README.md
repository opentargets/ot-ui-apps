
# TO DO
- scales:
  - allow `scales` to be function which takes the `data` prop (or passed down data) and returns an object so that can use the data to compute the scales
  - shorthand for linear scales: e.g. `x={[10, 40]}`.
  - test with discrete scales
- remove `strokeDashArray` from `Circle`?
- change to `values` as an accessor for things that consume tick values - treating as data is unintuitive even if is more powerful 
- tooltip:
  - allow any action when trigger selected so can eg show a MUI tooltip
- making \<XTitle> accept children is wrong/misleading since is adding contents SVG <text> not HTML elemnt
  - how do e.g. subscript? - could make it a foreign object and use HTML?
- add remaining marks: can easily add simple marks using the current `Mark`. Will need to extend `Mark` to allow for 'compound marks' such as `Line` that create a single mark from multiple rows. Can do this by adding a `compound` prop to `Mark` and branching on this where create the mark(s) 
- implement `clip` prop on a mark to clip it to the panel - see https://stackoverflow.com/questions/17388689/svg-clippath-and-transformations
- have not implemented `panelSize` prop?
- if error because no `MapX` or `mapY` is it clear that missing scale is the reason?
- legend
- wrap axis, ticks, ... components in memo - so only change when their props change. They will still change when/if the contexts they use change anyway (as they should)
- import local files from index where can to clean up
  
--------

## Vis Provider

If drawing multiple related plots, wrap them in a `<VisProvider>`. This provides a single location where data for the plots can be added.

A vis provider is also required for interactive plots - even a single interactive plot. For multi-plot visualisations, the vis provider makes it easy to e.g. hover on a point in one plot and highlight the corresponding points in the other plots. It's also fine to include non-plot content in the provider - this content can import and use the context provided by `VisProvider` like any other React context.

> Note: CSS should be used to layout groups of plots - flex or grid is typically the most useful.

## Plot

An individual plot is created with the `<Plot>` component. This creates its own context which makes the plot's data and options available to components inside the plot.

Use the `responsive` prop of `Plot` (no value required) to have the width of the plot adapt to the parent container. Use `minWidth` and `maxWidth` to specify min and max widths for a responsive plot 

> Note: Props for widths, heights, minimum widths etc. should not include units.

## Frame

Use a `Frame` to use different scales (for the same channel) on the same plot.

Frames allow us to overlay multiple plots on the same panel. A frame goes inside a plot element but can take its `data`, `scales`, `xTick`, `yTick`, `xReverse` and `yReverse` props - where used, these override those inherited from the plot.

A frame can contain any of the components that a plot can contain - except for another frame.

In the following example, we use a frame to display a second y-axis that shows the weight in pounds (where 1 kg = 2.2 lbs):

```jsx
<Plot
  data={weightData}
  scales={{ x: [0, 150], y: [0, 200] }}  // SHORTHAND NOTATION NOT IMPLEMENTED YET!!
>
  <XAxis />
  <XLabel />
  <XTitle>Height (cm)</XTitle>
  <YAxis />
  <YLabel />
  <YTitle>Weight (kg)</YTitle>
  <Frame scales={{ y: [0, 150 * 2.2] }} >
    <YAxis position="right" />
    <YLabel />
    <YTitle>Weight (lbs)</YTitle>
  </Frame>
  <Circle x={d => d.height_cm} y={d => d.weight_kg} />
</Plot>
```

### Panel

Conceptually, a plot contains a reactangular _panel_ where the marks are drawn. Any axes are shown along the side/top/bottom of the panel, but are outside the panel. To style this panel, include a `<Panel>` component. The following props can be used to style the panel:

| Prop | Default |
|----------|-------------|
| `background` | `left-aligned` |
| `borderWidth` | `0` |
| `borderColor` | `#888` |

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

There is an `XTick` component for creating and rendering the x ticks. Tick values can be passed to the `Plot` using the `xTick` prop. These are passed to `XTick`, `XGrid`, `XLabel` as the default of the `values` prop.

If the `xTick` prop of `Plot` is not used, the default values are automatically created from the x scale.

> Note: The `values` prop of the `XTick`, `XGrid`, `XLabel` can be a function to transform the values passed down from the plot or frame - THIS IS LIKELY TO CHANGE!!

The behavior for y ticks is identical to that of x ticks.

## Data

Data flows through a visualisation `VisProvider` -> `Plot` -> `Frame` -> plot components. In many cases, `VisProvider` and `Frame` are omitted.

Each of `VisProvider`, `Plot`, `Frame` as well as mark components such as `Circle` can take a `data` prop. This can be a data set or a function. A function is passed the data from the component above and should return a transformed data set for the component.

If the `data` prop is not used, data is passed down from the parent component as is.

> Note: The data used by mark components such as `<Circle>` must be an iterable. A `<Circle>` can still use data passed down to it that is not iterable, but the `data` prop must be used to transform the data into an iterable.


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

------

Notes:
- left out YTitle for now since rarely use old school rotated y axis title anymore. Can use an
  XTitle with position='top' and textAnchor='end'
- currently always using indices for keys - may need to revisit this when think about animation, interaction, ...
- we can pass arbitrary attr values to ticks, labels etc, but not to marks - since all 'other props' are interpreted as channels. Can/should we allow passing arb attr values through to the svg element representing the mark?
- `ResposiveContainer` is currently only respsonsive on horizontal changes
- `responsive` prop:
  - currently only repsonsive for width, but easy to make responsive on height since could use same pattern as for width and the `updateSize` action used with the plot context already handles height changes
  - better design would be to separate dimensions and allow `width="responsive"` and `height="responsive"`
  - adds an unstyled wrapper div (except for possibly min and max widths) which may be too simple for some situations. 

Add to docs above
- padding (on axis, ticks, ...) pushes them away from panel whereas dx,dy props are always in pixels and +ve x to right, +ve y downwards
- use e.g. `stroke` to change color in `XTick` - even though there is `tickColor` in defaults, this is not a prop

POSSIBLE!!:
- border and cornerradius for the plot? - just as have for the panel
- ? HTML inserts - for tooltip, titles, insets, ...?
  - could have an HTML mark?
- specify panel size, plot size or container size
- optional HTML wrapper the size of the container. Absolute poistioned and optional z-index. Useful for titles and text in some cases
- rely heavily on accessor functions
- faceting - this will prob limit the min x and y grid squares, but we should still be able to make the grid larger to include other plots - or overlay plots
- give elements classes so easily styled?
- conveinernce components to add xAxis, ticks, labels and title altogether
- currently keep all options values for components that have contexts in the context. However, really only need the options that may be used by descendent components in the context.
- Allow the data prop of a `Vis` component to be an asynchronous function where the returned promise resolves to the data.
  - important for allowing skeleton and avoiding layout shift
- transitions
- allow more props in frames? - so can e.g. override channel defaults of plot
- allow more flexibility with data structure? - e.g. column-based data? 
- should `missing` be at plot and frame level rather than just mark level?
- have e.g. a `constant` prop in marks so can avoid the hacky `data={[1]}` to draw a single mark when all props are constants
- do not have same channel defaults for all marks? - annoying that need to set `strokeWidth` to see lines
- custom marks - e.g.custom shapes or images for points.
- since data can be any iterable, should also allow tick values (when actually used since can be transformed by `values`) to be any iterable rather than just an array
- end channels: front, facet (or row/column), ...
- larger capture zone for hover/selection of mark

## Examples/Tests

- use `data` of mark to filter data
- multuple y-axis
- have a before or after the axis title by using e.g. position="right", 
  overriding the textAnchor and using dx and dy
- rotated labels, in this case x labels at bottom:
  
  ```jsx
  <XLabel
    position="bottom"
    format={(v, i) => String(i).repeat(i + 1)}
    textAnchor="end"
    style={{
      transformOrigin: '100% 50%',
      transformBox: 'fill-box',
      transform: "rotate(-45deg)",
    }}
  />
  ```