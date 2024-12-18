import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useUser } from "../UserContext"; 

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      element={user ? element : <Navigate to="/Login" />}
    />
  );
};

export default PrivateRoute;