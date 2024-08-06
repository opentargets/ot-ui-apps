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
  paddingTop: "10px",
  paddingBottom: "10px",
  paddingLeft: table === "interactors" ? theme.spacing(9) : theme.spacing(3),
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

export function SectionRender({
  id,
  entity,
  focusElement,
  row,
  table,
  entityToGet,
  nameProperty,
  displayedTable,
  cols = [],
  section,
}) {
  let label = row.original[entityToGet][nameProperty];
  let ensgId;
  let efoId;
  let componentId;
  let Component;
  let entityOfSection = entity;

  if (section === undefined) return <></>;

  // const section = focusElement

  const flatCols = cols.map(c => c.id);
  if (!flatCols.includes(section[0])) return <></>;

  switch (displayedTable) {
    case "prioritisations": {
      Component = targetSections.get(section[1]);
      const { targetSymbol } = row.original;
      ensgId = entity === ENTITIES.DISEASE ? row.id : id;
      label = targetSymbol;
      componentId = ensgId;
      entityOfSection = "target";
      break;
    }
    case "associations": {
      Component = evidenceSections.get(section[1]);
      const { diseaseName, targetSymbol } = row.original;
      ensgId = entity === ENTITIES.DISEASE ? row.id : id;
      efoId = entity === ENTITIES.DISEASE ? id : row.id;
      componentId = { ensgId, efoId };
      label = { symbol: targetSymbol, name: diseaseName };
      entityOfSection = "disease";
      break;
    }
    default:
      return <SectionNotFound />;
  }

  if (!Component) return <SectionNotFound />;

  return (
    <Container table={table}>
      <Component id={componentId} label={label} entity={entityOfSection} />
    </Container>
  );
}

export function SectionRendererWrapper({ children, section }) {
  if (!section) return <></>;
  return <Suspense fallback={<LoadingSection />}>{children}</Suspense>;
}
