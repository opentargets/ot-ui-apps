import { createScopedContext } from "@ot/utils";

const { ScopedProvider, useScopedState, useScopedDispatch } = 
  createScopedContext({
    name: "visTooltip",
    extraStateProperties: {
      datum: null,
      otherData: null,    // arbitrary info that can be used to set tootltip optons
      globalXY: null,     // {x, y} of the datum with respect to the vis container
    },
    extraActions: {
      setDatum: (state, action) => ({ ...state, datum: action.value }),
      setGlobalXY: (state, action) => ({ ...state, globalXY: action.value }),
    }
  });

export const VisTooltipProvider = ScopedProvider;
export const useVisTooltipState = useScopedState;
export const useVisTooltipDispatch = useScopedDispatch;