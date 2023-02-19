import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import "./fonts/Myra4FCaps-Regular.ttf";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById("root")
);

serviceWorkerRegistration.register();
