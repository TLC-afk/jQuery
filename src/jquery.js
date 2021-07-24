window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      //创建 div
      elements = [create(selectorOrArrayOrTemplate)];
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }

  function create(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  return {
    jquery: true,
    elements: elements,
    print() {
      console.log(elements);
    },
    find(selector) {
      // 在特定的标签中找你要的元素
      let array = [];
      for (let i = 0; i < elements.length; i++) {
        elements2 = Array.from(elements[i].querySelectorAll(selector));
        array = array.concat(elements2);
      }
      array.oldApi = this; // this 就是 旧 api
      return jQuery(array);
    },
    each(fn) {
      // 遍历每一个元素，然后对其中的每一个执行 fn
      for (let i = 0; i < elements.length; i++) {
        fn.call(null, elements[i], i);
      }
      return this;
    },
    parent() {
      let array = [];
      this.each((node) => {
        if (array.indexOf(node.parentNode) === -1) {
          array.push(node.parentNode);
        }
      });
      return jQuery(array); //返回一个操作爸爸们的api
    },
    children() {
      let array = [];
      this.each((node) => {
        array = array.concat(...node.children); //... 展开操作符，就不会出现数组里面有数组的情况了
      });
      return jQuery(array); //返回一个操作儿子们的api
    },
    siblings() {
      let array = [];
      this.each((node) => {
        array = Array.from(node.parentNode.children).filter((n) => n !== node);
      });
      return jQuery(array); //返回一个操作兄弟姐妹的 Api
    },
    next() {
      let array = [];
      this.each((node) => {
        let x = node.nextSibling;
        while (x.nodeType === 3) {
          x = x.nextSibling;
        }
        array.push(x);
      });
      return jQuery(array); //返回一个操作弟弟的 api
    },
    prev() {
      let array = [];
      this.each((node) => {
        let x = node.previousSibling;
        while (x.nodeType === 3) {
          x = x.previousSibling;
        }
        array.push(x);
      });
      return jQuery(array); // 返回一个操作哥哥的 api
    },
    index() {
      let i;
      this.each((node) => {
        const list = Array.from(node.parentNode.children);
        for (i = 0; i < list.length; i++) {
          if (list[i] === node) {
            break;
          }
        }
      });
      return i; //返回一个元素的排行
    },
    get(index) {
      //通过索引拿到同一个选择器的元素
      return elements[index];
    },
    appendTo(node) {
      if (node instanceof Element) {
        this.each((el) => node.appendChild(el)); // 遍历 elements，对每个 el 进行 node.appendChild 操作
      } else if (node.jquery === true) {
        this.each((el) => node.get(0).appendChild(el)); // 遍历 elements，对每个 el 进行 node.get(0).appendChild(el))  操作
      }
    },
    append(children) {
      if (children instanceof Element) {
        this.get(0).appendChild(children);
      } else if (children instanceof HTMLCollection) {
        for (let i = 0; i < children.length; i++) {
          this.get(0).appendChild(children[i]);
        }
      } else if (children.jquery === true) {
        children.each((node) => this.get(0).appendChild(node));
      }
    },
    addClass(className) {
      //给选中元素加一个class
      this.each((node) => {
        node.classList.add(className);
      });
      return this;
    },
    oldApi: selectorOrArrayOrTemplate.oldApi,
    end() {
      return this.oldApi; // this 就是新 api
    },
  };
};
window.$ = window.jQuery;

//将这些功能挂到原型上
// window.$ = window.jQuery = function(selectorOrArrayOrTemplate) {
//   let elements;
//   if (typeof selectorOrArrayOrTemplate === "string") {
//     if (selectorOrArrayOrTemplate[0] === "<") {
//       // 创建 div
//       elements = [createElement(selectorOrArrayOrTemplate)];
//     } else {
//       // 查找 div
//       elements = document.querySelectorAll(selectorOrArrayOrTemplate);
//     }
//   } else if (selectorOrArrayOrTemplate instanceof Array) {
//     elements = selectorOrArrayOrTemplate;
//   }

//   function createElement(string) {
//     const container = document.createElement("template");
//     container.innerHTML = string.trim();
//     return container.content.firstChild;
//   }
//   // api 可以操作elements
//   const api = Object.create(jQuery.prototype) // 创建一个对象，这个对象的 __proto__ 为括号里面的东西
//   // const api = {__proto__: jQuery.prototype}
//   Object.assign(api, {
//     elements: elements,
//     oldApi: selectorOrArrayOrTemplate.oldApi
//   })
//   // api.elements = elements
//   // api.oldApi = selectorOrArrayOrTemplate.oldApi
//   return api
// };

// jQuery.fn = jQuery.prototype = {
//   constructor: jQuery,
//   jquery: true,
//   get(index) {
//     return this.elements[index];
//   },
//   appendTo(node) {
//     if (node instanceof Element) {
//       this.each(el => node.appendChild(el));
//     } else if (node.jquery === true) {
//       this.each(el => node.get(0).appendChild(el));
//     }
//   },
//   append(children) {
//     if (children instanceof Element) {
//       this.get(0).appendChild(children);
//     } else if (children instanceof HTMLCollection) {
//       for (let i = 0; i < children.length; i++) {
//         this.get(0).appendChild(children[i]);
//       }
//     } else if (children.jquery === true) {
//       children.each(node => this.get(0).appendChild(node));
//     }
//   },
//   find(selector) {
//     let array = [];
//     for (let i = 0; i < this.elements.length; i++) {
//       const elements2 = Array.from(this.elements[i].querySelectorAll(selector));
//       array = array.concat(this.elements2);
//     }
//     array.oldApi = this; // this 就是 旧 api
//     return jQuery(array);
//   },
//   each(fn) {
//     for (let i = 0; i < this.elements.length; i++) {
//       fn.call(null, this.elements[i], i);
//     }
//     return this;
//   },
//   parent() {
//     const array = [];
//     this.each(node => {
//       if (array.indexOf(node.parentNode) === -1) {
//         array.push(node.parentNode);
//       }
//     });
//     return jQuery(array);
//   },
//   children() {
//     const array = [];
//     this.each(node => {
//       if (array.indexOf(node.parentNode) === -1) {
//         array.push(...node.children);
//       }
//     });
//     return jQuery(array);
//   },
//   print() {
//     console.log(this.elements);
//   },
//   // 闭包：函数访问外部的变量
//   addClass(className) {
//     for (let i = 0; i < this.elements.length; i++) {
//       const element = this.elements[i];
//       element.classList.add(className);
//     }
//     return this;
//   },
//   end() {
//     return this.oldApi; // this 就是新 api
//   }
// };
