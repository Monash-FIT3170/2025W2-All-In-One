import { useAppSelector } from "../../../store";
import { Role } from "/app/shared/user-role-identifier";
import { NavigationPath } from "/app/client/navigation";

export const useRoleBasedNavigation = () => {
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  const isAuthenticated = !!authUser;
  const userRole = authUser?.role;

  const canAccessRoute = (allowedRoles: Role[]): boolean => {
    if (!isAuthenticated) return false;
    return allowedRoles.includes(userRole!);
  };

  const getDashboardPath = (): string => {
    if (!isAuthenticated) return "/";
    
    const roleDashboardMap: Record<Role, string> = {
      [Role.AGENT]: NavigationPath.AgentDashboard,
      [Role.TENANT]: NavigationPath.TenantDashboard,
      [Role.LANDLORD]: NavigationPath.LandlordDashboard,
    };

    return roleDashboardMap[userRole!] || NavigationPath.Home;
  };

  const isAgent = userRole === Role.AGENT;
  const isTenant = userRole === Role.TENANT;
  const isLandlord = userRole === Role.LANDLORD;

  return {
    isAuthenticated,
    userRole,
    canAccessRoute,
    getDashboardPath,
    isAgent,
    isTenant,
    isLandlord,
  };
}; 