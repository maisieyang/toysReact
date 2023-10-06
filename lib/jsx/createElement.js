import createTextElement from "./createTextElement";

function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child => 
          typeof child === "object"
            ? child
            : createTextElement(child)
        )
      }
    };
  }
  

export default createElement;
