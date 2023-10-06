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
##  step6 Fibers: 
用迭代的渲染函数替换递归渲染函数。每个元素实例都将有一个"fiber"，表示其在工作循环中的位置。
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





