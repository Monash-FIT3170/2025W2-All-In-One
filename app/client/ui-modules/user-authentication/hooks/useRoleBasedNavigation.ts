import { useAppSelector } from "../../../store";
import { Role } from "/app/shared/user-role-identifier";
import { NavigationPath } from "/app/client/navigation";

export const useRoleBasedNavigation = () => {
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  const isAuthenticated = !!authUser;

  const getDashboardPath = (): string => {
    if (!isAuthenticated) return NavigationPath.Home;

    const roleDashboardMap: Record<Role, string> = {
      [Role.AGENT]: NavigationPath.AgentDashboard,
      [Role.TENANT]: NavigationPath.TenantDashboard,
      [Role.LANDLORD]: NavigationPath.LandlordDashboard,
    };

    return roleDashboardMap[authUser.role] || NavigationPath.Home;
  };

  const getCalendarPath = (): string => {
    if (!isAuthenticated) return NavigationPath.Home;

    const roleCalendarMap: Record<Role, string> = {
      [Role.AGENT]: NavigationPath.AgentCalendar,
      [Role.TENANT]: NavigationPath.TenantCalendar,
      [Role.LANDLORD]: NavigationPath.LandlordCalendar,
    };

    return roleCalendarMap[authUser.role] || NavigationPath.Home;
  };

  const getMessagesPath = (): string => {
    if (!isAuthenticated) return NavigationPath.Home;

    const roleMessagesMap: Record<Role, string> = {
      [Role.AGENT]: NavigationPath.AgentMessages,
      [Role.TENANT]: NavigationPath.TenantMessages,
      [Role.LANDLORD]: NavigationPath.LandlordMessages,
    };

    return roleMessagesMap[authUser.role] || NavigationPath.Home;
  };

  return {
    isAuthenticated,
    getDashboardPath,
    getCalendarPath,
    getMessagesPath,
  };
};
