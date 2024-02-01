import { Button } from "@mui/material";
import { faDna } from "@fortawesome/free-solid-svg-icons";
import config from "../../config";
import { styled } from "@mui/material/styles";

import { CrisprDepmapLink, ExternalLink, TepLink, XRefLinks, Header as HeaderBase } from "ui";

const GeneticsButton = styled(Button)`
  color: #fff;
  border: none;
`;

function Header({ loading, ensgId, uniprotIds, symbol, name, crisprId }) {
  const ensemblUrl = `https://identifiers.org/ensembl:${ensgId}`;
  const genecardsUrl = `https://identifiers.org/genecards:${symbol}`;
  const hgncUrl = `https://identifiers.org/hgnc.symbol:${symbol}`;
  const geneticsUrl = `${config.geneticsPortalUrl}/gene/${ensgId}`;

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
        </>
      }
      rightContent={
        symbol && (
          <GeneticsButton
            href={geneticsUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="contained"
            disableElevation
          >
            View {symbol} in Open Targets Genetics
          </GeneticsButton>
        )
      }
    />
  );
}

export default Header;
