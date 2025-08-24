export enum NavigationPath {
  Home = "/",
  AgentDashboard = "/agent-dashboard",
  AgentProperties = "/agent-properties",
  AgentCalendar = "/agent-calendar",
  AgentMessages = "/agent-messages",
  AgentTasks = "/agent-tasks",
  LandlordDashboard = "/landlord-dashboard",
  LandlordProperties = "/landlord-properties",
  LandlordCalendar = "/landlord-calendar",
  LandlordTasks = "/landlord-tasks",
  PropertyListing = "/property-listing",
  Settings = "/settings",
  PropertyForm = "/propertyform",
  Signin = "/signin",
  Profile = "/profile",
  Signup = "/signup",
  TenantDashboard = "/tenant-dashboard",
  TenantProperty = "/tenant-property",
  TenantCalendar = "/tenant-calendar",
  TenantMaintenance = "/tenant-maintenance",
  TenantMessages = "/tenant-messages",
  TenantDocuments = "/tenant-documents",
  TenantSearchProperties = "/tenant-search-properties",
}

export const BACK_ROUTES = {
  "home": NavigationPath.Home,
  "agent-dashboard": NavigationPath.AgentDashboard,
  "agent-properties": NavigationPath.AgentProperties,
};

export type EntryPoint = keyof typeof BACK_ROUTES;