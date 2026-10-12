# report-builder

The report builder as one library, in three layers that only depend downward:

| Folder | Layer | May import |
|---|---|---|
| `src/core` | Framework-free: block types, reducer, store, storage contract, widget registry, state bag, live capture, refs/graph, export IR types | nothing from a UI framework, not even types |
| `src/react` | React binding: `ReportProvider` (store, widget registry, host config, injectable components), hooks, headless `WidgetRenderer`, state-bag and live-capture bindings | `core`, `react` |
| `src/ui` | Reference MUI UI: drawer, inspector, block views, export dialog and writers | `core`, `react`, MUI |

Hosts import from the package root and integrate through `ReportProvider`: register widgets as
render functions, pass a `ReportConfig` (endpoints, sandbox URL, provenance labels, deep links,
optional client hooks, export branding) and, if wanted, their own table component. The Open
Targets adapter lives in this repo's `ui` package and is the reference integration.

## Export branding

Exports (PPTX, PDF, DOCX, Markdown, video) and their previews draw the host's branding from
`ReportConfig.branding`, a `BrandingInput` (see `src/core/branding.ts`). Everything is optional;
`resolveBranding` fills the gaps with a neutral default (no logo or organisation, a slate/blue
palette, Arial / Courier New) and derives the rest: the 50% / 30% tints from the base colours,
CSS font stacks from the family names, the logo's aspect ratio from its SVG.

```ts
<ReportProvider
  config={{
    branding: {
      organisation: "Acme Research",        // PPTX company, logo alt text, "Acme Research 26.06"
      platform: "Acme Data Platform",       // bylines, footers, the video's closing line
      logo: { image: "<svg …>", imageOnDark: "<svg …>" }, // or a data: URL
      slides: {
        colors: { heading: "#1c4a6d", accent: "#3489ca", alert: "#ff6350", text: "#5a5f5f" },
        fonts: { heading: "Trebuchet MS", body: "Roboto", mono: "Roboto Mono" },
        decor: true,                        // diagonal panels on title and section slides
      },
      document: { colors: { primary: "#3489ca", primaryDark: "#1e6ba8", primaryLight: "#e3f0fa" } },
      paper: { fonts: { body: "Source Serif 4", heading: "Source Serif 4" } }, // research-paper layout, serif by default
      fontStylesheets: ["https://fonts.googleapis.com/css2?family=Roboto&display=swap"],
      wording: { endNarration: "Explore the data on the Acme Data Platform." },
    },
  }}
/>
```

`fonts.office` names the faces written into PPTX and DOCX (which can only use fonts installed on
the reader's machine) when they differ from the web fonts. The paper target (PDF and DOCX) uses a
research-paper layout after Google DeepMind's template: a masthead with the logo and date, a large
serif title, the organisation as the author line, the abstract in bold across the page, numbered
two-column sections, "Figure n | caption" captions, a running short title on later pages, the
page number bottom-right and "© year organisation" on the first page. The Open Targets preset is
`openTargetsBranding` in `packages/ui/src/providers/openTargetsBranding.ts`.

`yarn workspace report-builder check:boundaries` fails if a layer imports upward.
Design and architecture notes: `docs/`.
