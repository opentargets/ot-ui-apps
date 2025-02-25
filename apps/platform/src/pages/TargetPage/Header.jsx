import { faDna } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

import {
  CrisprDepmapLink,
  ExternalLink,
  TepLink,
  XRefLinks,
  Header as HeaderBase,
  Tooltip,
} from "ui";
import { getGenomicLocation } from "ui/src/constants";

function Header({ loading, ensgId, uniprotIds, symbol, name, crisprId, genomicLocation }) {
  const ensemblUrl = `https://identifiers.org/ensembl:${ensgId}`;
  const genecardsUrl = `https://identifiers.org/genecards:${symbol}`;
  const hgncUrl = `https://identifiers.org/hgnc.symbol:${symbol}`;

  return (
    <HeaderBase
      loading={loading}
      title={symbol}
      subtitle={name}
      Icon={faDna}
      externalLinks={
        <>
          <ExternalLink title="Ensembl" id={ensgId} url={ensemblUrl} />
          <XRefLinks
            label="UniProt"
            urlStem="https://identifiers.org/uniprot:"
            ids={uniprotIds}
            limit="3"
          />
          <ExternalLink title="GeneCards" id={symbol} url={genecardsUrl} />
          <ExternalLink title="HGNC" id={symbol} url={hgncUrl} />
          <CrisprDepmapLink id={crisprId} />
          <TepLink ensgId={ensgId} symbol={symbol} />
          <Box component="span">
            <Tooltip title="build | chromosome:start-end,strand">
              <Box
                component="span"
                sx={{
                  whiteSpace: "nowrap",
                  background: theme => theme.palette.grey[600],
                  border: theme => `1px solid ${theme.palette.grey[600]}`,
                  p: "1px 5px",
                  color: "white",
                  borderRadius: "5px 0 0 5px",
                }}
              >
                {/* TODO: check UI and add it to getGenomicLocation function */}
                GRCh38
              </Box>
              <Box
                component="span"
                sx={{
                  whiteSpace: "nowrap",
                  p: "1px 5px",
                  color: theme => theme.palette.grey[600],
                  border: theme => `1px solid ${theme.palette.grey[600]}`,
                  borderRadius: "0 5px 5px 0",
                }}
              >
                {getGenomicLocation(genomicLocation)}
              </Box>
            </Tooltip>
          </Box>
        </>
      }
    />
  );
}

export default Header;
