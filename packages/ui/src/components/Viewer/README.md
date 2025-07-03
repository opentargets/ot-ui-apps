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

The `info` property can be used for any additional data that is needed to display the structure as desired. Callback functions used to determine the behavior of the viewer will have access to this extra data.

## Viewer Provider

The `<Viewer>` should be wrapped in a `<ViewerProvider>`. Use the provider to pass the initial state and a reducer function - which implements valid state changes. Since the provider controls all the state variables that can affect the viewer's appearance, any components that can change these values should also be inside the provider - e.g. radio buttons for coloring on AlphaFold confidence or pathogenicity.

Props:

| Prop | Default | Type | Description |
|-------|---------|------|-------------|
| `initialState` | `{}` | `object`| |
| `reducer` | | `function` | |

Any component inside a `<ViewerProvider>` can import the following from the provider file:

- `useViewerState`: get the state object.
- `useViewerDispatch`: dispatch an action (to the reducer) to change the state object.

**Note**: The dispatch function can be used from e.g. a click handler attached to the viewer. However, most uses of the dispatch function come from other elements inside the provider (tables, filters, etc.) and the viewer then reacts to the state change.

## Appearance

An 'appearance' object is a description of what to show in the viewer and how:

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `selection` | `{}` | 3dMol `AtomSelectionSpec`, `function` | If a function, is passed the state and should return a selection spec. |
| `style` | | 3dMol `AtomStyleSpec`, function | If a function, is passed the state and should return a style spec. |
| `addStyle` | `false` | `boolean` | If `true`, uses 3dMol's `addStyle` rather than `setStyle`. |
| `onApply` | | `function` | Called whenever the appearance is applied. Passed array of selected atom objects and the dispatch function. |
| `when` | `"change"` | `string` | Default change means appearance applied when dependencies change. Use `"hover"` to apply appeance on hover and `"click"` to apply on click. |
| `dep` | `[]` | `string[]` | Names of state properties `selection` or `style` callbacks depend on. If an empty array, the appearance is applied every state change. |

Properties only used if `when` is `"hover"`:

| Property | Default | Type | Description |
|----------|---------|------|-------------|
| `styleUnhover` | | 3dMol `AtomStyleSpec`, function | If a function, is passed the state and should return a style spec. |
| `addStyleUnhover` | `false` | `boolean` | If `true`, uses 3dMol's `addStyle` rather than `setStyle`. |
| `onApplyUnhover` | | `function` | Called whenever the appearance is applied. Passed array of selected atom objects and the dispatch function. |

After a state change:

1. Everything is hidden.
2. Then appearances with an empty `dep` array are applied (in the original order).
3. Then appearances where at least one of the dependencies have changed are applied (in original order).

Setting **click** behavior is similar to the above, just supply an `onClick` function rather than `onChange`.

To set **hover** behavior, provide a pair of functions: `onHover` and `onUnhover`.

**Note**: There is no need to list dependencies for hover and click appearances.

## Shapes

Showing surfaces, spheres etc, is very similar to showing structures.

- DO IN DETAIL ONCE HAVE STRUCTURES WORKING
- SLIGHTLY FIDDLY SINCE MAY NEED TO TRACK EXISTING SHAPES TO REMOVE ONLY IF REQD

## Labels

DO AFTER BASIC WORKING: Way to use both 3dMol built-in labels and our bottom-right corner info box

## Viewer Props

| Prop | Default | Type | Description |
|-------|---------|------|------------|
| `data` |  | `array` | See [Data](#data). |
| `onData` |  | `function` | Called immediately after all data loaded into the viewer. Passed the viewer, data array and `setMessage` function |
| `onDblClick` |  | `function` | Called on double click of the viewer's canvas. Passed the event, viewer, data and `setMessage` function. |
| `appearance` |  | `appearance[]` | See [Appearance](#appearance). |
| `initialMessage` | `"Loading structure ..."` | `string`, `component` | Initial message shown over the viewer. |
| `zoomLimits` | `[20, 500]` | `[number, number]` | Lower and upper zoom limits. |

Example use cases for `onData`:

- Add custom property to every atom in the viewer so that can use the property in a color function - can be simpler and/or more efficient than using callback to compute the colors each change. Alternatively (and since we generally do not process CIF files) we may want to derive some values from the viewer's atoms and store this information in the `info` property of the relevant elememt of the data array. 

- Verifying that an AlphaFold residue matches a variant residue at a given position.

- Writing to the `info` property of an element of the data array.

- Initilising the zoom, drag and rotation of the viewer.