import { createContext, useState } from "react";

// COMPONENT CONTEXT
export const SearchContext = createContext<{
  searchQuery: any;
  searchPlaceholder: string;
  primaryColor: string;
  open: boolean;
  setOpen: (arg: boolean) => void;
}>({
  searchQuery: "",
  searchPlaceholder: "Search...",
  primaryColor: "#3489ca",
  open: false,
  setOpen: () => undefined,
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
  const [open, setOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        primaryColor,
        searchQuery,
        searchPlaceholder,
        open,
        setOpen,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
