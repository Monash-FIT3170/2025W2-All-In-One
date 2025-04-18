import React from "react";
import { Container, createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { ExampleHomePage } from "/ui-modules/home-example/ExampleHomePage";
import { AboutPage } from "/ui-modules/about/AboutPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "/app/store";
import { BottomNavbar } from "../../ui-modules/shared/navigation-bars/BottomNavbar";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ExampleHomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/test" element={<ExampleHomePage />} />
          </Routes>

          <BottomNavbar />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
