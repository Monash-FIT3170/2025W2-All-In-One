import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { GuestLandingPage } from "./ui-modules/guest-landing-page/GuestLandingPage";
import { ExampleHomePage } from "./ui-modules/home-example/ExampleHomePage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "././store";
import { BottomNavbar } from "./ui-modules/navigation-bars/BottomNavbar";
import { DraftListingPage } from "./ui-modules/property-listing/DraftListingPage";
import { DefaultTheme } from "./ui-modules/theming/themes/DefaultTheme";

Meteor.startup(initialiseReactRoot);

function initialiseReactRoot(): void {
  const container = document.getElementById("react-target");
  if (!container) {
    throw new Error("React root container 'react-target' not found in HTML");
  }
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
            <Route path="/home-example" element={<ExampleHomePage />} />
            <Route path="/test" element={<DraftListingPage />} />
          </Routes>

          <BottomNavbar />
        </BrowserRouter>
        </DefaultTheme>
      </Provider>
    </React.StrictMode>
  );
}
