import { FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';

type InitialState = Record<string, boolean>;
type Dispatch = React.Dispatch<InitialState>;

const initialState: InitialState = {};
const Context = createContext<InitialState>(initialState);

const reducer = (state: InitialState, action: InitialState) => ({
  ...state,
  ...action,
});

export const useShowToolsStore = () => {
  return useContext(Context);
};

const DispatchShowTools = createContext<Dispatch>(() => {});
DispatchShowTools.displayName = 'JVR.DispatchShowTools';

export function useShowTools() {
  return useReducer(reducer, initialState);
}

export function useShowToolsDispatch() {
  return useContext(DispatchShowTools);
}

interface ShowToolsProps {
  initial: InitialState;
  dispatch: Dispatch;
}

export const ShowTools: FC<PropsWithChildren<ShowToolsProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchShowTools.Provider value={dispatch}>{children}</DispatchShowTools.Provider>
    </Context.Provider>
  );
};
ShowTools.displayName = 'JVR.ShowTools';
