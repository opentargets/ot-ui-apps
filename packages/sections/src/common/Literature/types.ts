type AuthorListType = {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  authorId: {
    type: string;
    value: string;
  };
  authorAffiliationDetailsList: {
    authorAffiliation: {
      affiliation: string;
    }[];
  };
};

type JournalInfoType = {
  issue: string;
  volume: string;
  journalIssueId: number;
  dateOfPublication: string;
  monthOfPublication: number;
  yearOfPublication: number;
  printPublicationDate: string;
  journal: {
    title: string;
    medlineAbbreviation: string;
    isoabbreviation: string;
    nlmid: string;
    issn: string;
    essn: string;
  };
};

export type PublicationType = {
  source: string;
  patentDetails: any;
  id: string;
  inEPMC: string;
  inPMC: string;
  title: string;
  pubYear: string;
  abstractText: string;
  isOpenAccess: string;
  authorList: {
    author: AuthorListType;
  };
  journalInfo: JournalInfoType;
  pageInfo: string;
};

export type SelectedEntityType = {
  score: number;
  object: {
    name: string;
    id: string;
  };
};

export type LiteratureStateType = {
  id: string;
  cursor: string | null;
  threshold?: number;
  size?: number;
  category: string[];
  query: any | null;
  globalEntity: any | null;
  entities: any[];
  selectedEntities: SelectedEntityType[];
  startYear: number | null;
  startMonth: number | null;
  endYear: number | null;
  endMonth: number | null;
  earliestPubYear: number;
  litsIds: string[];
  page: number;
  pageSize: number;
  litsCount: number;
  loadingEntities: boolean;
};

export type RowType = {
  source: string;
  patentDetails: any;
  europePmcId: string;
  fullTextOpen: boolean;
  title: string;
  year: string;
  abstract: string;
  openAccess: boolean;
  authors: AuthorListType;
  journal: JournalInfoType & { page: string };
  titleHtml?: string;
  variant?: string;
};

export type DetailsStateType = {
  [index: string]: undefined | "loading" | RowType;
};

export type LiteratureActionType =
  | {
      type: "loadingEntities";
      value: boolean;
    }
  | {
      type: "tablePageSize";
      value: number;
    }
  | {
      type: "selectedEntities";
      value: SelectedEntityType[];
    }
  | {
      type: "stateUpdate";
      value: Partial<LiteratureStateType>;
    };

export type DetailsActionType =
  | {
      type: "addDetails";
      value: DetailsStateType;
    }
  | {
      type: "setToLoading";
      value: string[];
    };
