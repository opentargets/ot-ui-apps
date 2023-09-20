import { createContext } from "react";

// COMPONENT CONTEXT
export const SearchContext = createContext<{
  searchQuery: any;
  searchPlaceholder: string;
  primaryColor: string;
}>({
  searchQuery: "",
  searchPlaceholder: "Search...",
  primaryColor: "#3489ca",
});

function SearchProvider({
  children,
  searchQuery,
  searchPlaceholder = "Search...",
  primaryColor = "#3489ca",
}: {
  children: React.ReactNode;
  searchQuery: string;
  searchPlaceholder: string;
  primaryColor: string;
}) {
  return (
    <SearchContext.Provider
      value={{
        primaryColor,
        searchQuery,
        searchPlaceholder,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
