import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { ShareGateTheme, ThemeProvider, createThemeVars } from "@sharegate/orbit-ui";
import { getNavigationItems, registerNavigationItem } from "@core/routing/navigationRegistry";
import { getRoutes, getRoutesByLayout, registerRoute, renderRoutes } from "@core/routing/routeRegistry";

import { Loader } from "@components/Loader";
import { NotFoundPage } from "@pages/NotFoundPage";
import { Page2 } from "@pages/Page2";
import { eventBus } from "@core/bus/eventBus";

const RegistrationStatus = {
    inProgress: "InProgress",
    completed: "Completed",
    failed: "Failed"
};

let registrationState = RegistrationStatus.inProgress;

function registerFragment(fragment) {
    if (!fragment.register) {
        throw new Error(`Cannot find a register function for fragment ${x}`);
    }

    fragment.register({
        registerRoute,
        registerNavigationItem,
        eventBus
    });
}

function start() {
    const fragmentPromises = [
        import("remote1/register").then(x => {
            registerFragment(x);
        })
    ];

    Promise.all(fragmentPromises)
        .then(() => {
            registrationState = RegistrationStatus.completed;
        })
        .catch((error) => {
            registrationState = RegistrationStatus.failed;

            console.log("Fragments registration failed with the following error:");
            console.log(error);
        });
}

start();

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

    // TEMP code to ensure a reload when the modules are registred.
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
            <div style="color: red;">Failed to register all fragments.</div>
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