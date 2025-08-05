import { useQuery } from "@apollo/client";
import { Link, SectionItem, OtTable, PublicationsDrawer } from "ui";
import { naLabel } from "@ot/constants";
import { definition } from ".";
import { epmcUrl } from "@ot/utils";

import Description from "./Description";
import INTERVALS_QUERY from "./IntervalsQuery.gql";

interface Target {
  id: string;
  approvedSymbol: string;
  approvedName: string;
}

interface Biosample {
  biosampleId: string;
  biosampleName: string;
  biosampleFromSource?: string;
}

const columns = [
  {
    id: "biosample",
    label: "Cell type",
    renderCell: ({ biosample }: { biosample: Biosample }) => {
      if (!biosample) return naLabel;
      return (
        <Link external to={`http://purl.obolibrary.org/obo/${biosample.biosampleId}`}>
          {biosample.biosampleFromSource || biosample.biosampleId}
        </Link>
      );
    },
    filterValue: ({ biosample }: { biosample: Biosample }) => 
      biosample?.biosampleFromSource || biosample?.biosampleId || "",
  },
  {
    id: "target",
    label: "Gene",
    renderCell: ({ target }: { target: Target }) => {
      if (!target) return naLabel;
      return (
        <Link asyncTooltip to={`/target/${target.id}`}>
          {target.approvedSymbol}
        </Link>
      );
    },
    filterValue: ({ target }: { target: Target }) => target?.approvedSymbol || "",
  },
  {
    id: "score",
    label: "Score",
    renderCell: ({ score }: { score: number }) => {
      if (score === null || score === undefined) return naLabel;
      return score.toFixed(3);
    },
    filterValue: ({ score }: { score: number }) => score?.toString() || "",
  },
  {
    id: "studyId",
    label: "Dataset",
    renderCell: ({ studyId }: { studyId: string }) => {
      if (!studyId) return naLabel;
      return (
        <Link external to={`https://www.encodeproject.org/experiments/${studyId}/`}>
          {studyId}
        </Link>
      );
    },
    filterValue: ({ studyId }: { studyId: string }) => studyId || "",
  },
  {
    id: "start",
    label: "Enhancer Start",
    renderCell: ({ start }: { start: number }) => {
      if (!start) return naLabel;
      return start.toLocaleString();
    },
    filterValue: ({ start }: { start: number }) => start?.toString() || "",
  },
  {
    id: "end",
    label: "Enhancer End",
    renderCell: ({ end }: { end: number }) => {
      if (!end) return naLabel;
      return end.toLocaleString();
    },
    filterValue: ({ end }: { end: number }) => end?.toString() || "",
  },
  {
    id: "distanceToTSS",
    label: "E-G Distance",
    renderCell: ({ distanceToTSS }: { distanceToTSS: number }) => {
      if (distanceToTSS === null || distanceToTSS === undefined) return naLabel;
      return `${distanceToTSS.toLocaleString()} bp`;
    },
    filterValue: ({ distanceToTSS }: { distanceToTSS: number }) => distanceToTSS?.toString() || "",
  },
  {
    id: "pmid",
    label: "Publication",
    renderCell: ({ pmid }: { pmid: string }) => {
      if (!pmid) return naLabel;
      const literatureList = [
        {
          name: pmid,
          url: epmcUrl(pmid),
          group: "literature",
        },
      ];
      return (
        <PublicationsDrawer 
          entries={literatureList}
          customLabel={pmid}
          symbol=""
          name=""
        />
      );
    },
    filterValue: ({ pmid }: { pmid: string }) => pmid || "",
  },
];

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(INTERVALS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => (
        <Description
          variantId={id}
          referenceAllele={request.data?.variant?.referenceAllele || ""}
          alternateAllele={request.data?.variant?.alternateAllele || ""}
        />
      )}
      renderBody={() => (
        <OtTable
          dataDownloader
          dataDownloaderFileStem={`${id}-intervals`}
          showGlobalFilter
          columns={columns}
          loading={request.loading}
          rows={request.data?.variant?.intervals?.rows || []}
          query={INTERVALS_QUERY.loc?.source?.body}
          variables={variables}
          tableDataLoading={request.loading}
          verticalHeaders={false}
          order="desc"
          sortBy="score"
          defaultSortObj={{ id: "score", desc: true }}
          showColumnVisibilityControl={true}
          showPagination={true}
          pageSize={10}
        />
      )}
    />
  );
}

export default Body; 