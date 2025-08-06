import { useNavigate } from "react-router";
import { useRoleBasedNavigation } from "./useRoleBasedNavigation";

export const useRoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { getDashboardPath, isAuthenticated } = useRoleBasedNavigation();

  const redirectToDashboard = () => {
    if (isAuthenticated) {
      navigate(getDashboardPath());
    } else {
      navigate("/");
    }
  };

  const redirectToRoleSpecificPage = (page: string) => {
    if (isAuthenticated) {
      navigate(page);
    } else {
      navigate("/signin");
    }
  };

  return {
    redirectToDashboard,
    redirectToRoleSpecificPage,
  };
}; 