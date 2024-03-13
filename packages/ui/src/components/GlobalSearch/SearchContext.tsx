import { createContext, useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { DocumentNode } from "@apollo/client";

import { searchExamples, pppSearchExamples } from "./searchExamples";

function pickTwo([...arr]) {
  const i1 = Math.floor(Math.random() * arr.length);
  const resultArray = arr.splice(i1, 1);
  const i2 = Math.floor(Math.random() * arr.length);
  resultArray.push(...arr.splice(i2, 1));

  return resultArray;
}

export function getSuggestedSearch(isPartnerPreview = false) {
  const suggestionArray = isPartnerPreview ? pppSearchExamples : searchExamples;
  const targets = pickTwo(suggestionArray.targets);
  const diseases = pickTwo(suggestionArray.diseases);
  const drugs = pickTwo(suggestionArray.drugs);

  return [...targets, ...diseases, ...drugs];
}

/**********************************
 * GLOBAL SEARCH CONTEXT/PROVIDER *
 **********************************/
type GlobalSearchProviderProps = {
  children: React.ReactNode;
  searchQuery: DocumentNode;
  searchPlaceholder: string;
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
}: GlobalSearchProviderProps) {
  const [open, setOpen] = useState(false);
  const searchSuggestions = getSuggestedSearch();

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
