var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = Symbol.for("react.memo");
    var REACT_LAZY_TYPE = Symbol.for("react.lazy");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    var ReactSharedInternals = { H: null, A: null, T: null, S: null, V: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, self, source, owner, props) {
      self = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== self ? self : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(
        oldElement.type,
        newKey,
        void 0,
        void 0,
        void 0,
        oldElement.props
      );
    }
    function isValidElement2(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape2(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape2("" + element.key) : index.toString(36);
    }
    function noop$1() {
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement2(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    function noop2() {
    }
    exports.Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement2(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key, owner = void 0;
      if (null != config)
        for (propName in void 0 !== config.ref && (owner = void 0), void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, void 0, void 0, owner, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, void 0, void 0, null, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement2;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop2, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, createDeps, update) {
      var dispatcher = ReactSharedInternals.H;
      if ("function" === typeof update)
        throw Error(
          "useEffect CRUD overload is not enabled in this build of React."
        );
      return dispatcher.useEffect(create, createDeps);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init2) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init2);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.1.0";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          void 0,
          void 0,
          oldElement._owner,
          oldElement.props,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function isValidElement2(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape2(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape2("" + element.key)) : index.toString(36);
      }
      function noop$1() {
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement2(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement2(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ctor = payload._result;
          ctor = ctor();
          ctor.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 1, payload._result = moduleObject;
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 2, payload._result = error;
            }
          );
          -1 === payload._status && (payload._status = 0, payload._result = ctor);
        }
        if (1 === payload._status)
          return ctor = payload._result, void 0 === ctor && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ctor
          ), "default" in ctor || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ctor
          ), ctor.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function noop2() {
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      Symbol.for("react.provider");
      var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, fnName;
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null,
        actQueue: null,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        "react-stack-bottom-frame": function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs["react-stack-bottom-frame"].bind(deprecatedAPIs, UnknownOwner)();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      exports.Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement2(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          void 0,
          void 0,
          owner,
          props,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          owner = arguments[key], isValidElement2(owner) && owner._store && (owner._store.validated = 1);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++) {
          var node = arguments[i];
          isValidElement2(node) && node._store && (node._store.validated = 1);
        }
        i = {};
        node = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), node = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        node && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          node,
          void 0,
          void 0,
          getOwner(),
          i,
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement2;
      exports.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop2, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, createDeps, update) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        var dispatcher = resolveDispatcher();
        if ("function" === typeof update)
          throw Error(
            "useEffect CRUD overload is not enabled in this build of React."
          );
        return dispatcher.useEffect(create, createDeps);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init2) {
        return resolveDispatcher().useReducer(reducer, initialArg, init2);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.1.0";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    }();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/void-elements/index.js
var require_void_elements = __commonJS({
  "node_modules/void-elements/index.js"(exports, module) {
    module.exports = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "track": true,
      "wbr": true
    };
  }
});

// node_modules/html-parse-stringify/dist/html-parse-stringify.js
var require_html_parse_stringify = __commonJS({
  "node_modules/html-parse-stringify/dist/html-parse-stringify.js"(exports, module) {
    var e;
    var t2 = (e = require_void_elements()) && "object" == typeof e && "default" in e ? e.default : e;
    var n = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;
    function r(e2) {
      var r2 = { type: "tag", name: "", voidElement: false, attrs: {}, children: [] }, i2 = e2.match(/<\/?([^\s]+?)[/\s>]/);
      if (i2 && (r2.name = i2[1], (t2[i2[1]] || "/" === e2.charAt(e2.length - 2)) && (r2.voidElement = true), r2.name.startsWith("!--"))) {
        var s2 = e2.indexOf("-->");
        return { type: "comment", comment: -1 !== s2 ? e2.slice(4, s2) : "" };
      }
      for (var c2 = new RegExp(n), a2 = null; null !== (a2 = c2.exec(e2)); ) if (a2[0].trim()) if (a2[1]) {
        var o = a2[1].trim(), u = [o, ""];
        o.indexOf("=") > -1 && (u = o.split("=")), r2.attrs[u[0]] = u[1], c2.lastIndex--;
      } else a2[2] && (r2.attrs[a2[2]] = a2[3].trim().substring(1, a2[3].length - 1));
      return r2;
    }
    var i = /<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
    var s = /^\s*$/;
    var c = /* @__PURE__ */ Object.create(null);
    function a(e2, t3) {
      switch (t3.type) {
        case "text":
          return e2 + t3.content;
        case "tag":
          return e2 += "<" + t3.name + (t3.attrs ? function(e3) {
            var t4 = [];
            for (var n2 in e3) t4.push(n2 + '="' + e3[n2] + '"');
            return t4.length ? " " + t4.join(" ") : "";
          }(t3.attrs) : "") + (t3.voidElement ? "/>" : ">"), t3.voidElement ? e2 : e2 + t3.children.reduce(a, "") + "</" + t3.name + ">";
        case "comment":
          return e2 + "<!--" + t3.comment + "-->";
      }
    }
    module.exports = { parse: function(e2, t3) {
      t3 || (t3 = {}), t3.components || (t3.components = c);
      var n2, a2 = [], o = [], u = -1, l = false;
      if (0 !== e2.indexOf("<")) {
        var m = e2.indexOf("<");
        a2.push({ type: "text", content: -1 === m ? e2 : e2.substring(0, m) });
      }
      return e2.replace(i, function(i2, c2) {
        if (l) {
          if (i2 !== "</" + n2.name + ">") return;
          l = false;
        }
        var m2, d = "/" !== i2.charAt(1), f = i2.startsWith("<!--"), h = c2 + i2.length, p = e2.charAt(h);
        if (f) {
          var v = r(i2);
          return u < 0 ? (a2.push(v), a2) : ((m2 = o[u]).children.push(v), a2);
        }
        if (d && (u++, "tag" === (n2 = r(i2)).type && t3.components[n2.name] && (n2.type = "component", l = true), n2.voidElement || l || !p || "<" === p || n2.children.push({ type: "text", content: e2.slice(h, e2.indexOf("<", h)) }), 0 === u && a2.push(n2), (m2 = o[u - 1]) && m2.children.push(n2), o[u] = n2), (!d || n2.voidElement) && (u > -1 && (n2.voidElement || n2.name === i2.slice(2, -1)) && (u--, n2 = -1 === u ? a2 : o[u]), !l && "<" !== p && p)) {
          m2 = -1 === u ? a2 : o[u].children;
          var x = e2.indexOf("<", h), g = e2.slice(h, -1 === x ? void 0 : x);
          s.test(g) && (g = " "), (x > -1 && u + m2.length >= 0 || " " !== g) && m2.push({ type: "text", content: g });
        }
      }), a2;
    }, stringify: function(e2) {
      return e2.reduce(function(e3, t3) {
        return e3 + a("", t3);
      }, "");
    } };
  }
});

// node_modules/webidl-conversions/lib/index.js
var require_lib = __commonJS({
  "node_modules/webidl-conversions/lib/index.js"(exports, module) {
    "use strict";
    var conversions = {};
    module.exports = conversions;
    function sign(x) {
      return x < 0 ? -1 : 1;
    }
    function evenRound(x) {
      if (x % 1 === 0.5 && (x & 1) === 0) {
        return Math.floor(x);
      } else {
        return Math.round(x);
      }
    }
    function createNumberConversion(bitLength, typeOpts) {
      if (!typeOpts.unsigned) {
        --bitLength;
      }
      const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
      const upperBound = Math.pow(2, bitLength) - 1;
      const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
      const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);
      return function(V, opts) {
        if (!opts) opts = {};
        let x = +V;
        if (opts.enforceRange) {
          if (!Number.isFinite(x)) {
            throw new TypeError("Argument is not a finite number");
          }
          x = sign(x) * Math.floor(Math.abs(x));
          if (x < lowerBound || x > upperBound) {
            throw new TypeError("Argument is not in byte range");
          }
          return x;
        }
        if (!isNaN(x) && opts.clamp) {
          x = evenRound(x);
          if (x < lowerBound) x = lowerBound;
          if (x > upperBound) x = upperBound;
          return x;
        }
        if (!Number.isFinite(x) || x === 0) {
          return 0;
        }
        x = sign(x) * Math.floor(Math.abs(x));
        x = x % moduloVal;
        if (!typeOpts.unsigned && x >= moduloBound) {
          return x - moduloVal;
        } else if (typeOpts.unsigned) {
          if (x < 0) {
            x += moduloVal;
          } else if (x === -0) {
            return 0;
          }
        }
        return x;
      };
    }
    conversions["void"] = function() {
      return void 0;
    };
    conversions["boolean"] = function(val) {
      return !!val;
    };
    conversions["byte"] = createNumberConversion(8, { unsigned: false });
    conversions["octet"] = createNumberConversion(8, { unsigned: true });
    conversions["short"] = createNumberConversion(16, { unsigned: false });
    conversions["unsigned short"] = createNumberConversion(16, { unsigned: true });
    conversions["long"] = createNumberConversion(32, { unsigned: false });
    conversions["unsigned long"] = createNumberConversion(32, { unsigned: true });
    conversions["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
    conversions["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });
    conversions["double"] = function(V) {
      const x = +V;
      if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
      }
      return x;
    };
    conversions["unrestricted double"] = function(V) {
      const x = +V;
      if (isNaN(x)) {
        throw new TypeError("Argument is NaN");
      }
      return x;
    };
    conversions["float"] = conversions["double"];
    conversions["unrestricted float"] = conversions["unrestricted double"];
    conversions["DOMString"] = function(V, opts) {
      if (!opts) opts = {};
      if (opts.treatNullAsEmptyString && V === null) {
        return "";
      }
      return String(V);
    };
    conversions["ByteString"] = function(V, opts) {
      const x = String(V);
      let c = void 0;
      for (let i = 0; (c = x.codePointAt(i)) !== void 0; ++i) {
        if (c > 255) {
          throw new TypeError("Argument is not a valid bytestring");
        }
      }
      return x;
    };
    conversions["USVString"] = function(V) {
      const S = String(V);
      const n = S.length;
      const U = [];
      for (let i = 0; i < n; ++i) {
        const c = S.charCodeAt(i);
        if (c < 55296 || c > 57343) {
          U.push(String.fromCodePoint(c));
        } else if (56320 <= c && c <= 57343) {
          U.push(String.fromCodePoint(65533));
        } else {
          if (i === n - 1) {
            U.push(String.fromCodePoint(65533));
          } else {
            const d = S.charCodeAt(i + 1);
            if (56320 <= d && d <= 57343) {
              const a = c & 1023;
              const b = d & 1023;
              U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
              ++i;
            } else {
              U.push(String.fromCodePoint(65533));
            }
          }
        }
      }
      return U.join("");
    };
    conversions["Date"] = function(V, opts) {
      if (!(V instanceof Date)) {
        throw new TypeError("Argument is not a Date object");
      }
      if (isNaN(V)) {
        return void 0;
      }
      return V;
    };
    conversions["RegExp"] = function(V, opts) {
      if (!(V instanceof RegExp)) {
        V = new RegExp(V);
      }
      return V;
    };
  }
});

// node_modules/whatwg-url/lib/utils.js
var require_utils = __commonJS({
  "node_modules/whatwg-url/lib/utils.js"(exports, module) {
    "use strict";
    module.exports.mixin = function mixin(target, source) {
      const keys = Object.getOwnPropertyNames(source);
      for (let i = 0; i < keys.length; ++i) {
        Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
      }
    };
    module.exports.wrapperSymbol = Symbol("wrapper");
    module.exports.implSymbol = Symbol("impl");
    module.exports.wrapperForImpl = function(impl) {
      return impl[module.exports.wrapperSymbol];
    };
    module.exports.implForWrapper = function(wrapper) {
      return wrapper[module.exports.implSymbol];
    };
  }
});

// node_modules/tr46/lib/mappingTable.json
var require_mappingTable = __commonJS({
  "node_modules/tr46/lib/mappingTable.json"(exports, module) {
    module.exports = [[[0, 44], "disallowed_STD3_valid"], [[45, 46], "valid"], [[47, 47], "disallowed_STD3_valid"], [[48, 57], "valid"], [[58, 64], "disallowed_STD3_valid"], [[65, 65], "mapped", [97]], [[66, 66], "mapped", [98]], [[67, 67], "mapped", [99]], [[68, 68], "mapped", [100]], [[69, 69], "mapped", [101]], [[70, 70], "mapped", [102]], [[71, 71], "mapped", [103]], [[72, 72], "mapped", [104]], [[73, 73], "mapped", [105]], [[74, 74], "mapped", [106]], [[75, 75], "mapped", [107]], [[76, 76], "mapped", [108]], [[77, 77], "mapped", [109]], [[78, 78], "mapped", [110]], [[79, 79], "mapped", [111]], [[80, 80], "mapped", [112]], [[81, 81], "mapped", [113]], [[82, 82], "mapped", [114]], [[83, 83], "mapped", [115]], [[84, 84], "mapped", [116]], [[85, 85], "mapped", [117]], [[86, 86], "mapped", [118]], [[87, 87], "mapped", [119]], [[88, 88], "mapped", [120]], [[89, 89], "mapped", [121]], [[90, 90], "mapped", [122]], [[91, 96], "disallowed_STD3_valid"], [[97, 122], "valid"], [[123, 127], "disallowed_STD3_valid"], [[128, 159], "disallowed"], [[160, 160], "disallowed_STD3_mapped", [32]], [[161, 167], "valid", [], "NV8"], [[168, 168], "disallowed_STD3_mapped", [32, 776]], [[169, 169], "valid", [], "NV8"], [[170, 170], "mapped", [97]], [[171, 172], "valid", [], "NV8"], [[173, 173], "ignored"], [[174, 174], "valid", [], "NV8"], [[175, 175], "disallowed_STD3_mapped", [32, 772]], [[176, 177], "valid", [], "NV8"], [[178, 178], "mapped", [50]], [[179, 179], "mapped", [51]], [[180, 180], "disallowed_STD3_mapped", [32, 769]], [[181, 181], "mapped", [956]], [[182, 182], "valid", [], "NV8"], [[183, 183], "valid"], [[184, 184], "disallowed_STD3_mapped", [32, 807]], [[185, 185], "mapped", [49]], [[186, 186], "mapped", [111]], [[187, 187], "valid", [], "NV8"], [[188, 188], "mapped", [49, 8260, 52]], [[189, 189], "mapped", [49, 8260, 50]], [[190, 190], "mapped", [51, 8260, 52]], [[191, 191], "valid", [], "NV8"], [[192, 192], "mapped", [224]], [[193, 193], "mapped", [225]], [[194, 194], "mapped", [226]], [[195, 195], "mapped", [227]], [[196, 196], "mapped", [228]], [[197, 197], "mapped", [229]], [[198, 198], "mapped", [230]], [[199, 199], "mapped", [231]], [[200, 200], "mapped", [232]], [[201, 201], "mapped", [233]], [[202, 202], "mapped", [234]], [[203, 203], "mapped", [235]], [[204, 204], "mapped", [236]], [[205, 205], "mapped", [237]], [[206, 206], "mapped", [238]], [[207, 207], "mapped", [239]], [[208, 208], "mapped", [240]], [[209, 209], "mapped", [241]], [[210, 210], "mapped", [242]], [[211, 211], "mapped", [243]], [[212, 212], "mapped", [244]], [[213, 213], "mapped", [245]], [[214, 214], "mapped", [246]], [[215, 215], "valid", [], "NV8"], [[216, 216], "mapped", [248]], [[217, 217], "mapped", [249]], [[218, 218], "mapped", [250]], [[219, 219], "mapped", [251]], [[220, 220], "mapped", [252]], [[221, 221], "mapped", [253]], [[222, 222], "mapped", [254]], [[223, 223], "deviation", [115, 115]], [[224, 246], "valid"], [[247, 247], "valid", [], "NV8"], [[248, 255], "valid"], [[256, 256], "mapped", [257]], [[257, 257], "valid"], [[258, 258], "mapped", [259]], [[259, 259], "valid"], [[260, 260], "mapped", [261]], [[261, 261], "valid"], [[262, 262], "mapped", [263]], [[263, 263], "valid"], [[264, 264], "mapped", [265]], [[265, 265], "valid"], [[266, 266], "mapped", [267]], [[267, 267], "valid"], [[268, 268], "mapped", [269]], [[269, 269], "valid"], [[270, 270], "mapped", [271]], [[271, 271], "valid"], [[272, 272], "mapped", [273]], [[273, 273], "valid"], [[274, 274], "mapped", [275]], [[275, 275], "valid"], [[276, 276], "mapped", [277]], [[277, 277], "valid"], [[278, 278], "mapped", [279]], [[279, 279], "valid"], [[280, 280], "mapped", [281]], [[281, 281], "valid"], [[282, 282], "mapped", [283]], [[283, 283], "valid"], [[284, 284], "mapped", [285]], [[285, 285], "valid"], [[286, 286], "mapped", [287]], [[287, 287], "valid"], [[288, 288], "mapped", [289]], [[289, 289], "valid"], [[290, 290], "mapped", [291]], [[291, 291], "valid"], [[292, 292], "mapped", [293]], [[293, 293], "valid"], [[294, 294], "mapped", [295]], [[295, 295], "valid"], [[296, 296], "mapped", [297]], [[297, 297], "valid"], [[298, 298], "mapped", [299]], [[299, 299], "valid"], [[300, 300], "mapped", [301]], [[301, 301], "valid"], [[302, 302], "mapped", [303]], [[303, 303], "valid"], [[304, 304], "mapped", [105, 775]], [[305, 305], "valid"], [[306, 307], "mapped", [105, 106]], [[308, 308], "mapped", [309]], [[309, 309], "valid"], [[310, 310], "mapped", [311]], [[311, 312], "valid"], [[313, 313], "mapped", [314]], [[314, 314], "valid"], [[315, 315], "mapped", [316]], [[316, 316], "valid"], [[317, 317], "mapped", [318]], [[318, 318], "valid"], [[319, 320], "mapped", [108, 183]], [[321, 321], "mapped", [322]], [[322, 322], "valid"], [[323, 323], "mapped", [324]], [[324, 324], "valid"], [[325, 325], "mapped", [326]], [[326, 326], "valid"], [[327, 327], "mapped", [328]], [[328, 328], "valid"], [[329, 329], "mapped", [700, 110]], [[330, 330], "mapped", [331]], [[331, 331], "valid"], [[332, 332], "mapped", [333]], [[333, 333], "valid"], [[334, 334], "mapped", [335]], [[335, 335], "valid"], [[336, 336], "mapped", [337]], [[337, 337], "valid"], [[338, 338], "mapped", [339]], [[339, 339], "valid"], [[340, 340], "mapped", [341]], [[341, 341], "valid"], [[342, 342], "mapped", [343]], [[343, 343], "valid"], [[344, 344], "mapped", [345]], [[345, 345], "valid"], [[346, 346], "mapped", [347]], [[347, 347], "valid"], [[348, 348], "mapped", [349]], [[349, 349], "valid"], [[350, 350], "mapped", [351]], [[351, 351], "valid"], [[352, 352], "mapped", [353]], [[353, 353], "valid"], [[354, 354], "mapped", [355]], [[355, 355], "valid"], [[356, 356], "mapped", [357]], [[357, 357], "valid"], [[358, 358], "mapped", [359]], [[359, 359], "valid"], [[360, 360], "mapped", [361]], [[361, 361], "valid"], [[362, 362], "mapped", [363]], [[363, 363], "valid"], [[364, 364], "mapped", [365]], [[365, 365], "valid"], [[366, 366], "mapped", [367]], [[367, 367], "valid"], [[368, 368], "mapped", [369]], [[369, 369], "valid"], [[370, 370], "mapped", [371]], [[371, 371], "valid"], [[372, 372], "mapped", [373]], [[373, 373], "valid"], [[374, 374], "mapped", [375]], [[375, 375], "valid"], [[376, 376], "mapped", [255]], [[377, 377], "mapped", [378]], [[378, 378], "valid"], [[379, 379], "mapped", [380]], [[380, 380], "valid"], [[381, 381], "mapped", [382]], [[382, 382], "valid"], [[383, 383], "mapped", [115]], [[384, 384], "valid"], [[385, 385], "mapped", [595]], [[386, 386], "mapped", [387]], [[387, 387], "valid"], [[388, 388], "mapped", [389]], [[389, 389], "valid"], [[390, 390], "mapped", [596]], [[391, 391], "mapped", [392]], [[392, 392], "valid"], [[393, 393], "mapped", [598]], [[394, 394], "mapped", [599]], [[395, 395], "mapped", [396]], [[396, 397], "valid"], [[398, 398], "mapped", [477]], [[399, 399], "mapped", [601]], [[400, 400], "mapped", [603]], [[401, 401], "mapped", [402]], [[402, 402], "valid"], [[403, 403], "mapped", [608]], [[404, 404], "mapped", [611]], [[405, 405], "valid"], [[406, 406], "mapped", [617]], [[407, 407], "mapped", [616]], [[408, 408], "mapped", [409]], [[409, 411], "valid"], [[412, 412], "mapped", [623]], [[413, 413], "mapped", [626]], [[414, 414], "valid"], [[415, 415], "mapped", [629]], [[416, 416], "mapped", [417]], [[417, 417], "valid"], [[418, 418], "mapped", [419]], [[419, 419], "valid"], [[420, 420], "mapped", [421]], [[421, 421], "valid"], [[422, 422], "mapped", [640]], [[423, 423], "mapped", [424]], [[424, 424], "valid"], [[425, 425], "mapped", [643]], [[426, 427], "valid"], [[428, 428], "mapped", [429]], [[429, 429], "valid"], [[430, 430], "mapped", [648]], [[431, 431], "mapped", [432]], [[432, 432], "valid"], [[433, 433], "mapped", [650]], [[434, 434], "mapped", [651]], [[435, 435], "mapped", [436]], [[436, 436], "valid"], [[437, 437], "mapped", [438]], [[438, 438], "valid"], [[439, 439], "mapped", [658]], [[440, 440], "mapped", [441]], [[441, 443], "valid"], [[444, 444], "mapped", [445]], [[445, 451], "valid"], [[452, 454], "mapped", [100, 382]], [[455, 457], "mapped", [108, 106]], [[458, 460], "mapped", [110, 106]], [[461, 461], "mapped", [462]], [[462, 462], "valid"], [[463, 463], "mapped", [464]], [[464, 464], "valid"], [[465, 465], "mapped", [466]], [[466, 466], "valid"], [[467, 467], "mapped", [468]], [[468, 468], "valid"], [[469, 469], "mapped", [470]], [[470, 470], "valid"], [[471, 471], "mapped", [472]], [[472, 472], "valid"], [[473, 473], "mapped", [474]], [[474, 474], "valid"], [[475, 475], "mapped", [476]], [[476, 477], "valid"], [[478, 478], "mapped", [479]], [[479, 479], "valid"], [[480, 480], "mapped", [481]], [[481, 481], "valid"], [[482, 482], "mapped", [483]], [[483, 483], "valid"], [[484, 484], "mapped", [485]], [[485, 485], "valid"], [[486, 486], "mapped", [487]], [[487, 487], "valid"], [[488, 488], "mapped", [489]], [[489, 489], "valid"], [[490, 490], "mapped", [491]], [[491, 491], "valid"], [[492, 492], "mapped", [493]], [[493, 493], "valid"], [[494, 494], "mapped", [495]], [[495, 496], "valid"], [[497, 499], "mapped", [100, 122]], [[500, 500], "mapped", [501]], [[501, 501], "valid"], [[502, 502], "mapped", [405]], [[503, 503], "mapped", [447]], [[504, 504], "mapped", [505]], [[505, 505], "valid"], [[506, 506], "mapped", [507]], [[507, 507], "valid"], [[508, 508], "mapped", [509]], [[509, 509], "valid"], [[510, 510], "mapped", [511]], [[511, 511], "valid"], [[512, 512], "mapped", [513]], [[513, 513], "valid"], [[514, 514], "mapped", [515]], [[515, 515], "valid"], [[516, 516], "mapped", [517]], [[517, 517], "valid"], [[518, 518], "mapped", [519]], [[519, 519], "valid"], [[520, 520], "mapped", [521]], [[521, 521], "valid"], [[522, 522], "mapped", [523]], [[523, 523], "valid"], [[524, 524], "mapped", [525]], [[525, 525], "valid"], [[526, 526], "mapped", [527]], [[527, 527], "valid"], [[528, 528], "mapped", [529]], [[529, 529], "valid"], [[530, 530], "mapped", [531]], [[531, 531], "valid"], [[532, 532], "mapped", [533]], [[533, 533], "valid"], [[534, 534], "mapped", [535]], [[535, 535], "valid"], [[536, 536], "mapped", [537]], [[537, 537], "valid"], [[538, 538], "mapped", [539]], [[539, 539], "valid"], [[540, 540], "mapped", [541]], [[541, 541], "valid"], [[542, 542], "mapped", [543]], [[543, 543], "valid"], [[544, 544], "mapped", [414]], [[545, 545], "valid"], [[546, 546], "mapped", [547]], [[547, 547], "valid"], [[548, 548], "mapped", [549]], [[549, 549], "valid"], [[550, 550], "mapped", [551]], [[551, 551], "valid"], [[552, 552], "mapped", [553]], [[553, 553], "valid"], [[554, 554], "mapped", [555]], [[555, 555], "valid"], [[556, 556], "mapped", [557]], [[557, 557], "valid"], [[558, 558], "mapped", [559]], [[559, 559], "valid"], [[560, 560], "mapped", [561]], [[561, 561], "valid"], [[562, 562], "mapped", [563]], [[563, 563], "valid"], [[564, 566], "valid"], [[567, 569], "valid"], [[570, 570], "mapped", [11365]], [[571, 571], "mapped", [572]], [[572, 572], "valid"], [[573, 573], "mapped", [410]], [[574, 574], "mapped", [11366]], [[575, 576], "valid"], [[577, 577], "mapped", [578]], [[578, 578], "valid"], [[579, 579], "mapped", [384]], [[580, 580], "mapped", [649]], [[581, 581], "mapped", [652]], [[582, 582], "mapped", [583]], [[583, 583], "valid"], [[584, 584], "mapped", [585]], [[585, 585], "valid"], [[586, 586], "mapped", [587]], [[587, 587], "valid"], [[588, 588], "mapped", [589]], [[589, 589], "valid"], [[590, 590], "mapped", [591]], [[591, 591], "valid"], [[592, 680], "valid"], [[681, 685], "valid"], [[686, 687], "valid"], [[688, 688], "mapped", [104]], [[689, 689], "mapped", [614]], [[690, 690], "mapped", [106]], [[691, 691], "mapped", [114]], [[692, 692], "mapped", [633]], [[693, 693], "mapped", [635]], [[694, 694], "mapped", [641]], [[695, 695], "mapped", [119]], [[696, 696], "mapped", [121]], [[697, 705], "valid"], [[706, 709], "valid", [], "NV8"], [[710, 721], "valid"], [[722, 727], "valid", [], "NV8"], [[728, 728], "disallowed_STD3_mapped", [32, 774]], [[729, 729], "disallowed_STD3_mapped", [32, 775]], [[730, 730], "disallowed_STD3_mapped", [32, 778]], [[731, 731], "disallowed_STD3_mapped", [32, 808]], [[732, 732], "disallowed_STD3_mapped", [32, 771]], [[733, 733], "disallowed_STD3_mapped", [32, 779]], [[734, 734], "valid", [], "NV8"], [[735, 735], "valid", [], "NV8"], [[736, 736], "mapped", [611]], [[737, 737], "mapped", [108]], [[738, 738], "mapped", [115]], [[739, 739], "mapped", [120]], [[740, 740], "mapped", [661]], [[741, 745], "valid", [], "NV8"], [[746, 747], "valid", [], "NV8"], [[748, 748], "valid"], [[749, 749], "valid", [], "NV8"], [[750, 750], "valid"], [[751, 767], "valid", [], "NV8"], [[768, 831], "valid"], [[832, 832], "mapped", [768]], [[833, 833], "mapped", [769]], [[834, 834], "valid"], [[835, 835], "mapped", [787]], [[836, 836], "mapped", [776, 769]], [[837, 837], "mapped", [953]], [[838, 846], "valid"], [[847, 847], "ignored"], [[848, 855], "valid"], [[856, 860], "valid"], [[861, 863], "valid"], [[864, 865], "valid"], [[866, 866], "valid"], [[867, 879], "valid"], [[880, 880], "mapped", [881]], [[881, 881], "valid"], [[882, 882], "mapped", [883]], [[883, 883], "valid"], [[884, 884], "mapped", [697]], [[885, 885], "valid"], [[886, 886], "mapped", [887]], [[887, 887], "valid"], [[888, 889], "disallowed"], [[890, 890], "disallowed_STD3_mapped", [32, 953]], [[891, 893], "valid"], [[894, 894], "disallowed_STD3_mapped", [59]], [[895, 895], "mapped", [1011]], [[896, 899], "disallowed"], [[900, 900], "disallowed_STD3_mapped", [32, 769]], [[901, 901], "disallowed_STD3_mapped", [32, 776, 769]], [[902, 902], "mapped", [940]], [[903, 903], "mapped", [183]], [[904, 904], "mapped", [941]], [[905, 905], "mapped", [942]], [[906, 906], "mapped", [943]], [[907, 907], "disallowed"], [[908, 908], "mapped", [972]], [[909, 909], "disallowed"], [[910, 910], "mapped", [973]], [[911, 911], "mapped", [974]], [[912, 912], "valid"], [[913, 913], "mapped", [945]], [[914, 914], "mapped", [946]], [[915, 915], "mapped", [947]], [[916, 916], "mapped", [948]], [[917, 917], "mapped", [949]], [[918, 918], "mapped", [950]], [[919, 919], "mapped", [951]], [[920, 920], "mapped", [952]], [[921, 921], "mapped", [953]], [[922, 922], "mapped", [954]], [[923, 923], "mapped", [955]], [[924, 924], "mapped", [956]], [[925, 925], "mapped", [957]], [[926, 926], "mapped", [958]], [[927, 927], "mapped", [959]], [[928, 928], "mapped", [960]], [[929, 929], "mapped", [961]], [[930, 930], "disallowed"], [[931, 931], "mapped", [963]], [[932, 932], "mapped", [964]], [[933, 933], "mapped", [965]], [[934, 934], "mapped", [966]], [[935, 935], "mapped", [967]], [[936, 936], "mapped", [968]], [[937, 937], "mapped", [969]], [[938, 938], "mapped", [970]], [[939, 939], "mapped", [971]], [[940, 961], "valid"], [[962, 962], "deviation", [963]], [[963, 974], "valid"], [[975, 975], "mapped", [983]], [[976, 976], "mapped", [946]], [[977, 977], "mapped", [952]], [[978, 978], "mapped", [965]], [[979, 979], "mapped", [973]], [[980, 980], "mapped", [971]], [[981, 981], "mapped", [966]], [[982, 982], "mapped", [960]], [[983, 983], "valid"], [[984, 984], "mapped", [985]], [[985, 985], "valid"], [[986, 986], "mapped", [987]], [[987, 987], "valid"], [[988, 988], "mapped", [989]], [[989, 989], "valid"], [[990, 990], "mapped", [991]], [[991, 991], "valid"], [[992, 992], "mapped", [993]], [[993, 993], "valid"], [[994, 994], "mapped", [995]], [[995, 995], "valid"], [[996, 996], "mapped", [997]], [[997, 997], "valid"], [[998, 998], "mapped", [999]], [[999, 999], "valid"], [[1e3, 1e3], "mapped", [1001]], [[1001, 1001], "valid"], [[1002, 1002], "mapped", [1003]], [[1003, 1003], "valid"], [[1004, 1004], "mapped", [1005]], [[1005, 1005], "valid"], [[1006, 1006], "mapped", [1007]], [[1007, 1007], "valid"], [[1008, 1008], "mapped", [954]], [[1009, 1009], "mapped", [961]], [[1010, 1010], "mapped", [963]], [[1011, 1011], "valid"], [[1012, 1012], "mapped", [952]], [[1013, 1013], "mapped", [949]], [[1014, 1014], "valid", [], "NV8"], [[1015, 1015], "mapped", [1016]], [[1016, 1016], "valid"], [[1017, 1017], "mapped", [963]], [[1018, 1018], "mapped", [1019]], [[1019, 1019], "valid"], [[1020, 1020], "valid"], [[1021, 1021], "mapped", [891]], [[1022, 1022], "mapped", [892]], [[1023, 1023], "mapped", [893]], [[1024, 1024], "mapped", [1104]], [[1025, 1025], "mapped", [1105]], [[1026, 1026], "mapped", [1106]], [[1027, 1027], "mapped", [1107]], [[1028, 1028], "mapped", [1108]], [[1029, 1029], "mapped", [1109]], [[1030, 1030], "mapped", [1110]], [[1031, 1031], "mapped", [1111]], [[1032, 1032], "mapped", [1112]], [[1033, 1033], "mapped", [1113]], [[1034, 1034], "mapped", [1114]], [[1035, 1035], "mapped", [1115]], [[1036, 1036], "mapped", [1116]], [[1037, 1037], "mapped", [1117]], [[1038, 1038], "mapped", [1118]], [[1039, 1039], "mapped", [1119]], [[1040, 1040], "mapped", [1072]], [[1041, 1041], "mapped", [1073]], [[1042, 1042], "mapped", [1074]], [[1043, 1043], "mapped", [1075]], [[1044, 1044], "mapped", [1076]], [[1045, 1045], "mapped", [1077]], [[1046, 1046], "mapped", [1078]], [[1047, 1047], "mapped", [1079]], [[1048, 1048], "mapped", [1080]], [[1049, 1049], "mapped", [1081]], [[1050, 1050], "mapped", [1082]], [[1051, 1051], "mapped", [1083]], [[1052, 1052], "mapped", [1084]], [[1053, 1053], "mapped", [1085]], [[1054, 1054], "mapped", [1086]], [[1055, 1055], "mapped", [1087]], [[1056, 1056], "mapped", [1088]], [[1057, 1057], "mapped", [1089]], [[1058, 1058], "mapped", [1090]], [[1059, 1059], "mapped", [1091]], [[1060, 1060], "mapped", [1092]], [[1061, 1061], "mapped", [1093]], [[1062, 1062], "mapped", [1094]], [[1063, 1063], "mapped", [1095]], [[1064, 1064], "mapped", [1096]], [[1065, 1065], "mapped", [1097]], [[1066, 1066], "mapped", [1098]], [[1067, 1067], "mapped", [1099]], [[1068, 1068], "mapped", [1100]], [[1069, 1069], "mapped", [1101]], [[1070, 1070], "mapped", [1102]], [[1071, 1071], "mapped", [1103]], [[1072, 1103], "valid"], [[1104, 1104], "valid"], [[1105, 1116], "valid"], [[1117, 1117], "valid"], [[1118, 1119], "valid"], [[1120, 1120], "mapped", [1121]], [[1121, 1121], "valid"], [[1122, 1122], "mapped", [1123]], [[1123, 1123], "valid"], [[1124, 1124], "mapped", [1125]], [[1125, 1125], "valid"], [[1126, 1126], "mapped", [1127]], [[1127, 1127], "valid"], [[1128, 1128], "mapped", [1129]], [[1129, 1129], "valid"], [[1130, 1130], "mapped", [1131]], [[1131, 1131], "valid"], [[1132, 1132], "mapped", [1133]], [[1133, 1133], "valid"], [[1134, 1134], "mapped", [1135]], [[1135, 1135], "valid"], [[1136, 1136], "mapped", [1137]], [[1137, 1137], "valid"], [[1138, 1138], "mapped", [1139]], [[1139, 1139], "valid"], [[1140, 1140], "mapped", [1141]], [[1141, 1141], "valid"], [[1142, 1142], "mapped", [1143]], [[1143, 1143], "valid"], [[1144, 1144], "mapped", [1145]], [[1145, 1145], "valid"], [[1146, 1146], "mapped", [1147]], [[1147, 1147], "valid"], [[1148, 1148], "mapped", [1149]], [[1149, 1149], "valid"], [[1150, 1150], "mapped", [1151]], [[1151, 1151], "valid"], [[1152, 1152], "mapped", [1153]], [[1153, 1153], "valid"], [[1154, 1154], "valid", [], "NV8"], [[1155, 1158], "valid"], [[1159, 1159], "valid"], [[1160, 1161], "valid", [], "NV8"], [[1162, 1162], "mapped", [1163]], [[1163, 1163], "valid"], [[1164, 1164], "mapped", [1165]], [[1165, 1165], "valid"], [[1166, 1166], "mapped", [1167]], [[1167, 1167], "valid"], [[1168, 1168], "mapped", [1169]], [[1169, 1169], "valid"], [[1170, 1170], "mapped", [1171]], [[1171, 1171], "valid"], [[1172, 1172], "mapped", [1173]], [[1173, 1173], "valid"], [[1174, 1174], "mapped", [1175]], [[1175, 1175], "valid"], [[1176, 1176], "mapped", [1177]], [[1177, 1177], "valid"], [[1178, 1178], "mapped", [1179]], [[1179, 1179], "valid"], [[1180, 1180], "mapped", [1181]], [[1181, 1181], "valid"], [[1182, 1182], "mapped", [1183]], [[1183, 1183], "valid"], [[1184, 1184], "mapped", [1185]], [[1185, 1185], "valid"], [[1186, 1186], "mapped", [1187]], [[1187, 1187], "valid"], [[1188, 1188], "mapped", [1189]], [[1189, 1189], "valid"], [[1190, 1190], "mapped", [1191]], [[1191, 1191], "valid"], [[1192, 1192], "mapped", [1193]], [[1193, 1193], "valid"], [[1194, 1194], "mapped", [1195]], [[1195, 1195], "valid"], [[1196, 1196], "mapped", [1197]], [[1197, 1197], "valid"], [[1198, 1198], "mapped", [1199]], [[1199, 1199], "valid"], [[1200, 1200], "mapped", [1201]], [[1201, 1201], "valid"], [[1202, 1202], "mapped", [1203]], [[1203, 1203], "valid"], [[1204, 1204], "mapped", [1205]], [[1205, 1205], "valid"], [[1206, 1206], "mapped", [1207]], [[1207, 1207], "valid"], [[1208, 1208], "mapped", [1209]], [[1209, 1209], "valid"], [[1210, 1210], "mapped", [1211]], [[1211, 1211], "valid"], [[1212, 1212], "mapped", [1213]], [[1213, 1213], "valid"], [[1214, 1214], "mapped", [1215]], [[1215, 1215], "valid"], [[1216, 1216], "disallowed"], [[1217, 1217], "mapped", [1218]], [[1218, 1218], "valid"], [[1219, 1219], "mapped", [1220]], [[1220, 1220], "valid"], [[1221, 1221], "mapped", [1222]], [[1222, 1222], "valid"], [[1223, 1223], "mapped", [1224]], [[1224, 1224], "valid"], [[1225, 1225], "mapped", [1226]], [[1226, 1226], "valid"], [[1227, 1227], "mapped", [1228]], [[1228, 1228], "valid"], [[1229, 1229], "mapped", [1230]], [[1230, 1230], "valid"], [[1231, 1231], "valid"], [[1232, 1232], "mapped", [1233]], [[1233, 1233], "valid"], [[1234, 1234], "mapped", [1235]], [[1235, 1235], "valid"], [[1236, 1236], "mapped", [1237]], [[1237, 1237], "valid"], [[1238, 1238], "mapped", [1239]], [[1239, 1239], "valid"], [[1240, 1240], "mapped", [1241]], [[1241, 1241], "valid"], [[1242, 1242], "mapped", [1243]], [[1243, 1243], "valid"], [[1244, 1244], "mapped", [1245]], [[1245, 1245], "valid"], [[1246, 1246], "mapped", [1247]], [[1247, 1247], "valid"], [[1248, 1248], "mapped", [1249]], [[1249, 1249], "valid"], [[1250, 1250], "mapped", [1251]], [[1251, 1251], "valid"], [[1252, 1252], "mapped", [1253]], [[1253, 1253], "valid"], [[1254, 1254], "mapped", [1255]], [[1255, 1255], "valid"], [[1256, 1256], "mapped", [1257]], [[1257, 1257], "valid"], [[1258, 1258], "mapped", [1259]], [[1259, 1259], "valid"], [[1260, 1260], "mapped", [1261]], [[1261, 1261], "valid"], [[1262, 1262], "mapped", [1263]], [[1263, 1263], "valid"], [[1264, 1264], "mapped", [1265]], [[1265, 1265], "valid"], [[1266, 1266], "mapped", [1267]], [[1267, 1267], "valid"], [[1268, 1268], "mapped", [1269]], [[1269, 1269], "valid"], [[1270, 1270], "mapped", [1271]], [[1271, 1271], "valid"], [[1272, 1272], "mapped", [1273]], [[1273, 1273], "valid"], [[1274, 1274], "mapped", [1275]], [[1275, 1275], "valid"], [[1276, 1276], "mapped", [1277]], [[1277, 1277], "valid"], [[1278, 1278], "mapped", [1279]], [[1279, 1279], "valid"], [[1280, 1280], "mapped", [1281]], [[1281, 1281], "valid"], [[1282, 1282], "mapped", [1283]], [[1283, 1283], "valid"], [[1284, 1284], "mapped", [1285]], [[1285, 1285], "valid"], [[1286, 1286], "mapped", [1287]], [[1287, 1287], "valid"], [[1288, 1288], "mapped", [1289]], [[1289, 1289], "valid"], [[1290, 1290], "mapped", [1291]], [[1291, 1291], "valid"], [[1292, 1292], "mapped", [1293]], [[1293, 1293], "valid"], [[1294, 1294], "mapped", [1295]], [[1295, 1295], "valid"], [[1296, 1296], "mapped", [1297]], [[1297, 1297], "valid"], [[1298, 1298], "mapped", [1299]], [[1299, 1299], "valid"], [[1300, 1300], "mapped", [1301]], [[1301, 1301], "valid"], [[1302, 1302], "mapped", [1303]], [[1303, 1303], "valid"], [[1304, 1304], "mapped", [1305]], [[1305, 1305], "valid"], [[1306, 1306], "mapped", [1307]], [[1307, 1307], "valid"], [[1308, 1308], "mapped", [1309]], [[1309, 1309], "valid"], [[1310, 1310], "mapped", [1311]], [[1311, 1311], "valid"], [[1312, 1312], "mapped", [1313]], [[1313, 1313], "valid"], [[1314, 1314], "mapped", [1315]], [[1315, 1315], "valid"], [[1316, 1316], "mapped", [1317]], [[1317, 1317], "valid"], [[1318, 1318], "mapped", [1319]], [[1319, 1319], "valid"], [[1320, 1320], "mapped", [1321]], [[1321, 1321], "valid"], [[1322, 1322], "mapped", [1323]], [[1323, 1323], "valid"], [[1324, 1324], "mapped", [1325]], [[1325, 1325], "valid"], [[1326, 1326], "mapped", [1327]], [[1327, 1327], "valid"], [[1328, 1328], "disallowed"], [[1329, 1329], "mapped", [1377]], [[1330, 1330], "mapped", [1378]], [[1331, 1331], "mapped", [1379]], [[1332, 1332], "mapped", [1380]], [[1333, 1333], "mapped", [1381]], [[1334, 1334], "mapped", [1382]], [[1335, 1335], "mapped", [1383]], [[1336, 1336], "mapped", [1384]], [[1337, 1337], "mapped", [1385]], [[1338, 1338], "mapped", [1386]], [[1339, 1339], "mapped", [1387]], [[1340, 1340], "mapped", [1388]], [[1341, 1341], "mapped", [1389]], [[1342, 1342], "mapped", [1390]], [[1343, 1343], "mapped", [1391]], [[1344, 1344], "mapped", [1392]], [[1345, 1345], "mapped", [1393]], [[1346, 1346], "mapped", [1394]], [[1347, 1347], "mapped", [1395]], [[1348, 1348], "mapped", [1396]], [[1349, 1349], "mapped", [1397]], [[1350, 1350], "mapped", [1398]], [[1351, 1351], "mapped", [1399]], [[1352, 1352], "mapped", [1400]], [[1353, 1353], "mapped", [1401]], [[1354, 1354], "mapped", [1402]], [[1355, 1355], "mapped", [1403]], [[1356, 1356], "mapped", [1404]], [[1357, 1357], "mapped", [1405]], [[1358, 1358], "mapped", [1406]], [[1359, 1359], "mapped", [1407]], [[1360, 1360], "mapped", [1408]], [[1361, 1361], "mapped", [1409]], [[1362, 1362], "mapped", [1410]], [[1363, 1363], "mapped", [1411]], [[1364, 1364], "mapped", [1412]], [[1365, 1365], "mapped", [1413]], [[1366, 1366], "mapped", [1414]], [[1367, 1368], "disallowed"], [[1369, 1369], "valid"], [[1370, 1375], "valid", [], "NV8"], [[1376, 1376], "disallowed"], [[1377, 1414], "valid"], [[1415, 1415], "mapped", [1381, 1410]], [[1416, 1416], "disallowed"], [[1417, 1417], "valid", [], "NV8"], [[1418, 1418], "valid", [], "NV8"], [[1419, 1420], "disallowed"], [[1421, 1422], "valid", [], "NV8"], [[1423, 1423], "valid", [], "NV8"], [[1424, 1424], "disallowed"], [[1425, 1441], "valid"], [[1442, 1442], "valid"], [[1443, 1455], "valid"], [[1456, 1465], "valid"], [[1466, 1466], "valid"], [[1467, 1469], "valid"], [[1470, 1470], "valid", [], "NV8"], [[1471, 1471], "valid"], [[1472, 1472], "valid", [], "NV8"], [[1473, 1474], "valid"], [[1475, 1475], "valid", [], "NV8"], [[1476, 1476], "valid"], [[1477, 1477], "valid"], [[1478, 1478], "valid", [], "NV8"], [[1479, 1479], "valid"], [[1480, 1487], "disallowed"], [[1488, 1514], "valid"], [[1515, 1519], "disallowed"], [[1520, 1524], "valid"], [[1525, 1535], "disallowed"], [[1536, 1539], "disallowed"], [[1540, 1540], "disallowed"], [[1541, 1541], "disallowed"], [[1542, 1546], "valid", [], "NV8"], [[1547, 1547], "valid", [], "NV8"], [[1548, 1548], "valid", [], "NV8"], [[1549, 1551], "valid", [], "NV8"], [[1552, 1557], "valid"], [[1558, 1562], "valid"], [[1563, 1563], "valid", [], "NV8"], [[1564, 1564], "disallowed"], [[1565, 1565], "disallowed"], [[1566, 1566], "valid", [], "NV8"], [[1567, 1567], "valid", [], "NV8"], [[1568, 1568], "valid"], [[1569, 1594], "valid"], [[1595, 1599], "valid"], [[1600, 1600], "valid", [], "NV8"], [[1601, 1618], "valid"], [[1619, 1621], "valid"], [[1622, 1624], "valid"], [[1625, 1630], "valid"], [[1631, 1631], "valid"], [[1632, 1641], "valid"], [[1642, 1645], "valid", [], "NV8"], [[1646, 1647], "valid"], [[1648, 1652], "valid"], [[1653, 1653], "mapped", [1575, 1652]], [[1654, 1654], "mapped", [1608, 1652]], [[1655, 1655], "mapped", [1735, 1652]], [[1656, 1656], "mapped", [1610, 1652]], [[1657, 1719], "valid"], [[1720, 1721], "valid"], [[1722, 1726], "valid"], [[1727, 1727], "valid"], [[1728, 1742], "valid"], [[1743, 1743], "valid"], [[1744, 1747], "valid"], [[1748, 1748], "valid", [], "NV8"], [[1749, 1756], "valid"], [[1757, 1757], "disallowed"], [[1758, 1758], "valid", [], "NV8"], [[1759, 1768], "valid"], [[1769, 1769], "valid", [], "NV8"], [[1770, 1773], "valid"], [[1774, 1775], "valid"], [[1776, 1785], "valid"], [[1786, 1790], "valid"], [[1791, 1791], "valid"], [[1792, 1805], "valid", [], "NV8"], [[1806, 1806], "disallowed"], [[1807, 1807], "disallowed"], [[1808, 1836], "valid"], [[1837, 1839], "valid"], [[1840, 1866], "valid"], [[1867, 1868], "disallowed"], [[1869, 1871], "valid"], [[1872, 1901], "valid"], [[1902, 1919], "valid"], [[1920, 1968], "valid"], [[1969, 1969], "valid"], [[1970, 1983], "disallowed"], [[1984, 2037], "valid"], [[2038, 2042], "valid", [], "NV8"], [[2043, 2047], "disallowed"], [[2048, 2093], "valid"], [[2094, 2095], "disallowed"], [[2096, 2110], "valid", [], "NV8"], [[2111, 2111], "disallowed"], [[2112, 2139], "valid"], [[2140, 2141], "disallowed"], [[2142, 2142], "valid", [], "NV8"], [[2143, 2207], "disallowed"], [[2208, 2208], "valid"], [[2209, 2209], "valid"], [[2210, 2220], "valid"], [[2221, 2226], "valid"], [[2227, 2228], "valid"], [[2229, 2274], "disallowed"], [[2275, 2275], "valid"], [[2276, 2302], "valid"], [[2303, 2303], "valid"], [[2304, 2304], "valid"], [[2305, 2307], "valid"], [[2308, 2308], "valid"], [[2309, 2361], "valid"], [[2362, 2363], "valid"], [[2364, 2381], "valid"], [[2382, 2382], "valid"], [[2383, 2383], "valid"], [[2384, 2388], "valid"], [[2389, 2389], "valid"], [[2390, 2391], "valid"], [[2392, 2392], "mapped", [2325, 2364]], [[2393, 2393], "mapped", [2326, 2364]], [[2394, 2394], "mapped", [2327, 2364]], [[2395, 2395], "mapped", [2332, 2364]], [[2396, 2396], "mapped", [2337, 2364]], [[2397, 2397], "mapped", [2338, 2364]], [[2398, 2398], "mapped", [2347, 2364]], [[2399, 2399], "mapped", [2351, 2364]], [[2400, 2403], "valid"], [[2404, 2405], "valid", [], "NV8"], [[2406, 2415], "valid"], [[2416, 2416], "valid", [], "NV8"], [[2417, 2418], "valid"], [[2419, 2423], "valid"], [[2424, 2424], "valid"], [[2425, 2426], "valid"], [[2427, 2428], "valid"], [[2429, 2429], "valid"], [[2430, 2431], "valid"], [[2432, 2432], "valid"], [[2433, 2435], "valid"], [[2436, 2436], "disallowed"], [[2437, 2444], "valid"], [[2445, 2446], "disallowed"], [[2447, 2448], "valid"], [[2449, 2450], "disallowed"], [[2451, 2472], "valid"], [[2473, 2473], "disallowed"], [[2474, 2480], "valid"], [[2481, 2481], "disallowed"], [[2482, 2482], "valid"], [[2483, 2485], "disallowed"], [[2486, 2489], "valid"], [[2490, 2491], "disallowed"], [[2492, 2492], "valid"], [[2493, 2493], "valid"], [[2494, 2500], "valid"], [[2501, 2502], "disallowed"], [[2503, 2504], "valid"], [[2505, 2506], "disallowed"], [[2507, 2509], "valid"], [[2510, 2510], "valid"], [[2511, 2518], "disallowed"], [[2519, 2519], "valid"], [[2520, 2523], "disallowed"], [[2524, 2524], "mapped", [2465, 2492]], [[2525, 2525], "mapped", [2466, 2492]], [[2526, 2526], "disallowed"], [[2527, 2527], "mapped", [2479, 2492]], [[2528, 2531], "valid"], [[2532, 2533], "disallowed"], [[2534, 2545], "valid"], [[2546, 2554], "valid", [], "NV8"], [[2555, 2555], "valid", [], "NV8"], [[2556, 2560], "disallowed"], [[2561, 2561], "valid"], [[2562, 2562], "valid"], [[2563, 2563], "valid"], [[2564, 2564], "disallowed"], [[2565, 2570], "valid"], [[2571, 2574], "disallowed"], [[2575, 2576], "valid"], [[2577, 2578], "disallowed"], [[2579, 2600], "valid"], [[2601, 2601], "disallowed"], [[2602, 2608], "valid"], [[2609, 2609], "disallowed"], [[2610, 2610], "valid"], [[2611, 2611], "mapped", [2610, 2620]], [[2612, 2612], "disallowed"], [[2613, 2613], "valid"], [[2614, 2614], "mapped", [2616, 2620]], [[2615, 2615], "disallowed"], [[2616, 2617], "valid"], [[2618, 2619], "disallowed"], [[2620, 2620], "valid"], [[2621, 2621], "disallowed"], [[2622, 2626], "valid"], [[2627, 2630], "disallowed"], [[2631, 2632], "valid"], [[2633, 2634], "disallowed"], [[2635, 2637], "valid"], [[2638, 2640], "disallowed"], [[2641, 2641], "valid"], [[2642, 2648], "disallowed"], [[2649, 2649], "mapped", [2582, 2620]], [[2650, 2650], "mapped", [2583, 2620]], [[2651, 2651], "mapped", [2588, 2620]], [[2652, 2652], "valid"], [[2653, 2653], "disallowed"], [[2654, 2654], "mapped", [2603, 2620]], [[2655, 2661], "disallowed"], [[2662, 2676], "valid"], [[2677, 2677], "valid"], [[2678, 2688], "disallowed"], [[2689, 2691], "valid"], [[2692, 2692], "disallowed"], [[2693, 2699], "valid"], [[2700, 2700], "valid"], [[2701, 2701], "valid"], [[2702, 2702], "disallowed"], [[2703, 2705], "valid"], [[2706, 2706], "disallowed"], [[2707, 2728], "valid"], [[2729, 2729], "disallowed"], [[2730, 2736], "valid"], [[2737, 2737], "disallowed"], [[2738, 2739], "valid"], [[2740, 2740], "disallowed"], [[2741, 2745], "valid"], [[2746, 2747], "disallowed"], [[2748, 2757], "valid"], [[2758, 2758], "disallowed"], [[2759, 2761], "valid"], [[2762, 2762], "disallowed"], [[2763, 2765], "valid"], [[2766, 2767], "disallowed"], [[2768, 2768], "valid"], [[2769, 2783], "disallowed"], [[2784, 2784], "valid"], [[2785, 2787], "valid"], [[2788, 2789], "disallowed"], [[2790, 2799], "valid"], [[2800, 2800], "valid", [], "NV8"], [[2801, 2801], "valid", [], "NV8"], [[2802, 2808], "disallowed"], [[2809, 2809], "valid"], [[2810, 2816], "disallowed"], [[2817, 2819], "valid"], [[2820, 2820], "disallowed"], [[2821, 2828], "valid"], [[2829, 2830], "disallowed"], [[2831, 2832], "valid"], [[2833, 2834], "disallowed"], [[2835, 2856], "valid"], [[2857, 2857], "disallowed"], [[2858, 2864], "valid"], [[2865, 2865], "disallowed"], [[2866, 2867], "valid"], [[2868, 2868], "disallowed"], [[2869, 2869], "valid"], [[2870, 2873], "valid"], [[2874, 2875], "disallowed"], [[2876, 2883], "valid"], [[2884, 2884], "valid"], [[2885, 2886], "disallowed"], [[2887, 2888], "valid"], [[2889, 2890], "disallowed"], [[2891, 2893], "valid"], [[2894, 2901], "disallowed"], [[2902, 2903], "valid"], [[2904, 2907], "disallowed"], [[2908, 2908], "mapped", [2849, 2876]], [[2909, 2909], "mapped", [2850, 2876]], [[2910, 2910], "disallowed"], [[2911, 2913], "valid"], [[2914, 2915], "valid"], [[2916, 2917], "disallowed"], [[2918, 2927], "valid"], [[2928, 2928], "valid", [], "NV8"], [[2929, 2929], "valid"], [[2930, 2935], "valid", [], "NV8"], [[2936, 2945], "disallowed"], [[2946, 2947], "valid"], [[2948, 2948], "disallowed"], [[2949, 2954], "valid"], [[2955, 2957], "disallowed"], [[2958, 2960], "valid"], [[2961, 2961], "disallowed"], [[2962, 2965], "valid"], [[2966, 2968], "disallowed"], [[2969, 2970], "valid"], [[2971, 2971], "disallowed"], [[2972, 2972], "valid"], [[2973, 2973], "disallowed"], [[2974, 2975], "valid"], [[2976, 2978], "disallowed"], [[2979, 2980], "valid"], [[2981, 2983], "disallowed"], [[2984, 2986], "valid"], [[2987, 2989], "disallowed"], [[2990, 2997], "valid"], [[2998, 2998], "valid"], [[2999, 3001], "valid"], [[3002, 3005], "disallowed"], [[3006, 3010], "valid"], [[3011, 3013], "disallowed"], [[3014, 3016], "valid"], [[3017, 3017], "disallowed"], [[3018, 3021], "valid"], [[3022, 3023], "disallowed"], [[3024, 3024], "valid"], [[3025, 3030], "disallowed"], [[3031, 3031], "valid"], [[3032, 3045], "disallowed"], [[3046, 3046], "valid"], [[3047, 3055], "valid"], [[3056, 3058], "valid", [], "NV8"], [[3059, 3066], "valid", [], "NV8"], [[3067, 3071], "disallowed"], [[3072, 3072], "valid"], [[3073, 3075], "valid"], [[3076, 3076], "disallowed"], [[3077, 3084], "valid"], [[3085, 3085], "disallowed"], [[3086, 3088], "valid"], [[3089, 3089], "disallowed"], [[3090, 3112], "valid"], [[3113, 3113], "disallowed"], [[3114, 3123], "valid"], [[3124, 3124], "valid"], [[3125, 3129], "valid"], [[3130, 3132], "disallowed"], [[3133, 3133], "valid"], [[3134, 3140], "valid"], [[3141, 3141], "disallowed"], [[3142, 3144], "valid"], [[3145, 3145], "disallowed"], [[3146, 3149], "valid"], [[3150, 3156], "disallowed"], [[3157, 3158], "valid"], [[3159, 3159], "disallowed"], [[3160, 3161], "valid"], [[3162, 3162], "valid"], [[3163, 3167], "disallowed"], [[3168, 3169], "valid"], [[3170, 3171], "valid"], [[3172, 3173], "disallowed"], [[3174, 3183], "valid"], [[3184, 3191], "disallowed"], [[3192, 3199], "valid", [], "NV8"], [[3200, 3200], "disallowed"], [[3201, 3201], "valid"], [[3202, 3203], "valid"], [[3204, 3204], "disallowed"], [[3205, 3212], "valid"], [[3213, 3213], "disallowed"], [[3214, 3216], "valid"], [[3217, 3217], "disallowed"], [[3218, 3240], "valid"], [[3241, 3241], "disallowed"], [[3242, 3251], "valid"], [[3252, 3252], "disallowed"], [[3253, 3257], "valid"], [[3258, 3259], "disallowed"], [[3260, 3261], "valid"], [[3262, 3268], "valid"], [[3269, 3269], "disallowed"], [[3270, 3272], "valid"], [[3273, 3273], "disallowed"], [[3274, 3277], "valid"], [[3278, 3284], "disallowed"], [[3285, 3286], "valid"], [[3287, 3293], "disallowed"], [[3294, 3294], "valid"], [[3295, 3295], "disallowed"], [[3296, 3297], "valid"], [[3298, 3299], "valid"], [[3300, 3301], "disallowed"], [[3302, 3311], "valid"], [[3312, 3312], "disallowed"], [[3313, 3314], "valid"], [[3315, 3328], "disallowed"], [[3329, 3329], "valid"], [[3330, 3331], "valid"], [[3332, 3332], "disallowed"], [[3333, 3340], "valid"], [[3341, 3341], "disallowed"], [[3342, 3344], "valid"], [[3345, 3345], "disallowed"], [[3346, 3368], "valid"], [[3369, 3369], "valid"], [[3370, 3385], "valid"], [[3386, 3386], "valid"], [[3387, 3388], "disallowed"], [[3389, 3389], "valid"], [[3390, 3395], "valid"], [[3396, 3396], "valid"], [[3397, 3397], "disallowed"], [[3398, 3400], "valid"], [[3401, 3401], "disallowed"], [[3402, 3405], "valid"], [[3406, 3406], "valid"], [[3407, 3414], "disallowed"], [[3415, 3415], "valid"], [[3416, 3422], "disallowed"], [[3423, 3423], "valid"], [[3424, 3425], "valid"], [[3426, 3427], "valid"], [[3428, 3429], "disallowed"], [[3430, 3439], "valid"], [[3440, 3445], "valid", [], "NV8"], [[3446, 3448], "disallowed"], [[3449, 3449], "valid", [], "NV8"], [[3450, 3455], "valid"], [[3456, 3457], "disallowed"], [[3458, 3459], "valid"], [[3460, 3460], "disallowed"], [[3461, 3478], "valid"], [[3479, 3481], "disallowed"], [[3482, 3505], "valid"], [[3506, 3506], "disallowed"], [[3507, 3515], "valid"], [[3516, 3516], "disallowed"], [[3517, 3517], "valid"], [[3518, 3519], "disallowed"], [[3520, 3526], "valid"], [[3527, 3529], "disallowed"], [[3530, 3530], "valid"], [[3531, 3534], "disallowed"], [[3535, 3540], "valid"], [[3541, 3541], "disallowed"], [[3542, 3542], "valid"], [[3543, 3543], "disallowed"], [[3544, 3551], "valid"], [[3552, 3557], "disallowed"], [[3558, 3567], "valid"], [[3568, 3569], "disallowed"], [[3570, 3571], "valid"], [[3572, 3572], "valid", [], "NV8"], [[3573, 3584], "disallowed"], [[3585, 3634], "valid"], [[3635, 3635], "mapped", [3661, 3634]], [[3636, 3642], "valid"], [[3643, 3646], "disallowed"], [[3647, 3647], "valid", [], "NV8"], [[3648, 3662], "valid"], [[3663, 3663], "valid", [], "NV8"], [[3664, 3673], "valid"], [[3674, 3675], "valid", [], "NV8"], [[3676, 3712], "disallowed"], [[3713, 3714], "valid"], [[3715, 3715], "disallowed"], [[3716, 3716], "valid"], [[3717, 3718], "disallowed"], [[3719, 3720], "valid"], [[3721, 3721], "disallowed"], [[3722, 3722], "valid"], [[3723, 3724], "disallowed"], [[3725, 3725], "valid"], [[3726, 3731], "disallowed"], [[3732, 3735], "valid"], [[3736, 3736], "disallowed"], [[3737, 3743], "valid"], [[3744, 3744], "disallowed"], [[3745, 3747], "valid"], [[3748, 3748], "disallowed"], [[3749, 3749], "valid"], [[3750, 3750], "disallowed"], [[3751, 3751], "valid"], [[3752, 3753], "disallowed"], [[3754, 3755], "valid"], [[3756, 3756], "disallowed"], [[3757, 3762], "valid"], [[3763, 3763], "mapped", [3789, 3762]], [[3764, 3769], "valid"], [[3770, 3770], "disallowed"], [[3771, 3773], "valid"], [[3774, 3775], "disallowed"], [[3776, 3780], "valid"], [[3781, 3781], "disallowed"], [[3782, 3782], "valid"], [[3783, 3783], "disallowed"], [[3784, 3789], "valid"], [[3790, 3791], "disallowed"], [[3792, 3801], "valid"], [[3802, 3803], "disallowed"], [[3804, 3804], "mapped", [3755, 3737]], [[3805, 3805], "mapped", [3755, 3745]], [[3806, 3807], "valid"], [[3808, 3839], "disallowed"], [[3840, 3840], "valid"], [[3841, 3850], "valid", [], "NV8"], [[3851, 3851], "valid"], [[3852, 3852], "mapped", [3851]], [[3853, 3863], "valid", [], "NV8"], [[3864, 3865], "valid"], [[3866, 3871], "valid", [], "NV8"], [[3872, 3881], "valid"], [[3882, 3892], "valid", [], "NV8"], [[3893, 3893], "valid"], [[3894, 3894], "valid", [], "NV8"], [[3895, 3895], "valid"], [[3896, 3896], "valid", [], "NV8"], [[3897, 3897], "valid"], [[3898, 3901], "valid", [], "NV8"], [[3902, 3906], "valid"], [[3907, 3907], "mapped", [3906, 4023]], [[3908, 3911], "valid"], [[3912, 3912], "disallowed"], [[3913, 3916], "valid"], [[3917, 3917], "mapped", [3916, 4023]], [[3918, 3921], "valid"], [[3922, 3922], "mapped", [3921, 4023]], [[3923, 3926], "valid"], [[3927, 3927], "mapped", [3926, 4023]], [[3928, 3931], "valid"], [[3932, 3932], "mapped", [3931, 4023]], [[3933, 3944], "valid"], [[3945, 3945], "mapped", [3904, 4021]], [[3946, 3946], "valid"], [[3947, 3948], "valid"], [[3949, 3952], "disallowed"], [[3953, 3954], "valid"], [[3955, 3955], "mapped", [3953, 3954]], [[3956, 3956], "valid"], [[3957, 3957], "mapped", [3953, 3956]], [[3958, 3958], "mapped", [4018, 3968]], [[3959, 3959], "mapped", [4018, 3953, 3968]], [[3960, 3960], "mapped", [4019, 3968]], [[3961, 3961], "mapped", [4019, 3953, 3968]], [[3962, 3968], "valid"], [[3969, 3969], "mapped", [3953, 3968]], [[3970, 3972], "valid"], [[3973, 3973], "valid", [], "NV8"], [[3974, 3979], "valid"], [[3980, 3983], "valid"], [[3984, 3986], "valid"], [[3987, 3987], "mapped", [3986, 4023]], [[3988, 3989], "valid"], [[3990, 3990], "valid"], [[3991, 3991], "valid"], [[3992, 3992], "disallowed"], [[3993, 3996], "valid"], [[3997, 3997], "mapped", [3996, 4023]], [[3998, 4001], "valid"], [[4002, 4002], "mapped", [4001, 4023]], [[4003, 4006], "valid"], [[4007, 4007], "mapped", [4006, 4023]], [[4008, 4011], "valid"], [[4012, 4012], "mapped", [4011, 4023]], [[4013, 4013], "valid"], [[4014, 4016], "valid"], [[4017, 4023], "valid"], [[4024, 4024], "valid"], [[4025, 4025], "mapped", [3984, 4021]], [[4026, 4028], "valid"], [[4029, 4029], "disallowed"], [[4030, 4037], "valid", [], "NV8"], [[4038, 4038], "valid"], [[4039, 4044], "valid", [], "NV8"], [[4045, 4045], "disallowed"], [[4046, 4046], "valid", [], "NV8"], [[4047, 4047], "valid", [], "NV8"], [[4048, 4049], "valid", [], "NV8"], [[4050, 4052], "valid", [], "NV8"], [[4053, 4056], "valid", [], "NV8"], [[4057, 4058], "valid", [], "NV8"], [[4059, 4095], "disallowed"], [[4096, 4129], "valid"], [[4130, 4130], "valid"], [[4131, 4135], "valid"], [[4136, 4136], "valid"], [[4137, 4138], "valid"], [[4139, 4139], "valid"], [[4140, 4146], "valid"], [[4147, 4149], "valid"], [[4150, 4153], "valid"], [[4154, 4159], "valid"], [[4160, 4169], "valid"], [[4170, 4175], "valid", [], "NV8"], [[4176, 4185], "valid"], [[4186, 4249], "valid"], [[4250, 4253], "valid"], [[4254, 4255], "valid", [], "NV8"], [[4256, 4293], "disallowed"], [[4294, 4294], "disallowed"], [[4295, 4295], "mapped", [11559]], [[4296, 4300], "disallowed"], [[4301, 4301], "mapped", [11565]], [[4302, 4303], "disallowed"], [[4304, 4342], "valid"], [[4343, 4344], "valid"], [[4345, 4346], "valid"], [[4347, 4347], "valid", [], "NV8"], [[4348, 4348], "mapped", [4316]], [[4349, 4351], "valid"], [[4352, 4441], "valid", [], "NV8"], [[4442, 4446], "valid", [], "NV8"], [[4447, 4448], "disallowed"], [[4449, 4514], "valid", [], "NV8"], [[4515, 4519], "valid", [], "NV8"], [[4520, 4601], "valid", [], "NV8"], [[4602, 4607], "valid", [], "NV8"], [[4608, 4614], "valid"], [[4615, 4615], "valid"], [[4616, 4678], "valid"], [[4679, 4679], "valid"], [[4680, 4680], "valid"], [[4681, 4681], "disallowed"], [[4682, 4685], "valid"], [[4686, 4687], "disallowed"], [[4688, 4694], "valid"], [[4695, 4695], "disallowed"], [[4696, 4696], "valid"], [[4697, 4697], "disallowed"], [[4698, 4701], "valid"], [[4702, 4703], "disallowed"], [[4704, 4742], "valid"], [[4743, 4743], "valid"], [[4744, 4744], "valid"], [[4745, 4745], "disallowed"], [[4746, 4749], "valid"], [[4750, 4751], "disallowed"], [[4752, 4782], "valid"], [[4783, 4783], "valid"], [[4784, 4784], "valid"], [[4785, 4785], "disallowed"], [[4786, 4789], "valid"], [[4790, 4791], "disallowed"], [[4792, 4798], "valid"], [[4799, 4799], "disallowed"], [[4800, 4800], "valid"], [[4801, 4801], "disallowed"], [[4802, 4805], "valid"], [[4806, 4807], "disallowed"], [[4808, 4814], "valid"], [[4815, 4815], "valid"], [[4816, 4822], "valid"], [[4823, 4823], "disallowed"], [[4824, 4846], "valid"], [[4847, 4847], "valid"], [[4848, 4878], "valid"], [[4879, 4879], "valid"], [[4880, 4880], "valid"], [[4881, 4881], "disallowed"], [[4882, 4885], "valid"], [[4886, 4887], "disallowed"], [[4888, 4894], "valid"], [[4895, 4895], "valid"], [[4896, 4934], "valid"], [[4935, 4935], "valid"], [[4936, 4954], "valid"], [[4955, 4956], "disallowed"], [[4957, 4958], "valid"], [[4959, 4959], "valid"], [[4960, 4960], "valid", [], "NV8"], [[4961, 4988], "valid", [], "NV8"], [[4989, 4991], "disallowed"], [[4992, 5007], "valid"], [[5008, 5017], "valid", [], "NV8"], [[5018, 5023], "disallowed"], [[5024, 5108], "valid"], [[5109, 5109], "valid"], [[5110, 5111], "disallowed"], [[5112, 5112], "mapped", [5104]], [[5113, 5113], "mapped", [5105]], [[5114, 5114], "mapped", [5106]], [[5115, 5115], "mapped", [5107]], [[5116, 5116], "mapped", [5108]], [[5117, 5117], "mapped", [5109]], [[5118, 5119], "disallowed"], [[5120, 5120], "valid", [], "NV8"], [[5121, 5740], "valid"], [[5741, 5742], "valid", [], "NV8"], [[5743, 5750], "valid"], [[5751, 5759], "valid"], [[5760, 5760], "disallowed"], [[5761, 5786], "valid"], [[5787, 5788], "valid", [], "NV8"], [[5789, 5791], "disallowed"], [[5792, 5866], "valid"], [[5867, 5872], "valid", [], "NV8"], [[5873, 5880], "valid"], [[5881, 5887], "disallowed"], [[5888, 5900], "valid"], [[5901, 5901], "disallowed"], [[5902, 5908], "valid"], [[5909, 5919], "disallowed"], [[5920, 5940], "valid"], [[5941, 5942], "valid", [], "NV8"], [[5943, 5951], "disallowed"], [[5952, 5971], "valid"], [[5972, 5983], "disallowed"], [[5984, 5996], "valid"], [[5997, 5997], "disallowed"], [[5998, 6e3], "valid"], [[6001, 6001], "disallowed"], [[6002, 6003], "valid"], [[6004, 6015], "disallowed"], [[6016, 6067], "valid"], [[6068, 6069], "disallowed"], [[6070, 6099], "valid"], [[6100, 6102], "valid", [], "NV8"], [[6103, 6103], "valid"], [[6104, 6107], "valid", [], "NV8"], [[6108, 6108], "valid"], [[6109, 6109], "valid"], [[6110, 6111], "disallowed"], [[6112, 6121], "valid"], [[6122, 6127], "disallowed"], [[6128, 6137], "valid", [], "NV8"], [[6138, 6143], "disallowed"], [[6144, 6149], "valid", [], "NV8"], [[6150, 6150], "disallowed"], [[6151, 6154], "valid", [], "NV8"], [[6155, 6157], "ignored"], [[6158, 6158], "disallowed"], [[6159, 6159], "disallowed"], [[6160, 6169], "valid"], [[6170, 6175], "disallowed"], [[6176, 6263], "valid"], [[6264, 6271], "disallowed"], [[6272, 6313], "valid"], [[6314, 6314], "valid"], [[6315, 6319], "disallowed"], [[6320, 6389], "valid"], [[6390, 6399], "disallowed"], [[6400, 6428], "valid"], [[6429, 6430], "valid"], [[6431, 6431], "disallowed"], [[6432, 6443], "valid"], [[6444, 6447], "disallowed"], [[6448, 6459], "valid"], [[6460, 6463], "disallowed"], [[6464, 6464], "valid", [], "NV8"], [[6465, 6467], "disallowed"], [[6468, 6469], "valid", [], "NV8"], [[6470, 6509], "valid"], [[6510, 6511], "disallowed"], [[6512, 6516], "valid"], [[6517, 6527], "disallowed"], [[6528, 6569], "valid"], [[6570, 6571], "valid"], [[6572, 6575], "disallowed"], [[6576, 6601], "valid"], [[6602, 6607], "disallowed"], [[6608, 6617], "valid"], [[6618, 6618], "valid", [], "XV8"], [[6619, 6621], "disallowed"], [[6622, 6623], "valid", [], "NV8"], [[6624, 6655], "valid", [], "NV8"], [[6656, 6683], "valid"], [[6684, 6685], "disallowed"], [[6686, 6687], "valid", [], "NV8"], [[6688, 6750], "valid"], [[6751, 6751], "disallowed"], [[6752, 6780], "valid"], [[6781, 6782], "disallowed"], [[6783, 6793], "valid"], [[6794, 6799], "disallowed"], [[6800, 6809], "valid"], [[6810, 6815], "disallowed"], [[6816, 6822], "valid", [], "NV8"], [[6823, 6823], "valid"], [[6824, 6829], "valid", [], "NV8"], [[6830, 6831], "disallowed"], [[6832, 6845], "valid"], [[6846, 6846], "valid", [], "NV8"], [[6847, 6911], "disallowed"], [[6912, 6987], "valid"], [[6988, 6991], "disallowed"], [[6992, 7001], "valid"], [[7002, 7018], "valid", [], "NV8"], [[7019, 7027], "valid"], [[7028, 7036], "valid", [], "NV8"], [[7037, 7039], "disallowed"], [[7040, 7082], "valid"], [[7083, 7085], "valid"], [[7086, 7097], "valid"], [[7098, 7103], "valid"], [[7104, 7155], "valid"], [[7156, 7163], "disallowed"], [[7164, 7167], "valid", [], "NV8"], [[7168, 7223], "valid"], [[7224, 7226], "disallowed"], [[7227, 7231], "valid", [], "NV8"], [[7232, 7241], "valid"], [[7242, 7244], "disallowed"], [[7245, 7293], "valid"], [[7294, 7295], "valid", [], "NV8"], [[7296, 7359], "disallowed"], [[7360, 7367], "valid", [], "NV8"], [[7368, 7375], "disallowed"], [[7376, 7378], "valid"], [[7379, 7379], "valid", [], "NV8"], [[7380, 7410], "valid"], [[7411, 7414], "valid"], [[7415, 7415], "disallowed"], [[7416, 7417], "valid"], [[7418, 7423], "disallowed"], [[7424, 7467], "valid"], [[7468, 7468], "mapped", [97]], [[7469, 7469], "mapped", [230]], [[7470, 7470], "mapped", [98]], [[7471, 7471], "valid"], [[7472, 7472], "mapped", [100]], [[7473, 7473], "mapped", [101]], [[7474, 7474], "mapped", [477]], [[7475, 7475], "mapped", [103]], [[7476, 7476], "mapped", [104]], [[7477, 7477], "mapped", [105]], [[7478, 7478], "mapped", [106]], [[7479, 7479], "mapped", [107]], [[7480, 7480], "mapped", [108]], [[7481, 7481], "mapped", [109]], [[7482, 7482], "mapped", [110]], [[7483, 7483], "valid"], [[7484, 7484], "mapped", [111]], [[7485, 7485], "mapped", [547]], [[7486, 7486], "mapped", [112]], [[7487, 7487], "mapped", [114]], [[7488, 7488], "mapped", [116]], [[7489, 7489], "mapped", [117]], [[7490, 7490], "mapped", [119]], [[7491, 7491], "mapped", [97]], [[7492, 7492], "mapped", [592]], [[7493, 7493], "mapped", [593]], [[7494, 7494], "mapped", [7426]], [[7495, 7495], "mapped", [98]], [[7496, 7496], "mapped", [100]], [[7497, 7497], "mapped", [101]], [[7498, 7498], "mapped", [601]], [[7499, 7499], "mapped", [603]], [[7500, 7500], "mapped", [604]], [[7501, 7501], "mapped", [103]], [[7502, 7502], "valid"], [[7503, 7503], "mapped", [107]], [[7504, 7504], "mapped", [109]], [[7505, 7505], "mapped", [331]], [[7506, 7506], "mapped", [111]], [[7507, 7507], "mapped", [596]], [[7508, 7508], "mapped", [7446]], [[7509, 7509], "mapped", [7447]], [[7510, 7510], "mapped", [112]], [[7511, 7511], "mapped", [116]], [[7512, 7512], "mapped", [117]], [[7513, 7513], "mapped", [7453]], [[7514, 7514], "mapped", [623]], [[7515, 7515], "mapped", [118]], [[7516, 7516], "mapped", [7461]], [[7517, 7517], "mapped", [946]], [[7518, 7518], "mapped", [947]], [[7519, 7519], "mapped", [948]], [[7520, 7520], "mapped", [966]], [[7521, 7521], "mapped", [967]], [[7522, 7522], "mapped", [105]], [[7523, 7523], "mapped", [114]], [[7524, 7524], "mapped", [117]], [[7525, 7525], "mapped", [118]], [[7526, 7526], "mapped", [946]], [[7527, 7527], "mapped", [947]], [[7528, 7528], "mapped", [961]], [[7529, 7529], "mapped", [966]], [[7530, 7530], "mapped", [967]], [[7531, 7531], "valid"], [[7532, 7543], "valid"], [[7544, 7544], "mapped", [1085]], [[7545, 7578], "valid"], [[7579, 7579], "mapped", [594]], [[7580, 7580], "mapped", [99]], [[7581, 7581], "mapped", [597]], [[7582, 7582], "mapped", [240]], [[7583, 7583], "mapped", [604]], [[7584, 7584], "mapped", [102]], [[7585, 7585], "mapped", [607]], [[7586, 7586], "mapped", [609]], [[7587, 7587], "mapped", [613]], [[7588, 7588], "mapped", [616]], [[7589, 7589], "mapped", [617]], [[7590, 7590], "mapped", [618]], [[7591, 7591], "mapped", [7547]], [[7592, 7592], "mapped", [669]], [[7593, 7593], "mapped", [621]], [[7594, 7594], "mapped", [7557]], [[7595, 7595], "mapped", [671]], [[7596, 7596], "mapped", [625]], [[7597, 7597], "mapped", [624]], [[7598, 7598], "mapped", [626]], [[7599, 7599], "mapped", [627]], [[7600, 7600], "mapped", [628]], [[7601, 7601], "mapped", [629]], [[7602, 7602], "mapped", [632]], [[7603, 7603], "mapped", [642]], [[7604, 7604], "mapped", [643]], [[7605, 7605], "mapped", [427]], [[7606, 7606], "mapped", [649]], [[7607, 7607], "mapped", [650]], [[7608, 7608], "mapped", [7452]], [[7609, 7609], "mapped", [651]], [[7610, 7610], "mapped", [652]], [[7611, 7611], "mapped", [122]], [[7612, 7612], "mapped", [656]], [[7613, 7613], "mapped", [657]], [[7614, 7614], "mapped", [658]], [[7615, 7615], "mapped", [952]], [[7616, 7619], "valid"], [[7620, 7626], "valid"], [[7627, 7654], "valid"], [[7655, 7669], "valid"], [[7670, 7675], "disallowed"], [[7676, 7676], "valid"], [[7677, 7677], "valid"], [[7678, 7679], "valid"], [[7680, 7680], "mapped", [7681]], [[7681, 7681], "valid"], [[7682, 7682], "mapped", [7683]], [[7683, 7683], "valid"], [[7684, 7684], "mapped", [7685]], [[7685, 7685], "valid"], [[7686, 7686], "mapped", [7687]], [[7687, 7687], "valid"], [[7688, 7688], "mapped", [7689]], [[7689, 7689], "valid"], [[7690, 7690], "mapped", [7691]], [[7691, 7691], "valid"], [[7692, 7692], "mapped", [7693]], [[7693, 7693], "valid"], [[7694, 7694], "mapped", [7695]], [[7695, 7695], "valid"], [[7696, 7696], "mapped", [7697]], [[7697, 7697], "valid"], [[7698, 7698], "mapped", [7699]], [[7699, 7699], "valid"], [[7700, 7700], "mapped", [7701]], [[7701, 7701], "valid"], [[7702, 7702], "mapped", [7703]], [[7703, 7703], "valid"], [[7704, 7704], "mapped", [7705]], [[7705, 7705], "valid"], [[7706, 7706], "mapped", [7707]], [[7707, 7707], "valid"], [[7708, 7708], "mapped", [7709]], [[7709, 7709], "valid"], [[7710, 7710], "mapped", [7711]], [[7711, 7711], "valid"], [[7712, 7712], "mapped", [7713]], [[7713, 7713], "valid"], [[7714, 7714], "mapped", [7715]], [[7715, 7715], "valid"], [[7716, 7716], "mapped", [7717]], [[7717, 7717], "valid"], [[7718, 7718], "mapped", [7719]], [[7719, 7719], "valid"], [[7720, 7720], "mapped", [7721]], [[7721, 7721], "valid"], [[7722, 7722], "mapped", [7723]], [[7723, 7723], "valid"], [[7724, 7724], "mapped", [7725]], [[7725, 7725], "valid"], [[7726, 7726], "mapped", [7727]], [[7727, 7727], "valid"], [[7728, 7728], "mapped", [7729]], [[7729, 7729], "valid"], [[7730, 7730], "mapped", [7731]], [[7731, 7731], "valid"], [[7732, 7732], "mapped", [7733]], [[7733, 7733], "valid"], [[7734, 7734], "mapped", [7735]], [[7735, 7735], "valid"], [[7736, 7736], "mapped", [7737]], [[7737, 7737], "valid"], [[7738, 7738], "mapped", [7739]], [[7739, 7739], "valid"], [[7740, 7740], "mapped", [7741]], [[7741, 7741], "valid"], [[7742, 7742], "mapped", [7743]], [[7743, 7743], "valid"], [[7744, 7744], "mapped", [7745]], [[7745, 7745], "valid"], [[7746, 7746], "mapped", [7747]], [[7747, 7747], "valid"], [[7748, 7748], "mapped", [7749]], [[7749, 7749], "valid"], [[7750, 7750], "mapped", [7751]], [[7751, 7751], "valid"], [[7752, 7752], "mapped", [7753]], [[7753, 7753], "valid"], [[7754, 7754], "mapped", [7755]], [[7755, 7755], "valid"], [[7756, 7756], "mapped", [7757]], [[7757, 7757], "valid"], [[7758, 7758], "mapped", [7759]], [[7759, 7759], "valid"], [[7760, 7760], "mapped", [7761]], [[7761, 7761], "valid"], [[7762, 7762], "mapped", [7763]], [[7763, 7763], "valid"], [[7764, 7764], "mapped", [7765]], [[7765, 7765], "valid"], [[7766, 7766], "mapped", [7767]], [[7767, 7767], "valid"], [[7768, 7768], "mapped", [7769]], [[7769, 7769], "valid"], [[7770, 7770], "mapped", [7771]], [[7771, 7771], "valid"], [[7772, 7772], "mapped", [7773]], [[7773, 7773], "valid"], [[7774, 7774], "mapped", [7775]], [[7775, 7775], "valid"], [[7776, 7776], "mapped", [7777]], [[7777, 7777], "valid"], [[7778, 7778], "mapped", [7779]], [[7779, 7779], "valid"], [[7780, 7780], "mapped", [7781]], [[7781, 7781], "valid"], [[7782, 7782], "mapped", [7783]], [[7783, 7783], "valid"], [[7784, 7784], "mapped", [7785]], [[7785, 7785], "valid"], [[7786, 7786], "mapped", [7787]], [[7787, 7787], "valid"], [[7788, 7788], "mapped", [7789]], [[7789, 7789], "valid"], [[7790, 7790], "mapped", [7791]], [[7791, 7791], "valid"], [[7792, 7792], "mapped", [7793]], [[7793, 7793], "valid"], [[7794, 7794], "mapped", [7795]], [[7795, 7795], "valid"], [[7796, 7796], "mapped", [7797]], [[7797, 7797], "valid"], [[7798, 7798], "mapped", [7799]], [[7799, 7799], "valid"], [[7800, 7800], "mapped", [7801]], [[7801, 7801], "valid"], [[7802, 7802], "mapped", [7803]], [[7803, 7803], "valid"], [[7804, 7804], "mapped", [7805]], [[7805, 7805], "valid"], [[7806, 7806], "mapped", [7807]], [[7807, 7807], "valid"], [[7808, 7808], "mapped", [7809]], [[7809, 7809], "valid"], [[7810, 7810], "mapped", [7811]], [[7811, 7811], "valid"], [[7812, 7812], "mapped", [7813]], [[7813, 7813], "valid"], [[7814, 7814], "mapped", [7815]], [[7815, 7815], "valid"], [[7816, 7816], "mapped", [7817]], [[7817, 7817], "valid"], [[7818, 7818], "mapped", [7819]], [[7819, 7819], "valid"], [[7820, 7820], "mapped", [7821]], [[7821, 7821], "valid"], [[7822, 7822], "mapped", [7823]], [[7823, 7823], "valid"], [[7824, 7824], "mapped", [7825]], [[7825, 7825], "valid"], [[7826, 7826], "mapped", [7827]], [[7827, 7827], "valid"], [[7828, 7828], "mapped", [7829]], [[7829, 7833], "valid"], [[7834, 7834], "mapped", [97, 702]], [[7835, 7835], "mapped", [7777]], [[7836, 7837], "valid"], [[7838, 7838], "mapped", [115, 115]], [[7839, 7839], "valid"], [[7840, 7840], "mapped", [7841]], [[7841, 7841], "valid"], [[7842, 7842], "mapped", [7843]], [[7843, 7843], "valid"], [[7844, 7844], "mapped", [7845]], [[7845, 7845], "valid"], [[7846, 7846], "mapped", [7847]], [[7847, 7847], "valid"], [[7848, 7848], "mapped", [7849]], [[7849, 7849], "valid"], [[7850, 7850], "mapped", [7851]], [[7851, 7851], "valid"], [[7852, 7852], "mapped", [7853]], [[7853, 7853], "valid"], [[7854, 7854], "mapped", [7855]], [[7855, 7855], "valid"], [[7856, 7856], "mapped", [7857]], [[7857, 7857], "valid"], [[7858, 7858], "mapped", [7859]], [[7859, 7859], "valid"], [[7860, 7860], "mapped", [7861]], [[7861, 7861], "valid"], [[7862, 7862], "mapped", [7863]], [[7863, 7863], "valid"], [[7864, 7864], "mapped", [7865]], [[7865, 7865], "valid"], [[7866, 7866], "mapped", [7867]], [[7867, 7867], "valid"], [[7868, 7868], "mapped", [7869]], [[7869, 7869], "valid"], [[7870, 7870], "mapped", [7871]], [[7871, 7871], "valid"], [[7872, 7872], "mapped", [7873]], [[7873, 7873], "valid"], [[7874, 7874], "mapped", [7875]], [[7875, 7875], "valid"], [[7876, 7876], "mapped", [7877]], [[7877, 7877], "valid"], [[7878, 7878], "mapped", [7879]], [[7879, 7879], "valid"], [[7880, 7880], "mapped", [7881]], [[7881, 7881], "valid"], [[7882, 7882], "mapped", [7883]], [[7883, 7883], "valid"], [[7884, 7884], "mapped", [7885]], [[7885, 7885], "valid"], [[7886, 7886], "mapped", [7887]], [[7887, 7887], "valid"], [[7888, 7888], "mapped", [7889]], [[7889, 7889], "valid"], [[7890, 7890], "mapped", [7891]], [[7891, 7891], "valid"], [[7892, 7892], "mapped", [7893]], [[7893, 7893], "valid"], [[7894, 7894], "mapped", [7895]], [[7895, 7895], "valid"], [[7896, 7896], "mapped", [7897]], [[7897, 7897], "valid"], [[7898, 7898], "mapped", [7899]], [[7899, 7899], "valid"], [[7900, 7900], "mapped", [7901]], [[7901, 7901], "valid"], [[7902, 7902], "mapped", [7903]], [[7903, 7903], "valid"], [[7904, 7904], "mapped", [7905]], [[7905, 7905], "valid"], [[7906, 7906], "mapped", [7907]], [[7907, 7907], "valid"], [[7908, 7908], "mapped", [7909]], [[7909, 7909], "valid"], [[7910, 7910], "mapped", [7911]], [[7911, 7911], "valid"], [[7912, 7912], "mapped", [7913]], [[7913, 7913], "valid"], [[7914, 7914], "mapped", [7915]], [[7915, 7915], "valid"], [[7916, 7916], "mapped", [7917]], [[7917, 7917], "valid"], [[7918, 7918], "mapped", [7919]], [[7919, 7919], "valid"], [[7920, 7920], "mapped", [7921]], [[7921, 7921], "valid"], [[7922, 7922], "mapped", [7923]], [[7923, 7923], "valid"], [[7924, 7924], "mapped", [7925]], [[7925, 7925], "valid"], [[7926, 7926], "mapped", [7927]], [[7927, 7927], "valid"], [[7928, 7928], "mapped", [7929]], [[7929, 7929], "valid"], [[7930, 7930], "mapped", [7931]], [[7931, 7931], "valid"], [[7932, 7932], "mapped", [7933]], [[7933, 7933], "valid"], [[7934, 7934], "mapped", [7935]], [[7935, 7935], "valid"], [[7936, 7943], "valid"], [[7944, 7944], "mapped", [7936]], [[7945, 7945], "mapped", [7937]], [[7946, 7946], "mapped", [7938]], [[7947, 7947], "mapped", [7939]], [[7948, 7948], "mapped", [7940]], [[7949, 7949], "mapped", [7941]], [[7950, 7950], "mapped", [7942]], [[7951, 7951], "mapped", [7943]], [[7952, 7957], "valid"], [[7958, 7959], "disallowed"], [[7960, 7960], "mapped", [7952]], [[7961, 7961], "mapped", [7953]], [[7962, 7962], "mapped", [7954]], [[7963, 7963], "mapped", [7955]], [[7964, 7964], "mapped", [7956]], [[7965, 7965], "mapped", [7957]], [[7966, 7967], "disallowed"], [[7968, 7975], "valid"], [[7976, 7976], "mapped", [7968]], [[7977, 7977], "mapped", [7969]], [[7978, 7978], "mapped", [7970]], [[7979, 7979], "mapped", [7971]], [[7980, 7980], "mapped", [7972]], [[7981, 7981], "mapped", [7973]], [[7982, 7982], "mapped", [7974]], [[7983, 7983], "mapped", [7975]], [[7984, 7991], "valid"], [[7992, 7992], "mapped", [7984]], [[7993, 7993], "mapped", [7985]], [[7994, 7994], "mapped", [7986]], [[7995, 7995], "mapped", [7987]], [[7996, 7996], "mapped", [7988]], [[7997, 7997], "mapped", [7989]], [[7998, 7998], "mapped", [7990]], [[7999, 7999], "mapped", [7991]], [[8e3, 8005], "valid"], [[8006, 8007], "disallowed"], [[8008, 8008], "mapped", [8e3]], [[8009, 8009], "mapped", [8001]], [[8010, 8010], "mapped", [8002]], [[8011, 8011], "mapped", [8003]], [[8012, 8012], "mapped", [8004]], [[8013, 8013], "mapped", [8005]], [[8014, 8015], "disallowed"], [[8016, 8023], "valid"], [[8024, 8024], "disallowed"], [[8025, 8025], "mapped", [8017]], [[8026, 8026], "disallowed"], [[8027, 8027], "mapped", [8019]], [[8028, 8028], "disallowed"], [[8029, 8029], "mapped", [8021]], [[8030, 8030], "disallowed"], [[8031, 8031], "mapped", [8023]], [[8032, 8039], "valid"], [[8040, 8040], "mapped", [8032]], [[8041, 8041], "mapped", [8033]], [[8042, 8042], "mapped", [8034]], [[8043, 8043], "mapped", [8035]], [[8044, 8044], "mapped", [8036]], [[8045, 8045], "mapped", [8037]], [[8046, 8046], "mapped", [8038]], [[8047, 8047], "mapped", [8039]], [[8048, 8048], "valid"], [[8049, 8049], "mapped", [940]], [[8050, 8050], "valid"], [[8051, 8051], "mapped", [941]], [[8052, 8052], "valid"], [[8053, 8053], "mapped", [942]], [[8054, 8054], "valid"], [[8055, 8055], "mapped", [943]], [[8056, 8056], "valid"], [[8057, 8057], "mapped", [972]], [[8058, 8058], "valid"], [[8059, 8059], "mapped", [973]], [[8060, 8060], "valid"], [[8061, 8061], "mapped", [974]], [[8062, 8063], "disallowed"], [[8064, 8064], "mapped", [7936, 953]], [[8065, 8065], "mapped", [7937, 953]], [[8066, 8066], "mapped", [7938, 953]], [[8067, 8067], "mapped", [7939, 953]], [[8068, 8068], "mapped", [7940, 953]], [[8069, 8069], "mapped", [7941, 953]], [[8070, 8070], "mapped", [7942, 953]], [[8071, 8071], "mapped", [7943, 953]], [[8072, 8072], "mapped", [7936, 953]], [[8073, 8073], "mapped", [7937, 953]], [[8074, 8074], "mapped", [7938, 953]], [[8075, 8075], "mapped", [7939, 953]], [[8076, 8076], "mapped", [7940, 953]], [[8077, 8077], "mapped", [7941, 953]], [[8078, 8078], "mapped", [7942, 953]], [[8079, 8079], "mapped", [7943, 953]], [[8080, 8080], "mapped", [7968, 953]], [[8081, 8081], "mapped", [7969, 953]], [[8082, 8082], "mapped", [7970, 953]], [[8083, 8083], "mapped", [7971, 953]], [[8084, 8084], "mapped", [7972, 953]], [[8085, 8085], "mapped", [7973, 953]], [[8086, 8086], "mapped", [7974, 953]], [[8087, 8087], "mapped", [7975, 953]], [[8088, 8088], "mapped", [7968, 953]], [[8089, 8089], "mapped", [7969, 953]], [[8090, 8090], "mapped", [7970, 953]], [[8091, 8091], "mapped", [7971, 953]], [[8092, 8092], "mapped", [7972, 953]], [[8093, 8093], "mapped", [7973, 953]], [[8094, 8094], "mapped", [7974, 953]], [[8095, 8095], "mapped", [7975, 953]], [[8096, 8096], "mapped", [8032, 953]], [[8097, 8097], "mapped", [8033, 953]], [[8098, 8098], "mapped", [8034, 953]], [[8099, 8099], "mapped", [8035, 953]], [[8100, 8100], "mapped", [8036, 953]], [[8101, 8101], "mapped", [8037, 953]], [[8102, 8102], "mapped", [8038, 953]], [[8103, 8103], "mapped", [8039, 953]], [[8104, 8104], "mapped", [8032, 953]], [[8105, 8105], "mapped", [8033, 953]], [[8106, 8106], "mapped", [8034, 953]], [[8107, 8107], "mapped", [8035, 953]], [[8108, 8108], "mapped", [8036, 953]], [[8109, 8109], "mapped", [8037, 953]], [[8110, 8110], "mapped", [8038, 953]], [[8111, 8111], "mapped", [8039, 953]], [[8112, 8113], "valid"], [[8114, 8114], "mapped", [8048, 953]], [[8115, 8115], "mapped", [945, 953]], [[8116, 8116], "mapped", [940, 953]], [[8117, 8117], "disallowed"], [[8118, 8118], "valid"], [[8119, 8119], "mapped", [8118, 953]], [[8120, 8120], "mapped", [8112]], [[8121, 8121], "mapped", [8113]], [[8122, 8122], "mapped", [8048]], [[8123, 8123], "mapped", [940]], [[8124, 8124], "mapped", [945, 953]], [[8125, 8125], "disallowed_STD3_mapped", [32, 787]], [[8126, 8126], "mapped", [953]], [[8127, 8127], "disallowed_STD3_mapped", [32, 787]], [[8128, 8128], "disallowed_STD3_mapped", [32, 834]], [[8129, 8129], "disallowed_STD3_mapped", [32, 776, 834]], [[8130, 8130], "mapped", [8052, 953]], [[8131, 8131], "mapped", [951, 953]], [[8132, 8132], "mapped", [942, 953]], [[8133, 8133], "disallowed"], [[8134, 8134], "valid"], [[8135, 8135], "mapped", [8134, 953]], [[8136, 8136], "mapped", [8050]], [[8137, 8137], "mapped", [941]], [[8138, 8138], "mapped", [8052]], [[8139, 8139], "mapped", [942]], [[8140, 8140], "mapped", [951, 953]], [[8141, 8141], "disallowed_STD3_mapped", [32, 787, 768]], [[8142, 8142], "disallowed_STD3_mapped", [32, 787, 769]], [[8143, 8143], "disallowed_STD3_mapped", [32, 787, 834]], [[8144, 8146], "valid"], [[8147, 8147], "mapped", [912]], [[8148, 8149], "disallowed"], [[8150, 8151], "valid"], [[8152, 8152], "mapped", [8144]], [[8153, 8153], "mapped", [8145]], [[8154, 8154], "mapped", [8054]], [[8155, 8155], "mapped", [943]], [[8156, 8156], "disallowed"], [[8157, 8157], "disallowed_STD3_mapped", [32, 788, 768]], [[8158, 8158], "disallowed_STD3_mapped", [32, 788, 769]], [[8159, 8159], "disallowed_STD3_mapped", [32, 788, 834]], [[8160, 8162], "valid"], [[8163, 8163], "mapped", [944]], [[8164, 8167], "valid"], [[8168, 8168], "mapped", [8160]], [[8169, 8169], "mapped", [8161]], [[8170, 8170], "mapped", [8058]], [[8171, 8171], "mapped", [973]], [[8172, 8172], "mapped", [8165]], [[8173, 8173], "disallowed_STD3_mapped", [32, 776, 768]], [[8174, 8174], "disallowed_STD3_mapped", [32, 776, 769]], [[8175, 8175], "disallowed_STD3_mapped", [96]], [[8176, 8177], "disallowed"], [[8178, 8178], "mapped", [8060, 953]], [[8179, 8179], "mapped", [969, 953]], [[8180, 8180], "mapped", [974, 953]], [[8181, 8181], "disallowed"], [[8182, 8182], "valid"], [[8183, 8183], "mapped", [8182, 953]], [[8184, 8184], "mapped", [8056]], [[8185, 8185], "mapped", [972]], [[8186, 8186], "mapped", [8060]], [[8187, 8187], "mapped", [974]], [[8188, 8188], "mapped", [969, 953]], [[8189, 8189], "disallowed_STD3_mapped", [32, 769]], [[8190, 8190], "disallowed_STD3_mapped", [32, 788]], [[8191, 8191], "disallowed"], [[8192, 8202], "disallowed_STD3_mapped", [32]], [[8203, 8203], "ignored"], [[8204, 8205], "deviation", []], [[8206, 8207], "disallowed"], [[8208, 8208], "valid", [], "NV8"], [[8209, 8209], "mapped", [8208]], [[8210, 8214], "valid", [], "NV8"], [[8215, 8215], "disallowed_STD3_mapped", [32, 819]], [[8216, 8227], "valid", [], "NV8"], [[8228, 8230], "disallowed"], [[8231, 8231], "valid", [], "NV8"], [[8232, 8238], "disallowed"], [[8239, 8239], "disallowed_STD3_mapped", [32]], [[8240, 8242], "valid", [], "NV8"], [[8243, 8243], "mapped", [8242, 8242]], [[8244, 8244], "mapped", [8242, 8242, 8242]], [[8245, 8245], "valid", [], "NV8"], [[8246, 8246], "mapped", [8245, 8245]], [[8247, 8247], "mapped", [8245, 8245, 8245]], [[8248, 8251], "valid", [], "NV8"], [[8252, 8252], "disallowed_STD3_mapped", [33, 33]], [[8253, 8253], "valid", [], "NV8"], [[8254, 8254], "disallowed_STD3_mapped", [32, 773]], [[8255, 8262], "valid", [], "NV8"], [[8263, 8263], "disallowed_STD3_mapped", [63, 63]], [[8264, 8264], "disallowed_STD3_mapped", [63, 33]], [[8265, 8265], "disallowed_STD3_mapped", [33, 63]], [[8266, 8269], "valid", [], "NV8"], [[8270, 8274], "valid", [], "NV8"], [[8275, 8276], "valid", [], "NV8"], [[8277, 8278], "valid", [], "NV8"], [[8279, 8279], "mapped", [8242, 8242, 8242, 8242]], [[8280, 8286], "valid", [], "NV8"], [[8287, 8287], "disallowed_STD3_mapped", [32]], [[8288, 8288], "ignored"], [[8289, 8291], "disallowed"], [[8292, 8292], "ignored"], [[8293, 8293], "disallowed"], [[8294, 8297], "disallowed"], [[8298, 8303], "disallowed"], [[8304, 8304], "mapped", [48]], [[8305, 8305], "mapped", [105]], [[8306, 8307], "disallowed"], [[8308, 8308], "mapped", [52]], [[8309, 8309], "mapped", [53]], [[8310, 8310], "mapped", [54]], [[8311, 8311], "mapped", [55]], [[8312, 8312], "mapped", [56]], [[8313, 8313], "mapped", [57]], [[8314, 8314], "disallowed_STD3_mapped", [43]], [[8315, 8315], "mapped", [8722]], [[8316, 8316], "disallowed_STD3_mapped", [61]], [[8317, 8317], "disallowed_STD3_mapped", [40]], [[8318, 8318], "disallowed_STD3_mapped", [41]], [[8319, 8319], "mapped", [110]], [[8320, 8320], "mapped", [48]], [[8321, 8321], "mapped", [49]], [[8322, 8322], "mapped", [50]], [[8323, 8323], "mapped", [51]], [[8324, 8324], "mapped", [52]], [[8325, 8325], "mapped", [53]], [[8326, 8326], "mapped", [54]], [[8327, 8327], "mapped", [55]], [[8328, 8328], "mapped", [56]], [[8329, 8329], "mapped", [57]], [[8330, 8330], "disallowed_STD3_mapped", [43]], [[8331, 8331], "mapped", [8722]], [[8332, 8332], "disallowed_STD3_mapped", [61]], [[8333, 8333], "disallowed_STD3_mapped", [40]], [[8334, 8334], "disallowed_STD3_mapped", [41]], [[8335, 8335], "disallowed"], [[8336, 8336], "mapped", [97]], [[8337, 8337], "mapped", [101]], [[8338, 8338], "mapped", [111]], [[8339, 8339], "mapped", [120]], [[8340, 8340], "mapped", [601]], [[8341, 8341], "mapped", [104]], [[8342, 8342], "mapped", [107]], [[8343, 8343], "mapped", [108]], [[8344, 8344], "mapped", [109]], [[8345, 8345], "mapped", [110]], [[8346, 8346], "mapped", [112]], [[8347, 8347], "mapped", [115]], [[8348, 8348], "mapped", [116]], [[8349, 8351], "disallowed"], [[8352, 8359], "valid", [], "NV8"], [[8360, 8360], "mapped", [114, 115]], [[8361, 8362], "valid", [], "NV8"], [[8363, 8363], "valid", [], "NV8"], [[8364, 8364], "valid", [], "NV8"], [[8365, 8367], "valid", [], "NV8"], [[8368, 8369], "valid", [], "NV8"], [[8370, 8373], "valid", [], "NV8"], [[8374, 8376], "valid", [], "NV8"], [[8377, 8377], "valid", [], "NV8"], [[8378, 8378], "valid", [], "NV8"], [[8379, 8381], "valid", [], "NV8"], [[8382, 8382], "valid", [], "NV8"], [[8383, 8399], "disallowed"], [[8400, 8417], "valid", [], "NV8"], [[8418, 8419], "valid", [], "NV8"], [[8420, 8426], "valid", [], "NV8"], [[8427, 8427], "valid", [], "NV8"], [[8428, 8431], "valid", [], "NV8"], [[8432, 8432], "valid", [], "NV8"], [[8433, 8447], "disallowed"], [[8448, 8448], "disallowed_STD3_mapped", [97, 47, 99]], [[8449, 8449], "disallowed_STD3_mapped", [97, 47, 115]], [[8450, 8450], "mapped", [99]], [[8451, 8451], "mapped", [176, 99]], [[8452, 8452], "valid", [], "NV8"], [[8453, 8453], "disallowed_STD3_mapped", [99, 47, 111]], [[8454, 8454], "disallowed_STD3_mapped", [99, 47, 117]], [[8455, 8455], "mapped", [603]], [[8456, 8456], "valid", [], "NV8"], [[8457, 8457], "mapped", [176, 102]], [[8458, 8458], "mapped", [103]], [[8459, 8462], "mapped", [104]], [[8463, 8463], "mapped", [295]], [[8464, 8465], "mapped", [105]], [[8466, 8467], "mapped", [108]], [[8468, 8468], "valid", [], "NV8"], [[8469, 8469], "mapped", [110]], [[8470, 8470], "mapped", [110, 111]], [[8471, 8472], "valid", [], "NV8"], [[8473, 8473], "mapped", [112]], [[8474, 8474], "mapped", [113]], [[8475, 8477], "mapped", [114]], [[8478, 8479], "valid", [], "NV8"], [[8480, 8480], "mapped", [115, 109]], [[8481, 8481], "mapped", [116, 101, 108]], [[8482, 8482], "mapped", [116, 109]], [[8483, 8483], "valid", [], "NV8"], [[8484, 8484], "mapped", [122]], [[8485, 8485], "valid", [], "NV8"], [[8486, 8486], "mapped", [969]], [[8487, 8487], "valid", [], "NV8"], [[8488, 8488], "mapped", [122]], [[8489, 8489], "valid", [], "NV8"], [[8490, 8490], "mapped", [107]], [[8491, 8491], "mapped", [229]], [[8492, 8492], "mapped", [98]], [[8493, 8493], "mapped", [99]], [[8494, 8494], "valid", [], "NV8"], [[8495, 8496], "mapped", [101]], [[8497, 8497], "mapped", [102]], [[8498, 8498], "disallowed"], [[8499, 8499], "mapped", [109]], [[8500, 8500], "mapped", [111]], [[8501, 8501], "mapped", [1488]], [[8502, 8502], "mapped", [1489]], [[8503, 8503], "mapped", [1490]], [[8504, 8504], "mapped", [1491]], [[8505, 8505], "mapped", [105]], [[8506, 8506], "valid", [], "NV8"], [[8507, 8507], "mapped", [102, 97, 120]], [[8508, 8508], "mapped", [960]], [[8509, 8510], "mapped", [947]], [[8511, 8511], "mapped", [960]], [[8512, 8512], "mapped", [8721]], [[8513, 8516], "valid", [], "NV8"], [[8517, 8518], "mapped", [100]], [[8519, 8519], "mapped", [101]], [[8520, 8520], "mapped", [105]], [[8521, 8521], "mapped", [106]], [[8522, 8523], "valid", [], "NV8"], [[8524, 8524], "valid", [], "NV8"], [[8525, 8525], "valid", [], "NV8"], [[8526, 8526], "valid"], [[8527, 8527], "valid", [], "NV8"], [[8528, 8528], "mapped", [49, 8260, 55]], [[8529, 8529], "mapped", [49, 8260, 57]], [[8530, 8530], "mapped", [49, 8260, 49, 48]], [[8531, 8531], "mapped", [49, 8260, 51]], [[8532, 8532], "mapped", [50, 8260, 51]], [[8533, 8533], "mapped", [49, 8260, 53]], [[8534, 8534], "mapped", [50, 8260, 53]], [[8535, 8535], "mapped", [51, 8260, 53]], [[8536, 8536], "mapped", [52, 8260, 53]], [[8537, 8537], "mapped", [49, 8260, 54]], [[8538, 8538], "mapped", [53, 8260, 54]], [[8539, 8539], "mapped", [49, 8260, 56]], [[8540, 8540], "mapped", [51, 8260, 56]], [[8541, 8541], "mapped", [53, 8260, 56]], [[8542, 8542], "mapped", [55, 8260, 56]], [[8543, 8543], "mapped", [49, 8260]], [[8544, 8544], "mapped", [105]], [[8545, 8545], "mapped", [105, 105]], [[8546, 8546], "mapped", [105, 105, 105]], [[8547, 8547], "mapped", [105, 118]], [[8548, 8548], "mapped", [118]], [[8549, 8549], "mapped", [118, 105]], [[8550, 8550], "mapped", [118, 105, 105]], [[8551, 8551], "mapped", [118, 105, 105, 105]], [[8552, 8552], "mapped", [105, 120]], [[8553, 8553], "mapped", [120]], [[8554, 8554], "mapped", [120, 105]], [[8555, 8555], "mapped", [120, 105, 105]], [[8556, 8556], "mapped", [108]], [[8557, 8557], "mapped", [99]], [[8558, 8558], "mapped", [100]], [[8559, 8559], "mapped", [109]], [[8560, 8560], "mapped", [105]], [[8561, 8561], "mapped", [105, 105]], [[8562, 8562], "mapped", [105, 105, 105]], [[8563, 8563], "mapped", [105, 118]], [[8564, 8564], "mapped", [118]], [[8565, 8565], "mapped", [118, 105]], [[8566, 8566], "mapped", [118, 105, 105]], [[8567, 8567], "mapped", [118, 105, 105, 105]], [[8568, 8568], "mapped", [105, 120]], [[8569, 8569], "mapped", [120]], [[8570, 8570], "mapped", [120, 105]], [[8571, 8571], "mapped", [120, 105, 105]], [[8572, 8572], "mapped", [108]], [[8573, 8573], "mapped", [99]], [[8574, 8574], "mapped", [100]], [[8575, 8575], "mapped", [109]], [[8576, 8578], "valid", [], "NV8"], [[8579, 8579], "disallowed"], [[8580, 8580], "valid"], [[8581, 8584], "valid", [], "NV8"], [[8585, 8585], "mapped", [48, 8260, 51]], [[8586, 8587], "valid", [], "NV8"], [[8588, 8591], "disallowed"], [[8592, 8682], "valid", [], "NV8"], [[8683, 8691], "valid", [], "NV8"], [[8692, 8703], "valid", [], "NV8"], [[8704, 8747], "valid", [], "NV8"], [[8748, 8748], "mapped", [8747, 8747]], [[8749, 8749], "mapped", [8747, 8747, 8747]], [[8750, 8750], "valid", [], "NV8"], [[8751, 8751], "mapped", [8750, 8750]], [[8752, 8752], "mapped", [8750, 8750, 8750]], [[8753, 8799], "valid", [], "NV8"], [[8800, 8800], "disallowed_STD3_valid"], [[8801, 8813], "valid", [], "NV8"], [[8814, 8815], "disallowed_STD3_valid"], [[8816, 8945], "valid", [], "NV8"], [[8946, 8959], "valid", [], "NV8"], [[8960, 8960], "valid", [], "NV8"], [[8961, 8961], "valid", [], "NV8"], [[8962, 9e3], "valid", [], "NV8"], [[9001, 9001], "mapped", [12296]], [[9002, 9002], "mapped", [12297]], [[9003, 9082], "valid", [], "NV8"], [[9083, 9083], "valid", [], "NV8"], [[9084, 9084], "valid", [], "NV8"], [[9085, 9114], "valid", [], "NV8"], [[9115, 9166], "valid", [], "NV8"], [[9167, 9168], "valid", [], "NV8"], [[9169, 9179], "valid", [], "NV8"], [[9180, 9191], "valid", [], "NV8"], [[9192, 9192], "valid", [], "NV8"], [[9193, 9203], "valid", [], "NV8"], [[9204, 9210], "valid", [], "NV8"], [[9211, 9215], "disallowed"], [[9216, 9252], "valid", [], "NV8"], [[9253, 9254], "valid", [], "NV8"], [[9255, 9279], "disallowed"], [[9280, 9290], "valid", [], "NV8"], [[9291, 9311], "disallowed"], [[9312, 9312], "mapped", [49]], [[9313, 9313], "mapped", [50]], [[9314, 9314], "mapped", [51]], [[9315, 9315], "mapped", [52]], [[9316, 9316], "mapped", [53]], [[9317, 9317], "mapped", [54]], [[9318, 9318], "mapped", [55]], [[9319, 9319], "mapped", [56]], [[9320, 9320], "mapped", [57]], [[9321, 9321], "mapped", [49, 48]], [[9322, 9322], "mapped", [49, 49]], [[9323, 9323], "mapped", [49, 50]], [[9324, 9324], "mapped", [49, 51]], [[9325, 9325], "mapped", [49, 52]], [[9326, 9326], "mapped", [49, 53]], [[9327, 9327], "mapped", [49, 54]], [[9328, 9328], "mapped", [49, 55]], [[9329, 9329], "mapped", [49, 56]], [[9330, 9330], "mapped", [49, 57]], [[9331, 9331], "mapped", [50, 48]], [[9332, 9332], "disallowed_STD3_mapped", [40, 49, 41]], [[9333, 9333], "disallowed_STD3_mapped", [40, 50, 41]], [[9334, 9334], "disallowed_STD3_mapped", [40, 51, 41]], [[9335, 9335], "disallowed_STD3_mapped", [40, 52, 41]], [[9336, 9336], "disallowed_STD3_mapped", [40, 53, 41]], [[9337, 9337], "disallowed_STD3_mapped", [40, 54, 41]], [[9338, 9338], "disallowed_STD3_mapped", [40, 55, 41]], [[9339, 9339], "disallowed_STD3_mapped", [40, 56, 41]], [[9340, 9340], "disallowed_STD3_mapped", [40, 57, 41]], [[9341, 9341], "disallowed_STD3_mapped", [40, 49, 48, 41]], [[9342, 9342], "disallowed_STD3_mapped", [40, 49, 49, 41]], [[9343, 9343], "disallowed_STD3_mapped", [40, 49, 50, 41]], [[9344, 9344], "disallowed_STD3_mapped", [40, 49, 51, 41]], [[9345, 9345], "disallowed_STD3_mapped", [40, 49, 52, 41]], [[9346, 9346], "disallowed_STD3_mapped", [40, 49, 53, 41]], [[9347, 9347], "disallowed_STD3_mapped", [40, 49, 54, 41]], [[9348, 9348], "disallowed_STD3_mapped", [40, 49, 55, 41]], [[9349, 9349], "disallowed_STD3_mapped", [40, 49, 56, 41]], [[9350, 9350], "disallowed_STD3_mapped", [40, 49, 57, 41]], [[9351, 9351], "disallowed_STD3_mapped", [40, 50, 48, 41]], [[9352, 9371], "disallowed"], [[9372, 9372], "disallowed_STD3_mapped", [40, 97, 41]], [[9373, 9373], "disallowed_STD3_mapped", [40, 98, 41]], [[9374, 9374], "disallowed_STD3_mapped", [40, 99, 41]], [[9375, 9375], "disallowed_STD3_mapped", [40, 100, 41]], [[9376, 9376], "disallowed_STD3_mapped", [40, 101, 41]], [[9377, 9377], "disallowed_STD3_mapped", [40, 102, 41]], [[9378, 9378], "disallowed_STD3_mapped", [40, 103, 41]], [[9379, 9379], "disallowed_STD3_mapped", [40, 104, 41]], [[9380, 9380], "disallowed_STD3_mapped", [40, 105, 41]], [[9381, 9381], "disallowed_STD3_mapped", [40, 106, 41]], [[9382, 9382], "disallowed_STD3_mapped", [40, 107, 41]], [[9383, 9383], "disallowed_STD3_mapped", [40, 108, 41]], [[9384, 9384], "disallowed_STD3_mapped", [40, 109, 41]], [[9385, 9385], "disallowed_STD3_mapped", [40, 110, 41]], [[9386, 9386], "disallowed_STD3_mapped", [40, 111, 41]], [[9387, 9387], "disallowed_STD3_mapped", [40, 112, 41]], [[9388, 9388], "disallowed_STD3_mapped", [40, 113, 41]], [[9389, 9389], "disallowed_STD3_mapped", [40, 114, 41]], [[9390, 9390], "disallowed_STD3_mapped", [40, 115, 41]], [[9391, 9391], "disallowed_STD3_mapped", [40, 116, 41]], [[9392, 9392], "disallowed_STD3_mapped", [40, 117, 41]], [[9393, 9393], "disallowed_STD3_mapped", [40, 118, 41]], [[9394, 9394], "disallowed_STD3_mapped", [40, 119, 41]], [[9395, 9395], "disallowed_STD3_mapped", [40, 120, 41]], [[9396, 9396], "disallowed_STD3_mapped", [40, 121, 41]], [[9397, 9397], "disallowed_STD3_mapped", [40, 122, 41]], [[9398, 9398], "mapped", [97]], [[9399, 9399], "mapped", [98]], [[9400, 9400], "mapped", [99]], [[9401, 9401], "mapped", [100]], [[9402, 9402], "mapped", [101]], [[9403, 9403], "mapped", [102]], [[9404, 9404], "mapped", [103]], [[9405, 9405], "mapped", [104]], [[9406, 9406], "mapped", [105]], [[9407, 9407], "mapped", [106]], [[9408, 9408], "mapped", [107]], [[9409, 9409], "mapped", [108]], [[9410, 9410], "mapped", [109]], [[9411, 9411], "mapped", [110]], [[9412, 9412], "mapped", [111]], [[9413, 9413], "mapped", [112]], [[9414, 9414], "mapped", [113]], [[9415, 9415], "mapped", [114]], [[9416, 9416], "mapped", [115]], [[9417, 9417], "mapped", [116]], [[9418, 9418], "mapped", [117]], [[9419, 9419], "mapped", [118]], [[9420, 9420], "mapped", [119]], [[9421, 9421], "mapped", [120]], [[9422, 9422], "mapped", [121]], [[9423, 9423], "mapped", [122]], [[9424, 9424], "mapped", [97]], [[9425, 9425], "mapped", [98]], [[9426, 9426], "mapped", [99]], [[9427, 9427], "mapped", [100]], [[9428, 9428], "mapped", [101]], [[9429, 9429], "mapped", [102]], [[9430, 9430], "mapped", [103]], [[9431, 9431], "mapped", [104]], [[9432, 9432], "mapped", [105]], [[9433, 9433], "mapped", [106]], [[9434, 9434], "mapped", [107]], [[9435, 9435], "mapped", [108]], [[9436, 9436], "mapped", [109]], [[9437, 9437], "mapped", [110]], [[9438, 9438], "mapped", [111]], [[9439, 9439], "mapped", [112]], [[9440, 9440], "mapped", [113]], [[9441, 9441], "mapped", [114]], [[9442, 9442], "mapped", [115]], [[9443, 9443], "mapped", [116]], [[9444, 9444], "mapped", [117]], [[9445, 9445], "mapped", [118]], [[9446, 9446], "mapped", [119]], [[9447, 9447], "mapped", [120]], [[9448, 9448], "mapped", [121]], [[9449, 9449], "mapped", [122]], [[9450, 9450], "mapped", [48]], [[9451, 9470], "valid", [], "NV8"], [[9471, 9471], "valid", [], "NV8"], [[9472, 9621], "valid", [], "NV8"], [[9622, 9631], "valid", [], "NV8"], [[9632, 9711], "valid", [], "NV8"], [[9712, 9719], "valid", [], "NV8"], [[9720, 9727], "valid", [], "NV8"], [[9728, 9747], "valid", [], "NV8"], [[9748, 9749], "valid", [], "NV8"], [[9750, 9751], "valid", [], "NV8"], [[9752, 9752], "valid", [], "NV8"], [[9753, 9753], "valid", [], "NV8"], [[9754, 9839], "valid", [], "NV8"], [[9840, 9841], "valid", [], "NV8"], [[9842, 9853], "valid", [], "NV8"], [[9854, 9855], "valid", [], "NV8"], [[9856, 9865], "valid", [], "NV8"], [[9866, 9873], "valid", [], "NV8"], [[9874, 9884], "valid", [], "NV8"], [[9885, 9885], "valid", [], "NV8"], [[9886, 9887], "valid", [], "NV8"], [[9888, 9889], "valid", [], "NV8"], [[9890, 9905], "valid", [], "NV8"], [[9906, 9906], "valid", [], "NV8"], [[9907, 9916], "valid", [], "NV8"], [[9917, 9919], "valid", [], "NV8"], [[9920, 9923], "valid", [], "NV8"], [[9924, 9933], "valid", [], "NV8"], [[9934, 9934], "valid", [], "NV8"], [[9935, 9953], "valid", [], "NV8"], [[9954, 9954], "valid", [], "NV8"], [[9955, 9955], "valid", [], "NV8"], [[9956, 9959], "valid", [], "NV8"], [[9960, 9983], "valid", [], "NV8"], [[9984, 9984], "valid", [], "NV8"], [[9985, 9988], "valid", [], "NV8"], [[9989, 9989], "valid", [], "NV8"], [[9990, 9993], "valid", [], "NV8"], [[9994, 9995], "valid", [], "NV8"], [[9996, 10023], "valid", [], "NV8"], [[10024, 10024], "valid", [], "NV8"], [[10025, 10059], "valid", [], "NV8"], [[10060, 10060], "valid", [], "NV8"], [[10061, 10061], "valid", [], "NV8"], [[10062, 10062], "valid", [], "NV8"], [[10063, 10066], "valid", [], "NV8"], [[10067, 10069], "valid", [], "NV8"], [[10070, 10070], "valid", [], "NV8"], [[10071, 10071], "valid", [], "NV8"], [[10072, 10078], "valid", [], "NV8"], [[10079, 10080], "valid", [], "NV8"], [[10081, 10087], "valid", [], "NV8"], [[10088, 10101], "valid", [], "NV8"], [[10102, 10132], "valid", [], "NV8"], [[10133, 10135], "valid", [], "NV8"], [[10136, 10159], "valid", [], "NV8"], [[10160, 10160], "valid", [], "NV8"], [[10161, 10174], "valid", [], "NV8"], [[10175, 10175], "valid", [], "NV8"], [[10176, 10182], "valid", [], "NV8"], [[10183, 10186], "valid", [], "NV8"], [[10187, 10187], "valid", [], "NV8"], [[10188, 10188], "valid", [], "NV8"], [[10189, 10189], "valid", [], "NV8"], [[10190, 10191], "valid", [], "NV8"], [[10192, 10219], "valid", [], "NV8"], [[10220, 10223], "valid", [], "NV8"], [[10224, 10239], "valid", [], "NV8"], [[10240, 10495], "valid", [], "NV8"], [[10496, 10763], "valid", [], "NV8"], [[10764, 10764], "mapped", [8747, 8747, 8747, 8747]], [[10765, 10867], "valid", [], "NV8"], [[10868, 10868], "disallowed_STD3_mapped", [58, 58, 61]], [[10869, 10869], "disallowed_STD3_mapped", [61, 61]], [[10870, 10870], "disallowed_STD3_mapped", [61, 61, 61]], [[10871, 10971], "valid", [], "NV8"], [[10972, 10972], "mapped", [10973, 824]], [[10973, 11007], "valid", [], "NV8"], [[11008, 11021], "valid", [], "NV8"], [[11022, 11027], "valid", [], "NV8"], [[11028, 11034], "valid", [], "NV8"], [[11035, 11039], "valid", [], "NV8"], [[11040, 11043], "valid", [], "NV8"], [[11044, 11084], "valid", [], "NV8"], [[11085, 11087], "valid", [], "NV8"], [[11088, 11092], "valid", [], "NV8"], [[11093, 11097], "valid", [], "NV8"], [[11098, 11123], "valid", [], "NV8"], [[11124, 11125], "disallowed"], [[11126, 11157], "valid", [], "NV8"], [[11158, 11159], "disallowed"], [[11160, 11193], "valid", [], "NV8"], [[11194, 11196], "disallowed"], [[11197, 11208], "valid", [], "NV8"], [[11209, 11209], "disallowed"], [[11210, 11217], "valid", [], "NV8"], [[11218, 11243], "disallowed"], [[11244, 11247], "valid", [], "NV8"], [[11248, 11263], "disallowed"], [[11264, 11264], "mapped", [11312]], [[11265, 11265], "mapped", [11313]], [[11266, 11266], "mapped", [11314]], [[11267, 11267], "mapped", [11315]], [[11268, 11268], "mapped", [11316]], [[11269, 11269], "mapped", [11317]], [[11270, 11270], "mapped", [11318]], [[11271, 11271], "mapped", [11319]], [[11272, 11272], "mapped", [11320]], [[11273, 11273], "mapped", [11321]], [[11274, 11274], "mapped", [11322]], [[11275, 11275], "mapped", [11323]], [[11276, 11276], "mapped", [11324]], [[11277, 11277], "mapped", [11325]], [[11278, 11278], "mapped", [11326]], [[11279, 11279], "mapped", [11327]], [[11280, 11280], "mapped", [11328]], [[11281, 11281], "mapped", [11329]], [[11282, 11282], "mapped", [11330]], [[11283, 11283], "mapped", [11331]], [[11284, 11284], "mapped", [11332]], [[11285, 11285], "mapped", [11333]], [[11286, 11286], "mapped", [11334]], [[11287, 11287], "mapped", [11335]], [[11288, 11288], "mapped", [11336]], [[11289, 11289], "mapped", [11337]], [[11290, 11290], "mapped", [11338]], [[11291, 11291], "mapped", [11339]], [[11292, 11292], "mapped", [11340]], [[11293, 11293], "mapped", [11341]], [[11294, 11294], "mapped", [11342]], [[11295, 11295], "mapped", [11343]], [[11296, 11296], "mapped", [11344]], [[11297, 11297], "mapped", [11345]], [[11298, 11298], "mapped", [11346]], [[11299, 11299], "mapped", [11347]], [[11300, 11300], "mapped", [11348]], [[11301, 11301], "mapped", [11349]], [[11302, 11302], "mapped", [11350]], [[11303, 11303], "mapped", [11351]], [[11304, 11304], "mapped", [11352]], [[11305, 11305], "mapped", [11353]], [[11306, 11306], "mapped", [11354]], [[11307, 11307], "mapped", [11355]], [[11308, 11308], "mapped", [11356]], [[11309, 11309], "mapped", [11357]], [[11310, 11310], "mapped", [11358]], [[11311, 11311], "disallowed"], [[11312, 11358], "valid"], [[11359, 11359], "disallowed"], [[11360, 11360], "mapped", [11361]], [[11361, 11361], "valid"], [[11362, 11362], "mapped", [619]], [[11363, 11363], "mapped", [7549]], [[11364, 11364], "mapped", [637]], [[11365, 11366], "valid"], [[11367, 11367], "mapped", [11368]], [[11368, 11368], "valid"], [[11369, 11369], "mapped", [11370]], [[11370, 11370], "valid"], [[11371, 11371], "mapped", [11372]], [[11372, 11372], "valid"], [[11373, 11373], "mapped", [593]], [[11374, 11374], "mapped", [625]], [[11375, 11375], "mapped", [592]], [[11376, 11376], "mapped", [594]], [[11377, 11377], "valid"], [[11378, 11378], "mapped", [11379]], [[11379, 11379], "valid"], [[11380, 11380], "valid"], [[11381, 11381], "mapped", [11382]], [[11382, 11383], "valid"], [[11384, 11387], "valid"], [[11388, 11388], "mapped", [106]], [[11389, 11389], "mapped", [118]], [[11390, 11390], "mapped", [575]], [[11391, 11391], "mapped", [576]], [[11392, 11392], "mapped", [11393]], [[11393, 11393], "valid"], [[11394, 11394], "mapped", [11395]], [[11395, 11395], "valid"], [[11396, 11396], "mapped", [11397]], [[11397, 11397], "valid"], [[11398, 11398], "mapped", [11399]], [[11399, 11399], "valid"], [[11400, 11400], "mapped", [11401]], [[11401, 11401], "valid"], [[11402, 11402], "mapped", [11403]], [[11403, 11403], "valid"], [[11404, 11404], "mapped", [11405]], [[11405, 11405], "valid"], [[11406, 11406], "mapped", [11407]], [[11407, 11407], "valid"], [[11408, 11408], "mapped", [11409]], [[11409, 11409], "valid"], [[11410, 11410], "mapped", [11411]], [[11411, 11411], "valid"], [[11412, 11412], "mapped", [11413]], [[11413, 11413], "valid"], [[11414, 11414], "mapped", [11415]], [[11415, 11415], "valid"], [[11416, 11416], "mapped", [11417]], [[11417, 11417], "valid"], [[11418, 11418], "mapped", [11419]], [[11419, 11419], "valid"], [[11420, 11420], "mapped", [11421]], [[11421, 11421], "valid"], [[11422, 11422], "mapped", [11423]], [[11423, 11423], "valid"], [[11424, 11424], "mapped", [11425]], [[11425, 11425], "valid"], [[11426, 11426], "mapped", [11427]], [[11427, 11427], "valid"], [[11428, 11428], "mapped", [11429]], [[11429, 11429], "valid"], [[11430, 11430], "mapped", [11431]], [[11431, 11431], "valid"], [[11432, 11432], "mapped", [11433]], [[11433, 11433], "valid"], [[11434, 11434], "mapped", [11435]], [[11435, 11435], "valid"], [[11436, 11436], "mapped", [11437]], [[11437, 11437], "valid"], [[11438, 11438], "mapped", [11439]], [[11439, 11439], "valid"], [[11440, 11440], "mapped", [11441]], [[11441, 11441], "valid"], [[11442, 11442], "mapped", [11443]], [[11443, 11443], "valid"], [[11444, 11444], "mapped", [11445]], [[11445, 11445], "valid"], [[11446, 11446], "mapped", [11447]], [[11447, 11447], "valid"], [[11448, 11448], "mapped", [11449]], [[11449, 11449], "valid"], [[11450, 11450], "mapped", [11451]], [[11451, 11451], "valid"], [[11452, 11452], "mapped", [11453]], [[11453, 11453], "valid"], [[11454, 11454], "mapped", [11455]], [[11455, 11455], "valid"], [[11456, 11456], "mapped", [11457]], [[11457, 11457], "valid"], [[11458, 11458], "mapped", [11459]], [[11459, 11459], "valid"], [[11460, 11460], "mapped", [11461]], [[11461, 11461], "valid"], [[11462, 11462], "mapped", [11463]], [[11463, 11463], "valid"], [[11464, 11464], "mapped", [11465]], [[11465, 11465], "valid"], [[11466, 11466], "mapped", [11467]], [[11467, 11467], "valid"], [[11468, 11468], "mapped", [11469]], [[11469, 11469], "valid"], [[11470, 11470], "mapped", [11471]], [[11471, 11471], "valid"], [[11472, 11472], "mapped", [11473]], [[11473, 11473], "valid"], [[11474, 11474], "mapped", [11475]], [[11475, 11475], "valid"], [[11476, 11476], "mapped", [11477]], [[11477, 11477], "valid"], [[11478, 11478], "mapped", [11479]], [[11479, 11479], "valid"], [[11480, 11480], "mapped", [11481]], [[11481, 11481], "valid"], [[11482, 11482], "mapped", [11483]], [[11483, 11483], "valid"], [[11484, 11484], "mapped", [11485]], [[11485, 11485], "valid"], [[11486, 11486], "mapped", [11487]], [[11487, 11487], "valid"], [[11488, 11488], "mapped", [11489]], [[11489, 11489], "valid"], [[11490, 11490], "mapped", [11491]], [[11491, 11492], "valid"], [[11493, 11498], "valid", [], "NV8"], [[11499, 11499], "mapped", [11500]], [[11500, 11500], "valid"], [[11501, 11501], "mapped", [11502]], [[11502, 11505], "valid"], [[11506, 11506], "mapped", [11507]], [[11507, 11507], "valid"], [[11508, 11512], "disallowed"], [[11513, 11519], "valid", [], "NV8"], [[11520, 11557], "valid"], [[11558, 11558], "disallowed"], [[11559, 11559], "valid"], [[11560, 11564], "disallowed"], [[11565, 11565], "valid"], [[11566, 11567], "disallowed"], [[11568, 11621], "valid"], [[11622, 11623], "valid"], [[11624, 11630], "disallowed"], [[11631, 11631], "mapped", [11617]], [[11632, 11632], "valid", [], "NV8"], [[11633, 11646], "disallowed"], [[11647, 11647], "valid"], [[11648, 11670], "valid"], [[11671, 11679], "disallowed"], [[11680, 11686], "valid"], [[11687, 11687], "disallowed"], [[11688, 11694], "valid"], [[11695, 11695], "disallowed"], [[11696, 11702], "valid"], [[11703, 11703], "disallowed"], [[11704, 11710], "valid"], [[11711, 11711], "disallowed"], [[11712, 11718], "valid"], [[11719, 11719], "disallowed"], [[11720, 11726], "valid"], [[11727, 11727], "disallowed"], [[11728, 11734], "valid"], [[11735, 11735], "disallowed"], [[11736, 11742], "valid"], [[11743, 11743], "disallowed"], [[11744, 11775], "valid"], [[11776, 11799], "valid", [], "NV8"], [[11800, 11803], "valid", [], "NV8"], [[11804, 11805], "valid", [], "NV8"], [[11806, 11822], "valid", [], "NV8"], [[11823, 11823], "valid"], [[11824, 11824], "valid", [], "NV8"], [[11825, 11825], "valid", [], "NV8"], [[11826, 11835], "valid", [], "NV8"], [[11836, 11842], "valid", [], "NV8"], [[11843, 11903], "disallowed"], [[11904, 11929], "valid", [], "NV8"], [[11930, 11930], "disallowed"], [[11931, 11934], "valid", [], "NV8"], [[11935, 11935], "mapped", [27597]], [[11936, 12018], "valid", [], "NV8"], [[12019, 12019], "mapped", [40863]], [[12020, 12031], "disallowed"], [[12032, 12032], "mapped", [19968]], [[12033, 12033], "mapped", [20008]], [[12034, 12034], "mapped", [20022]], [[12035, 12035], "mapped", [20031]], [[12036, 12036], "mapped", [20057]], [[12037, 12037], "mapped", [20101]], [[12038, 12038], "mapped", [20108]], [[12039, 12039], "mapped", [20128]], [[12040, 12040], "mapped", [20154]], [[12041, 12041], "mapped", [20799]], [[12042, 12042], "mapped", [20837]], [[12043, 12043], "mapped", [20843]], [[12044, 12044], "mapped", [20866]], [[12045, 12045], "mapped", [20886]], [[12046, 12046], "mapped", [20907]], [[12047, 12047], "mapped", [20960]], [[12048, 12048], "mapped", [20981]], [[12049, 12049], "mapped", [20992]], [[12050, 12050], "mapped", [21147]], [[12051, 12051], "mapped", [21241]], [[12052, 12052], "mapped", [21269]], [[12053, 12053], "mapped", [21274]], [[12054, 12054], "mapped", [21304]], [[12055, 12055], "mapped", [21313]], [[12056, 12056], "mapped", [21340]], [[12057, 12057], "mapped", [21353]], [[12058, 12058], "mapped", [21378]], [[12059, 12059], "mapped", [21430]], [[12060, 12060], "mapped", [21448]], [[12061, 12061], "mapped", [21475]], [[12062, 12062], "mapped", [22231]], [[12063, 12063], "mapped", [22303]], [[12064, 12064], "mapped", [22763]], [[12065, 12065], "mapped", [22786]], [[12066, 12066], "mapped", [22794]], [[12067, 12067], "mapped", [22805]], [[12068, 12068], "mapped", [22823]], [[12069, 12069], "mapped", [22899]], [[12070, 12070], "mapped", [23376]], [[12071, 12071], "mapped", [23424]], [[12072, 12072], "mapped", [23544]], [[12073, 12073], "mapped", [23567]], [[12074, 12074], "mapped", [23586]], [[12075, 12075], "mapped", [23608]], [[12076, 12076], "mapped", [23662]], [[12077, 12077], "mapped", [23665]], [[12078, 12078], "mapped", [24027]], [[12079, 12079], "mapped", [24037]], [[12080, 12080], "mapped", [24049]], [[12081, 12081], "mapped", [24062]], [[12082, 12082], "mapped", [24178]], [[12083, 12083], "mapped", [24186]], [[12084, 12084], "mapped", [24191]], [[12085, 12085], "mapped", [24308]], [[12086, 12086], "mapped", [24318]], [[12087, 12087], "mapped", [24331]], [[12088, 12088], "mapped", [24339]], [[12089, 12089], "mapped", [24400]], [[12090, 12090], "mapped", [24417]], [[12091, 12091], "mapped", [24435]], [[12092, 12092], "mapped", [24515]], [[12093, 12093], "mapped", [25096]], [[12094, 12094], "mapped", [25142]], [[12095, 12095], "mapped", [25163]], [[12096, 12096], "mapped", [25903]], [[12097, 12097], "mapped", [25908]], [[12098, 12098], "mapped", [25991]], [[12099, 12099], "mapped", [26007]], [[12100, 12100], "mapped", [26020]], [[12101, 12101], "mapped", [26041]], [[12102, 12102], "mapped", [26080]], [[12103, 12103], "mapped", [26085]], [[12104, 12104], "mapped", [26352]], [[12105, 12105], "mapped", [26376]], [[12106, 12106], "mapped", [26408]], [[12107, 12107], "mapped", [27424]], [[12108, 12108], "mapped", [27490]], [[12109, 12109], "mapped", [27513]], [[12110, 12110], "mapped", [27571]], [[12111, 12111], "mapped", [27595]], [[12112, 12112], "mapped", [27604]], [[12113, 12113], "mapped", [27611]], [[12114, 12114], "mapped", [27663]], [[12115, 12115], "mapped", [27668]], [[12116, 12116], "mapped", [27700]], [[12117, 12117], "mapped", [28779]], [[12118, 12118], "mapped", [29226]], [[12119, 12119], "mapped", [29238]], [[12120, 12120], "mapped", [29243]], [[12121, 12121], "mapped", [29247]], [[12122, 12122], "mapped", [29255]], [[12123, 12123], "mapped", [29273]], [[12124, 12124], "mapped", [29275]], [[12125, 12125], "mapped", [29356]], [[12126, 12126], "mapped", [29572]], [[12127, 12127], "mapped", [29577]], [[12128, 12128], "mapped", [29916]], [[12129, 12129], "mapped", [29926]], [[12130, 12130], "mapped", [29976]], [[12131, 12131], "mapped", [29983]], [[12132, 12132], "mapped", [29992]], [[12133, 12133], "mapped", [3e4]], [[12134, 12134], "mapped", [30091]], [[12135, 12135], "mapped", [30098]], [[12136, 12136], "mapped", [30326]], [[12137, 12137], "mapped", [30333]], [[12138, 12138], "mapped", [30382]], [[12139, 12139], "mapped", [30399]], [[12140, 12140], "mapped", [30446]], [[12141, 12141], "mapped", [30683]], [[12142, 12142], "mapped", [30690]], [[12143, 12143], "mapped", [30707]], [[12144, 12144], "mapped", [31034]], [[12145, 12145], "mapped", [31160]], [[12146, 12146], "mapped", [31166]], [[12147, 12147], "mapped", [31348]], [[12148, 12148], "mapped", [31435]], [[12149, 12149], "mapped", [31481]], [[12150, 12150], "mapped", [31859]], [[12151, 12151], "mapped", [31992]], [[12152, 12152], "mapped", [32566]], [[12153, 12153], "mapped", [32593]], [[12154, 12154], "mapped", [32650]], [[12155, 12155], "mapped", [32701]], [[12156, 12156], "mapped", [32769]], [[12157, 12157], "mapped", [32780]], [[12158, 12158], "mapped", [32786]], [[12159, 12159], "mapped", [32819]], [[12160, 12160], "mapped", [32895]], [[12161, 12161], "mapped", [32905]], [[12162, 12162], "mapped", [33251]], [[12163, 12163], "mapped", [33258]], [[12164, 12164], "mapped", [33267]], [[12165, 12165], "mapped", [33276]], [[12166, 12166], "mapped", [33292]], [[12167, 12167], "mapped", [33307]], [[12168, 12168], "mapped", [33311]], [[12169, 12169], "mapped", [33390]], [[12170, 12170], "mapped", [33394]], [[12171, 12171], "mapped", [33400]], [[12172, 12172], "mapped", [34381]], [[12173, 12173], "mapped", [34411]], [[12174, 12174], "mapped", [34880]], [[12175, 12175], "mapped", [34892]], [[12176, 12176], "mapped", [34915]], [[12177, 12177], "mapped", [35198]], [[12178, 12178], "mapped", [35211]], [[12179, 12179], "mapped", [35282]], [[12180, 12180], "mapped", [35328]], [[12181, 12181], "mapped", [35895]], [[12182, 12182], "mapped", [35910]], [[12183, 12183], "mapped", [35925]], [[12184, 12184], "mapped", [35960]], [[12185, 12185], "mapped", [35997]], [[12186, 12186], "mapped", [36196]], [[12187, 12187], "mapped", [36208]], [[12188, 12188], "mapped", [36275]], [[12189, 12189], "mapped", [36523]], [[12190, 12190], "mapped", [36554]], [[12191, 12191], "mapped", [36763]], [[12192, 12192], "mapped", [36784]], [[12193, 12193], "mapped", [36789]], [[12194, 12194], "mapped", [37009]], [[12195, 12195], "mapped", [37193]], [[12196, 12196], "mapped", [37318]], [[12197, 12197], "mapped", [37324]], [[12198, 12198], "mapped", [37329]], [[12199, 12199], "mapped", [38263]], [[12200, 12200], "mapped", [38272]], [[12201, 12201], "mapped", [38428]], [[12202, 12202], "mapped", [38582]], [[12203, 12203], "mapped", [38585]], [[12204, 12204], "mapped", [38632]], [[12205, 12205], "mapped", [38737]], [[12206, 12206], "mapped", [38750]], [[12207, 12207], "mapped", [38754]], [[12208, 12208], "mapped", [38761]], [[12209, 12209], "mapped", [38859]], [[12210, 12210], "mapped", [38893]], [[12211, 12211], "mapped", [38899]], [[12212, 12212], "mapped", [38913]], [[12213, 12213], "mapped", [39080]], [[12214, 12214], "mapped", [39131]], [[12215, 12215], "mapped", [39135]], [[12216, 12216], "mapped", [39318]], [[12217, 12217], "mapped", [39321]], [[12218, 12218], "mapped", [39340]], [[12219, 12219], "mapped", [39592]], [[12220, 12220], "mapped", [39640]], [[12221, 12221], "mapped", [39647]], [[12222, 12222], "mapped", [39717]], [[12223, 12223], "mapped", [39727]], [[12224, 12224], "mapped", [39730]], [[12225, 12225], "mapped", [39740]], [[12226, 12226], "mapped", [39770]], [[12227, 12227], "mapped", [40165]], [[12228, 12228], "mapped", [40565]], [[12229, 12229], "mapped", [40575]], [[12230, 12230], "mapped", [40613]], [[12231, 12231], "mapped", [40635]], [[12232, 12232], "mapped", [40643]], [[12233, 12233], "mapped", [40653]], [[12234, 12234], "mapped", [40657]], [[12235, 12235], "mapped", [40697]], [[12236, 12236], "mapped", [40701]], [[12237, 12237], "mapped", [40718]], [[12238, 12238], "mapped", [40723]], [[12239, 12239], "mapped", [40736]], [[12240, 12240], "mapped", [40763]], [[12241, 12241], "mapped", [40778]], [[12242, 12242], "mapped", [40786]], [[12243, 12243], "mapped", [40845]], [[12244, 12244], "mapped", [40860]], [[12245, 12245], "mapped", [40864]], [[12246, 12271], "disallowed"], [[12272, 12283], "disallowed"], [[12284, 12287], "disallowed"], [[12288, 12288], "disallowed_STD3_mapped", [32]], [[12289, 12289], "valid", [], "NV8"], [[12290, 12290], "mapped", [46]], [[12291, 12292], "valid", [], "NV8"], [[12293, 12295], "valid"], [[12296, 12329], "valid", [], "NV8"], [[12330, 12333], "valid"], [[12334, 12341], "valid", [], "NV8"], [[12342, 12342], "mapped", [12306]], [[12343, 12343], "valid", [], "NV8"], [[12344, 12344], "mapped", [21313]], [[12345, 12345], "mapped", [21316]], [[12346, 12346], "mapped", [21317]], [[12347, 12347], "valid", [], "NV8"], [[12348, 12348], "valid"], [[12349, 12349], "valid", [], "NV8"], [[12350, 12350], "valid", [], "NV8"], [[12351, 12351], "valid", [], "NV8"], [[12352, 12352], "disallowed"], [[12353, 12436], "valid"], [[12437, 12438], "valid"], [[12439, 12440], "disallowed"], [[12441, 12442], "valid"], [[12443, 12443], "disallowed_STD3_mapped", [32, 12441]], [[12444, 12444], "disallowed_STD3_mapped", [32, 12442]], [[12445, 12446], "valid"], [[12447, 12447], "mapped", [12424, 12426]], [[12448, 12448], "valid", [], "NV8"], [[12449, 12542], "valid"], [[12543, 12543], "mapped", [12467, 12488]], [[12544, 12548], "disallowed"], [[12549, 12588], "valid"], [[12589, 12589], "valid"], [[12590, 12592], "disallowed"], [[12593, 12593], "mapped", [4352]], [[12594, 12594], "mapped", [4353]], [[12595, 12595], "mapped", [4522]], [[12596, 12596], "mapped", [4354]], [[12597, 12597], "mapped", [4524]], [[12598, 12598], "mapped", [4525]], [[12599, 12599], "mapped", [4355]], [[12600, 12600], "mapped", [4356]], [[12601, 12601], "mapped", [4357]], [[12602, 12602], "mapped", [4528]], [[12603, 12603], "mapped", [4529]], [[12604, 12604], "mapped", [4530]], [[12605, 12605], "mapped", [4531]], [[12606, 12606], "mapped", [4532]], [[12607, 12607], "mapped", [4533]], [[12608, 12608], "mapped", [4378]], [[12609, 12609], "mapped", [4358]], [[12610, 12610], "mapped", [4359]], [[12611, 12611], "mapped", [4360]], [[12612, 12612], "mapped", [4385]], [[12613, 12613], "mapped", [4361]], [[12614, 12614], "mapped", [4362]], [[12615, 12615], "mapped", [4363]], [[12616, 12616], "mapped", [4364]], [[12617, 12617], "mapped", [4365]], [[12618, 12618], "mapped", [4366]], [[12619, 12619], "mapped", [4367]], [[12620, 12620], "mapped", [4368]], [[12621, 12621], "mapped", [4369]], [[12622, 12622], "mapped", [4370]], [[12623, 12623], "mapped", [4449]], [[12624, 12624], "mapped", [4450]], [[12625, 12625], "mapped", [4451]], [[12626, 12626], "mapped", [4452]], [[12627, 12627], "mapped", [4453]], [[12628, 12628], "mapped", [4454]], [[12629, 12629], "mapped", [4455]], [[12630, 12630], "mapped", [4456]], [[12631, 12631], "mapped", [4457]], [[12632, 12632], "mapped", [4458]], [[12633, 12633], "mapped", [4459]], [[12634, 12634], "mapped", [4460]], [[12635, 12635], "mapped", [4461]], [[12636, 12636], "mapped", [4462]], [[12637, 12637], "mapped", [4463]], [[12638, 12638], "mapped", [4464]], [[12639, 12639], "mapped", [4465]], [[12640, 12640], "mapped", [4466]], [[12641, 12641], "mapped", [4467]], [[12642, 12642], "mapped", [4468]], [[12643, 12643], "mapped", [4469]], [[12644, 12644], "disallowed"], [[12645, 12645], "mapped", [4372]], [[12646, 12646], "mapped", [4373]], [[12647, 12647], "mapped", [4551]], [[12648, 12648], "mapped", [4552]], [[12649, 12649], "mapped", [4556]], [[12650, 12650], "mapped", [4558]], [[12651, 12651], "mapped", [4563]], [[12652, 12652], "mapped", [4567]], [[12653, 12653], "mapped", [4569]], [[12654, 12654], "mapped", [4380]], [[12655, 12655], "mapped", [4573]], [[12656, 12656], "mapped", [4575]], [[12657, 12657], "mapped", [4381]], [[12658, 12658], "mapped", [4382]], [[12659, 12659], "mapped", [4384]], [[12660, 12660], "mapped", [4386]], [[12661, 12661], "mapped", [4387]], [[12662, 12662], "mapped", [4391]], [[12663, 12663], "mapped", [4393]], [[12664, 12664], "mapped", [4395]], [[12665, 12665], "mapped", [4396]], [[12666, 12666], "mapped", [4397]], [[12667, 12667], "mapped", [4398]], [[12668, 12668], "mapped", [4399]], [[12669, 12669], "mapped", [4402]], [[12670, 12670], "mapped", [4406]], [[12671, 12671], "mapped", [4416]], [[12672, 12672], "mapped", [4423]], [[12673, 12673], "mapped", [4428]], [[12674, 12674], "mapped", [4593]], [[12675, 12675], "mapped", [4594]], [[12676, 12676], "mapped", [4439]], [[12677, 12677], "mapped", [4440]], [[12678, 12678], "mapped", [4441]], [[12679, 12679], "mapped", [4484]], [[12680, 12680], "mapped", [4485]], [[12681, 12681], "mapped", [4488]], [[12682, 12682], "mapped", [4497]], [[12683, 12683], "mapped", [4498]], [[12684, 12684], "mapped", [4500]], [[12685, 12685], "mapped", [4510]], [[12686, 12686], "mapped", [4513]], [[12687, 12687], "disallowed"], [[12688, 12689], "valid", [], "NV8"], [[12690, 12690], "mapped", [19968]], [[12691, 12691], "mapped", [20108]], [[12692, 12692], "mapped", [19977]], [[12693, 12693], "mapped", [22235]], [[12694, 12694], "mapped", [19978]], [[12695, 12695], "mapped", [20013]], [[12696, 12696], "mapped", [19979]], [[12697, 12697], "mapped", [30002]], [[12698, 12698], "mapped", [20057]], [[12699, 12699], "mapped", [19993]], [[12700, 12700], "mapped", [19969]], [[12701, 12701], "mapped", [22825]], [[12702, 12702], "mapped", [22320]], [[12703, 12703], "mapped", [20154]], [[12704, 12727], "valid"], [[12728, 12730], "valid"], [[12731, 12735], "disallowed"], [[12736, 12751], "valid", [], "NV8"], [[12752, 12771], "valid", [], "NV8"], [[12772, 12783], "disallowed"], [[12784, 12799], "valid"], [[12800, 12800], "disallowed_STD3_mapped", [40, 4352, 41]], [[12801, 12801], "disallowed_STD3_mapped", [40, 4354, 41]], [[12802, 12802], "disallowed_STD3_mapped", [40, 4355, 41]], [[12803, 12803], "disallowed_STD3_mapped", [40, 4357, 41]], [[12804, 12804], "disallowed_STD3_mapped", [40, 4358, 41]], [[12805, 12805], "disallowed_STD3_mapped", [40, 4359, 41]], [[12806, 12806], "disallowed_STD3_mapped", [40, 4361, 41]], [[12807, 12807], "disallowed_STD3_mapped", [40, 4363, 41]], [[12808, 12808], "disallowed_STD3_mapped", [40, 4364, 41]], [[12809, 12809], "disallowed_STD3_mapped", [40, 4366, 41]], [[12810, 12810], "disallowed_STD3_mapped", [40, 4367, 41]], [[12811, 12811], "disallowed_STD3_mapped", [40, 4368, 41]], [[12812, 12812], "disallowed_STD3_mapped", [40, 4369, 41]], [[12813, 12813], "disallowed_STD3_mapped", [40, 4370, 41]], [[12814, 12814], "disallowed_STD3_mapped", [40, 44032, 41]], [[12815, 12815], "disallowed_STD3_mapped", [40, 45208, 41]], [[12816, 12816], "disallowed_STD3_mapped", [40, 45796, 41]], [[12817, 12817], "disallowed_STD3_mapped", [40, 46972, 41]], [[12818, 12818], "disallowed_STD3_mapped", [40, 47560, 41]], [[12819, 12819], "disallowed_STD3_mapped", [40, 48148, 41]], [[12820, 12820], "disallowed_STD3_mapped", [40, 49324, 41]], [[12821, 12821], "disallowed_STD3_mapped", [40, 50500, 41]], [[12822, 12822], "disallowed_STD3_mapped", [40, 51088, 41]], [[12823, 12823], "disallowed_STD3_mapped", [40, 52264, 41]], [[12824, 12824], "disallowed_STD3_mapped", [40, 52852, 41]], [[12825, 12825], "disallowed_STD3_mapped", [40, 53440, 41]], [[12826, 12826], "disallowed_STD3_mapped", [40, 54028, 41]], [[12827, 12827], "disallowed_STD3_mapped", [40, 54616, 41]], [[12828, 12828], "disallowed_STD3_mapped", [40, 51452, 41]], [[12829, 12829], "disallowed_STD3_mapped", [40, 50724, 51204, 41]], [[12830, 12830], "disallowed_STD3_mapped", [40, 50724, 54980, 41]], [[12831, 12831], "disallowed"], [[12832, 12832], "disallowed_STD3_mapped", [40, 19968, 41]], [[12833, 12833], "disallowed_STD3_mapped", [40, 20108, 41]], [[12834, 12834], "disallowed_STD3_mapped", [40, 19977, 41]], [[12835, 12835], "disallowed_STD3_mapped", [40, 22235, 41]], [[12836, 12836], "disallowed_STD3_mapped", [40, 20116, 41]], [[12837, 12837], "disallowed_STD3_mapped", [40, 20845, 41]], [[12838, 12838], "disallowed_STD3_mapped", [40, 19971, 41]], [[12839, 12839], "disallowed_STD3_mapped", [40, 20843, 41]], [[12840, 12840], "disallowed_STD3_mapped", [40, 20061, 41]], [[12841, 12841], "disallowed_STD3_mapped", [40, 21313, 41]], [[12842, 12842], "disallowed_STD3_mapped", [40, 26376, 41]], [[12843, 12843], "disallowed_STD3_mapped", [40, 28779, 41]], [[12844, 12844], "disallowed_STD3_mapped", [40, 27700, 41]], [[12845, 12845], "disallowed_STD3_mapped", [40, 26408, 41]], [[12846, 12846], "disallowed_STD3_mapped", [40, 37329, 41]], [[12847, 12847], "disallowed_STD3_mapped", [40, 22303, 41]], [[12848, 12848], "disallowed_STD3_mapped", [40, 26085, 41]], [[12849, 12849], "disallowed_STD3_mapped", [40, 26666, 41]], [[12850, 12850], "disallowed_STD3_mapped", [40, 26377, 41]], [[12851, 12851], "disallowed_STD3_mapped", [40, 31038, 41]], [[12852, 12852], "disallowed_STD3_mapped", [40, 21517, 41]], [[12853, 12853], "disallowed_STD3_mapped", [40, 29305, 41]], [[12854, 12854], "disallowed_STD3_mapped", [40, 36001, 41]], [[12855, 12855], "disallowed_STD3_mapped", [40, 31069, 41]], [[12856, 12856], "disallowed_STD3_mapped", [40, 21172, 41]], [[12857, 12857], "disallowed_STD3_mapped", [40, 20195, 41]], [[12858, 12858], "disallowed_STD3_mapped", [40, 21628, 41]], [[12859, 12859], "disallowed_STD3_mapped", [40, 23398, 41]], [[12860, 12860], "disallowed_STD3_mapped", [40, 30435, 41]], [[12861, 12861], "disallowed_STD3_mapped", [40, 20225, 41]], [[12862, 12862], "disallowed_STD3_mapped", [40, 36039, 41]], [[12863, 12863], "disallowed_STD3_mapped", [40, 21332, 41]], [[12864, 12864], "disallowed_STD3_mapped", [40, 31085, 41]], [[12865, 12865], "disallowed_STD3_mapped", [40, 20241, 41]], [[12866, 12866], "disallowed_STD3_mapped", [40, 33258, 41]], [[12867, 12867], "disallowed_STD3_mapped", [40, 33267, 41]], [[12868, 12868], "mapped", [21839]], [[12869, 12869], "mapped", [24188]], [[12870, 12870], "mapped", [25991]], [[12871, 12871], "mapped", [31631]], [[12872, 12879], "valid", [], "NV8"], [[12880, 12880], "mapped", [112, 116, 101]], [[12881, 12881], "mapped", [50, 49]], [[12882, 12882], "mapped", [50, 50]], [[12883, 12883], "mapped", [50, 51]], [[12884, 12884], "mapped", [50, 52]], [[12885, 12885], "mapped", [50, 53]], [[12886, 12886], "mapped", [50, 54]], [[12887, 12887], "mapped", [50, 55]], [[12888, 12888], "mapped", [50, 56]], [[12889, 12889], "mapped", [50, 57]], [[12890, 12890], "mapped", [51, 48]], [[12891, 12891], "mapped", [51, 49]], [[12892, 12892], "mapped", [51, 50]], [[12893, 12893], "mapped", [51, 51]], [[12894, 12894], "mapped", [51, 52]], [[12895, 12895], "mapped", [51, 53]], [[12896, 12896], "mapped", [4352]], [[12897, 12897], "mapped", [4354]], [[12898, 12898], "mapped", [4355]], [[12899, 12899], "mapped", [4357]], [[12900, 12900], "mapped", [4358]], [[12901, 12901], "mapped", [4359]], [[12902, 12902], "mapped", [4361]], [[12903, 12903], "mapped", [4363]], [[12904, 12904], "mapped", [4364]], [[12905, 12905], "mapped", [4366]], [[12906, 12906], "mapped", [4367]], [[12907, 12907], "mapped", [4368]], [[12908, 12908], "mapped", [4369]], [[12909, 12909], "mapped", [4370]], [[12910, 12910], "mapped", [44032]], [[12911, 12911], "mapped", [45208]], [[12912, 12912], "mapped", [45796]], [[12913, 12913], "mapped", [46972]], [[12914, 12914], "mapped", [47560]], [[12915, 12915], "mapped", [48148]], [[12916, 12916], "mapped", [49324]], [[12917, 12917], "mapped", [50500]], [[12918, 12918], "mapped", [51088]], [[12919, 12919], "mapped", [52264]], [[12920, 12920], "mapped", [52852]], [[12921, 12921], "mapped", [53440]], [[12922, 12922], "mapped", [54028]], [[12923, 12923], "mapped", [54616]], [[12924, 12924], "mapped", [52280, 44256]], [[12925, 12925], "mapped", [51452, 51032]], [[12926, 12926], "mapped", [50864]], [[12927, 12927], "valid", [], "NV8"], [[12928, 12928], "mapped", [19968]], [[12929, 12929], "mapped", [20108]], [[12930, 12930], "mapped", [19977]], [[12931, 12931], "mapped", [22235]], [[12932, 12932], "mapped", [20116]], [[12933, 12933], "mapped", [20845]], [[12934, 12934], "mapped", [19971]], [[12935, 12935], "mapped", [20843]], [[12936, 12936], "mapped", [20061]], [[12937, 12937], "mapped", [21313]], [[12938, 12938], "mapped", [26376]], [[12939, 12939], "mapped", [28779]], [[12940, 12940], "mapped", [27700]], [[12941, 12941], "mapped", [26408]], [[12942, 12942], "mapped", [37329]], [[12943, 12943], "mapped", [22303]], [[12944, 12944], "mapped", [26085]], [[12945, 12945], "mapped", [26666]], [[12946, 12946], "mapped", [26377]], [[12947, 12947], "mapped", [31038]], [[12948, 12948], "mapped", [21517]], [[12949, 12949], "mapped", [29305]], [[12950, 12950], "mapped", [36001]], [[12951, 12951], "mapped", [31069]], [[12952, 12952], "mapped", [21172]], [[12953, 12953], "mapped", [31192]], [[12954, 12954], "mapped", [30007]], [[12955, 12955], "mapped", [22899]], [[12956, 12956], "mapped", [36969]], [[12957, 12957], "mapped", [20778]], [[12958, 12958], "mapped", [21360]], [[12959, 12959], "mapped", [27880]], [[12960, 12960], "mapped", [38917]], [[12961, 12961], "mapped", [20241]], [[12962, 12962], "mapped", [20889]], [[12963, 12963], "mapped", [27491]], [[12964, 12964], "mapped", [19978]], [[12965, 12965], "mapped", [20013]], [[12966, 12966], "mapped", [19979]], [[12967, 12967], "mapped", [24038]], [[12968, 12968], "mapped", [21491]], [[12969, 12969], "mapped", [21307]], [[12970, 12970], "mapped", [23447]], [[12971, 12971], "mapped", [23398]], [[12972, 12972], "mapped", [30435]], [[12973, 12973], "mapped", [20225]], [[12974, 12974], "mapped", [36039]], [[12975, 12975], "mapped", [21332]], [[12976, 12976], "mapped", [22812]], [[12977, 12977], "mapped", [51, 54]], [[12978, 12978], "mapped", [51, 55]], [[12979, 12979], "mapped", [51, 56]], [[12980, 12980], "mapped", [51, 57]], [[12981, 12981], "mapped", [52, 48]], [[12982, 12982], "mapped", [52, 49]], [[12983, 12983], "mapped", [52, 50]], [[12984, 12984], "mapped", [52, 51]], [[12985, 12985], "mapped", [52, 52]], [[12986, 12986], "mapped", [52, 53]], [[12987, 12987], "mapped", [52, 54]], [[12988, 12988], "mapped", [52, 55]], [[12989, 12989], "mapped", [52, 56]], [[12990, 12990], "mapped", [52, 57]], [[12991, 12991], "mapped", [53, 48]], [[12992, 12992], "mapped", [49, 26376]], [[12993, 12993], "mapped", [50, 26376]], [[12994, 12994], "mapped", [51, 26376]], [[12995, 12995], "mapped", [52, 26376]], [[12996, 12996], "mapped", [53, 26376]], [[12997, 12997], "mapped", [54, 26376]], [[12998, 12998], "mapped", [55, 26376]], [[12999, 12999], "mapped", [56, 26376]], [[13e3, 13e3], "mapped", [57, 26376]], [[13001, 13001], "mapped", [49, 48, 26376]], [[13002, 13002], "mapped", [49, 49, 26376]], [[13003, 13003], "mapped", [49, 50, 26376]], [[13004, 13004], "mapped", [104, 103]], [[13005, 13005], "mapped", [101, 114, 103]], [[13006, 13006], "mapped", [101, 118]], [[13007, 13007], "mapped", [108, 116, 100]], [[13008, 13008], "mapped", [12450]], [[13009, 13009], "mapped", [12452]], [[13010, 13010], "mapped", [12454]], [[13011, 13011], "mapped", [12456]], [[13012, 13012], "mapped", [12458]], [[13013, 13013], "mapped", [12459]], [[13014, 13014], "mapped", [12461]], [[13015, 13015], "mapped", [12463]], [[13016, 13016], "mapped", [12465]], [[13017, 13017], "mapped", [12467]], [[13018, 13018], "mapped", [12469]], [[13019, 13019], "mapped", [12471]], [[13020, 13020], "mapped", [12473]], [[13021, 13021], "mapped", [12475]], [[13022, 13022], "mapped", [12477]], [[13023, 13023], "mapped", [12479]], [[13024, 13024], "mapped", [12481]], [[13025, 13025], "mapped", [12484]], [[13026, 13026], "mapped", [12486]], [[13027, 13027], "mapped", [12488]], [[13028, 13028], "mapped", [12490]], [[13029, 13029], "mapped", [12491]], [[13030, 13030], "mapped", [12492]], [[13031, 13031], "mapped", [12493]], [[13032, 13032], "mapped", [12494]], [[13033, 13033], "mapped", [12495]], [[13034, 13034], "mapped", [12498]], [[13035, 13035], "mapped", [12501]], [[13036, 13036], "mapped", [12504]], [[13037, 13037], "mapped", [12507]], [[13038, 13038], "mapped", [12510]], [[13039, 13039], "mapped", [12511]], [[13040, 13040], "mapped", [12512]], [[13041, 13041], "mapped", [12513]], [[13042, 13042], "mapped", [12514]], [[13043, 13043], "mapped", [12516]], [[13044, 13044], "mapped", [12518]], [[13045, 13045], "mapped", [12520]], [[13046, 13046], "mapped", [12521]], [[13047, 13047], "mapped", [12522]], [[13048, 13048], "mapped", [12523]], [[13049, 13049], "mapped", [12524]], [[13050, 13050], "mapped", [12525]], [[13051, 13051], "mapped", [12527]], [[13052, 13052], "mapped", [12528]], [[13053, 13053], "mapped", [12529]], [[13054, 13054], "mapped", [12530]], [[13055, 13055], "disallowed"], [[13056, 13056], "mapped", [12450, 12497, 12540, 12488]], [[13057, 13057], "mapped", [12450, 12523, 12501, 12449]], [[13058, 13058], "mapped", [12450, 12531, 12506, 12450]], [[13059, 13059], "mapped", [12450, 12540, 12523]], [[13060, 13060], "mapped", [12452, 12491, 12531, 12464]], [[13061, 13061], "mapped", [12452, 12531, 12481]], [[13062, 13062], "mapped", [12454, 12457, 12531]], [[13063, 13063], "mapped", [12456, 12473, 12463, 12540, 12489]], [[13064, 13064], "mapped", [12456, 12540, 12459, 12540]], [[13065, 13065], "mapped", [12458, 12531, 12473]], [[13066, 13066], "mapped", [12458, 12540, 12512]], [[13067, 13067], "mapped", [12459, 12452, 12522]], [[13068, 13068], "mapped", [12459, 12521, 12483, 12488]], [[13069, 13069], "mapped", [12459, 12525, 12522, 12540]], [[13070, 13070], "mapped", [12460, 12525, 12531]], [[13071, 13071], "mapped", [12460, 12531, 12510]], [[13072, 13072], "mapped", [12462, 12460]], [[13073, 13073], "mapped", [12462, 12491, 12540]], [[13074, 13074], "mapped", [12461, 12517, 12522, 12540]], [[13075, 13075], "mapped", [12462, 12523, 12480, 12540]], [[13076, 13076], "mapped", [12461, 12525]], [[13077, 13077], "mapped", [12461, 12525, 12464, 12521, 12512]], [[13078, 13078], "mapped", [12461, 12525, 12513, 12540, 12488, 12523]], [[13079, 13079], "mapped", [12461, 12525, 12527, 12483, 12488]], [[13080, 13080], "mapped", [12464, 12521, 12512]], [[13081, 13081], "mapped", [12464, 12521, 12512, 12488, 12531]], [[13082, 13082], "mapped", [12463, 12523, 12476, 12452, 12525]], [[13083, 13083], "mapped", [12463, 12525, 12540, 12493]], [[13084, 13084], "mapped", [12465, 12540, 12473]], [[13085, 13085], "mapped", [12467, 12523, 12490]], [[13086, 13086], "mapped", [12467, 12540, 12509]], [[13087, 13087], "mapped", [12469, 12452, 12463, 12523]], [[13088, 13088], "mapped", [12469, 12531, 12481, 12540, 12512]], [[13089, 13089], "mapped", [12471, 12522, 12531, 12464]], [[13090, 13090], "mapped", [12475, 12531, 12481]], [[13091, 13091], "mapped", [12475, 12531, 12488]], [[13092, 13092], "mapped", [12480, 12540, 12473]], [[13093, 13093], "mapped", [12487, 12471]], [[13094, 13094], "mapped", [12489, 12523]], [[13095, 13095], "mapped", [12488, 12531]], [[13096, 13096], "mapped", [12490, 12494]], [[13097, 13097], "mapped", [12494, 12483, 12488]], [[13098, 13098], "mapped", [12495, 12452, 12484]], [[13099, 13099], "mapped", [12497, 12540, 12475, 12531, 12488]], [[13100, 13100], "mapped", [12497, 12540, 12484]], [[13101, 13101], "mapped", [12496, 12540, 12524, 12523]], [[13102, 13102], "mapped", [12500, 12450, 12473, 12488, 12523]], [[13103, 13103], "mapped", [12500, 12463, 12523]], [[13104, 13104], "mapped", [12500, 12467]], [[13105, 13105], "mapped", [12499, 12523]], [[13106, 13106], "mapped", [12501, 12449, 12521, 12483, 12489]], [[13107, 13107], "mapped", [12501, 12451, 12540, 12488]], [[13108, 13108], "mapped", [12502, 12483, 12471, 12455, 12523]], [[13109, 13109], "mapped", [12501, 12521, 12531]], [[13110, 13110], "mapped", [12504, 12463, 12479, 12540, 12523]], [[13111, 13111], "mapped", [12506, 12477]], [[13112, 13112], "mapped", [12506, 12491, 12498]], [[13113, 13113], "mapped", [12504, 12523, 12484]], [[13114, 13114], "mapped", [12506, 12531, 12473]], [[13115, 13115], "mapped", [12506, 12540, 12472]], [[13116, 13116], "mapped", [12505, 12540, 12479]], [[13117, 13117], "mapped", [12509, 12452, 12531, 12488]], [[13118, 13118], "mapped", [12508, 12523, 12488]], [[13119, 13119], "mapped", [12507, 12531]], [[13120, 13120], "mapped", [12509, 12531, 12489]], [[13121, 13121], "mapped", [12507, 12540, 12523]], [[13122, 13122], "mapped", [12507, 12540, 12531]], [[13123, 13123], "mapped", [12510, 12452, 12463, 12525]], [[13124, 13124], "mapped", [12510, 12452, 12523]], [[13125, 13125], "mapped", [12510, 12483, 12495]], [[13126, 13126], "mapped", [12510, 12523, 12463]], [[13127, 13127], "mapped", [12510, 12531, 12471, 12519, 12531]], [[13128, 13128], "mapped", [12511, 12463, 12525, 12531]], [[13129, 13129], "mapped", [12511, 12522]], [[13130, 13130], "mapped", [12511, 12522, 12496, 12540, 12523]], [[13131, 13131], "mapped", [12513, 12460]], [[13132, 13132], "mapped", [12513, 12460, 12488, 12531]], [[13133, 13133], "mapped", [12513, 12540, 12488, 12523]], [[13134, 13134], "mapped", [12516, 12540, 12489]], [[13135, 13135], "mapped", [12516, 12540, 12523]], [[13136, 13136], "mapped", [12518, 12450, 12531]], [[13137, 13137], "mapped", [12522, 12483, 12488, 12523]], [[13138, 13138], "mapped", [12522, 12521]], [[13139, 13139], "mapped", [12523, 12500, 12540]], [[13140, 13140], "mapped", [12523, 12540, 12502, 12523]], [[13141, 13141], "mapped", [12524, 12512]], [[13142, 13142], "mapped", [12524, 12531, 12488, 12466, 12531]], [[13143, 13143], "mapped", [12527, 12483, 12488]], [[13144, 13144], "mapped", [48, 28857]], [[13145, 13145], "mapped", [49, 28857]], [[13146, 13146], "mapped", [50, 28857]], [[13147, 13147], "mapped", [51, 28857]], [[13148, 13148], "mapped", [52, 28857]], [[13149, 13149], "mapped", [53, 28857]], [[13150, 13150], "mapped", [54, 28857]], [[13151, 13151], "mapped", [55, 28857]], [[13152, 13152], "mapped", [56, 28857]], [[13153, 13153], "mapped", [57, 28857]], [[13154, 13154], "mapped", [49, 48, 28857]], [[13155, 13155], "mapped", [49, 49, 28857]], [[13156, 13156], "mapped", [49, 50, 28857]], [[13157, 13157], "mapped", [49, 51, 28857]], [[13158, 13158], "mapped", [49, 52, 28857]], [[13159, 13159], "mapped", [49, 53, 28857]], [[13160, 13160], "mapped", [49, 54, 28857]], [[13161, 13161], "mapped", [49, 55, 28857]], [[13162, 13162], "mapped", [49, 56, 28857]], [[13163, 13163], "mapped", [49, 57, 28857]], [[13164, 13164], "mapped", [50, 48, 28857]], [[13165, 13165], "mapped", [50, 49, 28857]], [[13166, 13166], "mapped", [50, 50, 28857]], [[13167, 13167], "mapped", [50, 51, 28857]], [[13168, 13168], "mapped", [50, 52, 28857]], [[13169, 13169], "mapped", [104, 112, 97]], [[13170, 13170], "mapped", [100, 97]], [[13171, 13171], "mapped", [97, 117]], [[13172, 13172], "mapped", [98, 97, 114]], [[13173, 13173], "mapped", [111, 118]], [[13174, 13174], "mapped", [112, 99]], [[13175, 13175], "mapped", [100, 109]], [[13176, 13176], "mapped", [100, 109, 50]], [[13177, 13177], "mapped", [100, 109, 51]], [[13178, 13178], "mapped", [105, 117]], [[13179, 13179], "mapped", [24179, 25104]], [[13180, 13180], "mapped", [26157, 21644]], [[13181, 13181], "mapped", [22823, 27491]], [[13182, 13182], "mapped", [26126, 27835]], [[13183, 13183], "mapped", [26666, 24335, 20250, 31038]], [[13184, 13184], "mapped", [112, 97]], [[13185, 13185], "mapped", [110, 97]], [[13186, 13186], "mapped", [956, 97]], [[13187, 13187], "mapped", [109, 97]], [[13188, 13188], "mapped", [107, 97]], [[13189, 13189], "mapped", [107, 98]], [[13190, 13190], "mapped", [109, 98]], [[13191, 13191], "mapped", [103, 98]], [[13192, 13192], "mapped", [99, 97, 108]], [[13193, 13193], "mapped", [107, 99, 97, 108]], [[13194, 13194], "mapped", [112, 102]], [[13195, 13195], "mapped", [110, 102]], [[13196, 13196], "mapped", [956, 102]], [[13197, 13197], "mapped", [956, 103]], [[13198, 13198], "mapped", [109, 103]], [[13199, 13199], "mapped", [107, 103]], [[13200, 13200], "mapped", [104, 122]], [[13201, 13201], "mapped", [107, 104, 122]], [[13202, 13202], "mapped", [109, 104, 122]], [[13203, 13203], "mapped", [103, 104, 122]], [[13204, 13204], "mapped", [116, 104, 122]], [[13205, 13205], "mapped", [956, 108]], [[13206, 13206], "mapped", [109, 108]], [[13207, 13207], "mapped", [100, 108]], [[13208, 13208], "mapped", [107, 108]], [[13209, 13209], "mapped", [102, 109]], [[13210, 13210], "mapped", [110, 109]], [[13211, 13211], "mapped", [956, 109]], [[13212, 13212], "mapped", [109, 109]], [[13213, 13213], "mapped", [99, 109]], [[13214, 13214], "mapped", [107, 109]], [[13215, 13215], "mapped", [109, 109, 50]], [[13216, 13216], "mapped", [99, 109, 50]], [[13217, 13217], "mapped", [109, 50]], [[13218, 13218], "mapped", [107, 109, 50]], [[13219, 13219], "mapped", [109, 109, 51]], [[13220, 13220], "mapped", [99, 109, 51]], [[13221, 13221], "mapped", [109, 51]], [[13222, 13222], "mapped", [107, 109, 51]], [[13223, 13223], "mapped", [109, 8725, 115]], [[13224, 13224], "mapped", [109, 8725, 115, 50]], [[13225, 13225], "mapped", [112, 97]], [[13226, 13226], "mapped", [107, 112, 97]], [[13227, 13227], "mapped", [109, 112, 97]], [[13228, 13228], "mapped", [103, 112, 97]], [[13229, 13229], "mapped", [114, 97, 100]], [[13230, 13230], "mapped", [114, 97, 100, 8725, 115]], [[13231, 13231], "mapped", [114, 97, 100, 8725, 115, 50]], [[13232, 13232], "mapped", [112, 115]], [[13233, 13233], "mapped", [110, 115]], [[13234, 13234], "mapped", [956, 115]], [[13235, 13235], "mapped", [109, 115]], [[13236, 13236], "mapped", [112, 118]], [[13237, 13237], "mapped", [110, 118]], [[13238, 13238], "mapped", [956, 118]], [[13239, 13239], "mapped", [109, 118]], [[13240, 13240], "mapped", [107, 118]], [[13241, 13241], "mapped", [109, 118]], [[13242, 13242], "mapped", [112, 119]], [[13243, 13243], "mapped", [110, 119]], [[13244, 13244], "mapped", [956, 119]], [[13245, 13245], "mapped", [109, 119]], [[13246, 13246], "mapped", [107, 119]], [[13247, 13247], "mapped", [109, 119]], [[13248, 13248], "mapped", [107, 969]], [[13249, 13249], "mapped", [109, 969]], [[13250, 13250], "disallowed"], [[13251, 13251], "mapped", [98, 113]], [[13252, 13252], "mapped", [99, 99]], [[13253, 13253], "mapped", [99, 100]], [[13254, 13254], "mapped", [99, 8725, 107, 103]], [[13255, 13255], "disallowed"], [[13256, 13256], "mapped", [100, 98]], [[13257, 13257], "mapped", [103, 121]], [[13258, 13258], "mapped", [104, 97]], [[13259, 13259], "mapped", [104, 112]], [[13260, 13260], "mapped", [105, 110]], [[13261, 13261], "mapped", [107, 107]], [[13262, 13262], "mapped", [107, 109]], [[13263, 13263], "mapped", [107, 116]], [[13264, 13264], "mapped", [108, 109]], [[13265, 13265], "mapped", [108, 110]], [[13266, 13266], "mapped", [108, 111, 103]], [[13267, 13267], "mapped", [108, 120]], [[13268, 13268], "mapped", [109, 98]], [[13269, 13269], "mapped", [109, 105, 108]], [[13270, 13270], "mapped", [109, 111, 108]], [[13271, 13271], "mapped", [112, 104]], [[13272, 13272], "disallowed"], [[13273, 13273], "mapped", [112, 112, 109]], [[13274, 13274], "mapped", [112, 114]], [[13275, 13275], "mapped", [115, 114]], [[13276, 13276], "mapped", [115, 118]], [[13277, 13277], "mapped", [119, 98]], [[13278, 13278], "mapped", [118, 8725, 109]], [[13279, 13279], "mapped", [97, 8725, 109]], [[13280, 13280], "mapped", [49, 26085]], [[13281, 13281], "mapped", [50, 26085]], [[13282, 13282], "mapped", [51, 26085]], [[13283, 13283], "mapped", [52, 26085]], [[13284, 13284], "mapped", [53, 26085]], [[13285, 13285], "mapped", [54, 26085]], [[13286, 13286], "mapped", [55, 26085]], [[13287, 13287], "mapped", [56, 26085]], [[13288, 13288], "mapped", [57, 26085]], [[13289, 13289], "mapped", [49, 48, 26085]], [[13290, 13290], "mapped", [49, 49, 26085]], [[13291, 13291], "mapped", [49, 50, 26085]], [[13292, 13292], "mapped", [49, 51, 26085]], [[13293, 13293], "mapped", [49, 52, 26085]], [[13294, 13294], "mapped", [49, 53, 26085]], [[13295, 13295], "mapped", [49, 54, 26085]], [[13296, 13296], "mapped", [49, 55, 26085]], [[13297, 13297], "mapped", [49, 56, 26085]], [[13298, 13298], "mapped", [49, 57, 26085]], [[13299, 13299], "mapped", [50, 48, 26085]], [[13300, 13300], "mapped", [50, 49, 26085]], [[13301, 13301], "mapped", [50, 50, 26085]], [[13302, 13302], "mapped", [50, 51, 26085]], [[13303, 13303], "mapped", [50, 52, 26085]], [[13304, 13304], "mapped", [50, 53, 26085]], [[13305, 13305], "mapped", [50, 54, 26085]], [[13306, 13306], "mapped", [50, 55, 26085]], [[13307, 13307], "mapped", [50, 56, 26085]], [[13308, 13308], "mapped", [50, 57, 26085]], [[13309, 13309], "mapped", [51, 48, 26085]], [[13310, 13310], "mapped", [51, 49, 26085]], [[13311, 13311], "mapped", [103, 97, 108]], [[13312, 19893], "valid"], [[19894, 19903], "disallowed"], [[19904, 19967], "valid", [], "NV8"], [[19968, 40869], "valid"], [[40870, 40891], "valid"], [[40892, 40899], "valid"], [[40900, 40907], "valid"], [[40908, 40908], "valid"], [[40909, 40917], "valid"], [[40918, 40959], "disallowed"], [[40960, 42124], "valid"], [[42125, 42127], "disallowed"], [[42128, 42145], "valid", [], "NV8"], [[42146, 42147], "valid", [], "NV8"], [[42148, 42163], "valid", [], "NV8"], [[42164, 42164], "valid", [], "NV8"], [[42165, 42176], "valid", [], "NV8"], [[42177, 42177], "valid", [], "NV8"], [[42178, 42180], "valid", [], "NV8"], [[42181, 42181], "valid", [], "NV8"], [[42182, 42182], "valid", [], "NV8"], [[42183, 42191], "disallowed"], [[42192, 42237], "valid"], [[42238, 42239], "valid", [], "NV8"], [[42240, 42508], "valid"], [[42509, 42511], "valid", [], "NV8"], [[42512, 42539], "valid"], [[42540, 42559], "disallowed"], [[42560, 42560], "mapped", [42561]], [[42561, 42561], "valid"], [[42562, 42562], "mapped", [42563]], [[42563, 42563], "valid"], [[42564, 42564], "mapped", [42565]], [[42565, 42565], "valid"], [[42566, 42566], "mapped", [42567]], [[42567, 42567], "valid"], [[42568, 42568], "mapped", [42569]], [[42569, 42569], "valid"], [[42570, 42570], "mapped", [42571]], [[42571, 42571], "valid"], [[42572, 42572], "mapped", [42573]], [[42573, 42573], "valid"], [[42574, 42574], "mapped", [42575]], [[42575, 42575], "valid"], [[42576, 42576], "mapped", [42577]], [[42577, 42577], "valid"], [[42578, 42578], "mapped", [42579]], [[42579, 42579], "valid"], [[42580, 42580], "mapped", [42581]], [[42581, 42581], "valid"], [[42582, 42582], "mapped", [42583]], [[42583, 42583], "valid"], [[42584, 42584], "mapped", [42585]], [[42585, 42585], "valid"], [[42586, 42586], "mapped", [42587]], [[42587, 42587], "valid"], [[42588, 42588], "mapped", [42589]], [[42589, 42589], "valid"], [[42590, 42590], "mapped", [42591]], [[42591, 42591], "valid"], [[42592, 42592], "mapped", [42593]], [[42593, 42593], "valid"], [[42594, 42594], "mapped", [42595]], [[42595, 42595], "valid"], [[42596, 42596], "mapped", [42597]], [[42597, 42597], "valid"], [[42598, 42598], "mapped", [42599]], [[42599, 42599], "valid"], [[42600, 42600], "mapped", [42601]], [[42601, 42601], "valid"], [[42602, 42602], "mapped", [42603]], [[42603, 42603], "valid"], [[42604, 42604], "mapped", [42605]], [[42605, 42607], "valid"], [[42608, 42611], "valid", [], "NV8"], [[42612, 42619], "valid"], [[42620, 42621], "valid"], [[42622, 42622], "valid", [], "NV8"], [[42623, 42623], "valid"], [[42624, 42624], "mapped", [42625]], [[42625, 42625], "valid"], [[42626, 42626], "mapped", [42627]], [[42627, 42627], "valid"], [[42628, 42628], "mapped", [42629]], [[42629, 42629], "valid"], [[42630, 42630], "mapped", [42631]], [[42631, 42631], "valid"], [[42632, 42632], "mapped", [42633]], [[42633, 42633], "valid"], [[42634, 42634], "mapped", [42635]], [[42635, 42635], "valid"], [[42636, 42636], "mapped", [42637]], [[42637, 42637], "valid"], [[42638, 42638], "mapped", [42639]], [[42639, 42639], "valid"], [[42640, 42640], "mapped", [42641]], [[42641, 42641], "valid"], [[42642, 42642], "mapped", [42643]], [[42643, 42643], "valid"], [[42644, 42644], "mapped", [42645]], [[42645, 42645], "valid"], [[42646, 42646], "mapped", [42647]], [[42647, 42647], "valid"], [[42648, 42648], "mapped", [42649]], [[42649, 42649], "valid"], [[42650, 42650], "mapped", [42651]], [[42651, 42651], "valid"], [[42652, 42652], "mapped", [1098]], [[42653, 42653], "mapped", [1100]], [[42654, 42654], "valid"], [[42655, 42655], "valid"], [[42656, 42725], "valid"], [[42726, 42735], "valid", [], "NV8"], [[42736, 42737], "valid"], [[42738, 42743], "valid", [], "NV8"], [[42744, 42751], "disallowed"], [[42752, 42774], "valid", [], "NV8"], [[42775, 42778], "valid"], [[42779, 42783], "valid"], [[42784, 42785], "valid", [], "NV8"], [[42786, 42786], "mapped", [42787]], [[42787, 42787], "valid"], [[42788, 42788], "mapped", [42789]], [[42789, 42789], "valid"], [[42790, 42790], "mapped", [42791]], [[42791, 42791], "valid"], [[42792, 42792], "mapped", [42793]], [[42793, 42793], "valid"], [[42794, 42794], "mapped", [42795]], [[42795, 42795], "valid"], [[42796, 42796], "mapped", [42797]], [[42797, 42797], "valid"], [[42798, 42798], "mapped", [42799]], [[42799, 42801], "valid"], [[42802, 42802], "mapped", [42803]], [[42803, 42803], "valid"], [[42804, 42804], "mapped", [42805]], [[42805, 42805], "valid"], [[42806, 42806], "mapped", [42807]], [[42807, 42807], "valid"], [[42808, 42808], "mapped", [42809]], [[42809, 42809], "valid"], [[42810, 42810], "mapped", [42811]], [[42811, 42811], "valid"], [[42812, 42812], "mapped", [42813]], [[42813, 42813], "valid"], [[42814, 42814], "mapped", [42815]], [[42815, 42815], "valid"], [[42816, 42816], "mapped", [42817]], [[42817, 42817], "valid"], [[42818, 42818], "mapped", [42819]], [[42819, 42819], "valid"], [[42820, 42820], "mapped", [42821]], [[42821, 42821], "valid"], [[42822, 42822], "mapped", [42823]], [[42823, 42823], "valid"], [[42824, 42824], "mapped", [42825]], [[42825, 42825], "valid"], [[42826, 42826], "mapped", [42827]], [[42827, 42827], "valid"], [[42828, 42828], "mapped", [42829]], [[42829, 42829], "valid"], [[42830, 42830], "mapped", [42831]], [[42831, 42831], "valid"], [[42832, 42832], "mapped", [42833]], [[42833, 42833], "valid"], [[42834, 42834], "mapped", [42835]], [[42835, 42835], "valid"], [[42836, 42836], "mapped", [42837]], [[42837, 42837], "valid"], [[42838, 42838], "mapped", [42839]], [[42839, 42839], "valid"], [[42840, 42840], "mapped", [42841]], [[42841, 42841], "valid"], [[42842, 42842], "mapped", [42843]], [[42843, 42843], "valid"], [[42844, 42844], "mapped", [42845]], [[42845, 42845], "valid"], [[42846, 42846], "mapped", [42847]], [[42847, 42847], "valid"], [[42848, 42848], "mapped", [42849]], [[42849, 42849], "valid"], [[42850, 42850], "mapped", [42851]], [[42851, 42851], "valid"], [[42852, 42852], "mapped", [42853]], [[42853, 42853], "valid"], [[42854, 42854], "mapped", [42855]], [[42855, 42855], "valid"], [[42856, 42856], "mapped", [42857]], [[42857, 42857], "valid"], [[42858, 42858], "mapped", [42859]], [[42859, 42859], "valid"], [[42860, 42860], "mapped", [42861]], [[42861, 42861], "valid"], [[42862, 42862], "mapped", [42863]], [[42863, 42863], "valid"], [[42864, 42864], "mapped", [42863]], [[42865, 42872], "valid"], [[42873, 42873], "mapped", [42874]], [[42874, 42874], "valid"], [[42875, 42875], "mapped", [42876]], [[42876, 42876], "valid"], [[42877, 42877], "mapped", [7545]], [[42878, 42878], "mapped", [42879]], [[42879, 42879], "valid"], [[42880, 42880], "mapped", [42881]], [[42881, 42881], "valid"], [[42882, 42882], "mapped", [42883]], [[42883, 42883], "valid"], [[42884, 42884], "mapped", [42885]], [[42885, 42885], "valid"], [[42886, 42886], "mapped", [42887]], [[42887, 42888], "valid"], [[42889, 42890], "valid", [], "NV8"], [[42891, 42891], "mapped", [42892]], [[42892, 42892], "valid"], [[42893, 42893], "mapped", [613]], [[42894, 42894], "valid"], [[42895, 42895], "valid"], [[42896, 42896], "mapped", [42897]], [[42897, 42897], "valid"], [[42898, 42898], "mapped", [42899]], [[42899, 42899], "valid"], [[42900, 42901], "valid"], [[42902, 42902], "mapped", [42903]], [[42903, 42903], "valid"], [[42904, 42904], "mapped", [42905]], [[42905, 42905], "valid"], [[42906, 42906], "mapped", [42907]], [[42907, 42907], "valid"], [[42908, 42908], "mapped", [42909]], [[42909, 42909], "valid"], [[42910, 42910], "mapped", [42911]], [[42911, 42911], "valid"], [[42912, 42912], "mapped", [42913]], [[42913, 42913], "valid"], [[42914, 42914], "mapped", [42915]], [[42915, 42915], "valid"], [[42916, 42916], "mapped", [42917]], [[42917, 42917], "valid"], [[42918, 42918], "mapped", [42919]], [[42919, 42919], "valid"], [[42920, 42920], "mapped", [42921]], [[42921, 42921], "valid"], [[42922, 42922], "mapped", [614]], [[42923, 42923], "mapped", [604]], [[42924, 42924], "mapped", [609]], [[42925, 42925], "mapped", [620]], [[42926, 42927], "disallowed"], [[42928, 42928], "mapped", [670]], [[42929, 42929], "mapped", [647]], [[42930, 42930], "mapped", [669]], [[42931, 42931], "mapped", [43859]], [[42932, 42932], "mapped", [42933]], [[42933, 42933], "valid"], [[42934, 42934], "mapped", [42935]], [[42935, 42935], "valid"], [[42936, 42998], "disallowed"], [[42999, 42999], "valid"], [[43e3, 43e3], "mapped", [295]], [[43001, 43001], "mapped", [339]], [[43002, 43002], "valid"], [[43003, 43007], "valid"], [[43008, 43047], "valid"], [[43048, 43051], "valid", [], "NV8"], [[43052, 43055], "disallowed"], [[43056, 43065], "valid", [], "NV8"], [[43066, 43071], "disallowed"], [[43072, 43123], "valid"], [[43124, 43127], "valid", [], "NV8"], [[43128, 43135], "disallowed"], [[43136, 43204], "valid"], [[43205, 43213], "disallowed"], [[43214, 43215], "valid", [], "NV8"], [[43216, 43225], "valid"], [[43226, 43231], "disallowed"], [[43232, 43255], "valid"], [[43256, 43258], "valid", [], "NV8"], [[43259, 43259], "valid"], [[43260, 43260], "valid", [], "NV8"], [[43261, 43261], "valid"], [[43262, 43263], "disallowed"], [[43264, 43309], "valid"], [[43310, 43311], "valid", [], "NV8"], [[43312, 43347], "valid"], [[43348, 43358], "disallowed"], [[43359, 43359], "valid", [], "NV8"], [[43360, 43388], "valid", [], "NV8"], [[43389, 43391], "disallowed"], [[43392, 43456], "valid"], [[43457, 43469], "valid", [], "NV8"], [[43470, 43470], "disallowed"], [[43471, 43481], "valid"], [[43482, 43485], "disallowed"], [[43486, 43487], "valid", [], "NV8"], [[43488, 43518], "valid"], [[43519, 43519], "disallowed"], [[43520, 43574], "valid"], [[43575, 43583], "disallowed"], [[43584, 43597], "valid"], [[43598, 43599], "disallowed"], [[43600, 43609], "valid"], [[43610, 43611], "disallowed"], [[43612, 43615], "valid", [], "NV8"], [[43616, 43638], "valid"], [[43639, 43641], "valid", [], "NV8"], [[43642, 43643], "valid"], [[43644, 43647], "valid"], [[43648, 43714], "valid"], [[43715, 43738], "disallowed"], [[43739, 43741], "valid"], [[43742, 43743], "valid", [], "NV8"], [[43744, 43759], "valid"], [[43760, 43761], "valid", [], "NV8"], [[43762, 43766], "valid"], [[43767, 43776], "disallowed"], [[43777, 43782], "valid"], [[43783, 43784], "disallowed"], [[43785, 43790], "valid"], [[43791, 43792], "disallowed"], [[43793, 43798], "valid"], [[43799, 43807], "disallowed"], [[43808, 43814], "valid"], [[43815, 43815], "disallowed"], [[43816, 43822], "valid"], [[43823, 43823], "disallowed"], [[43824, 43866], "valid"], [[43867, 43867], "valid", [], "NV8"], [[43868, 43868], "mapped", [42791]], [[43869, 43869], "mapped", [43831]], [[43870, 43870], "mapped", [619]], [[43871, 43871], "mapped", [43858]], [[43872, 43875], "valid"], [[43876, 43877], "valid"], [[43878, 43887], "disallowed"], [[43888, 43888], "mapped", [5024]], [[43889, 43889], "mapped", [5025]], [[43890, 43890], "mapped", [5026]], [[43891, 43891], "mapped", [5027]], [[43892, 43892], "mapped", [5028]], [[43893, 43893], "mapped", [5029]], [[43894, 43894], "mapped", [5030]], [[43895, 43895], "mapped", [5031]], [[43896, 43896], "mapped", [5032]], [[43897, 43897], "mapped", [5033]], [[43898, 43898], "mapped", [5034]], [[43899, 43899], "mapped", [5035]], [[43900, 43900], "mapped", [5036]], [[43901, 43901], "mapped", [5037]], [[43902, 43902], "mapped", [5038]], [[43903, 43903], "mapped", [5039]], [[43904, 43904], "mapped", [5040]], [[43905, 43905], "mapped", [5041]], [[43906, 43906], "mapped", [5042]], [[43907, 43907], "mapped", [5043]], [[43908, 43908], "mapped", [5044]], [[43909, 43909], "mapped", [5045]], [[43910, 43910], "mapped", [5046]], [[43911, 43911], "mapped", [5047]], [[43912, 43912], "mapped", [5048]], [[43913, 43913], "mapped", [5049]], [[43914, 43914], "mapped", [5050]], [[43915, 43915], "mapped", [5051]], [[43916, 43916], "mapped", [5052]], [[43917, 43917], "mapped", [5053]], [[43918, 43918], "mapped", [5054]], [[43919, 43919], "mapped", [5055]], [[43920, 43920], "mapped", [5056]], [[43921, 43921], "mapped", [5057]], [[43922, 43922], "mapped", [5058]], [[43923, 43923], "mapped", [5059]], [[43924, 43924], "mapped", [5060]], [[43925, 43925], "mapped", [5061]], [[43926, 43926], "mapped", [5062]], [[43927, 43927], "mapped", [5063]], [[43928, 43928], "mapped", [5064]], [[43929, 43929], "mapped", [5065]], [[43930, 43930], "mapped", [5066]], [[43931, 43931], "mapped", [5067]], [[43932, 43932], "mapped", [5068]], [[43933, 43933], "mapped", [5069]], [[43934, 43934], "mapped", [5070]], [[43935, 43935], "mapped", [5071]], [[43936, 43936], "mapped", [5072]], [[43937, 43937], "mapped", [5073]], [[43938, 43938], "mapped", [5074]], [[43939, 43939], "mapped", [5075]], [[43940, 43940], "mapped", [5076]], [[43941, 43941], "mapped", [5077]], [[43942, 43942], "mapped", [5078]], [[43943, 43943], "mapped", [5079]], [[43944, 43944], "mapped", [5080]], [[43945, 43945], "mapped", [5081]], [[43946, 43946], "mapped", [5082]], [[43947, 43947], "mapped", [5083]], [[43948, 43948], "mapped", [5084]], [[43949, 43949], "mapped", [5085]], [[43950, 43950], "mapped", [5086]], [[43951, 43951], "mapped", [5087]], [[43952, 43952], "mapped", [5088]], [[43953, 43953], "mapped", [5089]], [[43954, 43954], "mapped", [5090]], [[43955, 43955], "mapped", [5091]], [[43956, 43956], "mapped", [5092]], [[43957, 43957], "mapped", [5093]], [[43958, 43958], "mapped", [5094]], [[43959, 43959], "mapped", [5095]], [[43960, 43960], "mapped", [5096]], [[43961, 43961], "mapped", [5097]], [[43962, 43962], "mapped", [5098]], [[43963, 43963], "mapped", [5099]], [[43964, 43964], "mapped", [5100]], [[43965, 43965], "mapped", [5101]], [[43966, 43966], "mapped", [5102]], [[43967, 43967], "mapped", [5103]], [[43968, 44010], "valid"], [[44011, 44011], "valid", [], "NV8"], [[44012, 44013], "valid"], [[44014, 44015], "disallowed"], [[44016, 44025], "valid"], [[44026, 44031], "disallowed"], [[44032, 55203], "valid"], [[55204, 55215], "disallowed"], [[55216, 55238], "valid", [], "NV8"], [[55239, 55242], "disallowed"], [[55243, 55291], "valid", [], "NV8"], [[55292, 55295], "disallowed"], [[55296, 57343], "disallowed"], [[57344, 63743], "disallowed"], [[63744, 63744], "mapped", [35912]], [[63745, 63745], "mapped", [26356]], [[63746, 63746], "mapped", [36554]], [[63747, 63747], "mapped", [36040]], [[63748, 63748], "mapped", [28369]], [[63749, 63749], "mapped", [20018]], [[63750, 63750], "mapped", [21477]], [[63751, 63752], "mapped", [40860]], [[63753, 63753], "mapped", [22865]], [[63754, 63754], "mapped", [37329]], [[63755, 63755], "mapped", [21895]], [[63756, 63756], "mapped", [22856]], [[63757, 63757], "mapped", [25078]], [[63758, 63758], "mapped", [30313]], [[63759, 63759], "mapped", [32645]], [[63760, 63760], "mapped", [34367]], [[63761, 63761], "mapped", [34746]], [[63762, 63762], "mapped", [35064]], [[63763, 63763], "mapped", [37007]], [[63764, 63764], "mapped", [27138]], [[63765, 63765], "mapped", [27931]], [[63766, 63766], "mapped", [28889]], [[63767, 63767], "mapped", [29662]], [[63768, 63768], "mapped", [33853]], [[63769, 63769], "mapped", [37226]], [[63770, 63770], "mapped", [39409]], [[63771, 63771], "mapped", [20098]], [[63772, 63772], "mapped", [21365]], [[63773, 63773], "mapped", [27396]], [[63774, 63774], "mapped", [29211]], [[63775, 63775], "mapped", [34349]], [[63776, 63776], "mapped", [40478]], [[63777, 63777], "mapped", [23888]], [[63778, 63778], "mapped", [28651]], [[63779, 63779], "mapped", [34253]], [[63780, 63780], "mapped", [35172]], [[63781, 63781], "mapped", [25289]], [[63782, 63782], "mapped", [33240]], [[63783, 63783], "mapped", [34847]], [[63784, 63784], "mapped", [24266]], [[63785, 63785], "mapped", [26391]], [[63786, 63786], "mapped", [28010]], [[63787, 63787], "mapped", [29436]], [[63788, 63788], "mapped", [37070]], [[63789, 63789], "mapped", [20358]], [[63790, 63790], "mapped", [20919]], [[63791, 63791], "mapped", [21214]], [[63792, 63792], "mapped", [25796]], [[63793, 63793], "mapped", [27347]], [[63794, 63794], "mapped", [29200]], [[63795, 63795], "mapped", [30439]], [[63796, 63796], "mapped", [32769]], [[63797, 63797], "mapped", [34310]], [[63798, 63798], "mapped", [34396]], [[63799, 63799], "mapped", [36335]], [[63800, 63800], "mapped", [38706]], [[63801, 63801], "mapped", [39791]], [[63802, 63802], "mapped", [40442]], [[63803, 63803], "mapped", [30860]], [[63804, 63804], "mapped", [31103]], [[63805, 63805], "mapped", [32160]], [[63806, 63806], "mapped", [33737]], [[63807, 63807], "mapped", [37636]], [[63808, 63808], "mapped", [40575]], [[63809, 63809], "mapped", [35542]], [[63810, 63810], "mapped", [22751]], [[63811, 63811], "mapped", [24324]], [[63812, 63812], "mapped", [31840]], [[63813, 63813], "mapped", [32894]], [[63814, 63814], "mapped", [29282]], [[63815, 63815], "mapped", [30922]], [[63816, 63816], "mapped", [36034]], [[63817, 63817], "mapped", [38647]], [[63818, 63818], "mapped", [22744]], [[63819, 63819], "mapped", [23650]], [[63820, 63820], "mapped", [27155]], [[63821, 63821], "mapped", [28122]], [[63822, 63822], "mapped", [28431]], [[63823, 63823], "mapped", [32047]], [[63824, 63824], "mapped", [32311]], [[63825, 63825], "mapped", [38475]], [[63826, 63826], "mapped", [21202]], [[63827, 63827], "mapped", [32907]], [[63828, 63828], "mapped", [20956]], [[63829, 63829], "mapped", [20940]], [[63830, 63830], "mapped", [31260]], [[63831, 63831], "mapped", [32190]], [[63832, 63832], "mapped", [33777]], [[63833, 63833], "mapped", [38517]], [[63834, 63834], "mapped", [35712]], [[63835, 63835], "mapped", [25295]], [[63836, 63836], "mapped", [27138]], [[63837, 63837], "mapped", [35582]], [[63838, 63838], "mapped", [20025]], [[63839, 63839], "mapped", [23527]], [[63840, 63840], "mapped", [24594]], [[63841, 63841], "mapped", [29575]], [[63842, 63842], "mapped", [30064]], [[63843, 63843], "mapped", [21271]], [[63844, 63844], "mapped", [30971]], [[63845, 63845], "mapped", [20415]], [[63846, 63846], "mapped", [24489]], [[63847, 63847], "mapped", [19981]], [[63848, 63848], "mapped", [27852]], [[63849, 63849], "mapped", [25976]], [[63850, 63850], "mapped", [32034]], [[63851, 63851], "mapped", [21443]], [[63852, 63852], "mapped", [22622]], [[63853, 63853], "mapped", [30465]], [[63854, 63854], "mapped", [33865]], [[63855, 63855], "mapped", [35498]], [[63856, 63856], "mapped", [27578]], [[63857, 63857], "mapped", [36784]], [[63858, 63858], "mapped", [27784]], [[63859, 63859], "mapped", [25342]], [[63860, 63860], "mapped", [33509]], [[63861, 63861], "mapped", [25504]], [[63862, 63862], "mapped", [30053]], [[63863, 63863], "mapped", [20142]], [[63864, 63864], "mapped", [20841]], [[63865, 63865], "mapped", [20937]], [[63866, 63866], "mapped", [26753]], [[63867, 63867], "mapped", [31975]], [[63868, 63868], "mapped", [33391]], [[63869, 63869], "mapped", [35538]], [[63870, 63870], "mapped", [37327]], [[63871, 63871], "mapped", [21237]], [[63872, 63872], "mapped", [21570]], [[63873, 63873], "mapped", [22899]], [[63874, 63874], "mapped", [24300]], [[63875, 63875], "mapped", [26053]], [[63876, 63876], "mapped", [28670]], [[63877, 63877], "mapped", [31018]], [[63878, 63878], "mapped", [38317]], [[63879, 63879], "mapped", [39530]], [[63880, 63880], "mapped", [40599]], [[63881, 63881], "mapped", [40654]], [[63882, 63882], "mapped", [21147]], [[63883, 63883], "mapped", [26310]], [[63884, 63884], "mapped", [27511]], [[63885, 63885], "mapped", [36706]], [[63886, 63886], "mapped", [24180]], [[63887, 63887], "mapped", [24976]], [[63888, 63888], "mapped", [25088]], [[63889, 63889], "mapped", [25754]], [[63890, 63890], "mapped", [28451]], [[63891, 63891], "mapped", [29001]], [[63892, 63892], "mapped", [29833]], [[63893, 63893], "mapped", [31178]], [[63894, 63894], "mapped", [32244]], [[63895, 63895], "mapped", [32879]], [[63896, 63896], "mapped", [36646]], [[63897, 63897], "mapped", [34030]], [[63898, 63898], "mapped", [36899]], [[63899, 63899], "mapped", [37706]], [[63900, 63900], "mapped", [21015]], [[63901, 63901], "mapped", [21155]], [[63902, 63902], "mapped", [21693]], [[63903, 63903], "mapped", [28872]], [[63904, 63904], "mapped", [35010]], [[63905, 63905], "mapped", [35498]], [[63906, 63906], "mapped", [24265]], [[63907, 63907], "mapped", [24565]], [[63908, 63908], "mapped", [25467]], [[63909, 63909], "mapped", [27566]], [[63910, 63910], "mapped", [31806]], [[63911, 63911], "mapped", [29557]], [[63912, 63912], "mapped", [20196]], [[63913, 63913], "mapped", [22265]], [[63914, 63914], "mapped", [23527]], [[63915, 63915], "mapped", [23994]], [[63916, 63916], "mapped", [24604]], [[63917, 63917], "mapped", [29618]], [[63918, 63918], "mapped", [29801]], [[63919, 63919], "mapped", [32666]], [[63920, 63920], "mapped", [32838]], [[63921, 63921], "mapped", [37428]], [[63922, 63922], "mapped", [38646]], [[63923, 63923], "mapped", [38728]], [[63924, 63924], "mapped", [38936]], [[63925, 63925], "mapped", [20363]], [[63926, 63926], "mapped", [31150]], [[63927, 63927], "mapped", [37300]], [[63928, 63928], "mapped", [38584]], [[63929, 63929], "mapped", [24801]], [[63930, 63930], "mapped", [20102]], [[63931, 63931], "mapped", [20698]], [[63932, 63932], "mapped", [23534]], [[63933, 63933], "mapped", [23615]], [[63934, 63934], "mapped", [26009]], [[63935, 63935], "mapped", [27138]], [[63936, 63936], "mapped", [29134]], [[63937, 63937], "mapped", [30274]], [[63938, 63938], "mapped", [34044]], [[63939, 63939], "mapped", [36988]], [[63940, 63940], "mapped", [40845]], [[63941, 63941], "mapped", [26248]], [[63942, 63942], "mapped", [38446]], [[63943, 63943], "mapped", [21129]], [[63944, 63944], "mapped", [26491]], [[63945, 63945], "mapped", [26611]], [[63946, 63946], "mapped", [27969]], [[63947, 63947], "mapped", [28316]], [[63948, 63948], "mapped", [29705]], [[63949, 63949], "mapped", [30041]], [[63950, 63950], "mapped", [30827]], [[63951, 63951], "mapped", [32016]], [[63952, 63952], "mapped", [39006]], [[63953, 63953], "mapped", [20845]], [[63954, 63954], "mapped", [25134]], [[63955, 63955], "mapped", [38520]], [[63956, 63956], "mapped", [20523]], [[63957, 63957], "mapped", [23833]], [[63958, 63958], "mapped", [28138]], [[63959, 63959], "mapped", [36650]], [[63960, 63960], "mapped", [24459]], [[63961, 63961], "mapped", [24900]], [[63962, 63962], "mapped", [26647]], [[63963, 63963], "mapped", [29575]], [[63964, 63964], "mapped", [38534]], [[63965, 63965], "mapped", [21033]], [[63966, 63966], "mapped", [21519]], [[63967, 63967], "mapped", [23653]], [[63968, 63968], "mapped", [26131]], [[63969, 63969], "mapped", [26446]], [[63970, 63970], "mapped", [26792]], [[63971, 63971], "mapped", [27877]], [[63972, 63972], "mapped", [29702]], [[63973, 63973], "mapped", [30178]], [[63974, 63974], "mapped", [32633]], [[63975, 63975], "mapped", [35023]], [[63976, 63976], "mapped", [35041]], [[63977, 63977], "mapped", [37324]], [[63978, 63978], "mapped", [38626]], [[63979, 63979], "mapped", [21311]], [[63980, 63980], "mapped", [28346]], [[63981, 63981], "mapped", [21533]], [[63982, 63982], "mapped", [29136]], [[63983, 63983], "mapped", [29848]], [[63984, 63984], "mapped", [34298]], [[63985, 63985], "mapped", [38563]], [[63986, 63986], "mapped", [40023]], [[63987, 63987], "mapped", [40607]], [[63988, 63988], "mapped", [26519]], [[63989, 63989], "mapped", [28107]], [[63990, 63990], "mapped", [33256]], [[63991, 63991], "mapped", [31435]], [[63992, 63992], "mapped", [31520]], [[63993, 63993], "mapped", [31890]], [[63994, 63994], "mapped", [29376]], [[63995, 63995], "mapped", [28825]], [[63996, 63996], "mapped", [35672]], [[63997, 63997], "mapped", [20160]], [[63998, 63998], "mapped", [33590]], [[63999, 63999], "mapped", [21050]], [[64e3, 64e3], "mapped", [20999]], [[64001, 64001], "mapped", [24230]], [[64002, 64002], "mapped", [25299]], [[64003, 64003], "mapped", [31958]], [[64004, 64004], "mapped", [23429]], [[64005, 64005], "mapped", [27934]], [[64006, 64006], "mapped", [26292]], [[64007, 64007], "mapped", [36667]], [[64008, 64008], "mapped", [34892]], [[64009, 64009], "mapped", [38477]], [[64010, 64010], "mapped", [35211]], [[64011, 64011], "mapped", [24275]], [[64012, 64012], "mapped", [20800]], [[64013, 64013], "mapped", [21952]], [[64014, 64015], "valid"], [[64016, 64016], "mapped", [22618]], [[64017, 64017], "valid"], [[64018, 64018], "mapped", [26228]], [[64019, 64020], "valid"], [[64021, 64021], "mapped", [20958]], [[64022, 64022], "mapped", [29482]], [[64023, 64023], "mapped", [30410]], [[64024, 64024], "mapped", [31036]], [[64025, 64025], "mapped", [31070]], [[64026, 64026], "mapped", [31077]], [[64027, 64027], "mapped", [31119]], [[64028, 64028], "mapped", [38742]], [[64029, 64029], "mapped", [31934]], [[64030, 64030], "mapped", [32701]], [[64031, 64031], "valid"], [[64032, 64032], "mapped", [34322]], [[64033, 64033], "valid"], [[64034, 64034], "mapped", [35576]], [[64035, 64036], "valid"], [[64037, 64037], "mapped", [36920]], [[64038, 64038], "mapped", [37117]], [[64039, 64041], "valid"], [[64042, 64042], "mapped", [39151]], [[64043, 64043], "mapped", [39164]], [[64044, 64044], "mapped", [39208]], [[64045, 64045], "mapped", [40372]], [[64046, 64046], "mapped", [37086]], [[64047, 64047], "mapped", [38583]], [[64048, 64048], "mapped", [20398]], [[64049, 64049], "mapped", [20711]], [[64050, 64050], "mapped", [20813]], [[64051, 64051], "mapped", [21193]], [[64052, 64052], "mapped", [21220]], [[64053, 64053], "mapped", [21329]], [[64054, 64054], "mapped", [21917]], [[64055, 64055], "mapped", [22022]], [[64056, 64056], "mapped", [22120]], [[64057, 64057], "mapped", [22592]], [[64058, 64058], "mapped", [22696]], [[64059, 64059], "mapped", [23652]], [[64060, 64060], "mapped", [23662]], [[64061, 64061], "mapped", [24724]], [[64062, 64062], "mapped", [24936]], [[64063, 64063], "mapped", [24974]], [[64064, 64064], "mapped", [25074]], [[64065, 64065], "mapped", [25935]], [[64066, 64066], "mapped", [26082]], [[64067, 64067], "mapped", [26257]], [[64068, 64068], "mapped", [26757]], [[64069, 64069], "mapped", [28023]], [[64070, 64070], "mapped", [28186]], [[64071, 64071], "mapped", [28450]], [[64072, 64072], "mapped", [29038]], [[64073, 64073], "mapped", [29227]], [[64074, 64074], "mapped", [29730]], [[64075, 64075], "mapped", [30865]], [[64076, 64076], "mapped", [31038]], [[64077, 64077], "mapped", [31049]], [[64078, 64078], "mapped", [31048]], [[64079, 64079], "mapped", [31056]], [[64080, 64080], "mapped", [31062]], [[64081, 64081], "mapped", [31069]], [[64082, 64082], "mapped", [31117]], [[64083, 64083], "mapped", [31118]], [[64084, 64084], "mapped", [31296]], [[64085, 64085], "mapped", [31361]], [[64086, 64086], "mapped", [31680]], [[64087, 64087], "mapped", [32244]], [[64088, 64088], "mapped", [32265]], [[64089, 64089], "mapped", [32321]], [[64090, 64090], "mapped", [32626]], [[64091, 64091], "mapped", [32773]], [[64092, 64092], "mapped", [33261]], [[64093, 64094], "mapped", [33401]], [[64095, 64095], "mapped", [33879]], [[64096, 64096], "mapped", [35088]], [[64097, 64097], "mapped", [35222]], [[64098, 64098], "mapped", [35585]], [[64099, 64099], "mapped", [35641]], [[64100, 64100], "mapped", [36051]], [[64101, 64101], "mapped", [36104]], [[64102, 64102], "mapped", [36790]], [[64103, 64103], "mapped", [36920]], [[64104, 64104], "mapped", [38627]], [[64105, 64105], "mapped", [38911]], [[64106, 64106], "mapped", [38971]], [[64107, 64107], "mapped", [24693]], [[64108, 64108], "mapped", [148206]], [[64109, 64109], "mapped", [33304]], [[64110, 64111], "disallowed"], [[64112, 64112], "mapped", [20006]], [[64113, 64113], "mapped", [20917]], [[64114, 64114], "mapped", [20840]], [[64115, 64115], "mapped", [20352]], [[64116, 64116], "mapped", [20805]], [[64117, 64117], "mapped", [20864]], [[64118, 64118], "mapped", [21191]], [[64119, 64119], "mapped", [21242]], [[64120, 64120], "mapped", [21917]], [[64121, 64121], "mapped", [21845]], [[64122, 64122], "mapped", [21913]], [[64123, 64123], "mapped", [21986]], [[64124, 64124], "mapped", [22618]], [[64125, 64125], "mapped", [22707]], [[64126, 64126], "mapped", [22852]], [[64127, 64127], "mapped", [22868]], [[64128, 64128], "mapped", [23138]], [[64129, 64129], "mapped", [23336]], [[64130, 64130], "mapped", [24274]], [[64131, 64131], "mapped", [24281]], [[64132, 64132], "mapped", [24425]], [[64133, 64133], "mapped", [24493]], [[64134, 64134], "mapped", [24792]], [[64135, 64135], "mapped", [24910]], [[64136, 64136], "mapped", [24840]], [[64137, 64137], "mapped", [24974]], [[64138, 64138], "mapped", [24928]], [[64139, 64139], "mapped", [25074]], [[64140, 64140], "mapped", [25140]], [[64141, 64141], "mapped", [25540]], [[64142, 64142], "mapped", [25628]], [[64143, 64143], "mapped", [25682]], [[64144, 64144], "mapped", [25942]], [[64145, 64145], "mapped", [26228]], [[64146, 64146], "mapped", [26391]], [[64147, 64147], "mapped", [26395]], [[64148, 64148], "mapped", [26454]], [[64149, 64149], "mapped", [27513]], [[64150, 64150], "mapped", [27578]], [[64151, 64151], "mapped", [27969]], [[64152, 64152], "mapped", [28379]], [[64153, 64153], "mapped", [28363]], [[64154, 64154], "mapped", [28450]], [[64155, 64155], "mapped", [28702]], [[64156, 64156], "mapped", [29038]], [[64157, 64157], "mapped", [30631]], [[64158, 64158], "mapped", [29237]], [[64159, 64159], "mapped", [29359]], [[64160, 64160], "mapped", [29482]], [[64161, 64161], "mapped", [29809]], [[64162, 64162], "mapped", [29958]], [[64163, 64163], "mapped", [30011]], [[64164, 64164], "mapped", [30237]], [[64165, 64165], "mapped", [30239]], [[64166, 64166], "mapped", [30410]], [[64167, 64167], "mapped", [30427]], [[64168, 64168], "mapped", [30452]], [[64169, 64169], "mapped", [30538]], [[64170, 64170], "mapped", [30528]], [[64171, 64171], "mapped", [30924]], [[64172, 64172], "mapped", [31409]], [[64173, 64173], "mapped", [31680]], [[64174, 64174], "mapped", [31867]], [[64175, 64175], "mapped", [32091]], [[64176, 64176], "mapped", [32244]], [[64177, 64177], "mapped", [32574]], [[64178, 64178], "mapped", [32773]], [[64179, 64179], "mapped", [33618]], [[64180, 64180], "mapped", [33775]], [[64181, 64181], "mapped", [34681]], [[64182, 64182], "mapped", [35137]], [[64183, 64183], "mapped", [35206]], [[64184, 64184], "mapped", [35222]], [[64185, 64185], "mapped", [35519]], [[64186, 64186], "mapped", [35576]], [[64187, 64187], "mapped", [35531]], [[64188, 64188], "mapped", [35585]], [[64189, 64189], "mapped", [35582]], [[64190, 64190], "mapped", [35565]], [[64191, 64191], "mapped", [35641]], [[64192, 64192], "mapped", [35722]], [[64193, 64193], "mapped", [36104]], [[64194, 64194], "mapped", [36664]], [[64195, 64195], "mapped", [36978]], [[64196, 64196], "mapped", [37273]], [[64197, 64197], "mapped", [37494]], [[64198, 64198], "mapped", [38524]], [[64199, 64199], "mapped", [38627]], [[64200, 64200], "mapped", [38742]], [[64201, 64201], "mapped", [38875]], [[64202, 64202], "mapped", [38911]], [[64203, 64203], "mapped", [38923]], [[64204, 64204], "mapped", [38971]], [[64205, 64205], "mapped", [39698]], [[64206, 64206], "mapped", [40860]], [[64207, 64207], "mapped", [141386]], [[64208, 64208], "mapped", [141380]], [[64209, 64209], "mapped", [144341]], [[64210, 64210], "mapped", [15261]], [[64211, 64211], "mapped", [16408]], [[64212, 64212], "mapped", [16441]], [[64213, 64213], "mapped", [152137]], [[64214, 64214], "mapped", [154832]], [[64215, 64215], "mapped", [163539]], [[64216, 64216], "mapped", [40771]], [[64217, 64217], "mapped", [40846]], [[64218, 64255], "disallowed"], [[64256, 64256], "mapped", [102, 102]], [[64257, 64257], "mapped", [102, 105]], [[64258, 64258], "mapped", [102, 108]], [[64259, 64259], "mapped", [102, 102, 105]], [[64260, 64260], "mapped", [102, 102, 108]], [[64261, 64262], "mapped", [115, 116]], [[64263, 64274], "disallowed"], [[64275, 64275], "mapped", [1396, 1398]], [[64276, 64276], "mapped", [1396, 1381]], [[64277, 64277], "mapped", [1396, 1387]], [[64278, 64278], "mapped", [1406, 1398]], [[64279, 64279], "mapped", [1396, 1389]], [[64280, 64284], "disallowed"], [[64285, 64285], "mapped", [1497, 1460]], [[64286, 64286], "valid"], [[64287, 64287], "mapped", [1522, 1463]], [[64288, 64288], "mapped", [1506]], [[64289, 64289], "mapped", [1488]], [[64290, 64290], "mapped", [1491]], [[64291, 64291], "mapped", [1492]], [[64292, 64292], "mapped", [1499]], [[64293, 64293], "mapped", [1500]], [[64294, 64294], "mapped", [1501]], [[64295, 64295], "mapped", [1512]], [[64296, 64296], "mapped", [1514]], [[64297, 64297], "disallowed_STD3_mapped", [43]], [[64298, 64298], "mapped", [1513, 1473]], [[64299, 64299], "mapped", [1513, 1474]], [[64300, 64300], "mapped", [1513, 1468, 1473]], [[64301, 64301], "mapped", [1513, 1468, 1474]], [[64302, 64302], "mapped", [1488, 1463]], [[64303, 64303], "mapped", [1488, 1464]], [[64304, 64304], "mapped", [1488, 1468]], [[64305, 64305], "mapped", [1489, 1468]], [[64306, 64306], "mapped", [1490, 1468]], [[64307, 64307], "mapped", [1491, 1468]], [[64308, 64308], "mapped", [1492, 1468]], [[64309, 64309], "mapped", [1493, 1468]], [[64310, 64310], "mapped", [1494, 1468]], [[64311, 64311], "disallowed"], [[64312, 64312], "mapped", [1496, 1468]], [[64313, 64313], "mapped", [1497, 1468]], [[64314, 64314], "mapped", [1498, 1468]], [[64315, 64315], "mapped", [1499, 1468]], [[64316, 64316], "mapped", [1500, 1468]], [[64317, 64317], "disallowed"], [[64318, 64318], "mapped", [1502, 1468]], [[64319, 64319], "disallowed"], [[64320, 64320], "mapped", [1504, 1468]], [[64321, 64321], "mapped", [1505, 1468]], [[64322, 64322], "disallowed"], [[64323, 64323], "mapped", [1507, 1468]], [[64324, 64324], "mapped", [1508, 1468]], [[64325, 64325], "disallowed"], [[64326, 64326], "mapped", [1510, 1468]], [[64327, 64327], "mapped", [1511, 1468]], [[64328, 64328], "mapped", [1512, 1468]], [[64329, 64329], "mapped", [1513, 1468]], [[64330, 64330], "mapped", [1514, 1468]], [[64331, 64331], "mapped", [1493, 1465]], [[64332, 64332], "mapped", [1489, 1471]], [[64333, 64333], "mapped", [1499, 1471]], [[64334, 64334], "mapped", [1508, 1471]], [[64335, 64335], "mapped", [1488, 1500]], [[64336, 64337], "mapped", [1649]], [[64338, 64341], "mapped", [1659]], [[64342, 64345], "mapped", [1662]], [[64346, 64349], "mapped", [1664]], [[64350, 64353], "mapped", [1658]], [[64354, 64357], "mapped", [1663]], [[64358, 64361], "mapped", [1657]], [[64362, 64365], "mapped", [1700]], [[64366, 64369], "mapped", [1702]], [[64370, 64373], "mapped", [1668]], [[64374, 64377], "mapped", [1667]], [[64378, 64381], "mapped", [1670]], [[64382, 64385], "mapped", [1671]], [[64386, 64387], "mapped", [1677]], [[64388, 64389], "mapped", [1676]], [[64390, 64391], "mapped", [1678]], [[64392, 64393], "mapped", [1672]], [[64394, 64395], "mapped", [1688]], [[64396, 64397], "mapped", [1681]], [[64398, 64401], "mapped", [1705]], [[64402, 64405], "mapped", [1711]], [[64406, 64409], "mapped", [1715]], [[64410, 64413], "mapped", [1713]], [[64414, 64415], "mapped", [1722]], [[64416, 64419], "mapped", [1723]], [[64420, 64421], "mapped", [1728]], [[64422, 64425], "mapped", [1729]], [[64426, 64429], "mapped", [1726]], [[64430, 64431], "mapped", [1746]], [[64432, 64433], "mapped", [1747]], [[64434, 64449], "valid", [], "NV8"], [[64450, 64466], "disallowed"], [[64467, 64470], "mapped", [1709]], [[64471, 64472], "mapped", [1735]], [[64473, 64474], "mapped", [1734]], [[64475, 64476], "mapped", [1736]], [[64477, 64477], "mapped", [1735, 1652]], [[64478, 64479], "mapped", [1739]], [[64480, 64481], "mapped", [1733]], [[64482, 64483], "mapped", [1737]], [[64484, 64487], "mapped", [1744]], [[64488, 64489], "mapped", [1609]], [[64490, 64491], "mapped", [1574, 1575]], [[64492, 64493], "mapped", [1574, 1749]], [[64494, 64495], "mapped", [1574, 1608]], [[64496, 64497], "mapped", [1574, 1735]], [[64498, 64499], "mapped", [1574, 1734]], [[64500, 64501], "mapped", [1574, 1736]], [[64502, 64504], "mapped", [1574, 1744]], [[64505, 64507], "mapped", [1574, 1609]], [[64508, 64511], "mapped", [1740]], [[64512, 64512], "mapped", [1574, 1580]], [[64513, 64513], "mapped", [1574, 1581]], [[64514, 64514], "mapped", [1574, 1605]], [[64515, 64515], "mapped", [1574, 1609]], [[64516, 64516], "mapped", [1574, 1610]], [[64517, 64517], "mapped", [1576, 1580]], [[64518, 64518], "mapped", [1576, 1581]], [[64519, 64519], "mapped", [1576, 1582]], [[64520, 64520], "mapped", [1576, 1605]], [[64521, 64521], "mapped", [1576, 1609]], [[64522, 64522], "mapped", [1576, 1610]], [[64523, 64523], "mapped", [1578, 1580]], [[64524, 64524], "mapped", [1578, 1581]], [[64525, 64525], "mapped", [1578, 1582]], [[64526, 64526], "mapped", [1578, 1605]], [[64527, 64527], "mapped", [1578, 1609]], [[64528, 64528], "mapped", [1578, 1610]], [[64529, 64529], "mapped", [1579, 1580]], [[64530, 64530], "mapped", [1579, 1605]], [[64531, 64531], "mapped", [1579, 1609]], [[64532, 64532], "mapped", [1579, 1610]], [[64533, 64533], "mapped", [1580, 1581]], [[64534, 64534], "mapped", [1580, 1605]], [[64535, 64535], "mapped", [1581, 1580]], [[64536, 64536], "mapped", [1581, 1605]], [[64537, 64537], "mapped", [1582, 1580]], [[64538, 64538], "mapped", [1582, 1581]], [[64539, 64539], "mapped", [1582, 1605]], [[64540, 64540], "mapped", [1587, 1580]], [[64541, 64541], "mapped", [1587, 1581]], [[64542, 64542], "mapped", [1587, 1582]], [[64543, 64543], "mapped", [1587, 1605]], [[64544, 64544], "mapped", [1589, 1581]], [[64545, 64545], "mapped", [1589, 1605]], [[64546, 64546], "mapped", [1590, 1580]], [[64547, 64547], "mapped", [1590, 1581]], [[64548, 64548], "mapped", [1590, 1582]], [[64549, 64549], "mapped", [1590, 1605]], [[64550, 64550], "mapped", [1591, 1581]], [[64551, 64551], "mapped", [1591, 1605]], [[64552, 64552], "mapped", [1592, 1605]], [[64553, 64553], "mapped", [1593, 1580]], [[64554, 64554], "mapped", [1593, 1605]], [[64555, 64555], "mapped", [1594, 1580]], [[64556, 64556], "mapped", [1594, 1605]], [[64557, 64557], "mapped", [1601, 1580]], [[64558, 64558], "mapped", [1601, 1581]], [[64559, 64559], "mapped", [1601, 1582]], [[64560, 64560], "mapped", [1601, 1605]], [[64561, 64561], "mapped", [1601, 1609]], [[64562, 64562], "mapped", [1601, 1610]], [[64563, 64563], "mapped", [1602, 1581]], [[64564, 64564], "mapped", [1602, 1605]], [[64565, 64565], "mapped", [1602, 1609]], [[64566, 64566], "mapped", [1602, 1610]], [[64567, 64567], "mapped", [1603, 1575]], [[64568, 64568], "mapped", [1603, 1580]], [[64569, 64569], "mapped", [1603, 1581]], [[64570, 64570], "mapped", [1603, 1582]], [[64571, 64571], "mapped", [1603, 1604]], [[64572, 64572], "mapped", [1603, 1605]], [[64573, 64573], "mapped", [1603, 1609]], [[64574, 64574], "mapped", [1603, 1610]], [[64575, 64575], "mapped", [1604, 1580]], [[64576, 64576], "mapped", [1604, 1581]], [[64577, 64577], "mapped", [1604, 1582]], [[64578, 64578], "mapped", [1604, 1605]], [[64579, 64579], "mapped", [1604, 1609]], [[64580, 64580], "mapped", [1604, 1610]], [[64581, 64581], "mapped", [1605, 1580]], [[64582, 64582], "mapped", [1605, 1581]], [[64583, 64583], "mapped", [1605, 1582]], [[64584, 64584], "mapped", [1605, 1605]], [[64585, 64585], "mapped", [1605, 1609]], [[64586, 64586], "mapped", [1605, 1610]], [[64587, 64587], "mapped", [1606, 1580]], [[64588, 64588], "mapped", [1606, 1581]], [[64589, 64589], "mapped", [1606, 1582]], [[64590, 64590], "mapped", [1606, 1605]], [[64591, 64591], "mapped", [1606, 1609]], [[64592, 64592], "mapped", [1606, 1610]], [[64593, 64593], "mapped", [1607, 1580]], [[64594, 64594], "mapped", [1607, 1605]], [[64595, 64595], "mapped", [1607, 1609]], [[64596, 64596], "mapped", [1607, 1610]], [[64597, 64597], "mapped", [1610, 1580]], [[64598, 64598], "mapped", [1610, 1581]], [[64599, 64599], "mapped", [1610, 1582]], [[64600, 64600], "mapped", [1610, 1605]], [[64601, 64601], "mapped", [1610, 1609]], [[64602, 64602], "mapped", [1610, 1610]], [[64603, 64603], "mapped", [1584, 1648]], [[64604, 64604], "mapped", [1585, 1648]], [[64605, 64605], "mapped", [1609, 1648]], [[64606, 64606], "disallowed_STD3_mapped", [32, 1612, 1617]], [[64607, 64607], "disallowed_STD3_mapped", [32, 1613, 1617]], [[64608, 64608], "disallowed_STD3_mapped", [32, 1614, 1617]], [[64609, 64609], "disallowed_STD3_mapped", [32, 1615, 1617]], [[64610, 64610], "disallowed_STD3_mapped", [32, 1616, 1617]], [[64611, 64611], "disallowed_STD3_mapped", [32, 1617, 1648]], [[64612, 64612], "mapped", [1574, 1585]], [[64613, 64613], "mapped", [1574, 1586]], [[64614, 64614], "mapped", [1574, 1605]], [[64615, 64615], "mapped", [1574, 1606]], [[64616, 64616], "mapped", [1574, 1609]], [[64617, 64617], "mapped", [1574, 1610]], [[64618, 64618], "mapped", [1576, 1585]], [[64619, 64619], "mapped", [1576, 1586]], [[64620, 64620], "mapped", [1576, 1605]], [[64621, 64621], "mapped", [1576, 1606]], [[64622, 64622], "mapped", [1576, 1609]], [[64623, 64623], "mapped", [1576, 1610]], [[64624, 64624], "mapped", [1578, 1585]], [[64625, 64625], "mapped", [1578, 1586]], [[64626, 64626], "mapped", [1578, 1605]], [[64627, 64627], "mapped", [1578, 1606]], [[64628, 64628], "mapped", [1578, 1609]], [[64629, 64629], "mapped", [1578, 1610]], [[64630, 64630], "mapped", [1579, 1585]], [[64631, 64631], "mapped", [1579, 1586]], [[64632, 64632], "mapped", [1579, 1605]], [[64633, 64633], "mapped", [1579, 1606]], [[64634, 64634], "mapped", [1579, 1609]], [[64635, 64635], "mapped", [1579, 1610]], [[64636, 64636], "mapped", [1601, 1609]], [[64637, 64637], "mapped", [1601, 1610]], [[64638, 64638], "mapped", [1602, 1609]], [[64639, 64639], "mapped", [1602, 1610]], [[64640, 64640], "mapped", [1603, 1575]], [[64641, 64641], "mapped", [1603, 1604]], [[64642, 64642], "mapped", [1603, 1605]], [[64643, 64643], "mapped", [1603, 1609]], [[64644, 64644], "mapped", [1603, 1610]], [[64645, 64645], "mapped", [1604, 1605]], [[64646, 64646], "mapped", [1604, 1609]], [[64647, 64647], "mapped", [1604, 1610]], [[64648, 64648], "mapped", [1605, 1575]], [[64649, 64649], "mapped", [1605, 1605]], [[64650, 64650], "mapped", [1606, 1585]], [[64651, 64651], "mapped", [1606, 1586]], [[64652, 64652], "mapped", [1606, 1605]], [[64653, 64653], "mapped", [1606, 1606]], [[64654, 64654], "mapped", [1606, 1609]], [[64655, 64655], "mapped", [1606, 1610]], [[64656, 64656], "mapped", [1609, 1648]], [[64657, 64657], "mapped", [1610, 1585]], [[64658, 64658], "mapped", [1610, 1586]], [[64659, 64659], "mapped", [1610, 1605]], [[64660, 64660], "mapped", [1610, 1606]], [[64661, 64661], "mapped", [1610, 1609]], [[64662, 64662], "mapped", [1610, 1610]], [[64663, 64663], "mapped", [1574, 1580]], [[64664, 64664], "mapped", [1574, 1581]], [[64665, 64665], "mapped", [1574, 1582]], [[64666, 64666], "mapped", [1574, 1605]], [[64667, 64667], "mapped", [1574, 1607]], [[64668, 64668], "mapped", [1576, 1580]], [[64669, 64669], "mapped", [1576, 1581]], [[64670, 64670], "mapped", [1576, 1582]], [[64671, 64671], "mapped", [1576, 1605]], [[64672, 64672], "mapped", [1576, 1607]], [[64673, 64673], "mapped", [1578, 1580]], [[64674, 64674], "mapped", [1578, 1581]], [[64675, 64675], "mapped", [1578, 1582]], [[64676, 64676], "mapped", [1578, 1605]], [[64677, 64677], "mapped", [1578, 1607]], [[64678, 64678], "mapped", [1579, 1605]], [[64679, 64679], "mapped", [1580, 1581]], [[64680, 64680], "mapped", [1580, 1605]], [[64681, 64681], "mapped", [1581, 1580]], [[64682, 64682], "mapped", [1581, 1605]], [[64683, 64683], "mapped", [1582, 1580]], [[64684, 64684], "mapped", [1582, 1605]], [[64685, 64685], "mapped", [1587, 1580]], [[64686, 64686], "mapped", [1587, 1581]], [[64687, 64687], "mapped", [1587, 1582]], [[64688, 64688], "mapped", [1587, 1605]], [[64689, 64689], "mapped", [1589, 1581]], [[64690, 64690], "mapped", [1589, 1582]], [[64691, 64691], "mapped", [1589, 1605]], [[64692, 64692], "mapped", [1590, 1580]], [[64693, 64693], "mapped", [1590, 1581]], [[64694, 64694], "mapped", [1590, 1582]], [[64695, 64695], "mapped", [1590, 1605]], [[64696, 64696], "mapped", [1591, 1581]], [[64697, 64697], "mapped", [1592, 1605]], [[64698, 64698], "mapped", [1593, 1580]], [[64699, 64699], "mapped", [1593, 1605]], [[64700, 64700], "mapped", [1594, 1580]], [[64701, 64701], "mapped", [1594, 1605]], [[64702, 64702], "mapped", [1601, 1580]], [[64703, 64703], "mapped", [1601, 1581]], [[64704, 64704], "mapped", [1601, 1582]], [[64705, 64705], "mapped", [1601, 1605]], [[64706, 64706], "mapped", [1602, 1581]], [[64707, 64707], "mapped", [1602, 1605]], [[64708, 64708], "mapped", [1603, 1580]], [[64709, 64709], "mapped", [1603, 1581]], [[64710, 64710], "mapped", [1603, 1582]], [[64711, 64711], "mapped", [1603, 1604]], [[64712, 64712], "mapped", [1603, 1605]], [[64713, 64713], "mapped", [1604, 1580]], [[64714, 64714], "mapped", [1604, 1581]], [[64715, 64715], "mapped", [1604, 1582]], [[64716, 64716], "mapped", [1604, 1605]], [[64717, 64717], "mapped", [1604, 1607]], [[64718, 64718], "mapped", [1605, 1580]], [[64719, 64719], "mapped", [1605, 1581]], [[64720, 64720], "mapped", [1605, 1582]], [[64721, 64721], "mapped", [1605, 1605]], [[64722, 64722], "mapped", [1606, 1580]], [[64723, 64723], "mapped", [1606, 1581]], [[64724, 64724], "mapped", [1606, 1582]], [[64725, 64725], "mapped", [1606, 1605]], [[64726, 64726], "mapped", [1606, 1607]], [[64727, 64727], "mapped", [1607, 1580]], [[64728, 64728], "mapped", [1607, 1605]], [[64729, 64729], "mapped", [1607, 1648]], [[64730, 64730], "mapped", [1610, 1580]], [[64731, 64731], "mapped", [1610, 1581]], [[64732, 64732], "mapped", [1610, 1582]], [[64733, 64733], "mapped", [1610, 1605]], [[64734, 64734], "mapped", [1610, 1607]], [[64735, 64735], "mapped", [1574, 1605]], [[64736, 64736], "mapped", [1574, 1607]], [[64737, 64737], "mapped", [1576, 1605]], [[64738, 64738], "mapped", [1576, 1607]], [[64739, 64739], "mapped", [1578, 1605]], [[64740, 64740], "mapped", [1578, 1607]], [[64741, 64741], "mapped", [1579, 1605]], [[64742, 64742], "mapped", [1579, 1607]], [[64743, 64743], "mapped", [1587, 1605]], [[64744, 64744], "mapped", [1587, 1607]], [[64745, 64745], "mapped", [1588, 1605]], [[64746, 64746], "mapped", [1588, 1607]], [[64747, 64747], "mapped", [1603, 1604]], [[64748, 64748], "mapped", [1603, 1605]], [[64749, 64749], "mapped", [1604, 1605]], [[64750, 64750], "mapped", [1606, 1605]], [[64751, 64751], "mapped", [1606, 1607]], [[64752, 64752], "mapped", [1610, 1605]], [[64753, 64753], "mapped", [1610, 1607]], [[64754, 64754], "mapped", [1600, 1614, 1617]], [[64755, 64755], "mapped", [1600, 1615, 1617]], [[64756, 64756], "mapped", [1600, 1616, 1617]], [[64757, 64757], "mapped", [1591, 1609]], [[64758, 64758], "mapped", [1591, 1610]], [[64759, 64759], "mapped", [1593, 1609]], [[64760, 64760], "mapped", [1593, 1610]], [[64761, 64761], "mapped", [1594, 1609]], [[64762, 64762], "mapped", [1594, 1610]], [[64763, 64763], "mapped", [1587, 1609]], [[64764, 64764], "mapped", [1587, 1610]], [[64765, 64765], "mapped", [1588, 1609]], [[64766, 64766], "mapped", [1588, 1610]], [[64767, 64767], "mapped", [1581, 1609]], [[64768, 64768], "mapped", [1581, 1610]], [[64769, 64769], "mapped", [1580, 1609]], [[64770, 64770], "mapped", [1580, 1610]], [[64771, 64771], "mapped", [1582, 1609]], [[64772, 64772], "mapped", [1582, 1610]], [[64773, 64773], "mapped", [1589, 1609]], [[64774, 64774], "mapped", [1589, 1610]], [[64775, 64775], "mapped", [1590, 1609]], [[64776, 64776], "mapped", [1590, 1610]], [[64777, 64777], "mapped", [1588, 1580]], [[64778, 64778], "mapped", [1588, 1581]], [[64779, 64779], "mapped", [1588, 1582]], [[64780, 64780], "mapped", [1588, 1605]], [[64781, 64781], "mapped", [1588, 1585]], [[64782, 64782], "mapped", [1587, 1585]], [[64783, 64783], "mapped", [1589, 1585]], [[64784, 64784], "mapped", [1590, 1585]], [[64785, 64785], "mapped", [1591, 1609]], [[64786, 64786], "mapped", [1591, 1610]], [[64787, 64787], "mapped", [1593, 1609]], [[64788, 64788], "mapped", [1593, 1610]], [[64789, 64789], "mapped", [1594, 1609]], [[64790, 64790], "mapped", [1594, 1610]], [[64791, 64791], "mapped", [1587, 1609]], [[64792, 64792], "mapped", [1587, 1610]], [[64793, 64793], "mapped", [1588, 1609]], [[64794, 64794], "mapped", [1588, 1610]], [[64795, 64795], "mapped", [1581, 1609]], [[64796, 64796], "mapped", [1581, 1610]], [[64797, 64797], "mapped", [1580, 1609]], [[64798, 64798], "mapped", [1580, 1610]], [[64799, 64799], "mapped", [1582, 1609]], [[64800, 64800], "mapped", [1582, 1610]], [[64801, 64801], "mapped", [1589, 1609]], [[64802, 64802], "mapped", [1589, 1610]], [[64803, 64803], "mapped", [1590, 1609]], [[64804, 64804], "mapped", [1590, 1610]], [[64805, 64805], "mapped", [1588, 1580]], [[64806, 64806], "mapped", [1588, 1581]], [[64807, 64807], "mapped", [1588, 1582]], [[64808, 64808], "mapped", [1588, 1605]], [[64809, 64809], "mapped", [1588, 1585]], [[64810, 64810], "mapped", [1587, 1585]], [[64811, 64811], "mapped", [1589, 1585]], [[64812, 64812], "mapped", [1590, 1585]], [[64813, 64813], "mapped", [1588, 1580]], [[64814, 64814], "mapped", [1588, 1581]], [[64815, 64815], "mapped", [1588, 1582]], [[64816, 64816], "mapped", [1588, 1605]], [[64817, 64817], "mapped", [1587, 1607]], [[64818, 64818], "mapped", [1588, 1607]], [[64819, 64819], "mapped", [1591, 1605]], [[64820, 64820], "mapped", [1587, 1580]], [[64821, 64821], "mapped", [1587, 1581]], [[64822, 64822], "mapped", [1587, 1582]], [[64823, 64823], "mapped", [1588, 1580]], [[64824, 64824], "mapped", [1588, 1581]], [[64825, 64825], "mapped", [1588, 1582]], [[64826, 64826], "mapped", [1591, 1605]], [[64827, 64827], "mapped", [1592, 1605]], [[64828, 64829], "mapped", [1575, 1611]], [[64830, 64831], "valid", [], "NV8"], [[64832, 64847], "disallowed"], [[64848, 64848], "mapped", [1578, 1580, 1605]], [[64849, 64850], "mapped", [1578, 1581, 1580]], [[64851, 64851], "mapped", [1578, 1581, 1605]], [[64852, 64852], "mapped", [1578, 1582, 1605]], [[64853, 64853], "mapped", [1578, 1605, 1580]], [[64854, 64854], "mapped", [1578, 1605, 1581]], [[64855, 64855], "mapped", [1578, 1605, 1582]], [[64856, 64857], "mapped", [1580, 1605, 1581]], [[64858, 64858], "mapped", [1581, 1605, 1610]], [[64859, 64859], "mapped", [1581, 1605, 1609]], [[64860, 64860], "mapped", [1587, 1581, 1580]], [[64861, 64861], "mapped", [1587, 1580, 1581]], [[64862, 64862], "mapped", [1587, 1580, 1609]], [[64863, 64864], "mapped", [1587, 1605, 1581]], [[64865, 64865], "mapped", [1587, 1605, 1580]], [[64866, 64867], "mapped", [1587, 1605, 1605]], [[64868, 64869], "mapped", [1589, 1581, 1581]], [[64870, 64870], "mapped", [1589, 1605, 1605]], [[64871, 64872], "mapped", [1588, 1581, 1605]], [[64873, 64873], "mapped", [1588, 1580, 1610]], [[64874, 64875], "mapped", [1588, 1605, 1582]], [[64876, 64877], "mapped", [1588, 1605, 1605]], [[64878, 64878], "mapped", [1590, 1581, 1609]], [[64879, 64880], "mapped", [1590, 1582, 1605]], [[64881, 64882], "mapped", [1591, 1605, 1581]], [[64883, 64883], "mapped", [1591, 1605, 1605]], [[64884, 64884], "mapped", [1591, 1605, 1610]], [[64885, 64885], "mapped", [1593, 1580, 1605]], [[64886, 64887], "mapped", [1593, 1605, 1605]], [[64888, 64888], "mapped", [1593, 1605, 1609]], [[64889, 64889], "mapped", [1594, 1605, 1605]], [[64890, 64890], "mapped", [1594, 1605, 1610]], [[64891, 64891], "mapped", [1594, 1605, 1609]], [[64892, 64893], "mapped", [1601, 1582, 1605]], [[64894, 64894], "mapped", [1602, 1605, 1581]], [[64895, 64895], "mapped", [1602, 1605, 1605]], [[64896, 64896], "mapped", [1604, 1581, 1605]], [[64897, 64897], "mapped", [1604, 1581, 1610]], [[64898, 64898], "mapped", [1604, 1581, 1609]], [[64899, 64900], "mapped", [1604, 1580, 1580]], [[64901, 64902], "mapped", [1604, 1582, 1605]], [[64903, 64904], "mapped", [1604, 1605, 1581]], [[64905, 64905], "mapped", [1605, 1581, 1580]], [[64906, 64906], "mapped", [1605, 1581, 1605]], [[64907, 64907], "mapped", [1605, 1581, 1610]], [[64908, 64908], "mapped", [1605, 1580, 1581]], [[64909, 64909], "mapped", [1605, 1580, 1605]], [[64910, 64910], "mapped", [1605, 1582, 1580]], [[64911, 64911], "mapped", [1605, 1582, 1605]], [[64912, 64913], "disallowed"], [[64914, 64914], "mapped", [1605, 1580, 1582]], [[64915, 64915], "mapped", [1607, 1605, 1580]], [[64916, 64916], "mapped", [1607, 1605, 1605]], [[64917, 64917], "mapped", [1606, 1581, 1605]], [[64918, 64918], "mapped", [1606, 1581, 1609]], [[64919, 64920], "mapped", [1606, 1580, 1605]], [[64921, 64921], "mapped", [1606, 1580, 1609]], [[64922, 64922], "mapped", [1606, 1605, 1610]], [[64923, 64923], "mapped", [1606, 1605, 1609]], [[64924, 64925], "mapped", [1610, 1605, 1605]], [[64926, 64926], "mapped", [1576, 1582, 1610]], [[64927, 64927], "mapped", [1578, 1580, 1610]], [[64928, 64928], "mapped", [1578, 1580, 1609]], [[64929, 64929], "mapped", [1578, 1582, 1610]], [[64930, 64930], "mapped", [1578, 1582, 1609]], [[64931, 64931], "mapped", [1578, 1605, 1610]], [[64932, 64932], "mapped", [1578, 1605, 1609]], [[64933, 64933], "mapped", [1580, 1605, 1610]], [[64934, 64934], "mapped", [1580, 1581, 1609]], [[64935, 64935], "mapped", [1580, 1605, 1609]], [[64936, 64936], "mapped", [1587, 1582, 1609]], [[64937, 64937], "mapped", [1589, 1581, 1610]], [[64938, 64938], "mapped", [1588, 1581, 1610]], [[64939, 64939], "mapped", [1590, 1581, 1610]], [[64940, 64940], "mapped", [1604, 1580, 1610]], [[64941, 64941], "mapped", [1604, 1605, 1610]], [[64942, 64942], "mapped", [1610, 1581, 1610]], [[64943, 64943], "mapped", [1610, 1580, 1610]], [[64944, 64944], "mapped", [1610, 1605, 1610]], [[64945, 64945], "mapped", [1605, 1605, 1610]], [[64946, 64946], "mapped", [1602, 1605, 1610]], [[64947, 64947], "mapped", [1606, 1581, 1610]], [[64948, 64948], "mapped", [1602, 1605, 1581]], [[64949, 64949], "mapped", [1604, 1581, 1605]], [[64950, 64950], "mapped", [1593, 1605, 1610]], [[64951, 64951], "mapped", [1603, 1605, 1610]], [[64952, 64952], "mapped", [1606, 1580, 1581]], [[64953, 64953], "mapped", [1605, 1582, 1610]], [[64954, 64954], "mapped", [1604, 1580, 1605]], [[64955, 64955], "mapped", [1603, 1605, 1605]], [[64956, 64956], "mapped", [1604, 1580, 1605]], [[64957, 64957], "mapped", [1606, 1580, 1581]], [[64958, 64958], "mapped", [1580, 1581, 1610]], [[64959, 64959], "mapped", [1581, 1580, 1610]], [[64960, 64960], "mapped", [1605, 1580, 1610]], [[64961, 64961], "mapped", [1601, 1605, 1610]], [[64962, 64962], "mapped", [1576, 1581, 1610]], [[64963, 64963], "mapped", [1603, 1605, 1605]], [[64964, 64964], "mapped", [1593, 1580, 1605]], [[64965, 64965], "mapped", [1589, 1605, 1605]], [[64966, 64966], "mapped", [1587, 1582, 1610]], [[64967, 64967], "mapped", [1606, 1580, 1610]], [[64968, 64975], "disallowed"], [[64976, 65007], "disallowed"], [[65008, 65008], "mapped", [1589, 1604, 1746]], [[65009, 65009], "mapped", [1602, 1604, 1746]], [[65010, 65010], "mapped", [1575, 1604, 1604, 1607]], [[65011, 65011], "mapped", [1575, 1603, 1576, 1585]], [[65012, 65012], "mapped", [1605, 1581, 1605, 1583]], [[65013, 65013], "mapped", [1589, 1604, 1593, 1605]], [[65014, 65014], "mapped", [1585, 1587, 1608, 1604]], [[65015, 65015], "mapped", [1593, 1604, 1610, 1607]], [[65016, 65016], "mapped", [1608, 1587, 1604, 1605]], [[65017, 65017], "mapped", [1589, 1604, 1609]], [[65018, 65018], "disallowed_STD3_mapped", [1589, 1604, 1609, 32, 1575, 1604, 1604, 1607, 32, 1593, 1604, 1610, 1607, 32, 1608, 1587, 1604, 1605]], [[65019, 65019], "disallowed_STD3_mapped", [1580, 1604, 32, 1580, 1604, 1575, 1604, 1607]], [[65020, 65020], "mapped", [1585, 1740, 1575, 1604]], [[65021, 65021], "valid", [], "NV8"], [[65022, 65023], "disallowed"], [[65024, 65039], "ignored"], [[65040, 65040], "disallowed_STD3_mapped", [44]], [[65041, 65041], "mapped", [12289]], [[65042, 65042], "disallowed"], [[65043, 65043], "disallowed_STD3_mapped", [58]], [[65044, 65044], "disallowed_STD3_mapped", [59]], [[65045, 65045], "disallowed_STD3_mapped", [33]], [[65046, 65046], "disallowed_STD3_mapped", [63]], [[65047, 65047], "mapped", [12310]], [[65048, 65048], "mapped", [12311]], [[65049, 65049], "disallowed"], [[65050, 65055], "disallowed"], [[65056, 65059], "valid"], [[65060, 65062], "valid"], [[65063, 65069], "valid"], [[65070, 65071], "valid"], [[65072, 65072], "disallowed"], [[65073, 65073], "mapped", [8212]], [[65074, 65074], "mapped", [8211]], [[65075, 65076], "disallowed_STD3_mapped", [95]], [[65077, 65077], "disallowed_STD3_mapped", [40]], [[65078, 65078], "disallowed_STD3_mapped", [41]], [[65079, 65079], "disallowed_STD3_mapped", [123]], [[65080, 65080], "disallowed_STD3_mapped", [125]], [[65081, 65081], "mapped", [12308]], [[65082, 65082], "mapped", [12309]], [[65083, 65083], "mapped", [12304]], [[65084, 65084], "mapped", [12305]], [[65085, 65085], "mapped", [12298]], [[65086, 65086], "mapped", [12299]], [[65087, 65087], "mapped", [12296]], [[65088, 65088], "mapped", [12297]], [[65089, 65089], "mapped", [12300]], [[65090, 65090], "mapped", [12301]], [[65091, 65091], "mapped", [12302]], [[65092, 65092], "mapped", [12303]], [[65093, 65094], "valid", [], "NV8"], [[65095, 65095], "disallowed_STD3_mapped", [91]], [[65096, 65096], "disallowed_STD3_mapped", [93]], [[65097, 65100], "disallowed_STD3_mapped", [32, 773]], [[65101, 65103], "disallowed_STD3_mapped", [95]], [[65104, 65104], "disallowed_STD3_mapped", [44]], [[65105, 65105], "mapped", [12289]], [[65106, 65106], "disallowed"], [[65107, 65107], "disallowed"], [[65108, 65108], "disallowed_STD3_mapped", [59]], [[65109, 65109], "disallowed_STD3_mapped", [58]], [[65110, 65110], "disallowed_STD3_mapped", [63]], [[65111, 65111], "disallowed_STD3_mapped", [33]], [[65112, 65112], "mapped", [8212]], [[65113, 65113], "disallowed_STD3_mapped", [40]], [[65114, 65114], "disallowed_STD3_mapped", [41]], [[65115, 65115], "disallowed_STD3_mapped", [123]], [[65116, 65116], "disallowed_STD3_mapped", [125]], [[65117, 65117], "mapped", [12308]], [[65118, 65118], "mapped", [12309]], [[65119, 65119], "disallowed_STD3_mapped", [35]], [[65120, 65120], "disallowed_STD3_mapped", [38]], [[65121, 65121], "disallowed_STD3_mapped", [42]], [[65122, 65122], "disallowed_STD3_mapped", [43]], [[65123, 65123], "mapped", [45]], [[65124, 65124], "disallowed_STD3_mapped", [60]], [[65125, 65125], "disallowed_STD3_mapped", [62]], [[65126, 65126], "disallowed_STD3_mapped", [61]], [[65127, 65127], "disallowed"], [[65128, 65128], "disallowed_STD3_mapped", [92]], [[65129, 65129], "disallowed_STD3_mapped", [36]], [[65130, 65130], "disallowed_STD3_mapped", [37]], [[65131, 65131], "disallowed_STD3_mapped", [64]], [[65132, 65135], "disallowed"], [[65136, 65136], "disallowed_STD3_mapped", [32, 1611]], [[65137, 65137], "mapped", [1600, 1611]], [[65138, 65138], "disallowed_STD3_mapped", [32, 1612]], [[65139, 65139], "valid"], [[65140, 65140], "disallowed_STD3_mapped", [32, 1613]], [[65141, 65141], "disallowed"], [[65142, 65142], "disallowed_STD3_mapped", [32, 1614]], [[65143, 65143], "mapped", [1600, 1614]], [[65144, 65144], "disallowed_STD3_mapped", [32, 1615]], [[65145, 65145], "mapped", [1600, 1615]], [[65146, 65146], "disallowed_STD3_mapped", [32, 1616]], [[65147, 65147], "mapped", [1600, 1616]], [[65148, 65148], "disallowed_STD3_mapped", [32, 1617]], [[65149, 65149], "mapped", [1600, 1617]], [[65150, 65150], "disallowed_STD3_mapped", [32, 1618]], [[65151, 65151], "mapped", [1600, 1618]], [[65152, 65152], "mapped", [1569]], [[65153, 65154], "mapped", [1570]], [[65155, 65156], "mapped", [1571]], [[65157, 65158], "mapped", [1572]], [[65159, 65160], "mapped", [1573]], [[65161, 65164], "mapped", [1574]], [[65165, 65166], "mapped", [1575]], [[65167, 65170], "mapped", [1576]], [[65171, 65172], "mapped", [1577]], [[65173, 65176], "mapped", [1578]], [[65177, 65180], "mapped", [1579]], [[65181, 65184], "mapped", [1580]], [[65185, 65188], "mapped", [1581]], [[65189, 65192], "mapped", [1582]], [[65193, 65194], "mapped", [1583]], [[65195, 65196], "mapped", [1584]], [[65197, 65198], "mapped", [1585]], [[65199, 65200], "mapped", [1586]], [[65201, 65204], "mapped", [1587]], [[65205, 65208], "mapped", [1588]], [[65209, 65212], "mapped", [1589]], [[65213, 65216], "mapped", [1590]], [[65217, 65220], "mapped", [1591]], [[65221, 65224], "mapped", [1592]], [[65225, 65228], "mapped", [1593]], [[65229, 65232], "mapped", [1594]], [[65233, 65236], "mapped", [1601]], [[65237, 65240], "mapped", [1602]], [[65241, 65244], "mapped", [1603]], [[65245, 65248], "mapped", [1604]], [[65249, 65252], "mapped", [1605]], [[65253, 65256], "mapped", [1606]], [[65257, 65260], "mapped", [1607]], [[65261, 65262], "mapped", [1608]], [[65263, 65264], "mapped", [1609]], [[65265, 65268], "mapped", [1610]], [[65269, 65270], "mapped", [1604, 1570]], [[65271, 65272], "mapped", [1604, 1571]], [[65273, 65274], "mapped", [1604, 1573]], [[65275, 65276], "mapped", [1604, 1575]], [[65277, 65278], "disallowed"], [[65279, 65279], "ignored"], [[65280, 65280], "disallowed"], [[65281, 65281], "disallowed_STD3_mapped", [33]], [[65282, 65282], "disallowed_STD3_mapped", [34]], [[65283, 65283], "disallowed_STD3_mapped", [35]], [[65284, 65284], "disallowed_STD3_mapped", [36]], [[65285, 65285], "disallowed_STD3_mapped", [37]], [[65286, 65286], "disallowed_STD3_mapped", [38]], [[65287, 65287], "disallowed_STD3_mapped", [39]], [[65288, 65288], "disallowed_STD3_mapped", [40]], [[65289, 65289], "disallowed_STD3_mapped", [41]], [[65290, 65290], "disallowed_STD3_mapped", [42]], [[65291, 65291], "disallowed_STD3_mapped", [43]], [[65292, 65292], "disallowed_STD3_mapped", [44]], [[65293, 65293], "mapped", [45]], [[65294, 65294], "mapped", [46]], [[65295, 65295], "disallowed_STD3_mapped", [47]], [[65296, 65296], "mapped", [48]], [[65297, 65297], "mapped", [49]], [[65298, 65298], "mapped", [50]], [[65299, 65299], "mapped", [51]], [[65300, 65300], "mapped", [52]], [[65301, 65301], "mapped", [53]], [[65302, 65302], "mapped", [54]], [[65303, 65303], "mapped", [55]], [[65304, 65304], "mapped", [56]], [[65305, 65305], "mapped", [57]], [[65306, 65306], "disallowed_STD3_mapped", [58]], [[65307, 65307], "disallowed_STD3_mapped", [59]], [[65308, 65308], "disallowed_STD3_mapped", [60]], [[65309, 65309], "disallowed_STD3_mapped", [61]], [[65310, 65310], "disallowed_STD3_mapped", [62]], [[65311, 65311], "disallowed_STD3_mapped", [63]], [[65312, 65312], "disallowed_STD3_mapped", [64]], [[65313, 65313], "mapped", [97]], [[65314, 65314], "mapped", [98]], [[65315, 65315], "mapped", [99]], [[65316, 65316], "mapped", [100]], [[65317, 65317], "mapped", [101]], [[65318, 65318], "mapped", [102]], [[65319, 65319], "mapped", [103]], [[65320, 65320], "mapped", [104]], [[65321, 65321], "mapped", [105]], [[65322, 65322], "mapped", [106]], [[65323, 65323], "mapped", [107]], [[65324, 65324], "mapped", [108]], [[65325, 65325], "mapped", [109]], [[65326, 65326], "mapped", [110]], [[65327, 65327], "mapped", [111]], [[65328, 65328], "mapped", [112]], [[65329, 65329], "mapped", [113]], [[65330, 65330], "mapped", [114]], [[65331, 65331], "mapped", [115]], [[65332, 65332], "mapped", [116]], [[65333, 65333], "mapped", [117]], [[65334, 65334], "mapped", [118]], [[65335, 65335], "mapped", [119]], [[65336, 65336], "mapped", [120]], [[65337, 65337], "mapped", [121]], [[65338, 65338], "mapped", [122]], [[65339, 65339], "disallowed_STD3_mapped", [91]], [[65340, 65340], "disallowed_STD3_mapped", [92]], [[65341, 65341], "disallowed_STD3_mapped", [93]], [[65342, 65342], "disallowed_STD3_mapped", [94]], [[65343, 65343], "disallowed_STD3_mapped", [95]], [[65344, 65344], "disallowed_STD3_mapped", [96]], [[65345, 65345], "mapped", [97]], [[65346, 65346], "mapped", [98]], [[65347, 65347], "mapped", [99]], [[65348, 65348], "mapped", [100]], [[65349, 65349], "mapped", [101]], [[65350, 65350], "mapped", [102]], [[65351, 65351], "mapped", [103]], [[65352, 65352], "mapped", [104]], [[65353, 65353], "mapped", [105]], [[65354, 65354], "mapped", [106]], [[65355, 65355], "mapped", [107]], [[65356, 65356], "mapped", [108]], [[65357, 65357], "mapped", [109]], [[65358, 65358], "mapped", [110]], [[65359, 65359], "mapped", [111]], [[65360, 65360], "mapped", [112]], [[65361, 65361], "mapped", [113]], [[65362, 65362], "mapped", [114]], [[65363, 65363], "mapped", [115]], [[65364, 65364], "mapped", [116]], [[65365, 65365], "mapped", [117]], [[65366, 65366], "mapped", [118]], [[65367, 65367], "mapped", [119]], [[65368, 65368], "mapped", [120]], [[65369, 65369], "mapped", [121]], [[65370, 65370], "mapped", [122]], [[65371, 65371], "disallowed_STD3_mapped", [123]], [[65372, 65372], "disallowed_STD3_mapped", [124]], [[65373, 65373], "disallowed_STD3_mapped", [125]], [[65374, 65374], "disallowed_STD3_mapped", [126]], [[65375, 65375], "mapped", [10629]], [[65376, 65376], "mapped", [10630]], [[65377, 65377], "mapped", [46]], [[65378, 65378], "mapped", [12300]], [[65379, 65379], "mapped", [12301]], [[65380, 65380], "mapped", [12289]], [[65381, 65381], "mapped", [12539]], [[65382, 65382], "mapped", [12530]], [[65383, 65383], "mapped", [12449]], [[65384, 65384], "mapped", [12451]], [[65385, 65385], "mapped", [12453]], [[65386, 65386], "mapped", [12455]], [[65387, 65387], "mapped", [12457]], [[65388, 65388], "mapped", [12515]], [[65389, 65389], "mapped", [12517]], [[65390, 65390], "mapped", [12519]], [[65391, 65391], "mapped", [12483]], [[65392, 65392], "mapped", [12540]], [[65393, 65393], "mapped", [12450]], [[65394, 65394], "mapped", [12452]], [[65395, 65395], "mapped", [12454]], [[65396, 65396], "mapped", [12456]], [[65397, 65397], "mapped", [12458]], [[65398, 65398], "mapped", [12459]], [[65399, 65399], "mapped", [12461]], [[65400, 65400], "mapped", [12463]], [[65401, 65401], "mapped", [12465]], [[65402, 65402], "mapped", [12467]], [[65403, 65403], "mapped", [12469]], [[65404, 65404], "mapped", [12471]], [[65405, 65405], "mapped", [12473]], [[65406, 65406], "mapped", [12475]], [[65407, 65407], "mapped", [12477]], [[65408, 65408], "mapped", [12479]], [[65409, 65409], "mapped", [12481]], [[65410, 65410], "mapped", [12484]], [[65411, 65411], "mapped", [12486]], [[65412, 65412], "mapped", [12488]], [[65413, 65413], "mapped", [12490]], [[65414, 65414], "mapped", [12491]], [[65415, 65415], "mapped", [12492]], [[65416, 65416], "mapped", [12493]], [[65417, 65417], "mapped", [12494]], [[65418, 65418], "mapped", [12495]], [[65419, 65419], "mapped", [12498]], [[65420, 65420], "mapped", [12501]], [[65421, 65421], "mapped", [12504]], [[65422, 65422], "mapped", [12507]], [[65423, 65423], "mapped", [12510]], [[65424, 65424], "mapped", [12511]], [[65425, 65425], "mapped", [12512]], [[65426, 65426], "mapped", [12513]], [[65427, 65427], "mapped", [12514]], [[65428, 65428], "mapped", [12516]], [[65429, 65429], "mapped", [12518]], [[65430, 65430], "mapped", [12520]], [[65431, 65431], "mapped", [12521]], [[65432, 65432], "mapped", [12522]], [[65433, 65433], "mapped", [12523]], [[65434, 65434], "mapped", [12524]], [[65435, 65435], "mapped", [12525]], [[65436, 65436], "mapped", [12527]], [[65437, 65437], "mapped", [12531]], [[65438, 65438], "mapped", [12441]], [[65439, 65439], "mapped", [12442]], [[65440, 65440], "disallowed"], [[65441, 65441], "mapped", [4352]], [[65442, 65442], "mapped", [4353]], [[65443, 65443], "mapped", [4522]], [[65444, 65444], "mapped", [4354]], [[65445, 65445], "mapped", [4524]], [[65446, 65446], "mapped", [4525]], [[65447, 65447], "mapped", [4355]], [[65448, 65448], "mapped", [4356]], [[65449, 65449], "mapped", [4357]], [[65450, 65450], "mapped", [4528]], [[65451, 65451], "mapped", [4529]], [[65452, 65452], "mapped", [4530]], [[65453, 65453], "mapped", [4531]], [[65454, 65454], "mapped", [4532]], [[65455, 65455], "mapped", [4533]], [[65456, 65456], "mapped", [4378]], [[65457, 65457], "mapped", [4358]], [[65458, 65458], "mapped", [4359]], [[65459, 65459], "mapped", [4360]], [[65460, 65460], "mapped", [4385]], [[65461, 65461], "mapped", [4361]], [[65462, 65462], "mapped", [4362]], [[65463, 65463], "mapped", [4363]], [[65464, 65464], "mapped", [4364]], [[65465, 65465], "mapped", [4365]], [[65466, 65466], "mapped", [4366]], [[65467, 65467], "mapped", [4367]], [[65468, 65468], "mapped", [4368]], [[65469, 65469], "mapped", [4369]], [[65470, 65470], "mapped", [4370]], [[65471, 65473], "disallowed"], [[65474, 65474], "mapped", [4449]], [[65475, 65475], "mapped", [4450]], [[65476, 65476], "mapped", [4451]], [[65477, 65477], "mapped", [4452]], [[65478, 65478], "mapped", [4453]], [[65479, 65479], "mapped", [4454]], [[65480, 65481], "disallowed"], [[65482, 65482], "mapped", [4455]], [[65483, 65483], "mapped", [4456]], [[65484, 65484], "mapped", [4457]], [[65485, 65485], "mapped", [4458]], [[65486, 65486], "mapped", [4459]], [[65487, 65487], "mapped", [4460]], [[65488, 65489], "disallowed"], [[65490, 65490], "mapped", [4461]], [[65491, 65491], "mapped", [4462]], [[65492, 65492], "mapped", [4463]], [[65493, 65493], "mapped", [4464]], [[65494, 65494], "mapped", [4465]], [[65495, 65495], "mapped", [4466]], [[65496, 65497], "disallowed"], [[65498, 65498], "mapped", [4467]], [[65499, 65499], "mapped", [4468]], [[65500, 65500], "mapped", [4469]], [[65501, 65503], "disallowed"], [[65504, 65504], "mapped", [162]], [[65505, 65505], "mapped", [163]], [[65506, 65506], "mapped", [172]], [[65507, 65507], "disallowed_STD3_mapped", [32, 772]], [[65508, 65508], "mapped", [166]], [[65509, 65509], "mapped", [165]], [[65510, 65510], "mapped", [8361]], [[65511, 65511], "disallowed"], [[65512, 65512], "mapped", [9474]], [[65513, 65513], "mapped", [8592]], [[65514, 65514], "mapped", [8593]], [[65515, 65515], "mapped", [8594]], [[65516, 65516], "mapped", [8595]], [[65517, 65517], "mapped", [9632]], [[65518, 65518], "mapped", [9675]], [[65519, 65528], "disallowed"], [[65529, 65531], "disallowed"], [[65532, 65532], "disallowed"], [[65533, 65533], "disallowed"], [[65534, 65535], "disallowed"], [[65536, 65547], "valid"], [[65548, 65548], "disallowed"], [[65549, 65574], "valid"], [[65575, 65575], "disallowed"], [[65576, 65594], "valid"], [[65595, 65595], "disallowed"], [[65596, 65597], "valid"], [[65598, 65598], "disallowed"], [[65599, 65613], "valid"], [[65614, 65615], "disallowed"], [[65616, 65629], "valid"], [[65630, 65663], "disallowed"], [[65664, 65786], "valid"], [[65787, 65791], "disallowed"], [[65792, 65794], "valid", [], "NV8"], [[65795, 65798], "disallowed"], [[65799, 65843], "valid", [], "NV8"], [[65844, 65846], "disallowed"], [[65847, 65855], "valid", [], "NV8"], [[65856, 65930], "valid", [], "NV8"], [[65931, 65932], "valid", [], "NV8"], [[65933, 65935], "disallowed"], [[65936, 65947], "valid", [], "NV8"], [[65948, 65951], "disallowed"], [[65952, 65952], "valid", [], "NV8"], [[65953, 65999], "disallowed"], [[66e3, 66044], "valid", [], "NV8"], [[66045, 66045], "valid"], [[66046, 66175], "disallowed"], [[66176, 66204], "valid"], [[66205, 66207], "disallowed"], [[66208, 66256], "valid"], [[66257, 66271], "disallowed"], [[66272, 66272], "valid"], [[66273, 66299], "valid", [], "NV8"], [[66300, 66303], "disallowed"], [[66304, 66334], "valid"], [[66335, 66335], "valid"], [[66336, 66339], "valid", [], "NV8"], [[66340, 66351], "disallowed"], [[66352, 66368], "valid"], [[66369, 66369], "valid", [], "NV8"], [[66370, 66377], "valid"], [[66378, 66378], "valid", [], "NV8"], [[66379, 66383], "disallowed"], [[66384, 66426], "valid"], [[66427, 66431], "disallowed"], [[66432, 66461], "valid"], [[66462, 66462], "disallowed"], [[66463, 66463], "valid", [], "NV8"], [[66464, 66499], "valid"], [[66500, 66503], "disallowed"], [[66504, 66511], "valid"], [[66512, 66517], "valid", [], "NV8"], [[66518, 66559], "disallowed"], [[66560, 66560], "mapped", [66600]], [[66561, 66561], "mapped", [66601]], [[66562, 66562], "mapped", [66602]], [[66563, 66563], "mapped", [66603]], [[66564, 66564], "mapped", [66604]], [[66565, 66565], "mapped", [66605]], [[66566, 66566], "mapped", [66606]], [[66567, 66567], "mapped", [66607]], [[66568, 66568], "mapped", [66608]], [[66569, 66569], "mapped", [66609]], [[66570, 66570], "mapped", [66610]], [[66571, 66571], "mapped", [66611]], [[66572, 66572], "mapped", [66612]], [[66573, 66573], "mapped", [66613]], [[66574, 66574], "mapped", [66614]], [[66575, 66575], "mapped", [66615]], [[66576, 66576], "mapped", [66616]], [[66577, 66577], "mapped", [66617]], [[66578, 66578], "mapped", [66618]], [[66579, 66579], "mapped", [66619]], [[66580, 66580], "mapped", [66620]], [[66581, 66581], "mapped", [66621]], [[66582, 66582], "mapped", [66622]], [[66583, 66583], "mapped", [66623]], [[66584, 66584], "mapped", [66624]], [[66585, 66585], "mapped", [66625]], [[66586, 66586], "mapped", [66626]], [[66587, 66587], "mapped", [66627]], [[66588, 66588], "mapped", [66628]], [[66589, 66589], "mapped", [66629]], [[66590, 66590], "mapped", [66630]], [[66591, 66591], "mapped", [66631]], [[66592, 66592], "mapped", [66632]], [[66593, 66593], "mapped", [66633]], [[66594, 66594], "mapped", [66634]], [[66595, 66595], "mapped", [66635]], [[66596, 66596], "mapped", [66636]], [[66597, 66597], "mapped", [66637]], [[66598, 66598], "mapped", [66638]], [[66599, 66599], "mapped", [66639]], [[66600, 66637], "valid"], [[66638, 66717], "valid"], [[66718, 66719], "disallowed"], [[66720, 66729], "valid"], [[66730, 66815], "disallowed"], [[66816, 66855], "valid"], [[66856, 66863], "disallowed"], [[66864, 66915], "valid"], [[66916, 66926], "disallowed"], [[66927, 66927], "valid", [], "NV8"], [[66928, 67071], "disallowed"], [[67072, 67382], "valid"], [[67383, 67391], "disallowed"], [[67392, 67413], "valid"], [[67414, 67423], "disallowed"], [[67424, 67431], "valid"], [[67432, 67583], "disallowed"], [[67584, 67589], "valid"], [[67590, 67591], "disallowed"], [[67592, 67592], "valid"], [[67593, 67593], "disallowed"], [[67594, 67637], "valid"], [[67638, 67638], "disallowed"], [[67639, 67640], "valid"], [[67641, 67643], "disallowed"], [[67644, 67644], "valid"], [[67645, 67646], "disallowed"], [[67647, 67647], "valid"], [[67648, 67669], "valid"], [[67670, 67670], "disallowed"], [[67671, 67679], "valid", [], "NV8"], [[67680, 67702], "valid"], [[67703, 67711], "valid", [], "NV8"], [[67712, 67742], "valid"], [[67743, 67750], "disallowed"], [[67751, 67759], "valid", [], "NV8"], [[67760, 67807], "disallowed"], [[67808, 67826], "valid"], [[67827, 67827], "disallowed"], [[67828, 67829], "valid"], [[67830, 67834], "disallowed"], [[67835, 67839], "valid", [], "NV8"], [[67840, 67861], "valid"], [[67862, 67865], "valid", [], "NV8"], [[67866, 67867], "valid", [], "NV8"], [[67868, 67870], "disallowed"], [[67871, 67871], "valid", [], "NV8"], [[67872, 67897], "valid"], [[67898, 67902], "disallowed"], [[67903, 67903], "valid", [], "NV8"], [[67904, 67967], "disallowed"], [[67968, 68023], "valid"], [[68024, 68027], "disallowed"], [[68028, 68029], "valid", [], "NV8"], [[68030, 68031], "valid"], [[68032, 68047], "valid", [], "NV8"], [[68048, 68049], "disallowed"], [[68050, 68095], "valid", [], "NV8"], [[68096, 68099], "valid"], [[68100, 68100], "disallowed"], [[68101, 68102], "valid"], [[68103, 68107], "disallowed"], [[68108, 68115], "valid"], [[68116, 68116], "disallowed"], [[68117, 68119], "valid"], [[68120, 68120], "disallowed"], [[68121, 68147], "valid"], [[68148, 68151], "disallowed"], [[68152, 68154], "valid"], [[68155, 68158], "disallowed"], [[68159, 68159], "valid"], [[68160, 68167], "valid", [], "NV8"], [[68168, 68175], "disallowed"], [[68176, 68184], "valid", [], "NV8"], [[68185, 68191], "disallowed"], [[68192, 68220], "valid"], [[68221, 68223], "valid", [], "NV8"], [[68224, 68252], "valid"], [[68253, 68255], "valid", [], "NV8"], [[68256, 68287], "disallowed"], [[68288, 68295], "valid"], [[68296, 68296], "valid", [], "NV8"], [[68297, 68326], "valid"], [[68327, 68330], "disallowed"], [[68331, 68342], "valid", [], "NV8"], [[68343, 68351], "disallowed"], [[68352, 68405], "valid"], [[68406, 68408], "disallowed"], [[68409, 68415], "valid", [], "NV8"], [[68416, 68437], "valid"], [[68438, 68439], "disallowed"], [[68440, 68447], "valid", [], "NV8"], [[68448, 68466], "valid"], [[68467, 68471], "disallowed"], [[68472, 68479], "valid", [], "NV8"], [[68480, 68497], "valid"], [[68498, 68504], "disallowed"], [[68505, 68508], "valid", [], "NV8"], [[68509, 68520], "disallowed"], [[68521, 68527], "valid", [], "NV8"], [[68528, 68607], "disallowed"], [[68608, 68680], "valid"], [[68681, 68735], "disallowed"], [[68736, 68736], "mapped", [68800]], [[68737, 68737], "mapped", [68801]], [[68738, 68738], "mapped", [68802]], [[68739, 68739], "mapped", [68803]], [[68740, 68740], "mapped", [68804]], [[68741, 68741], "mapped", [68805]], [[68742, 68742], "mapped", [68806]], [[68743, 68743], "mapped", [68807]], [[68744, 68744], "mapped", [68808]], [[68745, 68745], "mapped", [68809]], [[68746, 68746], "mapped", [68810]], [[68747, 68747], "mapped", [68811]], [[68748, 68748], "mapped", [68812]], [[68749, 68749], "mapped", [68813]], [[68750, 68750], "mapped", [68814]], [[68751, 68751], "mapped", [68815]], [[68752, 68752], "mapped", [68816]], [[68753, 68753], "mapped", [68817]], [[68754, 68754], "mapped", [68818]], [[68755, 68755], "mapped", [68819]], [[68756, 68756], "mapped", [68820]], [[68757, 68757], "mapped", [68821]], [[68758, 68758], "mapped", [68822]], [[68759, 68759], "mapped", [68823]], [[68760, 68760], "mapped", [68824]], [[68761, 68761], "mapped", [68825]], [[68762, 68762], "mapped", [68826]], [[68763, 68763], "mapped", [68827]], [[68764, 68764], "mapped", [68828]], [[68765, 68765], "mapped", [68829]], [[68766, 68766], "mapped", [68830]], [[68767, 68767], "mapped", [68831]], [[68768, 68768], "mapped", [68832]], [[68769, 68769], "mapped", [68833]], [[68770, 68770], "mapped", [68834]], [[68771, 68771], "mapped", [68835]], [[68772, 68772], "mapped", [68836]], [[68773, 68773], "mapped", [68837]], [[68774, 68774], "mapped", [68838]], [[68775, 68775], "mapped", [68839]], [[68776, 68776], "mapped", [68840]], [[68777, 68777], "mapped", [68841]], [[68778, 68778], "mapped", [68842]], [[68779, 68779], "mapped", [68843]], [[68780, 68780], "mapped", [68844]], [[68781, 68781], "mapped", [68845]], [[68782, 68782], "mapped", [68846]], [[68783, 68783], "mapped", [68847]], [[68784, 68784], "mapped", [68848]], [[68785, 68785], "mapped", [68849]], [[68786, 68786], "mapped", [68850]], [[68787, 68799], "disallowed"], [[68800, 68850], "valid"], [[68851, 68857], "disallowed"], [[68858, 68863], "valid", [], "NV8"], [[68864, 69215], "disallowed"], [[69216, 69246], "valid", [], "NV8"], [[69247, 69631], "disallowed"], [[69632, 69702], "valid"], [[69703, 69709], "valid", [], "NV8"], [[69710, 69713], "disallowed"], [[69714, 69733], "valid", [], "NV8"], [[69734, 69743], "valid"], [[69744, 69758], "disallowed"], [[69759, 69759], "valid"], [[69760, 69818], "valid"], [[69819, 69820], "valid", [], "NV8"], [[69821, 69821], "disallowed"], [[69822, 69825], "valid", [], "NV8"], [[69826, 69839], "disallowed"], [[69840, 69864], "valid"], [[69865, 69871], "disallowed"], [[69872, 69881], "valid"], [[69882, 69887], "disallowed"], [[69888, 69940], "valid"], [[69941, 69941], "disallowed"], [[69942, 69951], "valid"], [[69952, 69955], "valid", [], "NV8"], [[69956, 69967], "disallowed"], [[69968, 70003], "valid"], [[70004, 70005], "valid", [], "NV8"], [[70006, 70006], "valid"], [[70007, 70015], "disallowed"], [[70016, 70084], "valid"], [[70085, 70088], "valid", [], "NV8"], [[70089, 70089], "valid", [], "NV8"], [[70090, 70092], "valid"], [[70093, 70093], "valid", [], "NV8"], [[70094, 70095], "disallowed"], [[70096, 70105], "valid"], [[70106, 70106], "valid"], [[70107, 70107], "valid", [], "NV8"], [[70108, 70108], "valid"], [[70109, 70111], "valid", [], "NV8"], [[70112, 70112], "disallowed"], [[70113, 70132], "valid", [], "NV8"], [[70133, 70143], "disallowed"], [[70144, 70161], "valid"], [[70162, 70162], "disallowed"], [[70163, 70199], "valid"], [[70200, 70205], "valid", [], "NV8"], [[70206, 70271], "disallowed"], [[70272, 70278], "valid"], [[70279, 70279], "disallowed"], [[70280, 70280], "valid"], [[70281, 70281], "disallowed"], [[70282, 70285], "valid"], [[70286, 70286], "disallowed"], [[70287, 70301], "valid"], [[70302, 70302], "disallowed"], [[70303, 70312], "valid"], [[70313, 70313], "valid", [], "NV8"], [[70314, 70319], "disallowed"], [[70320, 70378], "valid"], [[70379, 70383], "disallowed"], [[70384, 70393], "valid"], [[70394, 70399], "disallowed"], [[70400, 70400], "valid"], [[70401, 70403], "valid"], [[70404, 70404], "disallowed"], [[70405, 70412], "valid"], [[70413, 70414], "disallowed"], [[70415, 70416], "valid"], [[70417, 70418], "disallowed"], [[70419, 70440], "valid"], [[70441, 70441], "disallowed"], [[70442, 70448], "valid"], [[70449, 70449], "disallowed"], [[70450, 70451], "valid"], [[70452, 70452], "disallowed"], [[70453, 70457], "valid"], [[70458, 70459], "disallowed"], [[70460, 70468], "valid"], [[70469, 70470], "disallowed"], [[70471, 70472], "valid"], [[70473, 70474], "disallowed"], [[70475, 70477], "valid"], [[70478, 70479], "disallowed"], [[70480, 70480], "valid"], [[70481, 70486], "disallowed"], [[70487, 70487], "valid"], [[70488, 70492], "disallowed"], [[70493, 70499], "valid"], [[70500, 70501], "disallowed"], [[70502, 70508], "valid"], [[70509, 70511], "disallowed"], [[70512, 70516], "valid"], [[70517, 70783], "disallowed"], [[70784, 70853], "valid"], [[70854, 70854], "valid", [], "NV8"], [[70855, 70855], "valid"], [[70856, 70863], "disallowed"], [[70864, 70873], "valid"], [[70874, 71039], "disallowed"], [[71040, 71093], "valid"], [[71094, 71095], "disallowed"], [[71096, 71104], "valid"], [[71105, 71113], "valid", [], "NV8"], [[71114, 71127], "valid", [], "NV8"], [[71128, 71133], "valid"], [[71134, 71167], "disallowed"], [[71168, 71232], "valid"], [[71233, 71235], "valid", [], "NV8"], [[71236, 71236], "valid"], [[71237, 71247], "disallowed"], [[71248, 71257], "valid"], [[71258, 71295], "disallowed"], [[71296, 71351], "valid"], [[71352, 71359], "disallowed"], [[71360, 71369], "valid"], [[71370, 71423], "disallowed"], [[71424, 71449], "valid"], [[71450, 71452], "disallowed"], [[71453, 71467], "valid"], [[71468, 71471], "disallowed"], [[71472, 71481], "valid"], [[71482, 71487], "valid", [], "NV8"], [[71488, 71839], "disallowed"], [[71840, 71840], "mapped", [71872]], [[71841, 71841], "mapped", [71873]], [[71842, 71842], "mapped", [71874]], [[71843, 71843], "mapped", [71875]], [[71844, 71844], "mapped", [71876]], [[71845, 71845], "mapped", [71877]], [[71846, 71846], "mapped", [71878]], [[71847, 71847], "mapped", [71879]], [[71848, 71848], "mapped", [71880]], [[71849, 71849], "mapped", [71881]], [[71850, 71850], "mapped", [71882]], [[71851, 71851], "mapped", [71883]], [[71852, 71852], "mapped", [71884]], [[71853, 71853], "mapped", [71885]], [[71854, 71854], "mapped", [71886]], [[71855, 71855], "mapped", [71887]], [[71856, 71856], "mapped", [71888]], [[71857, 71857], "mapped", [71889]], [[71858, 71858], "mapped", [71890]], [[71859, 71859], "mapped", [71891]], [[71860, 71860], "mapped", [71892]], [[71861, 71861], "mapped", [71893]], [[71862, 71862], "mapped", [71894]], [[71863, 71863], "mapped", [71895]], [[71864, 71864], "mapped", [71896]], [[71865, 71865], "mapped", [71897]], [[71866, 71866], "mapped", [71898]], [[71867, 71867], "mapped", [71899]], [[71868, 71868], "mapped", [71900]], [[71869, 71869], "mapped", [71901]], [[71870, 71870], "mapped", [71902]], [[71871, 71871], "mapped", [71903]], [[71872, 71913], "valid"], [[71914, 71922], "valid", [], "NV8"], [[71923, 71934], "disallowed"], [[71935, 71935], "valid"], [[71936, 72383], "disallowed"], [[72384, 72440], "valid"], [[72441, 73727], "disallowed"], [[73728, 74606], "valid"], [[74607, 74648], "valid"], [[74649, 74649], "valid"], [[74650, 74751], "disallowed"], [[74752, 74850], "valid", [], "NV8"], [[74851, 74862], "valid", [], "NV8"], [[74863, 74863], "disallowed"], [[74864, 74867], "valid", [], "NV8"], [[74868, 74868], "valid", [], "NV8"], [[74869, 74879], "disallowed"], [[74880, 75075], "valid"], [[75076, 77823], "disallowed"], [[77824, 78894], "valid"], [[78895, 82943], "disallowed"], [[82944, 83526], "valid"], [[83527, 92159], "disallowed"], [[92160, 92728], "valid"], [[92729, 92735], "disallowed"], [[92736, 92766], "valid"], [[92767, 92767], "disallowed"], [[92768, 92777], "valid"], [[92778, 92781], "disallowed"], [[92782, 92783], "valid", [], "NV8"], [[92784, 92879], "disallowed"], [[92880, 92909], "valid"], [[92910, 92911], "disallowed"], [[92912, 92916], "valid"], [[92917, 92917], "valid", [], "NV8"], [[92918, 92927], "disallowed"], [[92928, 92982], "valid"], [[92983, 92991], "valid", [], "NV8"], [[92992, 92995], "valid"], [[92996, 92997], "valid", [], "NV8"], [[92998, 93007], "disallowed"], [[93008, 93017], "valid"], [[93018, 93018], "disallowed"], [[93019, 93025], "valid", [], "NV8"], [[93026, 93026], "disallowed"], [[93027, 93047], "valid"], [[93048, 93052], "disallowed"], [[93053, 93071], "valid"], [[93072, 93951], "disallowed"], [[93952, 94020], "valid"], [[94021, 94031], "disallowed"], [[94032, 94078], "valid"], [[94079, 94094], "disallowed"], [[94095, 94111], "valid"], [[94112, 110591], "disallowed"], [[110592, 110593], "valid"], [[110594, 113663], "disallowed"], [[113664, 113770], "valid"], [[113771, 113775], "disallowed"], [[113776, 113788], "valid"], [[113789, 113791], "disallowed"], [[113792, 113800], "valid"], [[113801, 113807], "disallowed"], [[113808, 113817], "valid"], [[113818, 113819], "disallowed"], [[113820, 113820], "valid", [], "NV8"], [[113821, 113822], "valid"], [[113823, 113823], "valid", [], "NV8"], [[113824, 113827], "ignored"], [[113828, 118783], "disallowed"], [[118784, 119029], "valid", [], "NV8"], [[119030, 119039], "disallowed"], [[119040, 119078], "valid", [], "NV8"], [[119079, 119080], "disallowed"], [[119081, 119081], "valid", [], "NV8"], [[119082, 119133], "valid", [], "NV8"], [[119134, 119134], "mapped", [119127, 119141]], [[119135, 119135], "mapped", [119128, 119141]], [[119136, 119136], "mapped", [119128, 119141, 119150]], [[119137, 119137], "mapped", [119128, 119141, 119151]], [[119138, 119138], "mapped", [119128, 119141, 119152]], [[119139, 119139], "mapped", [119128, 119141, 119153]], [[119140, 119140], "mapped", [119128, 119141, 119154]], [[119141, 119154], "valid", [], "NV8"], [[119155, 119162], "disallowed"], [[119163, 119226], "valid", [], "NV8"], [[119227, 119227], "mapped", [119225, 119141]], [[119228, 119228], "mapped", [119226, 119141]], [[119229, 119229], "mapped", [119225, 119141, 119150]], [[119230, 119230], "mapped", [119226, 119141, 119150]], [[119231, 119231], "mapped", [119225, 119141, 119151]], [[119232, 119232], "mapped", [119226, 119141, 119151]], [[119233, 119261], "valid", [], "NV8"], [[119262, 119272], "valid", [], "NV8"], [[119273, 119295], "disallowed"], [[119296, 119365], "valid", [], "NV8"], [[119366, 119551], "disallowed"], [[119552, 119638], "valid", [], "NV8"], [[119639, 119647], "disallowed"], [[119648, 119665], "valid", [], "NV8"], [[119666, 119807], "disallowed"], [[119808, 119808], "mapped", [97]], [[119809, 119809], "mapped", [98]], [[119810, 119810], "mapped", [99]], [[119811, 119811], "mapped", [100]], [[119812, 119812], "mapped", [101]], [[119813, 119813], "mapped", [102]], [[119814, 119814], "mapped", [103]], [[119815, 119815], "mapped", [104]], [[119816, 119816], "mapped", [105]], [[119817, 119817], "mapped", [106]], [[119818, 119818], "mapped", [107]], [[119819, 119819], "mapped", [108]], [[119820, 119820], "mapped", [109]], [[119821, 119821], "mapped", [110]], [[119822, 119822], "mapped", [111]], [[119823, 119823], "mapped", [112]], [[119824, 119824], "mapped", [113]], [[119825, 119825], "mapped", [114]], [[119826, 119826], "mapped", [115]], [[119827, 119827], "mapped", [116]], [[119828, 119828], "mapped", [117]], [[119829, 119829], "mapped", [118]], [[119830, 119830], "mapped", [119]], [[119831, 119831], "mapped", [120]], [[119832, 119832], "mapped", [121]], [[119833, 119833], "mapped", [122]], [[119834, 119834], "mapped", [97]], [[119835, 119835], "mapped", [98]], [[119836, 119836], "mapped", [99]], [[119837, 119837], "mapped", [100]], [[119838, 119838], "mapped", [101]], [[119839, 119839], "mapped", [102]], [[119840, 119840], "mapped", [103]], [[119841, 119841], "mapped", [104]], [[119842, 119842], "mapped", [105]], [[119843, 119843], "mapped", [106]], [[119844, 119844], "mapped", [107]], [[119845, 119845], "mapped", [108]], [[119846, 119846], "mapped", [109]], [[119847, 119847], "mapped", [110]], [[119848, 119848], "mapped", [111]], [[119849, 119849], "mapped", [112]], [[119850, 119850], "mapped", [113]], [[119851, 119851], "mapped", [114]], [[119852, 119852], "mapped", [115]], [[119853, 119853], "mapped", [116]], [[119854, 119854], "mapped", [117]], [[119855, 119855], "mapped", [118]], [[119856, 119856], "mapped", [119]], [[119857, 119857], "mapped", [120]], [[119858, 119858], "mapped", [121]], [[119859, 119859], "mapped", [122]], [[119860, 119860], "mapped", [97]], [[119861, 119861], "mapped", [98]], [[119862, 119862], "mapped", [99]], [[119863, 119863], "mapped", [100]], [[119864, 119864], "mapped", [101]], [[119865, 119865], "mapped", [102]], [[119866, 119866], "mapped", [103]], [[119867, 119867], "mapped", [104]], [[119868, 119868], "mapped", [105]], [[119869, 119869], "mapped", [106]], [[119870, 119870], "mapped", [107]], [[119871, 119871], "mapped", [108]], [[119872, 119872], "mapped", [109]], [[119873, 119873], "mapped", [110]], [[119874, 119874], "mapped", [111]], [[119875, 119875], "mapped", [112]], [[119876, 119876], "mapped", [113]], [[119877, 119877], "mapped", [114]], [[119878, 119878], "mapped", [115]], [[119879, 119879], "mapped", [116]], [[119880, 119880], "mapped", [117]], [[119881, 119881], "mapped", [118]], [[119882, 119882], "mapped", [119]], [[119883, 119883], "mapped", [120]], [[119884, 119884], "mapped", [121]], [[119885, 119885], "mapped", [122]], [[119886, 119886], "mapped", [97]], [[119887, 119887], "mapped", [98]], [[119888, 119888], "mapped", [99]], [[119889, 119889], "mapped", [100]], [[119890, 119890], "mapped", [101]], [[119891, 119891], "mapped", [102]], [[119892, 119892], "mapped", [103]], [[119893, 119893], "disallowed"], [[119894, 119894], "mapped", [105]], [[119895, 119895], "mapped", [106]], [[119896, 119896], "mapped", [107]], [[119897, 119897], "mapped", [108]], [[119898, 119898], "mapped", [109]], [[119899, 119899], "mapped", [110]], [[119900, 119900], "mapped", [111]], [[119901, 119901], "mapped", [112]], [[119902, 119902], "mapped", [113]], [[119903, 119903], "mapped", [114]], [[119904, 119904], "mapped", [115]], [[119905, 119905], "mapped", [116]], [[119906, 119906], "mapped", [117]], [[119907, 119907], "mapped", [118]], [[119908, 119908], "mapped", [119]], [[119909, 119909], "mapped", [120]], [[119910, 119910], "mapped", [121]], [[119911, 119911], "mapped", [122]], [[119912, 119912], "mapped", [97]], [[119913, 119913], "mapped", [98]], [[119914, 119914], "mapped", [99]], [[119915, 119915], "mapped", [100]], [[119916, 119916], "mapped", [101]], [[119917, 119917], "mapped", [102]], [[119918, 119918], "mapped", [103]], [[119919, 119919], "mapped", [104]], [[119920, 119920], "mapped", [105]], [[119921, 119921], "mapped", [106]], [[119922, 119922], "mapped", [107]], [[119923, 119923], "mapped", [108]], [[119924, 119924], "mapped", [109]], [[119925, 119925], "mapped", [110]], [[119926, 119926], "mapped", [111]], [[119927, 119927], "mapped", [112]], [[119928, 119928], "mapped", [113]], [[119929, 119929], "mapped", [114]], [[119930, 119930], "mapped", [115]], [[119931, 119931], "mapped", [116]], [[119932, 119932], "mapped", [117]], [[119933, 119933], "mapped", [118]], [[119934, 119934], "mapped", [119]], [[119935, 119935], "mapped", [120]], [[119936, 119936], "mapped", [121]], [[119937, 119937], "mapped", [122]], [[119938, 119938], "mapped", [97]], [[119939, 119939], "mapped", [98]], [[119940, 119940], "mapped", [99]], [[119941, 119941], "mapped", [100]], [[119942, 119942], "mapped", [101]], [[119943, 119943], "mapped", [102]], [[119944, 119944], "mapped", [103]], [[119945, 119945], "mapped", [104]], [[119946, 119946], "mapped", [105]], [[119947, 119947], "mapped", [106]], [[119948, 119948], "mapped", [107]], [[119949, 119949], "mapped", [108]], [[119950, 119950], "mapped", [109]], [[119951, 119951], "mapped", [110]], [[119952, 119952], "mapped", [111]], [[119953, 119953], "mapped", [112]], [[119954, 119954], "mapped", [113]], [[119955, 119955], "mapped", [114]], [[119956, 119956], "mapped", [115]], [[119957, 119957], "mapped", [116]], [[119958, 119958], "mapped", [117]], [[119959, 119959], "mapped", [118]], [[119960, 119960], "mapped", [119]], [[119961, 119961], "mapped", [120]], [[119962, 119962], "mapped", [121]], [[119963, 119963], "mapped", [122]], [[119964, 119964], "mapped", [97]], [[119965, 119965], "disallowed"], [[119966, 119966], "mapped", [99]], [[119967, 119967], "mapped", [100]], [[119968, 119969], "disallowed"], [[119970, 119970], "mapped", [103]], [[119971, 119972], "disallowed"], [[119973, 119973], "mapped", [106]], [[119974, 119974], "mapped", [107]], [[119975, 119976], "disallowed"], [[119977, 119977], "mapped", [110]], [[119978, 119978], "mapped", [111]], [[119979, 119979], "mapped", [112]], [[119980, 119980], "mapped", [113]], [[119981, 119981], "disallowed"], [[119982, 119982], "mapped", [115]], [[119983, 119983], "mapped", [116]], [[119984, 119984], "mapped", [117]], [[119985, 119985], "mapped", [118]], [[119986, 119986], "mapped", [119]], [[119987, 119987], "mapped", [120]], [[119988, 119988], "mapped", [121]], [[119989, 119989], "mapped", [122]], [[119990, 119990], "mapped", [97]], [[119991, 119991], "mapped", [98]], [[119992, 119992], "mapped", [99]], [[119993, 119993], "mapped", [100]], [[119994, 119994], "disallowed"], [[119995, 119995], "mapped", [102]], [[119996, 119996], "disallowed"], [[119997, 119997], "mapped", [104]], [[119998, 119998], "mapped", [105]], [[119999, 119999], "mapped", [106]], [[12e4, 12e4], "mapped", [107]], [[120001, 120001], "mapped", [108]], [[120002, 120002], "mapped", [109]], [[120003, 120003], "mapped", [110]], [[120004, 120004], "disallowed"], [[120005, 120005], "mapped", [112]], [[120006, 120006], "mapped", [113]], [[120007, 120007], "mapped", [114]], [[120008, 120008], "mapped", [115]], [[120009, 120009], "mapped", [116]], [[120010, 120010], "mapped", [117]], [[120011, 120011], "mapped", [118]], [[120012, 120012], "mapped", [119]], [[120013, 120013], "mapped", [120]], [[120014, 120014], "mapped", [121]], [[120015, 120015], "mapped", [122]], [[120016, 120016], "mapped", [97]], [[120017, 120017], "mapped", [98]], [[120018, 120018], "mapped", [99]], [[120019, 120019], "mapped", [100]], [[120020, 120020], "mapped", [101]], [[120021, 120021], "mapped", [102]], [[120022, 120022], "mapped", [103]], [[120023, 120023], "mapped", [104]], [[120024, 120024], "mapped", [105]], [[120025, 120025], "mapped", [106]], [[120026, 120026], "mapped", [107]], [[120027, 120027], "mapped", [108]], [[120028, 120028], "mapped", [109]], [[120029, 120029], "mapped", [110]], [[120030, 120030], "mapped", [111]], [[120031, 120031], "mapped", [112]], [[120032, 120032], "mapped", [113]], [[120033, 120033], "mapped", [114]], [[120034, 120034], "mapped", [115]], [[120035, 120035], "mapped", [116]], [[120036, 120036], "mapped", [117]], [[120037, 120037], "mapped", [118]], [[120038, 120038], "mapped", [119]], [[120039, 120039], "mapped", [120]], [[120040, 120040], "mapped", [121]], [[120041, 120041], "mapped", [122]], [[120042, 120042], "mapped", [97]], [[120043, 120043], "mapped", [98]], [[120044, 120044], "mapped", [99]], [[120045, 120045], "mapped", [100]], [[120046, 120046], "mapped", [101]], [[120047, 120047], "mapped", [102]], [[120048, 120048], "mapped", [103]], [[120049, 120049], "mapped", [104]], [[120050, 120050], "mapped", [105]], [[120051, 120051], "mapped", [106]], [[120052, 120052], "mapped", [107]], [[120053, 120053], "mapped", [108]], [[120054, 120054], "mapped", [109]], [[120055, 120055], "mapped", [110]], [[120056, 120056], "mapped", [111]], [[120057, 120057], "mapped", [112]], [[120058, 120058], "mapped", [113]], [[120059, 120059], "mapped", [114]], [[120060, 120060], "mapped", [115]], [[120061, 120061], "mapped", [116]], [[120062, 120062], "mapped", [117]], [[120063, 120063], "mapped", [118]], [[120064, 120064], "mapped", [119]], [[120065, 120065], "mapped", [120]], [[120066, 120066], "mapped", [121]], [[120067, 120067], "mapped", [122]], [[120068, 120068], "mapped", [97]], [[120069, 120069], "mapped", [98]], [[120070, 120070], "disallowed"], [[120071, 120071], "mapped", [100]], [[120072, 120072], "mapped", [101]], [[120073, 120073], "mapped", [102]], [[120074, 120074], "mapped", [103]], [[120075, 120076], "disallowed"], [[120077, 120077], "mapped", [106]], [[120078, 120078], "mapped", [107]], [[120079, 120079], "mapped", [108]], [[120080, 120080], "mapped", [109]], [[120081, 120081], "mapped", [110]], [[120082, 120082], "mapped", [111]], [[120083, 120083], "mapped", [112]], [[120084, 120084], "mapped", [113]], [[120085, 120085], "disallowed"], [[120086, 120086], "mapped", [115]], [[120087, 120087], "mapped", [116]], [[120088, 120088], "mapped", [117]], [[120089, 120089], "mapped", [118]], [[120090, 120090], "mapped", [119]], [[120091, 120091], "mapped", [120]], [[120092, 120092], "mapped", [121]], [[120093, 120093], "disallowed"], [[120094, 120094], "mapped", [97]], [[120095, 120095], "mapped", [98]], [[120096, 120096], "mapped", [99]], [[120097, 120097], "mapped", [100]], [[120098, 120098], "mapped", [101]], [[120099, 120099], "mapped", [102]], [[120100, 120100], "mapped", [103]], [[120101, 120101], "mapped", [104]], [[120102, 120102], "mapped", [105]], [[120103, 120103], "mapped", [106]], [[120104, 120104], "mapped", [107]], [[120105, 120105], "mapped", [108]], [[120106, 120106], "mapped", [109]], [[120107, 120107], "mapped", [110]], [[120108, 120108], "mapped", [111]], [[120109, 120109], "mapped", [112]], [[120110, 120110], "mapped", [113]], [[120111, 120111], "mapped", [114]], [[120112, 120112], "mapped", [115]], [[120113, 120113], "mapped", [116]], [[120114, 120114], "mapped", [117]], [[120115, 120115], "mapped", [118]], [[120116, 120116], "mapped", [119]], [[120117, 120117], "mapped", [120]], [[120118, 120118], "mapped", [121]], [[120119, 120119], "mapped", [122]], [[120120, 120120], "mapped", [97]], [[120121, 120121], "mapped", [98]], [[120122, 120122], "disallowed"], [[120123, 120123], "mapped", [100]], [[120124, 120124], "mapped", [101]], [[120125, 120125], "mapped", [102]], [[120126, 120126], "mapped", [103]], [[120127, 120127], "disallowed"], [[120128, 120128], "mapped", [105]], [[120129, 120129], "mapped", [106]], [[120130, 120130], "mapped", [107]], [[120131, 120131], "mapped", [108]], [[120132, 120132], "mapped", [109]], [[120133, 120133], "disallowed"], [[120134, 120134], "mapped", [111]], [[120135, 120137], "disallowed"], [[120138, 120138], "mapped", [115]], [[120139, 120139], "mapped", [116]], [[120140, 120140], "mapped", [117]], [[120141, 120141], "mapped", [118]], [[120142, 120142], "mapped", [119]], [[120143, 120143], "mapped", [120]], [[120144, 120144], "mapped", [121]], [[120145, 120145], "disallowed"], [[120146, 120146], "mapped", [97]], [[120147, 120147], "mapped", [98]], [[120148, 120148], "mapped", [99]], [[120149, 120149], "mapped", [100]], [[120150, 120150], "mapped", [101]], [[120151, 120151], "mapped", [102]], [[120152, 120152], "mapped", [103]], [[120153, 120153], "mapped", [104]], [[120154, 120154], "mapped", [105]], [[120155, 120155], "mapped", [106]], [[120156, 120156], "mapped", [107]], [[120157, 120157], "mapped", [108]], [[120158, 120158], "mapped", [109]], [[120159, 120159], "mapped", [110]], [[120160, 120160], "mapped", [111]], [[120161, 120161], "mapped", [112]], [[120162, 120162], "mapped", [113]], [[120163, 120163], "mapped", [114]], [[120164, 120164], "mapped", [115]], [[120165, 120165], "mapped", [116]], [[120166, 120166], "mapped", [117]], [[120167, 120167], "mapped", [118]], [[120168, 120168], "mapped", [119]], [[120169, 120169], "mapped", [120]], [[120170, 120170], "mapped", [121]], [[120171, 120171], "mapped", [122]], [[120172, 120172], "mapped", [97]], [[120173, 120173], "mapped", [98]], [[120174, 120174], "mapped", [99]], [[120175, 120175], "mapped", [100]], [[120176, 120176], "mapped", [101]], [[120177, 120177], "mapped", [102]], [[120178, 120178], "mapped", [103]], [[120179, 120179], "mapped", [104]], [[120180, 120180], "mapped", [105]], [[120181, 120181], "mapped", [106]], [[120182, 120182], "mapped", [107]], [[120183, 120183], "mapped", [108]], [[120184, 120184], "mapped", [109]], [[120185, 120185], "mapped", [110]], [[120186, 120186], "mapped", [111]], [[120187, 120187], "mapped", [112]], [[120188, 120188], "mapped", [113]], [[120189, 120189], "mapped", [114]], [[120190, 120190], "mapped", [115]], [[120191, 120191], "mapped", [116]], [[120192, 120192], "mapped", [117]], [[120193, 120193], "mapped", [118]], [[120194, 120194], "mapped", [119]], [[120195, 120195], "mapped", [120]], [[120196, 120196], "mapped", [121]], [[120197, 120197], "mapped", [122]], [[120198, 120198], "mapped", [97]], [[120199, 120199], "mapped", [98]], [[120200, 120200], "mapped", [99]], [[120201, 120201], "mapped", [100]], [[120202, 120202], "mapped", [101]], [[120203, 120203], "mapped", [102]], [[120204, 120204], "mapped", [103]], [[120205, 120205], "mapped", [104]], [[120206, 120206], "mapped", [105]], [[120207, 120207], "mapped", [106]], [[120208, 120208], "mapped", [107]], [[120209, 120209], "mapped", [108]], [[120210, 120210], "mapped", [109]], [[120211, 120211], "mapped", [110]], [[120212, 120212], "mapped", [111]], [[120213, 120213], "mapped", [112]], [[120214, 120214], "mapped", [113]], [[120215, 120215], "mapped", [114]], [[120216, 120216], "mapped", [115]], [[120217, 120217], "mapped", [116]], [[120218, 120218], "mapped", [117]], [[120219, 120219], "mapped", [118]], [[120220, 120220], "mapped", [119]], [[120221, 120221], "mapped", [120]], [[120222, 120222], "mapped", [121]], [[120223, 120223], "mapped", [122]], [[120224, 120224], "mapped", [97]], [[120225, 120225], "mapped", [98]], [[120226, 120226], "mapped", [99]], [[120227, 120227], "mapped", [100]], [[120228, 120228], "mapped", [101]], [[120229, 120229], "mapped", [102]], [[120230, 120230], "mapped", [103]], [[120231, 120231], "mapped", [104]], [[120232, 120232], "mapped", [105]], [[120233, 120233], "mapped", [106]], [[120234, 120234], "mapped", [107]], [[120235, 120235], "mapped", [108]], [[120236, 120236], "mapped", [109]], [[120237, 120237], "mapped", [110]], [[120238, 120238], "mapped", [111]], [[120239, 120239], "mapped", [112]], [[120240, 120240], "mapped", [113]], [[120241, 120241], "mapped", [114]], [[120242, 120242], "mapped", [115]], [[120243, 120243], "mapped", [116]], [[120244, 120244], "mapped", [117]], [[120245, 120245], "mapped", [118]], [[120246, 120246], "mapped", [119]], [[120247, 120247], "mapped", [120]], [[120248, 120248], "mapped", [121]], [[120249, 120249], "mapped", [122]], [[120250, 120250], "mapped", [97]], [[120251, 120251], "mapped", [98]], [[120252, 120252], "mapped", [99]], [[120253, 120253], "mapped", [100]], [[120254, 120254], "mapped", [101]], [[120255, 120255], "mapped", [102]], [[120256, 120256], "mapped", [103]], [[120257, 120257], "mapped", [104]], [[120258, 120258], "mapped", [105]], [[120259, 120259], "mapped", [106]], [[120260, 120260], "mapped", [107]], [[120261, 120261], "mapped", [108]], [[120262, 120262], "mapped", [109]], [[120263, 120263], "mapped", [110]], [[120264, 120264], "mapped", [111]], [[120265, 120265], "mapped", [112]], [[120266, 120266], "mapped", [113]], [[120267, 120267], "mapped", [114]], [[120268, 120268], "mapped", [115]], [[120269, 120269], "mapped", [116]], [[120270, 120270], "mapped", [117]], [[120271, 120271], "mapped", [118]], [[120272, 120272], "mapped", [119]], [[120273, 120273], "mapped", [120]], [[120274, 120274], "mapped", [121]], [[120275, 120275], "mapped", [122]], [[120276, 120276], "mapped", [97]], [[120277, 120277], "mapped", [98]], [[120278, 120278], "mapped", [99]], [[120279, 120279], "mapped", [100]], [[120280, 120280], "mapped", [101]], [[120281, 120281], "mapped", [102]], [[120282, 120282], "mapped", [103]], [[120283, 120283], "mapped", [104]], [[120284, 120284], "mapped", [105]], [[120285, 120285], "mapped", [106]], [[120286, 120286], "mapped", [107]], [[120287, 120287], "mapped", [108]], [[120288, 120288], "mapped", [109]], [[120289, 120289], "mapped", [110]], [[120290, 120290], "mapped", [111]], [[120291, 120291], "mapped", [112]], [[120292, 120292], "mapped", [113]], [[120293, 120293], "mapped", [114]], [[120294, 120294], "mapped", [115]], [[120295, 120295], "mapped", [116]], [[120296, 120296], "mapped", [117]], [[120297, 120297], "mapped", [118]], [[120298, 120298], "mapped", [119]], [[120299, 120299], "mapped", [120]], [[120300, 120300], "mapped", [121]], [[120301, 120301], "mapped", [122]], [[120302, 120302], "mapped", [97]], [[120303, 120303], "mapped", [98]], [[120304, 120304], "mapped", [99]], [[120305, 120305], "mapped", [100]], [[120306, 120306], "mapped", [101]], [[120307, 120307], "mapped", [102]], [[120308, 120308], "mapped", [103]], [[120309, 120309], "mapped", [104]], [[120310, 120310], "mapped", [105]], [[120311, 120311], "mapped", [106]], [[120312, 120312], "mapped", [107]], [[120313, 120313], "mapped", [108]], [[120314, 120314], "mapped", [109]], [[120315, 120315], "mapped", [110]], [[120316, 120316], "mapped", [111]], [[120317, 120317], "mapped", [112]], [[120318, 120318], "mapped", [113]], [[120319, 120319], "mapped", [114]], [[120320, 120320], "mapped", [115]], [[120321, 120321], "mapped", [116]], [[120322, 120322], "mapped", [117]], [[120323, 120323], "mapped", [118]], [[120324, 120324], "mapped", [119]], [[120325, 120325], "mapped", [120]], [[120326, 120326], "mapped", [121]], [[120327, 120327], "mapped", [122]], [[120328, 120328], "mapped", [97]], [[120329, 120329], "mapped", [98]], [[120330, 120330], "mapped", [99]], [[120331, 120331], "mapped", [100]], [[120332, 120332], "mapped", [101]], [[120333, 120333], "mapped", [102]], [[120334, 120334], "mapped", [103]], [[120335, 120335], "mapped", [104]], [[120336, 120336], "mapped", [105]], [[120337, 120337], "mapped", [106]], [[120338, 120338], "mapped", [107]], [[120339, 120339], "mapped", [108]], [[120340, 120340], "mapped", [109]], [[120341, 120341], "mapped", [110]], [[120342, 120342], "mapped", [111]], [[120343, 120343], "mapped", [112]], [[120344, 120344], "mapped", [113]], [[120345, 120345], "mapped", [114]], [[120346, 120346], "mapped", [115]], [[120347, 120347], "mapped", [116]], [[120348, 120348], "mapped", [117]], [[120349, 120349], "mapped", [118]], [[120350, 120350], "mapped", [119]], [[120351, 120351], "mapped", [120]], [[120352, 120352], "mapped", [121]], [[120353, 120353], "mapped", [122]], [[120354, 120354], "mapped", [97]], [[120355, 120355], "mapped", [98]], [[120356, 120356], "mapped", [99]], [[120357, 120357], "mapped", [100]], [[120358, 120358], "mapped", [101]], [[120359, 120359], "mapped", [102]], [[120360, 120360], "mapped", [103]], [[120361, 120361], "mapped", [104]], [[120362, 120362], "mapped", [105]], [[120363, 120363], "mapped", [106]], [[120364, 120364], "mapped", [107]], [[120365, 120365], "mapped", [108]], [[120366, 120366], "mapped", [109]], [[120367, 120367], "mapped", [110]], [[120368, 120368], "mapped", [111]], [[120369, 120369], "mapped", [112]], [[120370, 120370], "mapped", [113]], [[120371, 120371], "mapped", [114]], [[120372, 120372], "mapped", [115]], [[120373, 120373], "mapped", [116]], [[120374, 120374], "mapped", [117]], [[120375, 120375], "mapped", [118]], [[120376, 120376], "mapped", [119]], [[120377, 120377], "mapped", [120]], [[120378, 120378], "mapped", [121]], [[120379, 120379], "mapped", [122]], [[120380, 120380], "mapped", [97]], [[120381, 120381], "mapped", [98]], [[120382, 120382], "mapped", [99]], [[120383, 120383], "mapped", [100]], [[120384, 120384], "mapped", [101]], [[120385, 120385], "mapped", [102]], [[120386, 120386], "mapped", [103]], [[120387, 120387], "mapped", [104]], [[120388, 120388], "mapped", [105]], [[120389, 120389], "mapped", [106]], [[120390, 120390], "mapped", [107]], [[120391, 120391], "mapped", [108]], [[120392, 120392], "mapped", [109]], [[120393, 120393], "mapped", [110]], [[120394, 120394], "mapped", [111]], [[120395, 120395], "mapped", [112]], [[120396, 120396], "mapped", [113]], [[120397, 120397], "mapped", [114]], [[120398, 120398], "mapped", [115]], [[120399, 120399], "mapped", [116]], [[120400, 120400], "mapped", [117]], [[120401, 120401], "mapped", [118]], [[120402, 120402], "mapped", [119]], [[120403, 120403], "mapped", [120]], [[120404, 120404], "mapped", [121]], [[120405, 120405], "mapped", [122]], [[120406, 120406], "mapped", [97]], [[120407, 120407], "mapped", [98]], [[120408, 120408], "mapped", [99]], [[120409, 120409], "mapped", [100]], [[120410, 120410], "mapped", [101]], [[120411, 120411], "mapped", [102]], [[120412, 120412], "mapped", [103]], [[120413, 120413], "mapped", [104]], [[120414, 120414], "mapped", [105]], [[120415, 120415], "mapped", [106]], [[120416, 120416], "mapped", [107]], [[120417, 120417], "mapped", [108]], [[120418, 120418], "mapped", [109]], [[120419, 120419], "mapped", [110]], [[120420, 120420], "mapped", [111]], [[120421, 120421], "mapped", [112]], [[120422, 120422], "mapped", [113]], [[120423, 120423], "mapped", [114]], [[120424, 120424], "mapped", [115]], [[120425, 120425], "mapped", [116]], [[120426, 120426], "mapped", [117]], [[120427, 120427], "mapped", [118]], [[120428, 120428], "mapped", [119]], [[120429, 120429], "mapped", [120]], [[120430, 120430], "mapped", [121]], [[120431, 120431], "mapped", [122]], [[120432, 120432], "mapped", [97]], [[120433, 120433], "mapped", [98]], [[120434, 120434], "mapped", [99]], [[120435, 120435], "mapped", [100]], [[120436, 120436], "mapped", [101]], [[120437, 120437], "mapped", [102]], [[120438, 120438], "mapped", [103]], [[120439, 120439], "mapped", [104]], [[120440, 120440], "mapped", [105]], [[120441, 120441], "mapped", [106]], [[120442, 120442], "mapped", [107]], [[120443, 120443], "mapped", [108]], [[120444, 120444], "mapped", [109]], [[120445, 120445], "mapped", [110]], [[120446, 120446], "mapped", [111]], [[120447, 120447], "mapped", [112]], [[120448, 120448], "mapped", [113]], [[120449, 120449], "mapped", [114]], [[120450, 120450], "mapped", [115]], [[120451, 120451], "mapped", [116]], [[120452, 120452], "mapped", [117]], [[120453, 120453], "mapped", [118]], [[120454, 120454], "mapped", [119]], [[120455, 120455], "mapped", [120]], [[120456, 120456], "mapped", [121]], [[120457, 120457], "mapped", [122]], [[120458, 120458], "mapped", [97]], [[120459, 120459], "mapped", [98]], [[120460, 120460], "mapped", [99]], [[120461, 120461], "mapped", [100]], [[120462, 120462], "mapped", [101]], [[120463, 120463], "mapped", [102]], [[120464, 120464], "mapped", [103]], [[120465, 120465], "mapped", [104]], [[120466, 120466], "mapped", [105]], [[120467, 120467], "mapped", [106]], [[120468, 120468], "mapped", [107]], [[120469, 120469], "mapped", [108]], [[120470, 120470], "mapped", [109]], [[120471, 120471], "mapped", [110]], [[120472, 120472], "mapped", [111]], [[120473, 120473], "mapped", [112]], [[120474, 120474], "mapped", [113]], [[120475, 120475], "mapped", [114]], [[120476, 120476], "mapped", [115]], [[120477, 120477], "mapped", [116]], [[120478, 120478], "mapped", [117]], [[120479, 120479], "mapped", [118]], [[120480, 120480], "mapped", [119]], [[120481, 120481], "mapped", [120]], [[120482, 120482], "mapped", [121]], [[120483, 120483], "mapped", [122]], [[120484, 120484], "mapped", [305]], [[120485, 120485], "mapped", [567]], [[120486, 120487], "disallowed"], [[120488, 120488], "mapped", [945]], [[120489, 120489], "mapped", [946]], [[120490, 120490], "mapped", [947]], [[120491, 120491], "mapped", [948]], [[120492, 120492], "mapped", [949]], [[120493, 120493], "mapped", [950]], [[120494, 120494], "mapped", [951]], [[120495, 120495], "mapped", [952]], [[120496, 120496], "mapped", [953]], [[120497, 120497], "mapped", [954]], [[120498, 120498], "mapped", [955]], [[120499, 120499], "mapped", [956]], [[120500, 120500], "mapped", [957]], [[120501, 120501], "mapped", [958]], [[120502, 120502], "mapped", [959]], [[120503, 120503], "mapped", [960]], [[120504, 120504], "mapped", [961]], [[120505, 120505], "mapped", [952]], [[120506, 120506], "mapped", [963]], [[120507, 120507], "mapped", [964]], [[120508, 120508], "mapped", [965]], [[120509, 120509], "mapped", [966]], [[120510, 120510], "mapped", [967]], [[120511, 120511], "mapped", [968]], [[120512, 120512], "mapped", [969]], [[120513, 120513], "mapped", [8711]], [[120514, 120514], "mapped", [945]], [[120515, 120515], "mapped", [946]], [[120516, 120516], "mapped", [947]], [[120517, 120517], "mapped", [948]], [[120518, 120518], "mapped", [949]], [[120519, 120519], "mapped", [950]], [[120520, 120520], "mapped", [951]], [[120521, 120521], "mapped", [952]], [[120522, 120522], "mapped", [953]], [[120523, 120523], "mapped", [954]], [[120524, 120524], "mapped", [955]], [[120525, 120525], "mapped", [956]], [[120526, 120526], "mapped", [957]], [[120527, 120527], "mapped", [958]], [[120528, 120528], "mapped", [959]], [[120529, 120529], "mapped", [960]], [[120530, 120530], "mapped", [961]], [[120531, 120532], "mapped", [963]], [[120533, 120533], "mapped", [964]], [[120534, 120534], "mapped", [965]], [[120535, 120535], "mapped", [966]], [[120536, 120536], "mapped", [967]], [[120537, 120537], "mapped", [968]], [[120538, 120538], "mapped", [969]], [[120539, 120539], "mapped", [8706]], [[120540, 120540], "mapped", [949]], [[120541, 120541], "mapped", [952]], [[120542, 120542], "mapped", [954]], [[120543, 120543], "mapped", [966]], [[120544, 120544], "mapped", [961]], [[120545, 120545], "mapped", [960]], [[120546, 120546], "mapped", [945]], [[120547, 120547], "mapped", [946]], [[120548, 120548], "mapped", [947]], [[120549, 120549], "mapped", [948]], [[120550, 120550], "mapped", [949]], [[120551, 120551], "mapped", [950]], [[120552, 120552], "mapped", [951]], [[120553, 120553], "mapped", [952]], [[120554, 120554], "mapped", [953]], [[120555, 120555], "mapped", [954]], [[120556, 120556], "mapped", [955]], [[120557, 120557], "mapped", [956]], [[120558, 120558], "mapped", [957]], [[120559, 120559], "mapped", [958]], [[120560, 120560], "mapped", [959]], [[120561, 120561], "mapped", [960]], [[120562, 120562], "mapped", [961]], [[120563, 120563], "mapped", [952]], [[120564, 120564], "mapped", [963]], [[120565, 120565], "mapped", [964]], [[120566, 120566], "mapped", [965]], [[120567, 120567], "mapped", [966]], [[120568, 120568], "mapped", [967]], [[120569, 120569], "mapped", [968]], [[120570, 120570], "mapped", [969]], [[120571, 120571], "mapped", [8711]], [[120572, 120572], "mapped", [945]], [[120573, 120573], "mapped", [946]], [[120574, 120574], "mapped", [947]], [[120575, 120575], "mapped", [948]], [[120576, 120576], "mapped", [949]], [[120577, 120577], "mapped", [950]], [[120578, 120578], "mapped", [951]], [[120579, 120579], "mapped", [952]], [[120580, 120580], "mapped", [953]], [[120581, 120581], "mapped", [954]], [[120582, 120582], "mapped", [955]], [[120583, 120583], "mapped", [956]], [[120584, 120584], "mapped", [957]], [[120585, 120585], "mapped", [958]], [[120586, 120586], "mapped", [959]], [[120587, 120587], "mapped", [960]], [[120588, 120588], "mapped", [961]], [[120589, 120590], "mapped", [963]], [[120591, 120591], "mapped", [964]], [[120592, 120592], "mapped", [965]], [[120593, 120593], "mapped", [966]], [[120594, 120594], "mapped", [967]], [[120595, 120595], "mapped", [968]], [[120596, 120596], "mapped", [969]], [[120597, 120597], "mapped", [8706]], [[120598, 120598], "mapped", [949]], [[120599, 120599], "mapped", [952]], [[120600, 120600], "mapped", [954]], [[120601, 120601], "mapped", [966]], [[120602, 120602], "mapped", [961]], [[120603, 120603], "mapped", [960]], [[120604, 120604], "mapped", [945]], [[120605, 120605], "mapped", [946]], [[120606, 120606], "mapped", [947]], [[120607, 120607], "mapped", [948]], [[120608, 120608], "mapped", [949]], [[120609, 120609], "mapped", [950]], [[120610, 120610], "mapped", [951]], [[120611, 120611], "mapped", [952]], [[120612, 120612], "mapped", [953]], [[120613, 120613], "mapped", [954]], [[120614, 120614], "mapped", [955]], [[120615, 120615], "mapped", [956]], [[120616, 120616], "mapped", [957]], [[120617, 120617], "mapped", [958]], [[120618, 120618], "mapped", [959]], [[120619, 120619], "mapped", [960]], [[120620, 120620], "mapped", [961]], [[120621, 120621], "mapped", [952]], [[120622, 120622], "mapped", [963]], [[120623, 120623], "mapped", [964]], [[120624, 120624], "mapped", [965]], [[120625, 120625], "mapped", [966]], [[120626, 120626], "mapped", [967]], [[120627, 120627], "mapped", [968]], [[120628, 120628], "mapped", [969]], [[120629, 120629], "mapped", [8711]], [[120630, 120630], "mapped", [945]], [[120631, 120631], "mapped", [946]], [[120632, 120632], "mapped", [947]], [[120633, 120633], "mapped", [948]], [[120634, 120634], "mapped", [949]], [[120635, 120635], "mapped", [950]], [[120636, 120636], "mapped", [951]], [[120637, 120637], "mapped", [952]], [[120638, 120638], "mapped", [953]], [[120639, 120639], "mapped", [954]], [[120640, 120640], "mapped", [955]], [[120641, 120641], "mapped", [956]], [[120642, 120642], "mapped", [957]], [[120643, 120643], "mapped", [958]], [[120644, 120644], "mapped", [959]], [[120645, 120645], "mapped", [960]], [[120646, 120646], "mapped", [961]], [[120647, 120648], "mapped", [963]], [[120649, 120649], "mapped", [964]], [[120650, 120650], "mapped", [965]], [[120651, 120651], "mapped", [966]], [[120652, 120652], "mapped", [967]], [[120653, 120653], "mapped", [968]], [[120654, 120654], "mapped", [969]], [[120655, 120655], "mapped", [8706]], [[120656, 120656], "mapped", [949]], [[120657, 120657], "mapped", [952]], [[120658, 120658], "mapped", [954]], [[120659, 120659], "mapped", [966]], [[120660, 120660], "mapped", [961]], [[120661, 120661], "mapped", [960]], [[120662, 120662], "mapped", [945]], [[120663, 120663], "mapped", [946]], [[120664, 120664], "mapped", [947]], [[120665, 120665], "mapped", [948]], [[120666, 120666], "mapped", [949]], [[120667, 120667], "mapped", [950]], [[120668, 120668], "mapped", [951]], [[120669, 120669], "mapped", [952]], [[120670, 120670], "mapped", [953]], [[120671, 120671], "mapped", [954]], [[120672, 120672], "mapped", [955]], [[120673, 120673], "mapped", [956]], [[120674, 120674], "mapped", [957]], [[120675, 120675], "mapped", [958]], [[120676, 120676], "mapped", [959]], [[120677, 120677], "mapped", [960]], [[120678, 120678], "mapped", [961]], [[120679, 120679], "mapped", [952]], [[120680, 120680], "mapped", [963]], [[120681, 120681], "mapped", [964]], [[120682, 120682], "mapped", [965]], [[120683, 120683], "mapped", [966]], [[120684, 120684], "mapped", [967]], [[120685, 120685], "mapped", [968]], [[120686, 120686], "mapped", [969]], [[120687, 120687], "mapped", [8711]], [[120688, 120688], "mapped", [945]], [[120689, 120689], "mapped", [946]], [[120690, 120690], "mapped", [947]], [[120691, 120691], "mapped", [948]], [[120692, 120692], "mapped", [949]], [[120693, 120693], "mapped", [950]], [[120694, 120694], "mapped", [951]], [[120695, 120695], "mapped", [952]], [[120696, 120696], "mapped", [953]], [[120697, 120697], "mapped", [954]], [[120698, 120698], "mapped", [955]], [[120699, 120699], "mapped", [956]], [[120700, 120700], "mapped", [957]], [[120701, 120701], "mapped", [958]], [[120702, 120702], "mapped", [959]], [[120703, 120703], "mapped", [960]], [[120704, 120704], "mapped", [961]], [[120705, 120706], "mapped", [963]], [[120707, 120707], "mapped", [964]], [[120708, 120708], "mapped", [965]], [[120709, 120709], "mapped", [966]], [[120710, 120710], "mapped", [967]], [[120711, 120711], "mapped", [968]], [[120712, 120712], "mapped", [969]], [[120713, 120713], "mapped", [8706]], [[120714, 120714], "mapped", [949]], [[120715, 120715], "mapped", [952]], [[120716, 120716], "mapped", [954]], [[120717, 120717], "mapped", [966]], [[120718, 120718], "mapped", [961]], [[120719, 120719], "mapped", [960]], [[120720, 120720], "mapped", [945]], [[120721, 120721], "mapped", [946]], [[120722, 120722], "mapped", [947]], [[120723, 120723], "mapped", [948]], [[120724, 120724], "mapped", [949]], [[120725, 120725], "mapped", [950]], [[120726, 120726], "mapped", [951]], [[120727, 120727], "mapped", [952]], [[120728, 120728], "mapped", [953]], [[120729, 120729], "mapped", [954]], [[120730, 120730], "mapped", [955]], [[120731, 120731], "mapped", [956]], [[120732, 120732], "mapped", [957]], [[120733, 120733], "mapped", [958]], [[120734, 120734], "mapped", [959]], [[120735, 120735], "mapped", [960]], [[120736, 120736], "mapped", [961]], [[120737, 120737], "mapped", [952]], [[120738, 120738], "mapped", [963]], [[120739, 120739], "mapped", [964]], [[120740, 120740], "mapped", [965]], [[120741, 120741], "mapped", [966]], [[120742, 120742], "mapped", [967]], [[120743, 120743], "mapped", [968]], [[120744, 120744], "mapped", [969]], [[120745, 120745], "mapped", [8711]], [[120746, 120746], "mapped", [945]], [[120747, 120747], "mapped", [946]], [[120748, 120748], "mapped", [947]], [[120749, 120749], "mapped", [948]], [[120750, 120750], "mapped", [949]], [[120751, 120751], "mapped", [950]], [[120752, 120752], "mapped", [951]], [[120753, 120753], "mapped", [952]], [[120754, 120754], "mapped", [953]], [[120755, 120755], "mapped", [954]], [[120756, 120756], "mapped", [955]], [[120757, 120757], "mapped", [956]], [[120758, 120758], "mapped", [957]], [[120759, 120759], "mapped", [958]], [[120760, 120760], "mapped", [959]], [[120761, 120761], "mapped", [960]], [[120762, 120762], "mapped", [961]], [[120763, 120764], "mapped", [963]], [[120765, 120765], "mapped", [964]], [[120766, 120766], "mapped", [965]], [[120767, 120767], "mapped", [966]], [[120768, 120768], "mapped", [967]], [[120769, 120769], "mapped", [968]], [[120770, 120770], "mapped", [969]], [[120771, 120771], "mapped", [8706]], [[120772, 120772], "mapped", [949]], [[120773, 120773], "mapped", [952]], [[120774, 120774], "mapped", [954]], [[120775, 120775], "mapped", [966]], [[120776, 120776], "mapped", [961]], [[120777, 120777], "mapped", [960]], [[120778, 120779], "mapped", [989]], [[120780, 120781], "disallowed"], [[120782, 120782], "mapped", [48]], [[120783, 120783], "mapped", [49]], [[120784, 120784], "mapped", [50]], [[120785, 120785], "mapped", [51]], [[120786, 120786], "mapped", [52]], [[120787, 120787], "mapped", [53]], [[120788, 120788], "mapped", [54]], [[120789, 120789], "mapped", [55]], [[120790, 120790], "mapped", [56]], [[120791, 120791], "mapped", [57]], [[120792, 120792], "mapped", [48]], [[120793, 120793], "mapped", [49]], [[120794, 120794], "mapped", [50]], [[120795, 120795], "mapped", [51]], [[120796, 120796], "mapped", [52]], [[120797, 120797], "mapped", [53]], [[120798, 120798], "mapped", [54]], [[120799, 120799], "mapped", [55]], [[120800, 120800], "mapped", [56]], [[120801, 120801], "mapped", [57]], [[120802, 120802], "mapped", [48]], [[120803, 120803], "mapped", [49]], [[120804, 120804], "mapped", [50]], [[120805, 120805], "mapped", [51]], [[120806, 120806], "mapped", [52]], [[120807, 120807], "mapped", [53]], [[120808, 120808], "mapped", [54]], [[120809, 120809], "mapped", [55]], [[120810, 120810], "mapped", [56]], [[120811, 120811], "mapped", [57]], [[120812, 120812], "mapped", [48]], [[120813, 120813], "mapped", [49]], [[120814, 120814], "mapped", [50]], [[120815, 120815], "mapped", [51]], [[120816, 120816], "mapped", [52]], [[120817, 120817], "mapped", [53]], [[120818, 120818], "mapped", [54]], [[120819, 120819], "mapped", [55]], [[120820, 120820], "mapped", [56]], [[120821, 120821], "mapped", [57]], [[120822, 120822], "mapped", [48]], [[120823, 120823], "mapped", [49]], [[120824, 120824], "mapped", [50]], [[120825, 120825], "mapped", [51]], [[120826, 120826], "mapped", [52]], [[120827, 120827], "mapped", [53]], [[120828, 120828], "mapped", [54]], [[120829, 120829], "mapped", [55]], [[120830, 120830], "mapped", [56]], [[120831, 120831], "mapped", [57]], [[120832, 121343], "valid", [], "NV8"], [[121344, 121398], "valid"], [[121399, 121402], "valid", [], "NV8"], [[121403, 121452], "valid"], [[121453, 121460], "valid", [], "NV8"], [[121461, 121461], "valid"], [[121462, 121475], "valid", [], "NV8"], [[121476, 121476], "valid"], [[121477, 121483], "valid", [], "NV8"], [[121484, 121498], "disallowed"], [[121499, 121503], "valid"], [[121504, 121504], "disallowed"], [[121505, 121519], "valid"], [[121520, 124927], "disallowed"], [[124928, 125124], "valid"], [[125125, 125126], "disallowed"], [[125127, 125135], "valid", [], "NV8"], [[125136, 125142], "valid"], [[125143, 126463], "disallowed"], [[126464, 126464], "mapped", [1575]], [[126465, 126465], "mapped", [1576]], [[126466, 126466], "mapped", [1580]], [[126467, 126467], "mapped", [1583]], [[126468, 126468], "disallowed"], [[126469, 126469], "mapped", [1608]], [[126470, 126470], "mapped", [1586]], [[126471, 126471], "mapped", [1581]], [[126472, 126472], "mapped", [1591]], [[126473, 126473], "mapped", [1610]], [[126474, 126474], "mapped", [1603]], [[126475, 126475], "mapped", [1604]], [[126476, 126476], "mapped", [1605]], [[126477, 126477], "mapped", [1606]], [[126478, 126478], "mapped", [1587]], [[126479, 126479], "mapped", [1593]], [[126480, 126480], "mapped", [1601]], [[126481, 126481], "mapped", [1589]], [[126482, 126482], "mapped", [1602]], [[126483, 126483], "mapped", [1585]], [[126484, 126484], "mapped", [1588]], [[126485, 126485], "mapped", [1578]], [[126486, 126486], "mapped", [1579]], [[126487, 126487], "mapped", [1582]], [[126488, 126488], "mapped", [1584]], [[126489, 126489], "mapped", [1590]], [[126490, 126490], "mapped", [1592]], [[126491, 126491], "mapped", [1594]], [[126492, 126492], "mapped", [1646]], [[126493, 126493], "mapped", [1722]], [[126494, 126494], "mapped", [1697]], [[126495, 126495], "mapped", [1647]], [[126496, 126496], "disallowed"], [[126497, 126497], "mapped", [1576]], [[126498, 126498], "mapped", [1580]], [[126499, 126499], "disallowed"], [[126500, 126500], "mapped", [1607]], [[126501, 126502], "disallowed"], [[126503, 126503], "mapped", [1581]], [[126504, 126504], "disallowed"], [[126505, 126505], "mapped", [1610]], [[126506, 126506], "mapped", [1603]], [[126507, 126507], "mapped", [1604]], [[126508, 126508], "mapped", [1605]], [[126509, 126509], "mapped", [1606]], [[126510, 126510], "mapped", [1587]], [[126511, 126511], "mapped", [1593]], [[126512, 126512], "mapped", [1601]], [[126513, 126513], "mapped", [1589]], [[126514, 126514], "mapped", [1602]], [[126515, 126515], "disallowed"], [[126516, 126516], "mapped", [1588]], [[126517, 126517], "mapped", [1578]], [[126518, 126518], "mapped", [1579]], [[126519, 126519], "mapped", [1582]], [[126520, 126520], "disallowed"], [[126521, 126521], "mapped", [1590]], [[126522, 126522], "disallowed"], [[126523, 126523], "mapped", [1594]], [[126524, 126529], "disallowed"], [[126530, 126530], "mapped", [1580]], [[126531, 126534], "disallowed"], [[126535, 126535], "mapped", [1581]], [[126536, 126536], "disallowed"], [[126537, 126537], "mapped", [1610]], [[126538, 126538], "disallowed"], [[126539, 126539], "mapped", [1604]], [[126540, 126540], "disallowed"], [[126541, 126541], "mapped", [1606]], [[126542, 126542], "mapped", [1587]], [[126543, 126543], "mapped", [1593]], [[126544, 126544], "disallowed"], [[126545, 126545], "mapped", [1589]], [[126546, 126546], "mapped", [1602]], [[126547, 126547], "disallowed"], [[126548, 126548], "mapped", [1588]], [[126549, 126550], "disallowed"], [[126551, 126551], "mapped", [1582]], [[126552, 126552], "disallowed"], [[126553, 126553], "mapped", [1590]], [[126554, 126554], "disallowed"], [[126555, 126555], "mapped", [1594]], [[126556, 126556], "disallowed"], [[126557, 126557], "mapped", [1722]], [[126558, 126558], "disallowed"], [[126559, 126559], "mapped", [1647]], [[126560, 126560], "disallowed"], [[126561, 126561], "mapped", [1576]], [[126562, 126562], "mapped", [1580]], [[126563, 126563], "disallowed"], [[126564, 126564], "mapped", [1607]], [[126565, 126566], "disallowed"], [[126567, 126567], "mapped", [1581]], [[126568, 126568], "mapped", [1591]], [[126569, 126569], "mapped", [1610]], [[126570, 126570], "mapped", [1603]], [[126571, 126571], "disallowed"], [[126572, 126572], "mapped", [1605]], [[126573, 126573], "mapped", [1606]], [[126574, 126574], "mapped", [1587]], [[126575, 126575], "mapped", [1593]], [[126576, 126576], "mapped", [1601]], [[126577, 126577], "mapped", [1589]], [[126578, 126578], "mapped", [1602]], [[126579, 126579], "disallowed"], [[126580, 126580], "mapped", [1588]], [[126581, 126581], "mapped", [1578]], [[126582, 126582], "mapped", [1579]], [[126583, 126583], "mapped", [1582]], [[126584, 126584], "disallowed"], [[126585, 126585], "mapped", [1590]], [[126586, 126586], "mapped", [1592]], [[126587, 126587], "mapped", [1594]], [[126588, 126588], "mapped", [1646]], [[126589, 126589], "disallowed"], [[126590, 126590], "mapped", [1697]], [[126591, 126591], "disallowed"], [[126592, 126592], "mapped", [1575]], [[126593, 126593], "mapped", [1576]], [[126594, 126594], "mapped", [1580]], [[126595, 126595], "mapped", [1583]], [[126596, 126596], "mapped", [1607]], [[126597, 126597], "mapped", [1608]], [[126598, 126598], "mapped", [1586]], [[126599, 126599], "mapped", [1581]], [[126600, 126600], "mapped", [1591]], [[126601, 126601], "mapped", [1610]], [[126602, 126602], "disallowed"], [[126603, 126603], "mapped", [1604]], [[126604, 126604], "mapped", [1605]], [[126605, 126605], "mapped", [1606]], [[126606, 126606], "mapped", [1587]], [[126607, 126607], "mapped", [1593]], [[126608, 126608], "mapped", [1601]], [[126609, 126609], "mapped", [1589]], [[126610, 126610], "mapped", [1602]], [[126611, 126611], "mapped", [1585]], [[126612, 126612], "mapped", [1588]], [[126613, 126613], "mapped", [1578]], [[126614, 126614], "mapped", [1579]], [[126615, 126615], "mapped", [1582]], [[126616, 126616], "mapped", [1584]], [[126617, 126617], "mapped", [1590]], [[126618, 126618], "mapped", [1592]], [[126619, 126619], "mapped", [1594]], [[126620, 126624], "disallowed"], [[126625, 126625], "mapped", [1576]], [[126626, 126626], "mapped", [1580]], [[126627, 126627], "mapped", [1583]], [[126628, 126628], "disallowed"], [[126629, 126629], "mapped", [1608]], [[126630, 126630], "mapped", [1586]], [[126631, 126631], "mapped", [1581]], [[126632, 126632], "mapped", [1591]], [[126633, 126633], "mapped", [1610]], [[126634, 126634], "disallowed"], [[126635, 126635], "mapped", [1604]], [[126636, 126636], "mapped", [1605]], [[126637, 126637], "mapped", [1606]], [[126638, 126638], "mapped", [1587]], [[126639, 126639], "mapped", [1593]], [[126640, 126640], "mapped", [1601]], [[126641, 126641], "mapped", [1589]], [[126642, 126642], "mapped", [1602]], [[126643, 126643], "mapped", [1585]], [[126644, 126644], "mapped", [1588]], [[126645, 126645], "mapped", [1578]], [[126646, 126646], "mapped", [1579]], [[126647, 126647], "mapped", [1582]], [[126648, 126648], "mapped", [1584]], [[126649, 126649], "mapped", [1590]], [[126650, 126650], "mapped", [1592]], [[126651, 126651], "mapped", [1594]], [[126652, 126703], "disallowed"], [[126704, 126705], "valid", [], "NV8"], [[126706, 126975], "disallowed"], [[126976, 127019], "valid", [], "NV8"], [[127020, 127023], "disallowed"], [[127024, 127123], "valid", [], "NV8"], [[127124, 127135], "disallowed"], [[127136, 127150], "valid", [], "NV8"], [[127151, 127152], "disallowed"], [[127153, 127166], "valid", [], "NV8"], [[127167, 127167], "valid", [], "NV8"], [[127168, 127168], "disallowed"], [[127169, 127183], "valid", [], "NV8"], [[127184, 127184], "disallowed"], [[127185, 127199], "valid", [], "NV8"], [[127200, 127221], "valid", [], "NV8"], [[127222, 127231], "disallowed"], [[127232, 127232], "disallowed"], [[127233, 127233], "disallowed_STD3_mapped", [48, 44]], [[127234, 127234], "disallowed_STD3_mapped", [49, 44]], [[127235, 127235], "disallowed_STD3_mapped", [50, 44]], [[127236, 127236], "disallowed_STD3_mapped", [51, 44]], [[127237, 127237], "disallowed_STD3_mapped", [52, 44]], [[127238, 127238], "disallowed_STD3_mapped", [53, 44]], [[127239, 127239], "disallowed_STD3_mapped", [54, 44]], [[127240, 127240], "disallowed_STD3_mapped", [55, 44]], [[127241, 127241], "disallowed_STD3_mapped", [56, 44]], [[127242, 127242], "disallowed_STD3_mapped", [57, 44]], [[127243, 127244], "valid", [], "NV8"], [[127245, 127247], "disallowed"], [[127248, 127248], "disallowed_STD3_mapped", [40, 97, 41]], [[127249, 127249], "disallowed_STD3_mapped", [40, 98, 41]], [[127250, 127250], "disallowed_STD3_mapped", [40, 99, 41]], [[127251, 127251], "disallowed_STD3_mapped", [40, 100, 41]], [[127252, 127252], "disallowed_STD3_mapped", [40, 101, 41]], [[127253, 127253], "disallowed_STD3_mapped", [40, 102, 41]], [[127254, 127254], "disallowed_STD3_mapped", [40, 103, 41]], [[127255, 127255], "disallowed_STD3_mapped", [40, 104, 41]], [[127256, 127256], "disallowed_STD3_mapped", [40, 105, 41]], [[127257, 127257], "disallowed_STD3_mapped", [40, 106, 41]], [[127258, 127258], "disallowed_STD3_mapped", [40, 107, 41]], [[127259, 127259], "disallowed_STD3_mapped", [40, 108, 41]], [[127260, 127260], "disallowed_STD3_mapped", [40, 109, 41]], [[127261, 127261], "disallowed_STD3_mapped", [40, 110, 41]], [[127262, 127262], "disallowed_STD3_mapped", [40, 111, 41]], [[127263, 127263], "disallowed_STD3_mapped", [40, 112, 41]], [[127264, 127264], "disallowed_STD3_mapped", [40, 113, 41]], [[127265, 127265], "disallowed_STD3_mapped", [40, 114, 41]], [[127266, 127266], "disallowed_STD3_mapped", [40, 115, 41]], [[127267, 127267], "disallowed_STD3_mapped", [40, 116, 41]], [[127268, 127268], "disallowed_STD3_mapped", [40, 117, 41]], [[127269, 127269], "disallowed_STD3_mapped", [40, 118, 41]], [[127270, 127270], "disallowed_STD3_mapped", [40, 119, 41]], [[127271, 127271], "disallowed_STD3_mapped", [40, 120, 41]], [[127272, 127272], "disallowed_STD3_mapped", [40, 121, 41]], [[127273, 127273], "disallowed_STD3_mapped", [40, 122, 41]], [[127274, 127274], "mapped", [12308, 115, 12309]], [[127275, 127275], "mapped", [99]], [[127276, 127276], "mapped", [114]], [[127277, 127277], "mapped", [99, 100]], [[127278, 127278], "mapped", [119, 122]], [[127279, 127279], "disallowed"], [[127280, 127280], "mapped", [97]], [[127281, 127281], "mapped", [98]], [[127282, 127282], "mapped", [99]], [[127283, 127283], "mapped", [100]], [[127284, 127284], "mapped", [101]], [[127285, 127285], "mapped", [102]], [[127286, 127286], "mapped", [103]], [[127287, 127287], "mapped", [104]], [[127288, 127288], "mapped", [105]], [[127289, 127289], "mapped", [106]], [[127290, 127290], "mapped", [107]], [[127291, 127291], "mapped", [108]], [[127292, 127292], "mapped", [109]], [[127293, 127293], "mapped", [110]], [[127294, 127294], "mapped", [111]], [[127295, 127295], "mapped", [112]], [[127296, 127296], "mapped", [113]], [[127297, 127297], "mapped", [114]], [[127298, 127298], "mapped", [115]], [[127299, 127299], "mapped", [116]], [[127300, 127300], "mapped", [117]], [[127301, 127301], "mapped", [118]], [[127302, 127302], "mapped", [119]], [[127303, 127303], "mapped", [120]], [[127304, 127304], "mapped", [121]], [[127305, 127305], "mapped", [122]], [[127306, 127306], "mapped", [104, 118]], [[127307, 127307], "mapped", [109, 118]], [[127308, 127308], "mapped", [115, 100]], [[127309, 127309], "mapped", [115, 115]], [[127310, 127310], "mapped", [112, 112, 118]], [[127311, 127311], "mapped", [119, 99]], [[127312, 127318], "valid", [], "NV8"], [[127319, 127319], "valid", [], "NV8"], [[127320, 127326], "valid", [], "NV8"], [[127327, 127327], "valid", [], "NV8"], [[127328, 127337], "valid", [], "NV8"], [[127338, 127338], "mapped", [109, 99]], [[127339, 127339], "mapped", [109, 100]], [[127340, 127343], "disallowed"], [[127344, 127352], "valid", [], "NV8"], [[127353, 127353], "valid", [], "NV8"], [[127354, 127354], "valid", [], "NV8"], [[127355, 127356], "valid", [], "NV8"], [[127357, 127358], "valid", [], "NV8"], [[127359, 127359], "valid", [], "NV8"], [[127360, 127369], "valid", [], "NV8"], [[127370, 127373], "valid", [], "NV8"], [[127374, 127375], "valid", [], "NV8"], [[127376, 127376], "mapped", [100, 106]], [[127377, 127386], "valid", [], "NV8"], [[127387, 127461], "disallowed"], [[127462, 127487], "valid", [], "NV8"], [[127488, 127488], "mapped", [12411, 12363]], [[127489, 127489], "mapped", [12467, 12467]], [[127490, 127490], "mapped", [12469]], [[127491, 127503], "disallowed"], [[127504, 127504], "mapped", [25163]], [[127505, 127505], "mapped", [23383]], [[127506, 127506], "mapped", [21452]], [[127507, 127507], "mapped", [12487]], [[127508, 127508], "mapped", [20108]], [[127509, 127509], "mapped", [22810]], [[127510, 127510], "mapped", [35299]], [[127511, 127511], "mapped", [22825]], [[127512, 127512], "mapped", [20132]], [[127513, 127513], "mapped", [26144]], [[127514, 127514], "mapped", [28961]], [[127515, 127515], "mapped", [26009]], [[127516, 127516], "mapped", [21069]], [[127517, 127517], "mapped", [24460]], [[127518, 127518], "mapped", [20877]], [[127519, 127519], "mapped", [26032]], [[127520, 127520], "mapped", [21021]], [[127521, 127521], "mapped", [32066]], [[127522, 127522], "mapped", [29983]], [[127523, 127523], "mapped", [36009]], [[127524, 127524], "mapped", [22768]], [[127525, 127525], "mapped", [21561]], [[127526, 127526], "mapped", [28436]], [[127527, 127527], "mapped", [25237]], [[127528, 127528], "mapped", [25429]], [[127529, 127529], "mapped", [19968]], [[127530, 127530], "mapped", [19977]], [[127531, 127531], "mapped", [36938]], [[127532, 127532], "mapped", [24038]], [[127533, 127533], "mapped", [20013]], [[127534, 127534], "mapped", [21491]], [[127535, 127535], "mapped", [25351]], [[127536, 127536], "mapped", [36208]], [[127537, 127537], "mapped", [25171]], [[127538, 127538], "mapped", [31105]], [[127539, 127539], "mapped", [31354]], [[127540, 127540], "mapped", [21512]], [[127541, 127541], "mapped", [28288]], [[127542, 127542], "mapped", [26377]], [[127543, 127543], "mapped", [26376]], [[127544, 127544], "mapped", [30003]], [[127545, 127545], "mapped", [21106]], [[127546, 127546], "mapped", [21942]], [[127547, 127551], "disallowed"], [[127552, 127552], "mapped", [12308, 26412, 12309]], [[127553, 127553], "mapped", [12308, 19977, 12309]], [[127554, 127554], "mapped", [12308, 20108, 12309]], [[127555, 127555], "mapped", [12308, 23433, 12309]], [[127556, 127556], "mapped", [12308, 28857, 12309]], [[127557, 127557], "mapped", [12308, 25171, 12309]], [[127558, 127558], "mapped", [12308, 30423, 12309]], [[127559, 127559], "mapped", [12308, 21213, 12309]], [[127560, 127560], "mapped", [12308, 25943, 12309]], [[127561, 127567], "disallowed"], [[127568, 127568], "mapped", [24471]], [[127569, 127569], "mapped", [21487]], [[127570, 127743], "disallowed"], [[127744, 127776], "valid", [], "NV8"], [[127777, 127788], "valid", [], "NV8"], [[127789, 127791], "valid", [], "NV8"], [[127792, 127797], "valid", [], "NV8"], [[127798, 127798], "valid", [], "NV8"], [[127799, 127868], "valid", [], "NV8"], [[127869, 127869], "valid", [], "NV8"], [[127870, 127871], "valid", [], "NV8"], [[127872, 127891], "valid", [], "NV8"], [[127892, 127903], "valid", [], "NV8"], [[127904, 127940], "valid", [], "NV8"], [[127941, 127941], "valid", [], "NV8"], [[127942, 127946], "valid", [], "NV8"], [[127947, 127950], "valid", [], "NV8"], [[127951, 127955], "valid", [], "NV8"], [[127956, 127967], "valid", [], "NV8"], [[127968, 127984], "valid", [], "NV8"], [[127985, 127991], "valid", [], "NV8"], [[127992, 127999], "valid", [], "NV8"], [[128e3, 128062], "valid", [], "NV8"], [[128063, 128063], "valid", [], "NV8"], [[128064, 128064], "valid", [], "NV8"], [[128065, 128065], "valid", [], "NV8"], [[128066, 128247], "valid", [], "NV8"], [[128248, 128248], "valid", [], "NV8"], [[128249, 128252], "valid", [], "NV8"], [[128253, 128254], "valid", [], "NV8"], [[128255, 128255], "valid", [], "NV8"], [[128256, 128317], "valid", [], "NV8"], [[128318, 128319], "valid", [], "NV8"], [[128320, 128323], "valid", [], "NV8"], [[128324, 128330], "valid", [], "NV8"], [[128331, 128335], "valid", [], "NV8"], [[128336, 128359], "valid", [], "NV8"], [[128360, 128377], "valid", [], "NV8"], [[128378, 128378], "disallowed"], [[128379, 128419], "valid", [], "NV8"], [[128420, 128420], "disallowed"], [[128421, 128506], "valid", [], "NV8"], [[128507, 128511], "valid", [], "NV8"], [[128512, 128512], "valid", [], "NV8"], [[128513, 128528], "valid", [], "NV8"], [[128529, 128529], "valid", [], "NV8"], [[128530, 128532], "valid", [], "NV8"], [[128533, 128533], "valid", [], "NV8"], [[128534, 128534], "valid", [], "NV8"], [[128535, 128535], "valid", [], "NV8"], [[128536, 128536], "valid", [], "NV8"], [[128537, 128537], "valid", [], "NV8"], [[128538, 128538], "valid", [], "NV8"], [[128539, 128539], "valid", [], "NV8"], [[128540, 128542], "valid", [], "NV8"], [[128543, 128543], "valid", [], "NV8"], [[128544, 128549], "valid", [], "NV8"], [[128550, 128551], "valid", [], "NV8"], [[128552, 128555], "valid", [], "NV8"], [[128556, 128556], "valid", [], "NV8"], [[128557, 128557], "valid", [], "NV8"], [[128558, 128559], "valid", [], "NV8"], [[128560, 128563], "valid", [], "NV8"], [[128564, 128564], "valid", [], "NV8"], [[128565, 128576], "valid", [], "NV8"], [[128577, 128578], "valid", [], "NV8"], [[128579, 128580], "valid", [], "NV8"], [[128581, 128591], "valid", [], "NV8"], [[128592, 128639], "valid", [], "NV8"], [[128640, 128709], "valid", [], "NV8"], [[128710, 128719], "valid", [], "NV8"], [[128720, 128720], "valid", [], "NV8"], [[128721, 128735], "disallowed"], [[128736, 128748], "valid", [], "NV8"], [[128749, 128751], "disallowed"], [[128752, 128755], "valid", [], "NV8"], [[128756, 128767], "disallowed"], [[128768, 128883], "valid", [], "NV8"], [[128884, 128895], "disallowed"], [[128896, 128980], "valid", [], "NV8"], [[128981, 129023], "disallowed"], [[129024, 129035], "valid", [], "NV8"], [[129036, 129039], "disallowed"], [[129040, 129095], "valid", [], "NV8"], [[129096, 129103], "disallowed"], [[129104, 129113], "valid", [], "NV8"], [[129114, 129119], "disallowed"], [[129120, 129159], "valid", [], "NV8"], [[129160, 129167], "disallowed"], [[129168, 129197], "valid", [], "NV8"], [[129198, 129295], "disallowed"], [[129296, 129304], "valid", [], "NV8"], [[129305, 129407], "disallowed"], [[129408, 129412], "valid", [], "NV8"], [[129413, 129471], "disallowed"], [[129472, 129472], "valid", [], "NV8"], [[129473, 131069], "disallowed"], [[131070, 131071], "disallowed"], [[131072, 173782], "valid"], [[173783, 173823], "disallowed"], [[173824, 177972], "valid"], [[177973, 177983], "disallowed"], [[177984, 178205], "valid"], [[178206, 178207], "disallowed"], [[178208, 183969], "valid"], [[183970, 194559], "disallowed"], [[194560, 194560], "mapped", [20029]], [[194561, 194561], "mapped", [20024]], [[194562, 194562], "mapped", [20033]], [[194563, 194563], "mapped", [131362]], [[194564, 194564], "mapped", [20320]], [[194565, 194565], "mapped", [20398]], [[194566, 194566], "mapped", [20411]], [[194567, 194567], "mapped", [20482]], [[194568, 194568], "mapped", [20602]], [[194569, 194569], "mapped", [20633]], [[194570, 194570], "mapped", [20711]], [[194571, 194571], "mapped", [20687]], [[194572, 194572], "mapped", [13470]], [[194573, 194573], "mapped", [132666]], [[194574, 194574], "mapped", [20813]], [[194575, 194575], "mapped", [20820]], [[194576, 194576], "mapped", [20836]], [[194577, 194577], "mapped", [20855]], [[194578, 194578], "mapped", [132380]], [[194579, 194579], "mapped", [13497]], [[194580, 194580], "mapped", [20839]], [[194581, 194581], "mapped", [20877]], [[194582, 194582], "mapped", [132427]], [[194583, 194583], "mapped", [20887]], [[194584, 194584], "mapped", [20900]], [[194585, 194585], "mapped", [20172]], [[194586, 194586], "mapped", [20908]], [[194587, 194587], "mapped", [20917]], [[194588, 194588], "mapped", [168415]], [[194589, 194589], "mapped", [20981]], [[194590, 194590], "mapped", [20995]], [[194591, 194591], "mapped", [13535]], [[194592, 194592], "mapped", [21051]], [[194593, 194593], "mapped", [21062]], [[194594, 194594], "mapped", [21106]], [[194595, 194595], "mapped", [21111]], [[194596, 194596], "mapped", [13589]], [[194597, 194597], "mapped", [21191]], [[194598, 194598], "mapped", [21193]], [[194599, 194599], "mapped", [21220]], [[194600, 194600], "mapped", [21242]], [[194601, 194601], "mapped", [21253]], [[194602, 194602], "mapped", [21254]], [[194603, 194603], "mapped", [21271]], [[194604, 194604], "mapped", [21321]], [[194605, 194605], "mapped", [21329]], [[194606, 194606], "mapped", [21338]], [[194607, 194607], "mapped", [21363]], [[194608, 194608], "mapped", [21373]], [[194609, 194611], "mapped", [21375]], [[194612, 194612], "mapped", [133676]], [[194613, 194613], "mapped", [28784]], [[194614, 194614], "mapped", [21450]], [[194615, 194615], "mapped", [21471]], [[194616, 194616], "mapped", [133987]], [[194617, 194617], "mapped", [21483]], [[194618, 194618], "mapped", [21489]], [[194619, 194619], "mapped", [21510]], [[194620, 194620], "mapped", [21662]], [[194621, 194621], "mapped", [21560]], [[194622, 194622], "mapped", [21576]], [[194623, 194623], "mapped", [21608]], [[194624, 194624], "mapped", [21666]], [[194625, 194625], "mapped", [21750]], [[194626, 194626], "mapped", [21776]], [[194627, 194627], "mapped", [21843]], [[194628, 194628], "mapped", [21859]], [[194629, 194630], "mapped", [21892]], [[194631, 194631], "mapped", [21913]], [[194632, 194632], "mapped", [21931]], [[194633, 194633], "mapped", [21939]], [[194634, 194634], "mapped", [21954]], [[194635, 194635], "mapped", [22294]], [[194636, 194636], "mapped", [22022]], [[194637, 194637], "mapped", [22295]], [[194638, 194638], "mapped", [22097]], [[194639, 194639], "mapped", [22132]], [[194640, 194640], "mapped", [20999]], [[194641, 194641], "mapped", [22766]], [[194642, 194642], "mapped", [22478]], [[194643, 194643], "mapped", [22516]], [[194644, 194644], "mapped", [22541]], [[194645, 194645], "mapped", [22411]], [[194646, 194646], "mapped", [22578]], [[194647, 194647], "mapped", [22577]], [[194648, 194648], "mapped", [22700]], [[194649, 194649], "mapped", [136420]], [[194650, 194650], "mapped", [22770]], [[194651, 194651], "mapped", [22775]], [[194652, 194652], "mapped", [22790]], [[194653, 194653], "mapped", [22810]], [[194654, 194654], "mapped", [22818]], [[194655, 194655], "mapped", [22882]], [[194656, 194656], "mapped", [136872]], [[194657, 194657], "mapped", [136938]], [[194658, 194658], "mapped", [23020]], [[194659, 194659], "mapped", [23067]], [[194660, 194660], "mapped", [23079]], [[194661, 194661], "mapped", [23e3]], [[194662, 194662], "mapped", [23142]], [[194663, 194663], "mapped", [14062]], [[194664, 194664], "disallowed"], [[194665, 194665], "mapped", [23304]], [[194666, 194667], "mapped", [23358]], [[194668, 194668], "mapped", [137672]], [[194669, 194669], "mapped", [23491]], [[194670, 194670], "mapped", [23512]], [[194671, 194671], "mapped", [23527]], [[194672, 194672], "mapped", [23539]], [[194673, 194673], "mapped", [138008]], [[194674, 194674], "mapped", [23551]], [[194675, 194675], "mapped", [23558]], [[194676, 194676], "disallowed"], [[194677, 194677], "mapped", [23586]], [[194678, 194678], "mapped", [14209]], [[194679, 194679], "mapped", [23648]], [[194680, 194680], "mapped", [23662]], [[194681, 194681], "mapped", [23744]], [[194682, 194682], "mapped", [23693]], [[194683, 194683], "mapped", [138724]], [[194684, 194684], "mapped", [23875]], [[194685, 194685], "mapped", [138726]], [[194686, 194686], "mapped", [23918]], [[194687, 194687], "mapped", [23915]], [[194688, 194688], "mapped", [23932]], [[194689, 194689], "mapped", [24033]], [[194690, 194690], "mapped", [24034]], [[194691, 194691], "mapped", [14383]], [[194692, 194692], "mapped", [24061]], [[194693, 194693], "mapped", [24104]], [[194694, 194694], "mapped", [24125]], [[194695, 194695], "mapped", [24169]], [[194696, 194696], "mapped", [14434]], [[194697, 194697], "mapped", [139651]], [[194698, 194698], "mapped", [14460]], [[194699, 194699], "mapped", [24240]], [[194700, 194700], "mapped", [24243]], [[194701, 194701], "mapped", [24246]], [[194702, 194702], "mapped", [24266]], [[194703, 194703], "mapped", [172946]], [[194704, 194704], "mapped", [24318]], [[194705, 194706], "mapped", [140081]], [[194707, 194707], "mapped", [33281]], [[194708, 194709], "mapped", [24354]], [[194710, 194710], "mapped", [14535]], [[194711, 194711], "mapped", [144056]], [[194712, 194712], "mapped", [156122]], [[194713, 194713], "mapped", [24418]], [[194714, 194714], "mapped", [24427]], [[194715, 194715], "mapped", [14563]], [[194716, 194716], "mapped", [24474]], [[194717, 194717], "mapped", [24525]], [[194718, 194718], "mapped", [24535]], [[194719, 194719], "mapped", [24569]], [[194720, 194720], "mapped", [24705]], [[194721, 194721], "mapped", [14650]], [[194722, 194722], "mapped", [14620]], [[194723, 194723], "mapped", [24724]], [[194724, 194724], "mapped", [141012]], [[194725, 194725], "mapped", [24775]], [[194726, 194726], "mapped", [24904]], [[194727, 194727], "mapped", [24908]], [[194728, 194728], "mapped", [24910]], [[194729, 194729], "mapped", [24908]], [[194730, 194730], "mapped", [24954]], [[194731, 194731], "mapped", [24974]], [[194732, 194732], "mapped", [25010]], [[194733, 194733], "mapped", [24996]], [[194734, 194734], "mapped", [25007]], [[194735, 194735], "mapped", [25054]], [[194736, 194736], "mapped", [25074]], [[194737, 194737], "mapped", [25078]], [[194738, 194738], "mapped", [25104]], [[194739, 194739], "mapped", [25115]], [[194740, 194740], "mapped", [25181]], [[194741, 194741], "mapped", [25265]], [[194742, 194742], "mapped", [25300]], [[194743, 194743], "mapped", [25424]], [[194744, 194744], "mapped", [142092]], [[194745, 194745], "mapped", [25405]], [[194746, 194746], "mapped", [25340]], [[194747, 194747], "mapped", [25448]], [[194748, 194748], "mapped", [25475]], [[194749, 194749], "mapped", [25572]], [[194750, 194750], "mapped", [142321]], [[194751, 194751], "mapped", [25634]], [[194752, 194752], "mapped", [25541]], [[194753, 194753], "mapped", [25513]], [[194754, 194754], "mapped", [14894]], [[194755, 194755], "mapped", [25705]], [[194756, 194756], "mapped", [25726]], [[194757, 194757], "mapped", [25757]], [[194758, 194758], "mapped", [25719]], [[194759, 194759], "mapped", [14956]], [[194760, 194760], "mapped", [25935]], [[194761, 194761], "mapped", [25964]], [[194762, 194762], "mapped", [143370]], [[194763, 194763], "mapped", [26083]], [[194764, 194764], "mapped", [26360]], [[194765, 194765], "mapped", [26185]], [[194766, 194766], "mapped", [15129]], [[194767, 194767], "mapped", [26257]], [[194768, 194768], "mapped", [15112]], [[194769, 194769], "mapped", [15076]], [[194770, 194770], "mapped", [20882]], [[194771, 194771], "mapped", [20885]], [[194772, 194772], "mapped", [26368]], [[194773, 194773], "mapped", [26268]], [[194774, 194774], "mapped", [32941]], [[194775, 194775], "mapped", [17369]], [[194776, 194776], "mapped", [26391]], [[194777, 194777], "mapped", [26395]], [[194778, 194778], "mapped", [26401]], [[194779, 194779], "mapped", [26462]], [[194780, 194780], "mapped", [26451]], [[194781, 194781], "mapped", [144323]], [[194782, 194782], "mapped", [15177]], [[194783, 194783], "mapped", [26618]], [[194784, 194784], "mapped", [26501]], [[194785, 194785], "mapped", [26706]], [[194786, 194786], "mapped", [26757]], [[194787, 194787], "mapped", [144493]], [[194788, 194788], "mapped", [26766]], [[194789, 194789], "mapped", [26655]], [[194790, 194790], "mapped", [26900]], [[194791, 194791], "mapped", [15261]], [[194792, 194792], "mapped", [26946]], [[194793, 194793], "mapped", [27043]], [[194794, 194794], "mapped", [27114]], [[194795, 194795], "mapped", [27304]], [[194796, 194796], "mapped", [145059]], [[194797, 194797], "mapped", [27355]], [[194798, 194798], "mapped", [15384]], [[194799, 194799], "mapped", [27425]], [[194800, 194800], "mapped", [145575]], [[194801, 194801], "mapped", [27476]], [[194802, 194802], "mapped", [15438]], [[194803, 194803], "mapped", [27506]], [[194804, 194804], "mapped", [27551]], [[194805, 194805], "mapped", [27578]], [[194806, 194806], "mapped", [27579]], [[194807, 194807], "mapped", [146061]], [[194808, 194808], "mapped", [138507]], [[194809, 194809], "mapped", [146170]], [[194810, 194810], "mapped", [27726]], [[194811, 194811], "mapped", [146620]], [[194812, 194812], "mapped", [27839]], [[194813, 194813], "mapped", [27853]], [[194814, 194814], "mapped", [27751]], [[194815, 194815], "mapped", [27926]], [[194816, 194816], "mapped", [27966]], [[194817, 194817], "mapped", [28023]], [[194818, 194818], "mapped", [27969]], [[194819, 194819], "mapped", [28009]], [[194820, 194820], "mapped", [28024]], [[194821, 194821], "mapped", [28037]], [[194822, 194822], "mapped", [146718]], [[194823, 194823], "mapped", [27956]], [[194824, 194824], "mapped", [28207]], [[194825, 194825], "mapped", [28270]], [[194826, 194826], "mapped", [15667]], [[194827, 194827], "mapped", [28363]], [[194828, 194828], "mapped", [28359]], [[194829, 194829], "mapped", [147153]], [[194830, 194830], "mapped", [28153]], [[194831, 194831], "mapped", [28526]], [[194832, 194832], "mapped", [147294]], [[194833, 194833], "mapped", [147342]], [[194834, 194834], "mapped", [28614]], [[194835, 194835], "mapped", [28729]], [[194836, 194836], "mapped", [28702]], [[194837, 194837], "mapped", [28699]], [[194838, 194838], "mapped", [15766]], [[194839, 194839], "mapped", [28746]], [[194840, 194840], "mapped", [28797]], [[194841, 194841], "mapped", [28791]], [[194842, 194842], "mapped", [28845]], [[194843, 194843], "mapped", [132389]], [[194844, 194844], "mapped", [28997]], [[194845, 194845], "mapped", [148067]], [[194846, 194846], "mapped", [29084]], [[194847, 194847], "disallowed"], [[194848, 194848], "mapped", [29224]], [[194849, 194849], "mapped", [29237]], [[194850, 194850], "mapped", [29264]], [[194851, 194851], "mapped", [149e3]], [[194852, 194852], "mapped", [29312]], [[194853, 194853], "mapped", [29333]], [[194854, 194854], "mapped", [149301]], [[194855, 194855], "mapped", [149524]], [[194856, 194856], "mapped", [29562]], [[194857, 194857], "mapped", [29579]], [[194858, 194858], "mapped", [16044]], [[194859, 194859], "mapped", [29605]], [[194860, 194861], "mapped", [16056]], [[194862, 194862], "mapped", [29767]], [[194863, 194863], "mapped", [29788]], [[194864, 194864], "mapped", [29809]], [[194865, 194865], "mapped", [29829]], [[194866, 194866], "mapped", [29898]], [[194867, 194867], "mapped", [16155]], [[194868, 194868], "mapped", [29988]], [[194869, 194869], "mapped", [150582]], [[194870, 194870], "mapped", [30014]], [[194871, 194871], "mapped", [150674]], [[194872, 194872], "mapped", [30064]], [[194873, 194873], "mapped", [139679]], [[194874, 194874], "mapped", [30224]], [[194875, 194875], "mapped", [151457]], [[194876, 194876], "mapped", [151480]], [[194877, 194877], "mapped", [151620]], [[194878, 194878], "mapped", [16380]], [[194879, 194879], "mapped", [16392]], [[194880, 194880], "mapped", [30452]], [[194881, 194881], "mapped", [151795]], [[194882, 194882], "mapped", [151794]], [[194883, 194883], "mapped", [151833]], [[194884, 194884], "mapped", [151859]], [[194885, 194885], "mapped", [30494]], [[194886, 194887], "mapped", [30495]], [[194888, 194888], "mapped", [30538]], [[194889, 194889], "mapped", [16441]], [[194890, 194890], "mapped", [30603]], [[194891, 194891], "mapped", [16454]], [[194892, 194892], "mapped", [16534]], [[194893, 194893], "mapped", [152605]], [[194894, 194894], "mapped", [30798]], [[194895, 194895], "mapped", [30860]], [[194896, 194896], "mapped", [30924]], [[194897, 194897], "mapped", [16611]], [[194898, 194898], "mapped", [153126]], [[194899, 194899], "mapped", [31062]], [[194900, 194900], "mapped", [153242]], [[194901, 194901], "mapped", [153285]], [[194902, 194902], "mapped", [31119]], [[194903, 194903], "mapped", [31211]], [[194904, 194904], "mapped", [16687]], [[194905, 194905], "mapped", [31296]], [[194906, 194906], "mapped", [31306]], [[194907, 194907], "mapped", [31311]], [[194908, 194908], "mapped", [153980]], [[194909, 194910], "mapped", [154279]], [[194911, 194911], "disallowed"], [[194912, 194912], "mapped", [16898]], [[194913, 194913], "mapped", [154539]], [[194914, 194914], "mapped", [31686]], [[194915, 194915], "mapped", [31689]], [[194916, 194916], "mapped", [16935]], [[194917, 194917], "mapped", [154752]], [[194918, 194918], "mapped", [31954]], [[194919, 194919], "mapped", [17056]], [[194920, 194920], "mapped", [31976]], [[194921, 194921], "mapped", [31971]], [[194922, 194922], "mapped", [32e3]], [[194923, 194923], "mapped", [155526]], [[194924, 194924], "mapped", [32099]], [[194925, 194925], "mapped", [17153]], [[194926, 194926], "mapped", [32199]], [[194927, 194927], "mapped", [32258]], [[194928, 194928], "mapped", [32325]], [[194929, 194929], "mapped", [17204]], [[194930, 194930], "mapped", [156200]], [[194931, 194931], "mapped", [156231]], [[194932, 194932], "mapped", [17241]], [[194933, 194933], "mapped", [156377]], [[194934, 194934], "mapped", [32634]], [[194935, 194935], "mapped", [156478]], [[194936, 194936], "mapped", [32661]], [[194937, 194937], "mapped", [32762]], [[194938, 194938], "mapped", [32773]], [[194939, 194939], "mapped", [156890]], [[194940, 194940], "mapped", [156963]], [[194941, 194941], "mapped", [32864]], [[194942, 194942], "mapped", [157096]], [[194943, 194943], "mapped", [32880]], [[194944, 194944], "mapped", [144223]], [[194945, 194945], "mapped", [17365]], [[194946, 194946], "mapped", [32946]], [[194947, 194947], "mapped", [33027]], [[194948, 194948], "mapped", [17419]], [[194949, 194949], "mapped", [33086]], [[194950, 194950], "mapped", [23221]], [[194951, 194951], "mapped", [157607]], [[194952, 194952], "mapped", [157621]], [[194953, 194953], "mapped", [144275]], [[194954, 194954], "mapped", [144284]], [[194955, 194955], "mapped", [33281]], [[194956, 194956], "mapped", [33284]], [[194957, 194957], "mapped", [36766]], [[194958, 194958], "mapped", [17515]], [[194959, 194959], "mapped", [33425]], [[194960, 194960], "mapped", [33419]], [[194961, 194961], "mapped", [33437]], [[194962, 194962], "mapped", [21171]], [[194963, 194963], "mapped", [33457]], [[194964, 194964], "mapped", [33459]], [[194965, 194965], "mapped", [33469]], [[194966, 194966], "mapped", [33510]], [[194967, 194967], "mapped", [158524]], [[194968, 194968], "mapped", [33509]], [[194969, 194969], "mapped", [33565]], [[194970, 194970], "mapped", [33635]], [[194971, 194971], "mapped", [33709]], [[194972, 194972], "mapped", [33571]], [[194973, 194973], "mapped", [33725]], [[194974, 194974], "mapped", [33767]], [[194975, 194975], "mapped", [33879]], [[194976, 194976], "mapped", [33619]], [[194977, 194977], "mapped", [33738]], [[194978, 194978], "mapped", [33740]], [[194979, 194979], "mapped", [33756]], [[194980, 194980], "mapped", [158774]], [[194981, 194981], "mapped", [159083]], [[194982, 194982], "mapped", [158933]], [[194983, 194983], "mapped", [17707]], [[194984, 194984], "mapped", [34033]], [[194985, 194985], "mapped", [34035]], [[194986, 194986], "mapped", [34070]], [[194987, 194987], "mapped", [160714]], [[194988, 194988], "mapped", [34148]], [[194989, 194989], "mapped", [159532]], [[194990, 194990], "mapped", [17757]], [[194991, 194991], "mapped", [17761]], [[194992, 194992], "mapped", [159665]], [[194993, 194993], "mapped", [159954]], [[194994, 194994], "mapped", [17771]], [[194995, 194995], "mapped", [34384]], [[194996, 194996], "mapped", [34396]], [[194997, 194997], "mapped", [34407]], [[194998, 194998], "mapped", [34409]], [[194999, 194999], "mapped", [34473]], [[195e3, 195e3], "mapped", [34440]], [[195001, 195001], "mapped", [34574]], [[195002, 195002], "mapped", [34530]], [[195003, 195003], "mapped", [34681]], [[195004, 195004], "mapped", [34600]], [[195005, 195005], "mapped", [34667]], [[195006, 195006], "mapped", [34694]], [[195007, 195007], "disallowed"], [[195008, 195008], "mapped", [34785]], [[195009, 195009], "mapped", [34817]], [[195010, 195010], "mapped", [17913]], [[195011, 195011], "mapped", [34912]], [[195012, 195012], "mapped", [34915]], [[195013, 195013], "mapped", [161383]], [[195014, 195014], "mapped", [35031]], [[195015, 195015], "mapped", [35038]], [[195016, 195016], "mapped", [17973]], [[195017, 195017], "mapped", [35066]], [[195018, 195018], "mapped", [13499]], [[195019, 195019], "mapped", [161966]], [[195020, 195020], "mapped", [162150]], [[195021, 195021], "mapped", [18110]], [[195022, 195022], "mapped", [18119]], [[195023, 195023], "mapped", [35488]], [[195024, 195024], "mapped", [35565]], [[195025, 195025], "mapped", [35722]], [[195026, 195026], "mapped", [35925]], [[195027, 195027], "mapped", [162984]], [[195028, 195028], "mapped", [36011]], [[195029, 195029], "mapped", [36033]], [[195030, 195030], "mapped", [36123]], [[195031, 195031], "mapped", [36215]], [[195032, 195032], "mapped", [163631]], [[195033, 195033], "mapped", [133124]], [[195034, 195034], "mapped", [36299]], [[195035, 195035], "mapped", [36284]], [[195036, 195036], "mapped", [36336]], [[195037, 195037], "mapped", [133342]], [[195038, 195038], "mapped", [36564]], [[195039, 195039], "mapped", [36664]], [[195040, 195040], "mapped", [165330]], [[195041, 195041], "mapped", [165357]], [[195042, 195042], "mapped", [37012]], [[195043, 195043], "mapped", [37105]], [[195044, 195044], "mapped", [37137]], [[195045, 195045], "mapped", [165678]], [[195046, 195046], "mapped", [37147]], [[195047, 195047], "mapped", [37432]], [[195048, 195048], "mapped", [37591]], [[195049, 195049], "mapped", [37592]], [[195050, 195050], "mapped", [37500]], [[195051, 195051], "mapped", [37881]], [[195052, 195052], "mapped", [37909]], [[195053, 195053], "mapped", [166906]], [[195054, 195054], "mapped", [38283]], [[195055, 195055], "mapped", [18837]], [[195056, 195056], "mapped", [38327]], [[195057, 195057], "mapped", [167287]], [[195058, 195058], "mapped", [18918]], [[195059, 195059], "mapped", [38595]], [[195060, 195060], "mapped", [23986]], [[195061, 195061], "mapped", [38691]], [[195062, 195062], "mapped", [168261]], [[195063, 195063], "mapped", [168474]], [[195064, 195064], "mapped", [19054]], [[195065, 195065], "mapped", [19062]], [[195066, 195066], "mapped", [38880]], [[195067, 195067], "mapped", [168970]], [[195068, 195068], "mapped", [19122]], [[195069, 195069], "mapped", [169110]], [[195070, 195071], "mapped", [38923]], [[195072, 195072], "mapped", [38953]], [[195073, 195073], "mapped", [169398]], [[195074, 195074], "mapped", [39138]], [[195075, 195075], "mapped", [19251]], [[195076, 195076], "mapped", [39209]], [[195077, 195077], "mapped", [39335]], [[195078, 195078], "mapped", [39362]], [[195079, 195079], "mapped", [39422]], [[195080, 195080], "mapped", [19406]], [[195081, 195081], "mapped", [170800]], [[195082, 195082], "mapped", [39698]], [[195083, 195083], "mapped", [4e4]], [[195084, 195084], "mapped", [40189]], [[195085, 195085], "mapped", [19662]], [[195086, 195086], "mapped", [19693]], [[195087, 195087], "mapped", [40295]], [[195088, 195088], "mapped", [172238]], [[195089, 195089], "mapped", [19704]], [[195090, 195090], "mapped", [172293]], [[195091, 195091], "mapped", [172558]], [[195092, 195092], "mapped", [172689]], [[195093, 195093], "mapped", [40635]], [[195094, 195094], "mapped", [19798]], [[195095, 195095], "mapped", [40697]], [[195096, 195096], "mapped", [40702]], [[195097, 195097], "mapped", [40709]], [[195098, 195098], "mapped", [40719]], [[195099, 195099], "mapped", [40726]], [[195100, 195100], "mapped", [40763]], [[195101, 195101], "mapped", [173568]], [[195102, 196605], "disallowed"], [[196606, 196607], "disallowed"], [[196608, 262141], "disallowed"], [[262142, 262143], "disallowed"], [[262144, 327677], "disallowed"], [[327678, 327679], "disallowed"], [[327680, 393213], "disallowed"], [[393214, 393215], "disallowed"], [[393216, 458749], "disallowed"], [[458750, 458751], "disallowed"], [[458752, 524285], "disallowed"], [[524286, 524287], "disallowed"], [[524288, 589821], "disallowed"], [[589822, 589823], "disallowed"], [[589824, 655357], "disallowed"], [[655358, 655359], "disallowed"], [[655360, 720893], "disallowed"], [[720894, 720895], "disallowed"], [[720896, 786429], "disallowed"], [[786430, 786431], "disallowed"], [[786432, 851965], "disallowed"], [[851966, 851967], "disallowed"], [[851968, 917501], "disallowed"], [[917502, 917503], "disallowed"], [[917504, 917504], "disallowed"], [[917505, 917505], "disallowed"], [[917506, 917535], "disallowed"], [[917536, 917631], "disallowed"], [[917632, 917759], "disallowed"], [[917760, 917999], "ignored"], [[918e3, 983037], "disallowed"], [[983038, 983039], "disallowed"], [[983040, 1048573], "disallowed"], [[1048574, 1048575], "disallowed"], [[1048576, 1114109], "disallowed"], [[1114110, 1114111], "disallowed"]];
  }
});

// node_modules/tr46/index.js
var require_tr46 = __commonJS({
  "node_modules/tr46/index.js"(exports, module) {
    "use strict";
    var punycode = __require("punycode");
    var mappingTable = require_mappingTable();
    var PROCESSING_OPTIONS = {
      TRANSITIONAL: 0,
      NONTRANSITIONAL: 1
    };
    function normalize(str) {
      return str.split("\0").map(function(s) {
        return s.normalize("NFC");
      }).join("\0");
    }
    function findStatus(val) {
      var start = 0;
      var end = mappingTable.length - 1;
      while (start <= end) {
        var mid = Math.floor((start + end) / 2);
        var target = mappingTable[mid];
        if (target[0][0] <= val && target[0][1] >= val) {
          return target;
        } else if (target[0][0] > val) {
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }
      return null;
    }
    var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    function countSymbols(string) {
      return string.replace(regexAstralSymbols, "_").length;
    }
    function mapChars(domain_name, useSTD3, processing_option) {
      var hasError = false;
      var processed = "";
      var len = countSymbols(domain_name);
      for (var i = 0; i < len; ++i) {
        var codePoint = domain_name.codePointAt(i);
        var status = findStatus(codePoint);
        switch (status[1]) {
          case "disallowed":
            hasError = true;
            processed += String.fromCodePoint(codePoint);
            break;
          case "ignored":
            break;
          case "mapped":
            processed += String.fromCodePoint.apply(String, status[2]);
            break;
          case "deviation":
            if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
              processed += String.fromCodePoint.apply(String, status[2]);
            } else {
              processed += String.fromCodePoint(codePoint);
            }
            break;
          case "valid":
            processed += String.fromCodePoint(codePoint);
            break;
          case "disallowed_STD3_mapped":
            if (useSTD3) {
              hasError = true;
              processed += String.fromCodePoint(codePoint);
            } else {
              processed += String.fromCodePoint.apply(String, status[2]);
            }
            break;
          case "disallowed_STD3_valid":
            if (useSTD3) {
              hasError = true;
            }
            processed += String.fromCodePoint(codePoint);
            break;
        }
      }
      return {
        string: processed,
        error: hasError
      };
    }
    var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;
    function validateLabel(label, processing_option) {
      if (label.substr(0, 4) === "xn--") {
        label = punycode.toUnicode(label);
        processing_option = PROCESSING_OPTIONS.NONTRANSITIONAL;
      }
      var error = false;
      if (normalize(label) !== label || label[3] === "-" && label[4] === "-" || label[0] === "-" || label[label.length - 1] === "-" || label.indexOf(".") !== -1 || label.search(combiningMarksRegex) === 0) {
        error = true;
      }
      var len = countSymbols(label);
      for (var i = 0; i < len; ++i) {
        var status = findStatus(label.codePointAt(i));
        if (processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid" || processing === PROCESSING_OPTIONS.NONTRANSITIONAL && status[1] !== "valid" && status[1] !== "deviation") {
          error = true;
          break;
        }
      }
      return {
        label,
        error
      };
    }
    function processing(domain_name, useSTD3, processing_option) {
      var result = mapChars(domain_name, useSTD3, processing_option);
      result.string = normalize(result.string);
      var labels = result.string.split(".");
      for (var i = 0; i < labels.length; ++i) {
        try {
          var validation = validateLabel(labels[i]);
          labels[i] = validation.label;
          result.error = result.error || validation.error;
        } catch (e) {
          result.error = true;
        }
      }
      return {
        string: labels.join("."),
        error: result.error
      };
    }
    module.exports.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
      var result = processing(domain_name, useSTD3, processing_option);
      var labels = result.string.split(".");
      labels = labels.map(function(l) {
        try {
          return punycode.toASCII(l);
        } catch (e) {
          result.error = true;
          return l;
        }
      });
      if (verifyDnsLength) {
        var total = labels.slice(0, labels.length - 1).join(".").length;
        if (total.length > 253 || total.length === 0) {
          result.error = true;
        }
        for (var i = 0; i < labels.length; ++i) {
          if (labels.length > 63 || labels.length === 0) {
            result.error = true;
            break;
          }
        }
      }
      if (result.error) return null;
      return labels.join(".");
    };
    module.exports.toUnicode = function(domain_name, useSTD3) {
      var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);
      return {
        domain: result.string,
        error: result.error
      };
    };
    module.exports.PROCESSING_OPTIONS = PROCESSING_OPTIONS;
  }
});

// node_modules/whatwg-url/lib/url-state-machine.js
var require_url_state_machine = __commonJS({
  "node_modules/whatwg-url/lib/url-state-machine.js"(exports, module) {
    "use strict";
    var punycode = __require("punycode");
    var tr46 = require_tr46();
    var specialSchemes = {
      ftp: 21,
      file: null,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    };
    var failure = Symbol("failure");
    function countSymbols(str) {
      return punycode.ucs2.decode(str).length;
    }
    function at(input, idx) {
      const c = input[idx];
      return isNaN(c) ? void 0 : String.fromCodePoint(c);
    }
    function isASCIIDigit(c) {
      return c >= 48 && c <= 57;
    }
    function isASCIIAlpha(c) {
      return c >= 65 && c <= 90 || c >= 97 && c <= 122;
    }
    function isASCIIAlphanumeric(c) {
      return isASCIIAlpha(c) || isASCIIDigit(c);
    }
    function isASCIIHex(c) {
      return isASCIIDigit(c) || c >= 65 && c <= 70 || c >= 97 && c <= 102;
    }
    function isSingleDot(buffer) {
      return buffer === "." || buffer.toLowerCase() === "%2e";
    }
    function isDoubleDot(buffer) {
      buffer = buffer.toLowerCase();
      return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
    }
    function isWindowsDriveLetterCodePoints(cp1, cp2) {
      return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
    }
    function isWindowsDriveLetterString(string) {
      return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
    }
    function isNormalizedWindowsDriveLetterString(string) {
      return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
    }
    function containsForbiddenHostCodePoint(string) {
      return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
    }
    function containsForbiddenHostCodePointExcludingPercent(string) {
      return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
    }
    function isSpecialScheme(scheme) {
      return specialSchemes[scheme] !== void 0;
    }
    function isSpecial(url) {
      return isSpecialScheme(url.scheme);
    }
    function defaultPort(scheme) {
      return specialSchemes[scheme];
    }
    function percentEncode(c) {
      let hex = c.toString(16).toUpperCase();
      if (hex.length === 1) {
        hex = "0" + hex;
      }
      return "%" + hex;
    }
    function utf8PercentEncode(c) {
      const buf = new Buffer(c);
      let str = "";
      for (let i = 0; i < buf.length; ++i) {
        str += percentEncode(buf[i]);
      }
      return str;
    }
    function utf8PercentDecode(str) {
      const input = new Buffer(str);
      const output = [];
      for (let i = 0; i < input.length; ++i) {
        if (input[i] !== 37) {
          output.push(input[i]);
        } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
          output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
          i += 2;
        } else {
          output.push(input[i]);
        }
      }
      return new Buffer(output).toString();
    }
    function isC0ControlPercentEncode(c) {
      return c <= 31 || c > 126;
    }
    var extraPathPercentEncodeSet = /* @__PURE__ */ new Set([32, 34, 35, 60, 62, 63, 96, 123, 125]);
    function isPathPercentEncode(c) {
      return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
    }
    var extraUserinfoPercentEncodeSet = /* @__PURE__ */ new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
    function isUserinfoPercentEncode(c) {
      return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
    }
    function percentEncodeChar(c, encodeSetPredicate) {
      const cStr = String.fromCodePoint(c);
      if (encodeSetPredicate(c)) {
        return utf8PercentEncode(cStr);
      }
      return cStr;
    }
    function parseIPv4Number(input) {
      let R = 10;
      if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
        input = input.substring(2);
        R = 16;
      } else if (input.length >= 2 && input.charAt(0) === "0") {
        input = input.substring(1);
        R = 8;
      }
      if (input === "") {
        return 0;
      }
      const regex = R === 10 ? /[^0-9]/ : R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/;
      if (regex.test(input)) {
        return failure;
      }
      return parseInt(input, R);
    }
    function parseIPv4(input) {
      const parts = input.split(".");
      if (parts[parts.length - 1] === "") {
        if (parts.length > 1) {
          parts.pop();
        }
      }
      if (parts.length > 4) {
        return input;
      }
      const numbers = [];
      for (const part of parts) {
        if (part === "") {
          return input;
        }
        const n = parseIPv4Number(part);
        if (n === failure) {
          return input;
        }
        numbers.push(n);
      }
      for (let i = 0; i < numbers.length - 1; ++i) {
        if (numbers[i] > 255) {
          return failure;
        }
      }
      if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
        return failure;
      }
      let ipv4 = numbers.pop();
      let counter = 0;
      for (const n of numbers) {
        ipv4 += n * Math.pow(256, 3 - counter);
        ++counter;
      }
      return ipv4;
    }
    function serializeIPv4(address) {
      let output = "";
      let n = address;
      for (let i = 1; i <= 4; ++i) {
        output = String(n % 256) + output;
        if (i !== 4) {
          output = "." + output;
        }
        n = Math.floor(n / 256);
      }
      return output;
    }
    function parseIPv6(input) {
      const address = [0, 0, 0, 0, 0, 0, 0, 0];
      let pieceIndex = 0;
      let compress = null;
      let pointer = 0;
      input = punycode.ucs2.decode(input);
      if (input[pointer] === 58) {
        if (input[pointer + 1] !== 58) {
          return failure;
        }
        pointer += 2;
        ++pieceIndex;
        compress = pieceIndex;
      }
      while (pointer < input.length) {
        if (pieceIndex === 8) {
          return failure;
        }
        if (input[pointer] === 58) {
          if (compress !== null) {
            return failure;
          }
          ++pointer;
          ++pieceIndex;
          compress = pieceIndex;
          continue;
        }
        let value = 0;
        let length = 0;
        while (length < 4 && isASCIIHex(input[pointer])) {
          value = value * 16 + parseInt(at(input, pointer), 16);
          ++pointer;
          ++length;
        }
        if (input[pointer] === 46) {
          if (length === 0) {
            return failure;
          }
          pointer -= length;
          if (pieceIndex > 6) {
            return failure;
          }
          let numbersSeen = 0;
          while (input[pointer] !== void 0) {
            let ipv4Piece = null;
            if (numbersSeen > 0) {
              if (input[pointer] === 46 && numbersSeen < 4) {
                ++pointer;
              } else {
                return failure;
              }
            }
            if (!isASCIIDigit(input[pointer])) {
              return failure;
            }
            while (isASCIIDigit(input[pointer])) {
              const number = parseInt(at(input, pointer));
              if (ipv4Piece === null) {
                ipv4Piece = number;
              } else if (ipv4Piece === 0) {
                return failure;
              } else {
                ipv4Piece = ipv4Piece * 10 + number;
              }
              if (ipv4Piece > 255) {
                return failure;
              }
              ++pointer;
            }
            address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
            ++numbersSeen;
            if (numbersSeen === 2 || numbersSeen === 4) {
              ++pieceIndex;
            }
          }
          if (numbersSeen !== 4) {
            return failure;
          }
          break;
        } else if (input[pointer] === 58) {
          ++pointer;
          if (input[pointer] === void 0) {
            return failure;
          }
        } else if (input[pointer] !== void 0) {
          return failure;
        }
        address[pieceIndex] = value;
        ++pieceIndex;
      }
      if (compress !== null) {
        let swaps = pieceIndex - compress;
        pieceIndex = 7;
        while (pieceIndex !== 0 && swaps > 0) {
          const temp = address[compress + swaps - 1];
          address[compress + swaps - 1] = address[pieceIndex];
          address[pieceIndex] = temp;
          --pieceIndex;
          --swaps;
        }
      } else if (compress === null && pieceIndex !== 8) {
        return failure;
      }
      return address;
    }
    function serializeIPv6(address) {
      let output = "";
      const seqResult = findLongestZeroSequence(address);
      const compress = seqResult.idx;
      let ignore0 = false;
      for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
        if (ignore0 && address[pieceIndex] === 0) {
          continue;
        } else if (ignore0) {
          ignore0 = false;
        }
        if (compress === pieceIndex) {
          const separator = pieceIndex === 0 ? "::" : ":";
          output += separator;
          ignore0 = true;
          continue;
        }
        output += address[pieceIndex].toString(16);
        if (pieceIndex !== 7) {
          output += ":";
        }
      }
      return output;
    }
    function parseHost(input, isSpecialArg) {
      if (input[0] === "[") {
        if (input[input.length - 1] !== "]") {
          return failure;
        }
        return parseIPv6(input.substring(1, input.length - 1));
      }
      if (!isSpecialArg) {
        return parseOpaqueHost(input);
      }
      const domain = utf8PercentDecode(input);
      const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
      if (asciiDomain === null) {
        return failure;
      }
      if (containsForbiddenHostCodePoint(asciiDomain)) {
        return failure;
      }
      const ipv4Host = parseIPv4(asciiDomain);
      if (typeof ipv4Host === "number" || ipv4Host === failure) {
        return ipv4Host;
      }
      return asciiDomain;
    }
    function parseOpaqueHost(input) {
      if (containsForbiddenHostCodePointExcludingPercent(input)) {
        return failure;
      }
      let output = "";
      const decoded = punycode.ucs2.decode(input);
      for (let i = 0; i < decoded.length; ++i) {
        output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
      }
      return output;
    }
    function findLongestZeroSequence(arr2) {
      let maxIdx = null;
      let maxLen = 1;
      let currStart = null;
      let currLen = 0;
      for (let i = 0; i < arr2.length; ++i) {
        if (arr2[i] !== 0) {
          if (currLen > maxLen) {
            maxIdx = currStart;
            maxLen = currLen;
          }
          currStart = null;
          currLen = 0;
        } else {
          if (currStart === null) {
            currStart = i;
          }
          ++currLen;
        }
      }
      if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
      }
      return {
        idx: maxIdx,
        len: maxLen
      };
    }
    function serializeHost(host) {
      if (typeof host === "number") {
        return serializeIPv4(host);
      }
      if (host instanceof Array) {
        return "[" + serializeIPv6(host) + "]";
      }
      return host;
    }
    function trimControlChars(url) {
      return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
    }
    function trimTabAndNewline(url) {
      return url.replace(/\u0009|\u000A|\u000D/g, "");
    }
    function shortenPath(url) {
      const path3 = url.path;
      if (path3.length === 0) {
        return;
      }
      if (url.scheme === "file" && path3.length === 1 && isNormalizedWindowsDriveLetter(path3[0])) {
        return;
      }
      path3.pop();
    }
    function includesCredentials(url) {
      return url.username !== "" || url.password !== "";
    }
    function cannotHaveAUsernamePasswordPort(url) {
      return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
    }
    function isNormalizedWindowsDriveLetter(string) {
      return /^[A-Za-z]:$/.test(string);
    }
    function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
      this.pointer = 0;
      this.input = input;
      this.base = base || null;
      this.encodingOverride = encodingOverride || "utf-8";
      this.stateOverride = stateOverride;
      this.url = url;
      this.failure = false;
      this.parseError = false;
      if (!this.url) {
        this.url = {
          scheme: "",
          username: "",
          password: "",
          host: null,
          port: null,
          path: [],
          query: null,
          fragment: null,
          cannotBeABaseURL: false
        };
        const res2 = trimControlChars(this.input);
        if (res2 !== this.input) {
          this.parseError = true;
        }
        this.input = res2;
      }
      const res = trimTabAndNewline(this.input);
      if (res !== this.input) {
        this.parseError = true;
      }
      this.input = res;
      this.state = stateOverride || "scheme start";
      this.buffer = "";
      this.atFlag = false;
      this.arrFlag = false;
      this.passwordTokenSeenFlag = false;
      this.input = punycode.ucs2.decode(this.input);
      for (; this.pointer <= this.input.length; ++this.pointer) {
        const c = this.input[this.pointer];
        const cStr = isNaN(c) ? void 0 : String.fromCodePoint(c);
        const ret = this["parse " + this.state](c, cStr);
        if (!ret) {
          break;
        } else if (ret === failure) {
          this.failure = true;
          break;
        }
      }
    }
    URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
      if (isASCIIAlpha(c)) {
        this.buffer += cStr.toLowerCase();
        this.state = "scheme";
      } else if (!this.stateOverride) {
        this.state = "no scheme";
        --this.pointer;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
      if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
        this.buffer += cStr.toLowerCase();
      } else if (c === 58) {
        if (this.stateOverride) {
          if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
            return false;
          }
          if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
            return false;
          }
          if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
            return false;
          }
          if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
            return false;
          }
        }
        this.url.scheme = this.buffer;
        this.buffer = "";
        if (this.stateOverride) {
          return false;
        }
        if (this.url.scheme === "file") {
          if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
            this.parseError = true;
          }
          this.state = "file";
        } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
          this.state = "special relative or authority";
        } else if (isSpecial(this.url)) {
          this.state = "special authority slashes";
        } else if (this.input[this.pointer + 1] === 47) {
          this.state = "path or authority";
          ++this.pointer;
        } else {
          this.url.cannotBeABaseURL = true;
          this.url.path.push("");
          this.state = "cannot-be-a-base-URL path";
        }
      } else if (!this.stateOverride) {
        this.buffer = "";
        this.state = "no scheme";
        this.pointer = -1;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
      if (this.base === null || this.base.cannotBeABaseURL && c !== 35) {
        return failure;
      } else if (this.base.cannotBeABaseURL && c === 35) {
        this.url.scheme = this.base.scheme;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.url.cannotBeABaseURL = true;
        this.state = "fragment";
      } else if (this.base.scheme === "file") {
        this.state = "file";
        --this.pointer;
      } else {
        this.state = "relative";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
      if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
      } else {
        this.parseError = true;
        this.state = "relative";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
      if (c === 47) {
        this.state = "authority";
      } else {
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
      this.url.scheme = this.base.scheme;
      if (isNaN(c)) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
      } else if (c === 47) {
        this.state = "relative slash";
      } else if (c === 63) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.state = "fragment";
      } else if (isSpecial(this.url) && c === 92) {
        this.parseError = true;
        this.state = "relative slash";
      } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice(0, this.base.path.length - 1);
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
      if (isSpecial(this.url) && (c === 47 || c === 92)) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "special authority ignore slashes";
      } else if (c === 47) {
        this.state = "authority";
      } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
      if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
      } else {
        this.parseError = true;
        this.state = "special authority ignore slashes";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
      if (c !== 47 && c !== 92) {
        this.state = "authority";
        --this.pointer;
      } else {
        this.parseError = true;
      }
      return true;
    };
    URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
      if (c === 64) {
        this.parseError = true;
        if (this.atFlag) {
          this.buffer = "%40" + this.buffer;
        }
        this.atFlag = true;
        const len = countSymbols(this.buffer);
        for (let pointer = 0; pointer < len; ++pointer) {
          const codePoint = this.buffer.codePointAt(pointer);
          if (codePoint === 58 && !this.passwordTokenSeenFlag) {
            this.passwordTokenSeenFlag = true;
            continue;
          }
          const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
          if (this.passwordTokenSeenFlag) {
            this.url.password += encodedCodePoints;
          } else {
            this.url.username += encodedCodePoints;
          }
        }
        this.buffer = "";
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        if (this.atFlag && this.buffer === "") {
          this.parseError = true;
          return failure;
        }
        this.pointer -= countSymbols(this.buffer) + 1;
        this.buffer = "";
        this.state = "host";
      } else {
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
      if (this.stateOverride && this.url.scheme === "file") {
        --this.pointer;
        this.state = "file host";
      } else if (c === 58 && !this.arrFlag) {
        if (this.buffer === "") {
          this.parseError = true;
          return failure;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "port";
        if (this.stateOverride === "hostname") {
          return false;
        }
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        --this.pointer;
        if (isSpecial(this.url) && this.buffer === "") {
          this.parseError = true;
          return failure;
        } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
          this.parseError = true;
          return false;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "path start";
        if (this.stateOverride) {
          return false;
        }
      } else {
        if (c === 91) {
          this.arrFlag = true;
        } else if (c === 93) {
          this.arrFlag = false;
        }
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
      if (isASCIIDigit(c)) {
        this.buffer += cStr;
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92 || this.stateOverride) {
        if (this.buffer !== "") {
          const port = parseInt(this.buffer);
          if (port > Math.pow(2, 16) - 1) {
            this.parseError = true;
            return failure;
          }
          this.url.port = port === defaultPort(this.url.scheme) ? null : port;
          this.buffer = "";
        }
        if (this.stateOverride) {
          return false;
        }
        this.state = "path start";
        --this.pointer;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    var fileOtherwiseCodePoints = /* @__PURE__ */ new Set([47, 92, 63, 35]);
    URLStateMachine.prototype["parse file"] = function parseFile(c) {
      this.url.scheme = "file";
      if (c === 47 || c === 92) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "file slash";
      } else if (this.base !== null && this.base.scheme === "file") {
        if (isNaN(c)) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = this.base.query;
        } else if (c === 63) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = "";
          this.state = "query";
        } else if (c === 35) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = this.base.query;
          this.url.fragment = "";
          this.state = "fragment";
        } else {
          if (this.input.length - this.pointer - 1 === 0 || // remaining consists of 0 code points
          !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) || this.input.length - this.pointer - 1 >= 2 && // remaining has at least 2 code points
          !fileOtherwiseCodePoints.has(this.input[this.pointer + 2])) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            shortenPath(this.url);
          } else {
            this.parseError = true;
          }
          this.state = "path";
          --this.pointer;
        }
      } else {
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
      if (c === 47 || c === 92) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "file host";
      } else {
        if (this.base !== null && this.base.scheme === "file") {
          if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
            this.url.path.push(this.base.path[0]);
          } else {
            this.url.host = this.base.host;
          }
        }
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
      if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
        --this.pointer;
        if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
          this.parseError = true;
          this.state = "path";
        } else if (this.buffer === "") {
          this.url.host = "";
          if (this.stateOverride) {
            return false;
          }
          this.state = "path start";
        } else {
          let host = parseHost(this.buffer, isSpecial(this.url));
          if (host === failure) {
            return failure;
          }
          if (host === "localhost") {
            host = "";
          }
          this.url.host = host;
          if (this.stateOverride) {
            return false;
          }
          this.buffer = "";
          this.state = "path start";
        }
      } else {
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
      if (isSpecial(this.url)) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "path";
        if (c !== 47 && c !== 92) {
          --this.pointer;
        }
      } else if (!this.stateOverride && c === 63) {
        this.url.query = "";
        this.state = "query";
      } else if (!this.stateOverride && c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      } else if (c !== void 0) {
        this.state = "path";
        if (c !== 47) {
          --this.pointer;
        }
      }
      return true;
    };
    URLStateMachine.prototype["parse path"] = function parsePath(c) {
      if (isNaN(c) || c === 47 || isSpecial(this.url) && c === 92 || !this.stateOverride && (c === 63 || c === 35)) {
        if (isSpecial(this.url) && c === 92) {
          this.parseError = true;
        }
        if (isDoubleDot(this.buffer)) {
          shortenPath(this.url);
          if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
            this.url.path.push("");
          }
        } else if (isSingleDot(this.buffer) && c !== 47 && !(isSpecial(this.url) && c === 92)) {
          this.url.path.push("");
        } else if (!isSingleDot(this.buffer)) {
          if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
            if (this.url.host !== "" && this.url.host !== null) {
              this.parseError = true;
              this.url.host = "";
            }
            this.buffer = this.buffer[0] + ":";
          }
          this.url.path.push(this.buffer);
        }
        this.buffer = "";
        if (this.url.scheme === "file" && (c === void 0 || c === 63 || c === 35)) {
          while (this.url.path.length > 1 && this.url.path[0] === "") {
            this.parseError = true;
            this.url.path.shift();
          }
        }
        if (c === 63) {
          this.url.query = "";
          this.state = "query";
        }
        if (c === 35) {
          this.url.fragment = "";
          this.state = "fragment";
        }
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.buffer += percentEncodeChar(c, isPathPercentEncode);
      }
      return true;
    };
    URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
      if (c === 63) {
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      } else {
        if (!isNaN(c) && c !== 37) {
          this.parseError = true;
        }
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        if (!isNaN(c)) {
          this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
        }
      }
      return true;
    };
    URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
      if (isNaN(c) || !this.stateOverride && c === 35) {
        if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
          this.encodingOverride = "utf-8";
        }
        const buffer = new Buffer(this.buffer);
        for (let i = 0; i < buffer.length; ++i) {
          if (buffer[i] < 33 || buffer[i] > 126 || buffer[i] === 34 || buffer[i] === 35 || buffer[i] === 60 || buffer[i] === 62) {
            this.url.query += percentEncode(buffer[i]);
          } else {
            this.url.query += String.fromCodePoint(buffer[i]);
          }
        }
        this.buffer = "";
        if (c === 35) {
          this.url.fragment = "";
          this.state = "fragment";
        }
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
      if (isNaN(c)) {
      } else if (c === 0) {
        this.parseError = true;
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
      }
      return true;
    };
    function serializeURL(url, excludeFragment) {
      let output = url.scheme + ":";
      if (url.host !== null) {
        output += "//";
        if (url.username !== "" || url.password !== "") {
          output += url.username;
          if (url.password !== "") {
            output += ":" + url.password;
          }
          output += "@";
        }
        output += serializeHost(url.host);
        if (url.port !== null) {
          output += ":" + url.port;
        }
      } else if (url.host === null && url.scheme === "file") {
        output += "//";
      }
      if (url.cannotBeABaseURL) {
        output += url.path[0];
      } else {
        for (const string of url.path) {
          output += "/" + string;
        }
      }
      if (url.query !== null) {
        output += "?" + url.query;
      }
      if (!excludeFragment && url.fragment !== null) {
        output += "#" + url.fragment;
      }
      return output;
    }
    function serializeOrigin(tuple) {
      let result = tuple.scheme + "://";
      result += serializeHost(tuple.host);
      if (tuple.port !== null) {
        result += ":" + tuple.port;
      }
      return result;
    }
    module.exports.serializeURL = serializeURL;
    module.exports.serializeURLOrigin = function(url) {
      switch (url.scheme) {
        case "blob":
          try {
            return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
          } catch (e) {
            return "null";
          }
        case "ftp":
        case "gopher":
        case "http":
        case "https":
        case "ws":
        case "wss":
          return serializeOrigin({
            scheme: url.scheme,
            host: url.host,
            port: url.port
          });
        case "file":
          return "file://";
        default:
          return "null";
      }
    };
    module.exports.basicURLParse = function(input, options) {
      if (options === void 0) {
        options = {};
      }
      const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
      if (usm.failure) {
        return "failure";
      }
      return usm.url;
    };
    module.exports.setTheUsername = function(url, username) {
      url.username = "";
      const decoded = punycode.ucs2.decode(username);
      for (let i = 0; i < decoded.length; ++i) {
        url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
      }
    };
    module.exports.setThePassword = function(url, password) {
      url.password = "";
      const decoded = punycode.ucs2.decode(password);
      for (let i = 0; i < decoded.length; ++i) {
        url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
      }
    };
    module.exports.serializeHost = serializeHost;
    module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
    module.exports.serializeInteger = function(integer) {
      return String(integer);
    };
    module.exports.parseURL = function(input, options) {
      if (options === void 0) {
        options = {};
      }
      return module.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
    };
  }
});

// node_modules/whatwg-url/lib/URL-impl.js
var require_URL_impl = __commonJS({
  "node_modules/whatwg-url/lib/URL-impl.js"(exports) {
    "use strict";
    var usm = require_url_state_machine();
    exports.implementation = class URLImpl {
      constructor(constructorArgs) {
        const url = constructorArgs[0];
        const base = constructorArgs[1];
        let parsedBase = null;
        if (base !== void 0) {
          parsedBase = usm.basicURLParse(base);
          if (parsedBase === "failure") {
            throw new TypeError("Invalid base URL");
          }
        }
        const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
        if (parsedURL === "failure") {
          throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
      }
      get href() {
        return usm.serializeURL(this._url);
      }
      set href(v) {
        const parsedURL = usm.basicURLParse(v);
        if (parsedURL === "failure") {
          throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
      }
      get origin() {
        return usm.serializeURLOrigin(this._url);
      }
      get protocol() {
        return this._url.scheme + ":";
      }
      set protocol(v) {
        usm.basicURLParse(v + ":", { url: this._url, stateOverride: "scheme start" });
      }
      get username() {
        return this._url.username;
      }
      set username(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        usm.setTheUsername(this._url, v);
      }
      get password() {
        return this._url.password;
      }
      set password(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        usm.setThePassword(this._url, v);
      }
      get host() {
        const url = this._url;
        if (url.host === null) {
          return "";
        }
        if (url.port === null) {
          return usm.serializeHost(url.host);
        }
        return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
      }
      set host(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
      }
      get hostname() {
        if (this._url.host === null) {
          return "";
        }
        return usm.serializeHost(this._url.host);
      }
      set hostname(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
      }
      get port() {
        if (this._url.port === null) {
          return "";
        }
        return usm.serializeInteger(this._url.port);
      }
      set port(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        if (v === "") {
          this._url.port = null;
        } else {
          usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
        }
      }
      get pathname() {
        if (this._url.cannotBeABaseURL) {
          return this._url.path[0];
        }
        if (this._url.path.length === 0) {
          return "";
        }
        return "/" + this._url.path.join("/");
      }
      set pathname(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        this._url.path = [];
        usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
      }
      get search() {
        if (this._url.query === null || this._url.query === "") {
          return "";
        }
        return "?" + this._url.query;
      }
      set search(v) {
        const url = this._url;
        if (v === "") {
          url.query = null;
          return;
        }
        const input = v[0] === "?" ? v.substring(1) : v;
        url.query = "";
        usm.basicURLParse(input, { url, stateOverride: "query" });
      }
      get hash() {
        if (this._url.fragment === null || this._url.fragment === "") {
          return "";
        }
        return "#" + this._url.fragment;
      }
      set hash(v) {
        if (v === "") {
          this._url.fragment = null;
          return;
        }
        const input = v[0] === "#" ? v.substring(1) : v;
        this._url.fragment = "";
        usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
      }
      toJSON() {
        return this.href;
      }
    };
  }
});

// node_modules/whatwg-url/lib/URL.js
var require_URL = __commonJS({
  "node_modules/whatwg-url/lib/URL.js"(exports, module) {
    "use strict";
    var conversions = require_lib();
    var utils = require_utils();
    var Impl = require_URL_impl();
    var impl = utils.implSymbol;
    function URL(url) {
      if (!this || this[impl] || !(this instanceof URL)) {
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      for (let i = 0; i < arguments.length && i < 2; ++i) {
        args[i] = arguments[i];
      }
      args[0] = conversions["USVString"](args[0]);
      if (args[1] !== void 0) {
        args[1] = conversions["USVString"](args[1]);
      }
      module.exports.setup(this, args);
    }
    URL.prototype.toJSON = function toJSON() {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length && i < 0; ++i) {
        args[i] = arguments[i];
      }
      return this[impl].toJSON.apply(this[impl], args);
    };
    Object.defineProperty(URL.prototype, "href", {
      get() {
        return this[impl].href;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].href = V;
      },
      enumerable: true,
      configurable: true
    });
    URL.prototype.toString = function() {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this.href;
    };
    Object.defineProperty(URL.prototype, "origin", {
      get() {
        return this[impl].origin;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "protocol", {
      get() {
        return this[impl].protocol;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].protocol = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "username", {
      get() {
        return this[impl].username;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].username = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "password", {
      get() {
        return this[impl].password;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].password = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "host", {
      get() {
        return this[impl].host;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].host = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "hostname", {
      get() {
        return this[impl].hostname;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].hostname = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "port", {
      get() {
        return this[impl].port;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].port = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "pathname", {
      get() {
        return this[impl].pathname;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].pathname = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "search", {
      get() {
        return this[impl].search;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].search = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "hash", {
      get() {
        return this[impl].hash;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].hash = V;
      },
      enumerable: true,
      configurable: true
    });
    module.exports = {
      is(obj) {
        return !!obj && obj[impl] instanceof Impl.implementation;
      },
      create(constructorArgs, privateData) {
        let obj = Object.create(URL.prototype);
        this.setup(obj, constructorArgs, privateData);
        return obj;
      },
      setup(obj, constructorArgs, privateData) {
        if (!privateData) privateData = {};
        privateData.wrapper = obj;
        obj[impl] = new Impl.implementation(constructorArgs, privateData);
        obj[impl][utils.wrapperSymbol] = obj;
      },
      interface: URL,
      expose: {
        Window: { URL },
        Worker: { URL }
      }
    };
  }
});

// node_modules/whatwg-url/lib/public-api.js
var require_public_api = __commonJS({
  "node_modules/whatwg-url/lib/public-api.js"(exports) {
    "use strict";
    exports.URL = require_URL().interface;
    exports.serializeURL = require_url_state_machine().serializeURL;
    exports.serializeURLOrigin = require_url_state_machine().serializeURLOrigin;
    exports.basicURLParse = require_url_state_machine().basicURLParse;
    exports.setTheUsername = require_url_state_machine().setTheUsername;
    exports.setThePassword = require_url_state_machine().setThePassword;
    exports.serializeHost = require_url_state_machine().serializeHost;
    exports.serializeInteger = require_url_state_machine().serializeInteger;
    exports.parseURL = require_url_state_machine().parseURL;
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream = _interopDefault(__require("stream"));
    var http = _interopDefault(__require("http"));
    var Url = _interopDefault(__require("url"));
    var whatwgUrl = _interopDefault(require_public_api());
    var https = _interopDefault(__require("https"));
    var zlib = _interopDefault(__require("zlib"));
    var Readable = Stream.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob = class _Blob {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof _Blob) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== void 0 && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new _Blob([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = "FetchError";
    var convert;
    try {
      convert = __require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS = Symbol("Body internals");
    var PassThrough = Stream.PassThrough;
    function Body(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body)) ;
      else if (Buffer.isBuffer(body)) ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream) ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream) {
        body.on("error", function(err) {
          const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS].error = error;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[INTERNALS].body;
      },
      get bodyUsed() {
        return this[INTERNALS].disturbed;
      },
      /**
       * Decode response as ArrayBuffer
       *
       * @return  Promise
       */
      arrayBuffer() {
        return consumeBody.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      /**
       * Return raw response as Blob
       *
       * @return Promise
       */
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody.call(this).then(function(buf) {
          return Object.assign(
            // Prevent copying
            new Blob([], {
              type: ct.toLowerCase()
            }),
            {
              [BUFFER]: buf
            }
          );
        });
      },
      /**
       * Decode response as json
       *
       * @return  Promise
       */
      json() {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      /**
       * Decode response as text
       *
       * @return  Promise
       */
      text() {
        return consumeBody.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      /**
       * Decode response as buffer (non-spec api)
       *
       * @return  Promise
       */
      buffer() {
        return consumeBody.call(this);
      },
      /**
       * Decode response as text, while automatically detecting the encoding and
       * trying to decode to UTF-8 (non-spec api)
       *
       * @return  Promise
       */
      textConverted() {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody() {
      var _this4 = this;
      if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS].disturbed = true;
      if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
      }
      let body = this.body;
      if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
      }
      if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body.Promise(function(resolve, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone(instance2) {
      let p1, p2;
      let body = instance2.body;
      if (instance2.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream && typeof body.getBoundary !== "function") {
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        instance2[INTERNALS].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes(instance2) {
      const body = instance2.body;
      if (body === null) {
        return 0;
      } else if (isBlob(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
        body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(dest, instance2) {
      const body = instance2.body;
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers = class _Headers {
      /**
       * Headers class
       *
       * @param   Object  headers  Response headers
       * @return  Void
       */
      constructor() {
        let init2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = /* @__PURE__ */ Object.create(null);
        if (init2 instanceof _Headers) {
          const rawHeaders = init2.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init2 == null) ;
        else if (typeof init2 === "object") {
          const method = init2[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init2) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init2)) {
              const value = init2[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      /**
       * Return combined header value given name
       *
       * @param   String  name  Header name
       * @return  Mixed
       */
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      /**
       * Iterate over all headers
       *
       * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
       * @param   Boolean   thisArg   `this` context for callback function
       * @return  Void
       */
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      /**
       * Overwrite header values given name
       *
       * @param   String  name   Header name
       * @param   String  value  Header value
       * @return  Void
       */
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      /**
       * Append a value onto existing header
       *
       * @param   String  name   Header name
       * @param   String  value  Header value
       * @return  Void
       */
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      /**
       * Check for header name existence
       *
       * @param   String   name  Header name
       * @return  Boolean
       */
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      /**
       * Delete all header values given name
       *
       * @param   String  name  Header name
       * @return  Void
       */
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      /**
       * Return raw headers (non-spec api)
       *
       * @return  Object
       */
      raw() {
        return this[MAP];
      }
      /**
       * Get an iterator on keys.
       *
       * @return  Iterator
       */
      keys() {
        return createHeadersIterator(this, "key");
      }
      /**
       * Get an iterator on values.
       *
       * @return  Iterator
       */
      values() {
        return createHeadersIterator(this, "value");
      }
      /**
       * Get an iterator on entries.
       *
       * This is the default iterator of the Headers object.
       *
       * @return  Iterator
       */
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index + 1;
        return {
          value: values[index],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$1 = Symbol("Response internals");
    var STATUS_CODES = http.STATUS_CODES;
    var Response = class _Response {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      /**
       * Convenience property representing if the request ended normally
       */
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      /**
       * Clone this response
       *
       * @return  Response
       */
      clone() {
        return new _Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$2 = Symbol("Request internals");
    var URL = Url.URL || whatwgUrl.URL;
    var parse_url = Url.parse;
    var format_url = Url.format;
    function parseURL(urlStr) {
      if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
        urlStr = new URL(urlStr).toString();
      }
      return parse_url(urlStr);
    }
    var streamDestructionSupported = "destroy" in Stream.Readable.prototype;
    function isRequest(input) {
      return typeof input === "object" && typeof input[INTERNALS$2] === "object";
    }
    function isAbortSignal(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request = class _Request {
      constructor(input) {
        let init2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest(input)) {
          if (input && input.href) {
            parsedURL = parseURL(input.href);
          } else {
            parsedURL = parseURL(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parseURL(input.url);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init2.body != null ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
          timeout: init2.timeout || input.timeout || 0,
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) signal = init2.signal;
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$2] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow !== void 0 ? init2.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init2.compress !== void 0 ? init2.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$2].method;
      }
      get url() {
        return format_url(this[INTERNALS$2].parsedURL);
      }
      get headers() {
        return this[INTERNALS$2].headers;
      }
      get redirect() {
        return this[INTERNALS$2].redirect;
      }
      get signal() {
        return this[INTERNALS$2].signal;
      }
      /**
       * Clone this request
       *
       * @return  Request
       */
      clone() {
        return new _Request(this);
      }
    };
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(request3) {
      const parsedURL = request3[INTERNALS$2].parsedURL;
      const headers = new Headers(request3[INTERNALS$2].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request3.signal && request3.body instanceof Stream.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request3.body == null && /^(POST|PUT)$/i.test(request3.method)) {
        contentLengthValue = "0";
      }
      if (request3.body != null) {
        const totalBytes = getTotalBytes(request3);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request3.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request3.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      return Object.assign({}, parsedURL, {
        method: request3.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = "AbortError";
    var URL$1 = Url.URL || whatwgUrl.URL;
    var PassThrough$1 = Stream.PassThrough;
    var isDomainOrSubdomain = function isDomainOrSubdomain2(destination, original) {
      const orig = new URL$1(original).hostname;
      const dest = new URL$1(destination).hostname;
      return orig === dest || orig[orig.length - dest.length - 1] === "." && orig.endsWith(dest);
    };
    var isSameProtocol = function isSameProtocol2(destination, original) {
      const orig = new URL$1(original).protocol;
      const dest = new URL$1(destination).protocol;
      return orig === dest;
    };
    function fetch2(url, opts) {
      if (!fetch2.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body.Promise = fetch2.Promise;
      return new fetch2.Promise(function(resolve, reject) {
        const request3 = new Request(url, opts);
        const options = getNodeRequestOptions(request3);
        const send = (options.protocol === "https:" ? https : http).request;
        const signal = request3.signal;
        let response = null;
        const abort = function abort2() {
          let error = new AbortError("The user aborted a request.");
          reject(error);
          if (request3.body && request3.body instanceof Stream.Readable) {
            destroyStream(request3.body, error);
          }
          if (!response || !response.body) return;
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal) signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request3.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError(`network timeout at: ${request3.url}`, "request-timeout"));
              finalize();
            }, request3.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError(`request to ${request3.url} failed, reason: ${err.message}`, "system", err));
          if (response && response.body) {
            destroyStream(response.body, err);
          }
          finalize();
        });
        fixResponseChunkedTransferBadEnding(req, function(err) {
          if (signal && signal.aborted) {
            return;
          }
          if (response && response.body) {
            destroyStream(response.body, err);
          }
        });
        if (parseInt(process.version.substring(1)) < 14) {
          req.on("socket", function(s) {
            s.addListener("close", function(hadError) {
              const hasDataListener = s.listenerCount("data") > 0;
              if (response && hasDataListener && !hadError && !(signal && signal.aborted)) {
                const err = new Error("Premature close");
                err.code = "ERR_STREAM_PREMATURE_CLOSE";
                response.body.emit("error", err);
              }
            });
          });
        }
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch2.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            let locationURL = null;
            try {
              locationURL = location === null ? null : new URL$1(location, request3.url).toString();
            } catch (err) {
              if (request3.redirect !== "manual") {
                reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
                finalize();
                return;
              }
            }
            switch (request3.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request3.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request3.counter >= request3.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request3.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers(request3.headers),
                  follow: request3.follow,
                  counter: request3.counter + 1,
                  agent: request3.agent,
                  compress: request3.compress,
                  method: request3.method,
                  body: request3.body,
                  signal: request3.signal,
                  timeout: request3.timeout,
                  size: request3.size
                };
                if (!isDomainOrSubdomain(request3.url, locationURL) || !isSameProtocol(request3.url, locationURL)) {
                  for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                    requestOpts.headers.delete(name);
                  }
                }
                if (res.statusCode !== 303 && request3.body && getTotalBytes(request3) === null) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request3.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve(fetch2(new Request(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal) signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request3.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request3.size,
            timeout: request3.timeout,
            counter: request3.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request3.compress || request3.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib.createGunzip(zlibOptions));
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib.createInflate());
              } else {
                body = body.pipe(zlib.createInflateRaw());
              }
              response = new Response(body, response_options);
              resolve(response);
            });
            raw.on("end", function() {
              if (!response) {
                response = new Response(body, response_options);
                resolve(response);
              }
            });
            return;
          }
          if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
            body = body.pipe(zlib.createBrotliDecompress());
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          response = new Response(body, response_options);
          resolve(response);
        });
        writeToStream(req, request3);
      });
    }
    function fixResponseChunkedTransferBadEnding(request3, errorCallback) {
      let socket;
      request3.on("socket", function(s) {
        socket = s;
      });
      request3.on("response", function(response) {
        const headers = response.headers;
        if (headers["transfer-encoding"] === "chunked" && !headers["content-length"]) {
          response.once("close", function(hadError) {
            const hasDataListener = socket && socket.listenerCount("data") > 0;
            if (hasDataListener && !hadError) {
              const err = new Error("Premature close");
              err.code = "ERR_STREAM_PREMATURE_CLOSE";
              errorCallback(err);
            }
          });
        }
      });
    }
    function destroyStream(stream, err) {
      if (stream.destroy) {
        stream.destroy(err);
      } else {
        stream.emit("error", err);
        stream.end();
      }
    }
    fetch2.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch2.Promise = global.Promise;
    module.exports = exports = fetch2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports;
    exports.Headers = Headers;
    exports.Request = Request;
    exports.Response = Response;
    exports.FetchError = FetchError;
    exports.AbortError = AbortError;
  }
});

// node_modules/cross-fetch/dist/node-ponyfill.js
var require_node_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/node-ponyfill.js"(exports, module) {
    var nodeFetch = require_lib2();
    var realFetch = nodeFetch.default || nodeFetch;
    var fetch2 = function(url, options) {
      if (/^\/\//.test(url)) {
        url = "https:" + url;
      }
      return realFetch.call(this, url, options);
    };
    fetch2.ponyfill = true;
    module.exports = exports = fetch2;
    exports.fetch = fetch2;
    exports.Headers = nodeFetch.Headers;
    exports.Request = nodeFetch.Request;
    exports.Response = nodeFetch.Response;
    exports.default = fetch2;
  }
});

// scripts/diagramCheckRegression.ts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path2 from "node:path";

// node_modules/i18next/dist/esm/i18next.js
var isString = (obj) => typeof obj === "string";
var defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
var makeString = (object) => {
  if (object == null) return "";
  return "" + object;
};
var copy = (a, s, t2) => {
  a.forEach((m) => {
    if (s[m]) t2[m] = s[m];
  });
};
var lastOfPathSeparatorRegExp = /###/g;
var cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
var canNotTraverseDeeper = (object) => !object || isString(object);
var getLastOfPath = (object, path3, Empty) => {
  const stack = !isString(path3) ? path3 : path3.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
var setPath = (object, path3, newValue) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path3, Object);
  if (obj !== void 0 || path3.length === 1) {
    obj[k] = newValue;
    return;
  }
  let e = path3[path3.length - 1];
  let p = path3.slice(0, path3.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === void 0 && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
var pushPath = (object, path3, newValue, concat) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path3, Object);
  obj[k] = obj[k] || [];
  obj[k].push(newValue);
};
var getPath = (object, path3) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path3);
  if (!obj) return void 0;
  if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
  return obj[k];
};
var getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
var deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
var regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
var escape = (data) => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
};
var RegExpCache = class {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
};
var chars = [" ", ",", "?", "!", ";"];
var looksLikeObjectPathRegExpCache = new RegExpCache(20);
var looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
var deepFind = function(obj, path3) {
  let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!obj) return void 0;
  if (obj[path3]) {
    if (!Object.prototype.hasOwnProperty.call(obj, path3)) return void 0;
    return obj[path3];
  }
  const tokens = path3.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
var getCleanedCode = (code) => code?.replace("_", "-");
var consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    console?.[type]?.apply?.(console, args);
  }
};
var Logger = class _Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, "log", "", true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, "warn", "", true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, "error", "");
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new _Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new _Logger(this.logger, options);
  }
};
var baseLogger = new Logger();
var EventEmitter = class {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach((_ref) => {
        let [observer, numTimesAdded] = _ref;
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach((_ref2) => {
        let [observer, numTimesAdded] = _ref2;
        for (let i = 0; i < numTimesAdded; i++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
};
var ResourceStore = class extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path3;
    if (lng.indexOf(".") > -1) {
      path3 = lng.split(".");
    } else {
      path3 = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path3.push(...key);
        } else if (isString(key) && keySeparator) {
          path3.push(...key.split(keySeparator));
        } else {
          path3.push(key);
        }
      }
    }
    const result = getPath(this.data, path3);
    if (!result && !ns && !key && lng.indexOf(".") > -1) {
      lng = path3[0];
      ns = path3[1];
      key = path3.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
  }
  addResource(lng, ns, key, value) {
    let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path3 = [lng, ns];
    if (key) path3 = path3.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path3 = lng.split(".");
      value = ns;
      ns = path3[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path3, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources2) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: false
    };
    for (const m in resources2) {
      if (isString(resources2[m]) || Array.isArray(resources2[m])) this.addResource(lng, ns, m, resources2[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources2);
  }
  addResourceBundle(lng, ns, resources2, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: false,
      skipCopy: false
    };
    let path3 = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path3 = lng.split(".");
      deep = resources2;
      resources2 = ns;
      ns = path3[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path3) || {};
    if (!options.skipCopy) resources2 = JSON.parse(JSON.stringify(resources2));
    if (deep) {
      deepExtend(pack, resources2, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources2
      };
    }
    setPath(this.data, path3, pack);
    if (!options.silent) this.emit("added", lng, ns, resources2);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
};
var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      value = this.processors[processor]?.process(value, key, options, translator) ?? value;
    });
    return value;
  }
};
var checkedLoadedFor = {};
var shouldHandleAsObject = (res) => !isString(res) && typeof res !== "boolean" && typeof res !== "number";
var Translator = class _Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (key == null) {
      return false;
    }
    const resolved = this.resolve(key, options);
    return resolved?.res !== void 0;
  }
  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let namespaces = options.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, options, lastKey) {
    if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === "object") options = {
      ...options
    };
    if (!options) options = {};
    if (keys == null) return "";
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng?.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(options)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(options)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, options);
    let res = resolved?.res;
    const resUsedKey = resolved?.usedKey || key;
    const resExactUsedKey = resolved?.exactUsedKey || key;
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const needsPluralHandling = options.count !== void 0 && !isString(options.count);
    const hasDefaultValue = _Translator.hasDefaultValue(options);
    const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
    const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
      ordinal: false
    }) : "";
    const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0;
    const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
    let resForObjHndl = res;
    if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
      resForObjHndl = defaultValue;
    }
    const handleAsObject = shouldHandleAsObject(resForObjHndl);
    const resType = Object.prototype.toString.apply(resForObjHndl);
    if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(resForObjHndl))) {
      if (!options.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
          ...options,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(options);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(resForObjHndl);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in resForObjHndl) {
          if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            if (hasDefaultValue && !res) {
              copy2[m] = this.translate(deepKey, {
                ...options,
                defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            } else {
              copy2[m] = this.translate(deepKey, {
                ...options,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            }
            if (copy2[m] === deepKey) copy2[m] = resForObjHndl[m];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...options,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
          } else if (this.backendConnector?.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
          }
          this.emit("missingKey", l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              const suffixes = this.pluralResolver.getSuffixes(language, options);
              if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, options, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(options);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, options, resolved, lastKey) {
    var _this = this;
    if (this.i18nFormat?.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...options
      }, options.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!options.skipInterpolation) {
      if (options.interpolation) this.interpolator.init({
        ...options,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...options.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = options.replace && !isString(options.replace) ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved.usedLng, options);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) options.nest = false;
      }
      if (!options.lng && resolved && resolved.res) options.lng = this.language || resolved.usedLng;
      if (options.nest !== false) res = this.interpolator.nest(res, function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (lastKey?.[0] === args[0] && !options.context) {
          _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return _this.translate(...args, key);
      }, options);
      if (options.interpolation) this.interpolator.reset();
    }
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res != null && postProcessorNames?.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(options)
        },
        ...options
      } : options, this);
    }
    return res;
  }
  resolve(keys) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    keys.forEach((k) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0;
      const needsContextHandling = options.context !== void 0 && (isString(options.context) || typeof options.context === "number") && options.context !== "";
      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat?.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
};
var LanguageUtil = class {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return null;
    const p = code.split("-");
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return code;
    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.indexOf("-") > -1) {
      let formattedCode;
      try {
        formattedCode = Intl.getCanonicalLocales(code)[0];
      } catch (e) {
      }
      if (formattedCode && this.options.lowerCaseLng) {
        formattedCode = formattedCode.toLowerCase();
      }
      if (formattedCode) return formattedCode;
      if (this.options.lowerCaseLng) {
        return code.toLowerCase();
      }
      return code;
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
          if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
};
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
var dummyRule = {
  select: (count) => count === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
var PluralResolver = class {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
    const type = options.ordinal ? "ordinal" : "cardinal";
    const cacheKey = JSON.stringify({
      cleanedCode,
      type
    });
    if (cacheKey in this.pluralRulesCache) {
      return this.pluralRulesCache[cacheKey];
    }
    let rule;
    try {
      rule = new Intl.PluralRules(cleanedCode, {
        type
      });
    } catch (err) {
      if (!Intl) {
        this.logger.error("No Intl support, please use an Intl polyfill!");
        return dummyRule;
      }
      if (!code.match(/-|_/)) return dummyRule;
      const lngPart = this.languageUtils.getLanguagePartFromCode(code);
      rule = this.getRule(lngPart, options);
    }
    this.pluralRulesCache[cacheKey] = rule;
    return rule;
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    return rule?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    if (!rule) return [];
    return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
  }
  getSuffix(code, count) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return this.getSuffix("dev", count, options);
  }
};
var deepFindWithDefaults = function(data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
  let path3 = getPathWithDefaults(data, defaultData, key);
  if (!path3 && ignoreJSONStructure && isString(key)) {
    path3 = deepFind(data, key, keySeparator);
    if (path3 === void 0) path3 = deepFind(defaultData, key, keySeparator);
  }
  return path3;
};
var regexSafe = (val) => val.replace(/\$/g, "$$$$");
var Interpolator = class {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options?.interpolation?.format || ((value) => value);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp?.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path3 = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path3, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path3;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r = match[1].split(this.formatSeparator).map((elem) => elem.trim());
        match[1] = r.shift();
        formatters = r;
        doReduce = true;
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (doReduce) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
};
var parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p = formatStr.split("(");
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
var createCachedFormatter = (fn) => {
  const cache = {};
  return (val, lng, options) => {
    let optForCache = options;
    if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [options.interpolationkey]: void 0
      };
    }
    const key = lng + JSON.stringify(optForCache);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
};
var Formatter = class {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = options.interpolation.formatSeparator || ",";
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f) => f.indexOf(")") > -1)) {
      const lastIndex = formats.findIndex((f) => f.indexOf(")") > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options?.formatParams?.[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
};
var removePending = (q, name) => {
  if (q.pending[name] !== void 0) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
var Connector = class extends EventEmitter {
  constructor(backend, store, services) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    this.backend?.init?.(services, options.backend, options);
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q) => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach((l) => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach((n) => {
              if (loaded[l][n] === void 0) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q) => !q.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : void 0;
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === "function") {
          r.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend?.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === "function") {
            r.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
};
var get = () => ({
  debug: false,
  initAsync: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: (value) => value,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  }
});
var transformOptions = (options) => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs?.indexOf?.("cimode") < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  if (typeof options.initImmediate === "boolean") options.initAsync = options.initImmediate;
  return options;
};
var noop = () => {
};
var bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
var I18n = class _I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initAsync) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options.defaultNS == null && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    this.options.interpolation = {
      ...defOpts.interpolation,
      ...this.options.interpolation
    };
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", function(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", function(event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event, ...args);
      });
      this.modules.external.forEach((m) => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = function() {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = function() {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t2) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err, t2);
      };
      if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initAsync) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    let usedCallback = callback;
    const usedLng = isString(language) ? language : this.language;
    if (typeof language === "function") usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (l === "cimode") return;
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l) => append(l));
      } else {
        append(usedLng);
      }
      this.options.preload?.forEach?.((l) => append(l));
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module.type === "backend") {
      this.modules.backend = module;
    }
    if (module.type === "logger" || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === "languageDetector") {
      this.modules.languageDetector = module;
    }
    if (module.type === "i18nFormat") {
      this.modules.i18nFormat = module;
    }
    if (module.type === "postProcessor") {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === "formatter") {
      this.modules.formatter = module;
    }
    if (module.type === "3rdParty") {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (["cimode", "dev"].indexOf(l) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l) => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        setLngProps(l);
        this.translator.changeLanguage(l);
        this.isLanguageChangingTo = void 0;
        this.emit("languageChanged", l);
        this.logger.log("languageChanged", l);
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve(function() {
        return _this2.t(...arguments);
      });
      if (callback) callback(err, function() {
        return _this2.t(...arguments);
      });
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const l = isString(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        this.services.languageDetector?.cacheUserLanguage?.(l);
      }
      this.loadResources(l, (err) => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function(key, opts) {
      let options;
      if (typeof opts !== "object") {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        options = {
          ...opts
        };
      }
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || ".";
      let resultKey;
      if (options.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k) => `${options.keyPrefix}${keySeparator}${k}`);
      } else {
        resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, options);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.translator?.translate(...args);
  }
  exists() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return this.translator?.exists(...args);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach((n) => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    return new _I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new _I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m) => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
        prev[l] = {
          ...this.store.data[l]
        };
        return Object.keys(prev[l]).reduce((acc, n) => {
          acc[n] = {
            ...prev[l][n]
          };
          return acc;
        }, {});
      }, {});
      clone.store = new ResourceStore(clonedData, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", function(event) {
      for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
};
var instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
var createInstance = instance.createInstance;
var dir = instance.dir;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;

// node_modules/react-i18next/dist/es/Trans.js
var import_react3 = __toESM(require_react(), 1);

// node_modules/react-i18next/dist/es/TransWithoutContext.js
var import_react = __toESM(require_react(), 1);
var import_html_parse_stringify = __toESM(require_html_parse_stringify(), 1);

// node_modules/react-i18next/dist/es/unescape.js
var matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
var htmlEntities = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "\xA9",
  "&#169;": "\xA9",
  "&reg;": "\xAE",
  "&#174;": "\xAE",
  "&hellip;": "\u2026",
  "&#8230;": "\u2026",
  "&#x2F;": "/",
  "&#47;": "/"
};
var unescapeHtmlEntity = (m) => htmlEntities[m];
var unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);

// node_modules/react-i18next/dist/es/defaults.js
var defaultOptions = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: true,
  unescape
};
var setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};

// node_modules/react-i18next/dist/es/i18nInstance.js
var i18nInstance;
var setI18n = (instance2) => {
  i18nInstance = instance2;
};

// node_modules/react-i18next/dist/es/context.js
var import_react2 = __toESM(require_react(), 1);

// node_modules/react-i18next/dist/es/initReactI18next.js
var initReactI18next = {
  type: "3rdParty",
  init(instance2) {
    setDefaults(instance2.options.react);
    setI18n(instance2);
  }
};

// node_modules/react-i18next/dist/es/context.js
var I18nContext = (0, import_react2.createContext)();

// node_modules/react-i18next/dist/es/useTranslation.js
var import_react4 = __toESM(require_react(), 1);

// node_modules/react-i18next/dist/es/withTranslation.js
var import_react5 = __toESM(require_react(), 1);

// node_modules/react-i18next/dist/es/I18nextProvider.js
var import_react6 = __toESM(require_react(), 1);

// node_modules/react-i18next/dist/es/withSSR.js
var import_react8 = __toESM(require_react(), 1);

// node_modules/react-i18next/dist/es/useSSR.js
var import_react7 = __toESM(require_react(), 1);

// node_modules/i18next-http-backend/esm/utils.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
var arr = [];
var each = arr.forEach;
var slice = arr.slice;
function hasXMLHttpRequest() {
  return typeof XMLHttpRequest === "function" || (typeof XMLHttpRequest === "undefined" ? "undefined" : _typeof(XMLHttpRequest)) === "object";
}
function isPromise(maybePromise) {
  return !!maybePromise && typeof maybePromise.then === "function";
}
function makePromise(maybePromise) {
  if (isPromise(maybePromise)) {
    return maybePromise;
  }
  return Promise.resolve(maybePromise);
}

// node_modules/i18next-http-backend/esm/request.js
function ownKeys(e, r) {
  var t2 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t2.push.apply(t2, o);
  }
  return t2;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t2 = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t2), true).forEach(function(r2) {
      _defineProperty(e, r2, t2[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t2) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t2, enumerable: true, configurable: true, writable: true }) : e[r] = t2, e;
}
function _toPropertyKey(t2) {
  var i = _toPrimitive(t2, "string");
  return "symbol" == _typeof2(i) ? i : i + "";
}
function _toPrimitive(t2, r) {
  if ("object" != _typeof2(t2) || !t2) return t2;
  var e = t2[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t2, r || "default");
    if ("object" != _typeof2(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t2);
}
function _typeof2(o) {
  "@babel/helpers - typeof";
  return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof2(o);
}
var fetchApi = typeof fetch === "function" ? fetch : void 0;
if (typeof global !== "undefined" && global.fetch) {
  fetchApi = global.fetch;
} else if (typeof window !== "undefined" && window.fetch) {
  fetchApi = window.fetch;
}
var XmlHttpRequestApi;
if (hasXMLHttpRequest()) {
  if (typeof global !== "undefined" && global.XMLHttpRequest) {
    XmlHttpRequestApi = global.XMLHttpRequest;
  } else if (typeof window !== "undefined" && window.XMLHttpRequest) {
    XmlHttpRequestApi = window.XMLHttpRequest;
  }
}
var ActiveXObjectApi;
if (typeof ActiveXObject === "function") {
  if (typeof global !== "undefined" && global.ActiveXObject) {
    ActiveXObjectApi = global.ActiveXObject;
  } else if (typeof window !== "undefined" && window.ActiveXObject) {
    ActiveXObjectApi = window.ActiveXObject;
  }
}
if (typeof fetchApi !== "function") fetchApi = void 0;
if (!fetchApi && !XmlHttpRequestApi && !ActiveXObjectApi) {
  try {
    Promise.resolve().then(() => __toESM(require_node_ponyfill(), 1)).then(function(mod) {
      fetchApi = mod.default;
    }).catch(function() {
    });
  } catch (e) {
  }
}
var addQueryString = function addQueryString2(url, params) {
  if (params && _typeof2(params) === "object") {
    var queryString = "";
    for (var paramName in params) {
      queryString += "&" + encodeURIComponent(paramName) + "=" + encodeURIComponent(params[paramName]);
    }
    if (!queryString) return url;
    url = url + (url.indexOf("?") !== -1 ? "&" : "?") + queryString.slice(1);
  }
  return url;
};
var fetchIt = function fetchIt2(url, fetchOptions, callback, altFetch) {
  var resolver = function resolver2(response) {
    if (!response.ok) return callback(response.statusText || "Error", {
      status: response.status
    });
    response.text().then(function(data) {
      callback(null, {
        status: response.status,
        data
      });
    }).catch(callback);
  };
  if (altFetch) {
    var altResponse = altFetch(url, fetchOptions);
    if (altResponse instanceof Promise) {
      altResponse.then(resolver).catch(callback);
      return;
    }
  }
  if (typeof fetch === "function") {
    fetch(url, fetchOptions).then(resolver).catch(callback);
  } else {
    fetchApi(url, fetchOptions).then(resolver).catch(callback);
  }
};
var omitFetchOptions = false;
var requestWithFetch = function requestWithFetch2(options, url, payload, callback) {
  if (options.queryStringParams) {
    url = addQueryString(url, options.queryStringParams);
  }
  var headers = _objectSpread({}, typeof options.customHeaders === "function" ? options.customHeaders() : options.customHeaders);
  if (typeof window === "undefined" && typeof global !== "undefined" && typeof global.process !== "undefined" && global.process.versions && global.process.versions.node) {
    headers["User-Agent"] = "i18next-http-backend (node/".concat(global.process.version, "; ").concat(global.process.platform, " ").concat(global.process.arch, ")");
  }
  if (payload) headers["Content-Type"] = "application/json";
  var reqOptions = typeof options.requestOptions === "function" ? options.requestOptions(payload) : options.requestOptions;
  var fetchOptions = _objectSpread({
    method: payload ? "POST" : "GET",
    body: payload ? options.stringify(payload) : void 0,
    headers
  }, omitFetchOptions ? {} : reqOptions);
  var altFetch = typeof options.alternateFetch === "function" && options.alternateFetch.length >= 1 ? options.alternateFetch : void 0;
  try {
    fetchIt(url, fetchOptions, callback, altFetch);
  } catch (e) {
    if (!reqOptions || Object.keys(reqOptions).length === 0 || !e.message || e.message.indexOf("not implemented") < 0) {
      return callback(e);
    }
    try {
      Object.keys(reqOptions).forEach(function(opt) {
        delete fetchOptions[opt];
      });
      fetchIt(url, fetchOptions, callback, altFetch);
      omitFetchOptions = true;
    } catch (err) {
      callback(err);
    }
  }
};
var requestWithXmlHttpRequest = function requestWithXmlHttpRequest2(options, url, payload, callback) {
  if (payload && _typeof2(payload) === "object") {
    payload = addQueryString("", payload).slice(1);
  }
  if (options.queryStringParams) {
    url = addQueryString(url, options.queryStringParams);
  }
  try {
    var x = XmlHttpRequestApi ? new XmlHttpRequestApi() : new ActiveXObjectApi("MSXML2.XMLHTTP.3.0");
    x.open(payload ? "POST" : "GET", url, 1);
    if (!options.crossDomain) {
      x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    }
    x.withCredentials = !!options.withCredentials;
    if (payload) {
      x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    if (x.overrideMimeType) {
      x.overrideMimeType("application/json");
    }
    var h = options.customHeaders;
    h = typeof h === "function" ? h() : h;
    if (h) {
      for (var i in h) {
        x.setRequestHeader(i, h[i]);
      }
    }
    x.onreadystatechange = function() {
      x.readyState > 3 && callback(x.status >= 400 ? x.statusText : null, {
        status: x.status,
        data: x.responseText
      });
    };
    x.send(payload);
  } catch (e) {
    console && console.log(e);
  }
};
var request = function request2(options, url, payload, callback) {
  if (typeof payload === "function") {
    callback = payload;
    payload = void 0;
  }
  callback = callback || function() {
  };
  if (fetchApi && url.indexOf("file:") !== 0) {
    return requestWithFetch(options, url, payload, callback);
  }
  if (hasXMLHttpRequest() || typeof ActiveXObject === "function") {
    return requestWithXmlHttpRequest(options, url, payload, callback);
  }
  callback(new Error("No fetch and no xhr implementation found!"));
};
var request_default = request;

// node_modules/i18next-http-backend/esm/index.js
function _typeof3(o) {
  "@babel/helpers - typeof";
  return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof3(o);
}
function ownKeys2(e, r) {
  var t2 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t2.push.apply(t2, o);
  }
  return t2;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t2 = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys2(Object(t2), true).forEach(function(r2) {
      _defineProperty2(e, r2, t2[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys2(Object(t2)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
    });
  }
  return e;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t2 = 0; t2 < r.length; t2++) {
    var o = r[t2];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey2(o.key), o);
  }
}
function _createClass(e, r, t2) {
  return r && _defineProperties(e.prototype, r), t2 && _defineProperties(e, t2), Object.defineProperty(e, "prototype", { writable: false }), e;
}
function _defineProperty2(e, r, t2) {
  return (r = _toPropertyKey2(r)) in e ? Object.defineProperty(e, r, { value: t2, enumerable: true, configurable: true, writable: true }) : e[r] = t2, e;
}
function _toPropertyKey2(t2) {
  var i = _toPrimitive2(t2, "string");
  return "symbol" == _typeof3(i) ? i : i + "";
}
function _toPrimitive2(t2, r) {
  if ("object" != _typeof3(t2) || !t2) return t2;
  var e = t2[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t2, r || "default");
    if ("object" != _typeof3(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t2);
}
var getDefaults2 = function getDefaults3() {
  return {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    addPath: "/locales/add/{{lng}}/{{ns}}",
    parse: function parse(data) {
      return JSON.parse(data);
    },
    stringify: JSON.stringify,
    parsePayload: function parsePayload(namespace, key, fallbackValue) {
      return _defineProperty2({}, key, fallbackValue || "");
    },
    parseLoadPayload: function parseLoadPayload(languages, namespaces) {
      return void 0;
    },
    request: request_default,
    reloadInterval: typeof window !== "undefined" ? false : 60 * 60 * 1e3,
    customHeaders: {},
    queryStringParams: {},
    crossDomain: false,
    withCredentials: false,
    overrideMimeType: false,
    requestOptions: {
      mode: "cors",
      credentials: "same-origin",
      cache: "default"
    }
  };
};
var Backend = function() {
  function Backend2(services) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var allOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    _classCallCheck(this, Backend2);
    this.services = services;
    this.options = options;
    this.allOptions = allOptions;
    this.type = "backend";
    this.init(services, options, allOptions);
  }
  return _createClass(Backend2, [{
    key: "init",
    value: function init2(services) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var allOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      this.services = services;
      this.options = _objectSpread2(_objectSpread2(_objectSpread2({}, getDefaults2()), this.options || {}), options);
      this.allOptions = allOptions;
      if (this.services && this.options.reloadInterval) {
        var timer = setInterval(function() {
          return _this.reload();
        }, this.options.reloadInterval);
        if (_typeof3(timer) === "object" && typeof timer.unref === "function") timer.unref();
      }
    }
  }, {
    key: "readMulti",
    value: function readMulti(languages, namespaces, callback) {
      this._readAny(languages, languages, namespaces, namespaces, callback);
    }
  }, {
    key: "read",
    value: function read(language, namespace, callback) {
      this._readAny([language], language, [namespace], namespace, callback);
    }
  }, {
    key: "_readAny",
    value: function _readAny(languages, loadUrlLanguages, namespaces, loadUrlNamespaces, callback) {
      var _this2 = this;
      var loadPath = this.options.loadPath;
      if (typeof this.options.loadPath === "function") {
        loadPath = this.options.loadPath(languages, namespaces);
      }
      loadPath = makePromise(loadPath);
      loadPath.then(function(resolvedLoadPath) {
        if (!resolvedLoadPath) return callback(null, {});
        var url = _this2.services.interpolator.interpolate(resolvedLoadPath, {
          lng: languages.join("+"),
          ns: namespaces.join("+")
        });
        _this2.loadUrl(url, callback, loadUrlLanguages, loadUrlNamespaces);
      });
    }
  }, {
    key: "loadUrl",
    value: function loadUrl(url, callback, languages, namespaces) {
      var _this3 = this;
      var lng = typeof languages === "string" ? [languages] : languages;
      var ns = typeof namespaces === "string" ? [namespaces] : namespaces;
      var payload = this.options.parseLoadPayload(lng, ns);
      this.options.request(this.options, url, payload, function(err, res) {
        if (res && (res.status >= 500 && res.status < 600 || !res.status)) return callback("failed loading " + url + "; status code: " + res.status, true);
        if (res && res.status >= 400 && res.status < 500) return callback("failed loading " + url + "; status code: " + res.status, false);
        if (!res && err && err.message) {
          var errorMessage = err.message.toLowerCase();
          var isNetworkError = ["failed", "fetch", "network", "load"].find(function(term) {
            return errorMessage.indexOf(term) > -1;
          });
          if (isNetworkError) {
            return callback("failed loading " + url + ": " + err.message, true);
          }
        }
        if (err) return callback(err, false);
        var ret, parseErr;
        try {
          if (typeof res.data === "string") {
            ret = _this3.options.parse(res.data, languages, namespaces);
          } else {
            ret = res.data;
          }
        } catch (e) {
          parseErr = "failed parsing " + url + " to json";
        }
        if (parseErr) return callback(parseErr, false);
        callback(null, ret);
      });
    }
  }, {
    key: "create",
    value: function create(languages, namespace, key, fallbackValue, callback) {
      var _this4 = this;
      if (!this.options.addPath) return;
      if (typeof languages === "string") languages = [languages];
      var payload = this.options.parsePayload(namespace, key, fallbackValue);
      var finished = 0;
      var dataArray = [];
      var resArray = [];
      languages.forEach(function(lng) {
        var addPath = _this4.options.addPath;
        if (typeof _this4.options.addPath === "function") {
          addPath = _this4.options.addPath(lng, namespace);
        }
        var url = _this4.services.interpolator.interpolate(addPath, {
          lng,
          ns: namespace
        });
        _this4.options.request(_this4.options, url, payload, function(data, res) {
          finished += 1;
          dataArray.push(data);
          resArray.push(res);
          if (finished === languages.length) {
            if (typeof callback === "function") callback(dataArray, resArray);
          }
        });
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      var _this5 = this;
      var _this$services = this.services, backendConnector = _this$services.backendConnector, languageUtils = _this$services.languageUtils, logger = _this$services.logger;
      var currentLanguage = backendConnector.language;
      if (currentLanguage && currentLanguage.toLowerCase() === "cimode") return;
      var toLoad = [];
      var append = function append2(lng) {
        var lngs = languageUtils.toResolveHierarchy(lng);
        lngs.forEach(function(l) {
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };
      append(currentLanguage);
      if (this.allOptions.preload) this.allOptions.preload.forEach(function(l) {
        return append(l);
      });
      toLoad.forEach(function(lng) {
        _this5.allOptions.ns.forEach(function(ns) {
          backendConnector.read(lng, ns, "read", null, null, function(err, data) {
            if (err) logger.warn("loading namespace ".concat(ns, " for language ").concat(lng, " failed"), err);
            if (!err && data) logger.log("loaded namespace ".concat(ns, " for language ").concat(lng), data);
            backendConnector.loaded("".concat(lng, "|").concat(ns), err, data);
          });
        });
      });
    }
  }]);
}();
Backend.type = "backend";
var esm_default = Backend;

// node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js
var {
  slice: slice2,
  forEach
} = [];
function defaults(obj) {
  forEach.call(slice2.call(arguments, 1), (source) => {
    if (source) {
      for (const prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function hasXSS(input) {
  if (typeof input !== "string") return false;
  const xssPatterns = [/<\s*script.*?>/i, /<\s*\/\s*script\s*>/i, /<\s*img.*?on\w+\s*=/i, /<\s*\w+\s*on\w+\s*=.*?>/i, /javascript\s*:/i, /vbscript\s*:/i, /expression\s*\(/i, /eval\s*\(/i, /alert\s*\(/i, /document\.cookie/i, /document\.write\s*\(/i, /window\.location/i, /innerHTML/i];
  return xssPatterns.some((pattern) => pattern.test(input));
}
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
var serializeCookie = function(name, val) {
  let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    path: "/"
  };
  const opt = options;
  const value = encodeURIComponent(val);
  let str = `${name}=${value}`;
  if (opt.maxAge > 0) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge)) throw new Error("maxAge should be a Number");
    str += `; Max-Age=${Math.floor(maxAge)}`;
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) str += "; HttpOnly";
  if (opt.secure) str += "; Secure";
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  if (opt.partitioned) str += "; Partitioned";
  return str;
};
var cookie = {
  create(name, value, minutes, domain) {
    let cookieOptions = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      path: "/",
      sameSite: "strict"
    };
    if (minutes) {
      cookieOptions.expires = /* @__PURE__ */ new Date();
      cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1e3);
    }
    if (domain) cookieOptions.domain = domain;
    document.cookie = serializeCookie(name, encodeURIComponent(value), cookieOptions);
  },
  read(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  remove(name) {
    this.create(name, "", -1);
  }
};
var cookie$1 = {
  name: "cookie",
  // Deconstruct the options object and extract the lookupCookie property
  lookup(_ref) {
    let {
      lookupCookie
    } = _ref;
    if (lookupCookie && typeof document !== "undefined") {
      return cookie.read(lookupCookie) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupCookie,
      cookieMinutes,
      cookieDomain,
      cookieOptions
    } = _ref2;
    if (lookupCookie && typeof document !== "undefined") {
      cookie.create(lookupCookie, lng, cookieMinutes, cookieDomain, cookieOptions);
    }
  }
};
var querystring = {
  name: "querystring",
  // Deconstruct the options object and extract the lookupQuerystring property
  lookup(_ref) {
    let {
      lookupQuerystring
    } = _ref;
    let found;
    if (typeof window !== "undefined") {
      let {
        search
      } = window.location;
      if (!window.location.search && window.location.hash?.indexOf("?") > -1) {
        search = window.location.hash.substring(window.location.hash.indexOf("?"));
      }
      const query = search.substring(1);
      const params = query.split("&");
      for (let i = 0; i < params.length; i++) {
        const pos = params[i].indexOf("=");
        if (pos > 0) {
          const key = params[i].substring(0, pos);
          if (key === lookupQuerystring) {
            found = params[i].substring(pos + 1);
          }
        }
      }
    }
    return found;
  }
};
var hasLocalStorageSupport = null;
var localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;
  try {
    hasLocalStorageSupport = typeof window !== "undefined" && window.localStorage !== null;
    if (!hasLocalStorageSupport) {
      return false;
    }
    const testKey = "i18next.translate.boo";
    window.localStorage.setItem(testKey, "foo");
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }
  return hasLocalStorageSupport;
};
var localStorage = {
  name: "localStorage",
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(_ref) {
    let {
      lookupLocalStorage
    } = _ref;
    if (lookupLocalStorage && localStorageAvailable()) {
      return window.localStorage.getItem(lookupLocalStorage) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupLocalStorage
    } = _ref2;
    if (lookupLocalStorage && localStorageAvailable()) {
      window.localStorage.setItem(lookupLocalStorage, lng);
    }
  }
};
var hasSessionStorageSupport = null;
var sessionStorageAvailable = () => {
  if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;
  try {
    hasSessionStorageSupport = typeof window !== "undefined" && window.sessionStorage !== null;
    if (!hasSessionStorageSupport) {
      return false;
    }
    const testKey = "i18next.translate.boo";
    window.sessionStorage.setItem(testKey, "foo");
    window.sessionStorage.removeItem(testKey);
  } catch (e) {
    hasSessionStorageSupport = false;
  }
  return hasSessionStorageSupport;
};
var sessionStorage = {
  name: "sessionStorage",
  lookup(_ref) {
    let {
      lookupSessionStorage
    } = _ref;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      return window.sessionStorage.getItem(lookupSessionStorage) || void 0;
    }
    return void 0;
  },
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupSessionStorage
    } = _ref2;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      window.sessionStorage.setItem(lookupSessionStorage, lng);
    }
  }
};
var navigator$1 = {
  name: "navigator",
  lookup(options) {
    const found = [];
    if (typeof navigator !== "undefined") {
      const {
        languages,
        userLanguage,
        language
      } = navigator;
      if (languages) {
        for (let i = 0; i < languages.length; i++) {
          found.push(languages[i]);
        }
      }
      if (userLanguage) {
        found.push(userLanguage);
      }
      if (language) {
        found.push(language);
      }
    }
    return found.length > 0 ? found : void 0;
  }
};
var htmlTag = {
  name: "htmlTag",
  // Deconstruct the options object and extract the htmlTag property
  lookup(_ref) {
    let {
      htmlTag: htmlTag2
    } = _ref;
    let found;
    const internalHtmlTag = htmlTag2 || (typeof document !== "undefined" ? document.documentElement : null);
    if (internalHtmlTag && typeof internalHtmlTag.getAttribute === "function") {
      found = internalHtmlTag.getAttribute("lang");
    }
    return found;
  }
};
var path = {
  name: "path",
  // Deconstruct the options object and extract the lookupFromPathIndex property
  lookup(_ref) {
    let {
      lookupFromPathIndex
    } = _ref;
    if (typeof window === "undefined") return void 0;
    const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
    if (!Array.isArray(language)) return void 0;
    const index = typeof lookupFromPathIndex === "number" ? lookupFromPathIndex : 0;
    return language[index]?.replace("/", "");
  }
};
var subdomain = {
  name: "subdomain",
  lookup(_ref) {
    let {
      lookupFromSubdomainIndex
    } = _ref;
    const internalLookupFromSubdomainIndex = typeof lookupFromSubdomainIndex === "number" ? lookupFromSubdomainIndex + 1 : 1;
    const language = typeof window !== "undefined" && window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);
    if (!language) return void 0;
    return language[internalLookupFromSubdomainIndex];
  }
};
var canCookies = false;
try {
  document.cookie;
  canCookies = true;
} catch (e) {
}
var order = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
if (!canCookies) order.splice(1, 1);
var getDefaults4 = () => ({
  order,
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  // cache user language
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain'
  convertDetectedLanguage: (l) => l
});
var Browser = class {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.type = "languageDetector";
    this.detectors = {};
    this.init(services, options);
  }
  init() {
    let services = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
      languageUtils: {}
    };
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let i18nOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.services = services;
    this.options = defaults(options, this.options || {}, getDefaults4());
    if (typeof this.options.convertDetectedLanguage === "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1) {
      this.options.convertDetectedLanguage = (l) => l.replace("-", "_");
    }
    if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
    this.i18nOptions = i18nOptions;
    this.addDetector(cookie$1);
    this.addDetector(querystring);
    this.addDetector(localStorage);
    this.addDetector(sessionStorage);
    this.addDetector(navigator$1);
    this.addDetector(htmlTag);
    this.addDetector(path);
    this.addDetector(subdomain);
  }
  addDetector(detector) {
    this.detectors[detector.name] = detector;
    return this;
  }
  detect() {
    let detectionOrder = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order;
    let detected = [];
    detectionOrder.forEach((detectorName) => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options);
        if (lookup && typeof lookup === "string") lookup = [lookup];
        if (lookup) detected = detected.concat(lookup);
      }
    });
    detected = detected.filter((d) => d !== void 0 && d !== null && !hasXSS(d)).map((d) => this.options.convertDetectedLanguage(d));
    if (this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes) return detected;
    return detected.length > 0 ? detected[0] : null;
  }
  cacheUserLanguage(lng) {
    let caches = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    if (!caches) return;
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
    caches.forEach((cacheName) => {
      if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
    });
  }
};
Browser.type = "languageDetector";

// src/translations/en.json
var en_default = {
  title: "Welcome to WLED wiring designer!",
  dragComponents: "Start by dragging components onto the workspace or load one of example diagramms",
  componentGroupTypes: {
    controller: "Controller",
    led: "LEDs",
    psu: "Power sources",
    levelshifter: "Level shifter",
    electronics: "Electronics/Parts",
    others: "Other components"
  },
  buttons: {
    rotate: "rotate",
    longer: "larger",
    shorter: "smaller"
  },
  tooltip: {
    deleteWire: "Delete this connection",
    selectColor: "Select color",
    selectWireLength: "Select wire length (physically)",
    selectWireCrossSection: "Select wire cross section (physically)",
    selectWireWidth: "Select wire width (for drawing)",
    selectWireNetwork: "Select whole network",
    clearWireNetwork: "Clear network selection",
    putWireInfoNode: "Add cable info box",
    rerouteWire: "Re-route wire with Pathfinder",
    startConnection: "Start connection",
    closeConnection: "Finish connectionn",
    rotateLeft: "Rotate left",
    rotateRight: "Rotate right",
    delete: "Delete",
    copy: "Copy",
    enlarge: "Enlarge",
    shorten: "Shorten",
    switchFilled: "Filled / border only",
    increaseTextSize: "Increase text size",
    decreaseTextSize: "Decrease text size",
    textSize: "Text size",
    selectFont: "Select font",
    toggleBold: "Toggle bold",
    textAlign: "Text alignment",
    selectMulti: "multiple select",
    deleteSelected: "delete selected",
    componentInfo: "Component info",
    switchConnLineType: "change connection type",
    ledSimulationOptions: "LED simulation settings"
  },
  ledSimulationOptions: {
    title: "LED simulation",
    recommended: "recommended",
    unknownOption: "Unknown option. Update this component from the current template.",
    fields: {
      supplyResistance: "Positive path / V+ resistance",
      gndResistance: "Negative path / GND resistance",
      currentCurve: "LED current curve"
    },
    resistance: {
      typical_5mm: {
        name: "Typical 5 mm strip",
        description: "Typical copper path for a 5 mm LED strip: 0.12 Ohm per meter."
      },
      good_5mm: {
        name: "Good 5 mm strip",
        description: "Better copper path for a 5 mm LED strip: 0.09 Ohm per meter."
      },
      poor_5mm: {
        name: "Poor 5 mm strip",
        description: "Higher-resistance copper path for a weak 5 mm LED strip: 0.24 Ohm per meter."
      },
      narrow_fcob_path_good: {
        name: "Good narrow FCOB path",
        description: "Good copper path for an FCOB strip (narrow side, shared with the data path): 0.12 Ohm per meter."
      },
      narrow_fcob_path_typical: {
        name: "Typical narrow FCOB path",
        description: "Typical copper path for an FCOB strip (narrow side, shared with the data path): 0.16 Ohm per meter."
      },
      narrow_fcob_path_bad: {
        name: "Poor narrow FCOB path",
        description: "Higher-resistance copper path for an FCOB strip (narrow side, shared with the data path): 0.22 Ohm per meter."
      },
      bright_fcob_path_good: {
        name: "Good high-power FCOB path",
        description: "Good copper path for an FCOB strip (wide, fully used side): 0.06 Ohm per meter."
      },
      bright_fcob_path_typical: {
        name: "Typical high-power FCOB path",
        description: "Typical copper path for an FCOB strip (wide, fully used side): 0.08 Ohm per meter."
      },
      bright_fcob_path_bad: {
        name: "Poor high-power FCOB path",
        description: "Higher-resistance copper path for an FCOB strip (wide, fully used side): 0.20 Ohm per meter."
      }
    },
    currentCurve: {
      ws2814_24v_typical: {
        name: "Typical WS2814 24 V",
        description: "Typical voltage-dependent WS2814 24 V current curve."
      },
      ws2812b_5v_typical: {
        name: "WS2812B 5 V (typical)",
        description: "WS2812B RGB 5 V, 5050 LED size, typical version."
      },
      ws2812b_5v_good: {
        name: "WS2812B 5 V (good)",
        description: "WS2812B RGB 5 V, 5050 LED size, good/new version (improved color stability)."
      },
      ws2812b_eco_5v_typical: {
        name: "WS2812B ECO 5 V (typical)",
        description: "WS2812B RGB ECO 5 V, 5050 LED size, typical version."
      },
      ws2811_24v_typical: {
        name: "WS2811 24 V (typical)",
        description: "WS2811 RGB 24 V, 5050 LED size, typical version."
      },
      ws2814_12v_typical: {
        name: "WS2814 12 V (typical)",
        description: "WS2812B RGBW 12 V, 5050 LED size, typical version."
      },
      ws28xx_fcob_rgb_24v_720lpm_typical: {
        name: "WS28xx FCOB RGB 24 V, 720 LEDs/m (typical)",
        description: "WS28xx FCOB RGB 24 V, 720 LEDs/m, 20 logical LEDs/m, typical version."
      },
      ws28xx_fcob_rgb_12v_720lpm_typical: {
        name: "WS28xx FCOB RGB 12 V, 720 LEDs/m (typical)",
        description: "WS28xx FCOB RGB 12 V, 720 LEDs/m, 20 logical LEDs/m, typical version."
      },
      ws28xx_fcob_rgbw_24v_784lpm_typical: {
        name: "WS28xx FCOB RGBW 24 V, 784 LEDs/m (typical)",
        description: "WS28xx FCOB RGB 24 V, 784 LEDs/m, 14 logical LEDs/m, typical version."
      },
      sk6812_fcob_rgb_5v_240lpm_typical: {
        name: "SK6812 FCOB RGB 5 V, 240 LEDs/m (typical)",
        description: "SK6812 FCOB RGB 5 V, 240 LEDs/m, 80 logical LEDs/m, typical version."
      }
    }
  },
  componentEditor: {
    title: "Component editor",
    valid: "valid",
    invalid: "invalid",
    actions: {
      new: "New",
      openCore: "Open built-in component",
      openLocal: "Open local draft",
      saveLocal: "Save locally",
      importJson: "Import JSON",
      exportJson: "Export JSON",
      backToDesigner: "Back to designer",
      addHandle: "Add handle",
      deleteHandle: "Delete handle",
      addField: "Add field",
      deleteField: "Delete field",
      addOption: "Add option",
      addConnection: "Add connection",
      deleteConnection: "Delete connection",
      addSimulationElement: "Add simulation element",
      deleteSimulationElement: "Delete simulation element"
    },
    tabs: {
      basics: "Basics",
      geometry: "Geometry",
      handles: "Handles",
      fields: "Fields",
      connections: "Connections",
      simulation: "Simulation",
      runtime: "Runtime"
    },
    fields: {
      id: "Component ID",
      version: "Version",
      name: "Name",
      descriptionShort: "Short description",
      description: "Description",
      group: "Group",
      showName: "Show name",
      imageUrl: "Image URL",
      imageWidth: "Image width",
      imageHeight: "Image height",
      rotation: "Rotation",
      borderWidth: "Border width",
      lengthStep: "Physical length step",
      rotatable: "Rotatable",
      resizableX: "Resizable X",
      resizableY: "Resizable Y",
      noBackgroundImage: "No background image",
      handleId: "Handle ID",
      handleType: "Handle type",
      functions: "Functions",
      borderColor: "Border color",
      borderType: "Border type",
      borderLineWidth: "Border line width",
      borderRadius: "Border radius",
      hideConditions: "Hide conditions",
      fieldId: "Field ID",
      fieldType: "Field type",
      unit: "Unit",
      selectedValue: "Selected value",
      connectionKind: "Connection kind",
      fromHandle: "From handle",
      toHandle: "To handle",
      elementId: "Element ID",
      elementType: "Element type"
    },
    editorModes: {
      ui: "UI",
      json: "JSON"
    },
    labels: {
      unnamed: "Unnamed",
      terminals: "Terminals",
      parameters: "Parameters"
    },
    sections: {
      applyHandles: "Apply handles",
      applyFields: "Apply fields",
      applyConnections: "Apply connections",
      applySimulation: "Apply simulation",
      applyRuntime: "Apply runtime",
      handlesDescription: "Edit the component handles as schema JSON. The validator checks IDs, sizes, functions, hide conditions, and references.",
      fieldsDescription: "Edit number and select fields as schema JSON. Select options may include optional image definitions.",
      connectionsDescription: "Edit internal short and fuse connections as schema JSON.",
      simulationDescription: "Edit the simulation definition as schema JSON, or use null for no simulation data.",
      runtimeDescription: "Edit existing runtime-only UI options as schema JSON, or use null when none are needed."
    },
    preview: {
      title: "Preview",
      selectedHandle: "Selected handle",
      selectHandle: "Select handle",
      nudge: "Move by 1 px"
    },
    validation: {
      title: "Validation",
      noIssues: "No validation issues."
    },
    messages: {
      savedLocal: "Component draft saved locally.",
      imported: "Component package imported.",
      importFailed: "Component package could not be imported.",
      invalidJson: "Invalid JSON",
      noHandles: "No handles yet. Add one to edit its properties.",
      noFields: "No fields yet. Add one to edit its properties.",
      noConnections: "No connections yet. Add one to edit its properties.",
      noSimulationElements: "No simulation elements yet. Add one to edit its properties."
    }
  },
  popover: {
    selectWireLength: "Select wire length (physically):",
    selectWireCrossSection: "Select wire cross section (physically):",
    selectWireWidth: "Select wire width (for drawing):",
    startConnection: "Please select the pin/connector to start from:",
    closeConnection: "Please select the pin/connector to finish:"
  },
  select: {
    startConnection: "Select pin / connector",
    closeConnection: "Select pin / connector"
  },
  message: {
    startPinSelected: "Source pin/connector is selected. Now please select the target pin/connector.",
    closePinSelected: "The connection is ready.",
    startPinFirst: "Please first select starting pin/connector!",
    theSamePin: "Starting pin/connector is the same as end pin/connector!",
    compAddSuccess: "Added to the diagramm!",
    loadModelSuccess: "The WLED wiring model is successfully loaded!",
    loadModelSuccessShort: "Success",
    loadingModel: "Loading wiring model from file link ...",
    loadModelError: "The WLED wiring model cannot be loaded. Eventually this link is not valid any more.",
    loadModelErrorShort: "Error",
    loadModelWrongLink: "The link is wrong! Please check it.",
    saveModelSuccess: "Model saved.",
    saveModelDownloadStarted: "Model download started.",
    saveModelError: "The model could not be saved.",
    componentUpdatesApplied: "The updates were applied. Please check this component.",
    componentUpdatesAppliedShort: "Updates applied",
    componentUpdatesAvailableTitle: "Component updates available",
    componentUpdatesAvailableDescription: "{{count}} component(s) in this diagram can be updated to the current template. Update all components now?",
    componentUpdatesApplyAll: "Update all",
    componentUpdatesSkip: "Do not update",
    componentUpdatesAllApplied: "{{count}} component update(s) were applied."
  },
  sidebar: {
    components: {
      title: "Components",
      popoverTitle: "Component info",
      addButtonText: "Add to diagramm",
      updateButtonText: "Update this component",
      updatePopoverTitle: "Changes for this component",
      applyUpdatesButtonText: "Apply updates",
      updateExplanation: "This component in the diagram is older than the current component in the app. The following changes can be transferred.",
      noUpdateChanges: "No updates available.",
      updateValueMissing: "Missing",
      updateChangeProperty: "Property",
      updateChangeCurrent: "Current",
      updateChangeTemplate: "Template",
      popoverContent: {
        whereToBuy: "Where to buy?",
        listOfConnections: "List of pins/terminals",
        listOfConnectionsHeading1: "Pin / Terminal",
        listOfConnectionsHeading2: "Description"
      }
    },
    check: {
      title: "Check wiring diagramm",
      comingSoon: "Rule-based check will be implemented in next months. Stay tuned!",
      buttonRun: "Check diagram now",
      betaNoticeTitle: "Beta version",
      betaNoticeDescription: "This diagram check is still under development. Issue detection may be incomplete or incorrect.",
      notChecked: "No check has been run yet.",
      noIssuesTitle: "No issues found",
      noIssuesDescription: "The current diagram check did not find any issues.",
      rulesButton: "Rules",
      rulesModalTitle: "Applied check rules",
      rulesModalDescription: "These rules are currently applied when checking the wiring diagram.",
      issueCount: "{{count}} result(s) found",
      recommendation: "Recommendation",
      affectedElements: "Affected elements",
      diagnostics: {
        modeLabel: "Diagnostics mode",
        suppressedTag: "suppressed",
        specificity: "Specificity {{value}}",
        suppressedBy: "Suppressed by: {{ids}}",
        mode: {
          "user-friendly": "Normal",
          diagnostic: "All issues",
          "diagnostic-with-suppression-markers": "All + markers"
        }
      },
      severity: {
        error: "Error",
        warning: "Warning",
        info: "Info"
      },
      classificationLabels: {
        gnd_net_type: "ground",
        suppl_net_type: "DC supply",
        digital_net_type: "digital",
        pwm_net_type: "PWM",
        analog_net_type: "analog",
        audio_net_type: "audio",
        eth_net_type: "Ethernet",
        usb_net_type: "USB",
        rs485_a_net_type: "RS485 A",
        rs485_b_net_type: "RS485 B",
        N_net_type: "neutral",
        L_net_type: "line",
        PE_net_type: "protective earth"
      },
      signalLabels: {
        digital: "digital",
        pwm: "PWM",
        analog: "analog",
        audio: "audio",
        usb: "USB"
      },
      analogLedColorLabels: {
        red: "red",
        green: "green",
        blue: "blue",
        white: "white",
        warmWhite: "warm white"
      },
      mainsInputLabels: {
        line: "line",
        neutral: "neutral",
        pe: "PE"
      },
      rulePlaceholders: {
        signal: "signal",
        mainsInput: "mains"
      },
      invalidWireReasons: {
        "missing-node": "component is missing",
        "missing-handle": "pin is missing",
        "hidden-handle": "pin is hidden"
      },
      issues: {
        diagramEmpty: {
          title: "Diagram is empty",
          shortDescription: "There are no components in the diagram yet.",
          description: "The check can only provide technical guidance once components and wires are present in the diagram.",
          recommendation: "Add components first, then run the check again."
        }
      },
      rules: {
        "network-rules": {
          title: "Network rules",
          description: "Checks fundamental issues in component-linked nets.",
          issues: {
            groundMissing: {
              title: "No ground net is connected",
              shortDescription: "GND pins exist, but no connected ground net was found.",
              description: "At least one GND pin exists in the diagram, but none of them is wired. Components with a ground reference need a common ground connection.",
              recommendation: "Connect the GND pins of the involved components together."
            },
            groundMultiple: {
              title: "Multiple separate ground nets",
              shortDescription: "All GND connections must belong to one common ground net.",
              description: "{{count}} separate ground nets were found. Parts of the circuit therefore do not share a common reference.",
              recommendation: "Connect the separate ground nets together."
            },
            mainsLowVoltageMixed: {
              title: "Mains voltage and low voltage are connected",
              shortDescription: "A net connects L/N to low-voltage or signal terminals.",
              description: "The net contains {{classifications}}. Mains voltage must not be connected to GND, DC supply, or signal nets.",
              recommendation: "Keep mains wiring strictly separated from low-voltage and signal wiring."
            },
            peActiveMixed: {
              title: "Protective earth is connected to an active conductor",
              shortDescription: "A PE net is connected to active supply or a signal net.",
              description: "The net contains {{classifications}}. PE must not be connected to L, N, DC supply, or signals.",
              recommendation: "Separate PE from active conductors and signal connections."
            },
            rs485Mixed: {
              title: "RS485 A and B are connected",
              shortDescription: "A net connects RS485_A to RS485_B.",
              description: "The differential RS485 lines A and B must not be connected to each other.",
              recommendation: "Separate RS485_A and RS485_B into two distinct nets."
            },
            mixedClassifications: {
              title: "Different output types are connected",
              shortDescription: "A net contains multiple net classes.",
              description: "The net contains {{classifications}} at the same time. This means outputs of different types are connected together.",
              recommendation: "Separate the different output types into distinct nets."
            },
            multipleSupplySources: {
              title: "Multiple independent voltage sources are connected",
              shortDescription: "A supply net contains multiple independent voltage sources.",
              description: "The net contains {{count}} independent voltage sources: {{sources}}.",
              recommendation: "Separate the voltage sources or make sure only forwarded outputs share the same net."
            },
            signalSinkWithoutSource: {
              title: "{{signal}} input without source",
              shortDescription: "A {{signal}} input is wired, but the net has no matching source.",
              description: "The net contains {{sinks}}, but no matching {{signal}} output.",
              recommendation: "Connect the input to a matching output or check the pin function of the involved components."
            },
            digitalSignalVoltageMismatch: {
              title: "Digital level does not match",
              shortDescription: "A digital input is driven with an incompatible output voltage.",
              description: "{{input}} allows {{min}} V to {{max}} V, but is connected to incompatible digital outputs: {{sources}}.",
              recommendation: "Use a suitable level shifter or connect the input to a digital output within the allowed voltage range."
            },
            multipleSignalSources: {
              title: "Multiple {{signal}} sources are connected",
              shortDescription: "A {{signal}} net contains multiple outputs.",
              description: "The net connects multiple {{signal}} sources: {{sources}}.",
              recommendation: "Separate the outputs so each signal net has only one source."
            },
            supplyInputWithoutSource: {
              title: "Supply input without voltage source",
              shortDescription: "A supply input is wired, but the net has no voltage source.",
              description: "The net contains supply inputs ({{inputs}}), but no independent suppl_out output.",
              recommendation: "Connect the net to a suitable voltage source."
            },
            supplySourceWithoutConsumer: {
              title: "Supply net without consumer",
              shortDescription: "A supply output is wired, but no supply input is connected.",
              description: "The net contains a voltage source, but no recognizable supply consumer.",
              recommendation: "Check whether the supply should be routed to a component with a supply input."
            },
            supplyVoltageMismatch: {
              title: "Supply voltage does not match",
              shortDescription: "The source voltage does not match all pin tolerances in the supply net.",
              description: "The source provides {{voltage}} V, but at least one connected pin does not allow this voltage range: {{inputs}}.",
              recommendation: "Adjust the supply voltage or separate components with different voltage ranges."
            },
            wireConnectedToHiddenOrMissingHandle: {
              title: "Wire points to a missing pin",
              shortDescription: "A wire ends at a missing or hidden pin.",
              description: "Wire {{wire}} cannot electrically reach pin {{handle}} on the {{side}} side: {{reason}}.",
              recommendation: "Reconnect the wire to a visible, existing pin."
            },
            mainsWireConnectedToLowVoltageComponent: {
              title: "Mains connected to unsuitable component",
              shortDescription: "An L/N/PE net is connected to a non-mains terminal.",
              description: "{{handle}} on {{component}} is in a mains net, but is not an L/N/PE terminal.",
              recommendation: "Remove this connection and use only terminals intended for mains voltage."
            },
            groundAndSupplyPolaritySwapped: {
              title: "Positive supply and GND are connected",
              shortDescription: "A net contains both ground and DC supply.",
              description: "GND and supply terminals are connected in this net. This is likely reversed polarity or a short circuit.",
              recommendation: "Separate positive supply and GND connections and check polarity."
            },
            supplyVoltageUnknown: {
              title: "Supply voltage is unknown",
              shortDescription: "A supply net has a source whose voltage cannot be resolved.",
              description: "The supply from {{source}} feeds inputs, but the voltage value cannot be resolved.",
              recommendation: "Set the voltage value on the source or dependent field."
            },
            signalOutputWithoutConsumer: {
              title: "{{signal}} output without consumer",
              shortDescription: "A signal output is wired but reaches no matching input.",
              description: "{{source}} is connected, but no matching {{signal}} input was found.",
              recommendation: "Route the signal to a matching input or remove the unused connection."
            },
            dataDirectionWrong: {
              title: "Data direction is implausible",
              shortDescription: "An LED data net connects only outputs or only inputs.",
              description: "These data terminals do not form a plausible source-to-sink connection: {{handles}}.",
              recommendation: "Connect DATA_out to DATA_in in the correct direction."
            },
            clockedLedClockMissing: {
              title: "Clock line is missing or mismatched",
              shortDescription: "A clocked LED strip has data but no matching clock connection.",
              description: "{{component}} needs a matching clock line for DATA. In LED-to-LED chaining, clock must come from the same upstream segment.",
              recommendation: "Connect Clock_in to the matching clock output."
            },
            digitalBackupPairMismatch: {
              title: "Backup data line does not match",
              shortDescription: "Backup_in does not come from the matching Backup_out of the upstream LED strip.",
              description: "{{component}} is fed by data from {{source}}, but backup does not come from the same strip.",
              recommendation: "Connect Backup_in to Backup_out of the same upstream strip."
            },
            digitalBackupInputTiedToData: {
              title: "Backup_in is tied to data",
              shortDescription: "Backup_in is tolerated on the data net, but GND is recommended.",
              description: "{{component}} is not a downstream strip. Backup_in is on the data net instead of GND.",
              recommendation: "Prefer connecting Backup_in to GND."
            },
            digitalBackupInputNotGrounded: {
              title: "Backup_in is not tied to GND",
              shortDescription: "Backup_in of a first LED strip is not connected to GND.",
              description: "{{component}} is not fed by a previous LED strip. Backup_in must be tied to GND.",
              recommendation: "Connect Backup_in to GND."
            },
            fuseBypassed: {
              title: "Fuse is bypassed",
              shortDescription: "A fuse input and output are directly connected externally.",
              description: "Both sides of the fuse in {{component}} are externally in the same net. The protection function is bypassed.",
              recommendation: "Remove the external bridge across the fuse."
            },
            usbPowerPairInvalid: {
              title: "USB power connection is invalid",
              shortDescription: "USB power must connect exactly one USB source to exactly one USB device.",
              description: "This USB power net is not point-to-point: {{reason}}.",
              recommendation: "Use one direct USB wire from one USB power output to one USB device, without splitters or extra terminals."
            },
            wireWithoutPhysicalParameters: {
              title: "Power wire has no physical data",
              shortDescription: "A power, GND, or USB wire has no length or cross section.",
              description: "This wire is in a supply, GND, or USB net, but length or cross section is missing.",
              recommendation: "Set length and cross section for this wire."
            },
            duplicateParallelWire: {
              title: "Duplicate parallel connection",
              shortDescription: "Multiple wires connect the same two pins.",
              description: "{{count}} wires connect the same pin pair.",
              recommendation: "Remove accidentally duplicated wires."
            }
          }
        },
        "component-rules": {
          title: "Component rules",
          description: "Checks fundamental requirements of individual components.",
          issues: {
            requiredPinUnconnected: {
              title: "Required pin is not connected",
              shortDescription: "A component has a pin that must be connected.",
              description: "{{component}} has required pins without a connection: {{handles}}.",
              recommendation: "Connect all pins of this component that are marked as required connections."
            },
            groundMissing: {
              title: "Component without ground",
              shortDescription: "A component with a GND pin is not connected to ground.",
              description: "{{component}} has GND pins, but none of them is connected to a ground net.",
              recommendation: "Connect at least one GND pin of this component to the common ground net."
            },
            powerMissing: {
              title: "Component without supply",
              shortDescription: "A component with a supply input is not powered.",
              description: "{{component}} has supply or USB inputs, but no supply input is connected to a supply net containing a suppl_out pin of another component, and no USB terminal is connected to a USB net.",
              recommendation: "Connect a supply input to a suitable external voltage source or connect the USB terminal to a USB supply."
            },
            mainsInputMissing: {
              title: "{{label}} input is not connected",
              shortDescription: "A component with a {{label}} input is not connected to the matching net.",
              description: "{{component}} has {{label}} inputs, but at least one of them is not connected to a matching {{label}} net.",
              recommendation: "Connect every {{label}} input of this component to the matching {{label}} net."
            },
            unusedRequiredFunctionalGroup: {
              title: "Used functional group is incomplete",
              shortDescription: "An LED input group is only partially connected.",
              description: "{{component}} has a used data input, but supply or GND for that group is missing.",
              recommendation: "Connect data, supply, and GND for the LED input group."
            },
            controlledOutputWithoutControlInput: {
              title: "Switched output has no control signal",
              shortDescription: "A used controllable output has no digital control input.",
              description: "{{component}} uses {{output}}, but the related control input {{control}} is not connected to a digital net.",
              recommendation: "Connect the control input to a suitable digital output, or disconnect the switched output if it is not used."
            },
            analogLedColorChannelUnconnected: {
              title: "Color channel is not connected",
              shortDescription: "A color of an analog LED strip cannot be controlled.",
              description: "{{component}} has no connected {{color}} channel. Affected pins: {{handles}}.",
              recommendation: "Connect at least one {{color}} terminal of the strip to a suitable PWM output if this color should be controllable."
            },
            analogLedColorChannelMultiplePwmSignals: {
              title: "Color channel uses multiple PWM signals",
              shortDescription: "One color of an analog LED strip is connected to different PWM outputs.",
              description: "{{component}} has its {{color}} channel connected to multiple PWM signals: {{signals}}. Affected pins: {{handles}}.",
              recommendation: "Connect all terminals of the same color channel to the same PWM signal. For higher power, split the analog strip into separate strips or isolated segments."
            },
            componentHasOnlyOneTerminalConnected: {
              title: "Only one terminal is connected",
              shortDescription: "A two-terminal component has only one connected pin.",
              description: "{{component}} is connected only at {{handle}}.",
              recommendation: "Connect both terminals or remove the unused component."
            },
            capacitorPolarityMismatch: {
              title: "Capacitor polarity is wrong",
              shortDescription: "A polarized capacitor is likely reversed.",
              description: "{{component}} has plus on GND or minus on supply.",
              recommendation: "Connect plus to positive supply and minus to GND."
            },
            mainsConnectorIncomplete: {
              title: "Mains connection is incomplete",
              shortDescription: "A mains component has only L or only N connected.",
              description: "{{component}} has an incomplete L/N connection.",
              recommendation: "Connect L and N correctly or disconnect mains completely."
            },
            protectiveEarthMissingForMetalOrMainsDevice: {
              title: "Protective earth is missing",
              shortDescription: "A mains component with PE is missing protective earth.",
              description: "{{component}} uses mains voltage, but PE is not connected correctly.",
              recommendation: "Connect PE to the protective earth net."
            },
            supplyInputOnlyInternallyPowered: {
              title: "Supply is only internally forwarded",
              shortDescription: "A component appears connected only through internal supply pins.",
              description: "{{component}} has supply inputs, but no external voltage source is reachable.",
              recommendation: "Connect the supply to an external source."
            },
            fuseCurrentMissingOrUnderspecified: {
              title: "Fuse rating is missing",
              shortDescription: "A fuse has no recognizable nominal current.",
              description: "{{component}} contains a fuse without an evaluable nominal current.",
              recommendation: "Set or check the fuse rating."
            },
            isolatedComponent: {
              title: "Component is isolated",
              shortDescription: "A technical component has no connected wires.",
              description: "{{component}} is not wired in the diagram.",
              recommendation: "Wire the component or remove it if it is not needed."
            },
            componentDefinitionIncompleteForChecks: {
              title: "Component definition is incomplete",
              shortDescription: "A pin has incomplete metadata for checks.",
              description: "{{handle}} on {{component}} has missing or incomplete check metadata.",
              recommendation: "Add functions, voltage limits, or output voltage data in the component definition."
            },
            ambiguousMultiFunctionHandle: {
              title: "Ambiguous pin functions",
              shortDescription: "A pin has multiple check-relevant functions.",
              description: "{{handle}} has these functions: {{functions}}.",
              recommendation: "Check whether this function combination is intentional and unambiguous for checks."
            },
            sn74Ahct125nUsedChannelInputMissing: {
              title: "SN74AHCT125N channel input is not driven",
              shortDescription: "A used buffer output has an input without a digital output source or an /OE pin that is neither digitally driven nor tied to GND.",
              description: "{{component}} channel {{channel}} drives a digital input via {{output}}, but these related pins are not connected correctly: {{handles}}. A must be on a net with dig_out; /OE may be on a net with dig_out or GND.",
              recommendation: "Connect the related A pin to a suitable digital output and the /OE pin to a digital output or GND, or disconnect the unused Y output from the digital input."
            },
            sn74Ahct125nDirectLedOutputMissingSeriesResistor: {
              title: "SN74AHCT125N output directly connected to LED input",
              shortDescription: "An SN74AHCT125N output is directly connected to an LED data or clock input.",
              description: "{{output}} is directly connected to {{input}} on {{led}}. This signal path should typically include a series resistor of about 68 ohms.",
              recommendation: "Place a resistor of about 68 ohms between the SN74AHCT125N output and the LED data/clock input."
            },
            digitalLedSignalGroupGroundMissing: {
              title: "Digital LED input group has no GND",
              shortDescription: "A data or clock input is connected, but the GND of the same LED input group is not connected.",
              description: "{{component}} has connected digital signal inputs in group {{group}} ({{signals}}), but no GND connection in the same group.",
              recommendation: "Connect the GND pin of the same LED strip group (_start, _end, or _middle_N) to the common ground net."
            }
          }
        }
      }
    },
    simulation: {
      title: "Simulate current flow",
      inDevelopmentTitle: "Simulations are still in development",
      comingSoon: "Simulation of power distribution will be implemented in future. Stay tuned!",
      settings: "Settings",
      brightness: "Brightness: {{value}}%",
      buttonRun: "Simulate",
      buttonDelete: "Delete results",
      notRun: "No simulation has been run yet.",
      running: "Simulation is running...",
      invalidated: "Simulation results were removed because the diagram changed.",
      blockedTitle: "Simulation not started",
      blockedDescription: "Run a current diagram check without errors before starting the simulation.",
      diagramCheckDebugBypass: "Debug mode: simulation starts without diagram-check gating.",
      diagramCheckGate: {
        "not-checked": {
          title: "Diagram check required",
          description: "Run the diagram check before starting the simulation."
        },
        stale: {
          title: "Diagram check is outdated",
          description: "The diagram changed after the last check. Run the diagram check again."
        },
        "has-errors": {
          title: "Diagram check has {{count}} error(s)",
          description: "Fix the diagram-check errors before starting the simulation. Warnings do not block simulation."
        }
      },
      modelReadyTitle: "Simulation model created",
      modelReadyDescription: "{{components}} simulated component(s), {{wires}} simulated wire(s).",
      failedTitle: "Simulation failed",
      failedDescription: "The simulation model could not be created. Check the messages below.",
      workerFailedTitle: "Simulation worker failed",
      noIssues: "No simulation messages.",
      issueCount: "{{count}} simulation message(s)",
      affectedElements: "Affected elements",
      targetPin: "{{component}} - {{pin}}",
      targetWire: "Wire: {{source}} -> {{target}}",
      targetComponent: "{{component}}",
      ledVoltagePlot: {
        title: "LED strip voltage plot",
        openButton: "Show LED voltage plot",
        closeButton: "Close",
        modalTitle: "LED voltage over length: {{component}}",
        xAxis: "Length along strip (m)",
        yAxis: "VLED (V)",
        ledCounts: "Logical LEDs: {{logical}}; physical LEDs: {{physical}}",
        minVoltage: "Minimum {{voltage}} V at {{distance}} m",
        pointTooltip: "{{distance}} m: {{voltage}} V, section {{section}}, LED {{index}}"
      },
      issues: {
        dcdcInputPowerAmbiguous: {
          title: "DCDC input power limit is ambiguous",
          description: "Multiple input voltage sources are passively reachable from this DCDC input. The dynamic input-power limit was not calculated because source sharing is not modeled."
        },
        dcdcInputPowerLimited: {
          title: "DCDC input power limited",
          description: "DCDC output current {{current}} A exceeds the dynamic input-power limit {{limit}} A. The output voltage was reduced by the DCDC input power model."
        },
        currentLimit: {
          title: "Current limit exceeded",
          description: "Voltage source current {{current}} A exceeds limit {{limit}} A. The output voltage was reduced by the source overload model."
        },
        currentLimitReduced: {
          description: "Voltage source load exceeded limit {{limit}} A before output voltage reduction. Final current is {{current}} A after output voltage reduction."
        },
        currentLimitExtreme: {
          title: "Current limit exceeded too far",
          description: "Voltage source current {{current}} A is above 150% of the limit {{limit}} A. Simulation was stopped."
        },
        fuseCurrent: {
          title: "Fuse current exceeded",
          description: "Fuse current {{current}} A exceeds nominal current {{limit}} A."
        },
        pinVoltageLow: {
          title: "Supply voltage is too low",
          description: "Supply voltage is {{voltage}} V, below the minimum {{limit}} V."
        },
        pinVoltageHigh: {
          title: "Supply voltage is too high",
          description: "Supply voltage is {{voltage}} V, above the maximum {{limit}} V."
        },
        ledStripSupplyVoltageLow: {
          title: "LED strip supply voltage is too low",
          description: "VLED at a connected LED strip supply point is {{voltage}} V, below the minimum {{limit}} V. Increase the power supply voltage, or increase the available power if the power supply is current-limiting."
        },
        ledStripVoltageDropHigh: {
          title: "LED strip voltage drop is too high",
          description: "The connected supply points are within range, but the lowest VLED along the strip is {{voltage}} V, below the minimum {{limit}} V. Add more power injection points along the LED strip."
        },
        ledStripVoltageLow: {
          title: "LED strip voltage is too low",
          description: "Lowest LED strip voltage is {{voltage}} V, below the minimum {{limit}} V."
        },
        ledStripVoltageHigh: {
          title: "LED strip voltage is too high",
          description: "Highest LED strip voltage is {{voltage}} V, above the maximum {{limit}} V."
        },
        unpoweredSubnet: {
          title: "Unpowered subcircuit ignored",
          description: "A valid simulation subcircuit is not reachable from a voltage source and was ignored."
        },
        solverFailed: {
          title: "Simulation solver failed",
          description: "Solver returned status {{status}}."
        },
        solverNotConverged: {
          title: "Simulation solver did not converge",
          description: "Voltage-dependent LED currents did not converge within the iteration limit."
        }
      },
      severity: {
        error: "Error",
        warning: "Warning",
        info: "Info"
      },
      colorModes: {
        rgbWhite: "RGB white",
        separateWhite: "Separate white",
        separateAndRgbWhite: "Separate + RGB white",
        red: "Red",
        green: "Green",
        blue: "Blue"
      }
    },
    tools: {
      title: "Tools",
      rerouteAllButton: "Re-route all wires",
      rerouteAllTooltip: "Sequentially re-route all wires with Pathfinder",
      rerouteAllDisabledPF: "Only available in Auto/PF connection mode",
      rerouteAllDisabledEmpty: "There are no wires in the diagram",
      rerouteAllDescription: "Routes short component pairs first and keeps wire IDs, connections, and properties.",
      rerouteAllSuccess: "All wires were re-routed."
    },
    export: {
      title: "Save / export / examples",
      buttonSave: "Save model",
      buttonSaveAs: "Save model as...",
      buttonExportPNG: "Export model to PNG file",
      buttonExportJPEG: "Export model to JPEG file",
      buttonExportSVG: "Export model to SVG file",
      buttonOpen: "Open model...",
      buttonShare: "Generate public link to the model",
      currentFile: "Current file: {{name}}",
      saveAsModalTitle: "Save model as",
      saveAsModalOk: "Save",
      dividerExport: "Export",
      dividerSaveOpen: "Save / Open",
      dividerShare: "Share",
      dividerExamples: "Load examples",
      share: {
        modalTitle: "Share model - generate link",
        modalLinkText: "Link:",
        modalLinkBeingGenerated: "... generating ... please wait ...",
        modalButtonOK: "OK",
        modalButtonClose: "Close",
        modalButtonCancel: "Cancel",
        modalAttentionText: 'When you click "OK" your model, along with all the entered data, will be transferred to a public server (https://github.com) and saved there. For this purpose, your model data and your IP address will also be transferred to https://wled-api.myhome-control.de/. You will then be shown a link that you can use to share the model with others.',
        modalLinkError: "An error occurred! Please try again if necessary.",
        tooltipCopyLink: "Copy link to clipboard",
        messageLinkCopied: "Link copied to clipboard!"
      },
      selectExample: "Select example ..."
    }
  },
  footRow: {
    legalNotice: {
      title: "Legal notice",
      responsible: "Responsible: Wladislaw Waag",
      address: "Address: Wasserburger Landstr. 29, 81825 Munich, Germany",
      contact: "Contact: +49 (0) 176 47 11 5206, info@myhome-control.de",
      disputeText: "",
      disputeSettlmentText: "Consumer dispute settlement / universal arbitration board: We are neither willing nor obliged to participate in dispute settlement proceedings before a consumer arbitration board."
    },
    dataPrivacy: {
      title: "Data privacy",
      text1: "This page is hosted and operated as part of 'Github Pages'. It is possible and probable that Github collects and processes personal data, which then also affects visitors of the wled-compile.github.io web page. We have, however, no influence on it. Please read the Github privacy statement:",
      text2: "In addition, as soon as you use 'Share' functionality, your IP address, the model you created and all the data you entered forwarded to https://myhome-control.de and to https://github.com/wled-development/wled-wiring-store. This is absolutely necessary for this functionality. The data protection declaration for https://myhome-control.de can be found at",
      text3: "Our website contains links to external websites over which we have no control. We cannot accept any liability for this third-party content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at that time. If we become aware of any legal violations, we will remove the relevant link immediately."
    },
    links: {
      title: "Useful links",
      link1Text: "Official WLED documentation:",
      link2Text: "WLED FAQ:",
      link3Text: "WLED Calculator:",
      link4Text: "Extended WLED Online Installer:",
      link5Text: "Compile your own WELD SW online:",
      link6Text: "Buy WLED Controller (Germany):",
      link7Text: "Buy WLED Controller (worldwide):"
    },
    contribute: {
      title: "Contribute/GitHub",
      text: "Contributions are highly appreciated! If you'd like to contribute, please follow the project's GitHub link:"
    }
  },
  examples: {
    example1: "ESP32 uC + Level Shifter + DC/DC + 24V LED strip",
    example2: "ABC! WLED Controller + 24V LED Strip",
    example3: "ABC! WLED Controller + long 24V LED Strip + LineIn + Ethernet",
    example4: "ABC! WLED Controller + Long Range Extension",
    example5: "ABC! WLED Controller + Anal. 24V LED Strip + PWM Board"
  },
  compData: {
    Router: {
      name: "WAN/LAN Router",
      description: "A generic WLAN/LAN router.",
      descriptionShort: "generic"
    },
    Button: {
      name: "Push Button",
      description: "A generic push button. When pressed and held, the contact is closed. The contact opens as soon as the button is released. Not to be confused with a switch.",
      descriptionShort: "generic"
    },
    DC_JACK_FEMALE: {
      name: "DC Connector",
      description: "Used to split a power supply with a DC connector into a + and - wire.",
      descriptionShort: "for up to 3A"
    },
    Elko: {
      name: "Electrolytic Capacitor",
      description: "An electrolytic capacitor with selectable capacitance. Pay attention to polarity! Often used to stabilize the power supply for LEDs or other components.",
      descriptionShort: "selectable capacitance"
    },
    ESP32_30P: {
      name: "ESP32 uC 30 Pins",
      description: "ESP32 controller, version with 30 pins. Also known as NodeMCU.",
      descriptionShort: "controller"
    },
    ESP32_38P: {
      name: "ESP32 uC 38 Pins",
      description: "ESP32 controller, version with 38 pins. Also known as NodeMCU.",
      descriptionShort: "controller"
    },
    ESP32C3D1mini: {
      name: "ESP32-C3 D1 mini",
      description: "ESP32-C3 controller in D1 mini format. WLED can run on this controller type with limitations.",
      descriptionShort: "controller"
    },
    ESP32C3_supermini: {
      name: "ESP32-C3 supermini",
      description: "ESP32-C3 controller, supermini. WLED can run on this controller type with limitations.",
      descriptionShort: "Controller"
    },
    ESP32D1mini: {
      name: "ESP32 D1 mini",
      description: "ESP32 controller in D1 mini format.",
      descriptionShort: "controller"
    },
    ESP32S3D1mini: {
      name: "ESP32-S3 D1 mini",
      description: "ESP32-S3 controller in D1 mini format. WLED can run on this controller type with limitations.",
      descriptionShort: "controller"
    },
    ESP8266D1mini: {
      name: "ESP8266 D1 mini",
      description: "ESP8266 controller in D1 mini format. No longer recommended for new WLED projects (too weak).",
      descriptionShort: "controller"
    },
    InfoNode: {
      name: "Text",
      description: "A text element to add labels or notes to the diagram.",
      descriptionShort: "for notes etc."
    },
    INMP441: {
      name: "INMP441 microphone",
      description: "INMP441 microphone. It is a digital microphone supported by WLED for sound-reactive effects and delivers high quality.",
      descriptionShort: "digital"
    },
    IR_KY022: {
      name: "KY022 IR receiver",
      description: "KY-022 infrared receiver, supported by WLED, allows controlling WLED with an IR remote.",
      descriptionShort: "infrared"
    },
    IR_TSOP38238: {
      name: "TSOP38238 IR Receiver",
      description: "TSOP38238 infrared receiver, supported by WLED, allows controlling WLED with an IR remote.",
      descriptionShort: "infrared"
    },
    Kerko: {
      name: "Ceramic Capacitor",
      description: "Ceramic capacitor with selectable capacitance. Commonly used at the input of switching electronic circuits (between power and ground) to suppress noise. Should be connected using the shortest possible leads/traces.",
      descriptionShort: "selectable capacitance"
    },
    LineBoxNode: {
      name: "Rectangle",
      description: "An element to draw a rectangle (filled or empty).",
      descriptionShort: "drawing element"
    },
    miniOTOFuse: {
      name: "Melting Fuse",
      description: "A fuse from the automotive sector. Ideal for voltages up to 32V. Only buy from specialized dealers, as many cheap copies on marketplaces do not function properly. WLED calculator (www.wled-calculator.github.io) can be used for dimensioning.",
      descriptionShort: "selectable 4-30A"
    },
    FUSE_Board: {
      name: "Fuse board",
      description: "For power distribution and fusing.",
      descriptionShort: "4 channels"
    },
    PIR_HCSR501: {
      name: "HC-SR501 PIR Sensor",
      description: "PIR motion sensor of type HCSR501. Can be used with WLED.",
      descriptionShort: "motion detector"
    },
    PLUG_LNPE: {
      name: "Power Plug",
      description: "Plug for 230V power outlets. Warning: Risk of death! Only use if you have appropriate knowledge.",
      descriptionShort: "for 230V AC"
    },
    PSU_HP: {
      name: "Power supply",
      description: "Power supply with selectable voltage/current (power). These are typically high-performance supplies used for larger setups. Power plug must be connected separately.",
      descriptionShort: "selectable V/I"
    },
    PSU_USB: {
      name: "USB Power Supply",
      description: "USB power supply with 5V output voltage and selectable current up to 5A.",
      descriptionShort: "5V, selectable I"
    },
    PSU_USB_WIRES: {
      name: "USB Power Supply",
      description: "USB power supply with 5V output voltage, selectable current up to 5A, and separate +/- wires.",
      descriptionShort: "5V, separate +/- wires"
    },
    Resistor: {
      name: "Resistor",
      description: "Electrical resistor of selectable value.",
      descriptionShort: "selectable value"
    },
    SN74AHCT125N: {
      name: "Level Shifter",
      description: "A level shifter type recommended for WLED. A level shifter is necessary to convert the microcontroller's control signal (3.3V) to the LED data input (5V) level for addressable LEDs. Without a level shifter, flickering often occurs (almost always with 12V and 24V LEDs).",
      descriptionShort: "SN74AHCT125N"
    },
    SolderJoint: {
      name: "Solder Joint",
      description: "Representation of a solder joint, e.g., to connect wires together.",
      descriptionShort: "for wires etc."
    },
    WAGO_2X: {
      name: "WAGO Connector 2x",
      description: "Widely used spring clamp connector, two-way.",
      descriptionShort: "spring clamp"
    },
    WAGO_3X: {
      name: "WAGO Connector 3x",
      description: "Widely used spring clamp connector, three-way.",
      descriptionShort: "spring clamp"
    },
    WireInfoNode: {
      name: "Wire Info",
      description: "Information about the wire.",
      descriptionShort: " "
    },
    WS2812B_5V_30LPM: {
      name: "WS2812B RGB",
      description: "WS2812 RGB LED strip, 5V, 30 LEDs per meter, individually addressable LEDs.",
      descriptionShort: "5V, 30 LEDs/m"
    },
    MHC_V43: {
      name: "WLED V43 Controller",
      description: "A professional WLED controller for 5V, 12V or 24V addressable LEDs. Includes ESP32 microcontroller, SN74AHCT level shifter, fuse, capacitor, EMI filter. Optional accessories include Ethernet adapter, INMP441 microphone, line-in adapter, and USB adapter.",
      descriptionShort: "ESP32 based"
    },
    MHC_V57: {
      name: "WLED PRO V57 Controller",
      description: "A professional WLED controller for 5V, 12V or 24V addressable LEDs. Includes ESP32 microcontroller (8MB Flash, 2MB PSRAM), SN74AHCT level shifter, fuse, capacitor, EMI filter, iMOSFET. Optional accessories include Ethernet adapter, INMP441 microphone, line-in adapter, and USB adapter.",
      descriptionShort: "ESP32 based"
    },
    MHC_SwitchBoard: {
      name: "WLED switch board",
      description: "A better/modern alternative to relais board for switching LEDs completely off. Overcurrent, overtemperature, short circuit, and reverse polarity protection.",
      descriptionShort: "universal for 5-24V"
    },
    MHC_PWMBoard: {
      name: "WLED PWM board",
      description: "The board uses MOSFETs to control analog LED strips with PWM signals. 3 channels, each max. 5A. Overcurrent, overtemperature, short circuit, and reverse polarity protection.",
      descriptionShort: "universal for 12-48V"
    },
    MHC_RS485_R: {
      name: "RS-485 receiver",
      description: "RS-485 receiver for use as a range extender receiver with the RS-485 adapter.",
      descriptionShort: "RS-485 receiver"
    },
    MHC_Relay5V: {
      name: "5V Relay Board",
      description: "A professional relay board for use with 5V addressable LEDs. Allows turning off the LED strips when not in use via relays, saving energy, extending LED strip life, and increasing safety. Two paths allow two separate controls or, e.g., control of two power inputs.",
      descriptionShort: "for 5V LEDs"
    },
    MHC_Relay12V: {
      name: "12V Relay Board",
      description: "A professional relay board for use with 12V addressable LEDs. Allows turning off the LED strips when not in use via relays, saving energy, extending LED strip life, and increasing safety. Two paths allow two separate controls or, e.g., control of two power inputs.",
      descriptionShort: "for 12V LEDs"
    },
    MHC_Relay24V: {
      name: "24V Relay Board",
      description: "A professional relay board for use with 24V addressable LEDs. Allows turning off the LED strips when not in use via relays, saving energy, extending LED strip life, and increasing safety. Two paths allow two separate controls or, e.g., control of two power inputs.",
      descriptionShort: "for 24V LEDs"
    },
    AUDIO_SOURCE: {
      name: "Audio Source",
      description: "A generic audio signal source.",
      descriptionShort: "Line-out"
    },
    LM2596_PCB: {
      name: "LM2596 DC/DC",
      description: "DC/DC (step-down) converter with adjustable output voltage.",
      descriptionShort: "adjustable output"
    },
    IRLZ44N: {
      name: "IRLZ44N",
      description: "MOSFET. This type is recommended for use with WLED and can be used to control analog LED strips.",
      descriptionShort: "N-Ch MOSFET"
    },
    DCDC_mini: {
      name: "DC/DC Mini",
      description: "DC/DC (step-down) converter with adjustable output voltage.",
      descriptionShort: "adjustable output"
    },
    WS2814_24V_60LPM: {
      name: "WS2814 RGBW",
      description: "RGBW LED strip, individually addressable LEDs in groups of 6 (1 logical LED = 6 physical).",
      descriptionShort: "24V, 60 LEDs/m"
    },
    WS2813_5V_60LPM: {
      name: "WS2813 RGB",
      description: "RGB LED strip with backup-line.",
      descriptionShort: "5V, 60 LEDs/m"
    },
    WS2815_12V_30LPM: {
      name: "WS2815 RGB",
      description: "RGB LED strip with backup-line.",
      descriptionShort: "12V, 30 LEDs/m"
    },
    WS2814_12V_30LPM: {
      name: "WS2814 RGBW",
      description: "RGBW LED strip, individually addressable LEDs in groups of 3 (1 logical LED = 3 physical).",
      descriptionShort: "12V, 30 LEDs/m"
    },
    WS2818_12V_30LPM: {
      name: "WS2818 RGB",
      description: "RGB LED strip, individually addressable LEDs in groups of 3 (1 logical LED = 3 physical).",
      descriptionShort: "12V, 30 LEDs/m"
    },
    FCOB_12V_720LPM: {
      name: "FCOB RGB",
      description: "FCOB RGB LED strip, 720 LEDs/m (240 LEDs each color per meter, 20 logical LEDs/m)",
      descriptionShort: "12V, 720 LEDs/m"
    },
    FCOB_24V_720LPM: {
      name: "FCOB RGB",
      description: "FCOB RGB LED strip, 720 LEDs/m (240 LEDs each color per meter, 20 logical LEDs/m)",
      descriptionShort: "24V, 720 LEDs/m"
    },
    FCOB_24V_784LPM: {
      name: "FCOB RGBW",
      description: "FCOB RGBW LED strip, 784 LEDs/m (196 LEDs each color per meter, 14 logical LEDs/m)",
      descriptionShort: "24V, 784 LEDs/m"
    },
    APA102_5V_30LPM: {
      name: "APA102 RGB",
      description: "APA102 LED strip with clock signal, 5V, 30 LEDs/Meter, individually addressable LEDs.",
      descriptionShort: "5V, 30 LEDs/m"
    },
    AN_WHITE_24V_240LPM: {
      name: "Analogue white",
      description: "Analogues LED strip (white 2835 LEDs), 24V, 240 LEDs/m, 2.5 cm segments (6 LEDs)",
      descriptionShort: "24V, 240 white LEDs/m"
    },
    AN_RGB_CCT_48V_90LPM: {
      name: "Anal. RGB CCT",
      description: "Analogues RGB CCT LED strip (5050 LEDs), 48V, 90 LEDs/m, segemnts of 16.65 cm (15 LEDs)",
      descriptionShort: "48V, 90 LEDs/m"
    },
    AN_RGB_24V_120LPM: {
      name: "Anal. RGB ",
      description: "Analogues RGB LED strip (2835 LEDs), 24V, 120 LEDs/m, segments of 5 cm (6 LEDs)",
      descriptionShort: "24V, 120 LEDs/m"
    },
    WS2805_24V_60LPM: {
      name: "WS2805 RGBW CCT",
      description: "RGBW CCT LED strip (digital), individually addressable LEDs in groups of 6 (1 logical LED = 6 physical).",
      descriptionShort: "24V, 60 LEDs/m"
    },
    WS2805_12V_60LPM: {
      name: "WS2805 RGBW CCT",
      description: "RGBW CCT LED strip (digital), individually addressable LEDs in groups of 6 (1 logical LED = 6 physical).",
      descriptionShort: "12V, 60 LEDs/m"
    }
  }
};

// src/translations/de.json
var de_default = {
  title: "Willkommen bei WLED Wiring Designer!",
  dragComponents: "Beginne mit dem Ziehen von Komponenten auf die Arbeitsfl\xE4che oder lade ein Beispiel",
  componentGroupTypes: {
    controller: "Controller",
    led: "LEDs",
    psu: "Netzteile",
    levelshifter: "Level Shifter",
    electronics: "Elektronik/Bauteile",
    others: "Sonstiges"
  },
  buttons: {
    rotate: "Drehen",
    longer: "Vergr\xF6\xDFern",
    shorter: "Verkleinern"
  },
  tooltip: {
    deleteWire: "Diese Verbindung l\xF6schen",
    selectColor: "Farbe ausw\xE4hlen",
    selectWireLength: "Kabell\xE4nge ausw\xE4hlen (physikalisch)",
    selectWireCrossSection: "Kabelquerschnitt ausw\xE4hlen (physikalisch)",
    selectWireWidth: "Kabelbreite ausw\xE4hlen (f\xFCr Zeichnung)",
    selectWireNetwork: "Ganzes Netz ausw\xE4hlen",
    clearWireNetwork: "Netzauswahl aufheben",
    putWireInfoNode: "Kabel Infobox hinzuf\xFCgen",
    rerouteWire: "Wire mit Pathfinder neu routen",
    startConnection: "Verbindung starten",
    closeConnection: "Verbindung abschliessen",
    rotateLeft: "Nach Links drehen",
    rotateRight: "Nach Rechts drehen",
    delete: "L\xF6schen",
    copy: "Kopie erstellen",
    enlarge: "Verl\xE4ngern",
    shorten: "Vrk\xFCrzen",
    switchFilled: "Bef\xFCllt / nur mit Rand",
    increaseTextSize: "Text vergr\xF6\xDFern",
    decreaseTextSize: "Text verkleinern",
    textSize: "Textgr\xF6\xDFe",
    selectFont: "Schriftart ausw\xE4hlen",
    toggleBold: "Fett umschalten",
    textAlign: "Textausrichtung",
    selectMulti: "Mehrfachauswahl",
    deleteSelected: "Auswahl l\xF6schen",
    componentInfo: "Komponenten-Info anzeigen",
    switchConnLineType: "Verbindungstyp umschalten",
    ledSimulationOptions: "LED-Simulation einstellen"
  },
  ledSimulationOptions: {
    title: "LED-Simulation",
    recommended: "empfohlen",
    unknownOption: "Unbekannte Option. Aktualisiere diese Komponente aus der aktuellen Vorlage.",
    fields: {
      supplyResistance: "Positiver Pfad / V+ Widerstand",
      gndResistance: "Negativer Pfad / GND Widerstand",
      currentCurve: "LED-Stromkennlinie"
    },
    resistance: {
      typical_5mm: {
        name: "Typischer Streifen 5 mm Breite",
        description: "Typischer Kupferpfad fuer einen 5-mm-LED-Streifen: 0,12 Ohm pro Meter."
      },
      good_5mm: {
        name: "Guter Streifen 5 mm Breite",
        description: "Besserer Kupferpfad fuer einen 5-mm-LED-Streifen: 0,09 Ohm pro Meter."
      },
      poor_5mm: {
        name: "Schlechter Streifen 5 mm Breite",
        description: "Hoeherer Widerstand fuer einen schwachen 5-mm-LED-Streifen: 0,24 Ohm pro Meter."
      },
      narrow_fcob_path_good: {
        name: "Guter schmaler FCOB-Pfad",
        description: "Guter Kupferpfad fuer einen FCOB-Streifen (schmale Seite, geteilt mit Datenpfad): 0,12 Ohm pro Meter."
      },
      narrow_fcob_path_typical: {
        name: "Typischer schmaler FCOB-Pfad",
        description: "Typischer Kupferpfad fuer einen FCOB-Streifen (schmale Seite, geteilt mit Datenpfad): 0,16 Ohm pro Meter."
      },
      narrow_fcob_path_bad: {
        name: "Schlechter schmaler FCOB-Pfad",
        description: "Hoeherer Widerstand fuer einen FCOB-Streifen (schmale Seite, geteilt mit Datenpfad): 0,22 Ohm pro Meter."
      },
      bright_fcob_path_good: {
        name: "Guter High-Power-FCOB-Pfad",
        description: "Guter Kupferpfad fuer einen FCOB-Streifen (breite, voll genutzte Seite): 0,06 Ohm pro Meter."
      },
      bright_fcob_path_typical: {
        name: "Typischer High-Power-FCOB-Pfad",
        description: "Typischer Kupferpfad fuer einen FCOB-Streifen (breite, voll genutzte Seite): 0,08 Ohm pro Meter."
      },
      bright_fcob_path_bad: {
        name: "Schlechter High-Power-FCOB-Pfad",
        description: "Hoeherer Widerstand fuer einen FCOB-Streifen (breite, voll genutzte Seite): 0,20 Ohm pro Meter."
      }
    },
    currentCurve: {
      ws2814_24v_typical: {
        name: "Typische WS2814 24 V",
        description: "Typische spannungsabhaengige WS2814-24-V-Stromkennlinie."
      },
      ws2812b_5v_typical: {
        name: "WS2812B 5 V (typisch)",
        description: "WS2812B RGB 5 V, LED-Groesse 5050, typische Version."
      },
      ws2812b_5v_good: {
        name: "WS2812B 5 V (gut)",
        description: "WS2812B RGB 5 V, LED-Groesse 5050, gute/neue Version (verbesserte Farbstabilitaet)."
      },
      ws2812b_eco_5v_typical: {
        name: "WS2812B ECO 5 V (typisch)",
        description: "WS2812B RGB ECO 5 V, LED-Groesse 5050, typische Version."
      },
      ws2811_24v_typical: {
        name: "WS2811 24 V (typisch)",
        description: "WS2811 RGB 24 V, LED-Groesse 5050, typische Version."
      },
      ws2814_12v_typical: {
        name: "WS2814 12 V (typisch)",
        description: "WS2812B RGBW 12 V, LED-Groesse 5050, typische Version."
      },
      ws28xx_fcob_rgb_24v_720lpm_typical: {
        name: "WS28xx FCOB RGB 24 V, 720 LEDs/m (typisch)",
        description: "WS28xx FCOB RGB 24 V, 720 LEDs/m, 20 logische LEDs/m, typische Version."
      },
      ws28xx_fcob_rgb_12v_720lpm_typical: {
        name: "WS28xx FCOB RGB 12 V, 720 LEDs/m (typisch)",
        description: "WS28xx FCOB RGB 12 V, 720 LEDs/m, 20 logische LEDs/m, typische Version."
      },
      ws28xx_fcob_rgbw_24v_784lpm_typical: {
        name: "WS28xx FCOB RGBW 24 V, 784 LEDs/m (typisch)",
        description: "WS28xx FCOB RGB 24 V, 784 LEDs/m, 14 logische LEDs/m, typische Version."
      },
      sk6812_fcob_rgb_5v_240lpm_typical: {
        name: "SK6812 FCOB RGB 5 V, 240 LEDs/m (typisch)",
        description: "SK6812 FCOB RGB 5 V, 240 LEDs/m, 80 logische LEDs/m, typische Version."
      }
    }
  },
  componentEditor: {
    title: "Komponenten-Editor",
    valid: "gueltig",
    invalid: "ungueltig",
    actions: {
      new: "Neu",
      openCore: "Eingebaute Komponente oeffnen",
      openLocal: "Lokalen Entwurf oeffnen",
      saveLocal: "Lokal speichern",
      importJson: "JSON importieren",
      exportJson: "JSON exportieren",
      backToDesigner: "Zurueck zum Designer",
      addHandle: "Anschluss hinzufuegen",
      deleteHandle: "Anschluss loeschen",
      addField: "Feld hinzufuegen",
      deleteField: "Feld loeschen",
      addOption: "Option hinzufuegen",
      addConnection: "Verbindung hinzufuegen",
      deleteConnection: "Verbindung loeschen",
      addSimulationElement: "Simulationselement hinzufuegen",
      deleteSimulationElement: "Simulationselement loeschen"
    },
    tabs: {
      basics: "Stammdaten",
      geometry: "Geometrie",
      handles: "Anschluesse",
      fields: "Felder",
      connections: "Verbindungen",
      simulation: "Simulation",
      runtime: "Runtime"
    },
    fields: {
      id: "Komponenten-ID",
      version: "Version",
      name: "Name",
      descriptionShort: "Kurzbeschreibung",
      description: "Beschreibung",
      group: "Gruppe",
      showName: "Name anzeigen",
      imageUrl: "Bild-URL",
      imageWidth: "Bildbreite",
      imageHeight: "Bildhoehe",
      rotation: "Rotation",
      borderWidth: "Randbreite",
      lengthStep: "Physikalischer Laengenschritt",
      rotatable: "Drehbar",
      resizableX: "X skalierbar",
      resizableY: "Y skalierbar",
      noBackgroundImage: "Kein Hintergrundbild",
      handleId: "Anschluss-ID",
      handleType: "Anschluss-Typ",
      functions: "Funktionen",
      borderColor: "Randfarbe",
      borderType: "Randtyp",
      borderLineWidth: "Randbreite",
      borderRadius: "Randradius",
      hideConditions: "Ausblendbedingungen",
      fieldId: "Feld-ID",
      fieldType: "Feldtyp",
      unit: "Einheit",
      selectedValue: "Ausgewaehlter Wert",
      connectionKind: "Verbindungsart",
      fromHandle: "Von Anschluss",
      toHandle: "Zu Anschluss",
      elementId: "Element-ID",
      elementType: "Elementtyp"
    },
    editorModes: {
      ui: "UI",
      json: "JSON"
    },
    labels: {
      unnamed: "Ohne Namen",
      terminals: "Terminals",
      parameters: "Parameter"
    },
    sections: {
      applyHandles: "Anschluesse anwenden",
      applyFields: "Felder anwenden",
      applyConnections: "Verbindungen anwenden",
      applySimulation: "Simulation anwenden",
      applyRuntime: "Runtime anwenden",
      handlesDescription: "Bearbeite die Anschluesse als Schema-JSON. Die Validierung prueft IDs, Groessen, Funktionen, Hide-Conditions und Referenzen.",
      fieldsDescription: "Bearbeite Nummern- und Auswahlfelder als Schema-JSON. Auswahloptionen koennen optionale Bilddefinitionen enthalten.",
      connectionsDescription: "Bearbeite interne Short- und Fuse-Verbindungen als Schema-JSON.",
      simulationDescription: "Bearbeite die Simulationsdefinition als Schema-JSON, oder nutze null fuer keine Simulationsdaten.",
      runtimeDescription: "Bearbeite bestehende reine Runtime-UI-Optionen als Schema-JSON, oder nutze null wenn keine benoetigt werden."
    },
    preview: {
      title: "Vorschau",
      selectedHandle: "Ausgewaehlter Anschluss",
      selectHandle: "Anschluss auswaehlen",
      nudge: "Um 1 px verschieben"
    },
    validation: {
      title: "Validierung",
      noIssues: "Keine Validierungsprobleme."
    },
    messages: {
      savedLocal: "Komponentenentwurf lokal gespeichert.",
      imported: "Komponentenpaket importiert.",
      importFailed: "Komponentenpaket konnte nicht importiert werden.",
      invalidJson: "Ungueltiges JSON",
      noHandles: "Noch keine Anschluesse vorhanden. Fuege einen Anschluss hinzu, um seine Eigenschaften zu bearbeiten.",
      noFields: "Noch keine Felder vorhanden. Fuege ein Feld hinzu, um seine Eigenschaften zu bearbeiten.",
      noConnections: "Noch keine Verbindungen vorhanden. Fuege eine Verbindung hinzu, um ihre Eigenschaften zu bearbeiten.",
      noSimulationElements: "Noch keine Simulationselemente vorhanden. Fuege ein Simulationselement hinzu, um seine Eigenschaften zu bearbeiten."
    }
  },
  popover: {
    selectWireLength: "Kabell\xE4nge ausw\xE4hlen (physikalisch):",
    selectWireCrossSection: "Kabelquerschnitt ausw\xE4hlen (physikalisch):",
    selectWireWidth: "Kabelbreite ausw\xE4hlen (f\xFCr Zeichnung):",
    startConnection: "W\xE4hlen Sie den Start-Pin/Anschluss f\xFCr die Verbindung:",
    closeConnection: "Verbindung zu diesem Pin/Anschluss abschliessen:"
  },
  select: {
    startConnection: "Pin/Anschluss w\xE4hlen",
    closeConnection: "Pin/Anschluss w\xE4hlen"
  },
  message: {
    startPinSelected: "Pin/Anschluss gew\xE4hlt. Jetzt Ziel-Pin/Anschluss w\xE4hlen",
    closePinSelected: "Die Verbindung wurde erstellt.",
    startPinFirst: "Bitte erst ein Start-Pin/Anschluss w\xE4hlen!",
    theSamePin: "Start-Pin/Anschluss und Ziel-Pin/Anschluss sind gleich!",
    compAddSuccess: "Zum Diagram hinzugef\xFCgt!",
    loadModelSuccess: "Das WLED-Verdrahtungsmodell wurde erfolgreich geladen!",
    loadModelSuccessShort: "Erfolg",
    loadingModel: "Verdrahtungsmodell wird aus Dateilink geladen ...",
    loadModelError: "Das WLED-Verdrahtungsmodell kann nicht geladen werden. M\xF6glicherweise ist dieser Link nicht mehr g\xFCltig.",
    loadModelErrorShort: "Fehler",
    loadModelWrongLink: "Der Link ist nicht korrekt! Bitte \xFCberpr\xFCfen.",
    saveModelSuccess: "Modell gespeichert.",
    saveModelDownloadStarted: "Modelldownload gestartet.",
    saveModelError: "Das Modell konnte nicht gespeichert werden.",
    componentUpdatesApplied: "Die \xC4nderungen wurden angewendet. Bitte \xFCberpr\xFCfe diese Komponente.",
    componentUpdatesAppliedShort: "Updates angewendet",
    componentUpdatesAvailableTitle: "Komponenten-Updates verf\xFCgbar",
    componentUpdatesAvailableDescription: "{{count}} Komponente(n) in diesem Diagramm k\xF6nnen auf die aktuelle Vorlage aktualisiert werden. Jetzt alle Komponenten aktualisieren?",
    componentUpdatesApplyAll: "Alle aktualisieren",
    componentUpdatesSkip: "Nicht aktualisieren",
    componentUpdatesAllApplied: "{{count}} Komponenten-Update(s) wurden angewendet."
  },
  sidebar: {
    components: {
      title: "Komponenten",
      popoverTitle: "Komponenten-Info",
      addButtonText: "Zum Diagramm zuf\xFCgen",
      updateButtonText: "Diese Komponente aktualisieren",
      updatePopoverTitle: "\xC4nderungen an dieser Komponente",
      applyUpdatesButtonText: "\xC4nderungen anwenden",
      updateExplanation: "Diese im Diagramm verwendete Komponente hat einen \xE4lteren Stand als die aktuelle Komponente im Programm. Die folgenden \xC4nderungen k\xF6nnen \xFCbertragen werden.",
      noUpdateChanges: "Keine \xC4nderungen verf\xFCgbar.",
      updateValueMissing: "Fehlt",
      updateChangeProperty: "Eigenschaft",
      updateChangeCurrent: "Aktuell",
      updateChangeTemplate: "Vorlage",
      popoverContent: {
        whereToBuy: "Wo kaufen?",
        listOfConnections: "Liste der Pins/Anschl\xFCsse",
        listOfConnectionsHeading1: "Pin / Anschluss",
        listOfConnectionsHeading2: "Beschreibung"
      }
    },
    check: {
      title: "Diagramm \xFCberpr\xFCfen",
      comingSoon: "Regel-basierte \xDCberpr\xFCfung wird im Laufe 2025 implementiert. Stay tuned!",
      buttonRun: "Diagramm jetzt pruefen",
      betaNoticeTitle: "Beta-Version",
      betaNoticeDescription: "Diese Diagrammpruefung ist noch in Entwicklung. Fehlerkennungen koennen unvollstaendig oder falsch sein.",
      notChecked: "Noch keine Pruefung ausgefuehrt.",
      noIssuesTitle: "Keine Probleme gefunden",
      noIssuesDescription: "Die aktuelle Diagrammpruefung hat keine Hinweise gefunden.",
      rulesButton: "Regeln",
      rulesModalTitle: "Verwendete Pruefregeln",
      rulesModalDescription: "Diese Regeln werden aktuell bei der Diagrammpruefung angewendet.",
      issueCount: "{{count}} Ergebnis(se) gefunden",
      recommendation: "Empfehlung",
      affectedElements: "Betroffene Elemente",
      diagnostics: {
        modeLabel: "Diagnosemodus",
        suppressedTag: "unterdrueckt",
        specificity: "Spezifitaet {{value}}",
        suppressedBy: "Unterdrueckt durch: {{ids}}",
        mode: {
          "user-friendly": "Normal",
          diagnostic: "Alle Issues",
          "diagnostic-with-suppression-markers": "Alle + Marker"
        }
      },
      severity: {
        error: "Fehler",
        warning: "Warnung",
        info: "Hinweis"
      },
      classificationLabels: {
        gnd_net_type: "Ground",
        suppl_net_type: "DC-Versorgung",
        digital_net_type: "Digital",
        pwm_net_type: "PWM",
        analog_net_type: "Analog",
        audio_net_type: "Audio",
        eth_net_type: "Ethernet",
        usb_net_type: "USB",
        rs485_a_net_type: "RS485 A",
        rs485_b_net_type: "RS485 B",
        N_net_type: "Neutralleiter",
        L_net_type: "Line",
        PE_net_type: "Schutzleiter"
      },
      signalLabels: {
        digital: "Digital",
        pwm: "PWM",
        analog: "Analog",
        audio: "Audio",
        usb: "USB"
      },
      analogLedColorLabels: {
        red: "Rot",
        green: "Gruen",
        blue: "Blau",
        white: "Weiss",
        warmWhite: "Warmweiss"
      },
      mainsInputLabels: {
        line: "Line",
        neutral: "Neutral",
        pe: "PE"
      },
      rulePlaceholders: {
        signal: "Signal",
        mainsInput: "Netzspannungs"
      },
      invalidWireReasons: {
        "missing-node": "Komponente fehlt",
        "missing-handle": "Pin fehlt",
        "hidden-handle": "Pin ist ausgeblendet"
      },
      issues: {
        diagramEmpty: {
          title: "Diagramm ist leer",
          shortDescription: "Es sind noch keine Komponenten im Diagramm vorhanden.",
          description: "Die Pr\xFCfung kann erst technische Hinweise liefern, wenn Komponenten und Leitungen im Diagramm vorhanden sind.",
          recommendation: "F\xFCge zuerst Komponenten hinzu und starte die Pr\xFCfung danach erneut."
        }
      },
      rules: {
        "network-rules": {
          title: "Netzregeln",
          description: "Prueft grundlegende Fehler in component-linked Netzen.",
          issues: {
            groundMissing: {
              title: "Kein Ground-Netz verbunden",
              shortDescription: "Es gibt GND-Pins, aber kein verbundenes Ground-Netz.",
              description: "Mindestens ein GND-Pin ist im Diagramm vorhanden, aber keiner davon ist verdrahtet. Komponenten mit GND-Bezug brauchen eine gemeinsame Ground-Verbindung.",
              recommendation: "Verbinde die GND-Pins der beteiligten Komponenten miteinander."
            },
            groundMultiple: {
              title: "Mehrere getrennte Ground-Netze",
              shortDescription: "Alle GND-Verbindungen muessen zu einem gemeinsamen Ground-Netz gehoeren.",
              description: "Es wurden {{count}} getrennte Ground-Netze gefunden. Dadurch fehlt eine gemeinsame Referenz zwischen Teilen der Schaltung.",
              recommendation: "Verbinde die getrennten GND-Netze miteinander."
            },
            mainsLowVoltageMixed: {
              title: "Netzspannung und Kleinspannung verbunden",
              shortDescription: "Ein Netz verbindet L/N mit Kleinspannungs- oder Signalanschluessen.",
              description: "Das Netz enthaelt {{classifications}}. Netzspannung darf nicht mit GND, DC-Versorgung oder Signalnetzen verbunden werden.",
              recommendation: "Trenne Netzspannungsleitungen strikt von Kleinspannungs- und Signalverbindungen."
            },
            peActiveMixed: {
              title: "Schutzleiter mit aktiver Leitung verbunden",
              shortDescription: "Ein PE-Netz ist mit aktiver Versorgung oder einem Signalnetz verbunden.",
              description: "Das Netz enthaelt {{classifications}}. PE darf nicht mit L, N, DC-Versorgung oder Signalen verbunden werden.",
              recommendation: "Trenne PE von aktiven Leitern und Signalverbindungen."
            },
            rs485Mixed: {
              title: "RS485 A und B verbunden",
              shortDescription: "Ein Netz verbindet RS485_A mit RS485_B.",
              description: "Die differentiellen RS485-Leitungen A und B duerfen nicht miteinander verbunden werden.",
              recommendation: "Trenne RS485_A und RS485_B in zwei separate Netze."
            },
            mixedClassifications: {
              title: "Unterschiedliche Ausgangstypen verbunden",
              shortDescription: "Ein Netz enthaelt mehrere Netzklassen.",
              description: "Das Netz enthaelt gleichzeitig {{classifications}}. Das bedeutet, dass Ausgaenge unterschiedlicher Typen miteinander verbunden sind.",
              recommendation: "Trenne die unterschiedlichen Ausgangstypen in separate Netze."
            },
            multipleSupplySources: {
              title: "Mehrere unabhaengige Spannungsquellen verbunden",
              shortDescription: "Ein Supply-Netz enthaelt mehrere unabhaengige Spannungsquellen.",
              description: "Das Netz enthaelt {{count}} unabhaengige Spannungsquellen: {{sources}}.",
              recommendation: "Trenne die Spannungsquellen oder stelle sicher, dass nur weitergeleitete Ausgaenge im selben Netz liegen."
            },
            signalSinkWithoutSource: {
              title: "{{signal}}-Eingang ohne Quelle",
              shortDescription: "Ein {{signal}}-Eingang ist verdrahtet, aber im Netz gibt es keine passende Quelle.",
              description: "Das Netz enthaelt {{sinks}}, aber keinen passenden Ausgang fuer {{signal}}.",
              recommendation: "Verbinde den Eingang mit einem passenden Ausgang oder pruefe die Pin-Funktion der beteiligten Komponenten."
            },
            digitalSignalVoltageMismatch: {
              title: "Digitalpegel passt nicht",
              shortDescription: "Ein digitaler Eingang wird mit einer unpassenden Ausgangsspannung angesteuert.",
              description: "{{input}} erlaubt {{min}} V bis {{max}} V, ist aber mit unpassenden digitalen Ausgaengen verbunden: {{sources}}.",
              recommendation: "Verwende einen passenden Level Shifter oder verbinde den Eingang mit einem digitalen Ausgang im erlaubten Spannungsbereich."
            },
            multipleSignalSources: {
              title: "Mehrere {{signal}}-Quellen verbunden",
              shortDescription: "Ein {{signal}}-Netz enthaelt mehrere Ausgaenge.",
              description: "Das Netz verbindet mehrere {{signal}}-Quellen: {{sources}}.",
              recommendation: "Trenne die Ausgaenge voneinander, sodass pro Signalnetz nur eine Quelle angeschlossen ist."
            },
            supplyInputWithoutSource: {
              title: "Supply-Eingang ohne Spannungsquelle",
              shortDescription: "Ein Supply-Eingang ist verdrahtet, aber im Netz gibt es keine Spannungsquelle.",
              description: "Das Netz enthaelt Supply-Eingaenge ({{inputs}}), aber keinen unabhaengigen suppl_out-Ausgang.",
              recommendation: "Verbinde das Netz mit einer passenden Spannungsquelle."
            },
            supplySourceWithoutConsumer: {
              title: "Supply-Netz ohne Verbraucher",
              shortDescription: "Ein Supply-Ausgang ist verdrahtet, aber kein Supply-Eingang ist angeschlossen.",
              description: "Das Netz enthaelt eine Spannungsquelle, aber keinen erkennbaren Supply-Verbraucher.",
              recommendation: "Pruefe, ob die Versorgung zu einer Komponente mit Supply-Eingang weitergefuehrt werden soll."
            },
            supplyVoltageMismatch: {
              title: "Supply-Spannung passt nicht",
              shortDescription: "Die Spannung der Quelle passt nicht zu allen Pin-Toleranzen im Supply-Netz.",
              description: "Die Quelle liefert {{voltage}} V, aber mindestens ein angeschlossener Pin erlaubt diesen Spannungsbereich nicht: {{inputs}}.",
              recommendation: "Passe die Versorgungsspannung an oder trenne Komponenten mit unterschiedlichen Spannungsbereichen."
            },
            wireConnectedToHiddenOrMissingHandle: {
              title: "Wire zeigt auf fehlenden Pin",
              shortDescription: "Eine Verbindung endet an einem fehlenden oder ausgeblendeten Pin.",
              description: "Wire {{wire}} hat auf der Seite {{side}} den Pin {{handle}} nicht elektrisch erreicht: {{reason}}.",
              recommendation: "Verbinde das Wire neu mit einem sichtbaren, vorhandenen Pin."
            },
            mainsWireConnectedToLowVoltageComponent: {
              title: "Netzspannung an ungeeigneter Komponente",
              shortDescription: "Ein L/N/PE-Netz ist mit einem Nicht-Netzspannungsanschluss verbunden.",
              description: "{{handle}} an {{component}} liegt in einem Netzspannungsnetz, ist aber kein L/N/PE-Anschluss.",
              recommendation: "Trenne diese Verbindung und nutze nur dafuer vorgesehene Netzspannungsanschluesse."
            },
            groundAndSupplyPolaritySwapped: {
              title: "Plus und GND verbunden",
              shortDescription: "Ein Netz enthaelt gleichzeitig Ground und DC-Versorgung.",
              description: "In diesem Netz sind GND- und Supply-Anschluesse verbunden. Das ist wahrscheinlich eine vertauschte Polaritaet oder ein Kurzschluss.",
              recommendation: "Trenne Plus- und GND-Verbindungen und pruefe die Polung."
            },
            supplyVoltageUnknown: {
              title: "Supply-Spannung unbekannt",
              shortDescription: "Ein Supply-Netz hat eine Quelle, deren Spannung nicht bestimmt werden kann.",
              description: "Die Versorgung aus {{source}} versorgt Eingange, aber der Spannungswert ist nicht aufloesbar.",
              recommendation: "Setze den Spannungswert der Quelle oder das abhaengige Feld."
            },
            signalOutputWithoutConsumer: {
              title: "{{signal}}-Ausgang ohne Verbraucher",
              shortDescription: "Ein Signalausgang ist verdrahtet, erreicht aber keinen passenden Eingang.",
              description: "{{source}} ist angeschlossen, aber es wurde kein passender {{signal}}-Eingang gefunden.",
              recommendation: "Fuehre das Signal zu einem passenden Eingang oder entferne die ungenutzte Verbindung."
            },
            dataDirectionWrong: {
              title: "Data-Richtung unplausibel",
              shortDescription: "Ein LED-Datennetz verbindet nur Ausgaenge oder nur Eingaenge.",
              description: "Diese Data-Anschluesse bilden keine plausible Quelle-Senke-Verbindung: {{handles}}.",
              recommendation: "Verbinde DATA_out mit DATA_in in der korrekten Richtung."
            },
            clockedLedClockMissing: {
              title: "Clock-Leitung fehlt oder passt nicht",
              shortDescription: "Ein Clock-LED-Streifen hat Data, aber keine passende Clock-Verbindung.",
              description: "{{component}} benoetigt zu DATA eine passende Clock-Leitung. Bei LED-zu-LED muss Clock vom selben vorgelagerten Segment kommen.",
              recommendation: "Verbinde Clock_in mit dem passenden Clock-Ausgang."
            },
            digitalBackupPairMismatch: {
              title: "Backup-Datenleitung passt nicht",
              shortDescription: "Backup_in kommt nicht vom passenden Backup_out des vorgelagerten LED-Streifens.",
              description: "{{component}} wird ueber Data von {{source}} gespeist, aber Backup kommt nicht vom selben Streifen.",
              recommendation: "Verbinde Backup_in mit Backup_out desselben vorgelagerten Streifens."
            },
            digitalBackupInputTiedToData: {
              title: "Backup_in an Data angeschlossen",
              shortDescription: "Backup_in ist toleriert am Data-Netz, empfohlen ist aber GND.",
              description: "{{component}} ist kein nachfolgender Streifen. Backup_in liegt am Data-Netz statt an GND.",
              recommendation: "Verbinde Backup_in besser mit GND."
            },
            digitalBackupInputNotGrounded: {
              title: "Backup_in nicht auf GND",
              shortDescription: "Backup_in eines ersten LED-Streifens liegt nicht auf GND.",
              description: "{{component}} wird nicht von einem vorherigen LED-Streifen gespeist. Backup_in muss auf GND liegen.",
              recommendation: "Verbinde Backup_in mit GND."
            },
            fuseBypassed: {
              title: "Sicherung ueberbrueckt",
              shortDescription: "Ein Fuse-Eingang und -Ausgang sind extern direkt verbunden.",
              description: "Bei {{component}} sind beide Seiten der Sicherung extern im selben Netz. Die Schutzfunktion ist damit aufgehoben.",
              recommendation: "Entferne die externe Bruecke ueber die Sicherung."
            },
            usbPowerPairInvalid: {
              title: "USB-Power-Verbindung ist ungueltig",
              shortDescription: "USB-Power muss genau eine USB-Quelle direkt mit genau einem USB-Geraet verbinden.",
              description: "Dieses USB-Power-Netz ist nicht Point-to-Point: {{reason}}.",
              recommendation: "Verwende eine direkte USB-Wire von genau einem USB-Power-Ausgang zu genau einem USB-Geraet, ohne Verteiler oder zusaetzliche Anschluesse."
            },
            wireWithoutPhysicalParameters: {
              title: "Power-Wire ohne physikalische Daten",
              shortDescription: "Eine Power-, GND- oder USB-Leitung hat keine Laenge oder keinen Querschnitt.",
              description: "Diese Leitung liegt in einem Versorgungs-, GND- oder USB-Netz, aber Laenge oder Querschnitt fehlen.",
              recommendation: "Setze Laenge und Querschnitt fuer diese Leitung."
            },
            duplicateParallelWire: {
              title: "Doppelte parallele Verbindung",
              shortDescription: "Mehrere Wires verbinden dieselben zwei Pins.",
              description: "{{count}} Wires verbinden dasselbe Pin-Paar.",
              recommendation: "Entferne versehentlich doppelt gezogene Wires."
            }
          }
        },
        "component-rules": {
          title: "Komponentenregeln",
          description: "Prueft grundlegende Anforderungen einzelner Komponenten.",
          issues: {
            requiredPinUnconnected: {
              title: "Pflicht-Pin nicht verbunden",
              shortDescription: "Eine Komponente hat einen Pin, der verbunden sein muss.",
              description: "{{component}} besitzt Pflicht-Pins ohne Verbindung: {{handles}}.",
              recommendation: "Verbinde alle Pins dieser Komponente, die als Pflichtverbindung markiert sind."
            },
            groundMissing: {
              title: "Komponente ohne Ground",
              shortDescription: "Eine Komponente mit GND-Pin ist nicht mit Ground verbunden.",
              description: "{{component}} besitzt GND-Pins, aber keiner dieser Pins ist mit einem GND-Netz verbunden.",
              recommendation: "Verbinde mindestens einen GND-Pin dieser Komponente mit dem gemeinsamen Ground-Netz."
            },
            powerMissing: {
              title: "Komponente ohne Versorgung",
              shortDescription: "Eine Komponente mit Versorgungseingang ist nicht versorgt.",
              description: "{{component}} besitzt Supply- oder USB-Eingaenge, aber kein Supply-Eingang ist mit einem Supply-Netz verbunden, das einen suppl_out-Pin einer anderen Komponente enthaelt, und kein USB-Anschluss ist mit einem USB-Netz verbunden.",
              recommendation: "Verbinde einen Supply-Eingang mit einer passenden externen Spannungsquelle oder verbinde den USB-Anschluss mit einer USB-Versorgung."
            },
            mainsInputMissing: {
              title: "{{label}}-Eingang nicht verbunden",
              shortDescription: "Eine Komponente mit {{label}}-Eingang ist nicht mit dem passenden Netz verbunden.",
              description: "{{component}} besitzt {{label}}-Eingaenge, aber mindestens einer davon ist nicht mit einem passenden {{label}}-Netz verbunden.",
              recommendation: "Verbinde jeden {{label}}-Eingang dieser Komponente mit dem passenden {{label}}-Netz."
            },
            unusedRequiredFunctionalGroup: {
              title: "Genutzte Funktionsgruppe unvollstaendig",
              shortDescription: "Eine LED-Eingangsgruppe ist teilweise angeschlossen.",
              description: "{{component}} hat einen genutzten Data-Eingang, aber Versorgung oder GND der Gruppe fehlen.",
              recommendation: "Verbinde Data, Versorgung und GND der LED-Eingangsgruppe vollstaendig."
            },
            controlledOutputWithoutControlInput: {
              title: "Geschalteter Ausgang ohne Steuersignal",
              shortDescription: "Ein genutzter steuerbarer Ausgang hat keinen digitalen Steuereingang.",
              description: "{{component}} nutzt {{output}}, aber der zugehoerige Steuereingang {{control}} ist nicht mit einem digitalen Netz verbunden.",
              recommendation: "Verbinde den Steuereingang mit einem passenden digitalen Ausgang oder trenne den geschalteten Ausgang, wenn er nicht verwendet wird."
            },
            analogLedColorChannelUnconnected: {
              title: "Farbkanal nicht angeschlossen",
              shortDescription: "Eine Farbe eines analogen LED-Streifens ist nicht steuerbar.",
              description: "{{component}} hat keinen angeschlossenen {{color}}-Kanal. Betroffene Pins: {{handles}}.",
              recommendation: "Verbinde mindestens einen {{color}}-Anschluss des Streifens mit einem passenden PWM-Ausgang, wenn diese Farbe steuerbar sein soll."
            },
            analogLedColorChannelMultiplePwmSignals: {
              title: "Farbkanal an mehreren PWM-Signalen",
              shortDescription: "Eine Farbe eines analogen LED-Streifens ist an unterschiedliche PWM-Ausgaenge angeschlossen.",
              description: "{{component}} hat den {{color}}-Kanal an mehrere PWM-Signale angeschlossen: {{signals}}. Betroffene Pins: {{handles}}.",
              recommendation: "Verbinde alle Anschluesse desselben Farbkanals mit demselben PWM-Signal. Fuer mehr Leistung teile den analogen Streifen in separate Streifen bzw. getrennte Segmente auf."
            },
            componentHasOnlyOneTerminalConnected: {
              title: "Nur ein Anschluss verbunden",
              shortDescription: "Eine Zweipol-Komponente hat nur einen angeschlossenen Pin.",
              description: "{{component}} ist nur an {{handle}} verbunden.",
              recommendation: "Verbinde beide Anschluesse oder entferne die ungenutzte Komponente."
            },
            capacitorPolarityMismatch: {
              title: "Kondensator-Polung falsch",
              shortDescription: "Ein gepolter Kondensator ist wahrscheinlich verpolt.",
              description: "{{component}} hat Plus an GND oder Minus an Supply.",
              recommendation: "Verbinde Plus mit der positiven Versorgung und Minus mit GND."
            },
            mainsConnectorIncomplete: {
              title: "Netzanschluss unvollstaendig",
              shortDescription: "Eine Netzspannungs-Komponente hat nur L oder nur N angeschlossen.",
              description: "{{component}} hat einen unvollstaendigen L/N-Anschluss.",
              recommendation: "Verbinde L und N korrekt oder trenne den Netzanschluss komplett."
            },
            protectiveEarthMissingForMetalOrMainsDevice: {
              title: "Schutzleiter fehlt",
              shortDescription: "Eine Netzspannungs-Komponente mit PE-Anschluss ist ohne Schutzleiter.",
              description: "{{component}} nutzt Netzspannung, aber PE ist nicht korrekt verbunden.",
              recommendation: "Verbinde PE mit dem Schutzleiter-Netz."
            },
            supplyInputOnlyInternallyPowered: {
              title: "Supply nur intern weitergereicht",
              shortDescription: "Eine Komponente scheint nur ueber interne Supply-Pins verbunden zu sein.",
              description: "{{component}} hat Supply-Eingaenge, aber keine externe Spannungsquelle ist erreichbar.",
              recommendation: "Verbinde die Versorgung mit einer externen Quelle."
            },
            fuseCurrentMissingOrUnderspecified: {
              title: "Sicherungswert fehlt",
              shortDescription: "Eine Sicherung hat keinen erkennbaren Nennstrom.",
              description: "{{component}} enthaelt eine Sicherung ohne auswertbaren Nennstrom.",
              recommendation: "Setze oder pruefe den Sicherungswert."
            },
            isolatedComponent: {
              title: "Komponente isoliert",
              shortDescription: "Eine technische Komponente hat keine angeschlossenen Wires.",
              description: "{{component}} ist im Diagramm nicht verdrahtet.",
              recommendation: "Verdrahte die Komponente oder entferne sie, falls sie nicht benoetigt wird."
            },
            componentDefinitionIncompleteForChecks: {
              title: "Komponentendefinition unvollstaendig",
              shortDescription: "Ein Pin hat fuer Checks unvollstaendige Metadaten.",
              description: "{{handle}} an {{component}} hat fehlende oder unvollstaendige Check-Metadaten.",
              recommendation: "Ergaenze functions, Spannungsgrenzen oder Ausgangsspannungen in der Komponentendefinition."
            },
            ambiguousMultiFunctionHandle: {
              title: "Mehrdeutige Pin-Funktionen",
              shortDescription: "Ein Pin hat mehrere checkrelevante Funktionen.",
              description: "{{handle}} hat diese Funktionen: {{functions}}.",
              recommendation: "Pruefe, ob diese Funktionskombination bewusst und fuer Checks eindeutig ist."
            },
            sn74Ahct125nUsedChannelInputMissing: {
              title: "SN74AHCT125N-Kanal-Eingang wird nicht angesteuert",
              shortDescription: "Ein verwendeter Buffer-Ausgang hat einen Eingang ohne digitale Ausgangsquelle oder einen /OE-Pin, der weder digital angesteuert noch auf GND gezogen ist.",
              description: "{{component}} Kanal {{channel}} treibt ueber {{output}} einen digitalen Eingang, aber diese zugehoerigen Pins sind nicht korrekt angebunden: {{handles}}. A muss in einem Netz mit dig_out liegen; /OE darf in einem Netz mit dig_out oder GND liegen.",
              recommendation: "Verbinde den zugehoerigen A-Pin mit einem passenden digitalen Ausgang und den /OE-Pin mit einem digitalen Ausgang oder GND, oder trenne den unbenutzten Y-Ausgang vom digitalen Eingang."
            },
            sn74Ahct125nDirectLedOutputMissingSeriesResistor: {
              title: "SN74AHCT125N-Ausgang direkt an LED-Eingang",
              shortDescription: "Ein SN74AHCT125N-Ausgang ist direkt mit einem LED-Data- oder Clock-Eingang verbunden.",
              description: "{{output}} ist direkt mit {{input}} an {{led}} verbunden. In diesem Signalpfad sollte typischerweise ein Serienwiderstand von ca. 68 Ohm liegen.",
              recommendation: "Setze einen Widerstand von ca. 68 Ohm zwischen SN74AHCT125N-Ausgang und LED-Data-/Clock-Eingang."
            },
            digitalLedSignalGroupGroundMissing: {
              title: "Digitale LED-Eingangsgruppe ohne GND",
              shortDescription: "Ein Data- oder Clock-Eingang ist angeschlossen, aber GND derselben LED-Eingangsgruppe fehlt.",
              description: "{{component}} hat angeschlossene digitale Signaleingaenge in Gruppe {{group}} ({{signals}}), aber keine GND-Verbindung in derselben Gruppe.",
              recommendation: "Verbinde den GND-Pin derselben LED-Streifen-Gruppe (_start, _end oder _middle_N) mit dem gemeinsamen Ground-Netz."
            }
          }
        }
      }
    },
    simulation: {
      title: "Stromfluss simulieren",
      inDevelopmentTitle: "Simulationen sind noch in Entwicklung",
      comingSoon: "Simulation der Stromverteilung wird sp\xE4ter implementiert. Stay tuned!",
      settings: "Einstellungen",
      brightness: "Helligkeit: {{value}}%",
      buttonRun: "Simulieren",
      buttonDelete: "Ergebnisse l\xF6schen",
      notRun: "Noch keine Simulation ausgef\xFChrt.",
      running: "Simulation wird ausgef\xFChrt...",
      invalidated: "Simulationsergebnisse wurden entfernt, weil sich das Diagramm ge\xE4ndert hat.",
      blockedTitle: "Simulation nicht gestartet",
      blockedDescription: "Fuehre zuerst eine aktuelle Diagrammpruefung ohne Fehler aus.",
      diagramCheckDebugBypass: "Debug-Modus: Simulation startet ohne Diagramm-Check-Gating.",
      diagramCheckGate: {
        "not-checked": {
          title: "Diagrammpruefung erforderlich",
          description: "Fuehre die Diagrammpruefung aus, bevor du die Simulation startest."
        },
        stale: {
          title: "Diagrammpruefung ist veraltet",
          description: "Das Diagramm wurde nach der letzten Pruefung geaendert. Fuehre die Diagrammpruefung erneut aus."
        },
        "has-errors": {
          title: "Diagrammpruefung hat {{count}} Fehler",
          description: "Behebe die Fehler aus der Diagrammpruefung, bevor du die Simulation startest. Warnungen blockieren die Simulation nicht."
        }
      },
      modelReadyTitle: "Simulationsmodell erstellt",
      modelReadyDescription: "{{components}} simulierte Komponente(n), {{wires}} simulierte Wire(s).",
      failedTitle: "Simulation fehlgeschlagen",
      failedDescription: "Das Simulationsmodell konnte nicht erstellt werden. Bitte pr\xFCfe die Meldungen unten.",
      workerFailedTitle: "Simulations-Worker fehlgeschlagen",
      noIssues: "Keine Simulationsmeldungen.",
      issueCount: "{{count}} Simulationsmeldung(en)",
      affectedElements: "Betroffene Elemente",
      targetPin: "{{component}} - {{pin}}",
      targetWire: "Wire: {{source}} -> {{target}}",
      targetComponent: "{{component}}",
      ledVoltagePlot: {
        title: "LED-Streifen-Spannungsplot",
        openButton: "LED-Spannungsplot anzeigen",
        closeButton: "Schliessen",
        modalTitle: "LED-Spannung ueber Laenge: {{component}}",
        xAxis: "Laenge entlang des Streifens (m)",
        yAxis: "VLED (V)",
        ledCounts: "Logische LEDs: {{logical}}; physikalische LEDs: {{physical}}",
        minVoltage: "Minimum {{voltage}} V bei {{distance}} m",
        pointTooltip: "{{distance}} m: {{voltage}} V, Abschnitt {{section}}, LED {{index}}"
      },
      issues: {
        dcdcInputPowerAmbiguous: {
          title: "DCDC-Eingangsleistungslimit ist mehrdeutig",
          description: "Von diesem DCDC-Eingang sind mehrere Eingangsspannungsquellen passiv erreichbar. Das dynamische Eingangsleistungslimit wurde nicht berechnet, weil Stromteilung zwischen Quellen nicht modelliert ist."
        },
        dcdcInputPowerLimited: {
          title: "DCDC-Eingangsleistung begrenzt",
          description: "Der DCDC-Ausgangsstrom {{current}} A ueberschreitet das dynamische Eingangsleistungslimit {{limit}} A. Die Ausgangsspannung wurde durch das DCDC-Eingangsleistungsmodell reduziert."
        },
        currentLimit: {
          title: "Stromlimit ueberschritten",
          description: "Der Quellenstrom {{current}} A ueberschreitet das Limit {{limit}} A. Die Ausgangsspannung wurde durch das Ueberlastmodell der Quelle reduziert."
        },
        currentLimitReduced: {
          description: "Die Quellenlast hat das Limit {{limit}} A vor der Spannungsreduktion ueberschritten. Der finale Strom nach der Spannungsreduktion ist {{current}} A."
        },
        currentLimitExtreme: {
          title: "Stromlimit zu stark ueberschritten",
          description: "Der Quellenstrom {{current}} A liegt ueber 150% des Limits {{limit}} A. Die Simulation wurde gestoppt."
        },
        fuseCurrent: {
          title: "Sicherungsstrom ueberschritten",
          description: "Der Sicherungsstrom {{current}} A ueberschreitet den Nennstrom {{limit}} A."
        },
        pinVoltageLow: {
          title: "Versorgungsspannung zu niedrig",
          description: "Die Versorgungsspannung ist {{voltage}} V und liegt unter dem Minimum {{limit}} V."
        },
        pinVoltageHigh: {
          title: "Versorgungsspannung zu hoch",
          description: "Die Versorgungsspannung ist {{voltage}} V und liegt ueber dem Maximum {{limit}} V."
        },
        ledStripSupplyVoltageLow: {
          title: "Versorgungsspannung am LED-Streifen zu niedrig",
          description: "VLED an einem angeschlossenen Versorgungspunkt des LED-Streifens ist {{voltage}} V und liegt unter dem Minimum {{limit}} V. Erhoehe die Netzteilspannung oder die verfuegbare Leistung, falls das Netzteil im Stromlimit arbeitet."
        },
        ledStripVoltageDropHigh: {
          title: "Spannungsabfall ueber den LED-Streifen zu hoch",
          description: "Die angeschlossenen Versorgungspunkte sind im erlaubten Bereich, aber die niedrigste VLED ueber die Laenge des Streifens ist {{voltage}} V und liegt unter dem Minimum {{limit}} V. Fuege weitere Einspeisungen entlang des LED-Streifens hinzu."
        },
        ledStripVoltageLow: {
          title: "LED-Streifen-Spannung zu niedrig",
          description: "Die niedrigste LED-Streifen-Spannung ist {{voltage}} V und liegt unter dem Minimum {{limit}} V."
        },
        ledStripVoltageHigh: {
          title: "LED-Streifen-Spannung zu hoch",
          description: "Die hoechste LED-Streifen-Spannung ist {{voltage}} V und liegt ueber dem Maximum {{limit}} V."
        },
        unpoweredSubnet: {
          title: "Nicht versorgtes Teilnetz ignoriert",
          description: "Ein gueltiges Simulationsteilnetz ist von keiner Spannungsquelle erreichbar und wurde ignoriert."
        },
        solverFailed: {
          title: "Simulationssolver fehlgeschlagen",
          description: "Der Solver hat den Status {{status}} zurueckgegeben."
        },
        solverNotConverged: {
          title: "Simulationssolver konvergiert nicht",
          description: "Spannungsabhaengige LED-Stroeme sind innerhalb des Iterationslimits nicht konvergiert."
        }
      },
      severity: {
        error: "Fehler",
        warning: "Warnung",
        info: "Hinweis"
      },
      colorModes: {
        rgbWhite: "RGB-Weiss",
        separateWhite: "Separates Weiss",
        separateAndRgbWhite: "Separates + RGB-Weiss",
        red: "Rot",
        green: "Gruen",
        blue: "Blau"
      }
    },
    tools: {
      title: "Tools",
      rerouteAllButton: "Alle Wires neu routen",
      rerouteAllTooltip: "Alle Wires sequenziell mit Pathfinder neu routen",
      rerouteAllDisabledPF: "Nur im Auto/PF-Verbindungsmodus verf\xFCgbar",
      rerouteAllDisabledEmpty: "Keine Wires im Diagramm",
      rerouteAllDescription: "Routet kurze Komponentenpaare zuerst und beh\xE4lt Wire-IDs, Verbindungen und Eigenschaften bei.",
      rerouteAllSuccess: "Alle Wires wurden neu geroutet."
    },
    export: {
      title: "Speichern / Export / Beispiele",
      buttonSave: "Modell speichern",
      buttonSaveAs: "Modell speichern unter...",
      buttonExportPNG: "Modell nach PNG Datei exportieren",
      buttonExportJPEG: "Modell nach JPEG Datei exportieren",
      buttonExportSVG: "Modell nach SVG Datei exportieren",
      buttonOpen: "Modell \xF6ffnen...",
      buttonShare: "Einen \xF6ffentlichen Link zum Modell generieren",
      currentFile: "Aktuelle Datei: {{name}}",
      saveAsModalTitle: "Modell speichern unter",
      saveAsModalOk: "Speichern",
      dividerExport: "Exportieren",
      dividerSaveOpen: "Speichern / \xD6ffnen",
      dividerShare: "Teilen",
      dividerExamples: "Beispiele laden",
      share: {
        modalTitle: "Modell teilen - Link generieren",
        modalLinkText: "Link:",
        modalLinkBeingGenerated: "... wird generiert ... bitte warten",
        modalButtonOK: "OK",
        modalButtonClose: "Schlie\xDFen",
        modalButtonCancel: "Abbrechen",
        modalAttentionText: 'Beim Klicken auf "OK" wird Ihr Model mit allen eingegebenen Daten an einen \xF6ffentlichen Server (https://github.com) \xFCbertragen und dort gespeichert. F\xFCr diesen Zweck werden au\xDFerdem Ihre Model Daten sowie Ihre IP Adresse an https://wled-api.myhome-control.de/ \xFCbertagen. Sie erhalten danach ein Link angezeigt und k\xF6nnen mit diesem Link das Modell mit anderen teilen.',
        modalLinkError: "Fehler! Bitte versuchen Sie es ggf. erneut.",
        tooltipCopyLink: "Link in die Zwischenablage kopieren",
        messageLinkCopied: "Link in die Zwischenablage kopiert!"
      },
      selectExample: "Beispiel w\xE4hlen ..."
    }
  },
  footRow: {
    legalNotice: {
      title: "Impressum",
      responsible: "Verantwortlicher: Wladislaw Waag",
      address: "Adresse: Wasserburger Landstr. 29, 81825 M\xFCnchen, Deutschland",
      contact: "Kontakt: +49 (0) 176 47 11 5206, info@myhome-control.de",
      disputeText: "",
      disputeSettlmentText: "Verbraucherstreitbeilegung/Universalschlichtungsstelle: Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
    },
    dataPrivacy: {
      title: "Datenschutzerkl\xE4rung",
      text1: "Diese Seite wird im Rahmen von 'Github Pages' gehostet und betrieben. Es ist m\xF6glich und wahrscheinlich, dass Github Ihre personenbezogenen Daten sammelt und verarbeitet. Das betrifft dann auch die Besucher dieser Webseite. Wir haben aber keinerlei Einfluss darauf. Bitte lesen Sie dazu die Datenschutzerkl\xE4rung von Github:",
      text2: "Au\xDFerdem sobald Sie die Funktion 'Teilen' nutzen, werden Ihre IP Adresse, Ihr Modell sowie alle von Ihnen eingegebenen Daten an https://myhome-control.de und an https://github.com/wled-development/wled-wiring-store weitergeleitet. Das ist f\xFCr die Ausf\xFChrung der Funktion zwingend notwendig. Die Datenschutzerkl\xE4rung f\xFCr https://myhome-control.de finden Sie unter",
      text3: "Unsere Webseite enth\xE4lt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. F\xFCr diese fremden Inhalte k\xF6nnen wir keine Gew\xE4hr und keine Haftung \xFCbernehmen. F\xFCr die Inhalte der verlinkten Seiten ist immer der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m\xF6gliche Rechtsverst\xF6\xDFe \xFCberpr\xFCft. Rechtswidrige Inhalte waren dabei nicht erkennbar. Sollten uns Rechtsverletzungen bekannt werden, werden wir die entsprechende Verlinkung umgehend entfernen."
    },
    links: {
      title: "N\xFCtzliche Links",
      link1Text: "Offizielle WLED Dokumentation:",
      link2Text: "WLED FAQ:",
      link3Text: "WLED Rechner:",
      link4Text: "Erweiterter WLED Online Installer:",
      link5Text: "WELD online kompilieren:",
      link6Text: "WLED Controller kaufen (Deutschland):",
      link7Text: "WLED Controller kaufen (Weltweit):"
    },
    contribute: {
      title: "Mitentwickeln/GitHub",
      text: "Beitr\xE4ge sind Willkommen! Wenn Sie beitragen m\xF6chten, folgen Sie bitte dem GitHub link:"
    }
  },
  examples: {
    example1: "ESP32 uC + Level Shifter + DC/DC + 24V LED strip",
    example2: "ABC! WLED Controller + 24V LED Strip",
    example3: "ABC! WLED Controller + long 24V LED Strip + LineIn + Ethernet",
    example4: "ABC! WLED Controller + Long Range Extension",
    example5: "ABC! WLED Controller + Anal. 24V LED Strip + PWM Board"
  },
  compData: {
    Router: {
      name: "WAN/LAN Router",
      description: "Ein generischer WLAN/LAN Router.",
      descriptionShort: "generisch"
    },
    Button: {
      name: "Taster",
      description: "Ein generischer Taster. Beim Dr\xFCcken und Halten wird der Kontakt geschlossen. Der Kontakt \xF6ffnet sich, sobald der Taster losgelassen wird. Nicht zu verwechseln mit einem Schalter.",
      descriptionShort: "generisch"
    },
    DC_JACK_FEMALE: {
      name: "DC Verbinder",
      description: "Wird verwendet um ein Netzteil mit einem DC Verbinder in eine + und eine - Leitung aufzuteilen.",
      descriptionShort: "F\xFCr bis zu 3A"
    },
    Elko: {
      name: "Elektrolytkondensator",
      description: "Ein Elektrolytkondensator mit w\xE4hlbarer Kapazit\xE4t. Auf die Polarit\xE4t achten! Wird oft eingesetzt, um die Versorgungsspannung von LEDs oder anderen Komponenten zu stabilisieren.",
      descriptionShort: "w\xE4hlbare Kapazit\xE4t"
    },
    ESP32_30P: {
      name: "ESP32 uC 30 Pins",
      description: "ESP32 Controller, Version mit 30 Pins. Bekannt auch als NodeMCU.",
      descriptionShort: "Controller"
    },
    ESP32_38P: {
      name: "ESP32 uC 38 Pins",
      description: "ESP32 Controller, Version mit 38 Pins. Bekannt auch als NodeMCU.",
      descriptionShort: "Controller"
    },
    ESP32C3D1mini: {
      name: "ESP32-C3 D1 mini",
      description: "ESP32-C3 Controller, Version in D1 mini Format. WLED kann auf diesem Controller-Typ mit Einschr\xE4nkungen laufen.",
      descriptionShort: "Controller"
    },
    ESP32C3_supermini: {
      name: "ESP32-C3 supermini",
      description: "ESP32-C3 Controller, supermini. WLED kann auf diesem Controller-Typ mit Einschr\xE4nkungen laufen.",
      descriptionShort: "Controller"
    },
    ESP32D1mini: {
      name: "ESP32 D1 mini",
      description: "ESP32 Controller, Version in D1 mini Format.",
      descriptionShort: "Controller"
    },
    ESP32S3D1mini: {
      name: "ESP32-S3 D1 mini",
      description: "ESP32-S3 Controller, Version in D1 mini Format. WLED kann auf diesem Controller-Typ mit Einschr\xE4nkungen laufen.",
      descriptionShort: "Controller"
    },
    ESP8266D1mini: {
      name: "ESP8266 D1 mini",
      description: "ESP8266 Controller, Version in D1 mini Format. F\xFCr neue WLED-Projekte nicht mehr empfohlen (zu schwach).",
      descriptionShort: "Controller"
    },
    InfoNode: {
      name: "Text",
      description: "Ein Textelement um z.B. Beschriftungen dem Diagramm hinzuf\xFCgen.",
      descriptionShort: "f\xFCr Beschriftungen etc."
    },
    INMP441: {
      name: "INMP441 Mikrofon",
      description: "INMP441 Mikrofon. Es ist ein digitales Mikrofon, welches von WLED f\xFCr Sound Reactive unterst\xFCtzt wird und eine sehr gute Qualit\xE4t liefert.",
      descriptionShort: "digitales"
    },
    IR_KY022: {
      name: "KY022 IR Empf\xE4nger",
      description: "KY-022 Infrarot Empf\xE4nger, welcher von WLED unterst\xFCtzt wird und erlaubt WLED mit einer IR-Fernbedienung zu steuern.",
      descriptionShort: "Infrarot"
    },
    IR_TSOP38238: {
      name: "TSOP38238 IR Empf\xE4nger",
      description: "TSOP38238 Infrarot Empf\xE4nger, welcher von WLED unterst\xFCtzt wird und erlaubt WLED mit einer IR-Fernbedienung zu steuern.",
      descriptionShort: "Infrarot"
    },
    Kerko: {
      name: "Keramikkondensator",
      description: "Keramikkondensator mit w\xE4hlbarer Kapazit\xE4t. Wird oft am Eingang von schaltenden elektronischen Schaltungen eingesetzt (zwischen Versorgung und Masse) um St\xF6rungen zu vermeiden. Muss \xFCber m\xF6glichst sehr kurze Leitungen/Leiterbahnen angebunden werden.",
      descriptionShort: "w\xE4hlbare Kapazit\xE4t"
    },
    LineBoxNode: {
      name: "Rechteck",
      description: "Ein Element um ein Rechteck (gef\xFCllt oder leer) zu zeichnen.",
      descriptionShort: "Zeichnungselement"
    },
    miniOTOFuse: {
      name: "KFZ Sicherung",
      description: "Eine Schmelzsicherung aus KFZ-Bereich. Ideal f\xFCr Einsatz bei Spannungen bis zu 32V. Bitte nur in Fachgesch\xE4ften kaufen, es werden auf Marktpl\xE4tzen viele billige Nachbauten angeboten, welche nicht wie es soll funktionieren. F\xFCr die Auslegung kann WLED Rechner (www.wled-calculator.github.io) verwendet werden.",
      descriptionShort: "w\xE4hlbar 4-30A"
    },
    FUSE_Board: {
      name: "Sicherugsboard",
      description: "F\xFCr Stromverteilung und Sicherungen.",
      descriptionShort: "4 Kan\xE4le"
    },
    PIR_HCSR501: {
      name: "HC-SR501 PIR Sensor",
      description: "PIR Sensor (Bewegungsmelder) vom Typ HCSR501. Kann mit WLED verwendet werden.",
      descriptionShort: "Bewegungsmelder"
    },
    PLUG_LNPE: {
      name: "Stecker",
      description: "Stecker f\xFCr 230V Steckdose. Achtung: Lebensgefahr! Nur zum Aufbau verwenden, wenn Sie geeignete Kenntnisse besitzen.",
      descriptionShort: "f\xFCr 230V AC"
    },
    PSU_HP: {
      name: "Netzteil",
      description: "Netzteil mit w\xE4hlbarer Spannung / Strom (Leistung). Diese Netzteile besitzen typischerweise hohe Leistungen und werden f\xFCr gr\xF6\xDFere Aufbauten eingesetzt. Netzstecker muss separat angebunden werden.",
      descriptionShort: "w\xE4hlbare V/I"
    },
    PSU_USB: {
      name: "USB Netzteil",
      description: "USB Netzteil mit 5V Ausgangsspannung und w\xE4hlbarem Strom bis zu 5A.",
      descriptionShort: "5V, w\xE4hlbarerer I"
    },
    PSU_USB_WIRES: {
      name: "USB Netzteil",
      description: "USB Netzteil mit 5V Ausgangsspannung, w\xE4hlbarem Strom bis zu 5A und separaten +/- Leitungen",
      descriptionShort: "5V, separate +/- Leitungen"
    },
    Resistor: {
      name: "Widerstand",
      description: "Elektrischer Widerstand w\xE4hlbarer Gr\xF6\xDFe.",
      descriptionShort: "w\xE4hlbarer Wert"
    },
    SN74AHCT125N: {
      name: "Level Shifter",
      description: "Ein f\xFCr WLED empfohlener Level Shifter Typ. Ein Level Shifter ist notwendig um den Steuersignal vom Microcontroller (3.3V Pegel) auf LED-Dateneingang (5V Pegel) anzupassen (bei adressierbaren LEDs). Ohne ein Level Shifter kommt es oft (und bei 12V und 24V LEDs fast immer) zum Flackern der LEDs.",
      descriptionShort: "SN74AHCT125N"
    },
    SolderJoint: {
      name: "L\xF6tverbindung",
      description: "Darstellung einer L\xF6tverbindung, um z.B. einzelne Leitungen miteinander zu verbinden.",
      descriptionShort: "f\xFCr Leitungen etc."
    },
    WAGO_2X: {
      name: "WAGO Klemme 2x",
      description: "Weit verbreitete Verbindungsklemme mit Federklemmanschluss, zweifach.",
      descriptionShort: "Federklemmanschluss"
    },
    WAGO_3X: {
      name: "WAGO Klemme 3x",
      description: "Weit verbreitete Verbindungsklemme mit Federklemmanschluss, dreifach.",
      descriptionShort: "Federklemmanschluss"
    },
    WireInfoNode: {
      name: "Wire Info",
      description: "Information \xFCber die Leitung.",
      descriptionShort: " "
    },
    WS2812B_5V_30LPM: {
      name: "WS2812B RGB",
      description: "WS2812 LED Streifen, 5V, 30 LEDs/Meter, einzeln adressierbare LEDs.",
      descriptionShort: "5V, 30 LEDs/Meter"
    },
    MHC_V43: {
      name: "WLED V43 Controller",
      description: "Ein professioneller WLED-Controller f\xFCr 5V, 12V oder 24V adressierbare LEDs. Beinhaltet ESP32 Mikrocontroller, SN74AHCT Level Shifter, Sicherung, Kondensator, EMV Filter. Als optionales Zubeh\xF6r k\xF6nnen Ethernet-Adapter, INMP441 Mikrofon, Line-In Adapter sowie USB Adapter angeschlossen werden.",
      descriptionShort: "ESP32 basiert"
    },
    MHC_V57: {
      name: "WLED PRO V57 Controller",
      description: "Ein professioneller WLED-Controller f\xFCr 5V, 12V oder 24V adressierbare LEDs. Beinhaltet ESP32 Mikrocontroller (mit 8MB Flash  + 2MB PSRAM), SN74AHCT Level Shifter, Sicherung, Kondensator, EMV Filter, iMOSFET. Als optionales Zubeh\xF6r k\xF6nnen Ethernet-Adapter, INMP441 Mikrofon, Line-In Adapter sowie USB Adapter angeschlossen werden.",
      descriptionShort: "ESP32 basiert"
    },
    MHC_SwitchBoard: {
      name: "WLED Switch Board",
      description: "Eine bessere/moderne Alternative f\xFCr Relais Board um LEDs im OFF Zustand komplett auszuschalten. Beinhaltet \xDCberstrom-, \xDCbertemperatur-, Kurzschluss- und Verpolschutz.",
      descriptionShort: "universell f\xFCr 5-24V"
    },
    MHC_PWMBoard: {
      name: "WLED PWM Board",
      description: "Das Board verwendet MOSFETs um mit PWM Signal analoge LED Streifen anzusteuern. 3 Kan\xE4le je max. 5A. \xDCberstrom- , \xDCbertemperatur-, Kurzschluss- und Verpolschutz.",
      descriptionShort: "universell f\xFCr 12-48V"
    },
    MHC_RS485_R: {
      name: "RS-485 Empf\xE4nger",
      description: "RS-485 Empf\xE4nger f\xFCr die Verwendung als Range Extender Empf\xE4nger mit dem RS-485 Adapter.",
      descriptionShort: "RS-485 Empf\xE4nger"
    },
    MHC_Relay5V: {
      name: "5V Relais Board",
      description: "Ein professionelles Relais-Board f\xFCr die Verwendung in Kombination mit 5V adressierbaren LEDs. Es erlaubt die 5V LED Streifen im Off Zustand durch Relais abzuschalten. Das spart Energie, erh\xF6ht die Lebensdauer von LED Streifen und bringt zus\xE4tzliche Sicherheit. Zwei Pfade erm\xF6glichen zwei separate Steuerungen oder z.B. zwei Einspeisungen zu kontrollieren.",
      descriptionShort: "f\xFCr 5V LEDs"
    },
    MHC_Relay12V: {
      name: "12V Relais Board",
      description: "Ein professionelles Relais-Board f\xFCr die Verwendung in Kombination mit 12V adressierbaren LEDs. Es erlaubt die 12V LED Streifen im Off Zustand durch Relais abzuschalten. Das spart Energie, erh\xF6ht die Lebensdauer von LED Streifen und bringt zus\xE4tzliche Sicherheit. Zwei Pfade erm\xF6glichen zwei separate Steuerungen oder z.B. zwei Einspeisungen zu kontrollieren.",
      descriptionShort: "f\xFCr 12V LEDs"
    },
    MHC_Relay24V: {
      name: "24V Relais Board",
      description: "Ein professionelles Relais-Board f\xFCr die Verwendung in Kombination mit 24V adressierbaren LEDs. Es erlaubt die 24V LED Streifen im Off Zustand durch Relais abzuschalten. Das spart Energie, erh\xF6ht die Lebensdauer von LED Streifen und bringt zus\xE4tzliche Sicherheit. Zwei Pfade erm\xF6glichen zwei separate Steuerungen oder z.B. zwei Einspeisungen zu kontrollieren.",
      descriptionShort: "f\xFCr 24V LEDs"
    },
    AUDIO_SOURCE: {
      name: "Audioquelle",
      description: "Eine generische Quelle f\xFCr Audio-Signal.",
      descriptionShort: "Line-Out"
    },
    LM2596_PCB: {
      name: "LM2596 DC/DC",
      description: "DC/DC (Step-Down) Konverter mit einstellbarer Ausgangsspannung.",
      descriptionShort: "einstellbarer Ausg."
    },
    IRLZ44N: {
      name: "IRLZ44N",
      description: "MOSFET. Dieser Typ ist f\xFCr die Verwendung mit WLED empfohlen und kann f\xFCr die Ansteuerung von analogen LED Streifen verwendet werden.",
      descriptionShort: "N-Kanal MOSFET"
    },
    DCDC_mini: {
      name: "DC/DC mini",
      description: "DC/DC (Step-Down) Konverter mit einstellbarer Ausgangsspannung.",
      descriptionShort: "einstellbarer Ausg."
    },
    WS2814_24V_60LPM: {
      name: "WS2814 RGBW",
      description: "RGBW LED Streifen, adressierbare LEDs in 6er Gruppen (1 logische LED = 6 physikalische).",
      descriptionShort: "24V, 60 LEDs/m"
    },
    WS2813_5V_60LPM: {
      name: "WS2813 RGB",
      description: "RGB LED Streifen mit Backup-Line.",
      descriptionShort: "5V, 60 LEDs/m"
    },
    WS2815_12V_30LPM: {
      name: "WS2815 RGB",
      description: "RGB LED Streifen mit Backup-Line.",
      descriptionShort: "12V, 30 LEDs/m"
    },
    WS2814_12V_30LPM: {
      name: "WS2814 RGBW",
      description: "RGBW LED Streifen, adressierbare LEDs in 3er Gruppen (1 logische LED = 3 physikalische).",
      descriptionShort: "12V, 30 LEDs/m"
    },
    WS2818_12V_30LPM: {
      name: "WS2818 RGB",
      description: "RGB LED Streifen, adressierbare LEDs in 3er Gruppen (1 logische LED = 3 physikalische).",
      descriptionShort: "12V, 30 LEDs/m"
    },
    FCOB_12V_720LPM: {
      name: "FCOB RGB",
      description: "FCOB RGB LED Streifen, 720 LEDs/m (240 LEDs jeder Farbe pro Meter, 20 logische LEDs/m)",
      descriptionShort: "12V, 720 LEDs/m"
    },
    FCOB_24V_720LPM: {
      name: "FCOB RGB",
      description: "FCOB RGB LED Streifen, 720 LEDs/m (240 LEDs jeder Farbe pro Meter, 20 logische LEDs/m)",
      descriptionShort: "24V, 720 LEDs/m"
    },
    FCOB_24V_784LPM: {
      name: "FCOB RGBW",
      description: "FCOB RGBW LED Streifen, 784 LEDs/m (196 LEDs jeder Farbe pro Meter, 14 logische LEDs/m)",
      descriptionShort: "24V, 784 LEDs/m"
    },
    APA102_5V_30LPM: {
      name: "APA102 RGB",
      description: "APA102 LED Streifen mit Clock Signal, 5V, 30 LEDs/Meter, einzeln adressierbare LEDs.",
      descriptionShort: "5V, 30 LEDs/m"
    },
    AN_WHITE_24V_240LPM: {
      name: "Analog. Weiss",
      description: "Analoges LED Streifen (Weisse 2835 LEDs), 24V, 240 LEDs/Meter, teilbar in 2,5 cm (6 LEDs)",
      descriptionShort: "24V, 240 weisse LEDs/m"
    },
    AN_RGB_CCT_48V_90LPM: {
      name: "Anal. RGB CCT",
      description: "Analoges RGB CCT LED Streifen (5050 LEDs), 48V, 90 LEDs/Meter, teilbar in 16.65 cm (15 LEDs)",
      descriptionShort: "48V, 90 LEDs/m"
    },
    AN_RGB_24V_120LPM: {
      name: "Anal. RGB ",
      description: "Analoges RGB LED Streifen (2835 LEDs), 24V, 120 LEDs/Meter, teilbar in 5 cm (6 LEDs)",
      descriptionShort: "24V, 120 LEDs/m"
    },
    WS2805_24V_60LPM: {
      name: "WS2805 RGBW CCT",
      description: "RGBW CCT LED Streifen (digital), adressierbare LEDs in 36r Gruppen (1 logische LED = 6 physikalische).",
      descriptionShort: "24V, 60 LEDs/m"
    },
    WS2805_12V_60LPM: {
      name: "WS2805 RGBW CCT",
      description: "RGBW CCT LED Streifen (digital), adressierbare LEDs in 36r Gruppen (1 logische LED = 6 physikalische).",
      descriptionShort: "12V, 60 LEDs/m"
    }
  }
};

// src/translations/zh.json
var zh_default = {
  title: "\u6B22\u8FCE\u6765\u5230 WLED \u5E03\u7EBF\u8BBE\u8BA1\u5668\uFF01",
  dragComponents: "\u5C06\u7EC4\u4EF6\u62D6\u5230\u5DE5\u4F5C\u533A\u4EE5\u5F00\u59CB\u8BBE\u8BA1\uFF0C\u6216\u52A0\u8F7D\u793A\u4F8B\u56FE\u7EB8",
  componentGroupTypes: {
    controller: "\u63A7\u5236\u5668",
    led: "LED",
    psu: "\u7535\u6E90",
    levelshifter: "\u7535\u5E73\u8F6C\u6362\u5668",
    electronics: "\u7535\u5B50\u5143\u4EF6/\u96F6\u4EF6",
    others: "\u5176\u4ED6\u7EC4\u4EF6"
  },
  buttons: {
    rotate: "\u65CB\u8F6C",
    longer: "\u653E\u5927",
    shorter: "\u7F29\u5C0F"
  },
  tooltip: {
    deleteWire: "\u5220\u9664\u6B64\u8FDE\u63A5",
    selectColor: "\u9009\u62E9\u989C\u8272",
    selectWireLength: "\u9009\u62E9\u5BFC\u7EBF\u957F\u5EA6\uFF08\u7269\u7406\u5C3A\u5BF8\uFF09",
    selectWireCrossSection: "\u9009\u62E9\u5BFC\u7EBF\u6A2A\u622A\u9762\u79EF\uFF08\u7269\u7406\u5C3A\u5BF8\uFF09",
    selectWireWidth: "\u9009\u62E9\u5BFC\u7EBF\u5BBD\u5EA6\uFF08\u7528\u4E8E\u7ED8\u5236\uFF09",
    selectWireNetwork: "\u9009\u62E9\u6574\u4E2A\u7F51\u7EDC",
    clearWireNetwork: "\u6E05\u9664\u7F51\u7EDC\u9009\u62E9",
    putWireInfoNode: "\u6DFB\u52A0\u5BFC\u7EBF\u4FE1\u606F\u6846",
    rerouteWire: "\u4F7F\u7528 Pathfinder \u91CD\u65B0\u5E03\u7EBF",
    startConnection: "\u5F00\u59CB\u8FDE\u63A5",
    closeConnection: "\u5B8C\u6210\u8FDE\u63A5",
    rotateLeft: "\u5411\u5DE6\u65CB\u8F6C",
    rotateRight: "\u5411\u53F3\u65CB\u8F6C",
    delete: "\u5220\u9664",
    copy: "\u590D\u5236",
    enlarge: "\u5EF6\u957F",
    shorten: "\u7F29\u77ED",
    switchFilled: "\u586B\u5145 / \u4EC5\u8FB9\u6846",
    increaseTextSize: "\u589E\u5927\u6587\u672C\u5927\u5C0F",
    decreaseTextSize: "\u51CF\u5C0F\u6587\u672C\u5927\u5C0F",
    textSize: "\u6587\u672C\u5927\u5C0F",
    selectFont: "\u9009\u62E9\u5B57\u4F53",
    toggleBold: "\u5207\u6362\u7C97\u4F53",
    textAlign: "\u6587\u672C\u5BF9\u9F50",
    selectMulti: "\u591A\u9009",
    deleteSelected: "\u5220\u9664\u9009\u4E2D\u9879",
    componentInfo: "\u7EC4\u4EF6\u4FE1\u606F",
    switchConnLineType: "\u66F4\u6539\u8FDE\u63A5\u7C7B\u578B",
    ledSimulationOptions: "LED simulation settings"
  },
  ledSimulationOptions: {
    title: "LED simulation",
    recommended: "recommended",
    unknownOption: "Unknown option. Update this component from the current template.",
    fields: {
      supplyResistance: "Positive path / V+ resistance",
      gndResistance: "Negative path / GND resistance",
      currentCurve: "LED current curve"
    },
    resistance: {
      typical_5mm: {
        name: "Typical 5 mm strip",
        description: "Typical copper path for a 5 mm LED strip: 0.12 Ohm per meter."
      },
      good_5mm: {
        name: "Good 5 mm strip",
        description: "Better copper path for a 5 mm LED strip: 0.09 Ohm per meter."
      },
      poor_5mm: {
        name: "Poor 5 mm strip",
        description: "Higher-resistance copper path for a weak 5 mm LED strip: 0.24 Ohm per meter."
      },
      narrow_fcob_path_good: {
        name: "\u4F18\u8D28\u7A84 FCOB \u94DC\u7B94\u8DEF\u5F84",
        description: "FCOB \u706F\u5E26\u7684\u4F18\u8D28\u94DC\u7B94\u8DEF\u5F84\uFF08\u7A84\u8FB9\uFF0C\u4E0E\u6570\u636E\u8DEF\u5F84\u5171\u7528\uFF09\uFF1A\u6BCF\u7C73 0.12 \u6B27\u59C6\u3002"
      },
      narrow_fcob_path_typical: {
        name: "\u5178\u578B\u7A84 FCOB \u94DC\u7B94\u8DEF\u5F84",
        description: "FCOB \u706F\u5E26\u7684\u5178\u578B\u94DC\u7B94\u8DEF\u5F84\uFF08\u7A84\u8FB9\uFF0C\u4E0E\u6570\u636E\u8DEF\u5F84\u5171\u7528\uFF09\uFF1A\u6BCF\u7C73 0.16 \u6B27\u59C6\u3002"
      },
      narrow_fcob_path_bad: {
        name: "\u8F83\u5DEE\u7A84 FCOB \u94DC\u7B94\u8DEF\u5F84",
        description: "FCOB \u706F\u5E26\u4E2D\u7535\u963B\u8F83\u9AD8\u7684\u94DC\u7B94\u8DEF\u5F84\uFF08\u7A84\u8FB9\uFF0C\u4E0E\u6570\u636E\u8DEF\u5F84\u5171\u7528\uFF09\uFF1A\u6BCF\u7C73 0.22 \u6B27\u59C6\u3002"
      },
      bright_fcob_path_good: {
        name: "\u4F18\u8D28\u9AD8\u529F\u7387 FCOB \u94DC\u7B94\u8DEF\u5F84",
        description: "FCOB \u706F\u5E26\u7684\u4F18\u8D28\u94DC\u7B94\u8DEF\u5F84\uFF08\u5BBD\u8FB9\uFF0C\u5B8C\u5168\u4F7F\u7528\uFF09\uFF1A\u6BCF\u7C73 0.06 \u6B27\u59C6\u3002"
      },
      bright_fcob_path_typical: {
        name: "\u5178\u578B\u9AD8\u529F\u7387 FCOB \u94DC\u7B94\u8DEF\u5F84",
        description: "FCOB \u706F\u5E26\u7684\u5178\u578B\u94DC\u7B94\u8DEF\u5F84\uFF08\u5BBD\u8FB9\uFF0C\u5B8C\u5168\u4F7F\u7528\uFF09\uFF1A\u6BCF\u7C73 0.08 \u6B27\u59C6\u3002"
      },
      bright_fcob_path_bad: {
        name: "\u8F83\u5DEE\u9AD8\u529F\u7387 FCOB \u94DC\u7B94\u8DEF\u5F84",
        description: "FCOB \u706F\u5E26\u4E2D\u7535\u963B\u8F83\u9AD8\u7684\u94DC\u7B94\u8DEF\u5F84\uFF08\u5BBD\u8FB9\uFF0C\u5B8C\u5168\u4F7F\u7528\uFF09\uFF1A\u6BCF\u7C73 0.20 \u6B27\u59C6\u3002"
      }
    },
    currentCurve: {
      ws2814_24v_typical: {
        name: "Typical WS2814 24 V",
        description: "Typical voltage-dependent WS2814 24 V current curve."
      },
      ws2812b_5v_typical: {
        name: "WS2812B 5 V\uFF08\u5178\u578B\uFF09",
        description: "WS2812B RGB 5 V\uFF0C5050 LED \u5C3A\u5BF8\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      ws2812b_5v_good: {
        name: "WS2812B 5 V\uFF08\u826F\u597D\uFF09",
        description: "WS2812B RGB 5 V\uFF0C5050 LED \u5C3A\u5BF8\uFF0C\u826F\u597D/\u65B0\u7248\uFF08\u6539\u8FDB\u7684\u989C\u8272\u7A33\u5B9A\u6027\uFF09\u3002"
      },
      ws2812b_eco_5v_typical: {
        name: "WS2812B ECO 5 V\uFF08\u5178\u578B\uFF09",
        description: "WS2812B RGB ECO 5 V\uFF0C5050 LED \u5C3A\u5BF8\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      ws2811_24v_typical: {
        name: "WS2811 24 V\uFF08\u5178\u578B\uFF09",
        description: "WS2811 RGB 24 V\uFF0C5050 LED \u5C3A\u5BF8\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      ws2814_12v_typical: {
        name: "WS2814 12 V\uFF08\u5178\u578B\uFF09",
        description: "WS2812B RGBW 12 V\uFF0C5050 LED \u5C3A\u5BF8\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      ws28xx_fcob_rgb_24v_720lpm_typical: {
        name: "WS28xx FCOB RGB 24 V\uFF0C720 LEDs/m\uFF08\u5178\u578B\uFF09",
        description: "WS28xx FCOB RGB 24 V\uFF0C720 LEDs/m\uFF0C20 \u4E2A\u903B\u8F91 LED/m\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      ws28xx_fcob_rgb_12v_720lpm_typical: {
        name: "WS28xx FCOB RGB 12 V\uFF0C720 LEDs/m\uFF08\u5178\u578B\uFF09",
        description: "WS28xx FCOB RGB 12 V\uFF0C720 LEDs/m\uFF0C20 \u4E2A\u903B\u8F91 LED/m\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      ws28xx_fcob_rgbw_24v_784lpm_typical: {
        name: "WS28xx FCOB RGBW 24 V\uFF0C784 LEDs/m\uFF08\u5178\u578B\uFF09",
        description: "WS28xx FCOB RGB 24 V\uFF0C784 LEDs/m\uFF0C14 \u4E2A\u903B\u8F91 LED/m\uFF0C\u5178\u578B\u7248\u672C\u3002"
      },
      sk6812_fcob_rgb_5v_240lpm_typical: {
        name: "SK6812 FCOB RGB 5 V\uFF0C240 LEDs/m\uFF08\u5178\u578B\uFF09",
        description: "SK6812 FCOB RGB 5 V\uFF0C240 LEDs/m\uFF0C80 \u4E2A\u903B\u8F91 LED/m\uFF0C\u5178\u578B\u7248\u672C\u3002"
      }
    }
  },
  componentEditor: {
    title: "\u7EC4\u4EF6\u7F16\u8F91\u5668",
    valid: "\u6709\u6548",
    invalid: "\u65E0\u6548",
    actions: {
      new: "\u65B0\u5EFA",
      openCore: "\u6253\u5F00\u5185\u7F6E\u7EC4\u4EF6",
      openLocal: "\u6253\u5F00\u672C\u5730\u8349\u7A3F",
      saveLocal: "\u4FDD\u5B58\u5230\u672C\u5730",
      importJson: "\u5BFC\u5165 JSON",
      exportJson: "\u5BFC\u51FA JSON",
      backToDesigner: "\u8FD4\u56DE\u8BBE\u8BA1\u5668",
      addHandle: "\u6DFB\u52A0\u8FDE\u63A5\u70B9",
      deleteHandle: "\u5220\u9664\u8FDE\u63A5\u70B9",
      addField: "\u6DFB\u52A0\u5B57\u6BB5",
      deleteField: "\u5220\u9664\u5B57\u6BB5",
      addOption: "\u6DFB\u52A0\u9009\u9879",
      addConnection: "\u6DFB\u52A0\u8FDE\u63A5",
      deleteConnection: "\u5220\u9664\u8FDE\u63A5",
      addSimulationElement: "\u6DFB\u52A0\u4EFF\u771F\u5143\u7D20",
      deleteSimulationElement: "\u5220\u9664\u4EFF\u771F\u5143\u7D20"
    },
    tabs: {
      basics: "\u57FA\u7840",
      geometry: "\u51E0\u4F55",
      handles: "\u8FDE\u63A5\u70B9",
      fields: "\u5B57\u6BB5",
      connections: "\u5185\u90E8\u8FDE\u63A5",
      simulation: "\u4EFF\u771F",
      runtime: "\u8FD0\u884C\u65F6"
    },
    fields: {
      id: "\u7EC4\u4EF6 ID",
      version: "\u7248\u672C",
      name: "\u540D\u79F0",
      descriptionShort: "\u7B80\u77ED\u63CF\u8FF0",
      description: "\u63CF\u8FF0",
      group: "\u5206\u7EC4",
      showName: "\u663E\u793A\u540D\u79F0",
      imageUrl: "\u56FE\u7247 URL",
      imageWidth: "\u56FE\u7247\u5BBD\u5EA6",
      imageHeight: "\u56FE\u7247\u9AD8\u5EA6",
      rotation: "\u65CB\u8F6C",
      borderWidth: "\u8FB9\u6846\u5BBD\u5EA6",
      lengthStep: "\u7269\u7406\u957F\u5EA6\u6B65\u8FDB",
      rotatable: "\u53EF\u65CB\u8F6C",
      resizableX: "\u53EF\u6CBF X \u8C03\u6574",
      resizableY: "\u53EF\u6CBF Y \u8C03\u6574",
      noBackgroundImage: "\u65E0\u80CC\u666F\u56FE\u7247"
    },
    sections: {
      applyHandles: "\u5E94\u7528\u8FDE\u63A5\u70B9",
      applyFields: "\u5E94\u7528\u5B57\u6BB5",
      applyConnections: "\u5E94\u7528\u5185\u90E8\u8FDE\u63A5",
      applySimulation: "\u5E94\u7528\u4EFF\u771F",
      applyRuntime: "\u5E94\u7528\u8FD0\u884C\u65F6",
      handlesDescription: "\u4EE5 schema JSON \u7F16\u8F91\u7EC4\u4EF6\u8FDE\u63A5\u70B9\u3002\u9A8C\u8BC1\u4F1A\u68C0\u67E5 ID\u3001\u5C3A\u5BF8\u3001\u529F\u80FD\u3001\u9690\u85CF\u6761\u4EF6\u548C\u5F15\u7528\u3002",
      fieldsDescription: "\u4EE5 schema JSON \u7F16\u8F91\u6570\u5B57\u5B57\u6BB5\u548C\u9009\u62E9\u5B57\u6BB5\u3002\u9009\u62E9\u9879\u53EF\u4EE5\u5305\u542B\u53EF\u9009\u56FE\u7247\u5B9A\u4E49\u3002",
      connectionsDescription: "\u4EE5 schema JSON \u7F16\u8F91\u5185\u90E8\u77ED\u63A5\u548C\u4FDD\u9669\u4E1D\u8FDE\u63A5\u3002",
      simulationDescription: "\u4EE5 schema JSON \u7F16\u8F91\u4EFF\u771F\u5B9A\u4E49\uFF1B\u6CA1\u6709\u4EFF\u771F\u6570\u636E\u65F6\u4F7F\u7528 null\u3002",
      runtimeDescription: "\u4EE5 schema JSON \u7F16\u8F91\u5DF2\u6709\u7684\u8FD0\u884C\u65F6 UI \u9009\u9879\uFF1B\u4E0D\u9700\u8981\u65F6\u4F7F\u7528 null\u3002"
    },
    preview: {
      title: "\u9884\u89C8"
    },
    validation: {
      title: "\u9A8C\u8BC1",
      noIssues: "\u6CA1\u6709\u9A8C\u8BC1\u95EE\u9898\u3002"
    },
    messages: {
      savedLocal: "\u7EC4\u4EF6\u8349\u7A3F\u5DF2\u4FDD\u5B58\u5230\u672C\u5730\u3002",
      imported: "\u7EC4\u4EF6\u5305\u5DF2\u5BFC\u5165\u3002",
      importFailed: "\u65E0\u6CD5\u5BFC\u5165\u7EC4\u4EF6\u5305\u3002",
      invalidJson: "JSON \u65E0\u6548",
      noHandles: "\u8FD8\u6CA1\u6709\u8FDE\u63A5\u70B9\u3002\u6DFB\u52A0\u4E00\u4E2A\u8FDE\u63A5\u70B9\u540E\u5373\u53EF\u7F16\u8F91\u5176\u5C5E\u6027\u3002",
      noFields: "\u8FD8\u6CA1\u6709\u5B57\u6BB5\u3002\u6DFB\u52A0\u4E00\u4E2A\u5B57\u6BB5\u540E\u5373\u53EF\u7F16\u8F91\u5176\u5C5E\u6027\u3002",
      noConnections: "\u8FD8\u6CA1\u6709\u8FDE\u63A5\u3002\u6DFB\u52A0\u4E00\u4E2A\u8FDE\u63A5\u540E\u5373\u53EF\u7F16\u8F91\u5176\u5C5E\u6027\u3002",
      noSimulationElements: "\u8FD8\u6CA1\u6709\u4EFF\u771F\u5143\u7D20\u3002\u6DFB\u52A0\u4E00\u4E2A\u4EFF\u771F\u5143\u7D20\u540E\u5373\u53EF\u7F16\u8F91\u5176\u5C5E\u6027\u3002"
    }
  },
  popover: {
    selectWireLength: "\u9009\u62E9\u5BFC\u7EBF\u957F\u5EA6\uFF08\u7269\u7406\u5C3A\u5BF8\uFF09\uFF1A",
    selectWireCrossSection: "\u9009\u62E9\u5BFC\u7EBF\u6A2A\u622A\u9762\u79EF\uFF08\u7269\u7406\u5C3A\u5BF8\uFF09\uFF1A",
    selectWireWidth: "\u9009\u62E9\u5BFC\u7EBF\u5BBD\u5EA6\uFF08\u7528\u4E8E\u7ED8\u5236\uFF09\uFF1A",
    startConnection: "\u8BF7\u9009\u62E9\u8D77\u59CB\u5F15\u811A/\u7AEF\u5B50\uFF1A",
    closeConnection: "\u8BF7\u9009\u62E9\u7ED3\u675F\u5F15\u811A/\u7AEF\u5B50\uFF1A"
  },
  select: {
    startConnection: "\u9009\u62E9\u5F15\u811A / \u7AEF\u5B50",
    closeConnection: "\u9009\u62E9\u5F15\u811A / \u7AEF\u5B50"
  },
  message: {
    startPinSelected: "\u8D77\u59CB\u5F15\u811A/\u7AEF\u5B50\u5DF2\u9009\u62E9\u3002\u73B0\u5728\u8BF7\u9009\u62E9\u76EE\u6807\u5F15\u811A/\u7AEF\u5B50\u3002",
    closePinSelected: "\u8FDE\u63A5\u5DF2\u5C31\u7EEA\u3002",
    startPinFirst: "\u8BF7\u5148\u9009\u62E9\u8D77\u59CB\u5F15\u811A/\u7AEF\u5B50\uFF01",
    theSamePin: "\u8D77\u59CB\u5F15\u811A/\u7AEF\u5B50\u4E0E\u7ED3\u675F\u5F15\u811A/\u7AEF\u5B50\u76F8\u540C\uFF01",
    compAddSuccess: "\u5DF2\u6DFB\u52A0\u5230\u56FE\u7EB8\uFF01",
    loadModelSuccess: "WLED \u5E03\u7EBF\u6A21\u578B\u5DF2\u6210\u529F\u52A0\u8F7D\uFF01",
    loadModelSuccessShort: "\u6210\u529F",
    loadingModel: "\u6B63\u5728\u4ECE\u6587\u4EF6\u94FE\u63A5\u52A0\u8F7D\u5E03\u7EBF\u6A21\u578B...",
    loadModelError: "\u65E0\u6CD5\u52A0\u8F7D WLED \u5E03\u7EBF\u6A21\u578B\u3002\u6B64\u94FE\u63A5\u53EF\u80FD\u5DF2\u5931\u6548\u3002",
    loadModelErrorShort: "\u9519\u8BEF",
    loadModelWrongLink: "\u94FE\u63A5\u9519\u8BEF\uFF01\u8BF7\u68C0\u67E5\u3002",
    saveModelSuccess: "\u6A21\u578B\u5DF2\u4FDD\u5B58\u3002",
    saveModelDownloadStarted: "\u6A21\u578B\u4E0B\u8F7D\u5DF2\u5F00\u59CB\u3002",
    saveModelError: "\u65E0\u6CD5\u4FDD\u5B58\u6A21\u578B\u3002",
    componentUpdatesApplied: "\u66F4\u65B0\u5DF2\u5E94\u7528\u3002\u8BF7\u68C0\u67E5\u6B64\u7EC4\u4EF6\u3002",
    componentUpdatesAppliedShort: "\u5DF2\u5E94\u7528\u66F4\u65B0",
    componentUpdatesAvailableTitle: "\u6709\u53EF\u7528\u7684\u7EC4\u4EF6\u66F4\u65B0",
    componentUpdatesAvailableDescription: "\u6B64\u56FE\u7EB8\u4E2D\u6709 {{count}} \u4E2A\u7EC4\u4EF6\u53EF\u4EE5\u66F4\u65B0\u5230\u5F53\u524D\u6A21\u677F\u3002\u73B0\u5728\u66F4\u65B0\u6240\u6709\u7EC4\u4EF6\u5417\uFF1F",
    componentUpdatesApplyAll: "\u5168\u90E8\u66F4\u65B0",
    componentUpdatesSkip: "\u4E0D\u66F4\u65B0",
    componentUpdatesAllApplied: "\u5DF2\u5E94\u7528 {{count}} \u4E2A\u7EC4\u4EF6\u66F4\u65B0\u3002"
  },
  sidebar: {
    components: {
      title: "\u7EC4\u4EF6",
      popoverTitle: "\u7EC4\u4EF6\u4FE1\u606F",
      addButtonText: "\u6DFB\u52A0\u5230\u56FE\u7EB8",
      updateButtonText: "\u66F4\u65B0\u6B64\u7EC4\u4EF6",
      updatePopoverTitle: "\u6B64\u7EC4\u4EF6\u7684\u66F4\u6539",
      applyUpdatesButtonText: "\u5E94\u7528\u66F4\u65B0",
      updateExplanation: "\u56FE\u7EB8\u4E2D\u7684\u6B64\u7EC4\u4EF6\u7248\u672C\u65E9\u4E8E\u5E94\u7528\u4E2D\u7684\u5F53\u524D\u7EC4\u4EF6\u3002\u53EF\u4EE5\u4F20\u9012\u4EE5\u4E0B\u66F4\u6539\u3002",
      noUpdateChanges: "\u6CA1\u6709\u53EF\u7528\u66F4\u65B0\u3002",
      updateValueMissing: "\u7F3A\u5931",
      updateChangeProperty: "\u5C5E\u6027",
      updateChangeCurrent: "\u5F53\u524D",
      updateChangeTemplate: "\u6A21\u677F",
      popoverContent: {
        whereToBuy: "\u5728\u54EA\u91CC\u8D2D\u4E70\uFF1F",
        listOfConnections: "\u5F15\u811A/\u7AEF\u5B50\u5217\u8868",
        listOfConnectionsHeading1: "\u5F15\u811A / \u7AEF\u5B50",
        listOfConnectionsHeading2: "\u63CF\u8FF0"
      }
    },
    check: {
      title: "\u68C0\u67E5\u5E03\u7EBF\u56FE",
      comingSoon: "\u57FA\u4E8E\u89C4\u5219\u7684\u68C0\u67E5\u5C06\u5728\u672A\u6765\u51E0\u4E2A\u6708\u5185\u5B9E\u73B0\u3002\u656C\u8BF7\u671F\u5F85\uFF01",
      buttonRun: "\u7ACB\u5373\u68C0\u67E5\u56FE\u7EB8",
      betaNoticeTitle: "Beta \u7248\u672C",
      betaNoticeDescription: "\u6B64\u56FE\u7EB8\u68C0\u67E5\u4ECD\u5728\u5F00\u53D1\u4E2D\u3002\u95EE\u9898\u68C0\u6D4B\u53EF\u80FD\u4E0D\u5B8C\u6574\u6216\u4E0D\u51C6\u786E\u3002",
      notChecked: "\u5C1A\u672A\u8FD0\u884C\u68C0\u67E5\u3002",
      noIssuesTitle: "\u672A\u53D1\u73B0\u95EE\u9898",
      noIssuesDescription: "\u5F53\u524D\u56FE\u7EB8\u68C0\u67E5\u672A\u53D1\u73B0\u4EFB\u4F55\u95EE\u9898\u3002",
      rulesButton: "\u89C4\u5219",
      rulesModalTitle: "\u5DF2\u5E94\u7528\u7684\u68C0\u67E5\u89C4\u5219",
      rulesModalDescription: "\u68C0\u67E5\u5E03\u7EBF\u56FE\u65F6\u5F53\u524D\u4F1A\u5E94\u7528\u4EE5\u4E0B\u89C4\u5219\u3002",
      issueCount: "\u53D1\u73B0 {{count}} \u4E2A\u7ED3\u679C",
      recommendation: "\u5EFA\u8BAE",
      affectedElements: "\u53D7\u5F71\u54CD\u7684\u5143\u7D20",
      diagnostics: {
        modeLabel: "\u8BCA\u65AD\u6A21\u5F0F",
        suppressedTag: "\u5DF2\u6291\u5236",
        specificity: "\u7279\u5F02\u6027 {{value}}",
        suppressedBy: "\u6291\u5236\u6765\u6E90\uFF1A{{ids}}",
        mode: {
          "user-friendly": "\u666E\u901A",
          diagnostic: "\u6240\u6709\u95EE\u9898",
          "diagnostic-with-suppression-markers": "\u6240\u6709\u95EE\u9898 + \u6807\u8BB0"
        }
      },
      severity: {
        error: "\u9519\u8BEF",
        warning: "\u8B66\u544A",
        info: "\u4FE1\u606F"
      },
      classificationLabels: {
        gnd_net_type: "\u63A5\u5730",
        suppl_net_type: "\u76F4\u6D41\u4F9B\u7535",
        digital_net_type: "\u6570\u5B57\u4FE1\u53F7",
        pwm_net_type: "PWM",
        analog_net_type: "\u6A21\u62DF\u4FE1\u53F7",
        audio_net_type: "\u97F3\u9891",
        eth_net_type: "\u4EE5\u592A\u7F51",
        usb_net_type: "USB",
        rs485_a_net_type: "RS485 A",
        rs485_b_net_type: "RS485 B",
        N_net_type: "\u96F6\u7EBF",
        L_net_type: "\u706B\u7EBF",
        PE_net_type: "\u4FDD\u62A4\u63A5\u5730"
      },
      signalLabels: {
        digital: "\u6570\u5B57\u4FE1\u53F7",
        pwm: "PWM",
        analog: "\u6A21\u62DF\u4FE1\u53F7",
        audio: "\u97F3\u9891",
        usb: "USB"
      },
      analogLedColorLabels: {
        red: "\u7EA2\u8272",
        green: "\u7EFF\u8272",
        blue: "\u84DD\u8272",
        white: "\u767D\u8272",
        warmWhite: "\u6696\u767D"
      },
      mainsInputLabels: {
        line: "\u706B\u7EBF",
        neutral: "\u96F6\u7EBF",
        pe: "PE"
      },
      rulePlaceholders: {
        signal: "\u4FE1\u53F7",
        mainsInput: "\u5E02\u7535"
      },
      invalidWireReasons: {
        "missing-node": "\u7EC4\u4EF6\u7F3A\u5931",
        "missing-handle": "\u5F15\u811A\u7F3A\u5931",
        "hidden-handle": "\u5F15\u811A\u5DF2\u9690\u85CF"
      },
      issues: {
        diagramEmpty: {
          title: "\u56FE\u7EB8\u4E3A\u7A7A",
          shortDescription: "\u56FE\u7EB8\u4E2D\u5C1A\u672A\u6DFB\u52A0\u4EFB\u4F55\u7EC4\u4EF6\u3002",
          description: "\u53EA\u6709\u5728\u56FE\u7EB8\u4E2D\u5B58\u5728\u7EC4\u4EF6\u548C\u5BFC\u7EBF\u540E\uFF0C\u68C0\u67E5\u624D\u80FD\u63D0\u4F9B\u6280\u672F\u63D0\u793A\u3002",
          recommendation: "\u8BF7\u5148\u6DFB\u52A0\u7EC4\u4EF6\uFF0C\u7136\u540E\u518D\u6B21\u8FD0\u884C\u68C0\u67E5\u3002"
        }
      },
      rules: {
        "network-rules": {
          title: "\u7F51\u7EDC\u89C4\u5219",
          description: "\u68C0\u67E5\u7EC4\u4EF6\u8FDE\u63A5\u7F51\u7EDC\u4E2D\u7684\u57FA\u7840\u95EE\u9898\u3002",
          issues: {
            groundMissing: {
              title: "\u6CA1\u6709\u8FDE\u63A5\u63A5\u5730\u7F51\u7EDC",
              shortDescription: "\u5B58\u5728 GND \u5F15\u811A\uFF0C\u4F46\u672A\u627E\u5230\u5DF2\u8FDE\u63A5\u7684\u63A5\u5730\u7F51\u7EDC\u3002",
              description: "\u56FE\u4E2D\u81F3\u5C11\u6709\u4E00\u4E2A GND \u5F15\u811A\uFF0C\u4F46\u6CA1\u6709\u4EFB\u4F55 GND \u5F15\u811A\u88AB\u63A5\u7EBF\u3002\u9700\u8981\u63A5\u5730\u53C2\u8003\u7684\u7EC4\u4EF6\u5E94\u8FDE\u63A5\u5230\u516C\u5171\u63A5\u5730\u3002",
              recommendation: "\u5C06\u76F8\u5173\u7EC4\u4EF6\u7684 GND \u5F15\u811A\u8FDE\u63A5\u5728\u4E00\u8D77\u3002"
            },
            groundMultiple: {
              title: "\u5B58\u5728\u591A\u4E2A\u5206\u79BB\u7684\u63A5\u5730\u7F51\u7EDC",
              shortDescription: "\u6240\u6709 GND \u8FDE\u63A5\u5E94\u5C5E\u4E8E\u540C\u4E00\u4E2A\u516C\u5171\u63A5\u5730\u7F51\u7EDC\u3002",
              description: "\u53D1\u73B0 {{count}} \u4E2A\u5206\u79BB\u7684\u63A5\u5730\u7F51\u7EDC\u3002\u56E0\u6B64\u7535\u8DEF\u7684\u4E0D\u540C\u90E8\u5206\u7F3A\u5C11\u5171\u540C\u53C2\u8003\u70B9\u3002",
              recommendation: "\u5C06\u8FD9\u4E9B\u5206\u79BB\u7684\u63A5\u5730\u7F51\u7EDC\u8FDE\u63A5\u5728\u4E00\u8D77\u3002"
            },
            mainsLowVoltageMixed: {
              title: "\u5E02\u7535\u4E0E\u4F4E\u538B\u7EBF\u8DEF\u76F8\u8FDE",
              shortDescription: "\u4E00\u4E2A\u7F51\u7EDC\u5C06 L/N \u4E0E\u4F4E\u538B\u6216\u4FE1\u53F7\u7AEF\u5B50\u8FDE\u63A5\u5728\u4E00\u8D77\u3002",
              description: "\u8BE5\u7F51\u7EDC\u5305\u542B {{classifications}}\u3002\u5E02\u7535\u4E0D\u5F97\u4E0E GND\u3001\u76F4\u6D41\u4F9B\u7535\u6216\u4FE1\u53F7\u7F51\u7EDC\u76F8\u8FDE\u3002",
              recommendation: "\u5C06\u5E02\u7535\u5E03\u7EBF\u4E0E\u4F4E\u538B\u53CA\u4FE1\u53F7\u5E03\u7EBF\u4E25\u683C\u5206\u5F00\u3002"
            },
            peActiveMixed: {
              title: "\u4FDD\u62A4\u63A5\u5730\u8FDE\u63A5\u5230\u5E26\u7535\u7EBF\u8DEF",
              shortDescription: "PE \u7F51\u7EDC\u8FDE\u63A5\u5230\u4E86\u5E26\u7535\u4F9B\u7535\u7EBF\u8DEF\u6216\u4FE1\u53F7\u7F51\u7EDC\u3002",
              description: "\u8BE5\u7F51\u7EDC\u5305\u542B {{classifications}}\u3002PE \u4E0D\u5F97\u4E0E L\u3001N\u3001\u76F4\u6D41\u4F9B\u7535\u6216\u4FE1\u53F7\u8FDE\u63A5\u3002",
              recommendation: "\u5C06 PE \u4E0E\u5E26\u7535\u5BFC\u4F53\u548C\u4FE1\u53F7\u8FDE\u63A5\u5206\u5F00\u3002"
            },
            rs485Mixed: {
              title: "RS485 A \u548C B \u88AB\u8FDE\u63A5\u5728\u4E00\u8D77",
              shortDescription: "\u4E00\u4E2A\u7F51\u7EDC\u5C06 RS485_A \u4E0E RS485_B \u76F8\u8FDE\u3002",
              description: "\u5DEE\u5206 RS485 \u7EBF\u8DEF A \u548C B \u4E0D\u5F97\u76F8\u4E92\u8FDE\u63A5\u3002",
              recommendation: "\u5C06 RS485_A \u548C RS485_B \u5206\u6210\u4E24\u4E2A\u72EC\u7ACB\u7F51\u7EDC\u3002"
            },
            mixedClassifications: {
              title: "\u4E0D\u540C\u8F93\u51FA\u7C7B\u578B\u88AB\u8FDE\u63A5\u5728\u4E00\u8D77",
              shortDescription: "\u4E00\u4E2A\u7F51\u7EDC\u5305\u542B\u591A\u4E2A\u7F51\u7EDC\u7C7B\u522B\u3002",
              description: "\u8BE5\u7F51\u7EDC\u540C\u65F6\u5305\u542B {{classifications}}\u3002\u8FD9\u8868\u793A\u4E0D\u540C\u7C7B\u578B\u7684\u8F93\u51FA\u88AB\u8FDE\u63A5\u5728\u4E00\u8D77\u3002",
              recommendation: "\u5C06\u4E0D\u540C\u8F93\u51FA\u7C7B\u578B\u5206\u79BB\u5230\u5404\u81EA\u72EC\u7ACB\u7684\u7F51\u7EDC\u4E2D\u3002"
            },
            multipleSupplySources: {
              title: "\u591A\u4E2A\u72EC\u7ACB\u7535\u538B\u6E90\u88AB\u8FDE\u63A5\u5728\u4E00\u8D77",
              shortDescription: "\u4E00\u4E2A\u4F9B\u7535\u7F51\u7EDC\u5305\u542B\u591A\u4E2A\u72EC\u7ACB\u7535\u538B\u6E90\u3002",
              description: "\u8BE5\u7F51\u7EDC\u5305\u542B {{count}} \u4E2A\u72EC\u7ACB\u7535\u538B\u6E90\uFF1A{{sources}}\u3002",
              recommendation: "\u5206\u79BB\u8FD9\u4E9B\u7535\u538B\u6E90\uFF0C\u6216\u786E\u8BA4\u540C\u4E00\u7F51\u7EDC\u4E2D\u53EA\u6709\u8F6C\u63A5/\u4F20\u9012\u7684\u8F93\u51FA\u3002"
            },
            signalSinkWithoutSource: {
              title: "{{signal}}\u8F93\u5165\u6CA1\u6709\u4FE1\u53F7\u6E90",
              shortDescription: "\u4E00\u4E2A {{signal}} \u8F93\u5165\u5DF2\u63A5\u7EBF\uFF0C\u4F46\u7F51\u7EDC\u4E2D\u6CA1\u6709\u5339\u914D\u7684\u4FE1\u53F7\u6E90\u3002",
              description: "\u8BE5\u7F51\u7EDC\u5305\u542B {{sinks}}\uFF0C\u4F46\u6CA1\u6709\u5339\u914D\u7684 {{signal}} \u8F93\u51FA\u3002",
              recommendation: "\u5C06\u8BE5\u8F93\u5165\u8FDE\u63A5\u5230\u5339\u914D\u7684\u8F93\u51FA\uFF0C\u6216\u68C0\u67E5\u76F8\u5173\u7EC4\u4EF6\u7684\u5F15\u811A\u529F\u80FD\u3002"
            },
            digitalSignalVoltageMismatch: {
              title: "\u6570\u5B57\u7535\u5E73\u4E0D\u5339\u914D",
              shortDescription: "\u4E00\u4E2A\u6570\u5B57\u8F93\u5165\u7531\u4E0D\u517C\u5BB9\u7684\u8F93\u51FA\u7535\u538B\u9A71\u52A8\u3002",
              description: "{{input}} \u5141\u8BB8 {{min}} V \u5230 {{max}} V\uFF0C\u4F46\u8FDE\u63A5\u5230\u4E86\u4E0D\u517C\u5BB9\u7684\u6570\u5B57\u8F93\u51FA\uFF1A{{sources}}\u3002",
              recommendation: "\u4F7F\u7528\u5408\u9002\u7684\u7535\u5E73\u8F6C\u6362\u5668\uFF0C\u6216\u5C06\u8BE5\u8F93\u5165\u8FDE\u63A5\u5230\u5141\u8BB8\u7535\u538B\u8303\u56F4\u5185\u7684\u6570\u5B57\u8F93\u51FA\u3002"
            },
            multipleSignalSources: {
              title: "\u8FDE\u63A5\u4E86\u591A\u4E2A {{signal}} \u6E90",
              shortDescription: "\u4E00\u4E2A {{signal}} \u7F51\u7EDC\u5305\u542B\u591A\u4E2A\u8F93\u51FA\u3002",
              description: "\u8BE5\u7F51\u7EDC\u8FDE\u63A5\u4E86\u591A\u4E2A {{signal}} \u6E90\uFF1A{{sources}}\u3002",
              recommendation: "\u5206\u79BB\u8FD9\u4E9B\u8F93\u51FA\uFF0C\u786E\u4FDD\u6BCF\u4E2A\u4FE1\u53F7\u7F51\u7EDC\u53EA\u6709\u4E00\u4E2A\u4FE1\u53F7\u6E90\u3002"
            },
            supplyInputWithoutSource: {
              title: "\u4F9B\u7535\u8F93\u5165\u6CA1\u6709\u7535\u538B\u6E90",
              shortDescription: "\u4E00\u4E2A\u4F9B\u7535\u8F93\u5165\u5DF2\u63A5\u7EBF\uFF0C\u4F46\u7F51\u7EDC\u4E2D\u6CA1\u6709\u7535\u538B\u6E90\u3002",
              description: "\u8BE5\u7F51\u7EDC\u5305\u542B\u4F9B\u7535\u8F93\u5165\uFF08{{inputs}}\uFF09\uFF0C\u4F46\u6CA1\u6709\u72EC\u7ACB\u7684 suppl_out \u8F93\u51FA\u3002",
              recommendation: "\u5C06\u8BE5\u7F51\u7EDC\u8FDE\u63A5\u5230\u5408\u9002\u7684\u7535\u538B\u6E90\u3002"
            },
            supplySourceWithoutConsumer: {
              title: "\u4F9B\u7535\u7F51\u7EDC\u6CA1\u6709\u8D1F\u8F7D",
              shortDescription: "\u4E00\u4E2A\u4F9B\u7535\u8F93\u51FA\u5DF2\u63A5\u7EBF\uFF0C\u4F46\u6CA1\u6709\u8FDE\u63A5\u4F9B\u7535\u8F93\u5165\u3002",
              description: "\u8BE5\u7F51\u7EDC\u5305\u542B\u7535\u538B\u6E90\uFF0C\u4F46\u6CA1\u6709\u8BC6\u522B\u5230\u4F9B\u7535\u8D1F\u8F7D\u3002",
              recommendation: "\u68C0\u67E5\u8BE5\u4F9B\u7535\u662F\u5426\u5E94\u7EE7\u7EED\u8FDE\u63A5\u5230\u5E26\u6709\u4F9B\u7535\u8F93\u5165\u7684\u7EC4\u4EF6\u3002"
            },
            supplyVoltageMismatch: {
              title: "\u4F9B\u7535\u7535\u538B\u4E0D\u5339\u914D",
              shortDescription: "\u6E90\u7535\u538B\u4E0E\u4F9B\u7535\u7F51\u7EDC\u4E2D\u7684\u67D0\u4E9B\u5F15\u811A\u5BB9\u5DEE\u4E0D\u5339\u914D\u3002",
              description: "\u8BE5\u7535\u6E90\u63D0\u4F9B {{voltage}} V\uFF0C\u4F46\u81F3\u5C11\u4E00\u4E2A\u5DF2\u8FDE\u63A5\u5F15\u811A\u4E0D\u5141\u8BB8\u8BE5\u7535\u538B\u8303\u56F4\uFF1A{{inputs}}\u3002",
              recommendation: "\u8C03\u6574\u4F9B\u7535\u7535\u538B\uFF0C\u6216\u5C06\u5141\u8BB8\u7535\u538B\u8303\u56F4\u4E0D\u540C\u7684\u7EC4\u4EF6\u5206\u79BB\u3002"
            },
            wireConnectedToHiddenOrMissingHandle: {
              title: "\u5BFC\u7EBF\u6307\u5411\u7F3A\u5931\u7684\u5F15\u811A",
              shortDescription: "\u5BFC\u7EBF\u7EC8\u6B62\u4E8E\u7F3A\u5931\u6216\u9690\u85CF\u7684\u5F15\u811A\u3002",
              description: "\u5BFC\u7EBF {{wire}} \u65E0\u6CD5\u5728 {{side}} \u4FA7\u7535\u6C14\u8FDE\u63A5\u5230 {{handle}} \u5F15\u811A\uFF1A{{reason}}\u3002",
              recommendation: "\u5C06\u5BFC\u7EBF\u91CD\u65B0\u8FDE\u63A5\u5230\u53EF\u89C1\u4E14\u5B58\u5728\u7684\u5F15\u811A\u3002"
            },
            mainsWireConnectedToLowVoltageComponent: {
              title: "\u5E02\u7535\u8FDE\u63A5\u5230\u4E86\u4E0D\u5408\u9002\u7684\u7EC4\u4EF6",
              shortDescription: "L/N/PE \u7F51\u7EDC\u8FDE\u63A5\u5230\u4E86\u975E\u5E02\u7535\u7AEF\u5B50\u3002",
              description: "{{component}} \u4E0A\u7684 {{handle}} \u4F4D\u4E8E\u5E02\u7535\u7F51\u7EDC\u4E2D\uFF0C\u4F46\u5B83\u4E0D\u662F L/N/PE \u7AEF\u5B50\u3002",
              recommendation: "\u79FB\u9664\u6B64\u8FDE\u63A5\uFF0C\u5E76\u4EC5\u4F7F\u7528\u9002\u7528\u4E8E\u5E02\u7535\u7535\u538B\u7684\u7AEF\u5B50\u3002"
            },
            groundAndSupplyPolaritySwapped: {
              title: "\u6B63\u6781\u4F9B\u7535\u4E0E GND \u88AB\u8FDE\u63A5\u5728\u4E00\u8D77",
              shortDescription: "\u4E00\u4E2A\u7F51\u7EDC\u540C\u65F6\u5305\u542B\u63A5\u5730\u548C\u76F4\u6D41\u4F9B\u7535\u3002",
              description: "GND \u548C\u4F9B\u7535\u7AEF\u5B50\u5728\u6B64\u7F51\u7EDC\u4E2D\u76F8\u8FDE\u3002\u8FD9\u5F88\u53EF\u80FD\u662F\u6781\u6027\u63A5\u53CD\u6216\u77ED\u8DEF\u3002",
              recommendation: "\u5206\u79BB\u6B63\u6781\u4F9B\u7535\u548C GND \u8FDE\u63A5\uFF0C\u5E76\u68C0\u67E5\u6781\u6027\u3002"
            },
            supplyVoltageUnknown: {
              title: "\u4F9B\u7535\u7535\u538B\u672A\u77E5",
              shortDescription: "\u4F9B\u7535\u7F51\u7EDC\u4E2D\u6709\u4E00\u4E2A\u65E0\u6CD5\u786E\u5B9A\u7535\u538B\u7684\u7535\u6E90\u3002",
              description: "{{source}} \u7684\u4F9B\u7535\u8FDE\u63A5\u5230\u4E86\u8F93\u5165\u7AEF\uFF0C\u4F46\u65E0\u6CD5\u89E3\u6790\u7535\u538B\u503C\u3002",
              recommendation: "\u5728\u7535\u6E90\u6216\u76F8\u5173\u5B57\u6BB5\u4E0A\u8BBE\u7F6E\u7535\u538B\u503C\u3002"
            },
            signalOutputWithoutConsumer: {
              title: "{{signal}} \u8F93\u51FA\u6CA1\u6709\u8D1F\u8F7D",
              shortDescription: "\u4FE1\u53F7\u8F93\u51FA\u5DF2\u63A5\u7EBF\uFF0C\u4F46\u6CA1\u6709\u5230\u8FBE\u5339\u914D\u7684\u8F93\u5165\u3002",
              description: "{{source}} \u5DF2\u8FDE\u63A5\uFF0C\u4F46\u672A\u627E\u5230\u5339\u914D\u7684 {{signal}} \u8F93\u5165\u3002",
              recommendation: "\u5C06\u4FE1\u53F7\u8FDE\u63A5\u5230\u5339\u914D\u7684\u8F93\u5165\uFF0C\u6216\u79FB\u9664\u672A\u4F7F\u7528\u7684\u8FDE\u63A5\u3002"
            },
            dataDirectionWrong: {
              title: "\u6570\u636E\u65B9\u5411\u4E0D\u5408\u7406",
              shortDescription: "LED \u6570\u636E\u7F51\u7EDC\u53EA\u8FDE\u63A5\u4E86\u8F93\u51FA\u7AEF\u6216\u53EA\u8FDE\u63A5\u4E86\u8F93\u5165\u7AEF\u3002",
              description: "\u8FD9\u4E9B\u6570\u636E\u7AEF\u5B50\u6CA1\u6709\u5F62\u6210\u5408\u7406\u7684\u6E90\u5230\u63A5\u6536\u7AEF\u8FDE\u63A5\uFF1A{{handles}}\u3002",
              recommendation: "\u6309\u6B63\u786E\u65B9\u5411\u5C06 DATA_out \u8FDE\u63A5\u5230 DATA_in\u3002"
            },
            clockedLedClockMissing: {
              title: "\u65F6\u949F\u7EBF\u7F3A\u5931\u6216\u4E0D\u5339\u914D",
              shortDescription: "\u5E26\u65F6\u949F\u7684 LED \u706F\u5E26\u6709\u6570\u636E\u8FDE\u63A5\uFF0C\u4F46\u6CA1\u6709\u5339\u914D\u7684\u65F6\u949F\u8FDE\u63A5\u3002",
              description: "{{component}} \u9700\u8981\u4E0E DATA \u5339\u914D\u7684\u65F6\u949F\u7EBF\u3002\u5728 LED \u5230 LED \u4E32\u63A5\u65F6\uFF0C\u65F6\u949F\u5FC5\u987B\u6765\u81EA\u540C\u4E00\u4E2A\u4E0A\u6E38\u5206\u6BB5\u3002",
              recommendation: "\u5C06 Clock_in \u8FDE\u63A5\u5230\u5339\u914D\u7684\u65F6\u949F\u8F93\u51FA\u3002"
            },
            digitalBackupPairMismatch: {
              title: "\u5907\u7528\u6570\u636E\u7EBF\u4E0D\u5339\u914D",
              shortDescription: "Backup_in \u5E76\u975E\u6765\u81EA\u4E0A\u6E38 LED \u706F\u5E26\u5339\u914D\u7684 Backup_out\u3002",
              description: "{{component}} \u7684\u6570\u636E\u6765\u81EA {{source}}\uFF0C\u4F46\u5907\u7528\u7EBF\u4E0D\u662F\u6765\u81EA\u540C\u4E00\u6761\u706F\u5E26\u3002",
              recommendation: "\u5C06 Backup_in \u8FDE\u63A5\u5230\u540C\u4E00\u4E0A\u6E38\u706F\u5E26\u7684 Backup_out\u3002"
            },
            digitalBackupInputTiedToData: {
              title: "Backup_in \u8FDE\u63A5\u5230\u4E86\u6570\u636E\u7EBF",
              shortDescription: "Backup_in \u8FDE\u63A5\u5230\u6570\u636E\u7F51\u7EDC\u53EF\u4EE5\u5BB9\u5FCD\uFF0C\u4F46\u5EFA\u8BAE\u8FDE\u63A5\u5230 GND\u3002",
              description: "{{component}} \u4E0D\u662F\u4E0B\u6E38\u706F\u5E26\u3002Backup_in \u4F4D\u4E8E\u6570\u636E\u7F51\u7EDC\u800C\u4E0D\u662F GND\u3002",
              recommendation: "\u4F18\u5148\u5C06 Backup_in \u8FDE\u63A5\u5230 GND\u3002"
            },
            digitalBackupInputNotGrounded: {
              title: "Backup_in \u672A\u8FDE\u63A5\u5230 GND",
              shortDescription: "\u7B2C\u4E00\u6761 LED \u706F\u5E26\u7684 Backup_in \u672A\u8FDE\u63A5\u5230 GND\u3002",
              description: "{{component}} \u4E0D\u662F\u7531\u4E0A\u4E00\u6761 LED \u706F\u5E26\u4F9B\u7ED9\u6570\u636E\u3002Backup_in \u5FC5\u987B\u8FDE\u63A5\u5230 GND\u3002",
              recommendation: "\u5C06 Backup_in \u8FDE\u63A5\u5230 GND\u3002"
            },
            fuseBypassed: {
              title: "\u4FDD\u9669\u4E1D\u88AB\u65C1\u8DEF",
              shortDescription: "\u4FDD\u9669\u4E1D\u8F93\u5165\u548C\u8F93\u51FA\u5728\u5916\u90E8\u88AB\u76F4\u63A5\u8FDE\u63A5\u3002",
              description: "{{component}} \u4E2D\u4FDD\u9669\u4E1D\u7684\u4E24\u4FA7\u5728\u5916\u90E8\u5C5E\u4E8E\u540C\u4E00\u7F51\u7EDC\u3002\u4FDD\u62A4\u529F\u80FD\u88AB\u65C1\u8DEF\u3002",
              recommendation: "\u79FB\u9664\u8DE8\u63A5\u4FDD\u9669\u4E1D\u7684\u5916\u90E8\u6865\u63A5\u3002"
            },
            usbPowerPairInvalid: {
              title: "USB \u4F9B\u7535\u8FDE\u63A5\u65E0\u6548",
              shortDescription: "USB \u4F9B\u7535\u5FC5\u987B\u5C06\u4E00\u4E2A USB \u7535\u6E90\u76F4\u63A5\u8FDE\u63A5\u5230\u4E00\u4E2A USB \u8BBE\u5907\u3002",
              description: "\u6B64 USB \u4F9B\u7535\u7F51\u7EDC\u4E0D\u662F\u70B9\u5BF9\u70B9\u8FDE\u63A5\uFF1A{{reason}}\u3002",
              recommendation: "\u4F7F\u7528\u4E00\u6839\u76F4\u63A5 USB \u7EBF\uFF0C\u5C06\u4E00\u4E2A USB \u7535\u6E90\u8F93\u51FA\u8FDE\u63A5\u5230\u4E00\u4E2A USB \u8BBE\u5907\uFF0C\u4E0D\u8981\u4F7F\u7528\u5206\u652F\u6216\u989D\u5916\u7AEF\u5B50\u3002"
            },
            wireWithoutPhysicalParameters: {
              title: "\u7535\u6E90\u5BFC\u7EBF\u7F3A\u5C11\u7269\u7406\u53C2\u6570",
              shortDescription: "\u7535\u6E90\u3001GND \u6216 USB \u5BFC\u7EBF\u7F3A\u5C11\u957F\u5EA6\u6216\u6A2A\u622A\u9762\u79EF\u3002",
              description: "\u6B64\u5BFC\u7EBF\u4F4D\u4E8E\u4F9B\u7535\u3001GND \u6216 USB \u7F51\u7EDC\u4E2D\uFF0C\u4F46\u7F3A\u5C11\u957F\u5EA6\u6216\u6A2A\u622A\u9762\u79EF\u3002",
              recommendation: "\u4E3A\u6B64\u5BFC\u7EBF\u8BBE\u7F6E\u957F\u5EA6\u548C\u6A2A\u622A\u9762\u79EF\u3002"
            },
            duplicateParallelWire: {
              title: "\u91CD\u590D\u7684\u5E76\u8054\u8FDE\u63A5",
              shortDescription: "\u591A\u6761\u5BFC\u7EBF\u8FDE\u63A5\u4E86\u540C\u4E00\u5BF9\u5F15\u811A\u3002",
              description: "{{count}} \u6761\u5BFC\u7EBF\u8FDE\u63A5\u4E86\u540C\u4E00\u5BF9\u5F15\u811A\u3002",
              recommendation: "\u79FB\u9664\u610F\u5916\u91CD\u590D\u7684\u5BFC\u7EBF\u3002"
            }
          }
        },
        "component-rules": {
          title: "\u7EC4\u4EF6\u89C4\u5219",
          description: "\u68C0\u67E5\u5355\u4E2A\u7EC4\u4EF6\u7684\u57FA\u7840\u8981\u6C42\u3002",
          issues: {
            requiredPinUnconnected: {
              title: "\u5FC5\u63A5\u5F15\u811A\u672A\u8FDE\u63A5",
              shortDescription: "\u67D0\u4E2A\u7EC4\u4EF6\u6709\u5FC5\u987B\u8FDE\u63A5\u7684\u5F15\u811A\u3002",
              description: "{{component}} \u5B58\u5728\u672A\u8FDE\u63A5\u7684\u5FC5\u63A5\u5F15\u811A\uFF1A{{handles}}\u3002",
              recommendation: "\u8FDE\u63A5\u8BE5\u7EC4\u4EF6\u4E0A\u6240\u6709\u6807\u8BB0\u4E3A\u5FC5\u987B\u8FDE\u63A5\u7684\u5F15\u811A\u3002"
            },
            groundMissing: {
              title: "\u7EC4\u4EF6\u6CA1\u6709\u63A5\u5730",
              shortDescription: "\u5E26 GND \u5F15\u811A\u7684\u7EC4\u4EF6\u672A\u8FDE\u63A5\u5230\u63A5\u5730\u3002",
              description: "{{component}} \u5177\u6709 GND \u5F15\u811A\uFF0C\u4F46\u6CA1\u6709\u4EFB\u4F55\u4E00\u4E2A\u8FDE\u63A5\u5230\u63A5\u5730\u7F51\u7EDC\u3002",
              recommendation: "\u5C06\u8BE5\u7EC4\u4EF6\u7684\u81F3\u5C11\u4E00\u4E2A GND \u5F15\u811A\u8FDE\u63A5\u5230\u516C\u5171\u63A5\u5730\u7F51\u7EDC\u3002"
            },
            powerMissing: {
              title: "\u7EC4\u4EF6\u6CA1\u6709\u4F9B\u7535",
              shortDescription: "\u5E26\u4F9B\u7535\u8F93\u5165\u7684\u7EC4\u4EF6\u672A\u4F9B\u7535\u3002",
              description: "{{component}} \u5177\u6709\u4F9B\u7535\u6216 USB \u8F93\u5165\uFF0C\u4F46\u6CA1\u6709\u4EFB\u4F55\u4F9B\u7535\u8F93\u5165\u8FDE\u63A5\u5230\u5305\u542B\u5176\u4ED6\u7EC4\u4EF6 suppl_out \u5F15\u811A\u7684\u4F9B\u7535\u7F51\u7EDC\uFF0C\u4E5F\u6CA1\u6709 USB \u7AEF\u5B50\u8FDE\u63A5\u5230 USB \u7F51\u7EDC\u3002",
              recommendation: "\u5C06\u4F9B\u7535\u8F93\u5165\u8FDE\u63A5\u5230\u5408\u9002\u7684\u5916\u90E8\u7535\u538B\u6E90\uFF0C\u6216\u5C06 USB \u7AEF\u5B50\u8FDE\u63A5\u5230 USB \u4F9B\u7535\u3002"
            },
            mainsInputMissing: {
              title: "{{label}}\u8F93\u5165\u672A\u8FDE\u63A5",
              shortDescription: "\u5E26 {{label}} \u8F93\u5165\u7684\u7EC4\u4EF6\u672A\u8FDE\u63A5\u5230\u5339\u914D\u7684\u7F51\u7EDC\u3002",
              description: "{{component}} \u5177\u6709 {{label}} \u8F93\u5165\uFF0C\u4F46\u81F3\u5C11\u4E00\u4E2A\u672A\u8FDE\u63A5\u5230\u5339\u914D\u7684 {{label}} \u7F51\u7EDC\u3002",
              recommendation: "\u5C06\u8BE5\u7EC4\u4EF6\u7684\u6BCF\u4E2A {{label}} \u8F93\u5165\u8FDE\u63A5\u5230\u5339\u914D\u7684 {{label}} \u7F51\u7EDC\u3002"
            },
            unusedRequiredFunctionalGroup: {
              title: "\u5DF2\u4F7F\u7528\u7684\u529F\u80FD\u7EC4\u4E0D\u5B8C\u6574",
              shortDescription: "LED \u8F93\u5165\u7EC4\u53EA\u8FDE\u63A5\u4E86\u4E00\u90E8\u5206\u3002",
              description: "{{component}} \u5DF2\u4F7F\u7528\u6570\u636E\u8F93\u5165\uFF0C\u4F46\u8BE5\u7EC4\u7F3A\u5C11\u4F9B\u7535\u6216 GND\u3002",
              recommendation: "\u4E3A LED \u8F93\u5165\u7EC4\u8FDE\u63A5\u6570\u636E\u3001\u4F9B\u7535\u548C GND\u3002"
            },
            controlledOutputWithoutControlInput: {
              title: "\u53D7\u63A7\u8F93\u51FA\u6CA1\u6709\u63A7\u5236\u4FE1\u53F7",
              shortDescription: "\u5DF2\u4F7F\u7528\u7684\u53EF\u63A7\u8F93\u51FA\u6CA1\u6709\u6570\u5B57\u63A7\u5236\u8F93\u5165\u3002",
              description: "{{component}} \u4F7F\u7528\u4E86 {{output}}\uFF0C\u4F46\u76F8\u5173\u63A7\u5236\u8F93\u5165 {{control}} \u672A\u8FDE\u63A5\u5230\u6570\u5B57\u7F51\u7EDC\u3002",
              recommendation: "\u5C06\u63A7\u5236\u8F93\u5165\u8FDE\u63A5\u5230\u5408\u9002\u7684\u6570\u5B57\u8F93\u51FA\uFF1B\u5982\u679C\u672A\u4F7F\u7528\u8BE5\u5F00\u5173\u8F93\u51FA\uFF0C\u5219\u65AD\u5F00\u5B83\u3002"
            },
            analogLedColorChannelUnconnected: {
              title: "\u989C\u8272\u901A\u9053\u672A\u8FDE\u63A5",
              shortDescription: "\u6A21\u62DF LED \u706F\u5E26\u7684\u4E00\u4E2A\u989C\u8272\u65E0\u6CD5\u63A7\u5236\u3002",
              description: "{{component}} \u6CA1\u6709\u8FDE\u63A5 {{color}} \u901A\u9053\u3002\u76F8\u5173\u5F15\u811A\uFF1A{{handles}}\u3002",
              recommendation: "\u5982\u679C\u9700\u8981\u63A7\u5236\u8BE5\u989C\u8272\uFF0C\u8BF7\u5C06\u81F3\u5C11\u4E00\u4E2A {{color}} \u7AEF\u5B50\u8FDE\u63A5\u5230\u5408\u9002\u7684 PWM \u8F93\u51FA\u3002"
            },
            analogLedColorChannelMultiplePwmSignals: {
              title: "\u989C\u8272\u901A\u9053\u8FDE\u63A5\u5230\u591A\u4E2A PWM \u4FE1\u53F7",
              shortDescription: "\u6A21\u62DF LED \u706F\u5E26\u7684\u4E00\u4E2A\u989C\u8272\u8FDE\u63A5\u5230\u4E86\u4E0D\u540C\u7684 PWM \u8F93\u51FA\u3002",
              description: "{{component}} \u7684 {{color}} \u901A\u9053\u8FDE\u63A5\u5230\u4E86\u591A\u4E2A PWM \u4FE1\u53F7\uFF1A{{signals}}\u3002\u76F8\u5173\u5F15\u811A\uFF1A{{handles}}\u3002",
              recommendation: "\u540C\u4E00\u989C\u8272\u901A\u9053\u7684\u6240\u6709\u7AEF\u5B50\u5E94\u8FDE\u63A5\u5230\u540C\u4E00\u4E2A PWM \u4FE1\u53F7\u3002\u5982\u9700\u66F4\u9AD8\u529F\u7387\uFF0C\u8BF7\u5C06\u6A21\u62DF\u706F\u5E26\u62C6\u5206\u4E3A\u72EC\u7ACB\u706F\u5E26\u6216\u9694\u79BB\u5206\u6BB5\u3002"
            },
            componentHasOnlyOneTerminalConnected: {
              title: "\u4EC5\u8FDE\u63A5\u4E86\u4E00\u4E2A\u7AEF\u5B50",
              shortDescription: "\u53CC\u7AEF\u5B50\u7EC4\u4EF6\u53EA\u6709\u4E00\u4E2A\u5F15\u811A\u5DF2\u8FDE\u63A5\u3002",
              description: "{{component}} \u53EA\u5728 {{handle}} \u5904\u8FDE\u63A5\u3002",
              recommendation: "\u8FDE\u63A5\u4E24\u4E2A\u7AEF\u5B50\uFF0C\u6216\u79FB\u9664\u672A\u4F7F\u7528\u7684\u7EC4\u4EF6\u3002"
            },
            capacitorPolarityMismatch: {
              title: "\u7535\u5BB9\u6781\u6027\u9519\u8BEF",
              shortDescription: "\u6709\u6781\u6027\u7535\u5BB9\u53EF\u80FD\u63A5\u53CD\u3002",
              description: "{{component}} \u7684\u6B63\u6781\u63A5\u5230\u4E86 GND\uFF0C\u6216\u8D1F\u6781\u63A5\u5230\u4E86\u4F9B\u7535\u3002",
              recommendation: "\u5C06\u6B63\u6781\u8FDE\u63A5\u5230\u6B63\u4F9B\u7535\uFF0C\u5C06\u8D1F\u6781\u8FDE\u63A5\u5230 GND\u3002"
            },
            mainsConnectorIncomplete: {
              title: "\u5E02\u7535\u8FDE\u63A5\u4E0D\u5B8C\u6574",
              shortDescription: "\u5E02\u7535\u7EC4\u4EF6\u53EA\u8FDE\u63A5\u4E86 L \u6216\u53EA\u8FDE\u63A5\u4E86 N\u3002",
              description: "{{component}} \u7684 L/N \u8FDE\u63A5\u4E0D\u5B8C\u6574\u3002",
              recommendation: "\u6B63\u786E\u8FDE\u63A5 L \u548C N\uFF0C\u6216\u5B8C\u5168\u65AD\u5F00\u5E02\u7535\u8FDE\u63A5\u3002"
            },
            protectiveEarthMissingForMetalOrMainsDevice: {
              title: "\u7F3A\u5C11\u4FDD\u62A4\u63A5\u5730",
              shortDescription: "\u5E26 PE \u7684\u5E02\u7535\u7EC4\u4EF6\u7F3A\u5C11\u4FDD\u62A4\u63A5\u5730\u3002",
              description: "{{component}} \u4F7F\u7528\u5E02\u7535\u7535\u538B\uFF0C\u4F46 PE \u672A\u6B63\u786E\u8FDE\u63A5\u3002",
              recommendation: "\u5C06 PE \u8FDE\u63A5\u5230\u4FDD\u62A4\u63A5\u5730\u7F51\u7EDC\u3002"
            },
            supplyInputOnlyInternallyPowered: {
              title: "\u4F9B\u7535\u4EC5\u901A\u8FC7\u5185\u90E8\u8F6C\u63A5",
              shortDescription: "\u7EC4\u4EF6\u770B\u8D77\u6765\u53EA\u901A\u8FC7\u5185\u90E8\u4F9B\u7535\u5F15\u811A\u8FDE\u63A5\u3002",
              description: "{{component}} \u5177\u6709\u4F9B\u7535\u8F93\u5165\uFF0C\u4F46\u65E0\u6CD5\u5230\u8FBE\u5916\u90E8\u7535\u538B\u6E90\u3002",
              recommendation: "\u5C06\u4F9B\u7535\u8FDE\u63A5\u5230\u5916\u90E8\u7535\u6E90\u3002"
            },
            fuseCurrentMissingOrUnderspecified: {
              title: "\u7F3A\u5C11\u4FDD\u9669\u4E1D\u989D\u5B9A\u503C",
              shortDescription: "\u4FDD\u9669\u4E1D\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u989D\u5B9A\u7535\u6D41\u3002",
              description: "{{component}} \u5305\u542B\u4E00\u4E2A\u65E0\u6CD5\u8BC4\u4F30\u989D\u5B9A\u7535\u6D41\u7684\u4FDD\u9669\u4E1D\u3002",
              recommendation: "\u8BBE\u7F6E\u6216\u68C0\u67E5\u4FDD\u9669\u4E1D\u989D\u5B9A\u503C\u3002"
            },
            isolatedComponent: {
              title: "\u7EC4\u4EF6\u5904\u4E8E\u5B64\u7ACB\u72B6\u6001",
              shortDescription: "\u6280\u672F\u7EC4\u4EF6\u6CA1\u6709\u8FDE\u63A5\u4EFB\u4F55\u5BFC\u7EBF\u3002",
              description: "{{component}} \u5728\u56FE\u7EB8\u4E2D\u672A\u63A5\u7EBF\u3002",
              recommendation: "\u4E3A\u8BE5\u7EC4\u4EF6\u63A5\u7EBF\uFF1B\u5982\u679C\u4E0D\u9700\u8981\uFF0C\u5219\u79FB\u9664\u5B83\u3002"
            },
            componentDefinitionIncompleteForChecks: {
              title: "\u7EC4\u4EF6\u5B9A\u4E49\u4E0D\u5B8C\u6574",
              shortDescription: "\u67D0\u4E2A\u5F15\u811A\u7F3A\u5C11\u7528\u4E8E\u68C0\u67E5\u7684\u5143\u6570\u636E\u3002",
              description: "{{component}} \u7684 {{handle}} \u5F15\u811A\u7F3A\u5C11\u68C0\u67E5\u6240\u9700\u7684\u4FE1\u606F\u3002",
              recommendation: "\u66F4\u65B0\u7EC4\u4EF6\u6A21\u677F\uFF0C\u6216\u8865\u5145\u8BE5\u5F15\u811A\u7684\u68C0\u67E5\u5143\u6570\u636E\u3002"
            },
            ambiguousMultiFunctionHandle: {
              title: "\u591A\u529F\u80FD\u5F15\u811A\u529F\u80FD\u4E0D\u660E\u786E",
              shortDescription: "\u67D0\u4E2A\u591A\u529F\u80FD\u5F15\u811A\u65E0\u6CD5\u660E\u786E\u5F52\u7C7B\u3002",
              description: "{{component}} \u7684 {{handle}} \u5F15\u811A\u53EF\u80FD\u6709\u591A\u4E2A\u529F\u80FD\uFF0C\u4F46\u68C0\u67E5\u65E0\u6CD5\u786E\u5B9A\u5F53\u524D\u4F7F\u7528\u7684\u529F\u80FD\u3002",
              recommendation: "\u68C0\u67E5\u8FDE\u63A5\uFF0C\u6216\u9009\u62E9\u66F4\u660E\u786E\u7684\u5F15\u811A\u529F\u80FD\u3002"
            },
            sn74Ahct125nUsedChannelInputMissing: {
              title: "SN74AHCT125N \u901A\u9053\u8F93\u5165\u672A\u88AB\u9A71\u52A8",
              shortDescription: "\u5DF2\u4F7F\u7528\u7684\u7F13\u51B2\u5668\u8F93\u51FA\u5B58\u5728\u672A\u8FDE\u63A5\u5230\u6570\u5B57\u8F93\u51FA\u6E90\u7684\u8F93\u5165\uFF0C\u6216 /OE \u5F15\u811A\u65E2\u672A\u7531\u6570\u5B57\u4FE1\u53F7\u9A71\u52A8\u4E5F\u672A\u63A5\u5230 GND\u3002",
              description: "{{component}} \u901A\u9053 {{channel}} \u901A\u8FC7 {{output}} \u9A71\u52A8\u6570\u5B57\u8F93\u5165\uFF0C\u4F46\u8FD9\u4E9B\u76F8\u5173\u5F15\u811A\u8FDE\u63A5\u4E0D\u6B63\u786E\uFF1A{{handles}}\u3002A \u5FC5\u987B\u8FDE\u63A5\u5230\u5305\u542B dig_out \u7684\u7F51\u7EDC\uFF1B/OE \u53EF\u4EE5\u8FDE\u63A5\u5230\u5305\u542B dig_out \u6216 GND \u7684\u7F51\u7EDC\u3002",
              recommendation: "\u5C06\u76F8\u5173 A \u5F15\u811A\u8FDE\u63A5\u5230\u5408\u9002\u7684\u6570\u5B57\u8F93\u51FA\uFF0C\u5E76\u5C06 /OE \u5F15\u811A\u8FDE\u63A5\u5230\u6570\u5B57\u8F93\u51FA\u6216 GND\uFF0C\u6216\u5C06\u672A\u4F7F\u7528\u7684 Y \u8F93\u51FA\u4E0E\u6570\u5B57\u8F93\u5165\u65AD\u5F00\u3002"
            },
            sn74Ahct125nDirectLedOutputMissingSeriesResistor: {
              title: "SN74AHCT125N \u8F93\u51FA\u76F4\u63A5\u8FDE\u63A5\u5230 LED \u8F93\u5165",
              shortDescription: "SN74AHCT125N \u8F93\u51FA\u76F4\u63A5\u8FDE\u63A5\u5230 LED \u6570\u636E\u6216\u65F6\u949F\u8F93\u5165\u3002",
              description: "{{output}} \u76F4\u63A5\u8FDE\u63A5\u5230 {{led}} \u7684 {{input}}\u3002\u8BE5\u4FE1\u53F7\u8DEF\u5F84\u901A\u5E38\u5E94\u5305\u542B\u7EA6 68 \u6B27\u59C6\u7684\u4E32\u8054\u7535\u963B\u3002",
              recommendation: "\u5728 SN74AHCT125N \u8F93\u51FA\u548C LED \u6570\u636E/\u65F6\u949F\u8F93\u5165\u4E4B\u95F4\u653E\u7F6E\u7EA6 68 \u6B27\u59C6\u7684\u7535\u963B\u3002"
            },
            digitalLedSignalGroupGroundMissing: {
              title: "\u6570\u5B57 LED \u8F93\u5165\u7EC4\u7F3A\u5C11 GND",
              shortDescription: "\u6570\u636E\u6216\u65F6\u949F\u8F93\u5165\u5DF2\u8FDE\u63A5\uFF0C\u4F46\u540C\u4E00 LED \u8F93\u5165\u7EC4\u7684 GND \u672A\u8FDE\u63A5\u3002",
              description: "{{component}} \u5728 {{group}} \u7EC4\u4E2D\u6709\u5DF2\u8FDE\u63A5\u7684\u6570\u5B57\u4FE1\u53F7\u8F93\u5165\uFF08{{signals}}\uFF09\uFF0C\u4F46\u540C\u4E00\u7EC4\u4E2D\u6CA1\u6709 GND \u8FDE\u63A5\u3002",
              recommendation: "\u5C06\u540C\u4E00 LED \u706F\u5E26\u7EC4\uFF08_start\u3001_end \u6216 _middle_N\uFF09\u7684 GND \u5F15\u811A\u8FDE\u63A5\u5230\u516C\u5171\u63A5\u5730\u7F51\u7EDC\u3002"
            }
          }
        }
      }
    },
    simulation: {
      title: "\u7535\u6D41\u6A21\u62DF",
      inDevelopmentTitle: "\u6A21\u62DF\u529F\u80FD\u4ECD\u5728\u5F00\u53D1\u4E2D",
      comingSoon: "\u7535\u6E90\u5206\u914D\u6A21\u62DF\u5C06\u5728\u672A\u6765\u5B9E\u73B0\u3002\u656C\u8BF7\u671F\u5F85\uFF01",
      settings: "\u8BBE\u7F6E",
      brightness: "\u4EAE\u5EA6\uFF1A{{value}}%",
      buttonRun: "\u5F00\u59CB\u6A21\u62DF",
      buttonDelete: "\u5220\u9664\u7ED3\u679C",
      notRun: "\u5C1A\u672A\u8FD0\u884C\u6A21\u62DF\u3002",
      running: "\u6B63\u5728\u8FD0\u884C\u6A21\u62DF...",
      invalidated: "\u56FE\u7EB8\u5DF2\u66F4\u6539\uFF0C\u6A21\u62DF\u7ED3\u679C\u5DF2\u79FB\u9664\u3002",
      blockedTitle: "Simulation not started",
      blockedDescription: "Run a current diagram check without errors before starting the simulation.",
      diagramCheckDebugBypass: "Debug mode: simulation starts without diagram-check gating.",
      diagramCheckGate: {
        "not-checked": {
          title: "Diagram check required",
          description: "Run the diagram check before starting the simulation."
        },
        stale: {
          title: "Diagram check is outdated",
          description: "The diagram changed after the last check. Run the diagram check again."
        },
        "has-errors": {
          title: "Diagram check has {{count}} error(s)",
          description: "Fix the diagram-check errors before starting the simulation. Warnings do not block simulation."
        }
      },
      modelReadyTitle: "\u6A21\u62DF\u6A21\u578B\u5DF2\u521B\u5EFA",
      modelReadyDescription: "{{components}} \u4E2A\u5DF2\u6A21\u62DF\u7EC4\u4EF6\uFF0C{{wires}} \u6761\u5DF2\u6A21\u62DF\u5BFC\u7EBF\u3002",
      failedTitle: "\u6A21\u62DF\u5931\u8D25",
      failedDescription: "\u65E0\u6CD5\u521B\u5EFA\u6A21\u62DF\u6A21\u578B\u3002\u8BF7\u68C0\u67E5\u4E0B\u9762\u7684\u6D88\u606F\u3002",
      workerFailedTitle: "Simulation worker failed",
      noIssues: "\u6CA1\u6709\u6A21\u62DF\u6D88\u606F\u3002",
      issueCount: "{{count}} \u6761\u6A21\u62DF\u6D88\u606F",
      affectedElements: "\u53D7\u5F71\u54CD\u7684\u5143\u7D20",
      targetPin: "{{component}} - {{pin}}",
      targetWire: "\u5BFC\u7EBF\uFF1A{{source}} -> {{target}}",
      targetComponent: "{{component}}",
      ledVoltagePlot: {
        title: "LED \u706F\u5E26\u7535\u538B\u56FE",
        openButton: "\u663E\u793A LED \u7535\u538B\u56FE",
        closeButton: "\u5173\u95ED",
        modalTitle: "LED \u7535\u538B\u968F\u957F\u5EA6\u53D8\u5316\uFF1A{{component}}",
        xAxis: "\u6CBF\u706F\u5E26\u957F\u5EA6 (m)",
        yAxis: "VLED (V)",
        ledCounts: "\u903B\u8F91 LED\uFF1A{{logical}} \xB7 \u7269\u7406 LED\uFF1A{{physical}}",
        minVoltage: "\u6700\u5C0F\u503C {{voltage}} V\uFF0C\u4F4D\u7F6E {{distance}} m",
        pointTooltip: "{{distance}} m\uFF1A{{voltage}} V\uFF0C\u533A\u6BB5 {{section}}\uFF0CLED {{index}}"
      },
      issues: {
        dcdcInputPowerAmbiguous: {
          title: "DCDC \u8F93\u5165\u529F\u7387\u9650\u5236\u4E0D\u660E\u786E",
          description: "\u8BE5 DCDC \u8F93\u5165\u53EF\u4EE5\u88AB\u52A8\u5230\u8FBE\u591A\u4E2A\u8F93\u5165\u7535\u538B\u6E90\u3002\u7531\u4E8E\u672A\u5EFA\u6A21\u591A\u7535\u6E90\u4E4B\u95F4\u7684\u7535\u6D41\u5206\u914D\uFF0C\u56E0\u6B64\u672A\u8BA1\u7B97\u52A8\u6001\u8F93\u5165\u529F\u7387\u9650\u5236\u3002"
        },
        dcdcInputPowerLimited: {
          title: "DCDC \u8F93\u5165\u529F\u7387\u53D7\u9650",
          description: "DCDC \u8F93\u51FA\u7535\u6D41 {{current}} A \u8D85\u8FC7\u52A8\u6001\u8F93\u5165\u529F\u7387\u9650\u5236 {{limit}} A\u3002\u8F93\u51FA\u7535\u538B\u5DF2\u7531 DCDC \u8F93\u5165\u529F\u7387\u6A21\u578B\u964D\u4F4E\u3002"
        },
        currentLimit: {
          title: "\u7535\u6D41\u9650\u5236\u88AB\u8D85\u8FC7",
          description: "\u7535\u538B\u6E90\u7535\u6D41 {{current}} A \u8D85\u8FC7\u9650\u5236 {{limit}} A\u3002\u8F93\u51FA\u7535\u538B\u5DF2\u7531\u7535\u6E90\u8FC7\u8F7D\u6A21\u578B\u964D\u4F4E\u3002"
        },
        currentLimitReduced: {
          description: "\u964D\u4F4E\u8F93\u51FA\u7535\u538B\u524D\uFF0C\u7535\u6E90\u8D1F\u8F7D\u8D85\u8FC7\u9650\u5236 {{limit}} A\u3002\u964D\u538B\u540E\u7684\u6700\u7EC8\u7535\u6D41\u4E3A {{current}} A\u3002"
        },
        currentLimitExtreme: {
          title: "\u7535\u6D41\u9650\u5236\u8D85\u8FC7\u8FC7\u591A",
          description: "\u7535\u538B\u6E90\u7535\u6D41 {{current}} A \u8D85\u8FC7\u9650\u5236 {{limit}} A \u7684 150%\u3002\u6A21\u62DF\u5DF2\u505C\u6B62\u3002"
        },
        fuseCurrent: {
          title: "\u4FDD\u9669\u4E1D\u7535\u6D41\u8D85\u6807",
          description: "\u4FDD\u9669\u4E1D\u7535\u6D41 {{current}} A \u8D85\u8FC7\u989D\u5B9A\u7535\u6D41 {{limit}} A\u3002"
        },
        pinVoltageLow: {
          title: "\u4F9B\u7535\u7535\u538B\u8FC7\u4F4E",
          description: "\u4F9B\u7535\u7535\u538B\u4E3A {{voltage}} V\uFF0C\u4F4E\u4E8E\u6700\u5C0F\u503C {{limit}} V\u3002"
        },
        pinVoltageHigh: {
          title: "\u4F9B\u7535\u7535\u538B\u8FC7\u9AD8",
          description: "\u4F9B\u7535\u7535\u538B\u4E3A {{voltage}} V\uFF0C\u9AD8\u4E8E\u6700\u5927\u503C {{limit}} V\u3002"
        },
        ledStripSupplyVoltageLow: {
          title: "LED \u706F\u5E26\u4F9B\u7535\u7535\u538B\u8FC7\u4F4E",
          description: "\u5DF2\u8FDE\u63A5\u7684 LED \u706F\u5E26\u4F9B\u7535\u70B9\u5904 VLED \u4E3A {{voltage}} V\uFF0C\u4F4E\u4E8E\u6700\u5C0F\u503C {{limit}} V\u3002\u8BF7\u63D0\u9AD8\u7535\u6E90\u7535\u538B\uFF1B\u5982\u679C\u7535\u6E90\u6B63\u5728\u9650\u6D41\uFF0C\u8BF7\u63D0\u9AD8\u53EF\u7528\u529F\u7387\u3002"
        },
        ledStripVoltageDropHigh: {
          title: "LED \u706F\u5E26\u538B\u964D\u8FC7\u9AD8",
          description: "\u5DF2\u8FDE\u63A5\u7684\u4F9B\u7535\u70B9\u7535\u538B\u5728\u5141\u8BB8\u8303\u56F4\u5185\uFF0C\u4F46\u706F\u5E26\u957F\u5EA6\u4E0A\u7684\u6700\u4F4E VLED \u4E3A {{voltage}} V\uFF0C\u4F4E\u4E8E\u6700\u5C0F\u503C {{limit}} V\u3002\u8BF7\u6CBF LED \u706F\u5E26\u589E\u52A0\u66F4\u591A\u6CE8\u5165\u4F9B\u7535\u70B9\u3002"
        },
        ledStripVoltageLow: {
          title: "LED \u706F\u5E26\u7535\u538B\u8FC7\u4F4E",
          description: "LED \u706F\u5E26\u6700\u4F4E\u7535\u538B\u4E3A {{voltage}} V\uFF0C\u4F4E\u4E8E\u6700\u5C0F\u503C {{limit}} V\u3002"
        },
        ledStripVoltageHigh: {
          title: "LED \u706F\u5E26\u7535\u538B\u8FC7\u9AD8",
          description: "LED \u706F\u5E26\u6700\u9AD8\u7535\u538B\u4E3A {{voltage}} V\uFF0C\u9AD8\u4E8E\u6700\u5927\u503C {{limit}} V\u3002"
        },
        unpoweredSubnet: {
          title: "\u5DF2\u5FFD\u7565\u672A\u4F9B\u7535\u5B50\u7535\u8DEF",
          description: "\u4E00\u4E2A\u6709\u6548\u7684\u6A21\u62DF\u5B50\u7535\u8DEF\u65E0\u6CD5\u4ECE\u4EFB\u4F55\u7535\u538B\u6E90\u5230\u8FBE\uFF0C\u56E0\u6B64\u5DF2\u88AB\u5FFD\u7565\u3002"
        },
        solverFailed: {
          title: "\u6A21\u62DF\u6C42\u89E3\u5668\u5931\u8D25",
          description: "\u6C42\u89E3\u5668\u8FD4\u56DE\u72B6\u6001 {{status}}\u3002"
        },
        solverNotConverged: {
          title: "\u6A21\u62DF\u6C42\u89E3\u5668\u672A\u6536\u655B",
          description: "\u7535\u538B\u76F8\u5173\u7684 LED \u7535\u6D41\u5728\u8FED\u4EE3\u9650\u5236\u5185\u672A\u6536\u655B\u3002"
        }
      },
      severity: {
        error: "\u9519\u8BEF",
        warning: "\u8B66\u544A",
        info: "\u4FE1\u606F"
      },
      colorModes: {
        rgbWhite: "RGB \u767D\u5149",
        separateWhite: "\u72EC\u7ACB\u767D\u5149",
        separateAndRgbWhite: "\u72EC\u7ACB + RGB \u767D\u5149",
        red: "\u7EA2\u8272",
        green: "\u7EFF\u8272",
        blue: "\u84DD\u8272"
      }
    },
    tools: {
      title: "\u5DE5\u5177",
      rerouteAllButton: "\u91CD\u65B0\u5E03\u7EBF\u5168\u90E8\u5BFC\u7EBF",
      rerouteAllTooltip: "\u4F7F\u7528 Pathfinder \u987A\u5E8F\u91CD\u65B0\u5E03\u7EBF\u5168\u90E8\u5BFC\u7EBF",
      rerouteAllDisabledPF: "\u4EC5\u5728 Auto/PF \u8FDE\u63A5\u6A21\u5F0F\u4E0B\u53EF\u7528",
      rerouteAllDisabledEmpty: "\u56FE\u4E2D\u6CA1\u6709\u5BFC\u7EBF",
      rerouteAllDescription: "\u4F18\u5148\u5E03\u7EBF\u8DDD\u79BB\u8F83\u77ED\u7684\u7EC4\u4EF6\u5BF9\uFF0C\u5E76\u4FDD\u7559\u5BFC\u7EBF ID\u3001\u8FDE\u63A5\u548C\u5C5E\u6027\u3002",
      rerouteAllSuccess: "\u6240\u6709\u5BFC\u7EBF\u5DF2\u91CD\u65B0\u5E03\u7EBF\u3002"
    },
    export: {
      title: "\u4FDD\u5B58 / \u5BFC\u51FA / \u793A\u4F8B",
      buttonSave: "\u4FDD\u5B58\u6A21\u578B",
      buttonSaveAs: "\u6A21\u578B\u53E6\u5B58\u4E3A...",
      buttonExportPNG: "\u5C06\u6A21\u578B\u5BFC\u51FA\u4E3A PNG \u6587\u4EF6",
      buttonExportJPEG: "\u5C06\u6A21\u578B\u5BFC\u51FA\u4E3A JPEG \u6587\u4EF6",
      buttonExportSVG: "\u5C06\u6A21\u578B\u5BFC\u51FA\u4E3A SVG \u6587\u4EF6",
      buttonOpen: "\u6253\u5F00\u6A21\u578B...",
      buttonShare: "\u751F\u6210\u6A21\u578B\u7684\u516C\u5F00\u94FE\u63A5",
      currentFile: "\u5F53\u524D\u6587\u4EF6\uFF1A{{name}}",
      saveAsModalTitle: "\u6A21\u578B\u53E6\u5B58\u4E3A",
      saveAsModalOk: "\u4FDD\u5B58",
      dividerExport: "\u5BFC\u51FA",
      dividerSaveOpen: "\u4FDD\u5B58 / \u6253\u5F00",
      dividerShare: "\u5206\u4EAB",
      dividerExamples: "\u52A0\u8F7D\u793A\u4F8B",
      share: {
        modalTitle: "\u5206\u4EAB\u6A21\u578B - \u751F\u6210\u94FE\u63A5",
        modalLinkText: "\u94FE\u63A5\uFF1A",
        modalLinkBeingGenerated: "... \u6B63\u5728\u751F\u6210 ... \u8BF7\u7A0D\u5019 ...",
        modalButtonOK: "\u786E\u5B9A",
        modalButtonClose: "\u5173\u95ED",
        modalButtonCancel: "\u53D6\u6D88",
        modalAttentionText: '\u5F53\u60A8\u70B9\u51FB"\u786E\u5B9A"\u65F6\uFF0C\u60A8\u7684\u6A21\u578B\u4EE5\u53CA\u6240\u6709\u8F93\u5165\u7684\u6570\u636E\u5C06\u88AB\u4F20\u8F93\u5230\u516C\u5171\u670D\u52A1\u5668\uFF08https://github.com\uFF09\u5E76\u4FDD\u5B58\u5728\u90A3\u91CC\u3002\u4E3A\u6B64\uFF0C\u60A8\u7684\u6A21\u578B\u6570\u636E\u548C IP \u5730\u5740\u4E5F\u5C06\u88AB\u4F20\u8F93\u5230 https://wled-api.myhome-control.de/\u3002\u7136\u540E\u60A8\u5C06\u770B\u5230\u4E00\u4E2A\u94FE\u63A5\uFF0C\u53EF\u7528\u4E8E\u4E0E\u4ED6\u4EBA\u5206\u4EAB\u6A21\u578B\u3002',
        modalLinkError: "\u53D1\u751F\u9519\u8BEF\uFF01\u5982\u6709\u5FC5\u8981\uFF0C\u8BF7\u91CD\u8BD5\u3002",
        tooltipCopyLink: "\u590D\u5236\u94FE\u63A5\u5230\u526A\u8D34\u677F",
        messageLinkCopied: "\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\uFF01"
      },
      selectExample: "\u9009\u62E9\u793A\u4F8B ..."
    }
  },
  footRow: {
    legalNotice: {
      title: "\u6CD5\u5F8B\u58F0\u660E",
      responsible: "\u8D1F\u8D23\u4EBA\uFF1AWladislaw Waag",
      address: "\u5730\u5740\uFF1AWasserburger Landstr. 29, 81825 Munich, Germany",
      contact: "\u8054\u7CFB\u65B9\u5F0F\uFF1A+49 (0) 176 47 11 5206, info@myhome-control.de",
      disputeText: "",
      disputeSettlmentText: "\u6D88\u8D39\u8005\u4E89\u8BAE\u89E3\u51B3 / \u901A\u7528\u4EF2\u88C1\u59D4\u5458\u4F1A\uFF1A\u6211\u4EEC\u65E2\u4E0D\u613F\u610F\u4E5F\u6CA1\u6709\u4E49\u52A1\u53C2\u4E0E\u6D88\u8D39\u8005\u4EF2\u88C1\u59D4\u5458\u4F1A\u9762\u524D\u7684\u4E89\u8BAE\u89E3\u51B3\u7A0B\u5E8F\u3002"
    },
    dataPrivacy: {
      title: "\u6570\u636E\u9690\u79C1",
      text1: "\u6B64\u9875\u9762\u4F5C\u4E3A 'Github Pages' \u7684\u4E00\u90E8\u5206\u6258\u7BA1\u548C\u8FD0\u8425\u3002Github \u53EF\u80FD\u6536\u96C6\u548C\u5904\u7406\u4E2A\u4EBA\u6570\u636E\uFF0C\u8FD9\u4E5F\u53EF\u80FD\u5F71\u54CD wled-compile.github.io \u7F51\u9875\u7684\u8BBF\u95EE\u8005\u3002\u4F46\u662F\uFF0C\u6211\u4EEC\u5BF9\u6B64\u6CA1\u6709\u5F71\u54CD\u3002\u8BF7\u9605\u8BFB Github \u9690\u79C1\u58F0\u660E\uFF1A",
      text2: "\u6B64\u5916\uFF0C\u4E00\u65E6\u60A8\u4F7F\u7528'\u5206\u4EAB'\u529F\u80FD\uFF0C\u60A8\u7684 IP \u5730\u5740\u3001\u60A8\u521B\u5EFA\u7684\u6A21\u578B\u4EE5\u53CA\u60A8\u8F93\u5165\u7684\u6240\u6709\u6570\u636E\u5C06\u88AB\u8F6C\u53D1\u5230 https://myhome-control.de \u548C https://github.com/wled-development/wled-wiring-store\u3002\u8FD9\u5BF9\u4E8E\u6B64\u529F\u80FD\u662F\u7EDD\u5BF9\u5FC5\u8981\u7684\u3002https://myhome-control.de \u7684\u6570\u636E\u4FDD\u62A4\u58F0\u660E\u53EF\u5728\u4EE5\u4E0B\u4F4D\u7F6E\u627E\u5230",
      text3: "\u6211\u4EEC\u7684\u7F51\u7AD9\u5305\u542B\u6307\u5411\u6211\u4EEC\u65E0\u6CD5\u63A7\u5236\u7684\u5916\u90E8\u7F51\u7AD9\u7684\u94FE\u63A5\u3002\u6211\u4EEC\u4E0D\u80FD\u5BF9\u6B64\u7B2C\u4E09\u65B9\u5185\u5BB9\u627F\u62C5\u4EFB\u4F55\u8D23\u4EFB\u3002\u76F8\u5E94\u9875\u9762\u7684\u63D0\u4F9B\u8005\u6216\u8FD0\u8425\u5546\u59CB\u7EC8\u5BF9\u94FE\u63A5\u9875\u9762\u7684\u5185\u5BB9\u8D1F\u8D23\u3002\u94FE\u63A5\u9875\u9762\u5728\u94FE\u63A5\u65F6\u5DF2\u68C0\u67E5\u53EF\u80FD\u7684\u6CD5\u5F8B\u8FDD\u89C4\u884C\u4E3A\u3002\u5F53\u65F6\u65E0\u6CD5\u8BC6\u522B\u975E\u6CD5\u5185\u5BB9\u3002\u5982\u679C\u6211\u4EEC\u53D1\u73B0\u4EFB\u4F55\u6CD5\u5F8B\u8FDD\u89C4\u884C\u4E3A\uFF0C\u6211\u4EEC\u5C06\u7ACB\u5373\u5220\u9664\u76F8\u5173\u94FE\u63A5\u3002"
    },
    links: {
      title: "\u6709\u7528\u7684\u94FE\u63A5",
      link1Text: "\u5B98\u65B9 WLED \u6587\u6863\uFF1A",
      link2Text: "WLED \u5E38\u89C1\u95EE\u9898\uFF1A",
      link3Text: "WLED \u8BA1\u7B97\u5668\uFF1A",
      link4Text: "\u6269\u5C55 WLED \u5728\u7EBF\u5B89\u88C5\u7A0B\u5E8F\uFF1A",
      link5Text: "\u5728\u7EBF\u7F16\u8BD1\u60A8\u81EA\u5DF1\u7684 WLED \u8F6F\u4EF6\uFF1A",
      link6Text: "\u8D2D\u4E70 WLED \u63A7\u5236\u5668\uFF08\u5FB7\u56FD\uFF09\uFF1A",
      link7Text: "\u8D2D\u4E70 WLED \u63A7\u5236\u5668\uFF08\u5168\u7403\uFF09\uFF1A"
    },
    contribute: {
      title: "\u8D21\u732E/GitHub",
      text: "\u975E\u5E38\u611F\u8C22\u60A8\u7684\u8D21\u732E\uFF01\u5982\u679C\u60A8\u60F3\u8D21\u732E\uFF0C\u8BF7\u8BBF\u95EE\u9879\u76EE\u7684 GitHub \u94FE\u63A5\uFF1A"
    }
  },
  examples: {
    example1: "ESP32 \u5FAE\u63A7\u5236\u5668 + \u7535\u5E73\u8F6C\u6362\u5668 + DC/DC + 24V LED \u706F\u5E26",
    example2: "ABC! WLED \u63A7\u5236\u5668 + 24V LED \u706F\u5E26",
    example3: "ABC! WLED \u63A7\u5236\u5668 + \u957F 24V LED \u706F\u5E26 + \u7EBF\u8DEF\u8F93\u5165 + \u4EE5\u592A\u7F51",
    example4: "ABC! WLED \u63A7\u5236\u5668 + \u957F\u8DDD\u79BB\u6269\u5C55",
    example5: "ABC! WLED \u63A7\u5236\u5668 + \u6A21\u62DF 24V LED \u706F\u5E26 + PWM \u677F"
  },
  compData: {
    Router: {
      name: "WAN/LAN \u8DEF\u7531\u5668",
      description: "\u901A\u7528 WLAN/LAN \u8DEF\u7531\u5668\u3002",
      descriptionShort: "\u901A\u7528"
    },
    Button: {
      name: "\u6309\u94AE",
      description: "\u901A\u7528\u6309\u94AE\u3002\u6309\u4E0B\u5E76\u4FDD\u6301\u65F6\uFF0C\u89E6\u70B9\u95ED\u5408\u3002\u91CA\u653E\u6309\u94AE\u65F6\uFF0C\u89E6\u70B9\u7ACB\u5373\u6253\u5F00\u3002\u4E0D\u8981\u4E0E\u5F00\u5173\u6DF7\u6DC6\u3002",
      descriptionShort: "\u901A\u7528"
    },
    DC_JACK_FEMALE: {
      name: "DC \u7AEF\u5B50",
      description: "\u7528\u4E8E\u5C06\u5E26 DC \u7AEF\u5B50\u7684\u7535\u6E90\u5206\u79BB\u51FA\u6B63\u6781\uFF08+\uFF09\u548C\u8D1F\u6781\uFF08-\uFF09\u5BFC\u7EBF\u3002",
      descriptionShort: "\u6700\u9AD8 3A"
    },
    Elko: {
      name: "\u7535\u89E3\u7535\u5BB9",
      description: "\u5177\u6709\u53EF\u9009\u7535\u5BB9\u7684\u7535\u89E3\u7535\u5BB9\u3002\u6CE8\u610F\u6781\u6027\uFF01\u901A\u5E38\u7528\u4E8E\u7A33\u5B9A LED \u6216\u5176\u4ED6\u7EC4\u4EF6\u7684\u7535\u6E90\u3002",
      descriptionShort: "\u53EF\u9009\u7535\u5BB9"
    },
    ESP32_30P: {
      name: "ESP32 \u5FAE\u63A7\u5236\u5668 30 \u5F15\u811A",
      description: "ESP32 \u63A7\u5236\u5668\uFF0C30 \u5F15\u811A\u7248\u672C\u3002\u4E5F\u79F0\u4E3A NodeMCU\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    ESP32_38P: {
      name: "ESP32 \u5FAE\u63A7\u5236\u5668 38 \u5F15\u811A",
      description: "ESP32 \u63A7\u5236\u5668\uFF0C38 \u5F15\u811A\u7248\u672C\u3002\u4E5F\u79F0\u4E3A NodeMCU\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    ESP32C3D1mini: {
      name: "ESP32-C3 D1 mini",
      description: "D1 mini \u683C\u5F0F\u7684 ESP32-C3 \u63A7\u5236\u5668\u3002WLED \u53EF\u5728\u6B64\u63A7\u5236\u5668\u7C7B\u578B\u4E0A\u8FD0\u884C\uFF0C\u4F46\u529F\u80FD\u53EF\u80FD\u53D7\u9650\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    ESP32C3_supermini: {
      name: "ESP32-C3 supermini",
      description: "ESP32-C3 \u63A7\u5236\u5668\uFF0Csupermini \u7248\u672C\u3002WLED \u53EF\u5728\u6B64\u63A7\u5236\u5668\u7C7B\u578B\u4E0A\u8FD0\u884C\uFF0C\u4F46\u529F\u80FD\u53EF\u80FD\u53D7\u9650\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    ESP32D1mini: {
      name: "ESP32 D1 mini",
      description: "D1 mini \u578B\u53F7\u7684 ESP32 \u63A7\u5236\u5668\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    ESP32S3D1mini: {
      name: "ESP32-S3 D1 mini",
      description: "D1 mini \u578B\u53F7\u7684 ESP32-S3 \u63A7\u5236\u5668\u3002WLED \u53EF\u5728\u6B64\u63A7\u5236\u5668\u7C7B\u578B\u4E0A\u8FD0\u884C\uFF0C\u4F46\u529F\u80FD\u53EF\u80FD\u53D7\u9650\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    ESP8266D1mini: {
      name: "ESP8266 D1 mini",
      description: "D1 mini \u578B\u53F7\u7684 ESP8266 \u63A7\u5236\u5668\u3002\u4E0D\u518D\u63A8\u8350\u7528\u4E8E\u65B0\u7684 WLED \u9879\u76EE\uFF08\u6027\u80FD\u592A\u5F31\uFF09\u3002",
      descriptionShort: "\u63A7\u5236\u5668"
    },
    InfoNode: {
      name: "\u6587\u672C",
      description: "\u7528\u4E8E\u5728\u56FE\u7EB8\u4E2D\u6DFB\u52A0\u6807\u7B7E\u6216\u6CE8\u91CA\u7684\u6587\u672C\u5143\u7D20\u3002",
      descriptionShort: "\u7528\u4E8E\u6CE8\u91CA\u7B49"
    },
    INMP441: {
      name: "INMP441 \u9EA6\u514B\u98CE",
      description: "INMP441 \u9EA6\u514B\u98CE\u3002\u5B83\u662F WLED \u652F\u6301\u7684\u6570\u5B57\u9EA6\u514B\u98CE\uFF0C\u7528\u4E8E\u58F0\u97F3\u53CD\u5E94\u6548\u679C\uFF0C\u63D0\u4F9B\u9AD8\u8D28\u91CF\u3002",
      descriptionShort: "\u6570\u5B57"
    },
    IR_KY022: {
      name: "KY022 \u7EA2\u5916\u63A5\u6536\u5668",
      description: "KY-022 \u7EA2\u5916\u63A5\u6536\u5668\uFF0CWLED \u652F\u6301\uFF0C\u5141\u8BB8\u4F7F\u7528\u7EA2\u5916\u9065\u63A7\u5668\u63A7\u5236 WLED\u3002",
      descriptionShort: "\u7EA2\u5916"
    },
    IR_TSOP38238: {
      name: "TSOP38238 \u7EA2\u5916\u63A5\u6536\u5668",
      description: "TSOP38238 \u7EA2\u5916\u63A5\u6536\u5668\uFF0CWLED \u652F\u6301\uFF0C\u5141\u8BB8\u4F7F\u7528\u7EA2\u5916\u9065\u63A7\u5668\u63A7\u5236 WLED\u3002",
      descriptionShort: "\u7EA2\u5916"
    },
    Kerko: {
      name: "\u9676\u74F7\u7535\u5BB9",
      description: "\u5177\u6709\u53EF\u9009\u7535\u5BB9\u7684\u9676\u74F7\u7535\u5BB9\u3002\u901A\u5E38\u7528\u4E8E\u5F00\u5173\u7535\u5B50\u7535\u8DEF\u7684\u8F93\u5165\u7AEF\uFF08\u7535\u6E90\u548C\u5730\u4E4B\u95F4\uFF09\u4EE5\u6291\u5236\u566A\u58F0\u3002\u5E94\u4F7F\u7528\u5C3D\u53EF\u80FD\u77ED\u7684\u5F15\u7EBF/\u8D70\u7EBF\u8FDE\u63A5\u3002",
      descriptionShort: "\u53EF\u9009\u7535\u5BB9"
    },
    LineBoxNode: {
      name: "\u77E9\u5F62",
      description: "\u7528\u4E8E\u7ED8\u5236\u77E9\u5F62\uFF08\u586B\u5145\u6216\u6846\uFF09\u7684\u5143\u7D20\u3002",
      descriptionShort: "\u7ED8\u56FE\u5143\u7D20"
    },
    miniOTOFuse: {
      name: "\u4FDD\u9669\u4E1D",
      description: "\u6765\u81EA\u6C7D\u8F66\u7684\u4FDD\u9669\u4E1D\u3002\u9002\u7528\u4E8E\u6700\u9AD8 32V \u7684\u7535\u538B\u3002\u4EC5\u4ECE\u4E13\u4E1A\u7ECF\u9500\u5546\u5904\u8D2D\u4E70\uFF0C\u56E0\u4E3A\u5E02\u573A\u4E0A\u8BB8\u591A\u5EC9\u4EF7\u4EFF\u5236\u54C1\u65E0\u6CD5\u6B63\u5E38\u5DE5\u4F5C\u3002WLED \u8BA1\u7B97\u5668\uFF08www.wled-calculator.github.io\uFF09\u53EF\u7528\u4E8E\u9009\u578B\u3002",
      descriptionShort: "\u53EF\u9009 4-30A"
    },
    FUSE_Board: {
      name: "\u4FDD\u9669\u4E1D\u677F",
      description: "\u7528\u4E8E\u7535\u6E90\u5206\u914D\u548C\u7194\u65AD\u4FDD\u62A4\u3002",
      descriptionShort: "4 \u901A\u9053"
    },
    PIR_HCSR501: {
      name: "HC-SR501 PIR \u4F20\u611F\u5668",
      description: "HCSR501 \u578B PIR \u8FD0\u52A8\u4F20\u611F\u5668\u3002\u53EF\u4E0E WLED \u4E00\u8D77\u4F7F\u7528\u3002",
      descriptionShort: "\u8FD0\u52A8\u68C0\u6D4B\u5668"
    },
    PLUG_LNPE: {
      name: "\u7535\u6E90\u63D2\u5934",
      description: "\u7528\u4E8E 230V \u7535\u6E90\u63D2\u5EA7\u7684\u63D2\u5934\u3002\u8B66\u544A\uFF1A\u6709\u751F\u547D\u5371\u9669\uFF01\u4EC5\u5728\u60A8\u5177\u5907\u76F8\u5E94\u77E5\u8BC6\u65F6\u4F7F\u7528\u3002",
      descriptionShort: "\u7528\u4E8E 230V \u4EA4\u6D41\u7535"
    },
    PSU_HP: {
      name: "\u7535\u6E90",
      description: "\u5177\u6709\u53EF\u8C03\u7535\u538B/\u7535\u6D41\uFF08\u529F\u7387\uFF09\u7684\u7535\u6E90\u3002\u8FD9\u4E9B\u901A\u5E38\u7528\u4E8E\u5927\u578B\u8BBE\u7F6E\u7684\u9AD8\u6027\u80FD\u7535\u6E90\u3002\u7535\u6E90\u63D2\u5934\u5FC5\u987B\u5355\u72EC\u8FDE\u63A5\u3002",
      descriptionShort: "\u53EF\u8C03 V/I"
    },
    PSU_USB: {
      name: "USB \u7535\u6E90",
      description: "USB \u7535\u6E90\uFF0C\u8F93\u51FA\u7535\u538B 5V\uFF0C\u53EF\u8C03\u7535\u6D41\u6700\u9AD8 5A\u3002",
      descriptionShort: "5V\uFF0C\u53EF\u8C03 I"
    },
    PSU_USB_WIRES: {
      name: "USB \u7535\u6E90",
      description: "USB \u7535\u6E90\uFF0C\u8F93\u51FA\u7535\u538B 5V\uFF0C\u53EF\u8C03\u7535\u6D41\u6700\u9AD8 5A\uFF0C\u5E26\u72EC\u7ACB +/- \u7EBF\u3002",
      descriptionShort: "5V\uFF0C\u72EC\u7ACB +/- \u7EBF"
    },
    Resistor: {
      name: "\u7535\u963B\u5668",
      description: "\u5177\u6709\u53EF\u8C03\u963B\u503C\u7684\u7535\u963B\u5668\u3002",
      descriptionShort: "\u53EF\u8C03\u7535\u963B"
    },
    SN74AHCT125N: {
      name: "\u7535\u5E73\u8F6C\u6362\u5668",
      description: "WLED \u63A8\u8350\u7684\u7535\u5E73\u8F6C\u6362\u5668\u7C7B\u578B\u3002\u7535\u5E73\u8F6C\u6362\u5668\u662F\u5C06\u5FAE\u63A7\u5236\u5668\u7684\u63A7\u5236\u4FE1\u53F7\uFF083.3V\uFF09\u8F6C\u6362\u4E3A\u53EF\u5BFB\u5740 LED \u7684 LED \u6570\u636E\u8F93\u5165\uFF085V\uFF09\u7535\u5E73\u6240\u5FC5\u9700\u7684\u3002\u6CA1\u6709\u7535\u5E73\u8F6C\u6362\u5668\uFF0C\u7ECF\u5E38\u4F1A\u51FA\u73B0\u95EA\u70C1\uFF0812V \u548C 24V LED \u51E0\u4E4E\u603B\u662F\u5982\u6B64\uFF09\u3002",
      descriptionShort: "SN74AHCT125N"
    },
    SolderJoint: {
      name: "\u710A\u70B9",
      description: "\u8868\u793A\u710A\u70B9\uFF0C\u4F8B\u5982\u7528\u4E8E\u5C06\u7EBF\u8FDE\u63A5\u5728\u4E00\u8D77\u3002",
      descriptionShort: "\u7528\u4E8E\u5BFC\u7EBF\u7B49"
    },
    WAGO_2X: {
      name: "WAGO \u7AEF\u5B50 2x",
      description: "\u5E7F\u6CDB\u4F7F\u7528\u7684\u5F39\u7C27\u5939\u7AEF\u5B50\uFF0C\u53CC\u5411\u3002",
      descriptionShort: "\u5F39\u7C27\u5939"
    },
    WAGO_3X: {
      name: "WAGO \u7AEF\u5B50 3x",
      description: "\u5E7F\u6CDB\u4F7F\u7528\u7684\u5F39\u7C27\u5939\u7AEF\u5B50\uFF0C\u4E09\u5411\u3002",
      descriptionShort: "\u5F39\u7C27\u5939"
    },
    WireInfoNode: {
      name: "\u5BFC\u7EBF\u4FE1\u606F",
      description: "\u5173\u4E8E\u5BFC\u7EBF\u7684\u4FE1\u606F\u3002",
      descriptionShort: " "
    },
    WS2812B_5V_30LPM: {
      name: "WS2812B RGB",
      description: "WS2812 RGB LED \u706F\u5E26\uFF0C5V\uFF0C\u6BCF\u7C73 30 \u4E2A LED\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\u3002",
      descriptionShort: "5V, 30 LEDs/m"
    },
    MHC_V43: {
      name: "WLED V43 \u63A7\u5236\u5668",
      description: "\u7528\u4E8E 5V\u300112V \u6216 24V \u53EF\u5BFB\u5740 LED \u7684\u4E13\u4E1A WLED \u63A7\u5236\u5668\u3002\u5305\u62EC ESP32 \u5FAE\u63A7\u5236\u5668\u3001SN74AHCT \u7535\u5E73\u8F6C\u6362\u5668\u3001\u4FDD\u9669\u4E1D\u3001\u7535\u5BB9\u3001EMI \u6EE4\u6CE2\u5668\u3002\u53EF\u9009\u914D\u4EF6\u5305\u62EC\u4EE5\u592A\u7F51\u9002\u914D\u5668\u3001INMP441 \u9EA6\u514B\u98CE\u3001\u7EBF\u8DEF\u8F93\u5165\u9002\u914D\u5668\u548C USB \u9002\u914D\u5668\u3002",
      descriptionShort: "\u57FA\u4E8E ESP32"
    },
    MHC_V57: {
      name: "WLED PRO V57 \u63A7\u5236\u5668",
      description: "\u7528\u4E8E 5V\u300112V \u6216 24V \u53EF\u5BFB\u5740 LED \u7684\u4E13\u4E1A WLED \u63A7\u5236\u5668\u3002\u5305\u62EC ESP32 \u5FAE\u63A7\u5236\u5668\u3001SN74AHCT \u7535\u5E73\u8F6C\u6362\u5668\u3001\u4FDD\u9669\u4E1D\u3001\u7535\u5BB9\u3001EMI \u6EE4\u6CE2\u5668\u3002\u53EF\u9009\u914D\u4EF6\u5305\u62EC\u4EE5\u592A\u7F51\u9002\u914D\u5668\u3001INMP441 \u9EA6\u514B\u98CE\u3001\u7EBF\u8DEF\u8F93\u5165\u9002\u914D\u5668\u548C USB \u9002\u914D\u5668\u3002",
      descriptionShort: "\u57FA\u4E8E ESP32"
    },
    MHC_SwitchBoard: {
      name: "WLED \u5F00\u5173\u677F",
      description: "\u7EE7\u7535\u5668\u677F\u7684\u66F4\u597D/\u73B0\u4EE3\u66FF\u4EE3\u54C1\uFF0C\u7528\u4E8E\u5B8C\u5168\u5173\u95ED LED\u3002\u5177\u6709\u8FC7\u6D41\u3001\u8FC7\u6E29\u3001\u77ED\u8DEF\u548C\u53CD\u63A5\u4FDD\u62A4\u3002",
      descriptionShort: "\u901A\u7528 5-24V"
    },
    MHC_PWMBoard: {
      name: "WLED PWM \u677F",
      description: "\u8BE5\u677F\u4F7F\u7528 MOSFET \u901A\u8FC7 PWM \u4FE1\u53F7\u63A7\u5236\u6A21\u62DF LED \u706F\u5E26\u30023 \u4E2A\u901A\u9053\uFF0C\u6BCF\u4E2A\u6700\u5927 5A\u3002\u5177\u6709\u8FC7\u6D41\u3001\u8FC7\u6E29\u3001\u77ED\u8DEF\u548C\u53CD\u63A5\u4FDD\u62A4\u3002",
      descriptionShort: "\u901A\u7528 12-48V"
    },
    MHC_RS485_R: {
      name: "RS-485 \u63A5\u6536\u5668",
      description: "RS-485 \u63A5\u6536\u5668\uFF0C\u7528\u4F5C RS-485 \u9002\u914D\u5668\u7684\u8303\u56F4\u6269\u5C55\u5668\u63A5\u6536\u5668\u3002",
      descriptionShort: "RS-485 \u63A5\u6536\u5668"
    },
    MHC_Relay5V: {
      name: "5V \u7EE7\u7535\u5668\u677F",
      description: "\u7528\u4E8E 5V \u53EF\u5BFB\u5740 LED \u7684\u4E13\u4E1A\u7EE7\u7535\u5668\u677F\u3002\u5141\u8BB8\u901A\u8FC7\u7EE7\u7535\u5668\u5728\u4E0D\u4F7F\u7528\u65F6\u5173\u95ED LED \u706F\u5E26\uFF0C\u8282\u7701\u80FD\u6E90\uFF0C\u5EF6\u957F LED \u706F\u5E26\u5BFF\u547D\uFF0C\u5E76\u63D0\u9AD8\u5B89\u5168\u6027\u3002\u4E24\u4E2A\u8DEF\u5F84\u5141\u8BB8\u4E24\u4E2A\u72EC\u7ACB\u7684\u63A7\u5236\uFF0C\u6216\u8005\u4F8B\u5982\uFF0C\u63A7\u5236\u4E24\u4E2A\u7535\u6E90\u8F93\u5165\u3002",
      descriptionShort: "\u7528\u4E8E 5V LED"
    },
    MHC_Relay12V: {
      name: "12V \u7EE7\u7535\u5668\u677F",
      description: "\u7528\u4E8E 12V \u53EF\u5BFB\u5740 LED \u7684\u4E13\u4E1A\u7EE7\u7535\u5668\u677F\u3002\u5141\u8BB8\u901A\u8FC7\u7EE7\u7535\u5668\u5728\u4E0D\u4F7F\u7528\u65F6\u5173\u95ED LED \u706F\u5E26\uFF0C\u8282\u7701\u80FD\u6E90\uFF0C\u5EF6\u957F LED \u706F\u5E26\u5BFF\u547D\uFF0C\u5E76\u63D0\u9AD8\u5B89\u5168\u6027\u3002\u4E24\u4E2A\u8DEF\u5F84\u5141\u8BB8\u4E24\u4E2A\u72EC\u7ACB\u7684\u63A7\u5236\uFF0C\u6216\u8005\u4F8B\u5982\uFF0C\u63A7\u5236\u4E24\u4E2A\u7535\u6E90\u8F93\u5165\u3002",
      descriptionShort: "\u7528\u4E8E 12V LED"
    },
    MHC_Relay24V: {
      name: "24V \u7EE7\u7535\u5668\u677F",
      description: "\u7528\u4E8E 24V \u53EF\u5BFB\u5740 LED \u7684\u4E13\u4E1A\u7EE7\u7535\u5668\u677F\u3002\u5141\u8BB8\u901A\u8FC7\u7EE7\u7535\u5668\u5728\u4E0D\u4F7F\u7528\u65F6\u5173\u95ED LED \u706F\u5E26\uFF0C\u8282\u7701\u80FD\u6E90\uFF0C\u5EF6\u957F LED \u706F\u5E26\u5BFF\u547D\uFF0C\u5E76\u63D0\u9AD8\u5B89\u5168\u6027\u3002\u4E24\u4E2A\u8DEF\u5F84\u5141\u8BB8\u4E24\u4E2A\u72EC\u7ACB\u7684\u63A7\u5236\uFF0C\u6216\u8005\u4F8B\u5982\uFF0C\u63A7\u5236\u4E24\u4E2A\u7535\u6E90\u8F93\u5165\u3002",
      descriptionShort: "\u7528\u4E8E 24V LED"
    },
    AUDIO_SOURCE: {
      name: "\u97F3\u9891\u6E90",
      description: "\u901A\u7528\u97F3\u9891\u4FE1\u53F7\u6E90\u3002",
      descriptionShort: "\u7EBF\u8DEF\u8F93\u51FA"
    },
    LM2596_PCB: {
      name: "LM2596 DC/DC",
      description: "\u5177\u6709\u53EF\u8C03\u8F93\u51FA\u7535\u538B\u7684 DC/DC\uFF08\u964D\u538B\uFF09\u8F6C\u6362\u5668\u3002",
      descriptionShort: "\u53EF\u8C03\u8F93\u51FA"
    },
    IRLZ44N: {
      name: "IRLZ44N",
      description: "MOSFET\u3002\u6B64\u7C7B\u578B\u63A8\u8350\u4E0E WLED \u4E00\u8D77\u4F7F\u7528\uFF0C\u53EF\u7528\u4E8E\u63A7\u5236\u6A21\u62DF LED \u706F\u5E26\u3002",
      descriptionShort: "N \u6C9F\u9053 MOSFET"
    },
    DCDC_mini: {
      name: "DC/DC \u8FF7\u4F60",
      description: "\u5177\u6709\u53EF\u8C03\u8F93\u51FA\u7535\u538B\u7684 DC/DC\uFF08\u964D\u538B\uFF09\u8F6C\u6362\u5668\u3002",
      descriptionShort: "\u53EF\u8C03\u8F93\u51FA"
    },
    WS2814_24V_60LPM: {
      name: "WS2814 RGBW",
      description: "RGBW LED \u706F\u5E26\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\uFF0C\u6BCF\u7EC4 6 \u4E2A\uFF081 \u4E2A\u903B\u8F91 LED = 6 \u4E2A\u7269\u7406 LED\uFF09\u3002",
      descriptionShort: "24V, 60 LEDs/m"
    },
    WS2813_5V_60LPM: {
      name: "WS2813 RGB",
      description: "\u5E26\u5907\u4EFD\u7EBF\u7684 RGB LED \u706F\u5E26\u3002",
      descriptionShort: "5V, 60 LEDs/m"
    },
    WS2815_12V_30LPM: {
      name: "WS2815 RGB",
      description: "\u5E26\u5907\u4EFD\u7EBF\u7684 RGB LED \u706F\u5E26\u3002",
      descriptionShort: "12V, 30 LEDs/m"
    },
    WS2814_12V_30LPM: {
      name: "WS2814 RGBW",
      description: "RGBW LED \u706F\u5E26\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\uFF0C\u6BCF\u7EC4 3 \u4E2A\uFF081 \u4E2A\u903B\u8F91 LED = 3 \u4E2A\u7269\u7406 LED\uFF09\u3002",
      descriptionShort: "12V, 30 LEDs/m"
    },
    WS2818_12V_30LPM: {
      name: "WS2818 RGB",
      description: "RGB LED \u706F\u5E26\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\uFF0C\u6BCF\u7EC4 3 \u4E2A\uFF081 \u4E2A\u903B\u8F91 LED = 3 \u4E2A\u7269\u7406 LED\uFF09\u3002",
      descriptionShort: "12V, 30 LEDs/m"
    },
    FCOB_12V_720LPM: {
      name: "FCOB RGB",
      description: "FCOB RGB LED \u706F\u5E26\uFF0C720 LEDs/m\uFF08\u6BCF\u7C73\u6BCF\u79CD\u989C\u8272 240 \u4E2A LED\uFF0C20 \u4E2A\u903B\u8F91 LEDs/m\uFF09",
      descriptionShort: "12V, 720 LEDs/m"
    },
    FCOB_24V_720LPM: {
      name: "FCOB RGB",
      description: "FCOB RGB LED \u706F\u5E26\uFF0C720 LEDs/m\uFF08\u6BCF\u7C73\u6BCF\u79CD\u989C\u8272 240 \u4E2A LED\uFF0C20 \u4E2A\u903B\u8F91 LEDs/m\uFF09",
      descriptionShort: "24V, 720 LEDs/m"
    },
    FCOB_24V_784LPM: {
      name: "FCOB RGBW",
      description: "FCOB RGBW LED \u706F\u5E26\uFF0C784 LEDs/m\uFF08\u6BCF\u7C73\u6BCF\u79CD\u989C\u8272 196 \u4E2A LED\uFF0C14 \u4E2A\u903B\u8F91 LEDs/m\uFF09",
      descriptionShort: "24V, 784 LEDs/m"
    },
    APA102_5V_30LPM: {
      name: "APA102 RGB",
      description: "\u5E26\u65F6\u949F\u4FE1\u53F7\u7684 APA102 LED \u706F\u5E26\uFF0C5V\uFF0C\u6BCF\u7C73 30 \u4E2A LED\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\u3002",
      descriptionShort: "5V, 30 LEDs/m"
    },
    AN_WHITE_24V_240LPM: {
      name: "\u6A21\u62DF\u767D\u5149",
      description: "\u6A21\u62DF LED \u706F\u5E26\uFF08\u767D\u8272 2835 LED\uFF09\uFF0C24V\uFF0C240 LEDs/m\uFF0C\u6BCF\u6BB52.5\u5398\u7C73\uFF086 \u4E2A LED\uFF09",
      descriptionShort: "24V, 240 \u767D\u5149 LEDs/m"
    },
    AN_RGB_CCT_48V_90LPM: {
      name: "\u6A21\u62DF RGB CCT",
      description: "\u6A21\u62DF RGB CCT LED \u706F\u5E26\uFF085050 LED\uFF09\uFF0C48V\uFF0C90 LEDs/m\uFF0C\u6BCF\u6BB516.65\u5398\u7C73\uFF0815 \u4E2A LED\uFF09",
      descriptionShort: "48V, 90 LEDs/m"
    },
    AN_RGB_24V_120LPM: {
      name: "\u6A21\u62DF RGB",
      description: "\u6A21\u62DF RGB LED \u706F\u5E26\uFF082835 LED\uFF09\uFF0C24V\uFF0C120 LEDs/m\uFF0C\u6BCF\u6BB55\u5398\u7C73\uFF086 \u4E2A LED\uFF09",
      descriptionShort: "24V, 120 LEDs/m"
    },
    WS2805_24V_60LPM: {
      name: "WS2805 RGBW CCT",
      description: "RGBW CCT LED \u706F\u5E26\uFF08\u6570\u5B57\uFF09\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\uFF0C\u6BCF\u7EC4 6 \u4E2A\uFF081 \u4E2A\u903B\u8F91 LED = 6 \u4E2A\u7269\u7406 LED\uFF09\u3002",
      descriptionShort: "24V, 60 LEDs/m"
    },
    WS2805_12V_60LPM: {
      name: "WS2805 RGBW CCT",
      description: "RGBW CCT LED \u706F\u5E26\uFF08\u6570\u5B57\uFF09\uFF0C\u53EF\u5355\u72EC\u5BFB\u5740\u7684 LED\uFF0C\u6BCF\u7EC4 6 \u4E2A\uFF081 \u4E2A\u903B\u8F91 LED = 6 \u4E2A\u7269\u7406 LED\uFF09\u3002",
      descriptionShort: "12V, 60 LEDs/m"
    }
  }
};

// src/i18n.ts
var resources = {
  en: {
    main: en_default
  },
  de: {
    main: de_default
  },
  zh: {
    main: zh_default
  }
};
var supportedLngs = {
  en: "English",
  de: "Deutsch",
  zh: "\u7B80\u4F53\u4E2D\u6587"
};
instance.use(esm_default).use(initReactI18next).use(Browser).init({
  resources,
  detection: {
    order: ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag", "path", "subdomain"],
    lookupQuerystring: "lng"
  },
  fallbackLng: "en",
  supportedLngs: Object.keys(supportedLngs),
  //lng:"en", //default language
  interpolation: {
    escapeValue: false
    // react already safes from xss
  }
});
var i18n_default = instance;

// src/check/checkContext.ts
var keyOf = (nodeId, handleId) => `${nodeId}::${handleId}`;
var UnionFind = class {
  parent = /* @__PURE__ */ new Map();
  add(value) {
    if (!this.parent.has(value)) {
      this.parent.set(value, value);
    }
  }
  find(value) {
    const parent = this.parent.get(value);
    if (!parent || parent === value) {
      return value;
    }
    const root = this.find(parent);
    this.parent.set(value, root);
    return root;
  }
  union(a, b) {
    this.add(a);
    this.add(b);
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootB, rootA);
    }
  }
};
var getInputFieldValue = (node, technicalID) => node.data.inputFields?.find((field) => field.technicalID === technicalID)?.value;
var hasInputField = (node, technicalID) => Boolean(technicalID && node.data.inputFields?.some((field) => field.technicalID === technicalID));
var getNodeHandleById = (node, handleId) => allVisibleHandles(node).find((handle) => handle.hid === handleId);
var isPassiveJoinNode = (node) => ["SolderJoint", "WAGO_2X", "WAGO_3X"].includes(node.data.technicalID);
var isHiddenByCondition = (node, handle) => handle.hideConditions?.some((condition) => {
  const selectedValue = node.data.selectFields?.find((field) => field.technicalID === condition.selectHID)?.selectedValue;
  return selectedValue !== void 0 && condition.values.includes(selectedValue);
}) || false;
var repeatedHandleTemplateId = (handle) => typeof handle.repeatIndex === "number" ? handle.hid.replace(new RegExp(`_${handle.repeatIndex}$`), "") : void 0;
var hydrateRepeatedHandle = (node, handle) => {
  const templateId = repeatedHandleTemplateId(handle);
  const template = templateId ? node.data.handles?.find((candidate) => candidate.hid === templateId && candidate.repeated === "yes") : void 0;
  return template ? { ...template, ...handle } : handle;
};
var repeatedVisibleHandles = (node) => (node.data.repeatedHandleArray || []).map((handle) => hydrateRepeatedHandle(node, handle));
var allVisibleHandles = (node) => [
  ...node.data.handles || [],
  ...repeatedVisibleHandles(node)
].filter((handle) => !isHiddenByCondition(node, handle));
var allHandles = (node) => [
  ...node.data.handles || [],
  ...repeatedVisibleHandles(node)
];
var inferRawFunctions = (handle) => handle.functions || [];
var inferFunctions = (rawFunctions) => rawFunctions;
var hasVoltageOutputFunction = (functions) => functions.some((fn) => fn === "suppl_out" || fn === "dig_out" || fn === "dig_clock_out" || fn === "dig_backup_out" || fn === "pwm_out" || fn === "usb_power_out");
var inferVoltageOut = (node, handle, functions) => {
  if (!hasVoltageOutputFunction(functions)) {
    return void 0;
  }
  if (handle.VoutDependency) {
    const inputFieldValue = getInputFieldValue(node, handle.VoutDependency);
    if (typeof inputFieldValue === "number") {
      return inputFieldValue;
    }
  }
  if (typeof handle.Vout === "number" && handle.Vout > 0) {
    return handle.Vout;
  }
  const sourceVoltage = getInputFieldValue(node, "source_voltage");
  if (functions.includes("suppl_out") && typeof sourceVoltage === "number") {
    return sourceVoltage;
  }
  return void 0;
};
var hasVoltageInputFunction = (functions) => functions.some((fn) => fn === "suppl_in" || fn === "dig_in" || fn === "dig_clock_in" || fn === "dig_backup_in" || fn === "pwm_in_R" || fn === "pwm_in_G" || fn === "pwm_in_B" || fn === "pwm_in_W" || fn === "pwm_in_WW" || fn === "usb_full");
var inferVoltageRange = (handle, functions) => {
  if (!hasVoltageInputFunction(functions)) {
    return {};
  }
  if (typeof handle.tolVmin === "number" || typeof handle.tolVmax === "number") {
    return {
      voltageMin: handle.tolVmin,
      voltageMax: handle.tolVmax
    };
  }
  return {};
};
var buildCheckHandle = (node, handle, edges) => {
  const rawFunctions = inferRawFunctions(handle);
  const functions = inferFunctions(rawFunctions);
  const voltageRange = inferVoltageRange(handle, functions);
  return {
    key: keyOf(node.id, handle.hid),
    node,
    handle,
    rawFunctions,
    functions,
    connectedEdges: edges.filter((edge) => edge.source === node.id && edge.sourceHandle === handle.hid || edge.target === node.id && edge.targetHandle === handle.hid),
    voltageOut: inferVoltageOut(node, handle, functions),
    ...voltageRange
  };
};
var uniqueBy = (items, keyOfItem) => Array.from(new Map(items.map((item) => [keyOfItem(item), item])).values());
var classificationFunctions = (handle) => handle.rawFunctions.length > 0 ? handle.rawFunctions : handle.functions;
var hasExclusiveFunction = (handle, functions) => {
  const handleFunctions = classificationFunctions(handle);
  return handleFunctions.length === 1 && functions.includes(handleFunctions[0]);
};
var classifyNet = (handles) => {
  const classifications = /* @__PURE__ */ new Set();
  if (handles.some((handle) => handle.functions.includes("gnd"))) {
    classifications.add("gnd_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("suppl_out"))) {
    classifications.add("suppl_net_type");
  }
  if (handles.some((handle) => hasExclusiveFunction(handle, ["dig_out", "dig_clock_out", "dig_backup_out"]))) {
    classifications.add("digital_net_type");
  }
  if (handles.some((handle) => hasExclusiveFunction(handle, ["pwm_out"]))) {
    classifications.add("pwm_net_type");
  }
  if (handles.some((handle) => hasExclusiveFunction(handle, ["an_out"]))) {
    classifications.add("analog_net_type");
  }
  if (handles.some((handle) => hasExclusiveFunction(handle, ["audio_out"]))) {
    classifications.add("audio_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("eth"))) {
    classifications.add("eth_net_type");
  }
  if (handles.some((handle) => hasExclusiveFunction(handle, ["usb_power_out"]))) {
    classifications.add("usb_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("rs485_A"))) {
    classifications.add("rs485_a_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("rs485_B"))) {
    classifications.add("rs485_b_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("neutral_out"))) {
    classifications.add("N_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("line_out"))) {
    classifications.add("L_net_type");
  }
  if (handles.some((handle) => classificationFunctions(handle).includes("pe_out"))) {
    classifications.add("PE_net_type");
  }
  return Array.from(classifications);
};
var isSourceHandle = (handle) => classificationFunctions(handle).some((fn) => fn === "suppl_out" || fn === "dig_out" || fn === "dig_clock_out" || fn === "dig_backup_out" || fn === "pwm_out" || fn === "an_out" || fn === "audio_out" || fn === "eth" || fn === "usb_power_out" || fn === "rs485_A" || fn === "rs485_B" || fn === "neutral_out" || fn === "line_out" || fn === "pe_out");
var isSinkHandle = (handle) => handle.functions.some((fn) => fn === "suppl_in" || fn === "dig_in" || fn === "dig_clock_in" || fn === "dig_backup_in" || fn === "pwm_in_R" || fn === "pwm_in_G" || fn === "pwm_in_B" || fn === "pwm_in_W" || fn === "pwm_in_WW" || fn === "an_in" || fn === "audio_in" || fn === "eth" || fn === "usb_full" || fn === "neutral_in" || fn === "line_in" || fn === "pe_in");
var createNet = (id, layer, handles, edges, childNetIds = []) => {
  const uniqueHandles = uniqueBy(handles, (handle) => handle.key);
  const uniqueEdges = uniqueBy(edges, (edge) => edge.id);
  return {
    id,
    layer,
    childNetIds: uniqueBy(childNetIds, (childNetId) => childNetId),
    classifications: classifyNet(uniqueHandles),
    handles: uniqueHandles,
    edges: uniqueEdges,
    componentIds: uniqueBy(uniqueHandles.map((handle) => handle.node.id), (nodeId) => nodeId),
    sourceHandles: uniqueHandles.filter(isSourceHandle),
    sinkHandles: uniqueHandles.filter(isSinkHandle)
  };
};
var netByHandleKey = (nets) => {
  const byHandleKey = /* @__PURE__ */ new Map();
  nets.forEach((net) => {
    net.handles.forEach((handle) => {
      byHandleKey.set(handle.key, net);
    });
  });
  return byHandleKey;
};
var createElementaryNets = (handles, edges) => {
  const uf = new UnionFind();
  const handleByKey = new Map(handles.map((handle) => [handle.key, handle]));
  handles.forEach((handle) => uf.add(handle.key));
  edges.forEach((edge) => {
    if (!edge.sourceHandle || !edge.targetHandle) return;
    const sourceKey = keyOf(edge.source, edge.sourceHandle);
    const targetKey2 = keyOf(edge.target, edge.targetHandle);
    if (handleByKey.has(sourceKey) && handleByKey.has(targetKey2)) {
      uf.union(sourceKey, targetKey2);
    }
  });
  const handlesByNode3 = /* @__PURE__ */ new Map();
  handles.forEach((handle) => {
    handlesByNode3.set(handle.node.id, [...handlesByNode3.get(handle.node.id) || [], handle]);
  });
  handlesByNode3.forEach((nodeHandles) => {
    if (!isPassiveJoinNode(nodeHandles[0].node)) return;
    nodeHandles.forEach((handle, index) => {
      nodeHandles.slice(index + 1).forEach((candidate) => {
        uf.union(handle.key, candidate.key);
      });
    });
  });
  const handlesByRoot = /* @__PURE__ */ new Map();
  handles.forEach((handle) => {
    const root = uf.find(handle.key);
    handlesByRoot.set(root, [...handlesByRoot.get(root) || [], handle]);
  });
  const netsByRoot = /* @__PURE__ */ new Map();
  handlesByRoot.forEach((netHandles, root) => {
    netsByRoot.set(root, createNet(`elementary:${root}`, "elementary", netHandles, []));
  });
  edges.forEach((edge) => {
    if (!edge.sourceHandle) return;
    const sourceKey = keyOf(edge.source, edge.sourceHandle);
    const root = handleByKey.has(sourceKey) ? uf.find(sourceKey) : void 0;
    const net = root ? netsByRoot.get(root) : void 0;
    if (net) {
      net.edges.push(edge);
    }
  });
  return Array.from(netsByRoot.values()).filter((net) => net.edges.length > 0).map((net) => createNet(net.id, net.layer, net.handles, net.edges, net.childNetIds));
};
var createGroupedNets = (childNets, layer, connectionPairs) => {
  const uf = new UnionFind();
  const childNetById = new Map(childNets.map((net) => [net.id, net]));
  childNets.forEach((net) => uf.add(net.id));
  connectionPairs.forEach(([a, b]) => {
    if (childNetById.has(a) && childNetById.has(b)) {
      uf.union(a, b);
    }
  });
  const childNetsByRoot = /* @__PURE__ */ new Map();
  childNets.forEach((net) => {
    const root = uf.find(net.id);
    childNetsByRoot.set(root, [...childNetsByRoot.get(root) || [], net]);
  });
  return Array.from(childNetsByRoot.entries()).map(([root, groupedChildNets]) => createNet(
    `${layer}:${root}`,
    layer,
    groupedChildNets.flatMap((net) => net.handles),
    groupedChildNets.flatMap((net) => net.edges),
    groupedChildNets.map((net) => net.id)
  ));
};
var getFuseConnectionPairs = (nodes, handleByKey, childNetByHandleKey) => nodes.flatMap((node) => (node.data.internalConnections || []).filter((connection) => connection.kind === "fuse").flatMap((connection) => {
  const fromHandle = handleByKey.get(keyOf(node.id, connection.fromHandle));
  const toHandle = handleByKey.get(keyOf(node.id, connection.toHandle));
  if (!fromHandle || !toHandle) return [];
  const fromNet = childNetByHandleKey.get(fromHandle.key);
  const toNet = childNetByHandleKey.get(toHandle.key);
  if (!fromNet || !toNet || fromNet.id === toNet.id) return [];
  return [[fromNet.id, toNet.id]];
}));
var fixedVoutMatches = (a, b) => typeof a.handle.Vout === "number" && typeof b.handle.Vout === "number" && a.handle.Vout > 0 && b.handle.Vout > 0 && Math.abs(a.handle.Vout - b.handle.Vout) < 0.5;
var sameInputFieldDependency = (a, b) => Boolean(
  a.handle.VoutDependency && a.handle.VoutDependency === b.handle.VoutDependency && hasInputField(a.node, a.handle.VoutDependency)
);
var hasFunction = (handle, fn) => handle.functions.includes(fn);
var isInternalShort = (a, b) => a.node.id === b.node.id && Boolean(a.node.data.internalConnections?.some((connection) => connection.kind === "short" && (connection.fromHandle === a.handle.hid && connection.toHandle === b.handle.hid || connection.fromHandle === b.handle.hid && connection.toHandle === a.handle.hid)));
var shouldLinkThroughComponent = (a, b) => {
  if (a.node.id !== b.node.id || a.key === b.key) return false;
  if (isInternalShort(a, b)) return true;
  if (hasFunction(a, "gnd") && hasFunction(b, "gnd")) return true;
  if (hasFunction(a, "suppl_out") && hasFunction(b, "suppl_in")) {
    return a.handle.VoutDependency === b.handle.hid;
  }
  if (hasFunction(b, "suppl_out") && hasFunction(a, "suppl_in")) {
    return b.handle.VoutDependency === a.handle.hid;
  }
  if (hasFunction(a, "suppl_out") && hasFunction(b, "suppl_out")) {
    return fixedVoutMatches(a, b) || sameInputFieldDependency(a, b);
  }
  if (a.node.data.group === "led" && hasFunction(a, "suppl_in") && hasFunction(b, "suppl_in")) {
    return true;
  }
  return false;
};
var shouldLinkDigitalNetsThroughResistor = (a, b, aNet, bNet) => a.node.id === b.node.id && a.key !== b.key && a.node.data.technicalID === "Resistor" && aNet.classifications.includes("digital_net_type") && bNet.classifications.includes("digital_net_type");
var getComponentConnectionPairs = (handles, childNetByHandleKey, options = {}) => {
  const handlesByNode3 = /* @__PURE__ */ new Map();
  const pairs = [];
  handles.forEach((handle) => {
    handlesByNode3.set(handle.node.id, [...handlesByNode3.get(handle.node.id) || [], handle]);
  });
  handlesByNode3.forEach((nodeHandles) => {
    nodeHandles.forEach((handle, index) => {
      nodeHandles.slice(index + 1).forEach((candidate) => {
        const net = childNetByHandleKey.get(handle.key);
        const candidateNet = childNetByHandleKey.get(candidate.key);
        if (!net || !candidateNet || net.id === candidateNet.id) return;
        if (options.skipFusePassThroughPairs && isFusePassThrough(handle, candidate)) return;
        if (shouldLinkThroughComponent(handle, candidate) || shouldLinkDigitalNetsThroughResistor(handle, candidate, net, candidateNet)) {
          pairs.push([net.id, candidateNet.id]);
        }
      });
    });
  });
  return pairs;
};
var isFusePassThrough = (a, b) => a.node.id === b.node.id && Boolean(a.node.data.internalConnections?.some((connection) => connection.kind === "fuse" && (connection.fromHandle === a.handle.hid && connection.toHandle === b.handle.hid || connection.fromHandle === b.handle.hid && connection.toHandle === a.handle.hid)));
var isSupplyInputPassThrough = (a, b) => {
  if (a.node.id !== b.node.id || a.key === b.key) return false;
  return a.functions.includes("suppl_in") && b.functions.includes("suppl_in");
};
var isSeriesSignalNode = (node) => node.data.technicalID === "Resistor";
var isSignalPassThrough = (a, b) => {
  if (a.node.id !== b.node.id || !isSeriesSignalNode(a.node)) return false;
  if (a.key === b.key) return false;
  const nodeHandles = [...a.node.data.handles || [], ...a.node.data.repeatedHandleArray || []];
  return nodeHandles.length === 2;
};
function createDiagramCheckContext(nodes, edges) {
  const handles = nodes.flatMap((node) => allVisibleHandles(node).map((handle) => buildCheckHandle(node, handle, edges)));
  const handleByKey = new Map(handles.map((handle) => [handle.key, handle]));
  const wiredHandlesByKey = /* @__PURE__ */ new Map();
  const elementaryNets = createElementaryNets(handles, edges);
  const elementaryNetByHandleKey = netByHandleKey(elementaryNets);
  const fusedNets = createGroupedNets(
    elementaryNets,
    "fused",
    getFuseConnectionPairs(nodes, handleByKey, elementaryNetByHandleKey)
  );
  const fusedNetByHandleKey = netByHandleKey(fusedNets);
  const componentLinkedNets = createGroupedNets(
    fusedNets,
    "component-linked",
    getComponentConnectionPairs(handles, fusedNetByHandleKey)
  );
  const componentLinkedElementaryBasedNets = createGroupedNets(
    elementaryNets,
    "component-linked-elementary-based",
    getComponentConnectionPairs(handles, elementaryNetByHandleKey, { skipFusePassThroughPairs: true })
  );
  const componentLinkedElementaryBasedNetByHandleKey = netByHandleKey(componentLinkedElementaryBasedNets);
  const nets = componentLinkedNets;
  const netByHandleKeyMap = netByHandleKey(nets);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const invalidWires = edges.flatMap((edge) => {
    const refs = [
      { side: "source", nodeId: edge.source, handleId: edge.sourceHandle },
      { side: "target", nodeId: edge.target, handleId: edge.targetHandle }
    ];
    return refs.flatMap((ref) => {
      const node = nodeById.get(ref.nodeId);
      if (!node) {
        return [{ edge, side: ref.side, handleId: ref.handleId, reason: "missing-node" }];
      }
      if (!ref.handleId) {
        return [{ edge, side: ref.side, node, handleId: ref.handleId, reason: "missing-handle" }];
      }
      const visibleHandle = allVisibleHandles(node).some((handle) => handle.hid === ref.handleId);
      if (visibleHandle) return [];
      const knownHiddenHandle = allHandles(node).some((handle) => handle.hid === ref.handleId);
      return [{
        edge,
        side: ref.side,
        node,
        handleId: ref.handleId,
        reason: knownHiddenHandle ? "hidden-handle" : "missing-handle"
      }];
    });
  });
  edges.forEach((edge) => {
    if (!edge.sourceHandle || !edge.targetHandle) return;
    const source = handleByKey.get(keyOf(edge.source, edge.sourceHandle));
    const target = handleByKey.get(keyOf(edge.target, edge.targetHandle));
    if (!source || !target) return;
    wiredHandlesByKey.set(source.key, [...wiredHandlesByKey.get(source.key) || [], target]);
    wiredHandlesByKey.set(target.key, [...wiredHandlesByKey.get(target.key) || [], source]);
  });
  const resolveVoltageOut = (handle, visited = /* @__PURE__ */ new Set()) => {
    if (!hasVoltageOutputFunction(handle.functions)) {
      return void 0;
    }
    const dependency = handle.handle.VoutDependency;
    if (dependency) {
      const inputFieldValue = getInputFieldValue(handle.node, dependency);
      if (typeof inputFieldValue === "number") {
        return inputFieldValue;
      }
      const dependencyHandle = getNodeHandleById(handle.node, dependency);
      if (dependencyHandle) {
        const dependencyCheckHandle = handleByKey.get(keyOf(handle.node.id, dependencyHandle.hid));
        if (dependencyCheckHandle && !visited.has(dependencyCheckHandle.key)) {
          visited.add(dependencyCheckHandle.key);
          const dependencyOutputs = externallyPowerReachableHandles(dependencyCheckHandle).filter((candidate) => hasVoltageOutputFunction(candidate.functions));
          const resolvedVoltage = dependencyOutputs.map((candidate) => resolveVoltageOut(candidate, new Set(visited))).find((voltage) => voltage !== void 0);
          if (resolvedVoltage !== void 0) {
            return resolvedVoltage;
          }
        }
      }
    }
    if (typeof handle.handle.Vout === "number" && handle.handle.Vout > 0) {
      return handle.handle.Vout;
    }
    return handle.voltageOut;
  };
  const reachableHandles = (handle, canPassThrough) => {
    const visited = /* @__PURE__ */ new Set();
    const queue = [handle];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current.key)) continue;
      visited.add(current.key);
      const net = elementaryNetByHandleKey.get(current.key);
      net?.handles.forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
      handles.filter((candidate) => canPassThrough(current, candidate)).forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
    }
    return handles.filter((candidate) => visited.has(candidate.key));
  };
  const powerReachableHandles = (handle) => reachableHandles(handle, (current, candidate) => isInternalShort(current, candidate) || isFusePassThrough(current, candidate) || isSupplyInputPassThrough(current, candidate));
  const externallyPowerReachableHandles = (handle) => {
    const externalHandles = handle.connectedEdges.flatMap((edge) => {
      const sourceKey = edge.sourceHandle ? keyOf(edge.source, edge.sourceHandle) : void 0;
      const targetKey2 = edge.targetHandle ? keyOf(edge.target, edge.targetHandle) : void 0;
      const counterpartKey = sourceKey === handle.key ? targetKey2 : sourceKey;
      const counterpart = counterpartKey ? handleByKey.get(counterpartKey) : void 0;
      return counterpart && counterpart.node.id !== handle.node.id ? [counterpart] : [];
    });
    const visited = /* @__PURE__ */ new Set();
    const queue = [...externalHandles];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current.key)) continue;
      visited.add(current.key);
      const wiredHandles = wiredHandlesByKey.get(current.key) || [];
      wiredHandles.filter((candidate) => candidate.node.id !== handle.node.id).forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
      handles.filter((candidate) => candidate.node.id !== handle.node.id && (isInternalShort(current, candidate) || isFusePassThrough(current, candidate) || isSupplyInputPassThrough(current, candidate))).forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
    }
    return handles.filter((candidate) => visited.has(candidate.key));
  };
  const signalReachableHandles = (handle) => reachableHandles(handle, (current, candidate) => isInternalShort(current, candidate) || isSignalPassThrough(current, candidate));
  return {
    nodes,
    edges,
    handles,
    nets,
    elementaryNets,
    fusedNets,
    componentLinkedNets,
    componentLinkedElementaryBasedNets,
    invalidWires,
    getHandle: (nodeId, handleId) => handleId ? handleByKey.get(keyOf(nodeId, handleId)) : void 0,
    getNetByHandle: (handle) => netByHandleKeyMap.get(handle.key),
    getElementaryNetByHandle: (handle) => elementaryNetByHandleKey.get(handle.key),
    getFusedNetByHandle: (handle) => fusedNetByHandleKey.get(handle.key),
    getComponentLinkedElementaryBasedNetByHandle: (handle) => componentLinkedElementaryBasedNetByHandleKey.get(handle.key),
    hasFunction,
    handlesWithFunction: (fn) => handles.filter((handle) => hasFunction(handle, fn)),
    connectedHandles: (handle) => {
      const net = netByHandleKeyMap.get(handle.key);
      return net ? net.handles.filter((candidate) => candidate.key !== handle.key) : [];
    },
    resolveVoltageOut,
    powerReachableHandles,
    externallyPowerReachableHandles,
    signalReachableHandles
  };
}
var describeHandle = (handle) => `${handle.node.data.technicalID || handle.node.id}: ${handle.handle.name || handle.handle.hid}`;

// src/check/normalizeDiagramCheckIssues.ts
var severityRank = {
  error: 3,
  warning: 2,
  info: 1
};
var fingerprintGroupKey = (issue2) => {
  const fingerprint = issue2.fingerprint;
  if (!fingerprint) return void 0;
  return `${fingerprint.scope}:${fingerprint.key}`;
};
var fullFingerprintKey = (issue2) => {
  const fingerprint = issue2.fingerprint;
  if (!fingerprint) return void 0;
  return `${fingerprint.scope}:${fingerprint.key}:${fingerprint.problem}`;
};
var targetKey = (issue2) => {
  if (!issue2.targets || issue2.targets.length === 0) return void 0;
  return issue2.targets.map((target) => `${target.type}:${target.id}:${target.handleId || ""}`).sort().join("|");
};
var fallbackDuplicateKey = (issue2) => fullFingerprintKey(issue2) || `${issue2.ruleId || ""}:${issue2.title}:${targetKey(issue2) || issue2.id}`;
var betterIssue = (candidate, current, order2) => {
  const candidateSeverity = severityRank[candidate.severity];
  const currentSeverity = severityRank[current.severity];
  if (candidateSeverity !== currentSeverity) return candidateSeverity > currentSeverity;
  const candidateSpecificity = candidate.specificity ?? 0;
  const currentSpecificity = current.specificity ?? 0;
  if (candidateSpecificity !== currentSpecificity) return candidateSpecificity > currentSpecificity;
  const candidatePriority = candidate.priority ?? Number.MAX_SAFE_INTEGER;
  const currentPriority = current.priority ?? Number.MAX_SAFE_INTEGER;
  if (candidatePriority !== currentPriority) return candidatePriority < currentPriority;
  return (order2.get(candidate) ?? 0) < (order2.get(current) ?? 0);
};
var suppresses = (candidate, other) => {
  const candidateFingerprint = candidate.fingerprint;
  const otherFingerprint = other.fingerprint;
  if (!candidateFingerprint || !otherFingerprint) return false;
  if (fingerprintGroupKey(candidate) !== fingerprintGroupKey(other)) return false;
  return candidate.suppresses?.includes(otherFingerprint.problem) || other.suppressedBy?.includes(candidateFingerprint.problem) || false;
};
var chooseBestDuplicates = (issues, order2, suppressedBy) => {
  const bestByKey = /* @__PURE__ */ new Map();
  const duplicateGroups = /* @__PURE__ */ new Map();
  issues.forEach((issue2) => {
    const key = fallbackDuplicateKey(issue2);
    duplicateGroups.set(key, [...duplicateGroups.get(key) || [], issue2]);
    const current = bestByKey.get(key);
    if (!current || betterIssue(issue2, current, order2)) {
      bestByKey.set(key, issue2);
    }
  });
  duplicateGroups.forEach((duplicates, key) => {
    const winner = bestByKey.get(key);
    if (!winner) return;
    duplicates.filter((issue2) => issue2 !== winner).forEach((issue2) => {
      suppressedBy.set(issue2, /* @__PURE__ */ new Set([...suppressedBy.get(issue2) || [], winner.id]));
    });
  });
  return Array.from(bestByKey.values());
};
var withSuppressionMarkers = (issues, suppressedBy) => issues.map((issue2) => {
  const suppressedByIssueIds = Array.from(suppressedBy.get(issue2) || []);
  return {
    ...issue2,
    suppressed: suppressedByIssueIds.length > 0,
    suppressedByIssueIds: suppressedByIssueIds.length > 0 ? suppressedByIssueIds : void 0
  };
});
var normalizeDiagramCheckIssues = (issues, options = {}) => {
  const order2 = new Map(issues.map((issue2, index) => [issue2, index]));
  const visible = new Set(issues);
  const suppressedBy = /* @__PURE__ */ new Map();
  issues.forEach((candidate) => {
    issues.forEach((other) => {
      if (candidate === other || !visible.has(other)) return;
      if (suppresses(candidate, other)) {
        visible.delete(other);
        suppressedBy.set(other, /* @__PURE__ */ new Set([...suppressedBy.get(other) || [], candidate.id]));
      }
    });
  });
  const visibleIssues = chooseBestDuplicates(Array.from(visible), order2, suppressedBy);
  if (options.includeSuppressed) {
    return withSuppressionMarkers(issues, suppressedBy).sort((a, b) => {
      const aSuppressed = a.suppressed ? 1 : 0;
      const bSuppressed = b.suppressed ? 1 : 0;
      if (aSuppressed !== bSuppressed) return aSuppressed - bSuppressed;
      const severityDiff = severityRank[b.severity] - severityRank[a.severity];
      if (severityDiff !== 0) return severityDiff;
      const priorityDiff = (a.priority ?? Number.MAX_SAFE_INTEGER) - (b.priority ?? Number.MAX_SAFE_INTEGER);
      if (priorityDiff !== 0) return priorityDiff;
      return (order2.get(a) ?? 0) - (order2.get(b) ?? 0);
    });
  }
  return visibleIssues.sort((a, b) => {
    const severityDiff = severityRank[b.severity] - severityRank[a.severity];
    if (severityDiff !== 0) return severityDiff;
    const priorityDiff = (a.priority ?? Number.MAX_SAFE_INTEGER) - (b.priority ?? Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;
    return (order2.get(a) ?? 0) - (order2.get(b) ?? 0);
  });
};

// src/check/componentSpecificRules.ts
var COMPONENT_RULE_ID = "component-rules";
var checkText = (key, values) => String(i18n_default.t(`sidebar.check.${key}`, { ns: "main", ...values }));
var issueText = (issueKey, field, values) => checkText(`rules.${COMPONENT_RULE_ID}.issues.${issueKey}.${field}`, values);
var nodeTarget = (node) => ({
  type: "node",
  id: node.id,
  label: node.data.technicalID || node.data.name || node.id
});
var edgeTarget = (edge) => ({
  type: "edge",
  id: edge.id,
  label: `${edge.sourceHandle || edge.source} -> ${edge.targetHandle || edge.target}`
});
var handleTargets = (handle) => [
  nodeTarget(handle.node),
  ...handle.connectedEdges.map(edgeTarget)
];
var netTargets = (net) => {
  const nodes = new Map(net.handles.map((handle) => [handle.node.id, nodeTarget(handle.node)]));
  const edges = new Map(net.edges.map((edge) => [edge.id, edgeTarget(edge)]));
  return [...nodes.values(), ...edges.values()];
};
var uniqueTargets = (targets) => {
  const targetsByKey = /* @__PURE__ */ new Map();
  targets.forEach((target) => {
    targetsByKey.set(`${target.type}:${target.id}:${target.handleId || ""}`, target);
  });
  return Array.from(targetsByKey.values());
};
var translatedIssue = (issueKey, id, severity, values, targets, options) => ({
  id,
  ruleId: COMPONENT_RULE_ID,
  severity,
  priority: options?.priority,
  specificity: options?.specificity,
  fingerprint: options?.fingerprint,
  suppresses: options?.suppresses,
  suppressedBy: options?.suppressedBy,
  title: issueText(issueKey, "title", values),
  shortDescription: issueText(issueKey, "shortDescription", values),
  description: issueText(issueKey, "description", values),
  recommendation: issueText(issueKey, "recommendation", values),
  targets: targets ? uniqueTargets(targets) : void 0
});
var hasFunction2 = (handle, fn) => handle.functions.includes(fn);
var handlesByNode = (context) => {
  const byNode = /* @__PURE__ */ new Map();
  context.handles.forEach((handle) => {
    byNode.set(handle.node.id, [...byNode.get(handle.node.id) || [], handle]);
  });
  return byNode;
};
var nodeHandleMap = (handles) => new Map(handles.map((handle) => [handle.handle.hid, handle]));
var netHasOtherHandleWithFunction = (context, handle, fn) => context.getNetByHandle(handle)?.handles.some((candidate) => candidate.key !== handle.key && hasFunction2(candidate, fn)) || false;
var sn74Ahct125nOePinIsDrivenOrEnabled = (context, handle) => netHasOtherHandleWithFunction(context, handle, "dig_out") || netHasOtherHandleWithFunction(context, handle, "gnd");
var pinGroupIsUsed = (context, output) => output.connectedEdges.length > 0 && context.signalReachableHandles(output).some((candidate) => candidate.key !== output.key && hasFunction2(candidate, "dig_in"));
var isLedDataOrClockInput = (handle) => handle.node.data.group === "led" && (hasFunction2(handle, "dig_in") || hasFunction2(handle, "dig_clock_in"));
var sn74Ahct125nPinGroups = [
  { channel: "1", oe: "1OE", input: "1A", output: "1Y" },
  { channel: "2", oe: "2OE", input: "2A", output: "2Y" },
  { channel: "3", oe: "3OE", input: "3A", output: "3Y" },
  { channel: "4", oe: "4OE", input: "4A", output: "4Y" }
];
var checkSN74AHCT125NUsedChannelInputs = {
  id: "sn74ahct125n-used-channel-inputs",
  componentTechnicalIds: ["SN74AHCT125N"],
  check: (context) => {
    const issues = [];
    handlesByNode(context).forEach((nodeHandles) => {
      const node = nodeHandles[0]?.node;
      if (!node || node.data.technicalID !== "SN74AHCT125N") return;
      const handles = nodeHandleMap(nodeHandles);
      sn74Ahct125nPinGroups.forEach((group) => {
        const output = handles.get(group.output);
        const input = handles.get(group.input);
        const oe = handles.get(group.oe);
        if (!output || !input || !oe || !pinGroupIsUsed(context, output)) return;
        const missingHandles = [
          ...!netHasOtherHandleWithFunction(context, input, "dig_out") ? [input] : [],
          ...!sn74Ahct125nOePinIsDrivenOrEnabled(context, oe) ? [oe] : []
        ];
        if (missingHandles.length === 0) return;
        const outputNet = context.getNetByHandle(output);
        const missingNetTargets = missingHandles.map((handle) => context.getNetByHandle(handle)).filter((net) => Boolean(net)).flatMap(netTargets);
        issues.push(translatedIssue(
          "sn74Ahct125nUsedChannelInputMissing",
          `component-sn74ahct125n-used-channel-input-missing-${node.id}-${group.channel}`,
          "error",
          {
            component: node.data.technicalID || node.data.name || node.id,
            channel: group.channel,
            output: describeHandle(output),
            handles: missingHandles.map(describeHandle).join(", ")
          },
          [
            nodeTarget(node),
            ...handleTargets(output),
            ...missingHandles.flatMap(handleTargets),
            ...outputNet ? netTargets(outputNet) : [],
            ...missingNetTargets
          ],
          {
            priority: 38,
            specificity: 100,
            fingerprint: {
              scope: "component",
              key: `${node.id}:${group.channel}`,
              problem: "sn74ahct125n-used-channel-input-missing"
            },
            suppresses: [
              "digital-sink-without-source",
              "multiple-digital-sources",
              "digital-signal-voltage-mismatch"
            ]
          }
        ));
      });
    });
    return issues;
  }
};
var checkSN74AHCT125NDirectLedOutputMissingSeriesResistor = {
  id: "sn74ahct125n-direct-led-output-series-resistor",
  componentTechnicalIds: ["SN74AHCT125N"],
  check: (context) => {
    const issues = [];
    handlesByNode(context).forEach((nodeHandles) => {
      const node = nodeHandles[0]?.node;
      if (!node || node.data.technicalID !== "SN74AHCT125N") return;
      nodeHandles.filter((output) => hasFunction2(output, "dig_out") && output.connectedEdges.length > 0).forEach((output) => {
        const elementaryNet = context.getElementaryNetByHandle(output);
        if (!elementaryNet) return;
        elementaryNet.handles.filter((candidate) => candidate.key !== output.key).filter(isLedDataOrClockInput).forEach((ledInput) => {
          issues.push(translatedIssue(
            "sn74Ahct125nDirectLedOutputMissingSeriesResistor",
            `component-sn74ahct125n-direct-led-output-missing-series-resistor-${output.key}-${ledInput.key}`,
            "warning",
            {
              output: describeHandle(output),
              input: describeHandle(ledInput),
              led: ledInput.node.data.technicalID || ledInput.node.data.name || ledInput.node.id
            },
            [
              nodeTarget(node),
              ...handleTargets(output),
              ...handleTargets(ledInput),
              ...netTargets(elementaryNet)
            ],
            {
              priority: 72,
              specificity: 80,
              fingerprint: {
                scope: "handle",
                key: `${output.key}:${ledInput.key}`,
                problem: "sn74ahct125n-direct-led-output-missing-series-resistor"
              }
            }
          ));
        });
      });
    });
    return issues;
  }
};
var componentSpecificRules = [
  checkSN74AHCT125NUsedChannelInputs,
  checkSN74AHCT125NDirectLedOutputMissingSeriesResistor
];
var runComponentSpecificRules = (context) => componentSpecificRules.flatMap((rule) => rule.check(context));

// src/check/rules.ts
var checkText2 = (key, values) => String(i18n_default.t(`sidebar.check.${key}`, { ns: "main", ...values }));
var ruleText = (ruleId, field) => checkText2(`rules.${ruleId}.${field}`);
var issueText2 = (ruleId, issueKey, field, values) => checkText2(`rules.${ruleId}.issues.${issueKey}.${field}`, values);
var nodeTarget2 = (node) => ({
  type: "node",
  id: node.id,
  label: node.data.technicalID || node.data.name || node.id
});
var edgeTarget2 = (edge) => ({
  type: "edge",
  id: edge.id,
  label: `${edge.sourceHandle || edge.source} -> ${edge.targetHandle || edge.target}`
});
var handleTargets2 = (handle) => [
  nodeTarget2(handle.node),
  ...handle.connectedEdges.map(edgeTarget2)
];
var netTargets2 = (net) => {
  const nodes = new Map(net.handles.map((handle) => [handle.node.id, nodeTarget2(handle.node)]));
  const edges = new Map(net.edges.map((edge) => [edge.id, edgeTarget2(edge)]));
  return [...nodes.values(), ...edges.values()];
};
var uniqueTargets2 = (targets) => {
  const targetsByKey = /* @__PURE__ */ new Map();
  targets.forEach((target) => {
    targetsByKey.set(`${target.type}:${target.id}:${target.handleId || ""}`, target);
  });
  return Array.from(targetsByKey.values());
};
var issue = (id, severity, title, shortDescription, description, recommendation, targets, ruleId = "network-rules", options) => ({
  id,
  ruleId,
  severity,
  priority: options?.priority,
  specificity: options?.specificity,
  fingerprint: options?.fingerprint,
  suppresses: options?.suppresses,
  suppressedBy: options?.suppressedBy,
  diagnosticOnly: options?.diagnosticOnly,
  title,
  shortDescription,
  description,
  recommendation,
  targets: targets ? uniqueTargets2(targets) : void 0
});
var translatedIssue2 = (ruleId, issueKey, id, severity, values, targets, options) => issue(
  id,
  severity,
  issueText2(ruleId, issueKey, "title", values),
  issueText2(ruleId, issueKey, "shortDescription", values),
  issueText2(ruleId, issueKey, "description", values),
  issueText2(ruleId, issueKey, "recommendation", values),
  targets,
  ruleId,
  options
);
var hasFunction3 = (handle, fn) => handle.functions.includes(fn);
var isTechnicalComponent = (node) => !["InfoNode", "LineBoxNode", "WireInfoNode"].includes(node.data.technicalID);
var isPassiveConnectorComponent = (node) => ["SolderJoint", "WAGO_2X", "WAGO_3X"].includes(node.data.technicalID);
var diagramIssueOptions = (problem, specificity, priority, extra) => ({
  priority,
  specificity,
  fingerprint: {
    scope: "diagram",
    key: "diagram",
    problem
  },
  ...extra
});
var netIssueOptions = (net, problem, specificity, priority, extra) => ({
  priority,
  specificity,
  fingerprint: {
    scope: "net",
    key: net.id,
    problem
  },
  ...extra
});
var componentIssueOptions = (node, problem, specificity, priority, extra) => ({
  priority,
  specificity,
  fingerprint: {
    scope: "component",
    key: node.id,
    problem
  },
  ...extra
});
var handleIssueOptions = (handle, problem, specificity, priority, extra) => ({
  priority,
  specificity,
  fingerprint: {
    scope: "handle",
    key: handle.key,
    problem
  },
  ...extra
});
var edgeIssueOptions = (edge, problem, specificity, priority, extra) => ({
  priority,
  specificity,
  fingerprint: {
    scope: "edge",
    key: edge.id,
    problem
  },
  ...extra
});
var hasInputField2 = (handle, technicalId) => Boolean(technicalId && handle.node.data.inputFields?.some((field) => field.technicalID === technicalId));
var getDependencyInputHandle = (context, handle) => {
  const dependency = handle.handle.VoutDependency;
  if (!dependency) return void 0;
  const dependencyHandle = context.getHandle(handle.node.id, dependency);
  if (!dependencyHandle || !hasFunction3(dependencyHandle, "suppl_in")) return void 0;
  return dependencyHandle;
};
var getFusedInputHandle = (context, handle) => {
  const connection = handle.node.data.internalConnections?.find((candidate) => candidate.kind === "fuse" && (candidate.fromHandle === handle.handle.hid || candidate.toHandle === handle.handle.hid));
  if (!connection) return void 0;
  const counterpartHandleId = connection.fromHandle === handle.handle.hid ? connection.toHandle : connection.fromHandle;
  const counterpart = context.getHandle(handle.node.id, counterpartHandleId);
  return counterpart && hasFunction3(counterpart, "suppl_in") ? counterpart : void 0;
};
var isForwardedSupplyOutput = (context, handle) => Boolean(getDependencyInputHandle(context, handle) || getFusedInputHandle(context, handle));
var supplySourceKey = (context, handle) => {
  if (hasInputField2(handle, handle.handle.VoutDependency)) {
    return `${handle.node.id}:input-field:${handle.handle.VoutDependency}`;
  }
  if (typeof handle.handle.Vout === "number" && handle.handle.Vout > 0) {
    return `${handle.node.id}:fixed:${handle.handle.Vout}`;
  }
  const resolvedVoltage = context.resolveVoltageOut(handle);
  if (resolvedVoltage !== void 0) {
    return `${handle.node.id}:resolved:${resolvedVoltage}`;
  }
  return `${handle.node.id}:handle:${handle.handle.hid}`;
};
var independentSupplySources = (context, net) => {
  const sourcesByKey = /* @__PURE__ */ new Map();
  const outputHandles = net.sourceHandles.filter((handle) => hasFunction3(handle, "suppl_out")).filter((handle) => !isForwardedSupplyOutput(context, handle));
  const exclusiveOutputHandles = outputHandles.filter((handle) => !hasFunction3(handle, "suppl_in"));
  const sourceHandles = exclusiveOutputHandles.length > 0 ? exclusiveOutputHandles : outputHandles.slice(0, 1);
  sourceHandles.forEach((handle) => {
    const key = supplySourceKey(context, handle);
    sourcesByKey.set(key, [...sourcesByKey.get(key) || [], handle]);
  });
  return Array.from(sourcesByKey.entries()).map(([key, handles]) => ({ key, handles }));
};
var classificationLabel = (classification) => checkText2(`classificationLabels.${classification}`);
var signalLabel = (signalId) => checkText2(`signalLabels.${signalId}`);
var mainsInputLabel = (inputId) => checkText2(`mainsInputLabels.${inputId}`);
var analogLedColorLabel = (colorId) => checkText2(`analogLedColorLabels.${colorId}`);
var netHasAnyClassification = (net, classifications) => classifications.some((classification) => net.classifications.includes(classification));
var handleNetHasClassification = (context, handle, classification) => context.getNetByHandle(handle)?.classifications.includes(classification) || false;
var supplyInputHasExternalSource = (context, handle) => {
  const net = context.getNetByHandle(handle);
  if (!net?.classifications.includes("suppl_net_type")) return false;
  return net.handles.some((candidate) => candidate.node.id !== handle.node.id && hasFunction3(candidate, "suppl_out"));
};
var handlesByNode2 = (context) => {
  const byNode = /* @__PURE__ */ new Map();
  context.handles.forEach((handle) => {
    byNode.set(handle.node.id, [...byNode.get(handle.node.id) || [], handle]);
  });
  return byNode;
};
var lowVoltageOrSignalClassifications = [
  "gnd_net_type",
  "suppl_net_type",
  "digital_net_type",
  "pwm_net_type",
  "analog_net_type",
  "audio_net_type",
  "eth_net_type",
  "usb_net_type",
  "rs485_a_net_type",
  "rs485_b_net_type"
];
var activeOrSignalClassifications = [
  "L_net_type",
  "N_net_type",
  "suppl_net_type",
  "digital_net_type",
  "pwm_net_type",
  "analog_net_type",
  "audio_net_type",
  "eth_net_type",
  "usb_net_type",
  "rs485_a_net_type",
  "rs485_b_net_type"
];
var signalRuleDefinitions = [
  {
    id: "digital",
    label: "Digital",
    classification: "digital_net_type",
    sourceFunctions: ["dig_out", "dig_clock_out", "dig_backup_out"],
    sinkFunctions: ["dig_in", "dig_clock_in", "dig_backup_in"]
  },
  {
    id: "pwm",
    label: "PWM",
    classification: "pwm_net_type",
    sourceFunctions: ["pwm_out"],
    sinkFunctions: ["pwm_in_R", "pwm_in_G", "pwm_in_B", "pwm_in_W", "pwm_in_WW"]
  },
  {
    id: "analog",
    label: "Analog",
    classification: "analog_net_type",
    sourceFunctions: ["an_out"],
    sinkFunctions: ["an_in"]
  },
  {
    id: "audio",
    label: "Audio",
    classification: "audio_net_type",
    sourceFunctions: ["audio_out"],
    sinkFunctions: ["audio_in"]
  },
  {
    id: "usb",
    label: "USB",
    classification: "usb_net_type",
    sourceFunctions: ["usb_power_out"],
    sinkFunctions: ["usb_full"]
  }
];
var digitalSinkFunctions = ["dig_in", "dig_clock_in", "dig_backup_in"];
var digitalSourceFunctions = ["dig_out", "dig_clock_out", "dig_backup_out"];
var analogLedColorChannels = [
  { id: "red", fn: "pwm_in_R" },
  { id: "green", fn: "pwm_in_G" },
  { id: "blue", fn: "pwm_in_B" },
  { id: "white", fn: "pwm_in_W" },
  { id: "warmWhite", fn: "pwm_in_WW" }
];
var isDigitalSink = (handle) => digitalSinkFunctions.some((fn) => hasFunction3(handle, fn));
var isDigitalSource = (handle) => digitalSourceFunctions.some((fn) => hasFunction3(handle, fn));
var isUsbFull = (handle) => hasFunction3(handle, "usb_full");
var usbPowerSources = (net) => handlesWithAnyFunction(net.handles, ["usb_power_out"]);
var usbPowerSinks = (net) => handlesWithAnyFunction(net.handles, ["usb_full"]);
var usbPowerPairInvalidReasons = (net) => {
  if (!net.classifications.includes("usb_net_type")) return [];
  const sources = usbPowerSources(net);
  const sinks = usbPowerSinks(net);
  const reasons = [];
  if (sources.length !== 1) {
    reasons.push(`expected exactly one USB power source, found ${sources.length}`);
  }
  if (sinks.length !== 1) {
    reasons.push(`expected exactly one USB sink, found ${sinks.length}`);
  }
  if (net.edges.length !== 1) {
    reasons.push(`expected exactly one visible USB wire, found ${net.edges.length}`);
  }
  if (net.handles.length !== sources.length + sinks.length) {
    reasons.push("USB power net contains passive or non-USB terminals");
  }
  if (net.classifications.some((classification) => classification !== "usb_net_type")) {
    reasons.push("USB power net is mixed with another net classification");
  }
  return reasons;
};
var isValidUsbPowerPairNet = (net) => Boolean(net && usbPowerPairInvalidReasons(net).length === 0);
var isInvalidUsbPowerPairNet = (net) => Boolean(net && net.classifications.includes("usb_net_type") && usbPowerPairInvalidReasons(net).length > 0);
var nodeHasValidUsbPowerConnection = (context, nodeId) => context.handles.filter((handle) => handle.node.id === nodeId).some((handle) => hasFunction3(handle, "usb_full") && isValidUsbPowerPairNet(context.getNetByHandle(handle)));
var nodeHasInvalidUsbPowerConnection = (context, nodeId) => context.handles.filter((handle) => handle.node.id === nodeId).some((handle) => hasFunction3(handle, "usb_full") && isInvalidUsbPowerPairNet(context.getNetByHandle(handle)));
var isPassiveSignalComponent = (handle) => ["Kerko", "Resistor"].includes(handle.node.data.technicalID);
var handlesWithAnyFunction = (handles, functions) => handles.filter((handle) => functions.some((fn) => hasFunction3(handle, fn)));
var voltageMatches = (sourceVoltage, target) => {
  if (sourceVoltage === void 0) return false;
  const min = target.voltageMin;
  const max = target.voltageMax;
  if (min === void 0 && max === void 0) return true;
  return (min === void 0 || sourceVoltage >= min) && (max === void 0 || sourceVoltage <= max);
};
var hasVoltageTolerance = (handle) => typeof handle.handle.tolVmin === "number" || typeof handle.handle.tolVmax === "number";
var voltageMatchesHandleTolerance = (sourceVoltage, target) => {
  if (sourceVoltage === void 0) return false;
  const min = target.handle.tolVmin;
  const max = target.handle.tolVmax;
  if (min === void 0 && max === void 0) return true;
  return (min === void 0 || sourceVoltage >= min) && (max === void 0 || sourceVoltage <= max);
};
var digitalBiasTargets = (reachableHandles) => reachableHandles.filter((handle) => isDigitalSink(handle) && !isPassiveSignalComponent(handle));
var hasReachableDigitalSource = (context, handle) => context.signalReachableHandles(handle).some(isDigitalSource);
var hasValidDigitalBias = (context, handle) => {
  const reachableHandles = context.signalReachableHandles(handle);
  const targets = digitalBiasTargets(reachableHandles);
  if (targets.length === 0) return false;
  if (reachableHandles.some((candidate) => hasFunction3(candidate, "gnd"))) {
    return targets.some((target) => voltageMatches(0, target));
  }
  return reachableHandles.filter((candidate) => hasFunction3(candidate, "suppl_out")).some((source) => {
    const sourceVoltage = context.resolveVoltageOut(source);
    return targets.some((target) => voltageMatches(sourceVoltage, target));
  });
};
var hasDigitalBiasConsumer = (context, net) => net.handles.some((handle) => hasValidDigitalBias(context, handle));
var digitalVoltageMismatchReason = (sourceVoltage, target) => {
  if (sourceVoltage === void 0) return void 0;
  const min = target.voltageMin;
  const max = target.voltageMax;
  if (min !== void 0 && sourceVoltage < min) return "low";
  if (max !== void 0 && sourceVoltage > max) return "high";
  return void 0;
};
var digitalSignalSourcesForInput = (context, input) => context.signalReachableHandles(input).filter((candidate) => candidate.node.id !== input.node.id).filter(isDigitalSource);
var shouldCheckDigitalSignalVoltage = (net, digitalSources) => net.classifications.includes("digital_net_type") || net.classifications.length === 0 && digitalSources.length > 0;
var mainsFunctions = ["line_in", "line_out", "neutral_in", "neutral_out", "pe_in", "pe_out"];
var hasMainsFunction = (handle) => mainsFunctions.some((fn) => hasFunction3(handle, fn));
var hasAnyConnectedEdge = (handles) => handles.some((handle) => handle.connectedEdges.length > 0);
var issueTargetsForInvalidWire = (invalidWire) => [
  edgeTarget2(invalidWire.edge),
  ...invalidWire.node ? [nodeTarget2(invalidWire.node)] : []
];
var checkWireConnectedToHiddenOrMissingHandle = (context) => context.invalidWires.map((invalidWire) => translatedIssue2(
  "network-rules",
  "wireConnectedToHiddenOrMissingHandle",
  `wire-connected-to-hidden-or-missing-handle-${invalidWire.edge.id}-${invalidWire.side}`,
  "error",
  {
    wire: invalidWire.edge.id,
    side: invalidWire.side,
    handle: invalidWire.handleId || "unknown",
    reason: checkText2(`invalidWireReasons.${invalidWire.reason}`)
  },
  issueTargetsForInvalidWire(invalidWire),
  edgeIssueOptions(invalidWire.edge, "wire-connected-to-hidden-or-missing-handle", 90, 10)
));
var checkDuplicateParallelWires = (context) => {
  const groups = /* @__PURE__ */ new Map();
  context.edges.forEach((edge) => {
    const a = `${edge.source}:${edge.sourceHandle || ""}`;
    const b = `${edge.target}:${edge.targetHandle || ""}`;
    const key = [a, b].sort().join("<->");
    groups.set(key, [...groups.get(key) || [], edge]);
  });
  return Array.from(groups.values()).filter((edges) => edges.length > 1).map((edges) => translatedIssue2(
    "network-rules",
    "duplicateParallelWire",
    `duplicate-parallel-wire-${edges.map((edge) => edge.id).sort().join("-")}`,
    "info",
    { count: edges.length },
    edges.map(edgeTarget2),
    edgeIssueOptions(edges[0], "duplicate-parallel-wire", 35, 170)
  ));
};
var checkWireWithoutPhysicalParameters = (context) => context.componentLinkedNets.filter((net) => netHasAnyClassification(net, ["suppl_net_type", "gnd_net_type", "usb_net_type"])).flatMap((net) => net.edges.map((edge) => ({ net, edge }))).filter(({ edge }) => (edge.data?.physType === "single" || edge.data?.physType === "usb") && (typeof edge.data?.physLength !== "number" || edge.data.physLength <= 0 || typeof edge.data?.physCrosssection !== "number" || edge.data.physCrosssection <= 0)).map(({ edge }) => translatedIssue2(
  "network-rules",
  "wireWithoutPhysicalParameters",
  `wire-without-physical-parameters-${edge.id}`,
  "warning",
  void 0,
  [edgeTarget2(edge)],
  edgeIssueOptions(edge, "wire-without-physical-parameters", 40, 150, {
    suppressedBy: ["wire-connected-to-hidden-or-missing-handle"]
  })
));
var checkMainsWireConnectedToLowVoltageComponent = (context) => context.componentLinkedNets.filter((net) => netHasAnyClassification(net, ["L_net_type", "N_net_type", "PE_net_type"])).flatMap((net) => net.handles.filter((handle) => !hasMainsFunction(handle)).filter((handle) => isTechnicalComponent(handle.node)).filter((handle) => !isPassiveConnectorComponent(handle.node)).map((handle) => ({ net, handle }))).map(({ net, handle }) => translatedIssue2(
  "network-rules",
  "mainsWireConnectedToLowVoltageComponent",
  `mains-wire-connected-to-low-voltage-component-${handle.key}`,
  "error",
  { component: handle.node.data.technicalID || handle.node.id, handle: describeHandle(handle) },
  [
    ...handleTargets2(handle),
    ...netTargets2(net)
  ],
  handleIssueOptions(handle, "mains-wire-connected-to-low-voltage-component", 95, 4, {
    suppresses: ["mixed-classification"]
  })
));
var checkGroundAndSupplyPolaritySwapped = (net) => translatedIssue2(
  "network-rules",
  "groundAndSupplyPolaritySwapped",
  `network-ground-and-supply-polarity-swapped-${net.id}`,
  "error",
  void 0,
  netTargets2(net),
  netIssueOptions(net, "polarity-ground-supply", 95, 8, {
    suppresses: ["mixed-classification", "supply-input-without-source", "supply-source-without-consumer"]
  })
);
var checkSupplyVoltageUnknown = (context, net) => {
  const sources = independentSupplySources(context, net);
  if (sources.length !== 1) return void 0;
  if (context.resolveVoltageOut(sources[0].handles[0]) !== void 0) return void 0;
  const supplyInputs = handlesWithAnyFunction(net.handles, ["suppl_in"]).filter((handle) => !isUsbFull(handle));
  if (supplyInputs.length === 0) return void 0;
  return translatedIssue2(
    "network-rules",
    "supplyVoltageUnknown",
    `network-supply-voltage-unknown-${net.id}`,
    "warning",
    { source: sources[0].handles.map(describeHandle).join(", ") },
    [
      ...netTargets2(net),
      ...supplyInputs.flatMap(handleTargets2),
      ...sources[0].handles.flatMap(handleTargets2)
    ],
    netIssueOptions(net, "supply-voltage-unknown", 55, 95, {
      suppressedBy: ["supply-voltage-mismatch", "multiple-supply-sources"]
    })
  );
};
var checkFuseBypassed = (context) => context.nodes.flatMap((node) => (node.data.internalConnections || []).filter((connection) => connection.kind === "fuse").flatMap((connection) => {
  const fromHandle = context.getHandle(node.id, connection.fromHandle);
  const toHandle = context.getHandle(node.id, connection.toHandle);
  if (!fromHandle || !toHandle) return [];
  const fromNet = context.getComponentLinkedElementaryBasedNetByHandle(fromHandle);
  const toNet = context.getComponentLinkedElementaryBasedNetByHandle(toHandle);
  if (!fromNet || !toNet || fromNet.id !== toNet.id) return [];
  return [translatedIssue2(
    "network-rules",
    "fuseBypassed",
    `fuse-bypassed-${node.id}-${connection.fromHandle}-${connection.toHandle}`,
    "error",
    { component: node.data.technicalID || node.id },
    [
      nodeTarget2(node),
      ...netTargets2(fromNet)
    ],
    netIssueOptions(fromNet, "fuse-bypassed", 90, 18, {
      suppresses: ["duplicate-parallel-wire"]
    })
  )];
}));
var digitalDataIn = (handles) => handles.find((handle) => hasFunction3(handle, "dig_in"));
var digitalBackupIn = (handles) => handles.find((handle) => hasFunction3(handle, "dig_backup_in"));
var digitalClockIn = (handles) => handles.find((handle) => hasFunction3(handle, "dig_clock_in"));
var ledInputGroupKey = (handleId) => {
  const repeatedMiddleMatch = handleId.match(/_middle_\d+$/);
  if (repeatedMiddleMatch) return repeatedMiddleMatch[0].slice(1);
  const fixedPositionMatch = handleId.match(/_(start|end)$/);
  return fixedPositionMatch ? fixedPositionMatch[1] : void 0;
};
var ledUpstreamDataSource = (context, dataIn) => {
  const sources = digitalSignalSourcesForInput(context, dataIn).filter((source) => source.node.id !== dataIn.node.id).filter((source) => source.node.data.group === "led").filter((source) => hasFunction3(source, "dig_out"));
  return sources.length === 1 ? sources[0] : void 0;
};
var isFirstLedBackupInputTiedToGround = (context, handle) => {
  if (handle.node.data.group !== "led" || !hasFunction3(handle, "dig_backup_in")) return false;
  const backupNet = context.getNetByHandle(handle);
  if (!backupNet?.classifications.includes("gnd_net_type")) return false;
  const nodeHandles = context.handles.filter((candidate) => candidate.node.id === handle.node.id);
  const dataIn = digitalDataIn(nodeHandles);
  return Boolean(dataIn && !ledUpstreamDataSource(context, dataIn));
};
var hasResolvedDigitalSink = (context, handle) => hasReachableDigitalSource(context, handle) || hasValidDigitalBias(context, handle) || isFirstLedBackupInputTiedToGround(context, handle);
var checkDigitalBackupPairMismatch = (context) => {
  const issues = [];
  handlesByNode2(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.group !== "led") return;
    const dataIn = digitalDataIn(nodeHandles);
    const backupIn = digitalBackupIn(nodeHandles);
    if (!dataIn || !backupIn) return;
    const backupNet = context.getNetByHandle(backupIn);
    const upstreamData = ledUpstreamDataSource(context, dataIn);
    if (upstreamData) {
      const upstreamBackupOut = context.handles.find((handle) => handle.node.id === upstreamData.node.id && hasFunction3(handle, "dig_backup_out"));
      const hasMatchingBackup = Boolean(upstreamBackupOut && backupNet?.handles.some((handle) => handle.key === upstreamBackupOut.key));
      if (hasMatchingBackup) return;
      issues.push(translatedIssue2(
        "network-rules",
        "digitalBackupPairMismatch",
        `digital-backup-pair-mismatch-${backupIn.key}`,
        "error",
        {
          component: node.data.technicalID || node.id,
          source: upstreamData.node.data.technicalID || upstreamData.node.id
        },
        [
          ...handleTargets2(dataIn),
          ...handleTargets2(backupIn),
          ...handleTargets2(upstreamData),
          ...upstreamBackupOut ? handleTargets2(upstreamBackupOut) : []
        ],
        handleIssueOptions(backupIn, "digital-backup-pair-mismatch", 75, 70, {
          suppresses: ["digital-sink-without-source"]
        })
      ));
      return;
    }
    if (backupNet?.classifications.includes("gnd_net_type")) return;
    const dataNet = context.getNetByHandle(dataIn);
    const backupInDataNet = Boolean(dataNet && backupNet && dataNet.id === backupNet.id);
    issues.push(translatedIssue2(
      "network-rules",
      backupInDataNet ? "digitalBackupInputTiedToData" : "digitalBackupInputNotGrounded",
      backupInDataNet ? `digital-backup-input-tied-to-data-${backupIn.key}` : `digital-backup-input-not-grounded-${backupIn.key}`,
      backupInDataNet ? "warning" : "error",
      { component: node.data.technicalID || node.id },
      [
        ...handleTargets2(dataIn),
        ...handleTargets2(backupIn)
      ],
      handleIssueOptions(
        backupIn,
        backupInDataNet ? "digital-backup-input-tied-to-data" : "digital-backup-input-not-grounded",
        75,
        70
      )
    ));
  });
  return issues;
};
var checkClockedLedClockMissing = (context) => {
  const issues = [];
  handlesByNode2(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.group !== "led") return;
    const dataIn = digitalDataIn(nodeHandles);
    const clockIn = digitalClockIn(nodeHandles);
    if (!dataIn || !clockIn || dataIn.connectedEdges.length === 0) return;
    const upstreamData = ledUpstreamDataSource(context, dataIn);
    if (upstreamData) {
      const upstreamClockOut = context.handles.find((handle) => handle.node.id === upstreamData.node.id && hasFunction3(handle, "dig_clock_out"));
      const clockNet = context.getNetByHandle(clockIn);
      const hasMatchingClock = Boolean(upstreamClockOut && clockNet?.handles.some((handle) => handle.key === upstreamClockOut.key));
      if (hasMatchingClock) return;
      issues.push(translatedIssue2(
        "network-rules",
        "clockedLedClockMissing",
        `clocked-led-clock-missing-${clockIn.key}`,
        "error",
        { component: node.data.technicalID || node.id },
        [
          ...handleTargets2(dataIn),
          ...handleTargets2(clockIn),
          ...handleTargets2(upstreamData),
          ...upstreamClockOut ? handleTargets2(upstreamClockOut) : []
        ],
        handleIssueOptions(clockIn, "clocked-led-clock-missing", 85, 46, {
          suppresses: ["digital-sink-without-source"]
        })
      ));
      return;
    }
    if (hasResolvedDigitalSink(context, clockIn)) return;
    issues.push(translatedIssue2(
      "network-rules",
      "clockedLedClockMissing",
      `clocked-led-clock-missing-${clockIn.key}`,
      "error",
      { component: node.data.technicalID || node.id },
      [
        ...handleTargets2(dataIn),
        ...handleTargets2(clockIn)
      ],
      handleIssueOptions(clockIn, "clocked-led-clock-missing", 85, 46, {
        suppresses: ["digital-sink-without-source"]
      })
    ));
  });
  return issues;
};
var checkDigitalLedSignalGroupGroundMissing = (context) => {
  const issues = [];
  handlesByNode2(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.group !== "led") return;
    const digitalSignalInputs = nodeHandles.filter((handle) => (hasFunction3(handle, "dig_in") || hasFunction3(handle, "dig_clock_in")) && handle.connectedEdges.length > 0);
    if (digitalSignalInputs.length === 0) return;
    const gndHandlesByGroup = /* @__PURE__ */ new Map();
    handlesWithAnyFunction(nodeHandles, ["gnd"]).forEach((handle) => {
      const groupKey = ledInputGroupKey(handle.handle.hid);
      if (!groupKey) return;
      gndHandlesByGroup.set(groupKey, [...gndHandlesByGroup.get(groupKey) || [], handle]);
    });
    const signalInputsByGroup = /* @__PURE__ */ new Map();
    digitalSignalInputs.forEach((handle) => {
      const groupKey = ledInputGroupKey(handle.handle.hid);
      if (!groupKey) return;
      signalInputsByGroup.set(groupKey, [...signalInputsByGroup.get(groupKey) || [], handle]);
    });
    signalInputsByGroup.forEach((signalInputs, groupKey) => {
      const gndHandles = gndHandlesByGroup.get(groupKey) || [];
      const hasConnectedGroupGround = gndHandles.some((handle) => handle.connectedEdges.length > 0);
      if (hasConnectedGroupGround) return;
      issues.push(translatedIssue2(
        "component-rules",
        "digitalLedSignalGroupGroundMissing",
        `digital-led-signal-group-ground-missing-${node.id}-${groupKey}`,
        "error",
        {
          component: node.data.technicalID || node.data.name || node.id,
          group: groupKey,
          signals: signalInputs.map(describeHandle).join(", ")
        },
        [
          nodeTarget2(node),
          ...signalInputs.flatMap(handleTargets2),
          ...gndHandles.flatMap(handleTargets2)
        ],
        {
          priority: 47,
          specificity: 85,
          fingerprint: {
            scope: "component",
            key: `${node.id}:${groupKey}`,
            problem: "digital-led-signal-group-ground-missing"
          },
          suppressedBy: ["ground-missing"]
        }
      ));
    });
  });
  return issues;
};
var checkSignalOutputWithoutConsumer = (context) => context.componentLinkedNets.flatMap((net) => signalRuleDefinitions.flatMap((definition) => {
  if (!net.classifications.includes(definition.classification)) return [];
  const sources = handlesWithAnyFunction(net.sourceHandles, definition.sourceFunctions);
  return sources.filter((source) => source.connectedEdges.length > 0).filter((source) => !context.signalReachableHandles(source).some((candidate) => candidate.key !== source.key && definition.sinkFunctions.some((fn) => hasFunction3(candidate, fn)))).map((source) => translatedIssue2(
    "network-rules",
    "signalOutputWithoutConsumer",
    `signal-output-without-consumer-${source.key}`,
    "warning",
    { signal: signalLabel(definition.id), source: describeHandle(source) },
    [
      ...handleTargets2(source),
      ...netTargets2(net)
    ],
    handleIssueOptions(source, `${definition.id}-output-without-consumer`, 50, 125, {
      suppressedBy: ["data-direction-wrong", "mixed-digital-signal-types"]
    })
  ));
}));
var checkDataDirectionWrong = (context) => context.componentLinkedNets.filter((net) => net.classifications.includes("digital_net_type")).flatMap((net) => {
  const dataSources = handlesWithAnyFunction(net.handles, ["dig_out"]);
  const dataSinks = handlesWithAnyFunction(net.handles, ["dig_in"]);
  if (dataSources.length > 1 && dataSinks.length === 0) {
    return [translatedIssue2(
      "network-rules",
      "dataDirectionWrong",
      `data-direction-wrong-output-only-${net.id}`,
      "error",
      { handles: dataSources.map(describeHandle).join(", ") },
      [
        ...netTargets2(net),
        ...dataSources.flatMap(handleTargets2)
      ],
      netIssueOptions(net, "data-direction-wrong", 80, 48, {
        suppresses: ["multiple-digital-sources", "digital-output-without-consumer"]
      })
    )];
  }
  if (dataSources.length === 0 && dataSinks.length > 1) {
    return [translatedIssue2(
      "network-rules",
      "dataDirectionWrong",
      `data-direction-wrong-input-only-${net.id}`,
      "error",
      { handles: dataSinks.map(describeHandle).join(", ") },
      [
        ...netTargets2(net),
        ...dataSinks.flatMap(handleTargets2)
      ],
      netIssueOptions(net, "data-direction-wrong", 80, 48, {
        suppresses: ["digital-sink-without-source"]
      })
    )];
  }
  return [];
});
var shortConnectedHandles = (nodeHandles, startHandleId) => {
  const handles = new Map(nodeHandles.map((handle) => [handle.handle.hid, handle]));
  const node = nodeHandles[0]?.node;
  const visited = /* @__PURE__ */ new Set();
  const queue = [startHandleId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    (node?.data.internalConnections || []).filter((connection) => connection.kind === "short").flatMap((connection) => {
      if (connection.fromHandle === current) return [connection.toHandle];
      if (connection.toHandle === current) return [connection.fromHandle];
      return [];
    }).filter((handleId) => !visited.has(handleId)).forEach((handleId) => queue.push(handleId));
  }
  return Array.from(visited.values()).map((handleId) => handles.get(handleId)).filter((handle) => Boolean(handle));
};
var checkControlledOutputWithoutControlInput = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node) return [];
  return nodeHandles.filter((output) => Boolean(output.handle.controllableBy) && output.connectedEdges.length > 0 && Boolean(context.getNetByHandle(output))).flatMap((output) => {
    const controlHandleId = output.handle.controllableBy;
    if (!controlHandleId) return [];
    const controlHandles = shortConnectedHandles(nodeHandles, controlHandleId);
    const hasDigitalControl = controlHandles.some((control) => handleNetHasClassification(context, control, "digital_net_type"));
    if (hasDigitalControl) return [];
    const controlLabel = controlHandles.length > 0 ? controlHandles.map(describeHandle).join(", ") : controlHandleId;
    const controlNetTargets = controlHandles.map((control) => context.getNetByHandle(control)).filter((net) => Boolean(net)).flatMap(netTargets2);
    return [translatedIssue2(
      "component-rules",
      "controlledOutputWithoutControlInput",
      `controlled-output-without-control-input-${output.key}`,
      "error",
      {
        component: node.data.technicalID || node.data.name || node.id,
        output: describeHandle(output),
        control: controlLabel
      },
      [
        nodeTarget2(node),
        ...handleTargets2(output),
        ...controlHandles.flatMap(handleTargets2),
        ...controlNetTargets
      ],
      handleIssueOptions(output, "controlled-output-without-control-input", 85, 52)
    )];
  });
});
var isAnalogLedStrip = (node) => node.data.group === "led" && node.data.technicalID.startsWith("AN_");
var checkAnalogLedColorChannelUnconnected = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node || !isAnalogLedStrip(node) || !hasAnyConnectedEdge(nodeHandles)) return [];
  return analogLedColorChannels.flatMap((channel) => {
    const channelHandles = handlesWithAnyFunction(nodeHandles, [channel.fn]);
    if (channelHandles.length === 0) return [];
    if (channelHandles.some((handle) => handle.connectedEdges.length > 0)) return [];
    return [translatedIssue2(
      "component-rules",
      "analogLedColorChannelUnconnected",
      `analog-led-color-channel-unconnected-${node.id}-${channel.id}`,
      "warning",
      {
        component: node.data.technicalID || node.data.name || node.id,
        color: analogLedColorLabel(channel.id),
        handles: channelHandles.map(describeHandle).join(", ")
      },
      [
        nodeTarget2(node),
        ...channelHandles.flatMap(handleTargets2)
      ],
      {
        priority: 85,
        specificity: 70,
        fingerprint: {
          scope: "component",
          key: `${node.id}:${channel.id}`,
          problem: "analog-led-color-channel-unconnected"
        }
      }
    )];
  });
});
var pwmSourceHandlesForChannelHandle = (context, handle) => context.getNetByHandle(handle)?.sourceHandles.filter((source) => hasFunction3(source, "pwm_out")) || [];
var checkAnalogLedColorChannelMultiplePwmSignals = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node || !isAnalogLedStrip(node)) return [];
  return analogLedColorChannels.flatMap((channel) => {
    const channelHandles = handlesWithAnyFunction(nodeHandles, [channel.fn]);
    const connectedChannelHandles = channelHandles.filter((handle) => handle.connectedEdges.length > 0);
    if (connectedChannelHandles.length === 0) return [];
    const pwmSourcesByKey = /* @__PURE__ */ new Map();
    const affectedNetsById = /* @__PURE__ */ new Map();
    connectedChannelHandles.forEach((handle) => {
      const net = context.getNetByHandle(handle);
      if (net) affectedNetsById.set(net.id, net);
      pwmSourceHandlesForChannelHandle(context, handle).forEach((source) => {
        pwmSourcesByKey.set(source.key, source);
      });
    });
    const pwmSources = Array.from(pwmSourcesByKey.values());
    if (pwmSources.length <= 1) return [];
    return [translatedIssue2(
      "component-rules",
      "analogLedColorChannelMultiplePwmSignals",
      `analog-led-color-channel-multiple-pwm-signals-${node.id}-${channel.id}`,
      "error",
      {
        component: node.data.technicalID || node.data.name || node.id,
        color: analogLedColorLabel(channel.id),
        signals: pwmSources.map(describeHandle).join(", "),
        handles: connectedChannelHandles.map(describeHandle).join(", ")
      },
      [
        nodeTarget2(node),
        ...connectedChannelHandles.flatMap(handleTargets2),
        ...pwmSources.flatMap(handleTargets2),
        ...Array.from(affectedNetsById.values()).flatMap(netTargets2)
      ],
      {
        priority: 44,
        specificity: 90,
        fingerprint: {
          scope: "component",
          key: `${node.id}:${channel.id}`,
          problem: "analog-led-color-channel-multiple-pwm-signals"
        },
        suppresses: ["multiple-pwm-sources"]
      }
    )];
  });
});
var fuseNominalValueIsMissing = (node, fieldId) => {
  if (!fieldId) return true;
  const inputValue = node.data.inputFields?.find((field) => field.technicalID === fieldId)?.value;
  if (typeof inputValue === "number" && inputValue > 0) return false;
  const selectValue = node.data.selectFields?.find((field) => field.technicalID === fieldId)?.selectedValue;
  return !(typeof selectValue === "number" && selectValue > 0);
};
var checkFuseCurrentMissingOrUnderspecified = (context) => context.nodes.flatMap((node) => {
  const fuseConnections = (node.data.internalConnections || []).filter((connection) => connection.kind === "fuse");
  if (fuseConnections.length === 0) return [];
  const missingConnections = fuseConnections.filter((connection) => typeof connection.nominalCurrent !== "number" && fuseNominalValueIsMissing(node, connection.nominalCurrentField || connection.fuseId));
  if (missingConnections.length === 0) return [];
  return [translatedIssue2(
    "component-rules",
    "fuseCurrentMissingOrUnderspecified",
    `fuse-current-missing-or-underspecified-${node.id}`,
    "info",
    { component: node.data.technicalID || node.id },
    [nodeTarget2(node)],
    componentIssueOptions(node, "fuse-current-missing-or-underspecified", 45, 160)
  )];
});
var checkComponentHasOnlyOneTerminalConnected = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node || !isTechnicalComponent(node) || isPassiveConnectorComponent(node)) return [];
  if (!["Resistor", "Kerko", "Elko", "miniOTOFuse"].includes(node.data.technicalID)) return [];
  if (nodeHandles.length !== 2) return [];
  const connectedHandles = nodeHandles.filter((handle) => handle.connectedEdges.length > 0);
  if (connectedHandles.length !== 1) return [];
  return [translatedIssue2(
    "component-rules",
    "componentHasOnlyOneTerminalConnected",
    `component-has-only-one-terminal-connected-${node.id}`,
    "warning",
    { component: node.data.technicalID || node.id, handle: describeHandle(connectedHandles[0]) },
    [
      nodeTarget2(node),
      ...nodeHandles.flatMap(handleTargets2)
    ],
    componentIssueOptions(node, "component-has-only-one-terminal-connected", 65, 110, {
      suppressedBy: ["required-pin-unconnected"]
    })
  )];
});
var checkCapacitorPolarityMismatch = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node || node.data.technicalID !== "Elko") return [];
  const plus = nodeHandles.find((handle) => handle.handle.hid.toLowerCase().includes("plus"));
  const minus = nodeHandles.find((handle) => handle.handle.hid.toLowerCase().includes("minus"));
  if (!plus || !minus) return [];
  const plusNet = context.getNetByHandle(plus);
  const minusNet = context.getNetByHandle(minus);
  const plusWrong = plusNet?.classifications.includes("gnd_net_type") || false;
  const minusWrong = minusNet?.classifications.includes("suppl_net_type") || false;
  if (!plusWrong && !minusWrong) return [];
  return [translatedIssue2(
    "component-rules",
    "capacitorPolarityMismatch",
    `capacitor-polarity-mismatch-${node.id}`,
    "error",
    { component: node.data.technicalID || node.id },
    [
      nodeTarget2(node),
      ...handleTargets2(plus),
      ...handleTargets2(minus)
    ],
    componentIssueOptions(node, "capacitor-polarity-mismatch", 90, 34, {
      suppresses: ["mixed-classification"]
    })
  )];
});
var checkMainsConnectorIncomplete = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node) return [];
  const lineHandles = handlesWithAnyFunction(nodeHandles, ["line_in"]);
  const neutralHandles = handlesWithAnyFunction(nodeHandles, ["neutral_in"]);
  if (lineHandles.length === 0 || neutralHandles.length === 0) return [];
  const lineOk = lineHandles.some((handle) => handleNetHasClassification(context, handle, "L_net_type"));
  const neutralOk = neutralHandles.some((handle) => handleNetHasClassification(context, handle, "N_net_type"));
  if (lineOk === neutralOk) return [];
  return [translatedIssue2(
    "component-rules",
    "mainsConnectorIncomplete",
    `mains-connector-incomplete-${node.id}`,
    "error",
    { component: node.data.technicalID || node.id },
    [
      nodeTarget2(node),
      ...lineHandles.flatMap(handleTargets2),
      ...neutralHandles.flatMap(handleTargets2)
    ],
    componentIssueOptions(node, "mains-connector-incomplete", 75, 14, {
      suppresses: ["mains-input-missing"]
    })
  )];
});
var checkProtectiveEarthMissingForMetalOrMainsDevice = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node) return [];
  const peHandles = handlesWithAnyFunction(nodeHandles, ["pe_in"]);
  if (peHandles.length === 0) return [];
  const mainsUsed = handlesWithAnyFunction(nodeHandles, ["line_in", "neutral_in"]).some((handle) => handle.connectedEdges.length > 0 || handleNetHasClassification(context, handle, "L_net_type") || handleNetHasClassification(context, handle, "N_net_type"));
  if (!mainsUsed) return [];
  const peOk = peHandles.some((handle) => handleNetHasClassification(context, handle, "PE_net_type"));
  if (peOk) return [];
  return [translatedIssue2(
    "component-rules",
    "protectiveEarthMissingForMetalOrMainsDevice",
    `protective-earth-missing-${node.id}`,
    "error",
    { component: node.data.technicalID || node.id },
    [
      nodeTarget2(node),
      ...peHandles.flatMap(handleTargets2)
    ],
    componentIssueOptions(node, "protective-earth-missing", 80, 16, {
      suppresses: ["mains-input-missing"]
    })
  )];
});
var checkIsolatedComponent = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node || !isTechnicalComponent(node)) return [];
  if (hasAnyConnectedEdge(nodeHandles)) return [];
  return [translatedIssue2(
    "component-rules",
    "isolatedComponent",
    `isolated-component-${node.id}`,
    "info",
    { component: node.data.technicalID || node.id },
    [nodeTarget2(node)],
    componentIssueOptions(node, "isolated-component", 30, 180)
  )];
});
var hasCheckRelevantFunction = (handle) => handle.functions.some((fn) => fn !== "unknown" && fn !== "not_connected");
var checkComponentDefinitionIncompleteForChecks = (context) => context.handles.filter((handle) => handle.rawFunctions.length === 0 || hasFunction3(handle, "suppl_in") && (handle.voltageMin === void 0 || handle.voltageMax === void 0) || (hasFunction3(handle, "suppl_out") || hasFunction3(handle, "dig_out") || hasFunction3(handle, "dig_clock_out") || hasFunction3(handle, "dig_backup_out")) && context.resolveVoltageOut(handle) === void 0).map((handle) => translatedIssue2(
  "component-rules",
  "componentDefinitionIncompleteForChecks",
  `component-definition-incomplete-for-checks-${handle.key}`,
  "info",
  { component: handle.node.data.technicalID || handle.node.id, handle: describeHandle(handle) },
  handleTargets2(handle),
  handleIssueOptions(handle, "component-definition-incomplete-for-checks", 60, 900, {
    diagnosticOnly: true
  })
));
var allowedMultiFunctionSets = /* @__PURE__ */ new Set([
  ["dig_in", "dig_out"].sort().join("|"),
  ["dig_in", "an_in"].sort().join("|")
]);
var checkAmbiguousMultiFunctionHandle = (context) => context.handles.filter((handle) => handle.functions.filter((fn) => fn !== "unknown").length > 1).filter(hasCheckRelevantFunction).filter((handle) => !allowedMultiFunctionSets.has(handle.functions.slice().sort().join("|"))).map((handle) => translatedIssue2(
  "component-rules",
  "ambiguousMultiFunctionHandle",
  `ambiguous-multi-function-handle-${handle.key}`,
  "info",
  {
    handle: describeHandle(handle),
    functions: handle.functions.join(", ")
  },
  handleTargets2(handle),
  handleIssueOptions(handle, "ambiguous-multi-function-handle", 60, 910, {
    diagnosticOnly: true
  })
));
var checkUnusedRequiredFunctionalGroup = (context) => Array.from(handlesByNode2(context).values()).flatMap((nodeHandles) => {
  const node = nodeHandles[0]?.node;
  if (!node || node.data.group !== "led") return [];
  const dataIn = digitalDataIn(nodeHandles);
  const hasLedInputUse = Boolean(dataIn && dataIn.connectedEdges.length > 0);
  if (!hasLedInputUse) return [];
  const supplyInputs = handlesWithAnyFunction(nodeHandles, ["suppl_in"]);
  const gndInputs = handlesWithAnyFunction(nodeHandles, ["gnd"]);
  const missingRequired = [
    ...!supplyInputs.some((handle) => handle.connectedEdges.length > 0 || handleNetHasClassification(context, handle, "suppl_net_type")) ? supplyInputs : [],
    ...!gndInputs.some((handle) => handle.connectedEdges.length > 0 || handleNetHasClassification(context, handle, "gnd_net_type")) ? gndInputs : []
  ];
  if (missingRequired.length === 0) return [];
  return [translatedIssue2(
    "component-rules",
    "unusedRequiredFunctionalGroup",
    `unused-required-functional-group-${node.id}`,
    "warning",
    { component: node.data.technicalID || node.id },
    [
      nodeTarget2(node),
      ...dataIn ? handleTargets2(dataIn) : [],
      ...missingRequired.flatMap(handleTargets2)
    ],
    componentIssueOptions(node, "unused-required-functional-group", 80, 75, {
      suppresses: ["power-missing", "ground-missing"]
    })
  )];
});
var runNetworkRules = (context) => {
  const issues = [
    ...checkWireConnectedToHiddenOrMissingHandle(context),
    ...checkDuplicateParallelWires(context),
    ...checkWireWithoutPhysicalParameters(context),
    ...checkMainsWireConnectedToLowVoltageComponent(context),
    ...checkFuseBypassed(context)
  ];
  const priorityBlockedNetIds = /* @__PURE__ */ new Set();
  const componentLinkedNets = context.componentLinkedNets;
  const gndHandles = context.handles.filter((handle) => hasFunction3(handle, "gnd"));
  const gndNets = componentLinkedNets.filter((net) => net.classifications.includes("gnd_net_type"));
  const gndHandlesWithoutUsbPower = gndHandles.filter((handle) => !nodeHasValidUsbPowerConnection(context, handle.node.id) && !nodeHasInvalidUsbPowerConnection(context, handle.node.id));
  if (gndHandlesWithoutUsbPower.length > 0 && gndNets.length === 0) {
    issues.push(translatedIssue2(
      "network-rules",
      "groundMissing",
      "network-ground-missing",
      "error",
      void 0,
      gndHandlesWithoutUsbPower.flatMap(handleTargets2),
      diagramIssueOptions("ground-missing", 50, 30)
    ));
  }
  if (gndNets.length >= 2) {
    gndNets.forEach((net) => priorityBlockedNetIds.add(net.id));
    issues.push(translatedIssue2(
      "network-rules",
      "groundMultiple",
      "network-ground-multiple",
      "error",
      { count: gndNets.length },
      gndNets.flatMap(netTargets2),
      diagramIssueOptions("ground-multiple", 70, 20)
    ));
  }
  componentLinkedNets.filter((net) => net.classifications.includes("gnd_net_type") && net.classifications.includes("suppl_net_type")).forEach((net) => {
    priorityBlockedNetIds.add(net.id);
    issues.push(checkGroundAndSupplyPolaritySwapped(net));
  });
  componentLinkedNets.filter((net) => netHasAnyClassification(net, ["L_net_type", "N_net_type"]) && netHasAnyClassification(net, lowVoltageOrSignalClassifications)).forEach((net) => {
    priorityBlockedNetIds.add(net.id);
    issues.push(translatedIssue2(
      "network-rules",
      "mainsLowVoltageMixed",
      `network-mains-low-voltage-mixed-${net.id}`,
      "error",
      { classifications: net.classifications.map(classificationLabel).join(", ") },
      netTargets2(net),
      netIssueOptions(net, "mains-low-voltage-mixed", 90, 5, {
        suppresses: ["mixed-classification"]
      })
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.includes("PE_net_type") && netHasAnyClassification(net, activeOrSignalClassifications)).forEach((net) => {
    priorityBlockedNetIds.add(net.id);
    issues.push(translatedIssue2(
      "network-rules",
      "peActiveMixed",
      `network-pe-active-mixed-${net.id}`,
      "error",
      { classifications: net.classifications.map(classificationLabel).join(", ") },
      netTargets2(net),
      netIssueOptions(net, "pe-active-mixed", 90, 6, {
        suppresses: ["mixed-classification"]
      })
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.includes("rs485_a_net_type") && net.classifications.includes("rs485_b_net_type")).forEach((net) => {
    priorityBlockedNetIds.add(net.id);
    issues.push(translatedIssue2(
      "network-rules",
      "rs485Mixed",
      `network-rs485-a-b-mixed-${net.id}`,
      "error",
      void 0,
      netTargets2(net),
      netIssueOptions(net, "rs485-mixed", 80, 25, {
        suppresses: ["mixed-classification"]
      })
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.includes("usb_net_type")).forEach((net) => {
    const reasons = usbPowerPairInvalidReasons(net);
    if (reasons.length === 0) return;
    priorityBlockedNetIds.add(net.id);
    issues.push(translatedIssue2(
      "network-rules",
      "usbPowerPairInvalid",
      `network-usb-power-pair-invalid-${net.id}`,
      "error",
      {
        reason: reasons.join("; ")
      },
      netTargets2(net),
      netIssueOptions(net, "usb-power-pair-invalid", 80, 39, {
        suppresses: ["usb-sink-without-source", "multiple-usb-sources", "mixed-classification"]
      })
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.length > 1).filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    priorityBlockedNetIds.add(net.id);
    issues.push(translatedIssue2(
      "network-rules",
      "mixedClassifications",
      `network-mixed-classifications-${net.id}`,
      "error",
      { classifications: net.classifications.map(classificationLabel).join(", ") },
      netTargets2(net),
      netIssueOptions(net, "mixed-classification", 20, 80, {
        suppressedBy: ["mains-low-voltage-mixed", "pe-active-mixed", "rs485-mixed"]
      })
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.includes("suppl_net_type")).filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    const sources = independentSupplySources(context, net);
    if (sources.length <= 1) return;
    issues.push(translatedIssue2(
      "network-rules",
      "multipleSupplySources",
      `network-multiple-supply-sources-${net.id}`,
      "error",
      {
        count: sources.length,
        sources: sources.map((source) => source.handles.map(describeHandle).join(" / ")).join("; ")
      },
      [
        ...netTargets2(net),
        ...sources.flatMap((source) => source.handles.flatMap(handleTargets2))
      ],
      netIssueOptions(net, "multiple-supply-sources", 70, 35, {
        suppresses: ["supply-voltage-mismatch", "supply-source-without-consumer"]
      })
    ));
  });
  componentLinkedNets.filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    signalRuleDefinitions.forEach((definition) => {
      if (definition.id === "usb" && !net.classifications.includes("usb_net_type")) return;
      const sinks = handlesWithAnyFunction(net.handles, definition.sinkFunctions);
      const unresolvedSinks = definition.id === "digital" ? sinks.filter((handle) => !hasResolvedDigitalSink(context, handle)) : sinks;
      if (unresolvedSinks.length === 0 || net.classifications.includes(definition.classification)) return;
      issues.push(translatedIssue2(
        "network-rules",
        "signalSinkWithoutSource",
        `network-${definition.id}-sink-without-source-${net.id}`,
        "error",
        {
          signal: signalLabel(definition.id),
          sinks: unresolvedSinks.map(describeHandle).join(", ")
        },
        [
          ...netTargets2(net),
          ...unresolvedSinks.flatMap(handleTargets2)
        ],
        netIssueOptions(net, `${definition.id}-sink-without-source`, 60, 50, {
          suppressedBy: ["mixed-digital-signal-types", "data-direction-wrong"]
        })
      ));
    });
  });
  componentLinkedNets.filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    handlesWithAnyFunction(net.handles, digitalSinkFunctions).forEach((input) => {
      const sources = digitalSignalSourcesForInput(context, input);
      if (!shouldCheckDigitalSignalVoltage(net, sources)) return;
      const mismatches = sources.map((source) => ({
        source,
        voltage: context.resolveVoltageOut(source)
      })).map((source) => ({
        ...source,
        reason: digitalVoltageMismatchReason(source.voltage, input)
      })).filter((source) => source.reason !== void 0 && source.voltage !== void 0);
      if (mismatches.length === 0) return;
      const min = input.voltageMin ?? "?";
      const max = input.voltageMax ?? "?";
      const mismatchDescription = mismatches.map((mismatch) => `${describeHandle(mismatch.source)} (${mismatch.voltage} V)`).join(", ");
      issues.push(translatedIssue2(
        "network-rules",
        "digitalSignalVoltageMismatch",
        `network-digital-signal-voltage-mismatch-${input.key}`,
        "error",
        {
          input: describeHandle(input),
          min,
          max,
          sources: mismatchDescription
        },
        [
          ...handleTargets2(input),
          ...mismatches.flatMap((mismatch) => handleTargets2(mismatch.source))
        ],
        handleIssueOptions(input, "digital-signal-voltage-mismatch", 75, 45)
      ));
    });
  });
  componentLinkedNets.filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    signalRuleDefinitions.forEach((definition) => {
      if (!net.classifications.includes(definition.classification)) return;
      const sources = handlesWithAnyFunction(net.sourceHandles, definition.sourceFunctions);
      if (sources.length <= 1) return;
      issues.push(translatedIssue2(
        "network-rules",
        "multipleSignalSources",
        `network-multiple-${definition.id}-sources-${net.id}`,
        "error",
        {
          signal: signalLabel(definition.id),
          sources: sources.map(describeHandle).join(", ")
        },
        [
          ...netTargets2(net),
          ...sources.flatMap(handleTargets2)
        ],
        netIssueOptions(net, `multiple-${definition.id}-sources`, 65, 55, {
          suppressedBy: ["mixed-digital-signal-types", "data-direction-wrong"]
        })
      ));
    });
  });
  componentLinkedNets.filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    const supplyInputs = handlesWithAnyFunction(net.handles, ["suppl_in"]).filter((handle) => !isUsbFull(handle));
    const supplySources = net.classifications.includes("suppl_net_type") ? independentSupplySources(context, net) : [];
    if (supplyInputs.length > 0 && supplySources.length === 0) {
      issues.push(translatedIssue2(
        "network-rules",
        "supplyInputWithoutSource",
        `network-supply-input-without-source-${net.id}`,
        "error",
        { inputs: supplyInputs.map(describeHandle).join(", ") },
        [
          ...netTargets2(net),
          ...supplyInputs.flatMap(handleTargets2)
        ],
        netIssueOptions(net, "supply-input-without-source", 60, 40)
      ));
    }
    if (net.classifications.includes("suppl_net_type") && supplyInputs.length === 0 && !hasDigitalBiasConsumer(context, net)) {
      issues.push(translatedIssue2(
        "network-rules",
        "supplySourceWithoutConsumer",
        `network-supply-source-without-consumer-${net.id}`,
        "warning",
        void 0,
        netTargets2(net),
        netIssueOptions(net, "supply-source-without-consumer", 45, 120, {
          suppressedBy: [
            "mixed-classification",
            "mains-low-voltage-mixed",
            "pe-active-mixed",
            "multiple-supply-sources",
            "supply-voltage-mismatch"
          ]
        })
      ));
    }
  });
  componentLinkedNets.filter((net) => net.classifications.includes("suppl_net_type")).filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    const sources = independentSupplySources(context, net);
    if (sources.length !== 1) return;
    const sourceVoltage = context.resolveVoltageOut(sources[0].handles[0]);
    if (sourceVoltage === void 0) return;
    const mismatchedInputs = net.handles.filter((handle) => hasVoltageTolerance(handle)).filter((handle) => !isUsbFull(handle)).filter((handle) => !isPassiveConnectorComponent(handle.node)).filter((handle) => !voltageMatchesHandleTolerance(sourceVoltage, handle));
    if (mismatchedInputs.length === 0) return;
    issues.push(translatedIssue2(
      "network-rules",
      "supplyVoltageMismatch",
      `network-supply-voltage-mismatch-${net.id}`,
      "error",
      {
        voltage: sourceVoltage,
        inputs: mismatchedInputs.map(describeHandle).join(", ")
      },
      [
        ...netTargets2(net),
        ...sources[0].handles.flatMap(handleTargets2),
        ...mismatchedInputs.flatMap(handleTargets2)
      ],
      netIssueOptions(net, "supply-voltage-mismatch", 75, 42, {
        suppressedBy: ["multiple-supply-sources"]
      })
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.includes("usb_net_type")).filter((net) => !priorityBlockedNetIds.has(net.id)).filter(isValidUsbPowerPairNet).forEach((net) => {
    const source = usbPowerSources(net)[0];
    const sourceVoltage = context.resolveVoltageOut(source);
    if (sourceVoltage === void 0) return;
    const mismatchedInputs = usbPowerSinks(net).filter((handle) => hasVoltageTolerance(handle)).filter((handle) => !voltageMatchesHandleTolerance(sourceVoltage, handle));
    if (mismatchedInputs.length === 0) return;
    issues.push(translatedIssue2(
      "network-rules",
      "supplyVoltageMismatch",
      `network-usb-supply-voltage-mismatch-${net.id}`,
      "error",
      {
        voltage: sourceVoltage,
        inputs: mismatchedInputs.map(describeHandle).join(", ")
      },
      [
        ...netTargets2(net),
        ...handleTargets2(source),
        ...mismatchedInputs.flatMap(handleTargets2)
      ],
      netIssueOptions(net, "supply-voltage-mismatch", 75, 42)
    ));
  });
  componentLinkedNets.filter((net) => net.classifications.includes("suppl_net_type")).filter((net) => !priorityBlockedNetIds.has(net.id)).forEach((net) => {
    const issueForNet = checkSupplyVoltageUnknown(context, net);
    if (issueForNet) issues.push(issueForNet);
  });
  issues.push(
    ...checkClockedLedClockMissing(context),
    ...checkDigitalBackupPairMismatch(context),
    ...checkDataDirectionWrong(context),
    ...checkSignalOutputWithoutConsumer(context)
  );
  return issues;
};
var runComponentRules = (context) => {
  const issues = [];
  const mainsInputRequirements = [
    {
      id: "line",
      label: "Line",
      inputFunction: "line_in",
      classification: "L_net_type"
    },
    {
      id: "neutral",
      label: "Neutral",
      inputFunction: "neutral_in",
      classification: "N_net_type"
    },
    {
      id: "pe",
      label: "PE",
      inputFunction: "pe_in",
      classification: "PE_net_type"
    }
  ];
  handlesByNode2(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node) return;
    const requiredDisconnectedHandles = nodeHandles.filter((handle) => handle.handle.mustBeConnected === true && handle.connectedEdges.length === 0);
    if (requiredDisconnectedHandles.length > 0) {
      issues.push(translatedIssue2(
        "component-rules",
        "requiredPinUnconnected",
        `component-required-pin-unconnected-${node.id}`,
        "error",
        {
          component: node.data.technicalID || node.data.name || node.id,
          handles: requiredDisconnectedHandles.map(describeHandle).join(", ")
        },
        [
          nodeTarget2(node),
          ...requiredDisconnectedHandles.flatMap(handleTargets2)
        ],
        componentIssueOptions(node, "required-pin-unconnected", 70, 32)
      ));
    }
    const gndHandles = handlesWithAnyFunction(nodeHandles, ["gnd"]);
    const usbFullHandles = handlesWithAnyFunction(nodeHandles, ["usb_full"]);
    const hasUsbConnection = usbFullHandles.some((handle) => isValidUsbPowerPairNet(context.getNetByHandle(handle)));
    const hasInvalidUsbConnection = usbFullHandles.some((handle) => isInvalidUsbPowerPairNet(context.getNetByHandle(handle)));
    const hasGroundConnection = gndHandles.some((handle) => handleNetHasClassification(context, handle, "gnd_net_type"));
    if (gndHandles.length > 0 && !hasGroundConnection && !hasUsbConnection && !hasInvalidUsbConnection) {
      issues.push(translatedIssue2(
        "component-rules",
        "groundMissing",
        `component-ground-missing-${node.id}`,
        "error",
        { component: node.data.technicalID || node.data.name || node.id },
        [
          nodeTarget2(node),
          ...gndHandles.flatMap(handleTargets2)
        ],
        componentIssueOptions(node, "ground-missing", 55, 60)
      ));
    }
    const supplyInputHandles = nodeHandles.filter((handle) => hasFunction3(handle, "suppl_in") && !hasFunction3(handle, "usb_full"));
    const hasSupplyNeed = supplyInputHandles.length > 0 || usbFullHandles.length > 0;
    const hasSupplyConnection = supplyInputHandles.some((handle) => supplyInputHasExternalSource(context, handle));
    const connectedSupplyInputsWithoutSource = supplyInputHandles.filter((handle) => handle.connectedEdges.length > 0 && !supplyInputHasExternalSource(context, handle));
    const preferSupplyNetIssue = connectedSupplyInputsWithoutSource.length > 0 && !hasSupplyConnection && !hasUsbConnection && !hasInvalidUsbConnection;
    if (hasSupplyNeed && !hasSupplyConnection && !hasUsbConnection && !hasInvalidUsbConnection && !preferSupplyNetIssue) {
      issues.push(translatedIssue2(
        "component-rules",
        "powerMissing",
        `component-power-missing-${node.id}`,
        "error",
        { component: node.data.technicalID || node.data.name || node.id },
        [
          nodeTarget2(node),
          ...supplyInputHandles.flatMap(handleTargets2),
          ...usbFullHandles.flatMap(handleTargets2)
        ],
        componentIssueOptions(node, "power-missing", 55, 58)
      ));
    }
    mainsInputRequirements.forEach((requirement) => {
      const inputHandles = handlesWithAnyFunction(nodeHandles, [requirement.inputFunction]);
      const missingHandles = inputHandles.filter((handle) => !handleNetHasClassification(context, handle, requirement.classification));
      if (missingHandles.length === 0) return;
      issues.push(translatedIssue2(
        "component-rules",
        "mainsInputMissing",
        `component-${requirement.id}-input-missing-${node.id}`,
        "error",
        {
          component: node.data.technicalID || node.data.name || node.id,
          label: mainsInputLabel(requirement.id)
        },
        [
          nodeTarget2(node),
          ...missingHandles.flatMap(handleTargets2)
        ],
        {
          priority: 12,
          specificity: 70,
          fingerprint: {
            scope: "component",
            key: `${node.id}:${requirement.id}`,
            problem: "mains-input-missing"
          }
        }
      ));
    });
  });
  return [
    ...issues,
    ...checkUnusedRequiredFunctionalGroup(context),
    ...checkDigitalLedSignalGroupGroundMissing(context),
    ...checkControlledOutputWithoutControlInput(context),
    ...checkAnalogLedColorChannelUnconnected(context),
    ...checkAnalogLedColorChannelMultiplePwmSignals(context),
    ...checkComponentHasOnlyOneTerminalConnected(context),
    ...checkCapacitorPolarityMismatch(context),
    ...checkMainsConnectorIncomplete(context),
    ...checkProtectiveEarthMissingForMetalOrMainsDevice(context),
    ...checkFuseCurrentMissingOrUnderspecified(context),
    ...checkIsolatedComponent(context),
    ...checkComponentDefinitionIncompleteForChecks(context),
    ...checkAmbiguousMultiFunctionHandle(context),
    ...runComponentSpecificRules(context)
  ];
};
var diagramCheckRules = [
  {
    id: "network-rules",
    get title() {
      return ruleText("network-rules", "title");
    },
    get description() {
      return ruleText("network-rules", "description");
    },
    issueKeys: [
      "groundMissing",
      "groundMultiple",
      "wireConnectedToHiddenOrMissingHandle",
      "mainsWireConnectedToLowVoltageComponent",
      "mainsLowVoltageMixed",
      "peActiveMixed",
      "rs485Mixed",
      "groundAndSupplyPolaritySwapped",
      "mixedClassifications",
      "multipleSupplySources",
      "usbPowerPairInvalid",
      "supplyVoltageUnknown",
      "signalSinkWithoutSource",
      "digitalSignalVoltageMismatch",
      "multipleSignalSources",
      "signalOutputWithoutConsumer",
      "dataDirectionWrong",
      "clockedLedClockMissing",
      "digitalBackupPairMismatch",
      "digitalBackupInputTiedToData",
      "digitalBackupInputNotGrounded",
      "supplyInputWithoutSource",
      "supplySourceWithoutConsumer",
      "supplyVoltageMismatch",
      "fuseBypassed",
      "wireWithoutPhysicalParameters",
      "duplicateParallelWire"
    ],
    check: runNetworkRules
  },
  {
    id: "component-rules",
    get title() {
      return ruleText("component-rules", "title");
    },
    get description() {
      return ruleText("component-rules", "description");
    },
    issueKeys: [
      "requiredPinUnconnected",
      "groundMissing",
      "powerMissing",
      "mainsInputMissing",
      "unusedRequiredFunctionalGroup",
      "digitalLedSignalGroupGroundMissing",
      "controlledOutputWithoutControlInput",
      "analogLedColorChannelUnconnected",
      "analogLedColorChannelMultiplePwmSignals",
      "componentHasOnlyOneTerminalConnected",
      "capacitorPolarityMismatch",
      "mainsConnectorIncomplete",
      "protectiveEarthMissingForMetalOrMainsDevice",
      "fuseCurrentMissingOrUnderspecified",
      "isolatedComponent",
      "componentDefinitionIncompleteForChecks",
      "ambiguousMultiFunctionHandle",
      "sn74Ahct125nUsedChannelInputMissing",
      "sn74Ahct125nDirectLedOutputMissingSeriesResistor"
    ],
    check: runComponentRules
  }
];

// src/check/runDiagramCheck.ts
var DEFAULT_DIAGRAM_CHECK_DEDUPLICATION_MODE = "user-friendly";
function createDiagramCheckContextFromJson(jsonData) {
  const model = JSON.parse(jsonData);
  const nodes = model.nodes || [];
  const edges = model.edges || [];
  return createDiagramCheckContext(nodes, edges);
}
function runDiagramCheck(jsonData, options = {}) {
  const deduplicationMode = options.deduplicationMode || DEFAULT_DIAGRAM_CHECK_DEDUPLICATION_MODE;
  const model = JSON.parse(jsonData);
  const nodes = model.nodes || [];
  if (nodes.length === 0) {
    const t2 = i18n_default.getFixedT(null, "main", "sidebar.check.issues.diagramEmpty");
    return [{
      id: "diagram-empty",
      severity: "info",
      priority: 100,
      specificity: 80,
      fingerprint: {
        scope: "diagram",
        key: "diagram",
        problem: "diagram-empty"
      },
      title: t2("title"),
      shortDescription: t2("shortDescription"),
      description: t2("description"),
      recommendation: t2("recommendation"),
      ruleId: "diagram-empty"
    }];
  }
  const context = createDiagramCheckContextFromJson(jsonData);
  const rawIssues = diagramCheckRules.flatMap((rule) => rule.check(context));
  if (deduplicationMode === "diagnostic") {
    return rawIssues;
  }
  const issuesForMode = deduplicationMode === "user-friendly" ? rawIssues.filter((issue2) => !issue2.diagnosticOnly) : rawIssues;
  return normalizeDiagramCheckIssues(issuesForMode, {
    includeSuppressed: deduplicationMode === "diagnostic-with-suppression-markers"
  });
}

// scripts/diagramCheckRegression.ts
await i18n_default.changeLanguage("en");
var fixtureRoot = path2.join(process.cwd(), "simulation_test", "diagram_checks");
var readJson = (filePath) => JSON.parse(readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
var fail = (caseName, target, message) => ({
  caseName,
  target,
  message
});
var issueMatchesExpectation = (issue2, expectedIssue) => (expectedIssue.ruleId === void 0 || issue2.ruleId === expectedIssue.ruleId) && (expectedIssue.idIncludes === void 0 || issue2.id.includes(expectedIssue.idIncludes)) && (expectedIssue.severity === void 0 || issue2.severity === expectedIssue.severity) && (expectedIssue.descriptionIncludes === void 0 || issue2.description.includes(expectedIssue.descriptionIncludes));
var issueLabel = (issue2) => `${issue2.severity}:${issue2.ruleId ?? issue2.id}:${issue2.description}`;
var compareCase = (casePath) => {
  const caseName = path2.basename(casePath);
  const diagram = readJson(path2.join(casePath, "diagram.json"));
  const expected = readJson(path2.join(casePath, "expected.json"));
  const issues = runDiagramCheck(JSON.stringify(diagram), { deduplicationMode: "diagnostic" });
  const filteredByRule = expected.filterRuleIds ? issues.filter((issue2) => expected.filterRuleIds?.includes(issue2.ruleId)) : issues;
  const filteredIssues = expected.filterIssueIdIncludes ? filteredByRule.filter((issue2) => expected.filterIssueIdIncludes?.some((idPart) => issue2.id.includes(idPart))) : filteredByRule;
  const failures2 = [];
  const usedIssueIndexes = /* @__PURE__ */ new Set();
  expected.expectedIssues.forEach((expectedIssue, index) => {
    const issueIndex = filteredIssues.findIndex((candidate, candidateIndex) => !usedIssueIndexes.has(candidateIndex) && issueMatchesExpectation(candidate, expectedIssue));
    if (issueIndex < 0) {
      failures2.push(fail(
        caseName,
        `expectedIssues[${index}]`,
        `matching issue was not found; actual issues: ${filteredIssues.map(issueLabel).join(" | ") || "(none)"}`
      ));
      return;
    }
    usedIssueIndexes.add(issueIndex);
  });
  if (filteredIssues.length !== expected.expectedIssues.length) {
    const unexpectedIssues = filteredIssues.filter((_, index) => !usedIssueIndexes.has(index)).map(issueLabel);
    failures2.push(fail(
      caseName,
      "issues",
      `expected ${expected.expectedIssues.length} issue(s), got ${filteredIssues.length}; unexpected: ${unexpectedIssues.join(" | ") || "(none)"}`
    ));
  }
  return failures2;
};
var casePaths = readdirSync(fixtureRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path2.join(fixtureRoot, entry.name)).filter((casePath) => existsSync(path2.join(casePath, "diagram.json")) && existsSync(path2.join(casePath, "expected.json"))).sort((a, b) => path2.basename(a).localeCompare(path2.basename(b)));
var failures = casePaths.flatMap(compareCase);
console.log(`Diagram-check regression cases: ${casePaths.length}`);
if (failures.length === 0) {
  console.log("All diagram-check regression checks passed.");
} else {
  console.error(`Diagram-check regression failures: ${failures.length}`);
  failures.forEach((item) => {
    console.error(`[${item.caseName}] ${item.target}: ${item.message}`);
  });
  process.exitCode = 1;
}
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
