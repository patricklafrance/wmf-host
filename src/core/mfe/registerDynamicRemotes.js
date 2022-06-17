/*
Patch until we find a solution for https://stackoverflow.com/questions/72638378/module-federation-display-a-blank-page-for-a-few-seconds-when-a-remote-is-unavai
*/

import { registerModule } from "./registerModule";

function loadRemoteScript(url) {
    return new Promise((resolve, reject) => {
        const element = document.createElement("script");

        element.src = url;
        element.type = "text/javascript";
        element.async = true;

        let timeoutId;
        let hasCanceled = false;

        function cancel(error) {
            hasCanceled = true;

            element.parentElement.removeChild(element);
            reject(error);
        }

        element.onload = () => {
            clearTimeout(timeoutId);

            element.parentElement.removeChild(element);
            resolve();
        };

        element.onerror = (error) => {
            clearTimeout(timeoutId);
            cancel(error);
        };

        document.head.appendChild(element);

        // TODO: I don't know if it's a good idea, if a user experience latency we might cancel the loading of the remote even if the server is up.
        // Eagerly reject the loading of a script, it's too long when a remote is unavailable.
        timeoutId = setTimeout(() => {
            cancel(new Error("Remote script timeout."));
        }, 2000);
    });
}

/*
Remote:
{
    url: string
    containerName: string
    moduleName: string
}
*/

// Implementation of https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers.
async function loadDynamicRemote(url, containerName, moduleName) {
    await loadRemoteScript(url);

        // Initializes the share scope. It fills the scope with known provided modules from this build and all remotes.
        await __webpack_init_sharing__("default");

        // Retrieve the module federation container.
        const container = window[containerName]; 

        // Initialize the container, it may provide shared modules.
        await container.init(__webpack_share_scopes__.default);

        // Retrieve the module.
        const factory = await container.get(moduleName);

        if (!factory) {
            throw new Error(`Module ${moduleName} is not available.`);
        }

        return factory();
}

/*
RegistrationError:
{
    url: string
    containerName: string
    moduleName: string
    error: Error
}
*/

export async function registerDynamicRemotes(remotes) {
    const errors = [];

    await Promise.allSettled(remotes.map(async x => {
        try {
            const module = await loadDynamicRemote(x.url, x.containerName, x.moduleName);

            registerModule(module, `${x.containerName}/${x.moduleName}`);
        }
        catch (error) {
            errors.push({
                ...x,
                error
            })
        }
    }))

    return errors;
}