import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
// Direct imports — bypass the ui barrel to avoid stub conflicts
import Viewer from "@ot/ui/components/Viewer/Viewer";
import {
  ViewerProvider,
  useViewerState,
  useViewerDispatch,
} from "@ot/ui/providers/ViewerProvider";
import { ViewerInteractionProvider } from "@ot/ui/providers/ViewerInteractionProvider";
import { alphaFoldCifUrl, safeFetch } from "@ot/utils";

const OT_GRAPHQL_API = "https://api.platform.opentargets.org/api/v4/graphql";

const VARIANT_QUERY = `
  query MolecularStructureWidget($variantId: String!) {
    variant(variantId: $variantId) {
      id
      referenceAllele
      alternateAllele
      proteinCodingCoordinates {
        rows {
          uniprotAccessions
          aminoAcidPosition
          referenceAminoAcid
          alternateAminoAcid
          target {
            id
            approvedSymbol
          }
        }
      }
    }
  }
`;

// AlphaFold pLDDT confidence colour scale (stored in CIF b-factor column)
function bfactorToColor(atom: { b: number }) {
  if (atom.b >= 90) return "#0053D6"; // very high
  if (atom.b >= 70) return "#65CBF3"; // high
  if (atom.b >= 50) return "#FFDB13"; // medium
  return "#FF7D45"; // low
}

const DRAW_CARTOON = [{ selection: {}, style: { cartoon: { colorfunc: bfactorToColor } } }];
const DRAW_TRANSPARENT = [
  { selection: {}, style: { cartoon: { colorfunc: bfactorToColor, opacity: 0.4 } } },
];
const HOVER_APPEARANCE = [
  {
    selection: (_state: unknown, resi: number) => ({ resi }),
    style: { sphere: { color: "#ffffff", opacity: 0.35, radius: 1.0 } },
    addStyle: true,
  },
];

// ---- Minimal state/reducer (provider adds viewer + atomsByResi on top) ----

const INITIAL_STATE = {
  message: "Loading structure…",
  variantResidues: new Set<number>(),
  representBy: "cartoon" as "cartoon" | "transparent",
};

type State = typeof INITIAL_STATE;
type Action =
  | { type: "setMessage"; value: string | null }
  | { type: "setVariantResidues"; value: Set<number> }
  | { type: "setRepresentBy"; value: "cartoon" | "transparent" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setMessage":
      return { ...state, message: action.value ?? "" };
    case "setVariantResidues":
      return { ...state, variantResidues: action.value };
    case "setRepresentBy":
      return { ...state, representBy: action.value };
    default:
      return state;
  }
}

// ---- Inner component (needs to be inside ViewerProvider to use hooks) ----

type Row = {
  uniprotAccessions: string[];
  aminoAcidPosition: number;
  referenceAminoAcid: string;
  alternateAminoAcid: string;
  target: { id: string; approvedSymbol: string };
};

function ViewerContent({
  row,
  structureData,
}: {
  row: Row | null;
  structureData: string | null;
}) {
  const viewerState = useViewerState() as State;
  const viewerDispatch = useViewerDispatch();

  // Mark variant residues once structure + row are ready
  useEffect(() => {
    if (!structureData || !row) return;
    viewerDispatch({
      type: "setVariantResidues",
      value: new Set(
        row.referenceAminoAcid.split("").map((_, i) => i + row.aminoAcidPosition)
      ),
    });
    viewerDispatch({ type: "setMessage", value: null });
  }, [structureData, row]);

  const drawAppearance =
    viewerState.representBy === "transparent" ? DRAW_TRANSPARENT : DRAW_CARTOON;

  return (
    <Box sx={{ position: "relative" }}>
      {/* 3D viewer */}
      {structureData && (
        <Viewer
          data={[{ structureData }]}
          drawAppearance={drawAppearance}
          hoverAppearance={HOVER_APPEARANCE}
          usage={{
            Rotate: "Drag",
            Move: "Ctrl + Drag",
            Zoom: "Ctrl + Scroll",
            Reset: "Double click",
          }}
        />
      )}

      {/* Loading / error overlay */}
      {viewerState.message && (
        <Typography
          variant="body2"
          sx={{
            position: structureData ? "absolute" : "static",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: structureData ? undefined : 400,
            bgcolor: "#f8f8f8",
            zIndex: 1,
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          {viewerState.message}
        </Typography>
      )}

      {/* Structure representation controls */}
      {structureData && (
        <Box sx={{ mt: 1.5 }}>
          <FormControl>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormLabel>
                <Typography variant="subtitle2">Structure</Typography>
              </FormLabel>
              <RadioGroup
                row
                value={viewerState.representBy}
                onChange={e =>
                  viewerDispatch({
                    type: "setRepresentBy",
                    value: e.target.value as "cartoon" | "transparent",
                  })
                }
              >
                {(["cartoon", "transparent"] as const).map((val, i, arr) => (
                  <FormControlLabel
                    key={val}
                    value={val}
                    control={<Radio size="small" />}
                    label={val}
                    slotProps={{ typography: { variant: "body2" } }}
                    sx={{
                      mr: i < arr.length - 1 ? 2 : 0,
                      "& .MuiFormControlLabel-label": { marginLeft: -0.7 },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}

// ---- Root widget ----

export default function MolecularStructureWidget({ variantId }: { variantId: string }) {
  const [row, setRow] = useState<Row | null>(null);
  const [structureData, setStructureData] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      // 1. Resolve uniprotAccessions via OT GraphQL API
      try {
        const res = await fetch(OT_GRAPHQL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: VARIANT_QUERY, variables: { variantId } }),
        });
        const json = await res.json();
        const firstRow: Row | undefined =
          json?.data?.variant?.proteinCodingCoordinates?.rows?.[0];
        if (!firstRow) {
          if (!cancelled) setFetchError("No protein-coding coordinates for this variant.");
          return;
        }
        if (!cancelled) setRow(firstRow);

        // 2. Fetch AlphaFold CIF — try each uniprot accession until one works
        for (const uniprotId of firstRow.uniprotAccessions) {
          const [cif] = await safeFetch(alphaFoldCifUrl(uniprotId), "text");
          if (cif && !cancelled) {
            setStructureData(cif as string);
            return;
          }
        }
        if (!cancelled) setFetchError("AlphaFold structure not available for this variant.");
      } catch (err) {
        if (!cancelled)
          setFetchError(err instanceof Error ? err.message : "Failed to load structure.");
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  if (fetchError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          {fetchError}
        </Typography>
      </Box>
    );
  }

  return (
    <ViewerProvider initialState={INITIAL_STATE} reducer={reducer}>
      <ViewerInteractionProvider>
        <ViewerContent row={row} structureData={structureData} />
      </ViewerInteractionProvider>
    </ViewerProvider>
  );
}
