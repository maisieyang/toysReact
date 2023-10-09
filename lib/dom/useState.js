import { render} from "./render";

let hooks = [];
let currentHook = 0;

function useState(initialValue) {
  hooks[currentHook] = hooks[currentHook] || initialValue;
  const setStateHookIndex = currentHook;
  const setState = newValue => {
    hooks[setStateHookIndex] = newValue;
    render(); // re-render when state changes
  };
  return [hooks[currentHook++], setState];
}

export default useState;
