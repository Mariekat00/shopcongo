/* eslint-disable */
/**
 * Generated `api` utility.
 * To regenerate, run `npx convex dev`.
 */

function createProxy() {
  var noopFn = function() {};
  
  var handler = {
    get: function(_target, prop) {
      if (typeof prop === "string") {
        return new Proxy(noopFn, {
          apply: function() { return undefined; },
          get: function(_fn, innerProp) {
            if (innerProp === "toString") return function() { return "[ConvexFunction: " + prop + "]"; };
            if (typeof innerProp === "string") return new Proxy(noopFn, handler);
            return undefined;
          },
        });
      }
      return undefined;
    },
  };

  return new Proxy({}, handler);
}

export var api = createProxy();
export var internal = createProxy();
