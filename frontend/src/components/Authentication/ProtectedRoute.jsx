import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />; // Redirect if not logged in
  }

  return children; // Show the protected page
};

export default ProtectedRoute;
