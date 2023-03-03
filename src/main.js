import { reactive, effect } from "./components";

const state = reactive({
    name: 'jzhu',
    age: 22,
    arr: [1, 2, 3]
});

effect(() => {
    console.log(JSON.stringify(state.arr));
});

// state.arr.push(4);

state.arr[0] = 100;
