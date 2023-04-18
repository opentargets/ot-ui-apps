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
}>(null!); // xref https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#type-assertion-as-an-alternative

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
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
