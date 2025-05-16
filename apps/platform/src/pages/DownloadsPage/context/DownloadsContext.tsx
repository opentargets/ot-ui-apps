import { createContext } from "react";
import { initialState } from "./downloadsReducer";

export const DownloadsContext = createContext({ state: initialState, dispatch: e => {} });
