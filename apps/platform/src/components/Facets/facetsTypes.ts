export enum ENTITY {
  TARGET = "target",
  DISEASE = "disease",
}

export const ALL_CATEGORY = "All Categories";

export const TARGET_CATEGORIES = {
  [ALL_CATEGORY]: "All",
  Names: "Approved Name",
  Symbol: "Approved Symbol",
  "ChEMBL Target Class": "ChEMBL Target Class",
  "GO:BP": "GO:BP",
  "GO:CC": "GO:CC",
  "GO:MF": "GO:MF",
  Reactome: "Reactome",
  "Subcellular Location": "Subcellular Location",
  "Target ID (ENSG)": "Target ID",
  "Tractability Antibody": "Tractability Antibody",
  "Tractability Other Modalities": "Tractability Other Modalities",
  "Tractability PROTAC": "Tractability PROTAC",
  "Tractability Small Molecule": "Tractability Small Molecule",
};

export const DISEASE_CATEGORIES = {
  [ALL_CATEGORY]: "All",
  Disease: "Disease",
  "Therapeutic Area": "Therapeutic Area",
};

export interface Facet {
  id: string;
  highlights: string[];
  label: string;
  category: string;
  score: number;
}

export interface FacetState {
  loading: boolean;
  dataOptions: Facet[];
  selectedFacets: Facet[];
  suggestionOptions: Facet[];
  categoryFilterValue: string;
  availableCategories: Record<string, string>;
}

export interface FacetCategoryChange {
  category: string;
  suggestionOptions: Facet[];
}

/*****************
 * ACTIONS TYPES *
 *****************/

export enum ActionType {
  RESET_FACETS = "RESET_FACETS",
  SEARCH_FACETS = "SEARCH_FACETS",
  SEARCH_CATEGORY = "SEARCH_CATEGORY",
  SET_LOADING = "SET_LOADING",
  SET_CATEGORY = "SET_CATEGORY",
  SELECT_FACET = "SELECT_FACET",
}

export type Action =
  | { type: ActionType.SEARCH_FACETS; payload: Facet[] }
  | { type: ActionType.SEARCH_CATEGORY; categories: Record<string, string> }
  | { type: ActionType.SET_LOADING; loading: boolean }
  | { type: ActionType.SET_CATEGORY; payload: FacetCategoryChange }
  | { type: ActionType.SELECT_FACET; payload: Facet[] }
  | { type: ActionType.RESET_FACETS; entityToGet: ENTITY };
