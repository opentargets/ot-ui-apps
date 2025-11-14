# GenTrack

Flexible 1D-tracks for showing genetic (and related) data.

## Idea

<img src="idea.png" alt="idea" style="max-width: 600px">

- A __track__ can be used to show anything drawn in a Pixi.js container, e.g. sequence track (colored rectangles), line plot, arrows, etc.
  
- Tracks in the same wrapper share a canvas and x-scale.

- An inner track corresponds to a window on the outer wrapper's x-scale. We just specify `xStart` and `xStop` to define the current window - and these can be adjusted dynamically to adjust the window width.


## Design

<img src="design.png" alt="idea" style="max-width: 600px">

Everything is React (and hence HTML/SVG) except the track content and all tracks within the same `genTrack` wrapper share a single canvas (and x-scale).

## Implementation

- __Canvas:__ Pixi.js.
  - Use `@pixi/react` so can easily use within the Platform.
  - Could investigate `pixi-viewport` for zooming, panning etc. and 'culling' for allowing inexpensive unseen elements.
  - Will want to process data as much as possible so not redoing it on redraw.
- __Data:__ Need to consider file formats, dynamic fetching/streaming etc. but leave this until later.

## Components

#### `GenTrackProvider`

Provides context for the track. Its children should include a single `GenTrack` component along with any other components that need to get/set the context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialState` | `object` | `{}` | Initial state that is merged with the 'base' state properties below. |
| `reducer` | | `function` | A reducer function describing valid state changes. Passed the state and an action object. Should return a new state object. The reducer is 'merged' with the 'base' reducer below. |

**Note**: Reducer actions should start by shallow copying the state to ensure the base state properties descibed below are not discarded.

Base state properties:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `data` |  |  | Data to be displayed by the gen track |
| `xMin` | `number` | `0`| Minimum x value. |
| `xMax` | `number` | `Infinity`| Maximum x value. |

The reducer function passed to the provider is augmented with action types to set the base properties:

- `setData`
- `setXMin`
- `setXMax`

Inside a `GenTrackProvider`, we typically fetch/request the data, then when it loads, use `setData` and also `setXMin` and `setXMax` - which usually depend on the data.

Any component inside a `<GenTrackProvider>` can import the following (from the same file as the provider comes from):

- `useGenTrackState`: get the state object.
- `useGenTrackDispatch`: dispatch function for changing state - passed an action object.

__Note:__ The code wrapping the gen track can `useGenTrackDispatch` but should not consume the state (i.e. use `useGenTrackState`) whereas content from the `GenTrack` inwards can use the state but shold not use the dispatch.

#### `GenTrackInnerProvider`

The same as `GenTrackProvider` but with a different name so that the provider can wrap the top-level gen track, but the dispatch can be used outside the inner gen track, but the inner state should only be consumed by the inner track and related content.

The window controls of a top-level gen track automatically set the `xMin` and `xMax` of the inner state.

The related hooks have 'Inner' in the name:

- `useGenTrackInnerState`
- `useGenTrackInnerDispatch`

#### `GenTrack`

Top-level gen track component. This contains the x-info and tracks (each of which contains its own x-info). A `GenTrack` component should be inside a `GenTrackProvider` - and a `GenTrackInnerProvider` if showing inner tracks.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `xInfo` | `component` |  | React component to show info about the shared x scale - e.g. a label and axis. |
| `tracks` | `Track[]` |  | Tracks. |
| `innerGenTrack` | `Gentrack` | | A `GenTrack` for the inner tracks. |
| `gap` | `number` | `16` | Vertical gaps between tracks. |
| `yInfoWidth` | `number` | `160` | Space on left reserved for y-info of tracks. |

For state management within a gen track any customm state management can be used. E.g. Handle manually for interaction within the Pixi canvas or set up another state+dispatch context for showing React content to the side of a track when hover on the feature of track.

#### `Track`

Track component. Inside the component, it is standard to access the relevant context: `useGenTrackState` or `useGenTrackInnerState`. A top-level track can also use `useGenTrackInnerDispatch` to modify the state seen by the lower-level track gen.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `number` |  | Height of track in pixels. |
| `draw` | `function` |  | Passed the `state` and `container` and should draw to the container. |
| `yInfo` | component | Should take props `state` and `height`. |
| `container` | Pixi `Container` | Pixi container of the correct height and translated to the appropriate position of the canvas (based on the height of previous tracks and the gap height). |
| `addWindow` | `boolean` | `false` | Include interactive window to select subregion of the x-axis. Changing the window automatically changes the `xMin` and `xMax` of the inner state. |

#### Notes

- Inner and outer tracks both use `GenTrack` and `Track` components - there is nothing in the component name or props to differentiate an inner from an outer prop. When adding 

- Only thing preventing deeper nesting is the fixed provider names. Could easily be extended if there are good use cases.