
import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";

import { BasePage, ScrollToTop, LoadingBackdrop } from "ui";

import Header from "./Header";
import NotFoundPage from "../NotFoundPage";

const Profile = lazy(() => import("./Profile"));

function VariantPage() {
  // const location = useLocation();
  const { varId } = useParams();
  const [data, setData] = useState('waiting');
  
  // temp: loading is set by useQuery, set to false for now
  const loading = false;

  // temp: data will come from gql, fetch local json file for now
  useEffect(() => {
    fetch('../data/variant-data.json')
      .then(response => response.json())
      .then(allData => setData(allData.find(v => v.variantId === varId)));
  }, []);

  if (!data) {
    return <NotFoundPage />;
  } else if (data === 'waiting') {
    return <b>Waiting</b>;
  }

  return (
    <BasePage
      title={`${varId} profile page`}
      description={`Annotation information for ${varId}`}
      location={location}
    >
      <Header
        loading={loading}
        varId={varId}
        rsIds={data.rsIds}
        chromosomeB37={data.chromosomeB37}
        positionB37={data.positionB37}
        referenceAllele={data.referenceAllele}
        alternateAllele={data.alternateAllele}
      />
      <ScrollToTop />
      <Suspense fallback={<LoadingBackdrop />}>
        <Profile data={data}/>
      </Suspense>
    </BasePage>
  );
}

export default VariantPage;