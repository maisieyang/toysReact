"use strict";

var _jsx = require("../lib/jsx");
var _render = require("../lib/dom/render");
var element = (0, _jsx.createElement)("div", {
  className: "app"
}, (0, _jsx.createElement)("h1", null, "Hello World!"), (0, _jsx.createElement)("p", null, "This is our custom React."));
var container = document.getElementById('root');
(0, _render.render)(element, container);
console.log(element);