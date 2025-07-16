import { createScopedContext } from "@ot/utils";

export const { ScopedProvider, useScopedState, useScopedDispatch } =
	createScopedContext({
    name: "viewer",
    extraStateProperties: {
      hoveredAtom: null,
      clickedAtom: null,
      hoveredResi: null,
      clickedResi: null,
    },
    extraActions: {
      _setHoveredAtom: (state, action) => ({ ...state, state.hoveredAtom: action.value }),
      _setClickedAtom: (state, action) => ({ ...state, state.clickedAtom: action.value }),
      _setHoveredResi: (state, action) => ({ ...state, state.hoveredResi: action.value }),
      _setClickedResi: (state, action) => ({ ...state, state.clickedResi: action.value }),
    }
  });

export const ViewerProvider = ScopedProvider;
export const useViewerState = useScopedState;
export const useViewerDispatch = useScopedDispatch;
