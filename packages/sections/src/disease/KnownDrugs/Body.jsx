import Description from "./Description";
import { sentenceCase } from "@ot/utils";
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
      label: "Drug information",
      columns: [
        {
          id: "drug",
          label: "Drug",
          enableHiding: false,
          propertyPath: "drug.id",
          sticky: true,
          renderCell: d =>
            d.drug ? (
              <Link asyncTooltip to={`/drug/${d.drug.id}`}>
                {d.drug.name}
              </Link>
            ) : (
              naLabel
            ),
        },
        {
          id: "type",
          label: "Type",
          propertyPath: "drugType",
          renderCell: d => d.drugType,
        },
        {
          id: "mechanismOfAction",
          label: "Mechanism Of Action",
        },
        {
          id: "actionType",
          label: "Action Type",
          renderCell: ({ drug, target }) => {
            if (!drug?.mechanismsOfAction) return naLabel;
            const at = new Set();

            const targetId = entity === "target" ? id : target.id;

            drug.mechanismsOfAction.rows.forEach(row => {
              row.targets.forEach(t => {
                if (t.id === targetId) {
                  at.add(row.actionType);
                }
              });
            });

            const actionTypes = Array.from(at);

            return actionTypes.length > 0 ? (
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {actionTypes.map(actionType => (
                  <li key={actionType}>{sentenceCase(actionType)}</li>
                ))}
              </ul>
            ) : (
              naLabel
            );
          },
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
    label: "drugId",
    exportValue: row => row.drug.id,
  },
  {
    label: "drugName",
    exportValue: row => row.drug.name,
  },
  {
    label: "type",
    exportValue: row => row.drugType,
  },
  {
    label: "mechanismOfAction",
    exportValue: row => row.mechanismOfAction,
  },
  {
    label: "actionType",
    exportValue: ({ drug: { mechanismsOfAction }, target }) => {
      if (!mechanismsOfAction) return "";
      const at = new Set();
      mechanismsOfAction.rows.forEach(row => {
        row.targets.forEach(t => {
          if (t.id === target.id) {
            at.add(row.actionType);
          }
        });
      });
      const actionTypes = Array.from(at);
      return actionTypes.map(actionType => sentenceCase(actionType));
    },
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

function Body({ id: efoId, label: name, entity }) {
  const columnPool = getColumnPool(efoId, entity);
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
            dataDownloaderFileStem={`${efoId}-known-drugs`}
            entity={entity}
            sectionName="knownDrugs"
            setInitialRequestData={dd => {
              setRequest(dd);
            }}
            variables={{ efoId }}
          />
        )}
      />
    </>
  );
}

export default Body;
