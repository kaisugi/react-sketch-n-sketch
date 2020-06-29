import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ZeitProvider } from "@zeit-ui/react";

ReactDOM.render(
  <ZeitProvider> 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ZeitProvider>,
  document.getElementById("root")
);
