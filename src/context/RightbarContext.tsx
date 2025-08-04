import { createContext } from "react";

type props = {
  setRightbarOpen: (val: boolean | ((prev: boolean) => boolean)) => void
}

export const RightbarContext = createContext<props>({} as props);