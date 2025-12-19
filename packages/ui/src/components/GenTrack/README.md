
# GenTrack

Flexible 1D-tracks for showing genetic (and related) data.

## Idea

<img src="idea.png" alt="idea" style="max-width: 600px">

- A __track__ can be used to show anything drawn in a Pixi.js container, e.g. sequence track (colored rectangles), line plot, arrows, etc.
  
- Tracks in the same wrapper share a canvas and x-scale.

- An inner track corresponds to a window on the outer wrapper's x-scale. We just specify `xStart` and `xStop` to define the current window - and these can be adjusted dynamically to adjust the window width.


## Design

<img src="design.png" alt="idea" style="max-width: 600px">

Everything is HTML/SVG except the track content and all tracks within the same `genTrack` wrapper share a single canvas (and x-scale).

Everything is React - the canvas content should be written in JSX using [`@pixi/react`](https://react.pixijs.io/).

## Implementation

- __Canvas:__ Pixi.js.
  - Use `@pixi/react` so can easily use within the Platform.
  - Could investigate `pixi-viewport` for zooming, panning etc. and 'culling' for allowing inexpensive unseen elements.
  - Will want to process data as much as possible so not redoing it on redraw.
- __Data:__ Need to consider file formats, dynamic fetching/streaming etc. but leave this until later.

## Components

#### `GenTrackProvider`

Provides context for the track. Its children should include a single `GenTrack` component along with any other components that need to get/set the context.

| Prop           | Type     | Default    | Description                                                                                                                                                                        |
| -------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialState` | `object` | `{}`       | Initial state that is merged with the 'base' state properties below.                                                                                                               |
| `reducer`      |          | `function` | A reducer function describing valid state changes. Passed the state and an action object. Should return a new state object. The reducer is 'merged' with the 'base' reducer below. |

**Note**: Reducer actions should start by shallow copying the state to ensure the base state properties descibed below are not discarded.

Base state properties:

| Name   | Type     | Default    | Description                           |
| ------ | -------- | ---------- | ------------------------------------- |
| `data` |          |            | Data to be displayed by the gen track |
| `xMin` | `number` | `0`        | Minimum x value.                      |
| `xMax` | `number` | `Infinity` | Maximum x value.                      |

The reducer function passed to the provider is augmented with action types to set the base properties:

- `setData`
- `setXMin`
- `setXMax`

Inside a `GenTrackProvider`, we typically fetch/request the data, then when it loads, use `setData` and also `setXMin` and `setXMax` - which usually depend on the data.

Any component inside a `<GenTrackProvider>` can import the following (from the same file as the provider comes from):

- `useGenTrackState`: get the state object.
- `useGenTrackDispatch`: dispatch function for changing state - passed an action object.

__Note:__ The code wrapping the gen track can `useGenTrackDispatch` but should not consume the state (i.e. use `useGenTrackState`) whereas content from the `GenTrack` inwards can use the state but should not use the dispatch.

#### `GenTrackInnerProvider`

The same as `GenTrackProvider` but with a different name. This inner provider can wrap the top-level gen track and other components. Its dispatch can be used outside the inner gen track, but the inner state should only be consumed by the inner track and related content.

The window controls of a top-level gen track automatically set the `xMin` and `xMax` of the inner state.

The related hooks have 'Inner' in the name:

- `useGenTrackInnerState`
- `useGenTrackInnerDispatch`

#### `GenTrack`

Top-level gen track component. This contains the x-info and tracks (each of which contains its own y-info). A `GenTrack` component should be inside a `GenTrackProvider` - and a `GenTrackInnerProvider` if showing inner tracks.

| Prop               | Type        | Default | Description                                                                                                                                                                                            |
| ------------------ | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tracks`           | `Track[]`   |         | Tracks.                                                                                                                                                                                                |
| `InnerGenTrack`    | `Gentrack`  |         | A `GenTrack` for the inner tracks.                                                                                                                                                                     |
| `xInfoGap`         | `number`    | `16`    | Vertical space between xInfo and first track.                                                                                                                                                          |
| `yInfoGap`         | `number`    | `16`    | Horizontal space between yInfo components and tracks.                                                                                                                                                  |
| `trackGap`         | `number`    | `16`    | Vertical space between tracks.                                                                                                                                                                         |
| `innerGenTrackGap` | `number`    | `16 `   | Vertical space between last track and inner `GenTrack`. This prop is ignored by an inner `GenTrack`.                                                                                                   |
| `addWindow`        | `boolean`   | `false` | Include interactive window to select subregion of the x-axis. Changing the window automatically changes the `xMin` and `xMax` of the inner state. This prop can only be used with an outer `GenTrack`. |
| `XInfo`            | `component` |         | React component to show info about the shared x scale - e.g. a label and axis. track.                                                                                                                  |
| `yInfoWidth`       | `number`    | `160`   | Space on left reserved for y-info of tracks.                                                                                                                                                           |

A `GenTrack` fills the width of its parent container.

For state management within a gen track any custom state management can be used. E.g. Handle manually for interaction within the Pixi canvas or set up another state+dispatch context for showing React content to the side of a track when hover on the feature of track.

#### Tracks

The `tracks` prop of a `GenTrack` should be passed an array of objects, where each object has the form:

| Property | Type        | Default | Description                                                                                                                                                                                                                                                                                                                           |
| -------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`     | `string`    |         | Unique id for the track. Typically a readable name, e.g. `'domains'`.                                                                                                                                                                                                                                                                 |
| `height` | `number`    |         |                                                                                                                                                                                                                                                                                                                                       | Height of `YInfo` container and `Track` container. |
| `YInfo`  | `component` |         | Is rendered inside a container with width equal to the `InfoWidth` of the parent `GenTrack` and height equal to `height`.                                                                                                                                                                                                             |                                                    |
| `Track`  | `component` |         | Should return a Pixi container which is automatically y-translated to the appropriate part of the canvas. The container will be stretched to the fill width of the canvas and have height equal to `height`.<br /><br />When drawing to a track, think of it as having width and height equal to 100 - the component handles scaling. |                                                    |

Inside a `Track`, it is standard to access the relevant context: `useGenTrackState` and/or `useGenTrackInnerState`. An outer `Track` can also modify the state of the inner `TrackGen` (`useGenTrackInnerDispatch`).

`YInfo` components belonging to an outer `GenTrack` can set the outer or inner state (`useGenTrackDispatch` and `useGenTrackInnerDispatch`). `YInfo` components inside an inner `GenTrack` can access the outer state (`useGenTrackState`) and set the inner state (use `useGenTrackInnerDispatch`).

#### Notes

- Inner and outer tracks both use `GenTrack` and `Track` components - there is nothing in the component name or props to differentiate an inner from an outer prop. When adding 

- Only thing preventing deeper nesting is the fixed provider names. Could easily be extended if there are good use cases.

- There are many existing libraries, but they tend to be large and overkill for what we need (e.g. HiGlass and libraries that use it like Gosling.js(?), use SVG or basic canvas (so performance issues likely) or not particularly popular or frequently updated. Using Pixi.js will give us full flexibility and integration into React while still being quite high-level (for a WebGL library) and high performance.

- Can actually use this for other plots where performance an issue

- Gives team some experience with Pixi for creating other bespoke visualisations.
