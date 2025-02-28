import Description from "./Description";
import { definition } from "./index";

import KNOWN_DRUGS_BODY_QUERY from "./KnownDrugsQuery.gql";
import { naLabel, phaseMap } from "@ot/constants";
import { KnownDrugsSourceDrawer, Link, OtTableSSP, SectionItem } from "ui";
import { useState } from "react";

function getColumnPool(id, entity) {
  return [
    {
      label: "Disease information",
      columns: [
        {
          id: "disease",
          sticky: true,
          enableHiding: false,
          label: "Disease",
          propertyPath: "disease.id",
          renderCell: d => (
            <Link asyncTooltip to={`/disease/${d.disease.id}`}>
              {d.disease.name}
            </Link>
          ),
        },
      ],
    },

    {
      label: "Target information",
      columns: [
        {
          id: "targetSymbol",
          label: "Symbol",
          propertyPath: "target.approvedSymbol",
          renderCell: d => (
            <Link asyncTooltip to={`/target/${d.target.id}`}>
              {d.target.approvedSymbol}
            </Link>
          ),
        },
        {
          id: "targetName",
          label: "Name",
          propertyPath: "target.approvedName",
          hidden: ["lgDown"],
          renderCell: d => d.target.approvedName,
        },
      ],
    },
    {
      label: "Clinical trials information",
      columns: [
        {
          id: "phase",
          label: "Phase",
          sortable: true,
          renderCell: ({ phase }) => phaseMap(phase),
          filterValue: ({ phase }) => phaseMap(phase),
        },
        {
          id: "status",
          label: "Status",
          renderCell: d => (d.status ? d.status : naLabel),
        },
        {
          id: "sources",
          label: "Source",
          exportValue: d => d.urls.map(reference => reference.url),
          renderCell: d => <KnownDrugsSourceDrawer references={d.urls} />,
        },
      ],
    },
  ];
}

const exportColumns = [
  {
    label: "diseaseId",
    exportValue: row => row.disease.id,
  },
  {
    label: "diseaseName",
    exportValue: row => row.disease.name,
  },
  {
    label: "symbol",
    exportValue: row => row.target.approvedSymbol,
  },
  {
    label: "name",
    exportValue: row => row.target.approvedName,
  },
  {
    label: "phase",
    exportValue: row => row.phase,
  },
  {
    label: "status",
    exportValue: row => row.status,
  },
  {
    label: "source",
    exportValue: row => row.urls.map(reference => reference.url),
  },
];

function Body({ id: chemblId, label: name, entity }) {
  const columnPool = getColumnPool(chemblId, entity);
  const [request, setRequest] = useState({ loading: true, data: null, error: false });

  return (
    <>
      <SectionItem
        definition={definition}
        entity={entity}
        request={request}
        renderDescription={() => <Description name={name} />}
        renderBody={() => (
          <OtTableSSP
            query={KNOWN_DRUGS_BODY_QUERY}
            columns={columnPool}
            dataDownloader
            dataDownloaderColumns={exportColumns}
            dataDownloaderFileStem={`${chemblId}-known-drugs`}
            entity={entity}
            sectionName="knownDrugs"
            setInitialRequestData={dd => {
              setRequest(dd);
            }}
            variables={{ chemblId }}
          />
        )}
      />
    </>
  );
}

export default Body;
