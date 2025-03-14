import { Link, Tooltip, DataTable, EllsWrapper, useApolloClient } from "ui";
import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { MethodIconText, MethodIconArrow } from "./custom/MethodIcons";
import { defaultRowsPerPageOptions } from "@ot/constants";

import INTERACTIONS_QUERY from "./InteractionsQuery.gql";

const getData = (query, ensgId, sourceDatabase, index, size, client) =>
  client.query({
    query,
    variables: {
      ensgId,
      sourceDatabase,
      index,
      size,
    },
  });

const onLinkClick = e => {
  // handler to stop propagation of clicks on links in table rows
  // to avoid selection of a different row
  e.stopPropagation();
};

const columns = {
  interactions: [
    {
      id: "targetB",
      label: (
        <>
          Interactor{" "}
          <MethodIconText notooltip enabled>
            B
          </MethodIconText>
          <br />
          <Typography variant="caption">Alt ID</Typography>
        </>
      ),
      exportLabel: "interactorB-AltId",
      renderCell: row => (
        <>
          <EllsWrapper title={row.targetB ? row.targetB.approvedSymbol : row.intB}>
            {row.targetB ? (
              <Link asyncTooltip to={`/target/${row.targetB.id}`} onClick={onLinkClick}>
                {row.targetB.approvedSymbol}
              </Link>
            ) : (
              <Link to={`http://uniprot.org/uniprot/${row.intB}`} onClick={onLinkClick} external>
                {row.intB}
              </Link>
            )}
          </EllsWrapper>
          {row.speciesB && row.speciesB?.mnemonic.toLowerCase() !== "human" ? (
            <Tooltip title={row.speciesB?.mnemonic} showHelpIcon />
          ) : null}
          <br />
          <EllsWrapper title={row.intB}>
            <Typography variant="caption">
              Alt ID:{" "}
              <Link to={`http://uniprot.org/uniprot/${row.intB}`} onClick={onLinkClick} external>
                {row.intB}
              </Link>
            </Typography>
          </EllsWrapper>
        </>
      ),
      exportValue: row => row.targetB?.approvedSymbol || row.intB,
      filterValue: row => `${row.targetB?.approvedSymbol} ${row.intB}`,
      width: "40%",
    },
    {
      id: "score",
      label: "Score",
      renderCell: row => row.score.toFixed(2),
      exportValue: row => row.score.toFixed(2),
      width: "14%",
    },
    {
      id: "biologicalRole",
      label: "Biological role",
      renderCell: row => (
        <>
          <MethodIconText tooltip={row.intABiologicalRole} enabled>
            A
          </MethodIconText>
          <MethodIconText tooltip={row.intBBiologicalRole} enabled>
            B
          </MethodIconText>
        </>
      ),
      exportValue: row => `A: ${row.intABiologicalRole}, B: ${row.intBBiologicalRole}`,
      filterValue: row => `${row.intABiologicalRole} ${row.intBBiologicalRole}`,
      width: "23%",
    },
    {
      id: "evidences",
      label: "Interaction evidence entries",
      renderCell: row => (
        <>
          {row.count}
          <span className="selected-evidence">
            <FontAwesomeIcon icon={faPlay} />
          </span>
        </>
      ),
      exportValue: row => row.count,
      width: "23%",
    },
  ],

  evidence: [
    {
      id: "interactionIdentifier",
      label: "Identifier",
      renderCell: row => (
        <Link
          to={`http://www.ebi.ac.uk/intact/interaction/${row.interactionIdentifier}`}
          onClick={onLinkClick}
          external
        >
          {row.interactionIdentifier}
        </Link>
      ),
      width: "25%",
    },
    {
      id: "interaction",
      label: (
        <>
          Interaction
          <br />
          <Typography variant="caption">Host organism</Typography>
        </>
      ),
      renderCell: row => (
        <>
          <EllsWrapper>{row.interactionTypeShortName}</EllsWrapper>
          {row.hostOrganismScientificName ? (
            <>
              <br />
              <EllsWrapper title={row.hostOrganismScientificName}>
                <Typography variant="caption">{row.hostOrganismScientificName}</Typography>
              </EllsWrapper>
            </>
          ) : null}
        </>
      ),
      filterValue: row => `${row.interactionTypeShortName} ${row.hostOrganismScientificName}`,
      width: "30%",
    },
    {
      id: "methods",
      label: "Detection methods",
      renderCell: row => (
        <>
          <MethodIconText
            tooltip={row.participantDetectionMethodA.map(m => m.shortName).join()}
            enabled
          >
            A
          </MethodIconText>
          <MethodIconArrow tooltip={row.interactionDetectionMethodShortName} enabled />
          <MethodIconText
            tooltip={
              row.participantDetectionMethodB ? row.participantDetectionMethodB[0].shortName : null
            }
            enabled
          >
            B
          </MethodIconText>
        </>
      ),
      filterValue: row =>
        `${row.participantDetectionMethodA.map(m => m.shortName).join(" ")} ${
          row.interactionDetectionMethodShortName
        } ${row.participantDetectionMethodB ? row.participantDetectionMethodB[0].shortName : ""}`,
      width: "25%",
    },
    {
      id: "pubmedId",
      label: "Publication",
      renderCell: d => (
        <EllsWrapper title={d.pubmedId}>
          {d.pubmedId && d.pubmedId.indexOf("unassigned") === -1 ? (
            <Link external to={`http://europepmc.org/abstract/MED/${d.pubmedId}`}>
              {d.pubmedId}
            </Link>
          ) : (
            d.pubmedId
          )}
        </EllsWrapper>
      ),
      filterValue: row => row.pubmedId,
      width: "20%",
    },
  ],
};

const evidenceColsExport = [
  {
    label: "Identifier",
    exportValue: row => row.interactionIdentifier,
  },
  {
    label: "interaction",
    exportValue: row => row.interactionTypeShortName,
  },
  {
    label: "interaction host organism",
    exportValue: row => row.hostOrganismScientificName,
  },
  {
    label: "detection method A",
    exportValue: row => row.participantDetectionMethodA.map(m => m.shortName),
  },
  {
    label: "detection method short name",
    exportValue: row => row.interactionDetectionMethodShortName,
  },
  {
    label: "detection method B",
    exportValue: row => row.participantDetectionMethodB[0].shortName,
  },
  {
    label: "publication id",
    exportValue: row => row.pubmedId,
  },
];
const id = "intact";
const index = 0;
const size = 3000;

function IntactTab({ ensgId, symbol }) {
  const [data, setData] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [selectedIntB, setSelectedIntB] = useState("");
  const [loading, setLoading] = useState(false);
  const variables = { ensgId, sourceDatabase: id };
  const client = useApolloClient();

  // load tab data when new tab selected (also on first load)
  useEffect(() => {
    setLoading(true);
    getData(INTERACTIONS_QUERY, ensgId, id, index, size, client).then(res => {
      if (res.data.target.interactions) {
        setLoading(false);
        setData(res.data.target.interactions.rows);
        setEvidence(res.data.target.interactions.rows[0].evidences);
        setSelectedIntB(
          res.data.target.interactions.rows[0].targetB?.approvedSymbol ||
            res.data.target.interactions.rows[0].intB
        );
      }
    });
  }, [ensgId]);

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} md={5}>
        {/* table 1: interactions */}
        <Typography variant="body1" gutterBottom>
          Interactors of
          <br />
          {symbol}{" "}
          <MethodIconText notooltip enabled small>
            A
          </MethodIconText>
        </Typography>
        <DataTable
          showGlobalFilter
          columns={columns.interactions}
          rows={data}
          dataDownloader
          dataDownloaderFileStem={`${symbol}-molecular-interactions-interactors`}
          hover
          selected
          onRowClick={r => {
            setEvidence(r.evidences);
            setSelectedIntB(r.targetB?.approvedSymbol || r.intB);
          }}
          rowIsSelectable
          fixed
          noWrapHeader={false}
          onPagination={(page, pageSize) => {
            setEvidence(data[page * pageSize].evidences);
            setSelectedIntB(
              data[page * pageSize].targetB?.approvedSymbol || data[page * pageSize].intB
            );
          }}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          loading={loading}
          query={INTERACTIONS_QUERY.loc.source.body}
          variables={variables}
        />
      </Grid>

      {/* table 2: evidence */}
      <Grid item xs={12} md={7}>
        <Typography variant="body1" gutterBottom>
          Interaction evidence of
          <br />
          {symbol}{" "}
          <MethodIconText notooltip enabled small>
            A
          </MethodIconText>
          {` + ${selectedIntB} `}
          <MethodIconText notooltip enabled small>
            B
          </MethodIconText>
        </Typography>
        <DataTable
          showGlobalFilter
          columns={columns.evidence}
          rows={evidence}
          dataDownloader
          dataDownloaderFileStem={`${symbol}-molecular-interactions-evidence`}
          dataDownloaderColumns={evidenceColsExport}
          fixed
          noWrapHeader={false}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

export default IntactTab;
