import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Collapse, Tab, Tabs, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { sentenceCase } from "@ot/utils";
import { useEffect, useState } from "react";
import { SectionItem, useApolloClient } from "ui";

import { definition } from ".";
import Description from "./Description";
import GtexTab, { getData as getGtexData } from "./GtexTab";
import SummaryTab, { getData as getSummaryData } from "./SummaryTab";

function Section({ id: ensgId, label: symbol, entity, viewMode }) {
  const defaultTab = "summary";
  const [showAlert, setShowAlert] = useState(true);
  const [tab, setTab] = useState(defaultTab);
  const [requestSummary, setRequestSummary] = useState({ loading: true });
  const [requestGtex, setRequestGtex] = useState({ loading: true });
  const client = useApolloClient();
  const [request, setRequest] = {
    summary: [requestSummary, setRequestSummary],
    gtex: [requestGtex, setRequestGtex],
  }[tab];

  const getData = {
    summary: getSummaryData,
    gtex: getGtexData,
  }[tab];

  const handleChangeTab = (_, tabChange) => {
    setTab(tabChange);
  };

  useEffect(() => {
    async function updateData() {
      const newRequest = await getData(ensgId, client);
      setRequest(newRequest);
    }

    if (getData) {
      setRequest({ loading: true });
      updateData();
    }
  }, [tab, ensgId, getData]);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      showContentLoading={true}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => (
        <>
          <Collapse in={showAlert} timeout={500}>
            <Alert
              sx={{
                bgcolor: grey[100],
                color: "text.primary",
                my: 1.5,
                "& .MuiAlert-icon": { color: grey[800] },
              }}
              severity="info"
              onClose={() => setShowAlert(false)}
            >
              <Typography variant="body2">Preview of new baseline expression widget</Typography>
              {viewMode && (
                <Typography variant="body2" component="div" sx={{ pt: 1, fontSize: 12.8 }}>
                  {sentenceCase(viewMode)} scores inside the widget are not directly related to the
                  overall target prioritisation {viewMode} score.
                </Typography>
              )}
            </Alert>
          </Collapse>
          <Tabs value={tab} onChange={handleChangeTab} style={{ marginBottom: "1rem" }}>
            <Tab value="summary" label="Summary" />
            <Tab value="gtex" label="Variation (GTEx)" />
          </Tabs>
          {tab === "summary" && <SummaryTab symbol={symbol} ensgId={ensgId} data={request.data} />}
          {tab === "gtex" && <GtexTab symbol={symbol} data={request.data} />}
        </>
      )}
    />
  );
}

export default Section;
