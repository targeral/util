;(function(window) {
    var util = (function() {
        /*
        *@fn : isObject
        *+feature 判断是否是一个对象
        *~parameter obj
        *~returnValue boolean
        */
        function isObject(obj) {

            return Object.prototype.toString.call(obj) === '[object Object]' || obj === Object(obj);
        }

        /*
        *@fn : isFunction
        *+feature 判断是否是一个函数
        *~parameter func
        *~returnValue boolean
        */
        function isFunction(func) {
            return Object.prototype.toString.call(func) === '[object Function]';
        }

        /*
        *@fn : isString
        *+feature 判断是否是一个字符串
        *~parameter str
        *~returnValue boolean
        */
        function isString(str) {
            return Object.prototype.toSting.call(str) === '[object String]';
        }

        /*
        *@fn : isNumber
        *+feature 判断是否是一个数值
        *~parameter num
        *~returnValue boolean
        */
        function isNumber(num) {
            return Object.prototype.toString.call(num) === '[object Number]';
        }
        /*
        *@fn : isUndefined
        *+feature 判断是否是一个Undefined
        *~parameter und
        *~returnValue boolean
        */
        function isUndefined(und) {
            return Object.prototype.toString.call(und) === '[object Undefined]';
        }
        /*
        *@fn : isArray
        *+feature 判断是否是一个数组
        *~parameter arr
        *~returnValue boolean
        */
        function isArray(arr) {
            if(Array.isArray) {
                return Array.isArray(arr);
            }
            return Object.prototype.toString.call(arr) === '[object Array]';
        }
        /*
        * @fn : throttle 
        * +feature 对于会连续地大量触发的事件，该方法会控制该事件的触发频率，然后抛出一个新的事件,比如scroll事件
        * ~parameter type, name, obj === 原事件，自定义事件，绑定对象
        */
        function throttle(type, name, obj) {
            var obj = obj || window;
            var running = false;
            var func = function() {
                if(running) {return;}
                running = true;
                requestAnimationFrame(function() {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        }

        /*
        *@fn : $
        *+ feature 返回查找的dom元素，如果查询回来的dom元素只有一个，则返回这个元素，如果查询回来的dom元素多于一个，则返回一个dom数组
        *~ parameter selector === 选择器
        */
        function $(selector, scope) {
            if(isObject(selector)) {
                return selector;
            }
            scope = scope ? scope : document;
            var doms = scope.querySelectorAll(selector);
            var dom;
            if( !isNumber(doms.length) ) {
                console.error("error happen in $, not find length");
            }
            if(doms.length === 1) {
                dom = doms[0];
            }else if(doms.length === 0) {
                console.log(selector);
                dom = scope.querySelector(selector);
            }else{
                dom = doms;
            }

            return dom;
        }

        function $$(selector, scope) {
            if(isObject(selector)) {
                return selector;
            }
            var dom = scope ? scope.querySelector(selector) : document.querySelector(selector);
            if( !isNumber(doms.length) ) {
                console.error("error happen in $, not find length");
            }
        }


        /*@fn : removeEl
        * feature : 移除一组元素
        * return : 
        */
        function removeEl(selectors, scope) {
            var i, len;
            scope = scope || document;
            for(i = 0, len = selectors.length; i < len; i++) {
                scope.removeChild($(selectors[i], scope));
            }
        }

        /*
        *@fn : on 
        *+ feature 绑定事件
        *~ parameter el, type, listener === 绑定元素，绑定事件，绑定回调函数
        */
        function on(el, type, listener, useCapture) {
            useCapture = useCapture || false;
            if(!el.addEventListener) {
                console.error("element not have addEventListener function");
                return ;
            }
            el.addEventListener(type, listener, useCapture);
        }

        /*
        *@fn : off
        *+ feature 解除事件绑定
        *~ parameter el, type, listener === 解除绑定元素， 解除绑定事件，回调函数
        */
        function off(el, type, listener, useCapture) {
            useCapture = useCapture || false;
            if(!el.removeEventListener) {
                console.error("element not have removeEventListener function");
                return ;
            }
            el.removeEventListener(type, listener, useCapture);
        }

        /*
        *@fn : trigger
        *+ feature 触发事件，触发由Event构造函数，CustomEvent构造函数产生的事件
        *~ parameter el, type, [data] === 触发的元素，触发的事件名称，传递的数据(可选)
        */
        function trigger(el, type, data) {
            var event, canceled;
            if(data) {
                event = new CustomEvent(type, data);
            }else {
                event = new Event(type);
            }
            try {
                canceled = el.dispatchEvent(event);
            }catch(e) {
                console.log("error happen in trigger, error is " + e);
                return ;
            }
            if (!canceled) {
                return "事件取消了";
            } else {
                return "事件未取消";
            }
        }

        /*
        *@fn : offset
        *+ feature 获取一个元素距父元素的位置。返回一个offset对象，包含了元素的offsetTop, offsetLeft, offsetHeight, offsetWidth的值。如果没有parent，就是距离文档document的距离。
        *~ parameter el, parent
        */
        function offset(el, parent) {
            var top = 0,
                left = 0,
                width = el.offsetWidth,
                height = el.offsetHeight;
            var ele = el;
            if(!parent) {
                while(ele.offsetParent != null) {
                    top = top + ele.offsetTop;
                    left = left + ele.offsetLeft;
                    ele = ele.offsetParent;
                }
            }else {
                
            }
            return {
                top : top,
                left : left,
                width : width,
                height : height
            }
        }
        /*
        *@fn : hasClass
        *+ feature 判断元素是否有指定的class
        *~ parameter el, str
        *~ return boolean
        */
        function hasClass(el, str) {
            var aaset = false, class_arr;
            class_arr = str.split(" ");
            if(el.classList) {
                aaset = class_arr.every(function(cl, index, arr) {
                    return el.classList.contains(cl);
                })
            }else {
                console.err("a error in hasClass");
            }
            return aaset;
        }
        /*
        *@fn : addClass
        *+ feature 给元素添加class，若存在，则不添加
        *~ parameter el, str
        *~ return boolean
        */
        function addClass(el, str) {
            var class_arr = str.split(" ");
            if(el.classList) {
                if(class_arr.length == 1) {
                    el.classList.add(class_arr[0]);
                }else {
                    class_arr.forEach(function(cl, index, arr) {
                        el.classList.add(cl);
                    });
                }
            }
        }

        /*
        *@fn : removeClass
        *+ feature 给元素移除class，若不存在，则不移除
        *~ parameter el, str
        *~ return boolean
        */
        function removeClass(el, str) {
            var class_arr = str.split(" ");
            if(el.classList) {
                if(class_arr.length == 1) {
                    el.classList.remove(class_arr[0]);
                }else {
                    class_arr.forEach(function(cl, index, arr) {
                        el.classList.remove(cl);
                    });
                }
            }
        }
        /*
        *@parameter : EventEmitterExist
        *+ feature EventEmitterExist存不存在
        *~ return boolean
         */
        var EventEmitterExist = false;
        /*
        *@Object : EventEmitter
        */
        var EventEmitter = null;

        /*
        *@fn : get
        *+ feature ajax的get方法，取数据
        *~ return no return
        */
        function get(url, success, fail) {
            var xhr, results, p;

            if(window.Promise) {
                p = PromiseGet(url);
                p.then(success || function(){}, fail || function(){});
            }

            xhr = new XMLHttpRequest();
            xhr.open(url, "GET", true);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        results = JSON.parse(this.responseText);
                        success(results);
                    }
                }
            }

            xhr.onerror = function(e) {
                fail(e);
            }

            xhr.send();
        }

        /*fn : PromiseGet
        * feature Promise版本的get方法
        * return Promise对象
        */
        function PromiseGet(url, bool) {
            var xhr = new XMLHttpRequest();
            var result;
            var p = new Promise(function(resolve, reject) {
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function() {
                    if(xhr.readyState === 4) {
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                            results = this.responseText;
                            if(bool) {
                                results = JSON.parse(results);
                            }
                            resolve(results);
                        }
                    }
                };

                xhr.onerror = function(e) {
                    reject(e);
                };

                xhr.send();
            });

            return p;
        }

        return {
            isNumber : isNumber,
            isObject : isObject,
            isFunction : isFunction,
            isString : isString,
            isUndefined : isUndefined,
            isArray : isArray,
            throttle : throttle,
            on : on,
            off : off,
            trigger : trigger,
            $ : $,
            removeEl : removeEl,
            offset : offset,
            hasClass : hasClass,
            addClass : addClass,
            removeClass : removeClass,
            createEventEmitter : function(){},
            EventEmitterExist : EventEmitterExist,
            EventEmitter : EventEmitter,
            get : get,
            PromiseGet : PromiseGet,
            markdown : null,
            template : null
        }
    })();

    window.util = util;
})(window)