export enum NavigationPath {
  Home = "/",
  AgentDashboard = "/agent-dashboard",
  AgentProperties = "/agent-properties",
  AgentCalendar = "/agent-calendar",
  AgentMessages = "/agent-messages",
  AgentTasks = "/agent-tasks",
  AgentDocuments = "/agent-documents",
  LandlordDashboard = "/landlord-dashboard",
  LandlordProperties = "/landlord-properties",
  LandlordPropertyDetail = "/landlord-property-detail",
  LandlordCalendar = "/landlord-calendar",
  LandlordDocuments = "/landlord-documents",
  LandlordTasks = "/landlord-tasks",
  LandlordMessages = "/landlord-messages",
  PropertyListing = "/property-listing",
  Search = "/search",
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
  home: NavigationPath.Home,
  "agent-dashboard": NavigationPath.AgentDashboard,
  "agent-properties": NavigationPath.AgentProperties,
};

export type EntryPoint = keyof typeof BACK_ROUTES;
