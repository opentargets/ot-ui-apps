import { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { SectionItem } from "ui";

import { definition } from ".";
import AtlasTab from "./AtlasTab";
import Description from "./Description";
import GtexTab, { getData as getGtexData } from "./GtexTab";
import SummaryTab, { getData as getSummaryData } from "./SummaryTab";

function Section({ id: ensgId, label: symbol, entity }) {
  const defaultTab = "summary";
  const [tab, setTab] = useState(defaultTab);
  const [requestSummary, setRequestSummary] = useState({ loading: true });
  const [requestGtex, setRequestGtex] = useState({ loading: true });
  // TODO:
  // the part about requests (see below) will need rethinking / refactoring
  // SectionItem checks for data based on these requests, but only works for data coming from the target object
  // the widget displays based on the summary tab only.
  // Atlas and gTex tab should always be there is the widget is visible, hence the hack of using requestSummary for Atlas
  // the request for gTex wraps the data in a structure similar to that from the target object:
  // this can be probably be rewritten differently, but that's a wider scope than the MUI migration we're currently doing
  const [request, setRequest] = {
    summary: [requestSummary, setRequestSummary],
    atlas: [requestSummary, setRequestSummary], // [{ loading: false, data: true }, undefined],
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
    let isCurrent = true;

    async function updateData() {
      const newRequest = await getData(ensgId);
      if (isCurrent) setRequest(newRequest);
    }

    if (!request.data && getData) {
      setRequest({ loading: true });
      updateData();
    }

    return () => {
      isCurrent = false;
    };
  }, [tab, ensgId, request.data, getData, setRequest]);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => (
        <>
          <Tabs value={tab} onChange={handleChangeTab} style={{ marginBottom: "1rem" }}>
            <Tab value="summary" label="Summary" />
            <Tab value="atlas" label="Experiments (Expression Atlas)" />
            <Tab value="gtex" label="Variation (GTEx)" />
          </Tabs>
          {tab === "summary" && <SummaryTab symbol={symbol} data={data} />}
          {tab === "atlas" && <AtlasTab ensgId={ensgId} symbol={symbol} />}
          {tab === "gtex" && <GtexTab symbol={symbol} data={data} />}
        </>
      )}
    />
  );
}

export default Section;
