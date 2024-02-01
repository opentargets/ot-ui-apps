import { createContext, useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { DocumentNode } from "@apollo/client";

/**********************************
 * GLOBAL SEARCH CONTEXT/PROVIDER *
 **********************************/
type GlobalSearchProviderProps = {
  children: React.ReactNode;
  searchQuery: DocumentNode;
  searchPlaceholder: string;
  searchSuggestions: Array<unknown>;
};

export const SearchContext = createContext<{
  searchQuery: any;
  searchPlaceholder: string;
  open: boolean;
  setOpen: (arg: boolean) => void;
  searchSuggestions: Array<any>;
}>({
  searchQuery: "",
  searchPlaceholder: "Search...",
  open: false,
  setOpen: () => undefined,
  searchSuggestions: [],
});

export function SearchProvider({
  children,
  searchQuery,
  searchPlaceholder = "Search...",
  searchSuggestions,
}: GlobalSearchProviderProps) {
  const [open, setOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchPlaceholder,
        open,
        setOpen,
        searchSuggestions,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

/*********************************
 * SEARCH INPUT CONTEXT/PROVIDER *
 *********************************/
type SearchInputProviderProps = {
  children: React.ReactNode;
  setValue: (arg: string) => void;
};

export const SearchInputContext = createContext<{
  inputValue: string;
  setInputValue: (arg: string) => void;
}>({
  inputValue: "",
  setInputValue: () => {},
});

export function SearchInputProvider({ children, setValue }: SearchInputProviderProps) {
  const [inputValue, setInputValue] = useState("");

  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    setValue(debouncedInputValue);
  }, [debouncedInputValue]);

  return (
    <SearchInputContext.Provider
      value={{
        inputValue,
        setInputValue,
      }}
    >
      {children}
    </SearchInputContext.Provider>
  );
}
