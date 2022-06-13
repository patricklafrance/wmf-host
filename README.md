## Todo
- Test in release
- Optimize bundles, they should be < 5k
- Eager load bundles for registration functions instead of dynamically loading them?
- Handle fragments loading errors
- Integration with error boundaries
- Next JS fragment

## Works
- Local dev experience for a specific fragment without having to start the host app
- Register dynamic routes
- Lazy load components from dynamically registered routes
- Load css styles from fragments
- Override page layout from fragments
- Share services between fragments
- Webpack devserver hot reload
- Orbit
- Webpack alias

## Remaining concerns
- Why do I have to specified the shared dependencies in host AND fragments? What happens if the deps version diverge between the host & the fragments?
- WMF doesn't support fast-refresh?
- For a react app when a remote is not available, the webpack devserver will wait for the network request to timeout before calling index.js

## Best practices

- Always keep your shared dependencies on the same versions on host and fragments

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
- Shared dependencies management handled at bundler level
- Works with next.js