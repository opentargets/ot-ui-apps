import { createContext, useState } from "react";

// COMPONENT CONTEXT
export const SearchContext = createContext<{
  searchQuery: string;
  inputValue: string;
  loading: boolean;
  searchPlaceholder: string;
  primaryColor: string;
  setInputValue: (arg: string) => void;
  setLoading: (arg: boolean) => void;
}>({
  searchQuery: "",
  loading: false,
  searchPlaceholder: "Search...",
  primaryColor: "#3489ca",
  setLoading: () => undefined,
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
  primaryColor?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        primaryColor,
        searchQuery,
        loading,
        searchPlaceholder,
        setLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
