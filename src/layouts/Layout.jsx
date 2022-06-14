import "./Layout.css";

import { Button, Counter, Div, H1, Inline, LI, Nav, UL, useColorSchemeContext } from "@sharegate/orbit-ui";
import React, { Suspense, useCallback, useEffect, useState } from "react";

import { Loader } from "@components/Loader";
import { Outlet } from "react-router-dom";
import { RouterLink } from "@components/RouterLink";
import { eventBus } from "@core/bus/eventBus";
import { getNavigationItems } from "@core/routing/navigationRegistry";

function IncrementalCounter() {
  const [count, setCount] = useState(0);

  const onIncrement = useCallback(() => {
    setCount(x => x + 1);
  }, [setCount]);

  useEffect(() => {
    eventBus.addListener("increment", onIncrement);

    return () => {
      eventBus.removeListener("increment", onIncrement);
    }
  }, []);

  return (
    <Counter className="counter" variant="divider" size="5xl">{count}</Counter>
  )
}

function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useColorSchemeContext();

  const handleClick = useCallback(() => {
      setColorScheme(colorScheme === "light" ? "dark" : "light");
  }, [colorScheme, setColorScheme]);

  return (
      <Button variant="secondary" onClick={handleClick}>
          Toggle
      </Button>
  );
}

export function Layout() {
  const navigationItems = getNavigationItems();

  return (
      <Div backgroundColor="alias-default">
        <Inline alignY="center">
          <H1>This is the host application</H1>
          <IncrementalCounter />
          <ColorSchemeToggle />
        </Inline>
        <Nav>
          <UL>
            {navigationItems.map(x => (
              <LI key={x.to}>
                <RouterLink to={x.to}>{x.displayName}</RouterLink>
                {x.nestedItems && x.nestedItems.length > 0 && (
                  <UL>
                    {x.nestedItems.map(y => (
                      <LI key={y.to}>
                        <RouterLink to={y.to}>{y.displayName}</RouterLink>
                      </LI>
                    ))}
                  </UL>
                )}
              </LI>
            ))}
          </UL>
        </Nav>
        <Suspense fallback={<Loader message="Loading from layout..." />}>
          <Outlet />
        </Suspense>
      </Div>
  );
};
