import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../../store";
import { Role } from "/app/shared/user-role-identifier";
import { UnauthorizedPage } from "./UnauthorisedPage";
import { NavigationPath } from "../../../navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  const isAuthenticated = !!authUser;
  
  // Check if user data is still loading (Meteor.userId() exists but Redux state not loaded yet)
  const isLoading = Meteor.userId() && !authUser;

  useEffect(() => {
    // If not authenticated, redirect to signin
    if (!isAuthenticated && !isLoading) {
      navigate(NavigationPath.Signin, { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // If still loading user data, show loading or wait
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, return null (navigation will happen in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If user is authenticated but doesn't have the required role, show unauthorized page
  if (!allowedRoles.includes(authUser.role)) {
    return <UnauthorizedPage />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};
