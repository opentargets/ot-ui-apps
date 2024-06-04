
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BasePage } from "ui";
import Header from "./Header";
import NotFoundPage from "../NotFoundPage";
import { MetadataType } from "./types";

// const Profile = lazy(() => import("./Profile"));

function VariantPage() {
  const location = useLocation();
  const { varId } = useParams() as { varId: string };
  const [metadata, setMetadata] =
    useState<MetadataType | 'waiting' | undefined>('waiting');

  // temp: loading is set by useQuery, set to false for now
  const loading = false;

  // temp: data will come from gql, fetch local json file for now
  useEffect(() => {
    fetch('../data/variant-data-2.json')
      .then(response => response.json())
      .then((allData: MetadataType[]) =>
        setMetadata(allData.find(v => v.variantId === varId)));
  }, []);

  // temp: revisit this (use same as other pages) once using gql to get data
  if (!metadata) {
    return <NotFoundPage />;
  } else if (metadata === 'waiting') {
    return <b>Waiting</b>;
  }

  return (
    <BasePage
      title={`${varId} profile page`}
      description={`Annotation information for ${varId}`}
      location={location}
    >
      <Header loading={loading} metadata={metadata} />
    </BasePage>
  );
}

export default VariantPage;