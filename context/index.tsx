"use client";
import { createContext, useReducer } from "react";

export const Context = createContext<any>(null);

const setUserToLocalStorage = ({ payload }: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(payload));
  }
};

const setTokenToLocalStorage = ({ payload }: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", JSON.stringify(payload));
  }
};

const getUserFromLocalStorage = () => { 
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    // return data ? JSON.parse(data) : null;
    return data && data !== "undefined" ? JSON.parse(data) : null;
  }
  return null;
};

const getTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("token");
    return data && data !== "undefined" ? JSON.parse(data) : null;
  }
  return null;
};

const removeUserfromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

const removeTokenfromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

const InitialState: any = {
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
};

const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN": {
      setUserToLocalStorage({ payload: action.payload.user });
      setTokenToLocalStorage({ payload: action.payload.token });
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    }

    case "LOGOUT": {
      removeUserfromLocalStorage();
      removeTokenfromLocalStorage();
      return { ...state, user: null, token: null };
    }

    default:
      return state;
  }
};

export const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(rootReducer, InitialState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
