/*
Currently not working because of https://stackoverflow.com/questions/72638378/module-federation-display-a-blank-page-for-a-few-seconds-when-a-remote-is-unavai
*/

import { registerModule } from "./registerModule";

export function registerRemotes({ onCompleted }) {
    import("remote1/register")
        .then(module => { registerModule(module, "remote1/register") })
        .finally(() => { onCompleted(); });
}