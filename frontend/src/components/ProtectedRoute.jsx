import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  user,
  requiredRole,
  redirectPath = "/",
  children,
}) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  if (requiredRole === "trainer" && !user.user.isTrainer) {
    return <Navigate to={redirectPath} replace />;
  }
  if (requiredRole === "user" && user.user.isTrainer) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
