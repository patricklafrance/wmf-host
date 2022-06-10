import { H2 } from "@sharegate/orbit-ui";
import React from "react";
import { RouterLink } from "@components/RouterLink";

export function NotFoundPage() {
    return (
        <main>
            <H2>404</H2>
            <RouterLink to="/">Go Back</RouterLink>
        </main>
    );
}