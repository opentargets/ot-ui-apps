# Structure Viewer

Exports the `Viewer` and `ViewerProvider` components.

### Example Use Cases

1. A single structure.
2. Multiple structures in a single file that the user may wish to see all at once or move between - e.g. NMR data.
3. A single structure from a single file shown at once, but where external actions change the structure and file - e.g. user can select from different experimentally-derived structures shown in a table.
4. Multiple structures shown at once from different files, such as a target and a small molecule.
5. As 4, but user can move between different pairs (or more) of structures.

## Data

The viewer accepts data in the form

```js
[
  { structureData: cifData, info: <any> },
  { structureData: cifData, info: <any> },
  ...
]
```

The array should contain a single element unless multiple structures are being shown together, such as a target and a small molecule.

**Note**: The viewer component does not fetch data.

The `info` property can be used for any additional data that is needed to display the structure as desired.

## Viewer Provider

The `<Viewer>` should be wrapped in a `<ViewerProvider>`. Use the provider to pass the initial state and a reducer function that specifies the valid state changes. Since the provider controls all the state variables that can affect the viewer's appearance, any components that can change these values should also be inside the provider - e.g. radio buttons for coloring on AlphaFold confidence or pathogenicity. 

Props:

| Prop | Default | Type | Description |
|-------|---------|------|-------------|
| `initialState` | `{}` | `object`| |
| `reducer` | | `function` | A reducer function describing valid state changes. Passed the state and an action object. Should should return a new state object. |

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

When a state property changes, the viewer redraws the structure using the `drawAppearance` prop passed to the viewer component. To modify the viewer appearance without a redraw, include a `ViewerInteractionProvider`. In particular, a `ViewerInteractionProvider` is needed for basic hover and click behavior, as well as any custom highlighting - such as adding arbitrary shapes to the viewer or using the viewer's builtin labels.

Like `ViewerProvider`, `ViewerInteractionProvider` takes `initialState` and `reducer` props. Any component inside a `<ViewerInteractionProvider>` can import the following (from the same file as the provider comes from):

- `useViewerInteractionState`: get the interaction state object.
- `useViewerInteractionDispatch`: dispatch function for changing the interaction state - passed an action object.

When creating the interaction state, the initial state object is copied and the following properties are added:

| Property | Type | Description |
|----------|------|-------------|
| `hoveredResi` | number | Residue index of hovered residue. |
| `clickedResi` | number | Last clicked residue index. |

These can be used as needed and are updated automatically from the structure and track. They can also be set manually, e.g.

```js
const viewerInteractionDispatch = useViewerInteractionDispatch();

viewerInteractionDispatch({
  type: "setHoveredResi",
  value: 174,
});
```

## Appearance

An `appearance` object is a description of what to show in the viewer and how:

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `selection` | `{}` | 3dMol `AtomSelectionSpec` \| `function` | If a function, is passed the state and should return a `AtomSelectionSpec`. |
| `style` | | 3dMol `AtomStyleSpec`, function | If a function, is passed the state and should return a `AtomStyleSpec`. |
| `addStyle` | `false` | `boolean` | If `true`, use 3dMol's `addStyle` rather than `setStyle`. |
| `use` |  | `function` | Passed the state object and returns `true` if the appearance is to be applied. If `use` is omitted, the appearance is always applied. |

After a change in state, everything is hidden then appearances are applied in the original order.

### Click and Hover

An `eventAppearance` object describes a change triggered by changes to `hoveredResi` or `clickedResi` (see [Viewer Interaction Provider](#viewer-interaction-provider])): 

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `eventSelection` | `{}` | 3dMol `AtomSelectionSpec` | Selects atoms that listen for the event - whereas the `selection` property selects atoms whose appearance is changed by the event. |
| `selection` | `{ resi: eventResi }` | 3dMol `AtomSelectionSpec` \| `function` | If a function, is passed the state and the residue index of the atom that heard the event; should return a `AtomSelectionSpec`. |
| `style` | | 3dMol `AtomStyleSpec` \| `function` | If a function, is passed the state and the residue index of the atom that heard the event; should return a `AtomStyleSpec`. |
| `addStyle` | `false` | `boolean` | If `true`, use 3dMol's `addStyle` rather than `setStyle`. |
| `onApply` | | `function` | Called after the appearance is applied. Passed the viewer state and the hovered.clicked residue index. |

And for hover events only: 

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `unhoverSelection` | `{ resi: eventResi }` | 3dMol `AtomSelectionSpec` \| `function` | As `selection` but selects atoms whose appearance change on unhover. |
| `unhoverStyle` | | 3dMol `AtomStyleSpec` \| `function` | As `style` but applied to atoms selected by `unhoverSelection`. |
| `unhoverAddStyle` | `false` | `boolean` | As `addStyle` but applied to atoms selected by `unhoverSelection`. |
| `unhoverOnApply` | | `function` | As `onApply` but applied after an unhover event. |

## Viewer Props

| Prop | Default | Type | Description |
|-------|---------|------|------------|
| `height` | `"400px"` | `string` | Height of viewer. There is no `width` prop - the viewer fills the parent container. |
| `data` |  | `array` | See [Data](#data). |
| `onData` |  | `function` | Called immediately after all data loaded into the viewer. Passed the viewer state and viewer dispatch function. |
| `onDblClick` |  | `function` | Called on double click of the viewer's canvas. Passed the viewer state. |
| `drawAppearance` | `[]` | `appearance[]` | See [Appearance](#appearance). |
| `hoverAppearance` | `[]` | `eventAppearance[]` | See [Click and Hover](#click-and-hover). |
| `clickAppearance` | `[]` | `eventAppearance[]` | See [Click and Hover](#click-and-hover). |
| `trackHoverAppearance` | `[]` | `eventAppearance[]` | Appearance of structure when user hovers/unhovers on a residue in the track. See [Click and Hover](#click-and-hover). |
| `trackColor` | `function` | | Color function for residues shown in 1D track. Passed the viewer state and a residue and should return a color. If `trackColor` is omitted, no track is shown. |  
| `usage` | `{}` | `object` | Label-value pairs to add to the basic usage instructions popup. |
| `topLeft` |  | `string` \| `component` | Component to show in the top-left - typically a warning. Often shown conditionally based on the viewer state - the component should render `null` to be hidden. |
| `bottomRight` |  | `string` \| `component` | Component to show in the bottom-right corner - typically details about hovered/clicked on part of the structure. Often shown conditinally based on the viewer state - the component should render `null` to be hidden. |
| `zoomLimit` | `[20, 500]` | `[number, number]` | Lower and upper zoom limits. |
| `screenshotId` | `""` | `string` | ID to include in screenshot file name. |

Notes:

- The viewer only tracks hovering of atoms that are selected by at least one appearance object in `hoverSelection`. Even `hoverAppearance: [{}]` is sufficient to include all atoms since appearance objects select all atoms by default. Similalarly, an atom must be selected by a `clickAppearance` object for the viewer to track clicks.

- If used, the track represents the first structure and assumes residues are indexed from 1 and are contiguous - as with AlphaFold structures.

## Notes

- We often show a message over the viewer such as "Loading Structure ...". There is no built-in message functionality in the viewer since we may want the message to cover related content such as legends - particularly if the message may not be cleared due to e.g. unavailability of data at runtime. To implement a message, include a appropriate component (e.g. an absolutely positioned box over all relevant content) and conditionally render the message versus the viewer and associated content based on a state property such as `message`.