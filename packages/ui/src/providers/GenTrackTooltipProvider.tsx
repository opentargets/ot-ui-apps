import { createScopedContext } from "@ot/utils";

const { ScopedProvider, useScopedState, useScopedDispatch } = 
  createScopedContext({
    name: "genTrackTooltip",
    extraStateProperties: {
      datum: null,
      otherData: null,     // arbitrary info that can be used to set tootltip optons
      globalXY: null,      // {x, y} of the datum with respect to the vis container
      activeCanvas: null,  // "outer" | "inner" | null
    },
    extraActions: {
      setDatum: (state, action) => ({ ...state, datum: action.value }),
      setOtherData: (state, action) => ({ ...state, otherData: action.value }),
      setGlobalXY: (state, action) => ({ ...state, globalXY: action.value }),
      setActiveCanvas: (state, action) => ({ ...state, activeCanvas: action.value }),
    }
  });

export const GenTrackTooltipProvider = ScopedProvider;
export const useGenTrackTooltipState = useScopedState;
export const useGenTrackTooltipDispatch = useScopedDispatch;