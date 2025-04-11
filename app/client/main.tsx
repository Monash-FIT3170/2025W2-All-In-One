import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { ExampleHomePage } from "/ui-modules/home-example/ExampleHomePage";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "/app/store";

Meteor.startup(initialiseReactRoot);

function initialiseReactRoot(): void {
  const container = document.getElementById("react-target");
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
            <Route path="/test" element={<ExampleHomePage />} />
          </Routes>
        </BrowserRouter>
        
      </Provider>
    </React.StrictMode>
  );
}
