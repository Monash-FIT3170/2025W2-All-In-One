import React, { useEffect } from "react";
import { Container, createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store";
import { DefaultTheme } from "./ui-modules/theming/themes/DefaultTheme";

import { GuestLandingPage } from "./ui-modules/guest-landing-page/GuestLandingPage";
import { AgentDashboard } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentDashboard";
import { AgentCalendar } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentCalendar";
import { AgentMessagePage } from "./ui-modules/role-messages/AgentMessagePage";
import { AgentTask } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentTask";
import { AgentProperty } from "./ui-modules/role-dashboard/agent-dashboard/pages/AgentProperty";
import { LandlordDashboard } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordDashboard";
import { LandlordCalendar } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordCalendar";
import { LandlordTask } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordTask";
import { LandlordProperties } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordProperties";
import { LandlordPropertyDetail } from "./ui-modules/role-dashboard/landlord-dashboard/pages/LandlordPropertyDetail";
import { LandlordMessagePage } from "./ui-modules/role-messages/LandlordMessagePage";
import { BottomNavbar } from "./ui-modules/navigation-bars/BottomNavbar";
import { TopNavbar } from "./ui-modules/navigation-bars/TopNavbar";
import { RoleSideNavBar } from "./ui-modules/navigation-bars/side-nav-bars/SideNavbar";
import { PropertyListingPage } from "/app/client/ui-modules/property-listing-page/PropertyListingPage";
import { SettingsPage } from "./ui-modules/settings-page/SettingsPage";
import { PropertyFormPage } from "./ui-modules/property-form-agent/PropertyFormPage";
import { AuthTabs } from "./ui-modules/user-authentication/AuthTabs";
import TenantDashboard from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantDashboard";
import { TenantProperty } from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantProperty";
import { TenantCalendar } from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantCalendar";
import TenantMaintenance from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantMaintenance";
import { TenantMessagePage } from "./ui-modules/role-messages/TenantMessagePage";
import TenantDocument from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantDocument";
import TenantSearchProperties from "./ui-modules/role-dashboard/tenant-dashboard/pages/TenantSearchProperties";
import { ProfilePage } from "./ui-modules/profiles/ProfilePage";
import { loadCurrentUser } from "./ui-modules/user-authentication/state/reducers/current-user-slice";
import {
  AgentRoute,
  TenantRoute,
  LandlordRoute,
  AuthenticatedRoute,
} from "./ui-modules/user-authentication/components/RouteGuards";
import { NavigationPath } from "./navigation";
import { GuestSearchResultsPage } from "./ui-modules/search/SearchResultPage";

Meteor.startup(initialiseReactRoot);

function initialiseReactRoot(): void {
  const container = document.getElementById("react-target") as Container;
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AppRoot />
      </Provider>
    </React.StrictMode>
  );
}

function AppRoot(): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userId = Meteor.userId();
    if (userId) {
      dispatch(loadCurrentUser(userId));
    }
  }, [dispatch]);

  return (
    <DefaultTheme>
      <BrowserRouter>
        <TopNavbar onSideBarOpened={setIsSidebarOpen} />
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <Routes>
          {/* Public routes */}
          <Route path={NavigationPath.Home} element={<GuestLandingPage />} />
          <Route
            path={NavigationPath.Signin}
            element={<AuthTabs initialTab={NavigationPath.Signin} />}
          />
          <Route
            path={NavigationPath.Signup}
            element={<AuthTabs initialTab={NavigationPath.Signup} />}
          />
          <Route
            path={NavigationPath.PropertyListing}
            element={<PropertyListingPage />}
          />

          {/* Search routes */}
          <Route
            path={NavigationPath.Search}
            element={<GuestSearchResultsPage />}
          />

          {/* Agent-only routes */}
          <Route
            path={NavigationPath.AgentDashboard}
            element={
              <AgentRoute>
                <AgentDashboard />
              </AgentRoute>
            }
          />
          <Route
            path={NavigationPath.AgentProperties}
            element={
              <AgentRoute>
                <AgentProperty />
              </AgentRoute>
            }
          />
          <Route
            path={NavigationPath.AgentCalendar}
            element={
              <AgentRoute>
                <AgentCalendar />
              </AgentRoute>
            }
          />
          <Route
            path={NavigationPath.AgentMessages}
            element={
              <AgentRoute>
                <AgentMessagePage />
              </AgentRoute>
            }
          />
          <Route
            path={NavigationPath.AgentTasks}
            element={
              <AgentRoute>
                <AgentTask />
              </AgentRoute>
            }
          />
          {/* Agent and Landlord routes */}
          <Route
            path={NavigationPath.PropertyForm}
            element={
              <AgentRoute>
                <PropertyFormPage />
              </AgentRoute>
            }
          />

          {/* Landlord-only routes */}
          <Route
            path={NavigationPath.LandlordDashboard}
            element={
              <LandlordRoute>
                <LandlordDashboard />
              </LandlordRoute>
            }
          />
          <Route
            path={NavigationPath.LandlordProperties}
            element={
              <LandlordRoute>
                <LandlordProperties />
              </LandlordRoute>
            }
          />
          <Route
            path={NavigationPath.LandlordCalendar}
            element={
              <LandlordRoute>
                <LandlordCalendar />
              </LandlordRoute>
            }
          />
          <Route
            path={NavigationPath.LandlordTasks}
            element={
              <LandlordRoute>
                <LandlordTask />
              </LandlordRoute>
            }
          />
          <Route
            path={NavigationPath.LandlordMessages}
            element={
              <LandlordRoute>
                <LandlordMessagePage />
              </LandlordRoute>
            }
          />
          <Route
            path={NavigationPath.LandlordPropertyDetail}
            element={
              <LandlordRoute>
                <LandlordPropertyDetail />
              </LandlordRoute>
            }
          />

          {/* Tenant-only routes */}
          <Route
            path={NavigationPath.TenantDashboard}
            element={
              <TenantRoute>
                <TenantDashboard />
              </TenantRoute>
            }
          />
          <Route
            path={NavigationPath.TenantProperty}
            element={
              <TenantRoute>
                <TenantProperty />
              </TenantRoute>
            }
          />
          <Route
            path={NavigationPath.TenantCalendar}
            element={
              <TenantRoute>
                <TenantCalendar />
              </TenantRoute>
            }
          />
          <Route
            path={NavigationPath.TenantMaintenance}
            element={
              <TenantRoute>
                <TenantMaintenance />
              </TenantRoute>
            }
          />
          <Route
            path={NavigationPath.TenantMessages}
            element={
              <TenantRoute>
                <TenantMessagePage />
              </TenantRoute>
            }
          />
          <Route
            path={NavigationPath.TenantDocuments}
            element={
              <TenantRoute>
                <TenantDocument />
              </TenantRoute>
            }
          />
          <Route
            path={NavigationPath.TenantSearchProperties}
            element={
              <TenantRoute>
                <TenantSearchProperties />
              </TenantRoute>
            }
          />

          {/* Authenticated user routes */}
          <Route
            path={NavigationPath.Settings}
            element={
              <AuthenticatedRoute>
                <SettingsPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path={NavigationPath.Profile}
            element={
              <AuthenticatedRoute>
                <ProfilePage />
              </AuthenticatedRoute>
            }
          />
        </Routes>
        <BottomNavbar />
      </BrowserRouter>
    </DefaultTheme>
  );
}
