import { createContext, useState } from "react";

// COMPONENT CONTEXT
export const SearchContext = createContext();

function SearchProvider({
  children,
  searchQuery,
  searchPlaceholder = "Search...",
  primaryColor = "#3489ca",
}) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isQueryLoading = (e) => setLoading(e);
  const inputValueUpdate = (e) => setInputValue(e);

  return (
    <SearchContext.Provider
      value={{
        primaryColor,
        searchQuery,
        loading,
        inputValue,
        searchPlaceholder,
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
