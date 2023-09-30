import { createContext, useState } from "react";

export const InputValueContext = createContext();

export function InputValueContextProvider({ children }) {
  const [inputValue, setInputValue] = useState("");
  return (
    <InputValueContext.Provider value={[inputValue, setInputValue]}>
      {children}
    </InputValueContext.Provider>
  );
}
