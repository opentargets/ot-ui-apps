import { getConfig } from "@ot/config";

const config = getConfig();

type publicationSummaryQueryProps = {
  pmcId: string;
  symbol: string;
  name: string;
};

export const publicationSummaryQuery = ({ pmcId, symbol, name }: publicationSummaryQueryProps) => {
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
