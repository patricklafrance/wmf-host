import "@sharegate/orbit-ui/index.css";

import { App } from "./App";
import React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

// console.log("**** Root element: ", root);

function RootComponent() {
    // console.log("**** Rendering Root component.")

    return <App />;
}

root.render(
    <RootComponent />
);
