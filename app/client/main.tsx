import React from "react";
import { Container, createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { GuestLandingPage } from "./ui-modules/guest-landing-page/GuestLandingPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store, useAppSelector } from "./store";
import { DefaultTheme } from "./ui-modules/theming/themes/DefaultTheme";
import { AgentDashboard } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentDashboard";
import { AgentCalendar } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentCalendar";
import { AgentMessage } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentMessage";
import { AgentTask } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentTask";
import { AgentProperty } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentProperty";
import { LandlordDashboard } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordDashboard";
import { LandlordCalendar } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordCalendar";
import { LandlordTask } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordTask";
import { LandlordProperty } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordProperty";
import { BottomNavbar } from "./ui-modules/navigation-bars/BottonNavbar";
import { PropertyListingPage } from "/app/client/ui-modules/property-listing-page/PropertyListingPage";
import { SettingsPage } from "./ui-modules/settings-page/SettingsPage";
import { PropertyFormPage } from "./ui-modules/property-form-agent/PropertyFormPage";
import { AuthTabs } from "./ui-modules/user-authentication/AuthTabs";
import TenantDashboard from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantDashboard";
import TenantProperty from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantProperty";
import { TenantCalendar } from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantCalender";
import TenantMaintenance from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantMaintenance";
import TenantMessages from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantMessages";
import TenantDocument from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantDocument";
import TenantSearchProperties from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantSearchProperties";
import { ProfilePage } from "./ui-modules/profiles/ProfilePage";
import { TopNavbar } from "./ui-modules/navigation-bars/TopNavbar";
import { RoleSideNavBar } from "./ui-modules/navigation-bars/side-nav-bars/SideNavbar";

import { Role } from "../shared/user-role-identifier";
import {
  agentDashboardLinks,
  landlordDashboardLinks,
  tenantDashboardLinks,
  settingLinks,
} from "./ui-modules/navigation-bars/side-nav-bars/side-nav-link-definitions";

Meteor.startup(initialiseReactRoot);

function initialiseReactRoot(): void {
  const container = document.getElementById("react-target") as Container;
  const root = createRoot(container);

  root.render(
    // moving the store redux setup to this level so can be used for current user info
    <React.StrictMode>
      <Provider store={store}>
        <AppRoot />
      </Provider>
    </React.StrictMode>
  );
}

function AppRoot(): React.JSX.Element {
  // side bar logics to be handled on top level to ensure its consistent across all pages
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  let dashboardLinks: { to: string; label: string; }[] = [];
  if (authUser?.role === Role.AGENT) {
    dashboardLinks = agentDashboardLinks;
  } else if (authUser?.role === Role.LANDLORD) {
    dashboardLinks = landlordDashboardLinks;
  } else if (authUser?.role === Role.TENANT) {
    dashboardLinks = tenantDashboardLinks;
  }
  return (
    <DefaultTheme>
      <BrowserRouter>
        <TopNavbar onSideBarOpened={setIsSidebarOpen} />
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          dashboardLinks={dashboardLinks}
          settingsLinks={settingLinks}
        />
        <Routes>
          <Route path="/" element={<GuestLandingPage />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/agent-properties" element={<AgentProperty />} />
          <Route path="/agent-calendar" element={<AgentCalendar />} />
          <Route path="/agent-messages" element={<AgentMessage />} />
          <Route path="/agent-tasks" element={<AgentTask />} />
          <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          <Route path="/landlord-properties" element={<LandlordProperty />} />
          <Route path="/landlord-calendar" element={<LandlordCalendar />} />
          <Route path="/landlord-tasks" element={<LandlordTask />} />
          <Route path="/test" element={<PropertyListingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/propertyform" element={<PropertyFormPage />} />
          <Route path="/login" element={<AuthTabs initialTab="login" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<AuthTabs initialTab="signup" />} />
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          <Route path="/tenant-property" element={<TenantProperty />} />
          <Route path="/tenant-calendar" element={<TenantCalendar />} />
          <Route path="/tenant-maintenance" element={<TenantMaintenance />} />
          <Route path="/tenant-messages" element={<TenantMessages />} />
          <Route path="/tenant-documents" element={<TenantDocument />} />
          <Route
            path="/tenant-search-properties"
            element={<TenantSearchProperties />}
          />
        </Routes>
        <BottomNavbar />
      </BrowserRouter>
    </DefaultTheme>
  );
}
