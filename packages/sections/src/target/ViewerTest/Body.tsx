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
			case "toggleConfidence": {
				const newState = { ...state };
        newState.confidence = !state.confidence
        return newState;
      }
			default: {
				throw Error(`Invalid action type: ${action.type}`);
      }
		}
	}

  function interactionReducer(state, action) {
    switch (action.type) {
			case "setHoverSphere": {
        return { ...state, hoverSphere: action.value };
      }
			default: {
				throw Error(`Invalid action type: ${action.type}`);
      }
		}
  }

  const initialInteractionState = {
    hoverSphere: null,
  };

  function trackColor(state, resi) {
    if (!state.viewer) return;
    if (state.confidence)
      return getAlphaFoldConfidence(state.atomsByResi.get(resi)[0], "color");
    return "green";
  }

  const drawAppearance = [
    {
      style: (state) => ({
        cartoon: { 
          colorfunc: state.confidence
            ? a => getAlphaFoldConfidence(a, "color")
            : () => "green"
          },
          arrows: true,
        }
      ),
    },
  ];

  function showSphere(state, resi, interactionState, interactionDispatch) {
    const atom = state.atomsByResi.get(resi)[0];  // JUST USE FIRST ATOM FOR TRIAL
    const sphere = state.viewer.addSphere({
      center: {x: atom.x, y: atom.y, z: atom.z},
        radius: 2,
        color: '#fbb',
        opacity: 0.99,
    });
    interactionDispatch({ type: "setHoverSphere", value: sphere });
  }

  function removeSphere(state, resi, interactionState, interactionDispatch) {
    state.viewer.removeShape(interactionState.hoverSphere);
    interactionDispatch({ type: "setHoverSphere", value: null });
  }

	return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description />}
      renderBody={() => {
        if (!request?.data?.target) return <></>;
        return structureData ? (
          <ViewerProvider
            initialState={initialState}
            reducer={reducer}
          >
            <ViewerInteractionProvider
              initialState={initialInteractionState}
              reducer={interactionReducer}
            >
              <Box>
                <Viewer
                  data={[{ structureData }]}
                  drawAppearance={drawAppearance}
                  // onDraw={handleDraw}
                  trackColor={trackColor}
                  hoverAppearance={[
                    {
                      eventSelection: { atom: "CA" },
                      onApply: showSphere,
                      leaveOnApply: removeSphere,
                    }
                  ]}
                  clickAppearance={[
                    {
                      selection: (state, resi) => ({ resi }),
                      style: { stick: { hidden: false }, sphere: { radius: 0.6, hidden: false } },
                      addStyle: true,
                      leaveStyle: { stick: { hidden: true }, sphere: { hidden: true } },
                      leaveAddStyle: true,
                    }
                  ]}
                  />
                <Controls />
              </Box>
            </ViewerInteractionProvider>
		      </ViewerProvider>
        ) : (
          "NO STRUCTURE DATA!!!"
        );
      }}
    />
	);
}

function Controls() {
	const viewerDispatch = useViewerDispatch();

	function handleToggleColor() {
		viewerDispatch({ type: "toggleConfidence" });
	}

	return <Button onClick={handleToggleColor}>Toggle color</Button>;
}

