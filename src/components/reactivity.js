import { baseHandler } from './baseHandler'

const createReactivityObject = (target, baseHandler) => {
    if (typeof target === 'object' && target !== null) {
        return new Proxy(target, baseHandler);
    }
};

const reactive = (target) => {
    return createReactivityObject(target, baseHandler)
};

export { reactive };