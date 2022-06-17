import { eventBus } from "@core/bus/eventBus";
import { registerNavigationItem } from "@core/routing/navigationRegistry";
import { registerRoute } from "@core/routing/routeRegistry";

const registrationContext = {
    registerRoute,
    registerNavigationItem,
    eventBus
};

export function registerModule(moduleInstance, moduleName) {
    if (!moduleInstance.register) {
        throw new Error(`Cannot find a "register" function for remote module ${moduleName}`);
    }

    moduleInstance.register(registrationContext);
}