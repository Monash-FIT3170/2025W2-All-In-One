import React from "react";
import { Container, createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { ExampleHomePage } from "./ui-modules/home-example/ExampleHomePage";
import { GuestLandingPage } from "./ui-modules/guest-landing-page/GuestLandingPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { DraftListingPage } from "./ui-modules/property-listing/DraftListingPage";
import { DefaultTheme } from "./ui-modules/theming/themes/DefaultTheme";
<<<<<<< HEAD
import { AgentDashboard } from "./ui-modules/agent-dashboard/pages/AgentDashboard";
=======
import { BottomNavbar } from "./ui-modules/navigation-bars/BottonNavbar";
>>>>>>> 281d9377111a8f3fc64bbb6487ee9ebb9ac1151c

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
              <Route path="/test" element={<DraftListingPage />} />
<<<<<<< HEAD
              <Route path ="/agent-dashboard" element={<AgentDashboard />} />
=======
              <Route path="/home-example" element={<ExampleHomePage />} />
>>>>>>> 281d9377111a8f3fc64bbb6487ee9ebb9ac1151c
            </Routes>
            <BottomNavbar />
          </BrowserRouter>
        </DefaultTheme>
<<<<<<< HEAD

=======
>>>>>>> 281d9377111a8f3fc64bbb6487ee9ebb9ac1151c
      </Provider>
    </React.StrictMode>
  );
}
