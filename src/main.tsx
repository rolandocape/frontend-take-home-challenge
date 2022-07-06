import React from "react";
import ReactDOM from "react-dom/client";
import { VanillaApp } from "./challenge-1-vanilla";
import FunctionalComp from "./challenge-2-ReactFunctionalComp";
import ClassComp from "./challenge-3-ReactClassComp";
import "./index.css";

(async () => {
  await VanillaApp.initialize();
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FunctionalComp />
    <ClassComp />
  </React.StrictMode>
);
