import { Layout } from "@layouts/Layout";
import React from "react";
import { Route } from "react-router-dom";

const registry = [];

/*
{
    path: string
    element: ReactElement
    routes: Omit<Route, | "layout">[]
}
*/
const routesByLayout = [{
    path: "/",
    element: <Layout />,
    routes: []
}];

/*
Layout:
{
    path: string
    element: ReactElement
}

Route:
{
    path: string
    element: ReactElement
    isIndex: bool
    layout: string | Layout
    nestedRoutes: Route[]
}
*/

function getLayout(path) {
    return routesByLayout.find(x => x.path === path);
}

export function registerRoute({ layout, ...route }) {
    registry.push(route);

    if (layout) {
        const existingLayout = getLayout(layout.path);

        if (existingLayout) {
            existingLayout.routes.push(route);
        } else {
            routesByLayout.push({
                ...layout,
                routes: [route]
            });
        }
    } else {
        getLayout("/").routes.push(route);
    }
}

export function getRoutes() {
    return registry;
}

export function getRoutesByLayout() {
    return routesByLayout;
}

export function renderRoutes() {
    return routesByLayout.map(x => (
        <Route path={x.path} element={x.element} key={x.path}>
            {x.routes.map(y => (
                <Route path={y.isIndex ? undefined : y.path} element={y.element} index={y.isIndex} key={y.isIndex ? "index" : y.path} />
            ))}
        </Route>
    ));
}