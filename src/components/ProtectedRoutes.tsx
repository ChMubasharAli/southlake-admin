import { Navigate } from "react-router-dom";

// ProtectedRoute component to ensure only authenticated users can access protected routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem("auth_token");

  // If the token is not present, redirect to the login page
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render the protected content
};

export default ProtectedRoute;
