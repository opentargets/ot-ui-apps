import { getConfig } from "@ot/config";
import { format } from "d3-format";

const config = getConfig();

interface ProteinId {
  source: string;
  id: string;
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
    .filter((proteinId) => proteinId.source === "uniprot_swissprot")
    .map((proteinId) => proteinId.id);
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
  return descriptions.map((desc) => {
    const codeStart = desc.indexOf("{");
    const parsedDesc = desc.slice(0, codeStart);
    return parsedDesc.replace(/Pubmed:\d+/gi, makePmidLink(themeColor));
  });
}

export interface LabelAndSourceSynonym {
  label: string;
  source: string;
}

export interface ParsedSynonym {
  label: string;
  tooltip: string;
}

interface ParseSynonymsOptions {
  // map raw source values to display names; unmapped sources fall back to the raw value
  sourceLabels?: Record<string, string>;
  // sort sources in this order; sources not listed are placed last
  sortOrder?: string[];
}

/*
 * Synonyms from the API have a "label" and a "source", and the same label can
 * appear more than once with different sources. Collapse them into a unique
 * list (by case-insensitive label) where each term lists all of its sources in
 * a tooltip. Shared by the Target and Drug profile headers.
 */
export function parseSynonyms(
  synonyms: LabelAndSourceSynonym[],
  { sourceLabels = {}, sortOrder = [] }: ParseSynonymsOptions = {}
): ParsedSynonym[] {
  const rank = (source: string): number => {
    const i = sortOrder.indexOf(source);
    return i === -1 ? sortOrder.length : i;
  };
  const sortedSynonyms = synonyms.slice().sort((a, b) => rank(a.source) - rank(b.source));

  const parsedSynonyms: { label: string; tooltip: string[] }[] = [];
  sortedSynonyms.forEach((s) => {
    const thisSyn = parsedSynonyms.find(
      (parsedSynonym) => parsedSynonym.label.toLowerCase() === s.label.toLowerCase()
    );
    if (!thisSyn) {
      parsedSynonyms.push({ label: s.label, tooltip: [s.source] });
    } else {
      // if the synonym is already in the list, add this source to its tooltip
      thisSyn.tooltip.push(s.source);
    }
  });

  return parsedSynonyms.map((syn) => ({
    label: syn.label,
    tooltip: `Source: ${syn.tooltip.map((s) => sourceLabels[s] ?? s).join(", ")}`,
  }));
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

export function getSortedAncestries({ arr }) {
  if (!arr || arr.length < 1) return [];
  const ldPopulationStructure = [...arr];
  return ldPopulationStructure.sort((a, b) => b.relativeSampleSize - a.relativeSampleSize);
}
