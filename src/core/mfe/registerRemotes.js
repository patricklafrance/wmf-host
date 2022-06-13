import { eventBus } from "@core/bus/eventBus";
import { registerNavigationItem } from "@core/routing/navigationRegistry";
import { registerRoute } from "@core/routing/routeRegistry";

const registrationContext = {
    registerRoute,
    registerNavigationItem,
    eventBus
};

export function registerRemotes({ onCompleted }) {
    import("remote1/register")
        .then(module => {
            if (!module.register) {
                throw new Error(`Cannot find a "register" function for remote ${x}`);
            }
        
            module.register(registrationContext);
        })
        .finally(() => {
            onCompleted();
        });
}