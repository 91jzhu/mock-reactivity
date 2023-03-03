import { reactive } from "./reactivity";
import { track, trigger } from './effect';

const baseHandler = {
    get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);
        track(target, 'add', key);
        if (typeof res === 'object' && res !== null) {
            return reactive(res);
        }
        return res;
    },
    set(target, key, value, receiver) {
        const oldValue = target[key];
        const res = Reflect.set(target, key, value, receiver);
        const hadKey = Object.prototype.hasOwnProperty.call(target, key);
        if (!hadKey) {
            // 新增属性
            trigger(target, 'add', key, value);
        } else if (oldValue !== value) {
            // 有意义的修改
            trigger(target, 'set', key, value, oldValue);
        }
        return res;
    }
};

export { baseHandler };