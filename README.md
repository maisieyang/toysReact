a toys for fun

# 构建玩具ToysReact，帮助理解react的核心原理

## step1 项目初始化: 
创建一个新目录并初始化一个新的npm项目。

```
npm init -y
```

## step2 JSX:
理解JSX只是React.createElement(component, props, ...children)调用的语法糖。要使其工作，你需要一个工具，如Babel，来将JSX转换为常规JavaScript。
1. JSX 为什么重要:
   
在 React 中，JSX 允许我们以声明性方式编写 UI，它提供了一个更加直观和清晰的方法来表示 UI 结构和数据。

当你在 JSX 中写:
```javaScript
const element = <h1>Hello, world!</h1>;
```

2. JSX 转换:

Babel 将其转化为:

```javaScript
const element = React.createElement('h1', null, 'Hello, world!');
```

3. 使用Babel将代码转换为常规JavaScript:

`npx babel --watch src --out-dir . --presets @babel/preset-env,@babel/preset-react`

使用 npx 来运行 Babel CLI（命令行接口）以转换源代码。这个命令要求 Babel 持续监视你的 src 目录，并在出现更改时，使用提供的预设编译 JavaScript 并将编译后的文件输出到当前目录
npx:npm 自带的一个包运行工具。它用于执行来自 node_modules 以及全局安装的二进制文件。它允许你在不在你的机器上全局安装的情况下运行一个命令。在这里，它被用来运行 Babel 的 CLI。


## step3 React.createElement(): 

实现 createElement:我们的目标是从参数创建一个描述 React 元素的对象. 这个对象包括元素的类型、属性和子元素.
现在, 通过这些函数, 我们可以创建一个描述我们应用结构和内容的对象树. 这种对象树通常被称为 "Virtual DOM", 因为它表示了在浏览器的真实 DOM 中应该显示什么.

``` JS
React.createElement('h1', { className: 'heading' }, 'Hello')


function createElement(type, props = {}, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => 
                typeof child === "object" ? child : createTextElement(child)
            )
        }
    };
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    };
}


```

##  step4 渲染函数 (Render function): 
编写一个render函数，该函数渲染Virtual DOM到真实DOM。
要将Virtual DOM渲染到真实DOM，我们需要一个render函数。这个函数的目的是接收一个React元素对象（Virtual DOM）和一个DOM容器，然后更新容器以匹配React元素的描述

``` js

function render(element, container) {
    const dom = createDOM(element);

    updateDOMProperties(dom, element.props);

    element.props.children.forEach(child =>
        render(child, dom)
    );

    container.appendChild(dom);
}

function createDOM(element) {
    const isTextElement = element.type === "TEXT_ELEMENT";
    const dom = isTextElement
        ? document.createTextNode("")
        : document.createElement(element.type);

    return dom;
}

function updateDOMProperties(dom, newProps) {
    for (const key in newProps) {
        if (key === "children") continue; // children是特殊属性，我们会单独处理
        if (key.startsWith("on")) {
            // 事件监听器，例如 "onClick"
            const eventType = key.toLowerCase().substring(2);
            dom.addEventListener(eventType, newProps[key]);
        } else {
            // 其他属性
            dom[key] = newProps[key];
        }
    }
}


```



##  step5 并发模式 (Concurrent Mode): 
理解React中的'work'的概念。将工作分割为小单元，并使用一个简单的循环调度它们，这个循环被称为"工作循环"。使用requestIdleCallback进行浏览器调度。

1. 简介：

传统的 React 渲染可能会长时间阻塞主线程，导致响应性减弱。
并发模式为渲染工作提供了一种分块的方式，使应用程序感觉更快、更响应迅速。

2. 它是如何工作的：

React 的并发模式更像是一种原则而不是单一功能。
它建立在 Fiber 架构之上，这允许 React 暂停工作（渲染）并稍后返回。
React 可以在不立即提交更改到 DOM 的情况下处理多个任务（例如，获取数据、更新状态）。
React 可以优先处理某些任务。例如，直接的用户输入和动画被赋予了高优先级。

3. 益处：
   
可中断性：React 可以中断一个耗时的渲染以处理一个高优先级的事件。
改进的数据获取：在并发模式下，React 可以在所有数据到达之前开始渲染，显示更快的初始渲染。
选择性渲染：React 可以延迟从低优先级任务的渲染更新，并在适当的时候显示它们。


4. 选择并发模式：

React 提供了一个 createRoot API，让应用程序或应用程序的一部分选择并发模式。
考虑因素和权衡：

并发模式引入了更多的复杂性。


``` js

// 1. Use requestIdleCallback
let tasks = [];

function workLoop(deadline) {
  while (tasks.length > 0) {
    if (deadline.timeRemaining() > 0) {
      tasks.pop()();
    } else {
      break;
    }
  }
  
  if (tasks.length > 0) {
    requestIdleCallback(workLoop);
  }
}

requestIdleCallback(workLoop);


// 2. Create Basic Units of Work
function addTask(task) {
  tasks.push(task);
}

// 3.Implement a Basic Render
function render(element, container) {
  addTask(() => {
    container.innerHTML = element;
  });
}


```


##  step6 Fibers: 

在引入 Fiber 之前，React 的更新过程是递归的，并且一旦开始就不能被打断。这在复杂的应用中可能会导致性能问题。Fiber 改变了这一点，它引入了一个更灵活的、可中断的更新机制，并为 React 提供了一种方式，使其可以更智能地分配和管理工作，提高了应用的响应能力。

Fiber 是 React 16（也被称为 "React Fiber"）中引入的一个新的核心算法。它解决了 React 在大型应用中的一些性能问题，并为未来的功能提供了基础。为了理解为什么 React 团队决定引入 Fiber，我们需要深入了解其背后的动机和目标。

为什么需要 Fiber？

1. 非阻塞主线程：
   
   传统的 React 调和（reconciliation）算法是递归的，一旦开始就无法中断。这意味着如果有一个大型组件树需要重新渲染，主线程可能会被阻塞，导致界面卡顿。Fiber 的设计目标之一是使调和过程可以被中断和恢复，从而防止长时间的任务阻塞主线程。

2. 提高应用的响应能力：
   
   应用的响应性是用户体验的关键部分。为了确保应用对用户输入、动画等活动作出快速响应，Fiber 引入了任务优先级的概念。这允许 React 更智能地决定哪些工作应该首先完成。

3. 支持并发模式：
   
   React 的并发模式（Concurrent Mode）允许 React 同时处理多个任务，并根据它们的优先级适当地中断和恢复这些任务。这为框架提供了更大的灵活性，以优化复杂应用的性能。





##  step7 渲染和提交阶段 (Render and Commit Phases): 
将渲染过程分为两个阶段。"渲染阶段"计算更改但不更新DOM，"提交阶段"执行DOM更新。
##  step8 协调 (Reconciliation): 
当组件的状态或属性更改时，React需要确定如何有效地更新UI。这个步骤涉及创建一个新树，将其与旧树进行比较，然后更新DOM。
##  step9 函数组件 (Function Components): 它们比类组件简单，只是返回元素的函数。
##  step10 钩子 (Hooks): 
理解钩子，特别是useState钩子。实现一个简单版本的它，以允许功能组件具有状态。
##  step11 副作用 (Effects): 
实现useEffect钩子，允许你在函数组件中运行副作用。
##  step12 优化和更多 (Optimizations and Beyond):
 深入研究教程中未涉及的优化技术和功能，如context, lazy, suspense等。
通过这个过程，你将构建一个简化版本的React，叫做"toysReact"。





