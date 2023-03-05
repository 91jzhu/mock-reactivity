import { reactive, computed, effect } from "./components";

const state = reactive({
    name: 'jzhu',
    age: 22,
    arr: [1, 2, 3]
});

// lazy 为 true 的 effect
const newAge = computed(() => {
    console.log('computed');
    return state.age * 2;
});

effect(() => {
    console.log(newAge.value);
});

state.age = 200;

// const newAge = computed(() => {
//     return state.age * 2;
// });

// console.log(newAge.value);

// effect(() => {
//     console.log(JSON.stringify(state.arr));
// });

// state.arr.push(4);

// state.arr[0] = 100;
