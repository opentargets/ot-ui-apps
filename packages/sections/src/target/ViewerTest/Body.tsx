import { useQuery } from "@apollo/client";
import { Box, Button } from "@mui/material";
import { alphaFoldCifUrl, getUniprotIds, safeFetch } from "@ot/utils";
import { useEffect, useState } from "react";
import {
  SectionItem,
  useViewerDispatch,
  Viewer,
  ViewerProvider,
  ViewerInteractionProvider
} from "ui";
import { definition } from ".";
import Description from "./Description";
import VIEWER_TEST_QUERY from "./ViewerTestQuery.gql";
import { getAlphaFoldConfidence } from "@ot/constants";

export default function Body({ id: ensemblId, label: symbol, entity }) {
	const [structureData, setStructureData] = useState(null);

	const variables = { ensemblId };
	const request = useQuery(VIEWER_TEST_QUERY, {
		variables,
	});

	const uniprotId = request?.data?.target
		? getUniprotIds(request?.data?.target?.proteinIds)?.[0]
		: null;

	// fetch alphaFold structure
	useEffect(() => {
		const fetchStructure = async () => {
			if (!uniprotId) return;
			const [cifData, error] = await safeFetch(
				alphaFoldCifUrl(uniprotId),
				"text",
			);
			cifData ? setStructureData(cifData) : console.log(error);
		};
		fetchStructure();
	}, [uniprotId]);

	const initialState = {
		confidence: true,
	};

	function reducer(state, action) {
		switch (action.type) {
			case "TOGGLE_CONFIDENCE": {
				const newState = { ...state };
        newState.confidence = !state.confidence
        return newState;
      }
			default: {
				throw Error(`Invalid action type: ${action.type}`);
      }
		}
	}

  function trackColor(state, resi) {
    if (!state.viewer) return;
    if (state.confidence)
      return getAlphaFoldConfidence(state.atomsByResi.get(resi)[0], "color");
    return "green";
  }

	// const baseStyle = { cartoon: { color: "red" } };
  // const baseStyle = {};

	// !! VIEWERR PROVIDER SHOULD ONLY WRAP VIEWER AND CONTROLS, BUT LIKE
	// THIS TO AVOID RECRECREATING PROVIDER ON RERENEDER - WHICH CAN BE FIXED
	// WITH A USEMEMO IN THE SCOPED PROVIDER BUT THAT MAY BE HINDING SOMETHING
	// UGLIER !!

  const drawAppearance = [
    {
      style: (state) => ({
        cartoon: { 
          colorfunc: state.confidence
            ? a => getAlphaFoldConfidence(a, "color")
            : () => "green"
          },
        }
      ),
    },
  ];

	return (
		<ViewerProvider initialState={initialState} reducer={reducer}>
      <ViewerInteractionProvider>
        <SectionItem
          definition={definition}
          entity={entity}
          request={request}
          renderDescription={() => <Description />}
          renderBody={() => {
            if (!request?.data?.target) return <></>;
            return structureData ? (
              <Box>
                <Viewer
                  data={[{ structureData }]}
                  drawAppearance={drawAppearance}
                  trackColor={trackColor}
                  // hoverAppearance={[
                  //   {
                  //     selection: (state, resi) => ({ resi }),
                  //     style: { stick: {}, sphere: { radius: 0.6 } },
                  //     addStyle: true,
                  //     unhoverSelection: {},
                  //     unhoverStyle: drawAppearance.style,
                  //     unhoverAddStyle: false,
                  //   }
                  // ]}
                  />
                <Controls />
              </Box>
            ) : (
              "NO STRUCTURE DATA!!!"
            );
          }}
        />
      </ViewerInteractionProvider>
		</ViewerProvider>
	);
}

function Controls() {
	const viewerDispatch = useViewerDispatch();

	function handleToggleColor() {
		viewerDispatch({ type: "TOGGLE_CONFIDENCE" });
	}

	return <Button onClick={handleToggleColor}>Toggle color</Button>;
}

// drawAppearance={[{ style: { cartoon: { color: "green" } }}]}
// hoverAppearance={[
//   {
//     selection: (state, atom) => ({ resi: atom.resi }),
//     style: { stick: {}, sphere: { radius: 0.6 } },
//     addStyle: true,
//     unhoverStyle: baseStyle,
//   },
// ]}
