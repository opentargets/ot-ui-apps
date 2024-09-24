import { Suspense } from "react";
import { styled } from "@mui/material/styles";
import { LoadingBackdrop } from "ui";
import { ENTITIES } from "../../utils";

import targetSections from "../../../../sections/targetSections";
import evidenceSections from "../../../../sections/evidenceSections";

import { grey } from "@mui/material/colors";

const LoadingContainer = styled("div")({
  margin: "25px 0",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const Container = styled("div", {
  shouldForwardProp: prop => prop !== "table",
})(({ table, theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: table === "interactors" ? theme.spacing(6) : theme.spacing(3),
  paddingRight: table === "interactors" ? theme.spacing(6) : theme.spacing(3),
  background: grey[100],
}));

function LoadingSection() {
  return (
    <LoadingContainer>
      <LoadingBackdrop />
      Importing section assets
    </LoadingContainer>
  );
}

function SectionNotFound() {
  return <div>Section not found</div>;
}

const getComponentConfig = (displayedTable, row, entity, id, section) => {
  switch (displayedTable) {
    case "prioritisations":
      return {
        Component: targetSections.get(section[1]),
        componentId: entity === ENTITIES.DISEASE ? row.id : id,
        label: row.original.targetSymbol,
        entityOfSection: "target",
      };
    case "associations":
      return {
        Component: evidenceSections.get(section[1]),
        componentId: {
          ensgId: entity === ENTITIES.DISEASE ? row.id : id,
          efoId: entity === ENTITIES.DISEASE ? id : row.id,
        },
        label: {
          symbol: row.original.targetSymbol,
          name: row.original.diseaseName,
        },
        entityOfSection: "disease",
      };
    default:
      return { Component: SectionNotFound };
  }
};

export function SectionRender({
  id,
  entity,
  row,
  table,
  entityToGet,
  nameProperty,
  displayedTable,
  cols = [],
  section,
}) {
  if (!section || !cols.some(c => c.id === section[0])) {
    return null;
  }

  const {
    Component,
    componentId,
    label = row.original[entityToGet][nameProperty],
    entityOfSection = entity,
  } = getComponentConfig(displayedTable, row, entity, id, section);

  if (!Component) return <SectionNotFound />;

  return (
    <Container table={table}>
      <Component id={componentId} label={label} entity={entityOfSection} />
    </Container>
  );
}

export function SectionRendererWrapper({ children, section }) {
  if (!section) return null;
  return <Suspense fallback={<LoadingSection />}>{children}</Suspense>;
}
