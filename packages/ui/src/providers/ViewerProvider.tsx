import { createScopedContext } from "@ot/utils";

export const { ScopedProvider, useScopedState, useScopedDispatch } =
	createScopedContext("viewer");

export const ViewerProvider = ScopedProvider;
export const useViewerState = useScopedState;
export const useViewerDispatch = useScopedDispatch;
