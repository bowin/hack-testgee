"5.4.2";
"use strict";
!function(root, factory) {
  root.Geetest = factory(root, root.jQuery || (root.Zepto || (root.ender || root.$)));
  if ("function" == typeof define && define.amd) {
    define("Geetest", ["jquery"], function(errorClass) {
      return factory(root, errorClass);
    });
  } else {
    if ("undefined" != typeof exports) {
      exports = factory(root);
    }
  }
}(this, function(logger, makeIterator) {
  var user = {};
  /**
   * @param {Array} a
   * @param {Function} matcherFunction
   * @return {undefined}
   */
  user.serial = function(a, matcherFunction) {
    var l = a.length;
    /** @type {Array} */
    var passedValues = [false];
    /** @type {number} */
    var i = 1;
    /**
     * @param {?} o
     * @param {undefined} dataAndEvents
     * @return {?}
     */
    var clone = function(o, dataAndEvents) {
      return dataAndEvents ? (passedValues = [true], void matcherFunction.apply(null, passedValues)) : (passedValues[i] = o, i += 1, void(i > l ? matcherFunction.apply(null, passedValues) : a[i - 1](clone)));
    };
    a[0](clone);
  };
  /**
   * @param {Array} list
   * @param {Function} callback
   * @return {undefined}
   */
  user.parallel = function(list, callback) {
    var start = list.length;
    /** @type {Array} */
    var args = [false];
    /** @type {number} */
    var w = 0;
    /**
     * @param {number} path
     * @return {?}
     */
    var cb = function(path) {
      return function(fn, dataAndEvents) {
        if (-1 !== w) {
          if (dataAndEvents) {
            return args = [true], callback.apply(null, args), args = [], void(w = -1);
          }
          w += 1;
          args[path] = fn;
          if (w === start) {
            callback.apply(null, args);
          }
        }
      };
    };
    /** @type {number} */
    var i = 1;
    for (;start >= i;i += 1) {
      list[i - 1](cb(i), i);
    }
  };
  var app = {};
  var timeMap = {};
  /**
   * @param {string} name
   * @return {?}
   */
  var callback = function(name) {
    return timeMap[name] && timeMap[name].content;
  };
  /**
   * @param {Object} data
   * @param {string} name
   * @param {Function} callback
   * @return {undefined}
   */
  var load = function(data, name, callback) {
    if (name in timeMap) {
      if ("loaded" === timeMap[name].status) {
        callback(timeMap[name].content);
      } else {
        if ("loading" === timeMap[name].status) {
          me.b(name + "Loaded", function() {
            callback(timeMap[name].content);
          });
        } else {
          log("module " + name + " lost!");
        }
      }
    } else {
      timeMap[name] = {
        status : "loading"
      };
      build(data, "js/" + name.toLowerCase() + "." + data.config.version + ".js", function(dataAndEvents) {
        return dataAndEvents ? void log("module " + name + " can not loaded") : void load(data, name, callback);
      });
    }
  };
  /**
   * @param {string} name
   * @param {Function} b
   * @param {Function} fn
   * @return {?}
   */
  app.c = function(name, b, fn) {
    var result;
    if (isArray(b)) {
      /** @type {Array} */
      var args = [];
      /** @type {number} */
      var i = 0;
      for (;i < b.length;i++) {
        args[i] = callback(b[i]);
      }
      result = fn.apply(null, args);
    } else {
      result = b();
    }
    return timeMap[name] = {}, timeMap[name].status = "loaded", timeMap[name].content = result, me.d(name + "Loaded"), result;
  };
  var me = {};
  me.e = {};
  me.e.global = {};
  /**
   * @param {?} n
   * @return {undefined}
   */
  me.f = function(n) {
    me.e[n] = {};
  };
  /**
   * @param {string} type
   * @param {Function} foo
   * @param {?} id
   * @return {?}
   */
  me.g = function(type, foo, id) {
    return id ? (me.e[id][type] || (me.e[id][type] = []), void me.e[id][type].push({
      once : false,
      callback : foo
    })) : (me.e.global[type] || (me.e.global[type] = []), void me.e.global[type].push({
      once : false,
      callback : foo
    }));
  };
  /**
   * @param {string} value
   * @param {Function} done
   * @param {?} key
   * @return {undefined}
   */
  me.b = function(value, done, key) {
    if (key) {
      if (!me.e[key][value]) {
        /** @type {Array} */
        me.e[key][value] = [];
      }
      me.e[key][value].push({
        once : true,
        /** @type {Function} */
        callback : done
      });
    } else {
      if (!me.e.global[value]) {
        /** @type {Array} */
        me.e.global[value] = [];
      }
      me.e.global[value].push({
        once : true,
        /** @type {Function} */
        callback : done
      });
    }
  };
  /**
   * @param {string} id
   * @param {?} obj
   * @param {?} name
   * @return {undefined}
   */
  me.i = function(id, obj, name) {
    var test;
    test = name ? me.e[name][id] : me.e.global[id];
    test.splice(inArray(obj, test), 1);
  };
  /**
   * @param {?} a
   * @param {?} type
   * @return {undefined}
   */
  me.j = function(a, type) {
    unbind(me.e, type);
  };
  /**
   * @param {string} event
   * @param {?} key
   * @return {undefined}
   */
  me.k = function(event, key) {
    var entry;
    var codeSegments = me.e[key][event];
    if (codeSegments) {
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        entry = codeSegments[i];
        if (entry) {
          entry.callback.call(self.l("self", key));
          if (entry.once) {
            me.i(event, entry, key);
            i -= 1;
          }
        }
      }
    }
  };
  /**
   * @param {string} key
   * @return {undefined}
   */
  me.d = function(key) {
    var entry;
    var codeSegments = me.e.global[key];
    if (codeSegments) {
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        entry = codeSegments[i];
        if (entry) {
          entry.callback();
          if (entry.once) {
            me.i(key, entry);
            i -= 1;
          }
        }
      }
    }
  };
  /**
   * @param {Object} b
   * @param {Object} target
   * @return {?}
   */
  var extend = function(b, target) {
    var result = target || {};
    var p;
    for (p in b) {
      if (b.hasOwnProperty(p)) {
        result[p] = b[p];
      }
    }
    return result;
  };
  /**
   * @param {Object} query
   * @return {?}
   */
  var apply = function(query) {
    /** @type {Array} */
    var tagNameArr = [];
    var part;
    for (part in query) {
      if (query.hasOwnProperty(part)) {
        tagNameArr.push(part + "=" + query[part]);
      }
    }
    return tagNameArr.join("&");
  };
  /**
   * @param {?} arg
   * @return {?}
   */
  var isFunction = function(arg) {
    return "function" == typeof arg;
  };
  /**
   * @return {?}
   */
  var func = function() {
    return parseInt(1E4 * Math.random()) + (new Date).valueOf();
  };
  /**
   * @param {?} elem
   * @param {Array} arr
   * @param {number} i
   * @return {?}
   */
  var inArray = function(elem, arr, i) {
    var len;
    /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
    var core_indexOf = Array.prototype.indexOf;
    if (arr) {
      if (core_indexOf) {
        return core_indexOf.call(arr, elem, i);
      }
      len = arr.length;
      i = i ? 0 > i ? Math.max(0, len + i) : i : 0;
      for (;len > i;i++) {
        if (i in arr && arr[i] === elem) {
          return i;
        }
      }
    }
    return-1;
  };
  /**
   * @param {Object} options
   * @param {?} types
   * @return {undefined}
   */
  var unbind = function(options, types) {
    options[types] = void 0;
    try {
      delete options[types];
    } catch (c) {
    }
  };
  /**
   * @param {Element} el
   * @param {string} txt
   * @return {undefined}
   */
  var setText = function(el, txt) {
    try {
      /** @type {string} */
      el.innerHTML = txt;
    } catch (c) {
      /** @type {string} */
      el.innerText = txt;
    }
  };
  /**
   * @param {number} offset
   * @param {number} a
   * @return {?}
   */
  var slice = function(offset, a) {
    return Array.prototype.slice.call(offset, a);
  };
  /**
   * @param {?} x
   * @param {?} y
   * @return {?}
   */
  var checkAllowableRegions = function(x, y) {
    if (x === y) {
      return true;
    }
    if (null == x || null == y) {
      return false;
    }
    if (x.length != y.length) {
      return false;
    }
    /** @type {number} */
    var i = 0;
    for (;i < x.length;++i) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  };
  /**
   * @param {Array} a
   * @param {Array} b
   * @return {?}
   */
  var diff = function(a, b) {
    /** @type {Array} */
    var result = [];
    /** @type {number} */
    var i = 0;
    for (;i < a.length;i++) {
      result.push(a[i] - b[i]);
    }
    return result;
  };
  /**
   * @param {Function} o
   * @return {?}
   */
  var isArray = function(o) {
    return Array.isArray ? Array.isArray(o) : "[object Array]" === Object.prototype.toString.call(o);
  };
  /**
   * @param {string} fmt
   * @return {undefined}
   */
  var log = function(fmt) {
    try {
      if (console) {
        console.log(fmt);
      }
    } catch (b) {
    }
  };
  var matrix = function() {
    /**
     * @param {Object} values
     * @param {Function} callback
     * @return {?}
     */
    var map = function(values, callback) {
      var result;
      if (isArray(values)) {
        /** @type {Array} */
        result = [];
        /** @type {number} */
        var i = 0;
        var vlen = values.length;
        for (;vlen > i;i += 1) {
          result[i] = callback(i, values[i]);
        }
      } else {
        result = {};
        var value;
        for (value in values) {
          if (values.hasOwnProperty(value)) {
            result[value] = callback(value, values[value]);
          }
        }
      }
      return result;
    };
    /**
     * @param {?} attributes
     * @return {?}
     */
    var setAttributes = function(attributes) {
      /** @type {number} */
      var _len = 0;
      if (isArray(attributes)) {
        _len = attributes.length;
      } else {
        var key;
        for (key in attributes) {
          if (attributes.hasOwnProperty(key)) {
            _len += 1;
          }
        }
      }
      return _len;
    };
    return{
      /** @type {function (Object, Function): ?} */
      m : map,
      /** @type {function (?): ?} */
      n : setAttributes
    };
  }();
  /** @type {boolean} */
  var paramsAreFiltered = false;
  var e = {
    challenge : "",
    type : "slide",
    fullbg : "",
    bg : "",
    slice : "",
    xpos : 0,
    ypos : 0,
    height : 116,
    link : "javascript:;",
    https : false,
    logo : true,
    product : "float",
    id : "",
    version : "5.4.2",
    theme : "golden",
    theme_version : "3.0.20",
    show_delay : 250,
    hide_delay : 800,
    lang : "zh-cn",
    clean : false,
    protocol : "http://",
    path : "static/",
    apiserver : "api.geetest.com/",
    staticservers : ["static.geetest.com/", "dn-staticdown.qbox.me/"],
    retry : 0
  };
  var message = {
    loaded_theme : {},
    loaded_skin : {},
    loaded_sprite : {},
    mobileSkins : {},
    mobileSprites : {},
    feedback : "http://www.geetest.com/contact/#report",
    homepage : "http://www.geetest.com"
  };
  /**
   * @param {Object} obj
   * @param {Object} object
   * @return {undefined}
   */
  var debug = function(obj, object) {
    var prop;
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        obj[prop] = "undefined" != typeof object[prop] ? object[prop] : obj[prop];
      }
    }
  };
  /**
   * @param {Object} config
   * @param {Object} req
   * @return {?}
   */
  var fn = function(config, req) {
    return debug(message, config), req.config ? extend(config, extend(req.config)) : extend(config, extend(e));
  };
  /**
   * @param {string} url
   * @param {Function} cb
   * @return {undefined}
   */
  var send = function(url, cb) {
    /** @type {Element} */
    var img = document.createElement("img");
    /** @type {string} */
    img.crossOrigin = "Anonymous";
    /**
     * @return {undefined}
     */
    img.onerror = function() {
      cb(true, img);
      /** @type {null} */
      img.onerror = null;
    };
    /** @type {function (): undefined} */
    img.onload = img.onreadystatechange = function() {
      if (!(img.readyState && ("loaded" !== img.readyState && "complete" !== img.readyState))) {
        cb(false, img);
        /** @type {null} */
        img.onload = img.onreadystatechange = null;
      }
    };
    /** @type {string} */
    img.src = url;
  };
  /**
   * @param {Object} r
   * @param {?} path
   * @param {Function} next
   * @return {undefined}
   */
  var includeFile = function(r, path, next) {
    /** @type {Element} */
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", path);
    /**
     * @return {undefined}
     */
    link.onerror = function() {
      next(true);
      /** @type {null} */
      link.onload = link.onerror = null;
    };
    /**
     * @return {undefined}
     */
    link.onload = function() {
      next(!f(r));
      /** @type {null} */
      link.onload = link.onerror = null;
    };
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  /**
   * @param {string} src
   * @param {Function} cb
   * @return {undefined}
   */
  var loadScript = function(src, cb) {
    /** @type {Element} */
    var s = document.createElement("script");
    /** @type {string} */
    s.charset = "UTF-8";
    /** @type {boolean} */
    s.async = false;
    /**
     * @return {undefined}
     */
    s.onerror = function() {
      cb(true);
      /** @type {null} */
      s.onerror = null;
    };
    /** @type {function (): undefined} */
    s.onload = s.onreadystatechange = function() {
      if (!(s.readyState && ("loaded" !== s.readyState && "complete" !== s.readyState))) {
        cb(false, null);
        /** @type {null} */
        s.onload = s.onreadystatechange = null;
      }
    };
    /** @type {string} */
    s.src = src;
    document.getElementsByTagName("head")[0].appendChild(s);
  };
  /**
   * @param {Object} data
   * @param {string} options
   * @param {Function} fn
   * @return {undefined}
   */
  var build = function(data, options, fn) {
    var tokens = data.config.staticservers;
    var message = data.config.protocol;
    var file = data.config.path;
    var nTokens = tokens.length;
    /** @type {number} */
    var path = 0;
    /**
     * @param {number} path
     * @param {string} url
     * @return {?}
     */
    var open = function(path, url) {
      return url.indexOf("pictures/") > -1 ? message + tokens[path] + url : message + tokens[path] + file + url;
    };
    if ("function" != typeof fn) {
      /**
       * @return {undefined}
       */
      fn = function() {
      };
    }
    /**
     * @param {undefined} signal_eof
     * @param {?} i
     * @return {?}
     */
    var next = function(signal_eof, i) {
      return signal_eof ? (path += 1, void done(i)) : void fn(false, i);
    };
    /**
     * @param {?} i
     * @return {?}
     */
    var done = function(i) {
      return path >= nTokens ? void fn(true, i) : void(options.indexOf(".js") > -1 ? loadScript(open(path, options), next) : options.indexOf(".png") > -1 || (options.indexOf(".jpg") > -1 || (options.indexOf(".webp") > -1 || options.indexOf(".svg") > -1)) ? send(open(path, options), next) : options.indexOf(".css") > -1 ? includeFile(data, open(path, options), next) : (options && log("no such resource: " + options), fn(true, i)));
    };
    done(null);
  };
  /**
   * @param {string} path
   * @param {Function} fn
   * @param {Object} data
   * @return {undefined}
   */
  var run = function(path, fn, data) {
    path = data.config.protocol + path.replace(/http:\/\/|https:\/\//, "");
    /** @type {string} */
    var type = "geetest_" + func();
    /**
     * @param {Object} cb
     * @return {undefined}
     */
    window[type] = function(cb) {
      if (cb.error) {
        me.k("error", data.id);
        me.k("statusChange", data.id);
        unbind(window, type);
      }
      fn.call(data, false, cb, data);
    };
    loadScript(path + "&callback=" + type, function(dataAndEvents) {
      if (dataAndEvents) {
        log("GeeTest Error: request " + path + " can not access");
        fn.call(data, true);
      }
    });
  };
  /** @type {Element} */
  var img = document.createElement("img");
  /** @type {function (): undefined} */
  img.onload = img.onerror = function() {
    /** @type {string} */
    var level = ".jpg";
    if (2 === img.height) {
      /** @type {string} */
      level = ".webp";
    }
    /** @type {string} */
    message.webp = level;
    me.d("WebPLoaded");
  };
  /** @type {string} */
  img.src = "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";
  /** @type {boolean} */
  var name = /msie 6/i.test(navigator.userAgent);
  /** @type {number} */
  var redo = -1;
  /** @type {boolean} */
  var I = /msie|trident\/|edge/i.test(navigator.userAgent);
  /**
   * @return {?}
   */
  var cleanup = function() {
    return redo = "transition" in document.body.style || ("webkitTransition" in document.body.style || ("mozTransition" in document.body.style || "msTransition" in document.body.style));
  };
  if (document) {
    if (document.body) {
      cleanup();
    }
  }
  if (name) {
    /** @type {string} */
    message.webp = ".jpg";
  }
  /**
   * @param {Object} el
   * @param {string} property
   * @return {?}
   */
  var _getStyle = function(el, property) {
    var defaultValue;
    return el.currentStyle ? defaultValue = el.currentStyle[property] : window.getComputedStyle && (defaultValue = window.getComputedStyle(el, null).getPropertyValue(property)), defaultValue;
  };
  /**
   * @param {Object} r
   * @return {?}
   */
  var f = function(r) {
    if (!I) {
      return true;
    }
    /** @type {string} */
    var object = "178273px";
    var obj = self.l("styleDetectEle", r.id);
    return obj && _getStyle(obj, "width") === object ? (obj.parentNode.removeChild(obj), self.o("styleDetectEle", false, r.id), true) : false;
  };
  /**
   * @param {Element} xhr
   * @return {undefined}
   */
  var parse = function(xhr) {
    if (I) {
      /** @type {Element} */
      var mask = document.createElement("div");
      /** @type {string} */
      mask.id = "geetest_style_detect_178273px";
      self.o("styleDetectEle", mask, xhr.id);
      document.getElementsByTagName("body")[0].appendChild(mask);
    }
  };
  /**
   * @param {Object} config
   * @param {string} data
   * @return {?}
   */
  var process = function(config, data) {
    if (!(this instanceof process)) {
      return new process(config, data);
    }
    var options = this;
    return options.id = func(), me.f(options.id), self.f(options.id, options), options.config = fn(config, options), options.config.protocol = options.config.https ? "https://" : location.protocol + "//", paramsAreFiltered && (options.config.debug = config.debug), data || config.offline ? (success(false, config, options), options.bindOn("#" + config.popupbtnid)) : run(options.config.apiserver + "get.php?" + apply(config), success, options), parse(options), options;
  };
  /**
   * @param {boolean} textStatus
   * @param {Object} options
   * @param {Object} data
   * @return {?}
   */
  var success = function(textStatus, options, data) {
    return textStatus || !options ? false : (paramsAreFiltered && (options = extend(data.config.debug, options), data.config = fn(options, data)), -1 == redo && cleanup(), void user.parallel([function(done) {
      if (options.offline) {
        load(data, "Offline", function(err) {
          done(err);
        });
      } else {
        done(null);
      }
    }, function(done) {
      if (options.fullpage) {
        load(data, "Fullpage", function(err) {
          done(err);
        });
      } else {
        done(null);
      }
    }, function(done) {
      if (options.benchmark) {
        load(data, "Benchmark", function(err) {
          done(err);
        });
      } else {
        done(null);
      }
    }], function(dataAndEvents, chunk, point, deepDataAndEvents) {
      if (point) {
        point.p();
      }
      if (options.offline) {
        data.config = fn(chunk.p(data), data);
      } else {
        data.config = fn(options, data);
      }
      me.g("success", callbacks.onSuccess, data.id);
      me.g("refresh", callbacks.onRefresh, data.id);
      me.g("fail", callbacks.onFail, data.id);
      me.g("forbidden", callbacks.onForbidden, data.id);
      me.g("abuse", callbacks.onAbuse, data.id);
      me.g("error", callbacks.onError, data.id);
      me.b("DOMReady", callbacks.onReady, data.id);
      me.b("DOMReady", function() {
        if (data.config.benchmark) {
          callback("Benchmark").p(data);
        }
      }, data.id);
      user.serial([function($sanitize) {
        if (data.config.mobile) {
          load(data, "SVG", function(value) {
            $sanitize(value);
          });
        } else {
          if ("curtain" === data.config.type) {
            load(data, "Curtain", function(value) {
              $sanitize(value);
            });
          } else {
            $sanitize(null);
          }
        }
      }], function() {
        if (message.loaded_theme[data.config.theme]) {
          if (data.config.mobile && !message.mobileSkins[data.config.theme]) {
            me.b(data.config.theme + "Loaded", function() {
              self.o("loaded", true, data.id);
              me.k("loaded", data.id);
            });
          } else {
            self.o("loaded", true, data.id);
            me.k("loaded", data.id);
          }
        } else {
          if (message.loaded_theme[data.config.theme] = true, data.config.mobile) {
            if (window.GeeTestSkins && window.GeeTestSkins[data.config.theme]) {
              return message.mobileSkins[data.config.theme] = window.GeeTestSkins[data.config.theme], self.o("loaded", true, data.id), void me.k("loaded", data.id);
            }
            build(data, data.config.theme + "/skin." + data.config.theme_version + ".js", function(dataAndEvents) {
              return dataAndEvents ? void log("svg " + data.config.theme + " skin.js can not loaded") : (message.mobileSkins[data.config.theme] = window.GeeTestSkins[data.config.theme], me.d(data.config.theme + "Loaded"), self.o("loaded", true, data.id), void me.k("loaded", data.id));
            });
          } else {
            user.parallel([function($sanitize) {
              build(data, data.config.theme + "/style" + (data.config.https ? "_https" : "") + "." + data.config.theme_version + ".css", function() {
                $sanitize(null, true);
              });
            }, function($sanitize) {
              setTimeout(function() {
                $sanitize(null, true);
              }, 4E3);
            }], function() {
              self.o("loaded", true, data.id);
              me.k("loaded", data.id);
            });
          }
        }
      });
    }));
  };
  var self = {};
  self.e = {};
  /**
   * @param {?} x
   * @param {?} view
   * @return {undefined}
   */
  self.f = function(x, view) {
    self.e[x] = {};
    self.e[x].self = view;
  };
  /**
   * @param {string} value
   * @param {Object} recurring
   * @param {?} n
   * @return {?}
   */
  self.o = function(value, recurring, n) {
    return self.e[n][value] = recurring, recurring;
  };
  /**
   * @param {string} value
   * @param {?} key
   * @return {?}
   */
  self.l = function(value, key) {
    return self.e[key][value];
  };
  /**
   * @param {string} v
   * @return {?}
   */
  var init = function(v) {
    var map = {
      "zh-cn" : {
        loading : "\u52a0\u8f7d\u4e2d...",
        slide : "\u6309\u4f4f\u5de6\u8fb9\u6ed1\u5757\uff0c\u62d6\u52a8\u5b8c\u6210\u4e0a\u65b9\u62fc\u56fe",
        curtain : "\u70b9\u51fb\u4e0a\u56fe\u6309\u94ae\u5e76\u6cbf\u9053\u8def\u62d6\u52a8\u5230\u7ec8\u70b9\u5904",
        curtain_knob : "\u79fb\u52a8\u5230\u6b64\u5f00\u59cb\u9a8c\u8bc1",
        refresh : "\u5237\u65b0\u9a8c\u8bc1",
        help : "\u5e2e\u52a9\u53cd\u9988",
        feedback : "\u53cd\u9988",
        fail : ["\u9a8c\u8bc1\u5931\u8d25:", "\u62d6\u52a8\u6ed1\u5757\u5c06\u60ac\u6d6e\u56fe\u50cf\u6b63\u786e\u62fc\u5408"],
        success : ["\u9a8c\u8bc1\u6210\u529f:", "sec \u79d2\u7684\u901f\u5ea6\u8d85\u8fc7 score% \u7684\u7528\u6237"],
        abuse : ["\u5c1d\u8bd5\u8fc7\u591a:", "\u7cfb\u7edf\u6b63\u5728\u81ea\u52a8\u5237\u65b0\u56fe\u7247"],
        forbidden : ["\u518d\u6765\u4e00\u6b21:", "\u54c7\u54e6\uff5e\u602a\u7269\u5403\u4e86\u62fc\u56fe count \u79d2\u540e\u91cd\u8bd5"],
        error : ["\u51fa\u73b0\u9519\u8bef:", "\u8bf7\u5173\u95ed\u9a8c\u8bc1\u91cd\u8bd5"]
      },
      "zh-tw" : {
        loading : "\u8f09\u5165\u4e2d\u2026",
        slide : ">>> \u6ed1\u52d5\u4ee5\u5b8c\u6210\u62fc\u5716 >>>",
        curtain : "\u9ede\u64ca\u4e0a\u5716\u4e26\u6cbf\u8def\u7dda\u6ed1\u81f3\u7d42\u9ede",
        curtain_knob : "\u6ed1\u52d5\u81f3\u6b64\u5b8c\u6210\u9a57\u8b49",
        refresh : "\u66f4\u65b0\u9a57\u8b49\u5716",
        help : "\u5e6b\u52a9",
        feedback : "\u56de\u5831\u554f\u984c",
        fail : ["\u9a57\u8b49\u5931\u6557:", "\u8acb\u5c07\u61f8\u6d6e\u5716\u7247\u62fc\u5408"],
        success : ["\u9a57\u8b49\u6210\u529f:", "sec \u79d2\u7684\u901f\u5ea6\u8d85\u904e score% \u7684\u7528\u6236"],
        abuse : ["\u5617\u8a66\u904e\u591a\u6b21:", "\u7cfb\u7d71\u6b63\u5728\u66f4\u65b0\u5716\u7247"],
        forbidden : ["\u518d\u4f86\u4e00\u6b21:", "\u5c0f\u602a\u7269\u5403\u6389\u4e86\u62fc\u5716 count \u79d2\u5f8c\u91cd\u8a66"],
        error : ["\u51fa\u73fe\u932f\u8aa4:", "\u8acb\u95dc\u9589\u9a57\u8b49\u5f8c\u91cd\u8a66"]
      },
      ja : {
        loading : "\u30ed\u30fc\u30c9\u4e2d...",
        slide : ">>> \u30b9\u30e9\u30a4\u30c9\u3067\u8a8d\u8a3c\u5b8c\u6210 >>>",
        curtain : "\u30dc\u30bf\u30f3\u3092\u7d42\u70b9\u307e\u3067\u30c9\u30e9\u30c3\u30af\u3057\u3066\u304f\u3060\u3055\u3044",
        curtain_knob : "\u3053\u3053\u304b\u3089\u8a8d\u8a3c\u3092\u59cb\u3081\u307e\u3059",
        refresh : "\u66f4\u65b0\u3057\u307e\u3059",
        help : "\u30d8\u30eb\u30d7",
        feedback : "\u304a\u554f\u5408\u305b",
        fail : ["\u8a8d\u8a3c\u5931\u6557:", "\u30b9\u30e9\u30a4\u30c9\u3067\u30d1\u30d6\u30eb\u3092\u5408\u308f\u305b\u3066\u4e0b\u3055\u3044"],
        success : ["\u8a8d\u8a3c\u5b8c\u6210:", "sec \u79d2\u3067\u3001\u30e6\u30fc\u30b6\u30fc\u306e score% \u3092\u8d85\u3048\u307e\u3059"],
        abuse : ["\u64cd\u4f5c\u304c\u591a\u904e\u304e\u307e\u3059:", "\u518d\u751f\u4e2d\u3067\u3059"],
        forbidden : ["\u3082\u3046\u4e00\u5ea6:", "count \u79d2\u5f8c\u306b\u518d\u64cd\u4f5c\u3057\u3066\u304f\u3060\u3055\u3044"],
        error : ["\u30a8\u30e9\u30fc\u3067\u3059:", "\u9589\u3058\u3066\u3084\u308a\u76f4\u3057\u3066\u4e0b\u3055\u3044"]
      },
      ko : {
        loading : "\ub85c\ub4dc...",
        slide : ">>> \uc2ac\ub77c\uc774\ub354\ub97c \ub4dc\ub798\uadf8 >>>",
        curtain : "\uae38\uc744 \ub530\ub77c \ubc84\ud2bc\uc744 \ub4dc\ub798\uadf8",
        curtain_knob : "\ud655\uc778\ud558\uae30 \uc704\ud574 \uc5ec\uae30\ub85c \uc774\ub3d9",
        refresh : "\uc0c8\ub85c \uace0\uce68",
        help : "\ub3c4\uc6c0",
        feedback : "\ud53c\ub4dc\ubc31",
        fail : ["\uc2e4\ud328:", "\ud37c\uc990\uc744 \uc644\ub8cc\ud558\ub824\uba74 \uc2ac\ub77c\uc774\ub354\ub97c \ub4dc\ub798\uadf8"],
        success : ["\uc131\uacf5:", "sec\ucd08\ub294 \uac80\uc99d\uc744 \uc644\ub8cc \ub2f9\uc2e0\uc740 \uc0ac\ub78c\ub4e4\uc758 score%\ub97c \uc774\uae38"],
        abuse : ["\uc790\uc8fc \uc6b4\uc601:", "\uc0c8\ub85c \uace0\uce68 \uc774\ubbf8\uc9c0"],
        forbidden : ["\ub2e4\uc2dc \uc2dc\ub3c4:", "\uad34\ubb3c \ud37c\uc990\uc744 \uba39\ub294\ub2e4 count\ucd08 \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4"],
        error : ["\uc624\ub958:", "\ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc2ed\uc2dc\uc624"]
      },
      en : {
        loading : "loading...",
        slide : "Drag the button to verify",
        curtain : "Drag the button along the road",
        curtain_knob : "Move here to verify",
        refresh : "Refresh",
        help : "Support",
        feedback : "Feedback",
        fail : ["Fail:", "Drag the button to fill the image"],
        success : ["Success:", "Take secs and defeat score% users"],
        abuse : ["Excessive:", "Server is refreshing the image"],
        forbidden : ["Try Again:", "Wow~ Monster eats the image"],
        error : ["Server Error:", "Please try again later"]
      }
    };
    if ("string" != typeof v) {
      return map["zh-cn"];
    }
    /** @type {string} */
    v = v.toLowerCase();
    /** @type {number} */
    var p = v.indexOf("-");
    /** @type {string} */
    var objUid = p > -1 ? v.slice(0, p) : v;
    return "zh" === objUid && (objUid += v.indexOf("tw") > -1 || v.indexOf("hk") > -1 ? "-tw" : "-cn"), map[objUid] || map["zh-cn"];
  };
  var p = {};
  /**
   * @param {Object} css
   * @param {Object} parent
   * @param {?} fn
   * @return {?}
   */
  p.q = function render(css, parent, fn) {
    var selector;
    /** @type {Element} */
    var div = document.createElement("div");
    if (parent = parent || div.cloneNode(), "string" == typeof css) {
      return void parent.appendChild(document.createTextNode(css));
    }
    for (selector in css) {
      if (css.hasOwnProperty(selector)) {
        var elem;
        /** @type {Array.<string>} */
        var arr = selector.split(".");
        /** @type {string} */
        var tagName = "" === arr[0] ? "div" : arr[0];
        /** @type {string} */
        var val = arr[1];
        if ("input" === tagName) {
          /** @type {Element} */
          elem = document.createElement(tagName);
          /** @type {string} */
          elem.className = val;
          /** @type {string} */
          elem.type = "hidden";
          /** @type {string} */
          elem.name = val;
        } else {
          /** @type {Element} */
          elem = document.createElement(tagName);
          /** @type {string} */
          elem.className = val;
        }
        parent.appendChild(elem);
        fn(elem, "." + val.split(" ")[0]);
        render(css[selector], elem, fn);
      }
    }
    return parent.childNodes ? parent : null;
  };
  /**
   * @param {string} id
   * @return {?}
   */
  p.r = function(id) {
    var self = init(id);
    return{
      ".gt_widget" : {
        ".gt_holder_top" : {},
        ".gt_box_holder" : {
          ".gt_box" : {
            ".gt_loading" : {},
            "a.gt_bg" : {
              ".gt_cut_bg" : {},
              ".gt_slice" : {}
            },
            "a.gt_fullbg" : {
              ".gt_cut_fullbg" : {},
              ".gt_flash" : {},
              ".gt_ie_success" : {}
            },
            "a.gt_curtain" : {
              ".gt_curtain_bg_wrap" : {
                ".gt_curtain_bg" : {
                  ".gt_cut_curtain" : {}
                }
              },
              ".gt_curtain_button" : {}
            },
            "a.gt_box_tips" : {}
          },
          ".gt_info" : {
            ".gt_info_tip" : {
              ".gt_info_icon" : {},
              ".gt_info_text" : {}
            }
          }
        },
        ".gt_bottom" : {
          "a.gt_refresh_button" : {
            ".gt_refresh_tips" : self.refresh
          },
          "a.gt_help_button" : {
            ".gt_help_tips" : self.help
          },
          "a.gt_logo_button" : {}
        }
      },
      ".gt_input" : {
        "input.geetest_challenge" : {},
        "input.geetest_validate" : {},
        "input.geetest_seccode" : {}
      },
      ".gt_slider" : {
        ".gt_guide_tip" : self.slide,
        ".gt_slider_knob" : {},
        ".gt_curtain_tip" : self.curtain,
        ".gt_curtain_knob" : self.curtain_knob,
        ".gt_ajax_tip" : {}
      }
    };
  };
  /**
   * @param {Node} el
   * @param {?} n
   * @return {?}
   */
  p.s = function(el, n) {
    return el.parentNode.insertBefore(n, el.nextSibling), n;
  };
  /**
   * @param {string} str
   * @return {?}
   */
  p.t = function(str) {
    return "string" == typeof str ? 0 == str.indexOf("#") ? str = document.getElementById(str.replace("#", "")) : "querySelector" in document ? str = document.querySelector(str) : isFunction(window.jQuery) && (str = window.jQuery(str)[0]) : str.length && (str = str[0]), str;
  };
  /**
   * @param {HTMLElement} e
   * @return {undefined}
   */
  p.u = function(e) {
    try {
      /** @type {HTMLElement} */
      var a = e;
      for (;e.parentNode != document.body && a.offsetTop - e.parentNode.offsetTop < 160;) {
        e = e.parentNode;
        if ("hidden" == _getStyle(e, "overflow")) {
          /** @type {string} */
          e.style.overflow = "visible";
        }
      }
    } catch (c) {
    }
  };
  /**
   * @param {Element} options
   * @return {?}
   */
  p.v = function(options) {
    var actualLeft = options.offsetLeft;
    var current = options.offsetParent;
    for (;null !== current;) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  };
  /**
   * @param {Element} elem
   * @return {?}
   */
  p.x = function(elem) {
    var result = elem.offsetTop;
    var offsetParent = elem.offsetParent;
    for (;null !== offsetParent;) {
      result += offsetParent.offsetTop;
      offsetParent = offsetParent.offsetParent;
    }
    return result;
  };
  /**
   * @param {Element} m
   * @param {Element} x
   * @return {undefined}
   */
  p.y = function(m, x) {
    /** @type {string} */
    m.style.top = p.x(x) - 160 + "px";
    /** @type {string} */
    m.style.left = p.v(x) + "px";
  };
  /**
   * @param {Object} input
   * @param {?} d
   * @return {undefined}
   */
  p.z = function(input, d) {
    var e = this;
    input = p.t(input);
    p.A(e);
    var $ = e.$;
    if ("gyroscope" === e.config.type) {
      callback("Gyro").p(e).na(e).sa(e);
    } else {
      if (e.config.mobile) {
        var r = callback("SVG");
        r.p(e);
        r.na(e);
        r.sa(e);
      } else {
        if ("popup" !== e.config.product) {
          e.dom = p.q(p.r(e.config.lang), false, $);
        } else {
          var current = callback("Popup");
          e.dom = p.q(current.r(e.config.lang), false, $);
        }
        if (p.B(e, true), p.C(e), p.D(e), p.F(e, true), obj.G(e), "curtain" === e.config.type) {
          var val = callback("Curtain");
          val.G(e);
        }
        /** @type {string} */
        $(".gt_flash").style.height = e.config.height - 22 + "px";
      }
    }
    if (e.dom.style["touch-action"] = "none", e.dom.style["ms-touch-action"] = "none", initialize(e), e.dom.id = "geetest_" + e.id, e.config.mobile ? e.dom.className = "gt_mobile_holder " + e.config.product + " " + e.config.lang : e.dom.className = "gt_holder " + e.config.product + " " + e.config.lang, "float" != e.config.product || (e.config.mobile || lines(e)), "popup" != e.config.product || e.config.mobile) {
      if (d) {
        p.s(input, e.dom);
      } else {
        input.appendChild(e.dom);
      }
    } else {
      document.body.appendChild(e.dom);
      var i = $(".gt_input");
      if (d) {
        p.s(input, i);
      } else {
        input.appendChild(i);
      }
    }
    if ("gyroscope" === e.config.type && self.o("scale", e.dom.clientWidth / 260, e.id), "float" === e.config.product && !e.config.mobile) {
      if (e.config.sandbox) {
        var out = $(".gt_widget");
        e.dom.removeChild(out);
        /** @type {Element} */
        var h = document.createElement("div");
        /** @type {string} */
        h.className = e.dom.className + " gt_clone";
        h.appendChild(out);
        document.getElementsByTagName("body")[0].appendChild(h);
        p.y(h, e.dom);
        /** @type {Element} */
        e.cloneDom = h;
      } else {
        setTimeout(function() {
          p.u(e.dom);
        }, 2E3);
      }
    }
    self.o("DOMReady", true, e.id);
    me.k("DOMReady", e.id);
  };
  /**
   * @param {Object} c
   * @param {number} attributes
   * @return {undefined}
   */
  p.B = function(c, attributes) {
    var cl = c.$;
    if (res.H(cl(".gt_curtain")), res.H(cl(".gt_curtain_button")), res.H(cl(".gt_curtain_tip")), res.H(cl(".gt_curtain_knob")), "slide" == c.config.type) {
      obj.I(c, attributes);
    } else {
      var options = callback("Curtain");
      obj.H(c, attributes);
      options.I(c, attributes);
    }
  };
  /**
   * @param {Object} parent
   * @return {undefined}
   */
  p.D = function(parent) {
    var $ = parent.$;
    var self = $(".gt_logo_button");
    if (parent.config.logo) {
      /** @type {string} */
      self.href = message.homepage;
      /** @type {string} */
      self.target = "_blank";
    } else {
      p.J(self, "no_logo");
    }
    if (parent.config.clean) {
      p.J($(".gt_widget"), "clean");
    }
    var link = $(".gt_help_button");
    /** @type {string} */
    link.href = message.feedback;
    /** @type {string} */
    link.target = "_blank";
  };
  /**
   * @param {Object} d
   * @return {undefined}
   */
  p.C = function(d) {
    var link = d.$(".gt_fullbg");
    var a = d.$(".gt_box_tips");
    if (d.config.link) {
      link.href = a.href = d.config.link;
      /** @type {string} */
      link.target = a.target = "_blank";
    } else {
      /** @type {string} */
      a.style.display = "none";
      link.removeAttribute("href");
      /** @type {string} */
      link.style.cursor = "default";
    }
  };
  /**
   * @param {Element} object
   * @param {string} bind
   * @return {undefined}
   */
  p.J = function(object, bind) {
    if (object) {
      var names = bind.split(" ");
      var ret = object.className.split(" ");
      /** @type {number} */
      var i = 0;
      var len = names.length;
      for (;len > i;i++) {
        if (-1 == inArray(names[i], ret)) {
          ret.push(names[i]);
        }
      }
      object.className = ret.join(" ");
    }
  };
  /**
   * @param {Element} callback
   * @param {string} x
   * @return {undefined}
   */
  p.K = function(callback, x) {
    if (callback) {
      if ("string" == typeof callback) {
        callback = makeIterator(callback);
      }
      var index;
      var rawBodies = x.split(" ");
      var list = callback.className.split(" ");
      /** @type {number} */
      var i = 0;
      var len = rawBodies.length;
      for (;len > i;i++) {
        index = inArray(rawBodies[i], list);
        if (-1 != index) {
          list.splice(index, 1);
        }
      }
      callback.className = list.join(" ");
    }
  };
  /**
   * @param {Element} a
   * @param {string} key
   * @return {?}
   */
  p.L = function(a, key) {
    var reversed = a.className.split(" ");
    return-1 != inArray(key, reversed);
  };
  /**
   * @param {Object} data
   * @param {Object} m
   * @param {Function} test
   * @return {undefined}
   */
  p.M = function(data, m, test) {
    /**
     * @return {undefined}
     */
    var complete = function() {
      /** @type {Date} */
      var defaultCenturyStart = new Date;
      var a = matrix.n(m);
      var args = {};
      /** @type {boolean} */
      var g = false;
      /** @type {number} */
      var b = 0;
      /**
       * @return {undefined}
       */
      var init = function() {
        if (!(a > b)) {
          if (g) {
            data.config.retry += 1;
            self.o("status", "auto", data.id);
            data.refresh();
          } else {
            /** @type {number} */
            data.config.retry = 0;
            /** @type {number} */
            var index = name ? -2 : (new Date).getTime() - defaultCenturyStart.getTime();
            test(args, index);
          }
        }
      };
      matrix.m(m, function(path, entity) {
        build(data, entity.replace(".jpg", message.webp), function(dataAndEvents, img) {
          b += 1;
          if (!g) {
            if (dataAndEvents) {
              if ("fullbg" !== path) {
                /** @type {boolean} */
                g = true;
              } else {
                /** @type {boolean} */
                args[path] = false;
              }
            } else {
              if (!name && (img.src && (img.src.indexOf(".webp") > -1 && (!img.width || img.width < 10)))) {
                /** @type {string} */
                message.webp = ".jpg";
                /** @type {boolean} */
                g = true;
              } else {
                /** @type {Image} */
                args[path] = img;
              }
            }
          }
          init();
        });
      });
    };
    if (message.webp) {
      complete();
    } else {
      me.b("WebPLoaded", complete);
    }
  };
  /**
   * @param {Object} s
   * @param {boolean} obj
   * @return {undefined}
   */
  p.F = function(s, obj) {
    var $ = s.$;
    var oldHeight = s.config.height;
    /** @type {string} */
    $(".gt_box_holder").style.height = oldHeight + "px";
    if (name) {
      /** @type {string} */
      $(".gt_cut_fullbg").style.height = oldHeight + "px";
      /** @type {string} */
      $(".gt_cut_bg").style.height = oldHeight + "px";
      /** @type {string} */
      $(".gt_curtain_bg_wrap").style.height = oldHeight + "px";
      /** @type {string} */
      $(".gt_curtain_bg").style.height = oldHeight + "px";
      /** @type {string} */
      $(".gt_cut_curtain").style.height = oldHeight + "px";
    }
    var type = s.config.type;
    if ("slide" == type) {
      p.M(s, {
        fullbg : s.config.fullbg,
        bg : s.config.bg,
        slice : s.config.slice
      }, function(data, recurring) {
        test.N(data.fullbg.src, data.bg.src, s, obj);
        self.o("imgload", recurring, s.id);
        var el = $(".gt_slice");
        if (name) {
          /** @type {string} */
          el.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + data.slice.src + '")';
        } else {
          /** @type {string} */
          el.style.backgroundImage = "url(" + data.slice.src + ")";
          /** @type {string} */
          el.style.width = (data.slice.width || 60) + "px";
          /** @type {string} */
          el.style.height = (data.slice.height || 60) + "px";
        }
        /** @type {string} */
        el.style.left = s.config.xpos + "px";
        /** @type {string} */
        el.style.top = s.config.ypos + "px";
        setTimeout(function() {
          self.o("status", "ready", s.id);
          assert.I("ready", s);
          me.k("statusChange", s.id);
        }, 400);
      });
    } else {
      /** @type {number} */
      var backoff = 900;
      if (obj) {
        /** @type {number} */
        backoff = 0;
      }
      p.M(s, {
        fullbg : s.config.fullbg,
        bg : s.config.bg
      }, function(data, recurring) {
        var ui = $(".gt_curtain_button");
        self.o("imgload", recurring, s.id);
        /** @type {string} */
        ui.style.top = s.config.ypos + "px";
        /** @type {string} */
        ui.style.left = s.config.xpos + "px";
        test.N(data.fullbg.src, data.bg.src, s, obj);
        setTimeout(function() {
          self.o("status", "ready", s.id);
          assert.I("ready", s);
          me.k("statusChange", s.id);
        }, backoff);
      });
    }
  };
  /**
   * @param {?} mapper
   * @param {?} animated
   * @return {?}
   */
  process.prototype.appendTo = function(mapper, animated) {
    return self.l("loaded", this.id) ? p.z.call(this, mapper, animated) : me.b("loaded", function() {
      p.z.call(this, mapper, animated);
    }, this.id), this;
  };
  /**
   * @param {Object} n
   * @return {undefined}
   */
  p.A = function(n) {
    var item = {};
    /**
     * @param {string} state
     * @param {Object} id
     * @return {?}
     */
    n.$ = function(state, id) {
      return state && id ? void(item[id] = state) : item[state];
    };
  };
  var res = function() {
    /** @type {function (Element, string): undefined} */
    var hide = p.J;
    /** @type {function (Element, string): undefined} */
    var finish = p.K;
    /**
     * @param {?} type
     * @param {number} opt_attributes
     * @param {number} data
     * @return {?}
     */
    var setup = function(type, opt_attributes, data) {
      /**
       * @return {undefined}
       */
      var run = function() {
        if (redo && opt_attributes) {
          hide(type, "gt_animate");
          setTimeout(function() {
            hide(type, "gt_hide");
          });
          setTimeout(function() {
            finish(type, "gt_show");
          }, 20);
          setTimeout(function() {
            finish(type, "gt_animate");
          }, opt_attributes);
        } else {
          finish(type, "gt_show");
          hide(type, "gt_hide");
        }
      };
      return data ? setTimeout(run, data) : void run();
    };
    /**
     * @param {string} type
     * @param {number} opt_attributes
     * @param {number} value
     * @return {?}
     */
    var show = function(type, opt_attributes, value) {
      /**
       * @return {undefined}
       */
      var animate = function() {
        if (redo && opt_attributes) {
          hide(type, "gt_animate");
          setTimeout(function() {
            finish(type, "gt_hide");
          });
          setTimeout(function() {
            hide(type, "gt_show");
          }, 20);
          setTimeout(function() {
            finish(type, "gt_animate");
          }, opt_attributes + 20);
        } else {
          finish(type, "gt_hide");
          hide(type, "gt_show");
        }
      };
      return value ? setTimeout(animate, value) : void animate();
    };
    /**
     * @param {number} type
     * @param {boolean} data
     * @param {boolean} wait
     * @param {boolean} fn
     * @param {Function} handler
     * @return {?}
     */
    var queue = function(type, data, wait, fn, handler) {
      /**
       * @return {undefined}
       */
      var run = function() {
        if (redo && data) {
          hide(type, "gt_animate");
          if ("function" == typeof fn) {
            fn();
          }
          if ("function" == typeof handler) {
            setTimeout(handler, 0);
          }
          setTimeout(function() {
            finish(type, "gt_animate");
          }, data);
        } else {
          if ("function" == typeof handler) {
            handler();
          }
        }
      };
      return wait ? setTimeout(run, wait) : void run();
    };
    return{
      /** @type {function (?, number, number): ?} */
      H : setup,
      /** @type {function (string, number, number): ?} */
      I : show,
      /** @type {function (number, boolean, boolean, boolean, Function): ?} */
      O : queue
    };
  }();
  var test = function() {
    /**
     * @return {?}
     */
    var format = function() {
      var copies;
      /** @type {Array.<string>} */
      var segments = "6_11_7_10_4_12_3_1_0_5_2_9_8".split("_");
      /** @type {Array} */
      var out = [];
      /** @type {number} */
      var d = 0;
      /** @type {number} */
      var ms = 52;
      for (;ms > d;d++) {
        /** @type {number} */
        copies = 2 * parseInt(segments[parseInt(d % 26 / 2)]) + d % 2;
        if (!(parseInt(d / 2) % 2)) {
          copies += d % 2 ? -1 : 1;
        }
        copies += 26 > d ? 26 : 0;
        out.push(copies);
      }
      return out;
    };
    /**
     * @param {Object} require
     * @return {undefined}
     */
    var f = function(require) {
      var complete = require(".gt_fullbg");
      var type = require(".gt_cut_fullbg");
      var e = require(".gt_bg");
      var ready = require(".gt_cut_bg");
      var tooltip = require(".gt_slice");
      var preview = require(".gt_curtain");
      /** @type {string} */
      complete.style.backgroundImage = "none";
      /** @type {string} */
      e.style.backgroundImage = "none";
      /** @type {string} */
      preview.style.backgroundImage = "none";
      /** @type {string} */
      tooltip.style.backgroundImage = "none";
      res.H(complete);
      res.H(e);
      res.H(preview);
      res.H(tooltip);
      res.H(type);
      res.H(ready);
    };
    /**
     * @param {Object} options
     * @param {boolean} col
     * @return {undefined}
     */
    var update = function(options, col) {
      /** @type {number} */
      var pdataCur = 300;
      /** @type {number} */
      var attributes = 600;
      if (col) {
        /** @type {number} */
        pdataCur = attributes = 0;
      }
      var $ = options.$;
      res.I($(".gt_fullbg"), pdataCur);
      if ("slide" == options.config.type) {
        res.I($(".gt_bg"), 0, pdataCur);
        res.I($(".gt_slice"), 0, pdataCur);
      } else {
        res.I($(".gt_curtain"), attributes);
        res.I($(".gt_curtain_button"), attributes);
      }
    };
    /**
     * @param {string} id
     * @param {string} rows
     * @param {?} canvas
     * @param {Element} canvasElement
     * @param {Object} options
     * @return {?}
     */
    var render = function(id, rows, canvas, canvasElement, options) {
      var segs = rows.split("/pictures/gt/")[1].split("/");
      /** @type {boolean} */
      var h = 8 !== segs[0].length;
      if (!h) {
        return void(canvas.style.backgroundImage = "url(" + rows + ")");
      }
      var x;
      var len;
      var position;
      /** @type {Array} */
      var nodes = [];
      if (self.l(id + "Arr", options.id)) {
        nodes = self.l(id + "Arr", options.id);
        /** @type {number} */
        x = 0;
        len = nodes.length;
        for (;len > x;x++) {
          /** @type {string} */
          nodes[x].style.backgroundImage = "url(" + rows + ")";
        }
      } else {
        self.o(id + "Arr", nodes, options.id);
        var el;
        var f = format();
        /** @type {Element} */
        var elem = document.createElement("div");
        /** @type {string} */
        elem.className = "gt_cut_" + id + "_slice";
        /** @type {number} */
        x = 0;
        len = f.length;
        for (;len > x;x++) {
          /** @type {string} */
          position = "-" + (f[x] % 26 * 12 + 1) + "px " + (f[x] > 25 ? -options.config.height / 2 : 0) + "px";
          /** @type {Element} */
          el = elem.cloneNode();
          /** @type {string} */
          el.style.backgroundImage = "url(" + rows + ")";
          nodes.push(el);
          canvasElement.appendChild(el);
          /** @type {string} */
          el.style.backgroundPosition = position;
        }
      }
      res.I(options.$(".gt_cut_" + id));
    };
    /**
     * @param {?} results
     * @param {string} context
     * @param {Object} options
     * @param {boolean} obj
     * @return {undefined}
     */
    var init = function(results, context, options, obj) {
      var prop = options.$;
      f(prop);
      if (results) {
        render("fullbg", results, prop(".gt_fullbg"), prop(".gt_cut_fullbg"), options);
      }
      if ("slide" == options.config.type) {
        render("bg", context, prop(".gt_bg"), prop(".gt_cut_bg"), options);
      } else {
        render("curtain", context, prop(".gt_curtain_bg"), prop(".gt_cut_curtain"), options);
      }
      setTimeout(function() {
        update(options, obj);
      }, 100);
    };
    /**
     * @param {number} config
     * @return {?}
     */
    var Plugin = function(config) {
      var c;
      var y;
      var ret = {
        h : null,
        w : 11
      };
      /** @type {Array} */
      var _coords = [];
      var employees = format();
      /** @type {number} */
      var cy = 0;
      /** @type {number} */
      var x = config / 2;
      /** @type {number} */
      ret.h = x + 1;
      /** @type {number} */
      var i = 0;
      var l = employees.length;
      for (;l > i;i++) {
        /** @type {number} */
        c = employees[i] % 26 * 12 + 1;
        /** @type {number} */
        y = employees[i] > 25 ? x : 0;
        if (i > 25) {
          /** @type {number} */
          cy = x;
        }
        _coords[i] = {};
        /** @type {number} */
        _coords[i].cx = i % 26 * 10;
        /** @type {number} */
        _coords[i].cy = cy;
        _coords[i].ix = -c + _coords[i].cx;
        /** @type {number} */
        _coords[i].iy = -y + cy;
      }
      return ret.all = _coords, ret;
    };
    /**
     * @param {?} img
     * @param {HTMLCanvasElement} canvas
     * @param {(number|string)} height
     * @param {(number|string)} w
     * @return {undefined}
     */
    var draw = function(img, canvas, height, w) {
      /** @type {Element} */
      var cvs = document.createElement("canvas");
      cvs.width = img.width;
      /** @type {(number|string)} */
      cvs.height = height;
      var ctx = cvs.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var a = canvas.getContext("2d");
      /** @type {(number|string)} */
      canvas.height = height;
      /** @type {(number|string)} */
      canvas.width = w;
      /** @type {number} */
      var th = height / 2;
      /** @type {number} */
      var width = 10;
      var employees = format();
      /** @type {number} */
      var i = 0;
      var l = employees.length;
      for (;l > i;i += 1) {
        /** @type {number} */
        var minx = employees[i] % 26 * 12 + 1;
        /** @type {number} */
        var miny = employees[i] > 25 ? th : 0;
        var id2 = ctx.getImageData(minx, miny, width, th);
        a.putImageData(id2, i % 26 * 10, i > 25 ? th : 0);
      }
    };
    return{
      /** @type {function (?, string, Object, boolean): undefined} */
      N : init,
      /** @type {function (Object): undefined} */
      P : f,
      /** @type {function (number): ?} */
      Q : Plugin,
      /** @type {function (?, HTMLCanvasElement, (number|string), (number|string)): undefined} */
      R : draw
    };
  }();
  /** @type {string} */
  var serverAttrs = "move";
  /** @type {string} */
  var Events = "down";
  /** @type {string} */
  var platform = "up";
  /** @type {string} */
  var SCROLL = "scroll";
  /** @type {string} */
  var BLUR = "blur";
  /** @type {string} */
  var focusEvent = "focus";
  /** @type {string} */
  var UNLOAD = "unload";
  var _ = {};
  _.evts = {
    down : ["mousedown", "touchstart", "pointerdown", "MSPointerDown"],
    move : ["mousemove", "touchmove", "pointermove", "MSPointerMove"],
    up : ["mouseup", "touchend", "pointerup", "MSPointerUp"],
    cancel : ["touchcancel"],
    scroll : [SCROLL],
    gyroscope : ["deviceorientation"],
    click : ["click"],
    blur : [BLUR],
    focus : [focusEvent],
    unload : [UNLOAD]
  };
  /** @type {Array} */
  _.e = [];
  /**
   * @param {string} value
   * @param {?} name
   * @return {?}
   */
  _.l = function(value, name) {
    var e;
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var l = _.e.length;
    for (;l > i;i++) {
      if (e = _.e[i], e.dom == value && e.event == name) {
        return e;
      }
    }
    return e = {
      dom : value,
      event : name,
      handlerList : [],
      /**
       * @return {undefined}
       */
      S : function() {
      }
    }, _.e.push(e), e;
  };
  /**
   * @param {Object} obj
   * @param {string} name
   * @param {Function} fn
   * @return {undefined}
   */
  _.T = function(obj, name, fn) {
    var afn;
    var events = _.evts[name];
    var names = _.l(obj, name);
    /** @type {number} */
    var i = 0;
    var l = events.length;
    for (;l > i;i++) {
      if (names.handlerList.length) {
        afn = names.S;
        if (window.addEventListener) {
          obj.removeEventListener(events[i], afn, false);
        } else {
          if (window.attachEvent) {
            obj.detachEvent("on" + events[i], afn);
          }
        }
      }
      if (window.addEventListener) {
        names.handlerList.push(fn);
        /**
         * @param {?} m
         * @return {undefined}
         */
        names.S = function(m) {
          /** @type {number} */
          var i = 0;
          var l = names.handlerList.length;
          for (;l > i;i++) {
            names.handlerList[i](m).call(obj);
          }
        };
        obj.addEventListener(events[i], fn, false);
      } else {
        if (window.attachEvent) {
          obj.attachEvent("on" + events[i], fn);
        }
      }
    }
  };
  var obj = {};
  /**
   * @param {Object} type
   * @return {undefined}
   */
  obj.I = function(type) {
    var I = type.$;
    obj.O(0, type, true);
    res.I(I(".gt_guide_tip"), 500);
    res.I(I(".gt_slider_knob"), 500);
  };
  /**
   * @param {?} type
   * @return {undefined}
   */
  obj.H = function(type) {
    var $ = type.$;
    res.H($(".gt_bg"), 500);
    res.H($(".gt_slider_knob"), 500);
    res.H($(".gt_guide_tip"), 500);
    setTimeout(function() {
      obj.O(0, type, 0);
    }, 500);
  };
  /**
   * @param {boolean} j
   * @param {Object} options
   * @return {?}
   */
  obj.S = function(j, options) {
    var data = this;
    var join = data.$;
    var ready = join(".gt_slice");
    var result = join(".gt_slider_knob");
    if (options.type) {
      return emitter.I("fail", data, 3E3), assert.I("lock", data), res.I(join(".gt_fullbg"), 300), void setTimeout(function() {
        done(options, data);
      }, 500);
    }
    if (j || "error" === options.message) {
      emitter.I("error", data);
      assert.I("error", data);
      self.o("status", "error", data.id);
      me.k("error", data.id);
    } else {
      if (options.success) {
        var cycle = join(".gt_flash");
        self.o("score", options.score, data.id);
        emitter.I("success", data);
        assert.I("success", data);
        if (!redo) {
          res.I(join(".gt_ie_success"));
        }
        res.I(cycle, 1500);
        res.H(cycle, 0, 1600);
        res.I(join(".gt_fullbg"), 1500);
        lang.U(options.validate, data);
        me.k("success", data.id);
        setTimeout(function() {
          self.o("status", "success", data.id);
          me.k("statusChange", data.id);
        }, 400);
      } else {
        if ("fail" == options.message) {
          emitter.I("fail", data);
          assert.I("fail", data);
          res.H(ready, 100);
          res.I(ready, 100, 100);
          res.H(ready, 100, 200);
          res.I(ready, 100, 300);
          res.O(ready, 400, 500, false, function() {
            obj.O(0, data, true);
          });
          res.O(result, 400, 500);
          me.k("fail", data.id);
          setTimeout(function() {
            self.o("status", "ready", data.id);
            assert.I("ready", data);
            me.k("statusChange", data.id);
            res.I(join(".gt_guide_tip"), 500);
          }, 1E3);
        } else {
          if ("forbidden" == options.message) {
            emitter.I("forbidden", data);
            assert.I("forbidden", data);
            me.k("forbidden", data.id);
            setTimeout(function() {
              self.o("status", "auto", data.id);
              data.refresh();
            }, 4E3);
          } else {
            if ("abuse" == options.message) {
              emitter.I("abuse", data);
              assert.I("fail", data);
              me.k("abuse", data.id);
              setTimeout(function() {
                self.o("status", "auto", data.id);
                data.refresh();
              }, 1500);
            }
          }
        }
      }
    }
  };
  /**
   * @param {number} value
   * @param {Object} options
   * @param {boolean} expectedNumberOfNonCommentArgs
   * @return {?}
   */
  obj.O = function(value, options, expectedNumberOfNonCommentArgs) {
    var $ = options.$;
    var div = $(".gt_slider_knob");
    var elem = $(".gt_slice");
    return value = 2 > value ? 2 : value > 198 ? 198 : value, expectedNumberOfNonCommentArgs && (value = 0), "webkitTransform" in document.body.style || "transform" in document.body.style ? void(div.style.webkitTransform = div.style.transform = elem.style.webkitTransform = elem.style.transform = "translate(" + value + "px, 0px)") : (div.style.left = value + "px", void(elem.style.left = options.config.xpos + value + "px"));
  };
  /**
   * @param {Object} s
   * @return {?}
   */
  obj.V = function(s) {
    var $ = s.$;
    return function(e) {
      var field = self.l("status", s.id);
      if ("ready" == field && ("slide" == s.config.type && 2 != e.button)) {
        if (s.config.fullpage) {
          var str = callback("Fullpage");
          str.fa(s);
          str.ha();
        }
        if (!("pointerdown" !== e.type)) {
          if (!self.l("pointerdown", s.id)) {
            self.o("pointerdown", true, s.id);
          }
        }
        self.o("startTime", new Date, s.id);
        self.o("status", "moving", s.id);
        me.k("statusChange", s.id);
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          /** @type {boolean} */
          e.returnValue = false;
        }
        var m = $(".gt_slider_knob");
        p.J($(".gt_slice"), "moving");
        p.J(m, "moving");
        var offsetX = e.clientX || e.changedTouches && e.changedTouches[0].clientX;
        var scrollTop = e.clientY || e.changedTouches && e.changedTouches[0].clientY;
        var position = m.getBoundingClientRect();
        self.o("startX", offsetX, s.id);
        self.o("startY", scrollTop, s.id);
        t.p([Math.round(position.left - offsetX), Math.round(position.top - scrollTop), 0], s.id);
        t.W([0, 0, 0], s.id);
        res.H($(".gt_fullbg"), 300);
        res.H($(".gt_guide_tip"), 500);
      }
    };
  };
  /**
   * @param {Object} data
   * @return {?}
   */
  obj.X = function(data) {
    return function(e) {
      var field = self.l("status", data.id);
      if ("moving" == field && ("slide" == data.config.type && (!self.l("pointerdown", data.id) || "pointermove" === e.type))) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          /** @type {boolean} */
          e.returnValue = false;
        }
        var x2 = self.l("startX", data.id);
        var y2 = self.l("startY", data.id);
        /** @type {number} */
        var b = (e.changedTouches && e.changedTouches[0].clientX || e.clientX) - x2;
        /** @type {number} */
        var h = y2 - (e.changedTouches && e.changedTouches[0].clientY || e.clientY);
        /** @type {number} */
        var blue = parseInt(b);
        obj.O(blue, data);
        t.W([Math.round(b), Math.round(h), (new Date).getTime() - self.l("startTime", data.id)], data.id);
        if (data.config.benchmark) {
          callback("Benchmark").ba(data);
        }
      }
    };
  };
  /**
   * @param {Object} data
   * @return {?}
   */
  obj.Y = function(data) {
    var doc = data.$;
    return function(e) {
      var cornerFallback = self.l("status", data.id);
      if ("moving" == cornerFallback && ("slide" == data.config.type && (!self.l("pointerdown", data.id) || "pointerup" === e.type))) {
        if (data.config.fullpage) {
          var current = callback("Fullpage");
          current.ia();
        }
        cornerFallback = self.o("status", "lock", data.id);
        assert.I("lock", data);
        p.K(doc(".gt_slice"), "moving");
        p.K(doc(".gt_slider_knob"), "moving");
        var topLevelPrimitive = self.l("startX", data.id);
        var y2 = self.l("startY", data.id);
        /** @type {number} */
        var i = (e.changedTouches && e.changedTouches[0].clientX || e.clientX) - topLevelPrimitive;
        /** @type {number} */
        var h = y2 - (e.changedTouches && e.changedTouches[0].clientY || e.clientY);
        /** @type {Date} */
        var stamp = new Date;
        self.o("endTime", stamp, data.id);
        t.W([Math.round(i), Math.round(h), stamp.getTime() - self.l("startTime", data.id)], data.id);
        /** @type {number} */
        var target = parseInt(i);
        var actual = t.Z(data.id);
        if (data.config.offline) {
          var jQuery = callback("Offline");
          return void obj.S.call(data, false, jQuery.ajax(target, self.l("endTime", data.id).getTime() - self.l("startTime", data.id), data));
        }
        var node = {
          gt : data.config.gt,
          challenge : data.config.challenge,
          userresponse : obj._(target, data.config.challenge),
          passtime : self.l("endTime", data.id).getTime() - self.l("startTime", data.id),
          imgload : self.l("imgload", data.id),
          a : actual
        };
        if (data.config.benchmark) {
          var o = callback("Benchmark").ca(data);
          node.b1 = o.b1;
          node.b2 = o.b2;
        }
        run(data.config.apiserver + "ajax.php?" + apply(node), obj.S, data);
      }
    };
  };
  /**
   * @param {Object} d
   * @return {undefined}
   */
  obj.G = function(d) {
    var input = d.$;
    var reversed = input(".gt_slider_knob");
    _.T(reversed, Events, obj.V(d));
    _.T(document, serverAttrs, obj.X(d));
    _.T(document, platform, obj.Y(d));
  };
  /**
   * @param {number} b
   * @param {string} c
   * @return {?}
   */
  obj._ = function(b, c) {
    var st = c.slice(32);
    /** @type {Array} */
    var cn = [];
    /** @type {number} */
    var x = 0;
    for (;x < st.length;x++) {
      var u = st.charCodeAt(x);
      /** @type {number} */
      cn[x] = u > 57 ? u - 87 : u - 48;
    }
    st = 36 * cn[0] + cn[1];
    var YY_START = Math.round(b) + st;
    c = c.slice(0, 32);
    var key;
    /** @type {Array} */
    var parent = [[], [], [], [], []];
    var $cookies = {};
    /** @type {number} */
    var method = 0;
    /** @type {number} */
    x = 0;
    var cl = c.length;
    for (;cl > x;x++) {
      key = c.charAt(x);
      if (!$cookies[key]) {
        /** @type {number} */
        $cookies[key] = 1;
        parent[method].push(key);
        method++;
        /** @type {number} */
        method = 5 == method ? 0 : method;
      }
    }
    var i;
    var YYSTATE = YY_START;
    /** @type {number} */
    var child = 4;
    /** @type {string} */
    var res = "";
    /** @type {Array} */
    var results = [1, 2, 5, 10, 50];
    for (;YYSTATE > 0;) {
      if (YYSTATE - results[child] >= 0) {
        /** @type {number} */
        i = parseInt(Math.random() * parent[child].length, 10);
        res += parent[child][i];
        YYSTATE -= results[child];
      } else {
        parent.splice(child, 1);
        results.splice(child, 1);
        child -= 1;
      }
    }
    return res;
  };
  /**
   * @param {Object} evt
   * @return {?}
   */
  var onload = function(evt) {
    return function() {
      cb(evt);
    };
  };
  /**
   * @param {Object} value
   * @return {undefined}
   */
  var cb = function(value) {
    var part = value.config.show_delay;
    var data = value.config.hide_delay;
    var message = self.l("status", value.id);
    /** @type {boolean} */
    var isXML = "ready" == message || ("success" == message || "error" == message);
    var options = self.l("in", value.id);
    var cycle = value.$(".gt_widget");
    var q = self.l("hideDelay", value.id) || [];
    /** @type {number} */
    var i = 0;
    var l = q.length;
    for (;l > i;i++) {
      clearTimeout(q[i]);
    }
    /** @type {Array} */
    q = [];
    var r;
    if (isXML && !options) {
      if (p.L(cycle, "gt_hide")) {
        return;
      }
      if ("curtain" == value.config.type) {
        var ret = callback("Curtain");
        r = ret.setFloat(false, value, data);
        /** @type {Array} */
        q = q.concat(r);
      }
      q.push(res.H(cycle, 400, data));
      self.o("hideDelay", q, value.id);
    } else {
      if (p.L(cycle, "gt_show")) {
        return;
      }
      if (part = isXML ? part : 0, "curtain" == value.config.type) {
        ret = callback("Curtain");
        r = ret.setFloat(true, value, part);
        /** @type {Array} */
        q = q.concat(r);
      }
      q.push(res.I(cycle, 400, part));
      self.o("hideDelay", q, value.id);
    }
  };
  /**
   * @param {Object} element
   * @param {Object} container
   * @return {?}
   */
  var contains = function(element, container) {
    if (!element || (null == element || "undefined" == typeof element)) {
      return false;
    }
    if (container.compareDocumentPosition) {
      var right = container.compareDocumentPosition(element);
      return!(20 !== right && 0 !== right);
    }
    if (container.contains) {
      return container.contains(element);
    }
    for (;element != container && element;) {
      element = element.parentNode;
    }
    return!!element;
  };
  /**
   * @param {Object} k
   * @return {?}
   */
  var g = function(k) {
    return function(walkers) {
      loop(walkers, k);
    };
  };
  /**
   * @param {Event} obj
   * @param {Object} data
   * @return {undefined}
   */
  var loop = function(obj, data) {
    var elem = obj.target || obj.srcElement;
    var direct = self.l("in", data.id);
    var ret = contains(elem, data.dom);
    if (data.config.sandbox) {
      if (!ret) {
        ret = contains(elem, data.cloneDom);
      }
    }
    if (direct != ret) {
      if (data.config.sandbox) {
        p.y(data.cloneDom, data.dom);
      }
      self.o("in", ret, data.id);
      me.k("hoverChange", data.id);
    }
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  var lines = function(e) {
    var f = e.$;
    self.o("in", false, e.id);
    res.H(f(".gt_widget"));
    _.T(document, "move", g(e));
    _.T(document, "up", g(e));
    me.g("statusChange", onload(e), e.id);
    me.g("hoverChange", onload(e), e.id);
  };
  var options = {};
  /**
   * @param {string} context
   * @param {Node} callback
   * @return {?}
   */
  options.r = function(context, callback) {
    return context = context || message.lang, {
      ".gt_mask" : {},
      ".gt_popup_wrap" : {
        ".gt_popup_header" : {
          ".gt_popup_ready" : "\u8bf7\u5148\u5b8c\u6210\u4e0b\u65b9\u9a8c\u8bc1",
          ".gt_popup_finish" : "\u9875\u9762\u5c06\u57282\u79d2\u540e\u8df3\u8f6c",
          ".gt_popup_cross" : {}
        },
        ".gt_popup_box" : callback ? callback.r(context) : p.r(context)
      }
    };
  };
  /**
   * @param {Object} type
   * @return {undefined}
   */
  options.I = function(type) {
    var I = type.$;
    res.I(type.dom, 400);
    if ("success" == self.l("status", type.id)) {
      type.refresh();
    }
    res.H(I(".gt_popup_finish"));
    res.I(I(".gt_popup_ready"));
  };
  /**
   * @param {?} type
   * @return {undefined}
   */
  options.H = function(type) {
    res.H(type.dom, 400);
  };
  /**
   * @param {string} key
   * @return {?}
   */
  options.bindOn = function(key) {
    var o = this;
    var $ = o.$;
    if (o.config.mobile) {
      return o;
    }
    if (!self.l("DOMReady", o.id)) {
      return void me.b("DOMReady", function() {
        options.bindOn.call(o, key);
      }, o.id);
    }
    if ("popup" === o.config.product) {
      var enablePopup = self.l("enablePopup", o.id);
      if (void 0 == enablePopup) {
        self.o("enablePopup", true, o.id);
      }
      var target = p.t(key);
      if (!target) {
        return void setTimeout(function() {
          options.bindOn.call(o, key);
        }, 100);
      }
      self.o("popup_btn", target, o.id);
      var element = target.cloneNode(true);
      _.T(element, "click", function(ev) {
        if (ev.preventDefault) {
          ev.preventDefault();
        } else {
          /** @type {boolean} */
          ev.returnValue = false;
        }
        var enablePopup = self.l("enablePopup", o.id);
        if (enablePopup) {
          options.I(o);
        }
      });
      _.T($(".gt_mask"), "click", function() {
        options.H(o);
      });
      _.T($(".gt_popup_cross"), "click", function() {
        options.H(o);
      });
      /** @type {string} */
      element.href = "javascript:;";
      element.id = target.id;
      /** @type {string} */
      target.style.display = "none";
      /** @type {string} */
      target.id = "origin_" + target.id;
      p.s(target, element);
      me.g("success", function() {
        res.I($(".gt_popup_finish"));
        res.H($(".gt_popup_ready"));
        setTimeout(function() {
          options.H(o);
          target.click();
        }, 1E3);
      }, o.id);
    }
  };
  /**
   * @param {string} mapper
   * @return {?}
   */
  process.prototype.bindOn = function(mapper) {
    return self.l("loaded", this.id) ? options.bindOn.call(this, mapper) : me.b("loaded", function() {
      options.bindOn.call(this, mapper);
    }, this.id), this;
  };
  /**
   * @return {undefined}
   */
  process.prototype.enable = function() {
    self.o("enablePopup", true, this.id);
  };
  /**
   * @return {undefined}
   */
  process.prototype.disable = function() {
    self.o("enablePopup", false, this.id);
  };
  /**
   * @param {Object} success
   * @return {?}
   */
  var next = function(success) {
    return function() {
      complete(success);
    };
  };
  /**
   * @param {Object} data
   * @return {?}
   */
  var complete = function(data) {
    if (data.config.retry > 3) {
      return void log("can not loaded imgs");
    }
    var status = self.l("status", data.id);
    if ("ready" === status || ("success" === status || "auto" === status)) {
      if (me.k("statusChange", data.id), self.o("status", "lock", data.id), lang.P(data), data.config.mobile) {
        var r = callback("SVG");
        r.na(data, true);
      } else {
        if ("gyroscope" === data.config.type) {
          var rbrace = callback("Gyro");
          rbrace.na(data);
        } else {
          var $ = data.$;
          test.P(data.$);
          res.H($(".gt_ie_success"));
          assert.I("lock", data);
        }
      }
      if (data.config.offline) {
        var current = callback("Offline");
        return void done(current.p(data), data);
      }
      run(data.config.apiserver + "refresh.php?" + apply({
        challenge : data.config.challenge,
        gt : data.config.gt
      }), function(dataAndEvents, count) {
        if (dataAndEvents) {
          count = {};
        }
        done(count, data);
      }, data);
    }
  };
  /**
   * @param {Object} params
   * @param {Object} data
   * @return {undefined}
   */
  var done = function(params, data) {
    if (me.k("refresh", data.id), paramsAreFiltered ? (params = extend(data.config.debug, params), data.config = fn(params, data)) : debug(data.config, params), data.config.mobile) {
      var current = callback("SVG");
      current.sa(data);
    } else {
      if ("gyroscope" === data.config.type) {
        callback("Gyro").sa(data);
      } else {
        p.B(data);
        p.C(data);
        p.F(data);
      }
    }
    clearTimeout(self.l("autoRefresh", data.id));
    self.o("autoRefresh", setTimeout(function() {
      data.refresh();
    }, 54E4), data.id);
  };
  /**
   * @return {undefined}
   */
  process.prototype.refresh = function() {
    complete(this);
  };
  /**
   * @param {Object} s
   * @return {undefined}
   */
  var initialize = function(s) {
    if (s.config.mobile) {
      var target = self.l("eles", s.id);
      _.T(target.refresh, "click", next(s));
    } else {
      _.T(s.$(".gt_refresh_button"), "click", next(s));
    }
    self.o("autoRefresh", setTimeout(function() {
      s.refresh();
    }, 54E4), s.id);
    me.g("success", function() {
      clearTimeout(self.l("autoRefresh", s.id));
    }, s.id);
  };
  var t = function() {
    /**
     * @param {Object} data
     * @param {?} millis
     * @return {undefined}
     */
    var ping = function(data, millis) {
      self.o("arr", [data], millis);
    };
    /**
     * @param {Array} suite
     * @param {?} event
     * @return {undefined}
     */
    var next = function(suite, event) {
      self.l("arr", event).push(suite);
    };
    /**
     * @param {Array} a
     * @return {?}
     */
    var ok = function(a) {
      /** @type {Array} */
      var assigns = [];
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var l = a.length - 1;
      for (;l > i;i++) {
        /** @type {Array} */
        var vvar = [];
        /** @type {number} */
        vvar[0] = Math.round(a[i + 1][0] - a[i][0]);
        /** @type {number} */
        vvar[1] = Math.round(a[i + 1][1] - a[i][1]);
        /** @type {number} */
        vvar[2] = Math.round(a[i + 1][2] - a[i][2]);
        if (!(0 === vvar[0] && (0 === vvar[1] && 0 === vvar[2]))) {
          assigns.push(vvar);
        }
      }
      return assigns;
    };
    /**
     * @param {number} target
     * @return {?}
     */
    var normalize = function(target) {
      /** @type {string} */
      var number = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr";
      /** @type {number} */
      var n = number.length;
      /** @type {string} */
      var u = "";
      /** @type {number} */
      var j = Math.abs(target);
      /** @type {number} */
      var i = parseInt(j / n);
      if (i >= n) {
        /** @type {number} */
        i = n - 1;
      }
      if (i) {
        /** @type {string} */
        u = number.charAt(i);
      }
      j %= n;
      /** @type {string} */
      var a = "";
      return 0 > target && (a += "!"), u && (a += "$"), a + u + number.charAt(j);
    };
    /**
     * @param {Array} str
     * @return {?}
     */
    var isEmpty = function(str) {
      /** @type {Array} */
      var employees = [[1, 0], [2, 0], [1, -1], [1, 1], [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]];
      /** @type {string} */
      var prevSources = "stuvwxyz~";
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var l = employees.length;
      for (;l > i;i++) {
        if (str[0] == employees[i][0] && str[1] == employees[i][1]) {
          return prevSources[i];
        }
      }
      return 0;
    };
    /**
     * @param {?} object
     * @return {?}
     */
    var serialize = function(object) {
      var copies;
      var lines = ok(self.l("arr", object));
      /** @type {Array} */
      var tagNameArr = [];
      /** @type {Array} */
      var out = [];
      /** @type {Array} */
      var UNICODE_SPACES = [];
      /** @type {number} */
      var l = 0;
      var e = lines.length;
      for (;e > l;l++) {
        copies = isEmpty(lines[l]);
        if (copies) {
          out.push(copies);
        } else {
          tagNameArr.push(normalize(lines[l][0]));
          out.push(normalize(lines[l][1]));
        }
        UNICODE_SPACES.push(normalize(lines[l][2]));
      }
      return tagNameArr.join("") + "!!" + out.join("") + "!!" + UNICODE_SPACES.join("");
    };
    return{
      /** @type {function (?): ?} */
      Z : serialize,
      /** @type {function (Array, ?): undefined} */
      W : next,
      /** @type {function (Object, ?): undefined} */
      p : ping
    };
  }();
  var emitter = {};
  /**
   * @param {Element} result
   * @param {string} name
   * @param {string} input
   * @param {Object} obj
   * @return {undefined}
   */
  emitter.N = function(result, name, input, obj) {
    var props = extend(init(input)[name]);
    if (obj) {
      var prop;
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          props[1] = props[1].replace(prop, obj[prop]);
        }
      }
    }
    /** @type {Element} */
    var e = document.createElement("span");
    /** @type {string} */
    e.className = "gt_info_type";
    setText(e, props[0]);
    /** @type {Element} */
    var cell = document.createElement("span");
    /** @type {string} */
    cell.className = "gt_info_content";
    setText(cell, props[1]);
    setText(result, "");
    result.appendChild(e);
    result.appendChild(cell);
  };
  /**
   * @param {string} type
   * @param {number} opt_attributes
   * @param {number} data
   * @return {undefined}
   */
  emitter.I = function(type, opt_attributes, data) {
    var domify = opt_attributes.$;
    if ("undefined" == typeof data) {
      /** @type {number} */
      data = 2E3;
    }
    var cycle = domify(".gt_info");
    var div = domify(".gt_info_tip");
    /** @type {string} */
    div.className = "gt_info_tip " + type;
    var to = self.l("infoHide", opt_attributes.id);
    if (to) {
      clearTimeout(to);
    }
    var interval;
    /** @type {number} */
    var countInfo = 3;
    /**
     * @return {undefined}
     */
    var run = function() {
      emitter.N(extra, type, opt_attributes.config.lang, {
        count : countInfo
      });
      countInfo--;
      if (-1 == countInfo) {
        clearInterval(interval);
      }
    };
    var extra = domify(".gt_info_text");
    var suiteView = {};
    if ("success" == type) {
      /** @type {number} */
      var sec = (self.l("endTime", opt_attributes.id).getTime() - self.l("startTime", opt_attributes.id)) / 1E3;
      /** @type {string} */
      suiteView.sec = sec.toFixed(1);
      /** @type {number} */
      suiteView.score = 100 - self.l("score", opt_attributes.id);
    } else {
      if ("forbidden" == type) {
        run();
        /** @type {number} */
        interval = setInterval(run, 1E3);
        /** @type {number} */
        data = 4E3;
      }
    }
    if ("forbidden" != type) {
      emitter.N(extra, type, opt_attributes.config.lang, suiteView);
    }
    res.I(cycle, 200);
    if (data) {
      self.o("infoHide", res.H(cycle, 300, data), opt_attributes.id);
    }
  };
  var assert = {};
  /**
   * @param {string} type
   * @param {number} opt_attributes
   * @return {undefined}
   */
  assert.I = function(type, opt_attributes) {
    var $ = opt_attributes.$;
    /** @type {string} */
    $(".gt_ajax_tip").className = "gt_ajax_tip " + type;
  };
  var lang = {};
  /**
   * @param {string} value
   * @param {Object} item
   * @return {undefined}
   */
  lang.aa = function(value, item) {
    var doc = item.$;
    var height = value ? item.config.challenge : "";
    var width = value ? value.split("|")[0] : "";
    var text = value ? value.split("|")[0] + "|jordan" : "";
    self.o("geetest_challenge", height, item.id);
    self.o("geetest_validate", width, item.id);
    self.o("geetest_seccode", text, item.id);
    doc(".geetest_challenge").value = height;
    doc(".geetest_validate").value = width;
    doc(".geetest_seccode").value = text;
  };
  /**
   * @param {string} common
   * @param {Object} d
   * @return {undefined}
   */
  lang.U = function(common, d) {
    lang.aa(common, d);
  };
  /**
   * @param {Object} args
   * @return {undefined}
   */
  lang.P = function(args) {
    lang.aa(false, args);
  };
  /**
   * @return {?}
   */
  process.prototype.getValidate = function() {
    var geetest_challenge = {
      geetest_challenge : self.l("geetest_challenge", this.id),
      geetest_validate : self.l("geetest_validate", this.id),
      geetest_seccode : self.l("geetest_seccode", this.id)
    };
    return geetest_challenge.geetest_challenge ? geetest_challenge : false;
  };
  var callbacks = {};
  /**
   * @param {string} message
   * @param {Object} that
   * @return {undefined}
   */
  callbacks.onStatusChange = function(message, that) {
    var fn = self.l("onStatusChange", that.id);
    if ("function" == typeof fn) {
      fn.call(that, message);
    }
    /** @type {number} */
    var marginDiv = "Success" == message ? 1 : 0;
    if ("function" == typeof window.gt_custom_ajax) {
      if (that.config.mobile) {
        window.gt_custom_ajax(marginDiv, that.dom.id, message);
      } else {
        window.gt_custom_ajax(marginDiv, that.$, message);
      }
    }
  };
  /**
   * @return {undefined}
   */
  callbacks.onSuccess = function() {
    var result = this;
    var opts = self.l("onSuccess", result.id);
    if ("function" == typeof opts) {
      opts.call(result);
    }
    callbacks.onStatusChange("Success", result);
  };
  /**
   * @return {undefined}
   */
  callbacks.onRefresh = function() {
    var that = this;
    var fn = self.l("onRefresh", that.id);
    if ("function" == typeof fn) {
      fn.call(that);
    }
    if ("function" == typeof window.gt_custom_refresh) {
      window.gt_custom_refresh(that.$);
    }
  };
  /**
   * @return {undefined}
   */
  callbacks.onFail = function() {
    var fn = self.l("onFail", this.id);
    if ("function" == typeof fn) {
      fn.call(this);
    }
    callbacks.onStatusChange("Fail", this);
  };
  /**
   * @return {undefined}
   */
  callbacks.onForbidden = function() {
    callbacks.onStatusChange("Forbidden", this);
  };
  /**
   * @return {undefined}
   */
  callbacks.onAbuse = function() {
    callbacks.onStatusChange("Abuse", this);
  };
  /**
   * @return {undefined}
   */
  callbacks.onError = function() {
    var e = this;
    if (e.config.mobile) {
      me.k("CanvasError", e.id);
    } else {
      self.o("status", "error", e.id);
      assert.I("error", e);
      emitter.I("error", e, false);
    }
    clearTimeout(self.l("autoRefresh", e.id));
    var handler = self.l("onError", e.id);
    if ("function" == typeof handler) {
      handler.call(e);
    }
    if ("function" == typeof window.gt_custom_error) {
      window.gt_custom_error(e, e.$);
    }
  };
  /**
   * @return {undefined}
   */
  callbacks.onReady = function() {
    var fn = self.l("onReady", this.id);
    if ("function" == typeof fn) {
      fn.call(this);
    }
    if ("function" == typeof window.onGeetestLoaded) {
      window.onGeetestLoaded(this);
    }
  };
  /**
   * @param {Object} recurring
   * @return {?}
   */
  process.prototype.onSuccess = function(recurring) {
    return self.o("onSuccess", recurring, this.id), this;
  };
  /**
   * @param {Object} recurring
   * @return {?}
   */
  process.prototype.onFail = function(recurring) {
    return self.o("onFail", recurring, this.id), this;
  };
  /**
   * @param {Object} recurring
   * @return {?}
   */
  process.prototype.onRefresh = function(recurring) {
    return self.o("onRefresh", recurring, this.id), this;
  };
  /**
   * @param {Object} recurring
   * @return {?}
   */
  process.prototype.onError = function(recurring) {
    return self.o("onError", recurring, this.id), this;
  };
  /**
   * @param {string} message
   * @return {?}
   */
  process.prototype.onStatusChange = function(message) {
    return self.o("onStatusChange", message, this.id), this;
  };
  /**
   * @param {Object} recurring
   * @return {?}
   */
  process.prototype.onReady = function(recurring) {
    return self.o("onReady", recurring, this.id), this;
  };
  /**
   * @return {?}
   */
  process.prototype.getPasstime = function() {
    return self.l("endTime", this.id) - self.l("startTime", this.id);
  };
  /**
   * @return {?}
   */
  process.prototype.hideRefresh = function() {
    var that = this;
    if (!self.l("DOMReady", that.id)) {
      return me.b("DOMReady", function() {
        that.hideRefresh();
      }, that.id), this;
    }
    if (that.config.mobile) {
      var event = self.l("eles", that.id);
      event.refresh.parentNode.removeChild(event.refresh);
      event.refresh = {
        style : {}
      };
    } else {
      var marginDiv = this.$ && this.$(".gt_refresh_button");
      if (!marginDiv) {
        return;
      }
      /** @type {string} */
      marginDiv.style.width = "0";
      try {
        marginDiv.style.setProperty("margin-left", "0", "important");
      } catch (d) {
      }
    }
  };
  /**
   * @param {Object} r
   * @param {number} val
   * @return {undefined}
   */
  var update = function(r, val) {
    self.o("scale", val / 260, r.id);
    var options = self.l("eles", r.id);
    if ("gyroscope" === r.config.type) {
      /** @type {string} */
      r.dom.style.width = val + "px";
    } else {
      /** @type {string} */
      options.svg.style.width = val + "px";
      /** @type {string} */
      options.svg.style.height = Math.ceil(val * (r.config.height + self.l("panelHeight", r.id)) / 260) + "px";
    }
  };
  return process.prototype.zoom = function(z) {
    var e = this;
    if (!self.l("DOMReady", e.id)) {
      return me.b("DOMReady", function() {
        e.zoom(z);
      }, e.id), this;
    }
    if (!e.config.mobile && "gyroscope" !== e.config.type) {
      return this;
    }
    if ("string" == typeof z && z.indexOf("%") > -1) {
      var cDigit = getComputedStyle ? getComputedStyle(e.dom.parentNode).width : e.dom.parentNode.currentStyle.width;
      /** @type {number} */
      z = parseInt(z) * parseInt(cDigit) / 100;
    }
    return update(e, parseInt(z)), this;
  }, process.define = function(deps, config, value) {
    app.c(deps, config, value);
  }, app.c("Event", function() {
    return me;
  }), app.c("Animate", function() {
    return res;
  }), app.c("Browser", function() {
    return{
      /** @type {function (): ?} */
      getCSS3 : cleanup
    };
  }), app.c("Request", function() {
    return run;
  }), app.c("Data", function() {
    return self;
  }), app.c("Decoder", function() {
    return test;
  }), app.c("Dom", function() {
    return p;
  }), app.c("DomEvent", function() {
    return _;
  }), app.c("Info", function() {
    return emitter;
  }), app.c("Input", function() {
    return lang;
  }), app.c("getLang", function() {
    return init;
  }), app.c("Popup", function() {
    return options;
  }), app.c("Slide", function() {
    return obj;
  }), app.c("Tip", function() {
    return assert;
  }), app.c("Tool", function() {
    return{
      /** @type {function (Object, Object): ?} */
      copy : extend,
      /** @type {function (Object): ?} */
      toParam : apply,
      /** @type {function (?): ?} */
      isFunction : isFunction,
      /** @type {function (): ?} */
      random : func,
      /** @type {function (?, Array, number): ?} */
      inArray : inArray,
      /** @type {function (Object, ?): undefined} */
      removeProperty : unbind,
      /** @type {function (Element, string): undefined} */
      setText : setText,
      /** @type {function (number, number): ?} */
      slice : slice,
      /** @type {function (?, ?): ?} */
      arrayEqual : checkAllowableRegions,
      /** @type {function (Array, Array): ?} */
      diff : diff,
      /** @type {function (Function): ?} */
      isArray : isArray,
      /** @type {function (Object, string, Function): undefined} */
      getResource : build,
      /** @type {function (string): undefined} */
      log : log
    };
  }), app.c("Analyse", function() {
    return t;
  }), app.c("Global", function() {
    return message;
  }), app.c("Flow", function() {
    return user;
  }), app.c("Modules", function() {
    return timeMap;
  }), app.c("Flow", function() {
    return user;
  }), app.c("getModule", function() {
    return callback;
  }), app.c("Utility", function() {
    return matrix;
  }), process;
});
