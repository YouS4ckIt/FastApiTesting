import React from "react";
import { useLocalState } from "../../useLocalStorage";
import { Navigate } from "react-router-dom";
import { JsxElement } from "typescript";

const PrivateRoute = ({ children }: any) => {
  const [user, setUser] = useLocalState("", "user");
  return user ? children : <Navigate to={"/login"} />;
};

export default PrivateRoute;
