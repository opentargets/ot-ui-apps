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
| `reducer` | | `function` | A reducer function describing valid state changes. Passed the state and an action object and should return a new state object. |

Any component inside a `<ViewerProvider>` can import the following (from the same `Context` file as the provider comes from):

- `useViewerState`: get the state object.
- `useViewerDispatch`: dispatch function for changing state - passed an action object.

While the dispatch function can be used from e.g. a click handler attached to the viewer, most uses of the dispatch function come from other elements inside the provider (tables, filters, etc.) and the viewer then reacts to the state change.

### Derived State

There is no built-in mechanism to handle derived state. For example, where the state includes the data and filter settings and we want to compute the filtered data (the derived value). For now, make a derived value a state property and update it when any of the the relevant 'genuine' state properties change. 

## Appearance

An `appearance` object is a description of what to show in the viewer and how:

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `selection` | `{}` | 3dMol `AtomSelectionSpec`, `function` | If a function, is passed the state and should return a `AtomSelectionSpec`. |
| `style` | `{}` | 3dMol `AtomStyleSpec`, function | If a function, is passed the state and should return a `AtomStyleSpec`. |
| `addStyle` | `false` | `boolean` | If `true`, use 3dMol's `addStyle` rather than `setStyle`. |
| `use` |  | `function` | Passed the state object and returns `true` if the appearance is to be applied. If `use` is omitted, the appearance is always applied. |

After a change in state, everything is hidden then appearances are applied in the original order.

### Click and Hover

An `eventAppearance` object describes a change due to a click or hover event: 

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `eventSelection` | `{}` | 3dMol `AtomSelectionSpec` | Selects atoms that listen for the event - whereas the `selection` property selects atoms whose appearance is changed by the event. |
| `selection` | `{}` | 3dMol `AtomSelectionSpec`, `function` | If a function, is passed the state and the atom that heard the event; should return a `AtomSelectionSpec`. |
| `style` | `{}` | 3dMol `AtomStyleSpec`, function | If a function, is passed the state and the atom that heard the event; should return a `AtomStyleSpec`. |
| `addStyle` | `false` | `boolean` | If `true`, use 3dMol's `addStyle` rather than `setStyle`. |
| `onApply` | | `function` | Called after the appearance is applied - i.e. a click or hover event. Passed the state and the atom that heard the event. |

And for hover events only: 

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `unhoveSelection` | `{}` | 3dMol `AtomSelectionSpec`, `function` | As `selection` but selects atoms whose appearance change on unhover. Defaults to `selection`. |
| `unhoverStyle` | `{}` | 3dMol `AtomStyleSpec`, function | As `style` but applied to atoms selected by `unhoverSelection`. |
| `onUnapply` | | `function` | As `onApply` but applied after an unhover event. |

## Shapes

Showing surfaces, spheres etc, is very similar to showing structures.

- HAVE AN UPDATEDEPS PROP TO ALLOW MANAGING SHAPES WITHOUT REDRAWING STRUCTURE
- DO IN DETAIL ONCE HAVE STRUCTURES WORKING
- SLIGHTLY FIDDLY SINCE MAY NEED TO TRACK EXISTING SHAPES TO REMOVE ONLY IF REQD

## Labels

DO AFTER BASIC WORKING: Way to use both 3dMol built-in labels and our bottom-right corner info box

## Viewer Props

| Prop | Default | Type | Description |
|-------|---------|------|------------|
| `height` | `"400px"` | `string` | Height of viewer. There is no `width` prop - the viewer fills the parent container. |
| `data` |  | `array` | See [Data](#data). |
| `onData` |  | `function` | Called immediately after all data loaded into the viewer. Passed the viewer and viewer state. |
| `onDblClick` |  | `function` | Called on double click of the viewer's canvas. Passed the event and viewer state. |
| `dep` | | `string[]` | List of state properties that are 'dependencies' - changing any of these properties triggers a redraw. If `dep` is omitted, a redraw occurs on every state change. |
| `drawAppearance` | `[]` | `appearance[]` | See [Appearance](#appearance). |
| `clickAppearance` | `[]` | `eventAppearance[]` | See [Click and Hover](#click-and-hover). |
| `hoverAppearance` | `[]` | `eventAppearance[]` | See [Click and Hover](#click-and-hover). |
| `usage` |  | `object` | Label-value pairs to populate the usage instructions popup. |
| `topLeft` |  | `string`, `component` | Component to show in the top-left - typically a warning. Often shown conditinally based on the viewer state - the component should render `null` to be hidden. |
| `bottomRight` |  | `string`, `component` | Component to show in the bottom-right corner - typically details about hovered/clicked on part of the structure. Often shown conditinally based on the viewer state - the component should render `null` to be hidden. |
| `zoomLimit` | `[20, 500]` | `[number, number]` | Lower and upper zoom limits. |
| `screenshotId` | `""` | `string` | ID to include in screenshot file name. |

**Note**: A state property may directly affect appearance without needing to trigger a redraw. For example, a property that controls which parts of the structure are highlighted with spheres based on a filter. Such properties should not be included in `dep`.

Example use cases for `onData`:

- Add custom property to every atom in the viewer so that can use the property in a color function - can be simpler and/or more efficient than using callback to compute the colors each change. Alternatively (and since we generally do not process CIF files) we may want to derive some values from the viewer's atoms and store this information in the `info` property of the relevant elememt of the data array. 

- Verifying that an AlphaFold residue matches a variant residue at a given position.

- Writing to the `info` property of an element of the data array.

- Initilising the zoom, drag and rotation of the viewer.

## Notes

- We often show a message over the viewer such as "Loading Structure ...". There is no built-in message functionality in the viewer since we may want the message to cover related content such as legends - particularly if the message may not be cleared due to e.g. unavailability of data at runtime. To implement a message, include a appropriate component (e.g. an absolutely positioned box over all relevant content) and conditionally render the message versus the viewer and associated content based on a state property such as `message`.

