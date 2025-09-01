import { ReactElement, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { SectionItem, ViewerProvider, ViewerInteractionProvider} from "ui";
import { definition } from ".";
import Description from "./Description";
import MOLECULAR_STRUCTURE_QUERY from "./MolecularStructureQuery.gql";
import StructureViewer from "./StructureViewer";
import { initialState, reducer } from "./context";

type BodyProps = {
  id: string;
  entity: string;
};

export function Body({ id, entity }: BodyProps): ReactElement {

  const variables = {
    variantId: id,
  };
  const request = useQuery(MOLECULAR_STRUCTURE_QUERY, {
    variables,
  });

  const variant = request.data?.variant;
  const proteinCodingCoordinatesRow = variant?.proteinCodingCoordinates?.rows?.[0];

  if (!proteinCodingCoordinatesRow) return null;

  // ===== !! USE REFS, EFFECTS AND EVENT HANDLERS TO LINK CAMERAS =====
  function syncViews(sourceViewer, targetViewer) {
    targetViewer.setView(sourceViewer.getView());
    targetViewer.render();
  }

  function linkCameras(sourceViewer, targetViewer) {
    const sourceCanvas = sourceViewer.getCanvas();
    const targetCanvas = targetViewer.getCanvas();

    let mousedown = false;
    
    sourceCanvas.addEventListener("mousedown", () => {
      mousedown = true;
    });

    sourceCanvas.addEventListener("mousemove", () => {
      if (mousedown) {
        syncViews(sourceViewer, targetViewer);
      }
    });

    // when drag ends
    sourceCanvas.addEventListener("mouseup", () => {
      syncViews(sourceViewer, targetViewer);
      mousedown = false;
    });

    // on zoom
    sourceCanvas.addEventListener("wheel", () => {
      syncViews(sourceViewer, targetViewer);
    });
  }

  setTimeout(() => {
    linkCameras(window.viewers[0], window.viewers[1]);
    linkCameras(window.viewers[1], window.viewers[0]);
  }, 2000);

  // viewer 1
  // useEffect(() => {
  //   if (!window.viewers?.[0] || !window.viewers?.[1]) return;
  // }, [window.viewers?.[0], window.viewers?.[1]]);

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description
          variantId={variant?.id}
          referenceAllele={variant?.referenceAllele}
          alternateAllele={variant?.alternateAllele}
          targetId={proteinCodingCoordinatesRow?.target?.id}
          targetApprovedSymbol={proteinCodingCoordinatesRow?.target?.approvedSymbol}
          uniprotAccession={proteinCodingCoordinatesRow?.uniprotAccessions?.[0]}
        />
      )}
      renderBody={() => (
        <ViewerInteractionProvider>
          <Box sx={{ display: "flex", gap: 3 }} >
            <Box width="50%" flexGrow={1}>
              <ViewerProvider
                initialState={{
                  ...initialState,
                  variantSummary: `${
                    proteinCodingCoordinatesRow.referenceAminoAcid}${
                    proteinCodingCoordinatesRow.aminoAcidPosition}${
                    proteinCodingCoordinatesRow.alternateAminoAcid
                  }`
                }}
                reducer={reducer}
              >
                <StructureViewer row={proteinCodingCoordinatesRow} />
              </ViewerProvider>
            </Box>
            <Box width="50%" flexGrow={1}>
              <ViewerProvider
                initialState={{
                  ...initialState,
                  variantSummary: `${
                    proteinCodingCoordinatesRow.referenceAminoAcid}${
                    proteinCodingCoordinatesRow.aminoAcidPosition}${
                    proteinCodingCoordinatesRow.alternateAminoAcid
                  }`
                }}
                reducer={reducer}
              >
                <StructureViewer row={proteinCodingCoordinatesRow} />
              </ViewerProvider>
            </Box>
          </Box>
        </ViewerInteractionProvider>
      )}
    />
  );
}

export default Body;
