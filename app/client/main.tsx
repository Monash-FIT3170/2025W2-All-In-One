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
import { BottomNavbar } from "./ui-modules/navigation-bars/BottonNavbar";
import { PropertyListingPage } from "/app/client/ui-modules/property-listing-page/PropertyListingPage";
import TenantDashboard from "./ui-modules/tenant-dashboard/pages/TenantDashboard";

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
              <Route path="/test" element={<PropertyListingPage />} />
              <Route path="/home-example" element={<ExampleHomePage />} />
              <Route path="/tenant-dashboard" element={<TenantDashboard />} />
            </Routes>
            <BottomNavbar />
          </BrowserRouter>
        </DefaultTheme>

      </Provider>
    </React.StrictMode>
  );
}
