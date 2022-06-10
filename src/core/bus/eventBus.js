import { EventEmitter } from "eventemitter3";

class EventBus {
    #eventEmitter;

    constructor() {
        this.#eventEmitter = new EventEmitter();
    }

    addListener(eventName, callback) {
        this.#eventEmitter.addListener(eventName, callback);
    }

    removeListener(eventName, callback) {
        this.#eventEmitter.removeListener(eventName, callback);
    }

    dispatch(eventName, data) {
        this.#eventEmitter.emit(eventName, data);
    }
}

export const eventBus = new EventBus();
