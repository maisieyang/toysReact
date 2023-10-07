import { createElement } from "../lib/jsx";
import { concurrentRender,addHighPriorityTask,addLowPriorityTask }  from "../lib/dom";



const element = (
    <div className="app">
      <h1>Hello World!</h1>
      <p>This is our custom React.</p>
    </div>
  );

  // Adding some tasks to demonstrate
addHighPriorityTask(() => {
  console.log("High Priority Task 1");
});

addLowPriorityTask(() => {
  console.log("Low Priority Task 1");
});

addHighPriorityTask(() => {
  console.log("High Priority Task 2");
});


const container = document.getElementById('root');

concurrentRender(element, container);