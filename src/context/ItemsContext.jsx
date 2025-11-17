import React, { createContext, useContext, useReducer } from "react";

const ItemsContext = createContext();
const ItemsDispatch = createContext();

const initialState = {
  items: [],
  delivered: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case "MARK_DELIVERED":
      const item = state.items.find((i) => i.id === action.payload);
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        delivered: [...state.delivered, item],
      };

    default:
      return state;
  }
}

export function ItemsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ItemsContext.Provider value={state}>
      <ItemsDispatch.Provider value={dispatch}>
        {children}
      </ItemsDispatch.Provider>
    </ItemsContext.Provider>
  );
}

export const useItemsState = () => useContext(ItemsContext);
export const useItemsDispatch = () => useContext(ItemsDispatch);
