import { effect, track, trigger } from "./effect";

const computed = (getterOrOptions) => {
    let getter, setter;
    if (typeof getterOrOptions === 'function') {
        getter = getterOrOptions;
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    // 第一次默认执行
    let dirty = true;
    let computed;

    let runner = effect(getter, {
        lazy: true,
        computed: true,
        // 依赖的值变化后，不执行 effect（懒执行，等 get value 时候再执行），执行 reset dirty
        reset: () => {
            if (!dirty) {
                dirty = true;
                trigger(computed, 'set', 'value');
            }
        }
    });
    let value;
    computed = {
        get value() {
            if (dirty) {
                value = runner();
                track(computed, 'get', 'value');
                dirty = false;
            }
            return value;
        },
        set value(newVal) {
            setter(newVal);
        }
    };
    return computed;
};

export { computed };