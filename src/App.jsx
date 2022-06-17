import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { ShareGateTheme, ThemeProvider, createThemeVars } from "@sharegate/orbit-ui";
import { getNavigationItems, registerNavigationItem } from "@core/routing/navigationRegistry";
import { getRoutes, getRoutesByLayout, registerRoute, renderRoutes } from "@core/routing/routeRegistry";

import { Loader } from "@components/Loader";
import { NotFoundPage } from "@pages/NotFoundPage";
import { Page2 } from "@pages/Page2";
import { RegistrationStatus } from "./registrationStatus";

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

    // Perform a reload once the modules are registered.
    // Won't be necessary in Apricot as Redux will do this for us.
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (window.registrationState !== RegistrationStatus.inProgress) {
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

    console.log("registration state: ", window.registrationState);
    console.log("registered routed: ", getRoutes());
    console.log("registered routed by layouts: ", getRoutesByLayout());
    console.log("registered navigation items: ", getNavigationItems());

    if (window.registrationState === RegistrationStatus.inProgress) {
        return <Loader />;
    }

    if (window.registrationState === RegistrationStatus.failed) {
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