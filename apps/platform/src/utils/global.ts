import { format } from "d3-format";
import config from "../config";
import { searchExamples, pppSearchExamples } from "../pages/HomePage/searchExamples";

interface ProteinId {
  source: string;
  id: string;
}

function pickN<T>(arr: T[], n: number): T[] {
  const items = [...arr];
  const picks: T[] = [];
  while (picks.length < n) {
    const i = Math.floor(Math.random() * items.length);
    picks.push(items.splice(i, 1)[0]);
  }
  return picks;
}

export const safeToString = (x: unknown): string => {
  switch (typeof x) {
    case "object":
      return "object";
    case "function":
      return "function";
    case undefined:
    case null:
      return "";
    default:
      return `${x}`;
  }
};

export const identifiersOrgLink = (prefix: string, accession: string, resource?: string): string =>
  `https://identifiers.org/${resource ? `${resource}/` : ""}${prefix}:${accession}`;

export const literatureUrl = (id: string): string =>
  id.startsWith("PMC") ? identifiersOrgLink("pmc", id) : identifiersOrgLink("pubmed", id);

export const sentenceCase = (str: string | null | undefined): string | null | undefined =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ").toLocaleLowerCase() : str;

export const formatComma = format(",");

export function getUniprotIds(proteinIds: ProteinId[]): string[] {
  return proteinIds
    .filter(proteinId => proteinId.source === "uniprot_swissprot")
    .map(proteinId => proteinId.id);
}

const makePmidLink = (themeColor: string) => {
  const linkStyles = `color: ${themeColor}; font-size: inherit; text-decoration: none;`;
  return (match: string) => {
    const id = match.substring(7);
    return `PubMed:<a style="${linkStyles}" href="https://europepmc.org/abstract/med/${id}" target="_blank">${id}</a>`;
  };
};

export function clearDescriptionCodes(
  descriptions: string[] | null | undefined,
  themeColor: string
): string[] {
  if (!descriptions) return [];
  return descriptions.map(desc => {
    const codeStart = desc.indexOf("{");
    const parsedDesc = desc.slice(0, codeStart);
    return parsedDesc.replace(/Pubmed:\d+/gi, makePmidLink(themeColor));
  });
}

interface GraphQLParams {
  query: string;
  variables?: Record<string, unknown>;
}

export async function fetcher(graphQLParams: GraphQLParams): Promise<unknown> {
  const data = await fetch(config.urlApi, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphQLParams),
  });
  return data.json();
}

interface SuggestedSearchExample {
  targets: string[];
  diseases: string[];
  drugs: string[];
  variants: string[];
}

export function getSuggestedSearch(): string[] {
  const suggestionArray: SuggestedSearchExample = config.profile.isPartnerPreview
    ? pppSearchExamples
    : searchExamples;
  const targets = pickN(suggestionArray.targets, 2);
  const diseases = pickN(suggestionArray.diseases, 2);
  const drugs = pickN(suggestionArray.drugs, 2);
  const variants = pickN(suggestionArray.variants, 3);
  return [...targets, ...diseases, ...drugs, ...variants];
}
