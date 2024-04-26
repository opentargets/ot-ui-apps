
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

// import { LoadingBackdrop, BasePage, ScrollToTop } from "ui";

// import Header from "./Header";
import NotFoundPage from "../NotFoundPage";

// const Profile = lazy(() => import("./Profile"));

function VariantPage() {
  // const location = useLocation();
  const { varId } = useParams();
  const [data, setData] = useState('waiting');

  // for now, fetch local json data and pick out correct variant
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
    JSON.stringify(data)
  );
}

export default VariantPage;