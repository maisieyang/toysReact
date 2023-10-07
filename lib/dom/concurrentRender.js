import { createDOM } from './render';
import { updateDOMProperties } from './render';
// 1. 任务队列

  let highPriorityTasks = [];
  let lowPriorityTasks = [];
  
  function addHighPriorityTask(task) {
    highPriorityTasks.push(task);
  }
  
  function addLowPriorityTask(task) {
    lowPriorityTasks.push(task);
  }

function workLoop(deadline) {
  while (highPriorityTasks.length > 0 || lowPriorityTasks.length > 0) {
    if (deadline.timeRemaining() > 0) {
      let task = highPriorityTasks.length ? highPriorityTasks.pop() : lowPriorityTasks.pop();
      task();
    } else {
      break;
    }
  }
  
  if (highPriorityTasks.length > 0 || lowPriorityTasks.length > 0) {
    requestIdleCallback(workLoop);
  }
}

requestIdleCallback(workLoop);




  function concurrentRender(element, container) {
    addHighPriorityTask(() => {
        _reconcile(element, container);
    });
}

function _reconcile(element, container) {
  const dom = createDOM(element);

  updateDOMProperties(dom, element.props);

  element.props.children.forEach(child =>
    _reconcile(child, dom)
  );

  container.appendChild(dom);
}


export { concurrentRender,addHighPriorityTask,addLowPriorityTask } ;