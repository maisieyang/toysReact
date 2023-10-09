import { createElement } from "../lib/jsx";
import { render, useState} from "../lib/dom";

// const element = (
//     <div className="app">
//       <h1>Hello World!</h1>
//       <p>This is our custom React.</p>
//     </div>
//   );

// const container = document.getElementById('root');
// render(element, container);

  
// console.log(element);



// Sample component using your mini React
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="app">
      <h1>Hello World! {count}</h1>
      <p>This is our custom React.</p>
      <button onClick={() => setCount(count + 1)}>Click me!</button>
    </div>
  );
}


// function App() {
//   return (
//     <div className="app">
//       <h1>Hello World!</h1>
//       <p>This is our custom React.</p>
//     </div>
//   );
// }
const element =Counter();
const container = document.getElementById("root");
render(element, container);