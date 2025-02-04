import config from "../config";

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body: string;
}

interface SearchPostResult {
  baseUrl: string;
  formBody: string;
  requestOptions?: RequestOptions;
}

interface Route {
  private: boolean;
  [key: string]: unknown;
}

interface PublicationSummaryParams {
  pmcId: string;
  symbol: string;
  name: string;
}

export function epmcUrl(id: string): string {
  return `https://europepmc.org/article/MED/${id}`;
}

export function otgStudyUrl(id: string): string {
  return `${config.geneticsPortalUrl}/study/${id}`;
}

export function otgVariantUrl(id: string): string {
  return `${config.geneticsPortalUrl}/variant/${id}`;
}

export function europePmcLiteratureQuery(ids: string[]): string {
  const baseUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?&format=json&resultType=core&pageSize=${ids.length}&query=ext_id:`;
  return encodeURI(baseUrl + ids.join(" OR ext_id:"));
}

export const encodeParams = (params: Record<string, string>): string => {
  const formBody: string[] = [];
  Object.keys(params).forEach(key => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(params[key]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  });
  return formBody.join("&");
};

export function europePmcSearchPOSTQuery(ids: string[]): SearchPostResult {
  const baseUrl = "https://www.ebi.ac.uk/europepmc/webservices/rest/searchPOST";
  const query = ids.join(" OR ext_id:");
  const bodyOptions = {
    resultType: "core",
    format: "json",
    pageSize: "1000",
    query: `ext_id:${query}`,
    sort: "P_PDATE_D desc",
  };
  const formBody = encodeParams(bodyOptions);
  return { baseUrl, formBody };
}

export function europePmcBiblioSearchPOSTQuery(ids: string[], size = 25): SearchPostResult {
  const baseUrl = "https://www.ebi.ac.uk/europepmc/webservices/rest/searchPOST";
  const query = ids.join(" OR ext_id:");
  const bodyOptions = {
    resultType: "core",
    format: "json",
    pageSize: String(size),
    query: `ext_id:${query}`,
  };
  const formBody = encodeParams(bodyOptions);
  const requestOptions: RequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formBody,
  };
  return { baseUrl, formBody, requestOptions };
}

function clinicalTrialsUrl(id: string): string {
  return `https://www.clinicaltrials.gov/study/${id}`;
}

function fdaUrl(id: string): string {
  return `https://api.fda.gov/drug/label.json?search=set_id:${id}`;
}

function atcUrl(id: string): string {
  return `http://www.whocc.no/atc_ddd_index/?code=${id}`;
}

function dailyMedUrl(id: string): string {
  return `http://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${id}`;
}

export const referenceUrls: Record<string, (id: string) => string> = {
  ClinicalTrials: clinicalTrialsUrl,
  FDA: fdaUrl,
  ATC: atcUrl,
  DailyMed: dailyMedUrl,
};

export const getClassicAssociationsURL = ({
  baseURL,
}: {
  baseURL: string;
}): { fullURL: string; path: string } => {
  const path = "classic-associations";
  const fullURL = `${baseURL}/${path}`;
  return { fullURL, path };
};

export const getAbleRoutes = ({
  routes = [],
  isPartnerPreview = false,
}: {
  routes: Route[];
  isPartnerPreview: boolean;
}): Route[] => {
  return routes.reduce((accumulator: Route[], currentValue: Route) => {
    if (currentValue.private) {
      return isPartnerPreview ? [...accumulator, currentValue] : accumulator;
    }
    return [...accumulator, currentValue];
  }, []);
};

export const publicationSummaryQuery = ({
  pmcId,
  symbol,
  name,
}: PublicationSummaryParams): {
  baseUrl: string;
  body: {
    payload: PublicationSummaryParams;
  };
} => {
  const baseUrl = `${config.urlAiApi}/literature/publication/summary`;
  const body = {
    payload: {
      pmcId,
      targetSymbol: symbol,
      diseaseName: name,
    },
  };
  return { baseUrl, body };
};
