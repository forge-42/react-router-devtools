import {
  FC,
  PropsWithChildren,
  ElementType,
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useReducer,
} from "react";
import { type TagType } from "./Types.js";
import { TriangleArrow } from "../arrow/TriangleArrow.js";

type SymbolsElementProps<T extends TagType> = {
  as?: T;
  render?: (props: SymbolsElement<T>) => React.ReactNode;
  "data-type"?: string;
};
export type SymbolsElement<T extends TagType> = SymbolsElementProps<T> & ComponentPropsWithoutRef<T>;

type InitialState<T extends ElementType = "span"> = {
  Arrow?: SymbolsElement<T>;
  Colon?: SymbolsElement<T>;
  Quote?: SymbolsElement<T>;
  ValueQuote?: SymbolsElement<T>;
  BracketsRight?: SymbolsElement<T>;
  BracketsLeft?: SymbolsElement<T>;
  BraceRight?: SymbolsElement<T>;
  BraceLeft?: SymbolsElement<T>;
};

type Dispatch = React.Dispatch<InitialState<TagType>>;
const initialState: InitialState<TagType> = {
  Arrow: {
    as: "span",
    className: "w-rjv-arrow",
    style: {
      transform: "rotate(0deg)",
      transition: "all 0.3s",
    },
    children: <TriangleArrow />,
  },
  Colon: {
    as: "span",
    style: {
      color: "var(--w-rjv-colon-color, var(--w-rjv-color))",
      marginLeft: 0,
      marginRight: 2,
    },
    className: "w-rjv-colon",
    children: ":",
  },
  Quote: {
    as: "span",
    style: {
      color: "var(--w-rjv-quotes-color, #236a7c)",
    },
    className: "w-rjv-quotes",
    children: '"',
  },
  ValueQuote: {
    as: "span",
    style: {
      color: "var(--w-rjv-quotes-string-color, #cb4b16)",
    },
    className: "w-rjv-quotes",
    children: '"',
  },
  BracketsLeft: {
    as: "span",
    style: {
      color: "var(--w-rjv-brackets-color, #236a7c)",
    },
    className: "w-rjv-brackets-start",
    children: "[",
  },
  BracketsRight: {
    as: "span",
    style: {
      color: "var(--w-rjv-brackets-color, #236a7c)",
    },
    className: "w-rjv-brackets-end",
    children: "]",
  },
  BraceLeft: {
    as: "span",
    style: {
      color: "var(--w-rjv-curlybraces-color, #236a7c)",
    },
    className: "w-rjv-curlybraces-start",
    children: "{",
  },
  BraceRight: {
    as: "span",
    style: {
      color: "var(--w-rjv-curlybraces-color, #236a7c)",
    },
    className: "w-rjv-curlybraces-end",
    children: "}",
  },
};

const Context = createContext<InitialState<TagType>>(initialState);
const reducer = (state: InitialState<TagType>, action: InitialState<TagType>) => ({
  ...state,
  ...action,
});

export const useSymbolsStore = () => {
  return useContext(Context);
};

const DispatchSymbols = createContext<Dispatch>(() => {});
DispatchSymbols.displayName = "JVR.DispatchSymbols";

export function useSymbols() {
  return useReducer(reducer, initialState);
}

export function useSymbolsDispatch() {
  return useContext(DispatchSymbols);
}

interface SymbolsProps {
  initial: InitialState<TagType>;
  dispatch: Dispatch;
}

export const Symbols: FC<PropsWithChildren<SymbolsProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchSymbols.Provider value={dispatch}>{children}</DispatchSymbols.Provider>
    </Context.Provider>
  );
};

Symbols.displayName = "JVR.Symbols";
