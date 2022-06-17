const registry = [];

/*
Item:
{
    to: string
    displayName: string
    priority: number
    nestedItems: Omit<Item, "priority" | nestedItems>[]
}
*/

export function registerNavigationItem({ priority = 1, ...item }) {
    registry.push({
        ...item,
        priority
    });

    // Higher priority number should be rendered before.
    registry.sort((x, y) => {
        if (x.priority > y.priority) {
            return -1
        } else if (x.priority !== y.priority) {
            return 1;
        }

        return 0;
    })
}

export function getNavigationItems() {
    return registry;
}