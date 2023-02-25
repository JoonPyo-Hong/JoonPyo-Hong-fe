import React, { useReducer, useContext, createContext, Dispatch } from 'react';
type State = {
  id: string;
  name: string;
};

type Action =
  | { type: 'SET_ID'; id: string }
  | { type: 'SET_NAME'; name: string }

type Dispatchs = Dispatch<Action>;

const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<Dispatchs | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ID':
      return {
        ...state,
        id: action.id
      };
    case 'SET_NAME':
      return {
        ...state,
        name: action.name 
      };
    default:
      throw new Error('Unhandled action');
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    id: '',
    name: '',
  });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useContextState() {
  const state = useContext(StateContext);
  if (!state) throw new Error('Cannot find useContextState'); 
  return state;
}

export function useContextDispatch() {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error('Cannot find useContextDispatch');
  return dispatch;
}