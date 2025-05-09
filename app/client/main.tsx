import React from "react";
import { Container, createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { ExampleHomePage } from "./ui-modules/home-example/ExampleHomePage";
import { GuestLandingPage } from "./ui-modules/guest-landing-page/GuestLandingPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
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

Meteor.startup(initialiseReactRoot);

function initialiseReactRoot(): void {
  const container = document.getElementById("react-target") as Container;
  const root = createRoot(container);

  root.render(<AppRoot />);
}

function AppRoot(): React.JSX.Element {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <DefaultTheme>
          <BrowserRouter>
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
              <Route path="/home-example" element={<ExampleHomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<ExampleHomePage />} />
              <Route path="/propertyform" element={<PropertyFormPage />} />
              <Route path="/login" element={<AuthTabs initialTab="login" />} />
              <Route path="/signup" element={<AuthTabs initialTab="signup" />} />
            </Routes>
            <BottomNavbar />
          </BrowserRouter>
        </DefaultTheme>

      </Provider>
    </React.StrictMode>
  );
}
