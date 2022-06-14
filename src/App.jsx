import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { ShareGateTheme, ThemeProvider, createThemeVars } from "@sharegate/orbit-ui";
import { getNavigationItems, registerNavigationItem } from "@core/routing/navigationRegistry";
import { getRoutes, getRoutesByLayout, registerRoute, renderRoutes } from "@core/routing/routeRegistry";

import { Loader } from "@components/Loader";
import { NotFoundPage } from "@pages/NotFoundPage";
import { Page2 } from "@pages/Page2";
import { registerRemotes } from "@core/mfe/registerRemotes";

const RegistrationStatus = {
    inProgress: "InProgress",
    completed: "Completed"
};

let registrationState = RegistrationStatus.inProgress;

registerRemotes({
    onCompleted: () => {
        registrationState = RegistrationStatus.completed;
    }
});

// allSettled

/////////////////////////////////////

// function loadDynamicScript(url) {
//     return new Promise((resolve, reject) => {
//         const element = document.createElement("script");

//         element.src = url;
//         element.type = "text/javascript";
//         element.async = true;

//         element.onload = () => {
//             element.parentElement.removeChild(element);
//             resolve();
//         };

//         // TODO: se a setTimeout to eagerly reject, it's too long.
//         element.onerror = (error) => {
//             element.parentElement.removeChild(element);
//             reject(error);
//         };

//         document.head.appendChild(element);
//     });
// }

// // TODO: DO ALL THIS IN PROMISE INSTEAD
// async function loadRemoteFragment(url, scope, module) {
//     try {
//         await loadDynamicScript(url);

//         return async () => {
//             // Initializes the share scope. This fills it with known provided modules from this build and all remotes
//             await __webpack_init_sharing__("default");
    
//             const container = window[scope]; 
    
//             // Initialize the container, it may provide shared modules.
//             await container.init(__webpack_share_scopes__.default);
    
//             const factory = await window[scope].get(module);
    
//             const Module = factory();
    
//             return Module;
//         };
//     }
//      catch (e) {
//         return Promise.reject();
//      }
// }

// // TODO: DO ALL THIS IN PROMISE INSTEAD
// async function start() {
//     try {
//         const module = await loadRemoteFragment("http://localhost:8081/remoteEntry.js", "remote1", "./register");

//         module()
//         .then(x => { 
//             console.log("Resolved remote module: ", x);

//             x.register({
//                 registerRoute,
//                 registerNavigationItem,
//                 eventBus
//             });

//             registrationState = RegistrationStatus.completed;
//         })
//         .catch(x => { console.log("Remote module loading failed: ", x) });
//     }
//     catch (e) {
//         console.log("loading failed");
//         registrationState = RegistrationStatus.completed;
//     }
// }

// start();

/////////////////////////////////////

const HomePage = lazy(() => import("@pages/HomePage"));
const Page1 = lazy(() => import("@pages/Page1"));

registerRoute({ path: "/", isIndex: true, element: <HomePage /> });
registerRoute({ path: "page-1", element: <Page1 />});
registerRoute({ path: "page-2", element: <Page2 /> });

registerNavigationItem({ to: "/", displayName: "Home" });
registerNavigationItem({ to: "page-1", displayName: "Lazy loaded page from host" });
registerNavigationItem({ to: "page-2", displayName: "Regular host page" });

createThemeVars([ShareGateTheme]);

function useRerenderOnRegistrationCompletion() {
    const [_, completed] = useState(false);

    // TEMP: perform a reload once the modules are registred.
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (registrationState !== RegistrationStatus.inProgress) {
                clearInterval(intervalId);
                completed(true);
            }
        }, 10);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, []);
}

export function App() {
    // const registrationStatus = useState(RegistrationStatus.inProgress);


    // let registrationStatus = RegistrationStatus.inProgress;
    
    // useEffect(() => {

    // }, []);
    
    // registerRemotes({
    //     onCompleted: () => {
    //         registrationState = RegistrationStatus.completed;
    //     }
    // });

    useRerenderOnRegistrationCompletion();

    console.log("registration state: ", registrationState);
    console.log("registered routed: ", getRoutes());
    console.log("registered routed by layouts: ", getRoutesByLayout());
    console.log("registered navigation items: ", getNavigationItems());

    if (registrationState === RegistrationStatus.inProgress) {
        return <Loader />;
    }

    if (registrationState === RegistrationStatus.failed) {
        return (
            <div style={{ color: "red" }}>Failed to register all fragments.</div>
        )
    }

    return (
        <ThemeProvider theme={ShareGateTheme} colorScheme="light">
            <BrowserRouter>
                <Suspense fallback={<Loader message="Loading from root..." />}>
                    <Routes>
                        {renderRoutes()}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ThemeProvider>
    );
}