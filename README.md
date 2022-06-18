# wmf-host

This is a POC of a micro-frontend application with [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/). This POC include an host application and a single [remote application](https://github.com/patricklafrance/wmf-remote-1) which is integrated at runtime with module federation.

The objective is to demonstrate that:

- Webpack Module Federation works
- I could create a shell application in which remote applications could be 100% standalone, meaning they don't require any specific code other than their URL to be included in the host application (no static menu links, router routes, etc...)
- An host could be developed without having to start the remotes
- A remote could be developed without having to integrate with the host app

Each remote expose a `register` function which is called at startup by the host application and receive a context including `registerRoute`, `registerNavigationItem` functions and an `eventBus`.

A remote register dynamically his routes and menu items during the startup and becomes a part of the application. Pages of the remotes can then be accessed from the main navigation of the host application.

A remote even have the option to opt out of the default host layout and provide his own for a specific route.

To communicate with the host or the other remotes, a remote can use the `eventBus`.

A working release of this repository is available on [Netlify](https://weback-module-federation-poc-host.netlify.app/).

## Installation

Install with `yarn install`

Then start with `yarn dev`

Make sure you also install and start the [remote project](https://github.com/patricklafrance/wmf-remote-1).

## Todo
- Integration with React error boundaries
- Support a Next.js remote

## Works
- Local dev experience for a specific fragment without having to start the host app
- Register dynamic routes
- Lazy load components from dynamically registered routes
- Load css styles from a remote
- Override page layout from a remote
- Share services between remotes
- Webpack devserver hot reload
- Orbit
- Webpack alias
- Deploy in production

## Remaining concerns
- Doesn't seem to support React fast-refresh.
- When using the default remotes configuration, a blank plage is displayed until the remote script fail to load. For more info view this post on [StackOverflow](overflow.com/questions/72638378/module-federation-display-a-blank-page-for-a-few-seconds-when-a-remote-is-unavai).

## Best practices

- Always keep your shared dependencies on the same versions on host and remotes

## Gotchas

To fix the following error:
react_devtools_backend.js:4026 Warning: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app

Add react & react-dom as shared dependencies

See: https://github.com/styled-components/styled-components/issues/3302

To fix the following error:
Uncaught Error: Shared module is not available for eager consumption

Add a bootstrap file and and load it with a dynamic import from index.js

See: https://www.linkedin.com/pulse/uncaught-error-shared-module-available-eager-rany-elhousieny-phd%E1%B4%AC%E1%B4%AE%E1%B4%B0/

## Why module federation vs other MF solutions?

- Available out of the box with Webpack, no custom code to write
- Shared dependencies management handled at the bundler level
- Works with Next.js
