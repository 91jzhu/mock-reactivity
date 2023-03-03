const effect = (fn, options = {}) => {
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
};

let uid = 0;
let activeEffect;
const effectStack = [];
const createReactiveEffect = (fn, options) => {
    const effect = () => {
        if (!effectStack.includes(fn)) {
            try {
                effectStack.push(effect);
                activeEffect = effect;
                // 触发依赖收集
                return fn();
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect.options = options;
    effect.deps = [];
    return effect;
};

const targetMap = new WeakMap();
const track = (target, type, key) => {
    if (!activeEffect) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep);
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
        activeEffect.deps.push(dep);
    }
};

function run(effects) {
    effects && effects.forEach((effect) => effect());
}
// eslint-disable-next-line
const trigger = (target, type, key, value, oldValue) => {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    if (type === 'set') {
        if (Array.isArray(target)) {
            return run(depsMap.get('length'))
        }
    }
    run(depsMap.get(key));
};

export { effect, track, trigger };