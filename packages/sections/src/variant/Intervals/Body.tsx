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
    id: "target",
    label: "Gene",
    enableHiding: false,
    sticky: true,
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
    id: "biosample",
    label: "Affected tissue/cell",
    enableHiding: false,
    renderCell: ({ biosample }: { biosample: Biosample }) => {
      if (!biosample) return naLabel;
      return (
        <Link external to={`http://purl.obolibrary.org/obo/${biosample.biosampleId}`}>
          {biosample.biosampleName || biosample.biosampleId}
        </Link>
      );
    },
    filterValue: ({ biosample }: { biosample: Biosample }) => 
      biosample?.biosampleFromSource || biosample?.biosampleId || "",
  },
  {
    id: "intervalType",
    label: "Interval type",
    sortable: true,
    renderCell: ({ intervalType }: { intervalType: string }) => {
      if (!intervalType) return naLabel;
      return intervalType;
    },
    filterValue: ({ intervalType }: { intervalType: string }) => intervalType || "",
  },
  {
    id: "distanceToTss",
    label: "Distance from start site (bp)",
    numeric: true,
    sortable: true,
    renderCell: ({ distanceToTss }: { distanceToTss: number }) => {
      if (distanceToTss === null || distanceToTss === undefined) return naLabel;
      return `${distanceToTss.toLocaleString()}`;
    },
    filterValue: ({ distanceToTss }: { distanceToTss: number }) => distanceToTss?.toString() || "",
  },
  {
    id: "size",
    label: "Interval size (bp)",
    numeric: true,
    sortable: true,
    renderCell: ({ start, end }: { start: number; end: number }) => {
      if (
        start === null ||
        start === undefined ||
        end === null ||
        end === undefined
      )
        return naLabel;
      return `${(end - start + 1).toLocaleString()}`;
    },
    filterValue: ({ start, end }: { start: number; end: number }) =>
      start !== undefined && end !== undefined && start !== null && end !== null
        ? `${start}-${end}`
        : "",
  },
  {
    id: "start_end",
    label: "Interval range",
    renderCell: ({ start, end }: { start: number; end: number }) => {
      if (
        start === null ||
        start === undefined ||
        end === null ||
        end === undefined
      )
        return naLabel;
      return `${start.toLocaleString()}-${end.toLocaleString()}`;
    },
    filterValue: ({ start, end }: { start: number; end: number }) =>
      start !== undefined && end !== undefined && start !== null && end !== null
        ? `${start}-${end}`
        : "",
  },
  {
    id: "studyId",
    label: "Study",
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
    id: "score",
    label: "Score",
    numeric: true,
    sortable: true,
    tooltip: "Predictive model score ranging from 0 to 1",
    renderCell: ({ score }: { score: number }) => {
      if (score === null || score === undefined) return naLabel;
      return score.toFixed(3);
    },
    filterValue: ({ score }: { score: number }) => score?.toString() || "",
  },

  // {
  //   id: "pmid",
  //   label: "Publication",
  //   renderCell: ({ pmid }: { pmid: string }) => {
  //     if (!pmid) return naLabel;
  //     const literatureList = [
  //       {
  //         name: pmid,
  //         url: epmcUrl(pmid),
  //         group: "literature",
  //       },
  //     ];
  //     console.log(literatureList)
  //     return (
  //       <PublicationsDrawer 
  //         entries={literatureList}
  //       />
  //     );
  //   },
  //   filterValue: ({ pmid }: { pmid: string }) => pmid || "",
  // },
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