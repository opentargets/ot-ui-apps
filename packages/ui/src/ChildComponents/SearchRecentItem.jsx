import { useState, useEffect } from "react";

function SearchRecentItem({ newSearchItem }) {
  const [recentItems, setRecentItems] = useState([
    {
      id: "ddd",
      name: "name1",
    },
  ]);
  setLocalStorageItems()

  getLocalStorageItems = () => {
    if (true) {
      // TODO: add toggle for search history
      const items = JSON.parse(localStorage.getItem('items'));
      console.log(items)
    }
  };

  setLocalStorageItems = () => {
    localStorage.setItem("items", JSON.stringify(recentItems));
  };

  useEffect(()=> {

  },[newSearchItem]);

  return <div>SearchRecentItem</div>;
}

export default SearchRecentItem;
