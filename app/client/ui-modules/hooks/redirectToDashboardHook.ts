import { useNavigate } from "react-router";

export function useRedirectToDashboard() {
  const navigate = useNavigate();
  
  return (role: string) => {
    const roleRouteMap: Record<string, string> = {
      agent: "/agent-dashboard",
      tenant: "/tenant-dashboard",
      landlord: "/landlord-dashboard",
    };

    const path = roleRouteMap[role || ""] || "/";
    navigate(path);
  };
}