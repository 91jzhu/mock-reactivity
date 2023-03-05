// 记录依赖，触发依赖
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
        // 数据记录其 effect 有哪些
        dep.add(activeEffect)
        // 让 effect 记录数据依赖
        activeEffect.deps.push(dep);
    }
};

function run(effect) {
    if (effect.options.reset) {
        effect.options.reset();
    } else {
        effect();
    }
}

// eslint-disable-next-line
const trigger = (target, type, key, value, oldValue) => {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const effectRunners = new Set();
    const computedRunners = new Set();
    const add = (effects) => {
        effects.forEach(effect => {
            if (effect.options.computed) {
                computedRunners.add(effect);
            } else {
                effectRunners.add(effect);
            }
        });
    };
    if (key !== null) {
        add(depsMap.get(key));
        if (type === 'set') {
            if (Array.isArray(target)) {
                add(depsMap.get('length'))
            }
        }
    }
 
    // 先处理 dirty，再执行 effect
    computedRunners.forEach(run);
    effectRunners.forEach(run);
};

export { effect, track, trigger };