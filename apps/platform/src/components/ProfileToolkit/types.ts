import React, { ReactNode } from "react";
import { DataSource } from "../AssociationsToolkit/types";

export interface Definition {
  id: string;
  name: string;
  shortName: string;
  hasData: () => boolean;
  external: boolean;
  isPrivate?: boolean;
}

export interface ProfileContextType {
  profileFilter: (Definition | DataSource)[];
  setProfileFilter: React.Dispatch<React.SetStateAction<(Definition | DataSource)[]>>;
  entity: string;
}

export interface ProfileStateProviderProps {
  children: ReactNode;
  entity: string;
}
