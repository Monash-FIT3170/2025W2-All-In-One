import React from "react";
import { Container, createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { ExampleHomePage } from "/ui-modules/home-example/ExampleHomePage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "/app/store";
import { DraftListingPage } from "/ui-modules/draft-listing/DraftListingPage";
import { DefaultTheme } from "/library-modules/theming/themes/DefaultTheme";

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
              <Route path="/" element={<ExampleHomePage />} />
              <Route path="/test" element={<DraftListingPage />} />
            </Routes>
          </BrowserRouter>

        </DefaultTheme>
      
      </Provider>
    </React.StrictMode>
  );
}
