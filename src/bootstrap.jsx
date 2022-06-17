import "@sharegate/orbit-ui/index.css";

import { App } from "./App";
import React from "react";
import { RegistrationStatus } from "./registrationStatus";
import { createRoot } from "react-dom/client";
import { registerDynamicRemotes } from "./core/mfe/registerDynamicRemotes";

const Remotes = [
    { 
        url: process.env.NODE_ENV === "development" ? "http://localhost:8081/remoteEntry.js" : "https://webpack-module-federation-poc-remote-1.netlify.app/remoteEntry.js",
        containerName: "remote1",
        moduleName: "./register" 
    }
]

// Using "window" is only a convenience hack, in Apricot, it would be done with the initialisation state available in the Redux store.
window.registrationState = RegistrationStatus.inProgress;

// registerRemotes({
//     onCompleted: () => {
//         window.registrationState = RegistrationStatus.completed;
//     }
// });

registerDynamicRemotes(Remotes).then(errors => {
    if (errors.length > 0) {
        console.error("Errors occured during remotes registration: ", errors);
    }

    window.registrationState = RegistrationStatus.completed;
});

const root = createRoot(document.getElementById("root"));

root.render(
    <App />
);
