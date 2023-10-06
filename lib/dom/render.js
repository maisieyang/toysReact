//对于每一个React子元素，我们递归地调用render函数，然后将结果附加到当前DOM节点。
// 这个函数将会递归地创建DOM节点，然后将它们附加到父节点上。

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

export default render;