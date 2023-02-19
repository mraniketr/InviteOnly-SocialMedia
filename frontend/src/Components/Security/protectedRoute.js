import React from "react";
import { Redirect, Route } from "react-router-dom";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = cookies.get("isLoggedIn");
  
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;
