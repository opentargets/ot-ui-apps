# Structure Viewer

Exports the `Viewer` comoponent. Typically used with `ViewerProvider` and `ViewerInteractionProvider`.

## Data

The viewer accepts data in the form:

```js
[
  { structureData: cifData, info: <any> },
  { structureData: cifData, info: <any> },
  ...
]
```

The array should contain a single element unless multiple structures are being shown together, such as a target and a small molecule.

The `info` property can be used for any additional data that is needed to display the structure as desired.

## Viewer Provider

The `<Viewer>` should be wrapped in a `<ViewerProvider>`. Use the provider to pass the initial state and a reducer function that specifies the valid state changes. Since the provider controls all the state variables that can affect the viewer's appearance, any components that can change these values should also be inside the provider - e.g. radio buttons for coloring on AlphaFold confidence or pathogenicity. 

Props:

| Prop | Default | Type | Description |
|-------|---------|------|-------------|
| `initialState` | `{}` | `object`| |
| `reducer` | | `function` | A reducer function describing valid state changes. Passed the state and an action object. Should return a new state object. |

**Note**: Reducer actions should start by shallow copying the state to ensure the extra state properties descibed below are not discarded.  

Any component inside a `<ViewerProvider>` can import the following (from the same file as the provider comes from):

- `useViewerState`: get the state object.
- `useViewerDispatch`: dispatch function for changing state - passed an action object.

While the dispatch function can be used from e.g. a click handler attached to the viewer, most uses of the dispatch function come from other elements inside the provider (tables, filters, etc.) and the viewer then reacts to the state change.

When creating the viewer state, the initial state object is copied and the following properties are added:

| Property | Type | Description |
|----------|------|-------------|
| `viewer` | 3dMol viewer | The 3dMol viewer object. |
| `atomsByResi` | `Map` | Key value pairs: residue index, atom objects (from viewer) belonging to the residue. | 

The reducer function passed to the provider is augmented with corresponding action types:

- `_setViewer`: Used internally when 3dMol viewer is created.

The `viewer` and `atomsByResi` state properties can be used as needed, but `_setViewer` should not be - it is internally by the viewer.

### Derived State

There is no built-in mechanism to handle derived state. For example, where the state includes the data and filter settings and we want to compute the filtered data (the derived value). For now, make a derived value a state property and update it when any of the the relevant 'genuine' state properties change.

### Viewer Interaction Provider

When a state property changes, the viewer redraws the structure using the `drawAppearance` prop passed to the viewer component. To modify the viewer appearance without a redraw, include a `ViewerInteractionProvider`. In particular, a `ViewerInteractionProvider` is needed for hover and click interaction, as well as any custom highlighting - such as adding arbitrary shapes to the viewer or using the viewer's builtin labels.

Like `ViewerProvider`, `ViewerInteractionProvider` takes `initialState` and `reducer` props. Any component inside a `<ViewerInteractionProvider>` can import the following (from the same file as the provider comes from):

- `useViewerInteractionState`: get the interaction state object.
- `useViewerInteractionDispatch`: dispatch function for changing the interaction state - passed an action object.

When creating the interaction state, the initial state object is copied and the following properties are added:

| Property | Type | Description |
|----------|------|-------------|
| `hoveredResi` | number | Residue index of hovered residue. |
| `clickedResi` | number | Last clicked residue index. |

The reducer function passed to the provider is augmented with corresponding action types:

- `setHoveredResi`: Set hovered residue index.
- `setClickedResi`: Set clicked residue index.

These are used automatically when hovering/clicked on the structure and track. They can also be used manually, e.g.

```js
const viewerInteractionDispatch = useViewerInteractionDispatch();

viewerInteractionDispatch({
  type: "setHoveredResi",
  value: 174,
});
```

**Note**: A click on the viewer canvas that does not set `clickedResi` to a value, sets `clickedResi` to `null` - i.e. it 'clicks off' the currently selected residue. 

## Appearance

An `appearance` object is a description of what to show in the viewer and how:

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `selection` | `{}` | 3Dmol `AtomSelectionSpec` \| `function` | If a function, is passed the state and should return a `AtomSelectionSpec`. |
| `style` | | 3Dmol `AtomStyleSpec` \| `function` | If a function, is passed the state and should return a `AtomStyleSpec`. |
| `addStyle` | `false` | `boolean` | If `true`, use 3Dmol's `addStyle` rather than `setStyle`. |
| `use` |  | `function` | Passed the state object and returns `true` if the appearance is to be applied. If `use` is omitted, the appearance is always applied. |

### Click and Hover

`appearance` objects are also used to describe appearance when the user hovers/clicks on/off a residue, i.e. when `hoveredResi` or `clickedResi` changes (see [Viewer Interaction Provider](#viewer-interaction-provider])):

Appearance objects used for hover/click can have additional properties:

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `onApply` | | `function` | Called after the appearance is applied. Passed the viewer state, residue index, interaction state and interaction dispatch function. |
| `leave` |  | `eventAppearance[]` | Appearance objects to apply when the current `hoveredResi`/`clickedResi` stops being the `hoveredResi`/`clickedResi`. |

Notes:

- For appearance objects used by hover/click:
  
  - `selection` defaults to `{ resi: theEventResi }` rather than `{}`. So explicitly specify `{}` to select all atoms for an appearance change on hover/click.

  - `selection`, `style` and `use` callbacks are passed a second argument: the residue index of the atom that heard the event. For objects passed in the `leave` array, the residue index passed is the 'outgoing' residue index.

- To call an arbitrary callback when `hoveredResi` or `clickedResi` changes without a style change, use the `onApply` property of an `eventAppearance` and omit the `style` property.

## Viewer Props

| Prop | Default | Type | Description |
|-------|---------|------|------------|
| `height` | `"400px"` | `string` | Height of viewer. There is no `width` prop - the viewer fills the parent container. |
| `data` |  | `array` | See [Data](#data). |
| `onData` |  | `function` | Called immediately after all data loaded into the viewer. Passed the viewer object and dispatch function. |
| `onDraw` |  | `function` | Called immediately after every redraw. Passed the viewer state. |
| `onDblClick` |  | `function` | Called on double click of the viewer's canvas. Passed the viewer state. |
| `drawAppearance` | `[]` | `appearance[]` | See [Appearance](#appearance). |
| `hoverSelection` | `{}` | 3dMol `AtomSelectionSpec` \| `function' | Hoverable atoms. If a function, is passed the viewer state and should return a `AtomSelectionSpec`. |
| `hoverAppearance` | `[]` | `eventAppearance[]` | See [Click and Hover](#click-and-hover). |
| `clickSelection` | `{}` | 3dMol `AtomSelectionSpec` \| `function' | Clickable atoms. See `hoverSelection`. |
| `clickAppearance` | `[]` | `eventAppearance[]` | See [Click and Hover](#click-and-hover). |
| `trackColor` | `function` | | Color function for residues shown in 1D track. Passed the viewer state and a residue and should return a color. If `trackColor` is omitted, no track is shown. |
| `trackTicks` | | `function` | Passed the viewer state. Should return an array of `{ resi, label }` objects to highlight on the track - labels are optional. | 
| `usage` | `{}` | `object` | Label-value pairs to add to the basic usage instructions popup. |
| `topLeft` |  | `string` \| `component` | Component to show in the top-left. Often shown conditionally based on the viewer state - the component should render `null` to be hidden. |
| `bottomRight` |  | `string` \| `component` | Component to show in the bottom-right corner - see `topRight`.|
| `zoomLimit` | `[20, 500]` | `[number, number]` | Lower and upper zoom limits. |
| `screenshotId` | `""` | `string` | ID to include in screenshot file name. |

Notes:

- If used, the track represents the first structure and assumes residues are indexed from 1 and are contiguous - as with AlphaFold structures.