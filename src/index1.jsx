import { createElement } from "../lib/jsx";
import { render} from "../lib/dom";

const { render } =render;

const element = (
    <div className="app">
      <h1>Hello World!</h1>
      <p>This is our custom React.</p>
    </div>
  );

const container = document.getElementById('root');
render(element, container);

  
// console.log(element);
