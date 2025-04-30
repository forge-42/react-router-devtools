import { FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';

type InitialState = {
  [key: string]: boolean;
};

type Dispatch = React.Dispatch<InitialState>;

const initialState: InitialState = {};
const Context = createContext<InitialState>(initialState);

const reducer = (state: InitialState, action: InitialState) => ({
  ...state,
  ...action,
});

export const useExpandsStore = () => {
  return useContext(Context);
};

const DispatchExpands = createContext<Dispatch>(() => {});
DispatchExpands.displayName = 'JVR.DispatchExpands';

export function useExpands() {
  return useReducer(reducer, initialState);
}

export function useExpandsDispatch() {
  return useContext(DispatchExpands);
}

interface ExpandsProps {
  initial: InitialState;
  dispatch: Dispatch;
}

export const Expands: FC<PropsWithChildren<ExpandsProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchExpands.Provider value={dispatch}>{children}</DispatchExpands.Provider>
    </Context.Provider>
  );
};
Expands.displayName = 'JVR.Expands';
