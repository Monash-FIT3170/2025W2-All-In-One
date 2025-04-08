import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { HomePage } from "../../ui-modules/home/HomePage";
import { BrowserRouter, Routes, Route } from "react-router";
import "./main.css";

Meteor.startup(initialiseReactRoot);

function initialiseReactRoot(): void {
  const container = document.getElementById("react-target");
  const root = createRoot(container);

  root.render(<AppRoot />);
}

function AppRoot(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
