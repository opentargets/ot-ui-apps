import { createContext, useState } from "react";

// COMPONENT CONTEXT
export const SearchContext = createContext();

function SearchProvider({ children, searchQuery }) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isQueryLoading = (e) => setLoading(e);
  const inputValueUpdate = (e) => setInputValue(e);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        loading,
        inputValue,
        setLoading,
        setInputValue,
        isQueryLoading,
        inputValueUpdate,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
