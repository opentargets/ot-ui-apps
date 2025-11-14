import { createScopedContext } from "@ot/utils";

export const { ScopedProvider, useScopedState, useScopedDispatch } = 
  createScopedContext({
    name: "genTrack",
    extraStateProperties: {
      data: null,
      xMin: 0,
      xMax: Infinity,
    },
    extraActions: {
      setData: (state, action) => ({ ...state, data: action.value }),
      setXMin: (state, action) => ({ ...state, xMin: action.value }),
      setXMax: (state, action) => ({ ...state, xMax: action.value }),
    }
  });

export const GenTrackProvider = ScopedProvider;
export const useGenTrackState = useScopedState;
export const useGenTrackDispatch = useScopedDispatch;

export const GenTrackInnerProvider = ScopedProvider;
export const useGenTrackInnerState = useScopedState;
export const useGenTrackInnerDispatch = useScopedDispatch;