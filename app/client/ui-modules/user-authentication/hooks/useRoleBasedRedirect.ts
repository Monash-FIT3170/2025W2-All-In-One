import { useNavigate } from "react-router";
import { useRoleBasedNavigation } from "./useRoleBasedNavigation";
import { NavigationPath } from "/app/client/navigation";

export const useRoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { getDashboardPath, isAuthenticated } = useRoleBasedNavigation();

  const redirectToDashboard = () => {
    if (isAuthenticated) {
      navigate(getDashboardPath());
    } else {
      navigate(NavigationPath.Home);
    }
  };

  const redirectToRoleSpecificPage = (page: string) => {
    if (isAuthenticated) {
      navigate(page);
    } else {
      navigate(NavigationPath.Signin);
    }
  };

  return {
    redirectToDashboard,
    redirectToRoleSpecificPage,
  };
}; 