
/*!
 * iblize v2.0.3
 * Simple Javascript Code Editor Library
 * https://mcanam.github.io/iblize
 * MIT license by mcanam
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Iblize = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var prism = {exports: {}};

  (function (module) {
  /* **********************************************
       Begin prism-core.js
  ********************************************** */

  /// <reference lib="WebWorker"/>

  var _self = (typeof window !== 'undefined')
  	? window   // if in browser
  	: (
  		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
  			? self // if in worker
  			: {}   // if in node js
  	);

  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var Prism = (function (_self) {

  	// Private helper vars
  	var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  	var uniqueId = 0;

  	// The grammar object for plaintext
  	var plainTextGrammar = {};


  	var _ = {
  		/**
  		 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
  		 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
  		 * additional languages or plugins yourself.
  		 *
  		 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
  		 *
  		 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
  		 * empty Prism object into the global scope before loading the Prism script like this:
  		 *
  		 * ```js
  		 * window.Prism = window.Prism || {};
  		 * Prism.manual = true;
  		 * // add a new <script> to load Prism's script
  		 * ```
  		 *
  		 * @default false
  		 * @type {boolean}
  		 * @memberof Prism
  		 * @public
  		 */
  		manual: _self.Prism && _self.Prism.manual,
  		disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

  		/**
  		 * A namespace for utility methods.
  		 *
  		 * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
  		 * change or disappear at any time.
  		 *
  		 * @namespace
  		 * @memberof Prism
  		 */
  		util: {
  			encode: function encode(tokens) {
  				if (tokens instanceof Token) {
  					return new Token(tokens.type, encode(tokens.content), tokens.alias);
  				} else if (Array.isArray(tokens)) {
  					return tokens.map(encode);
  				} else {
  					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
  				}
  			},

  			/**
  			 * Returns the name of the type of the given value.
  			 *
  			 * @param {any} o
  			 * @returns {string}
  			 * @example
  			 * type(null)      === 'Null'
  			 * type(undefined) === 'Undefined'
  			 * type(123)       === 'Number'
  			 * type('foo')     === 'String'
  			 * type(true)      === 'Boolean'
  			 * type([1, 2])    === 'Array'
  			 * type({})        === 'Object'
  			 * type(String)    === 'Function'
  			 * type(/abc+/)    === 'RegExp'
  			 */
  			type: function (o) {
  				return Object.prototype.toString.call(o).slice(8, -1);
  			},

  			/**
  			 * Returns a unique number for the given object. Later calls will still return the same number.
  			 *
  			 * @param {Object} obj
  			 * @returns {number}
  			 */
  			objId: function (obj) {
  				if (!obj['__id']) {
  					Object.defineProperty(obj, '__id', { value: ++uniqueId });
  				}
  				return obj['__id'];
  			},

  			/**
  			 * Creates a deep clone of the given object.
  			 *
  			 * The main intended use of this function is to clone language definitions.
  			 *
  			 * @param {T} o
  			 * @param {Record<number, any>} [visited]
  			 * @returns {T}
  			 * @template T
  			 */
  			clone: function deepClone(o, visited) {
  				visited = visited || {};

  				var clone; var id;
  				switch (_.util.type(o)) {
  					case 'Object':
  						id = _.util.objId(o);
  						if (visited[id]) {
  							return visited[id];
  						}
  						clone = /** @type {Record<string, any>} */ ({});
  						visited[id] = clone;

  						for (var key in o) {
  							if (o.hasOwnProperty(key)) {
  								clone[key] = deepClone(o[key], visited);
  							}
  						}

  						return /** @type {any} */ (clone);

  					case 'Array':
  						id = _.util.objId(o);
  						if (visited[id]) {
  							return visited[id];
  						}
  						clone = [];
  						visited[id] = clone;

  						(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
  							clone[i] = deepClone(v, visited);
  						});

  						return /** @type {any} */ (clone);

  					default:
  						return o;
  				}
  			},

  			/**
  			 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
  			 *
  			 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
  			 *
  			 * @param {Element} element
  			 * @returns {string}
  			 */
  			getLanguage: function (element) {
  				while (element && !lang.test(element.className)) {
  					element = element.parentElement;
  				}
  				if (element) {
  					return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
  				}
  				return 'none';
  			},

  			/**
  			 * Returns the script element that is currently executing.
  			 *
  			 * This does __not__ work for line script element.
  			 *
  			 * @returns {HTMLScriptElement | null}
  			 */
  			currentScript: function () {
  				if (typeof document === 'undefined') {
  					return null;
  				}
  				if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
  					return /** @type {any} */ (document.currentScript);
  				}

  				// IE11 workaround
  				// we'll get the src of the current script by parsing IE11's error stack trace
  				// this will not work for inline scripts

  				try {
  					throw new Error();
  				} catch (err) {
  					// Get file src url from stack. Specifically works with the format of stack traces in IE.
  					// A stack will look like this:
  					//
  					// Error
  					//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
  					//    at Global code (http://localhost/components/prism-core.js:606:1)

  					var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
  					if (src) {
  						var scripts = document.getElementsByTagName('script');
  						for (var i in scripts) {
  							if (scripts[i].src == src) {
  								return scripts[i];
  							}
  						}
  					}
  					return null;
  				}
  			},

  			/**
  			 * Returns whether a given class is active for `element`.
  			 *
  			 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
  			 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
  			 * given class is just the given class with a `no-` prefix.
  			 *
  			 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
  			 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
  			 * ancestors have the given class or the negated version of it, then the default activation will be returned.
  			 *
  			 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
  			 * version of it, the class is considered active.
  			 *
  			 * @param {Element} element
  			 * @param {string} className
  			 * @param {boolean} [defaultActivation=false]
  			 * @returns {boolean}
  			 */
  			isActive: function (element, className, defaultActivation) {
  				var no = 'no-' + className;

  				while (element) {
  					var classList = element.classList;
  					if (classList.contains(className)) {
  						return true;
  					}
  					if (classList.contains(no)) {
  						return false;
  					}
  					element = element.parentElement;
  				}
  				return !!defaultActivation;
  			}
  		},

  		/**
  		 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
  		 *
  		 * @namespace
  		 * @memberof Prism
  		 * @public
  		 */
  		languages: {
  			/**
  			 * The grammar for plain, unformatted text.
  			 */
  			plain: plainTextGrammar,
  			plaintext: plainTextGrammar,
  			text: plainTextGrammar,
  			txt: plainTextGrammar,

  			/**
  			 * Creates a deep copy of the language with the given id and appends the given tokens.
  			 *
  			 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
  			 * will be overwritten at its original position.
  			 *
  			 * ## Best practices
  			 *
  			 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
  			 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
  			 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
  			 *
  			 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
  			 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
  			 *
  			 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
  			 * @param {Grammar} redef The new tokens to append.
  			 * @returns {Grammar} The new language created.
  			 * @public
  			 * @example
  			 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
  			 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
  			 *     // at its original position
  			 *     'comment': { ... },
  			 *     // CSS doesn't have a 'color' token, so this token will be appended
  			 *     'color': /\b(?:red|green|blue)\b/
  			 * });
  			 */
  			extend: function (id, redef) {
  				var lang = _.util.clone(_.languages[id]);

  				for (var key in redef) {
  					lang[key] = redef[key];
  				}

  				return lang;
  			},

  			/**
  			 * Inserts tokens _before_ another token in a language definition or any other grammar.
  			 *
  			 * ## Usage
  			 *
  			 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
  			 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
  			 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
  			 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
  			 * this:
  			 *
  			 * ```js
  			 * Prism.languages.markup.style = {
  			 *     // token
  			 * };
  			 * ```
  			 *
  			 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
  			 * before existing tokens. For the CSS example above, you would use it like this:
  			 *
  			 * ```js
  			 * Prism.languages.insertBefore('markup', 'cdata', {
  			 *     'style': {
  			 *         // token
  			 *     }
  			 * });
  			 * ```
  			 *
  			 * ## Special cases
  			 *
  			 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
  			 * will be ignored.
  			 *
  			 * This behavior can be used to insert tokens after `before`:
  			 *
  			 * ```js
  			 * Prism.languages.insertBefore('markup', 'comment', {
  			 *     'comment': Prism.languages.markup.comment,
  			 *     // tokens after 'comment'
  			 * });
  			 * ```
  			 *
  			 * ## Limitations
  			 *
  			 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
  			 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
  			 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
  			 * deleting properties which is necessary to insert at arbitrary positions.
  			 *
  			 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
  			 * Instead, it will create a new object and replace all references to the target object with the new one. This
  			 * can be done without temporarily deleting properties, so the iteration order is well-defined.
  			 *
  			 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
  			 * you hold the target object in a variable, then the value of the variable will not change.
  			 *
  			 * ```js
  			 * var oldMarkup = Prism.languages.markup;
  			 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
  			 *
  			 * assert(oldMarkup !== Prism.languages.markup);
  			 * assert(newMarkup === Prism.languages.markup);
  			 * ```
  			 *
  			 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
  			 * object to be modified.
  			 * @param {string} before The key to insert before.
  			 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
  			 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
  			 * object to be modified.
  			 *
  			 * Defaults to `Prism.languages`.
  			 * @returns {Grammar} The new grammar object.
  			 * @public
  			 */
  			insertBefore: function (inside, before, insert, root) {
  				root = root || /** @type {any} */ (_.languages);
  				var grammar = root[inside];
  				/** @type {Grammar} */
  				var ret = {};

  				for (var token in grammar) {
  					if (grammar.hasOwnProperty(token)) {

  						if (token == before) {
  							for (var newToken in insert) {
  								if (insert.hasOwnProperty(newToken)) {
  									ret[newToken] = insert[newToken];
  								}
  							}
  						}

  						// Do not insert token which also occur in insert. See #1525
  						if (!insert.hasOwnProperty(token)) {
  							ret[token] = grammar[token];
  						}
  					}
  				}

  				var old = root[inside];
  				root[inside] = ret;

  				// Update references in other language definitions
  				_.languages.DFS(_.languages, function (key, value) {
  					if (value === old && key != inside) {
  						this[key] = ret;
  					}
  				});

  				return ret;
  			},

  			// Traverse a language definition with Depth First Search
  			DFS: function DFS(o, callback, type, visited) {
  				visited = visited || {};

  				var objId = _.util.objId;

  				for (var i in o) {
  					if (o.hasOwnProperty(i)) {
  						callback.call(o, i, o[i], type || i);

  						var property = o[i];
  						var propertyType = _.util.type(property);

  						if (propertyType === 'Object' && !visited[objId(property)]) {
  							visited[objId(property)] = true;
  							DFS(property, callback, null, visited);
  						} else if (propertyType === 'Array' && !visited[objId(property)]) {
  							visited[objId(property)] = true;
  							DFS(property, callback, i, visited);
  						}
  					}
  				}
  			}
  		},

  		plugins: {},

  		/**
  		 * This is the most high-level function in Prism’s API.
  		 * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
  		 * each one of them.
  		 *
  		 * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
  		 *
  		 * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
  		 * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
  		 * @memberof Prism
  		 * @public
  		 */
  		highlightAll: function (async, callback) {
  			_.highlightAllUnder(document, async, callback);
  		},

  		/**
  		 * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
  		 * {@link Prism.highlightElement} on each one of them.
  		 *
  		 * The following hooks will be run:
  		 * 1. `before-highlightall`
  		 * 2. `before-all-elements-highlight`
  		 * 3. All hooks of {@link Prism.highlightElement} for each element.
  		 *
  		 * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
  		 * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
  		 * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
  		 * @memberof Prism
  		 * @public
  		 */
  		highlightAllUnder: function (container, async, callback) {
  			var env = {
  				callback: callback,
  				container: container,
  				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
  			};

  			_.hooks.run('before-highlightall', env);

  			env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

  			_.hooks.run('before-all-elements-highlight', env);

  			for (var i = 0, element; (element = env.elements[i++]);) {
  				_.highlightElement(element, async === true, env.callback);
  			}
  		},

  		/**
  		 * Highlights the code inside a single element.
  		 *
  		 * The following hooks will be run:
  		 * 1. `before-sanity-check`
  		 * 2. `before-highlight`
  		 * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
  		 * 4. `before-insert`
  		 * 5. `after-highlight`
  		 * 6. `complete`
  		 *
  		 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
  		 * the element's language.
  		 *
  		 * @param {Element} element The element containing the code.
  		 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
  		 * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
  		 * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
  		 * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
  		 *
  		 * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
  		 * asynchronous highlighting to work. You can build your own bundle on the
  		 * [Download page](https://prismjs.com/download.html).
  		 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
  		 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
  		 * @memberof Prism
  		 * @public
  		 */
  		highlightElement: function (element, async, callback) {
  			// Find language
  			var language = _.util.getLanguage(element);
  			var grammar = _.languages[language];

  			// Set language on the element, if not present
  			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

  			// Set language on the parent, for styling
  			var parent = element.parentElement;
  			if (parent && parent.nodeName.toLowerCase() === 'pre') {
  				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
  			}

  			var code = element.textContent;

  			var env = {
  				element: element,
  				language: language,
  				grammar: grammar,
  				code: code
  			};

  			function insertHighlightedCode(highlightedCode) {
  				env.highlightedCode = highlightedCode;

  				_.hooks.run('before-insert', env);

  				env.element.innerHTML = env.highlightedCode;

  				_.hooks.run('after-highlight', env);
  				_.hooks.run('complete', env);
  				callback && callback.call(env.element);
  			}

  			_.hooks.run('before-sanity-check', env);

  			// plugins may change/add the parent/element
  			parent = env.element.parentElement;
  			if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
  				parent.setAttribute('tabindex', '0');
  			}

  			if (!env.code) {
  				_.hooks.run('complete', env);
  				callback && callback.call(env.element);
  				return;
  			}

  			_.hooks.run('before-highlight', env);

  			if (!env.grammar) {
  				insertHighlightedCode(_.util.encode(env.code));
  				return;
  			}

  			if (async && _self.Worker) {
  				var worker = new Worker(_.filename);

  				worker.onmessage = function (evt) {
  					insertHighlightedCode(evt.data);
  				};

  				worker.postMessage(JSON.stringify({
  					language: env.language,
  					code: env.code,
  					immediateClose: true
  				}));
  			} else {
  				insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
  			}
  		},

  		/**
  		 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
  		 * and the language definitions to use, and returns a string with the HTML produced.
  		 *
  		 * The following hooks will be run:
  		 * 1. `before-tokenize`
  		 * 2. `after-tokenize`
  		 * 3. `wrap`: On each {@link Token}.
  		 *
  		 * @param {string} text A string with the code to be highlighted.
  		 * @param {Grammar} grammar An object containing the tokens to use.
  		 *
  		 * Usually a language definition like `Prism.languages.markup`.
  		 * @param {string} language The name of the language definition passed to `grammar`.
  		 * @returns {string} The highlighted HTML.
  		 * @memberof Prism
  		 * @public
  		 * @example
  		 * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
  		 */
  		highlight: function (text, grammar, language) {
  			var env = {
  				code: text,
  				grammar: grammar,
  				language: language
  			};
  			_.hooks.run('before-tokenize', env);
  			env.tokens = _.tokenize(env.code, env.grammar);
  			_.hooks.run('after-tokenize', env);
  			return Token.stringify(_.util.encode(env.tokens), env.language);
  		},

  		/**
  		 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
  		 * and the language definitions to use, and returns an array with the tokenized code.
  		 *
  		 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
  		 *
  		 * This method could be useful in other contexts as well, as a very crude parser.
  		 *
  		 * @param {string} text A string with the code to be highlighted.
  		 * @param {Grammar} grammar An object containing the tokens to use.
  		 *
  		 * Usually a language definition like `Prism.languages.markup`.
  		 * @returns {TokenStream} An array of strings and tokens, a token stream.
  		 * @memberof Prism
  		 * @public
  		 * @example
  		 * let code = `var foo = 0;`;
  		 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
  		 * tokens.forEach(token => {
  		 *     if (token instanceof Prism.Token && token.type === 'number') {
  		 *         console.log(`Found numeric literal: ${token.content}`);
  		 *     }
  		 * });
  		 */
  		tokenize: function (text, grammar) {
  			var rest = grammar.rest;
  			if (rest) {
  				for (var token in rest) {
  					grammar[token] = rest[token];
  				}

  				delete grammar.rest;
  			}

  			var tokenList = new LinkedList();
  			addAfter(tokenList, tokenList.head, text);

  			matchGrammar(text, tokenList, grammar, tokenList.head, 0);

  			return toArray(tokenList);
  		},

  		/**
  		 * @namespace
  		 * @memberof Prism
  		 * @public
  		 */
  		hooks: {
  			all: {},

  			/**
  			 * Adds the given callback to the list of callbacks for the given hook.
  			 *
  			 * The callback will be invoked when the hook it is registered for is run.
  			 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
  			 *
  			 * One callback function can be registered to multiple hooks and the same hook multiple times.
  			 *
  			 * @param {string} name The name of the hook.
  			 * @param {HookCallback} callback The callback function which is given environment variables.
  			 * @public
  			 */
  			add: function (name, callback) {
  				var hooks = _.hooks.all;

  				hooks[name] = hooks[name] || [];

  				hooks[name].push(callback);
  			},

  			/**
  			 * Runs a hook invoking all registered callbacks with the given environment variables.
  			 *
  			 * Callbacks will be invoked synchronously and in the order in which they were registered.
  			 *
  			 * @param {string} name The name of the hook.
  			 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
  			 * @public
  			 */
  			run: function (name, env) {
  				var callbacks = _.hooks.all[name];

  				if (!callbacks || !callbacks.length) {
  					return;
  				}

  				for (var i = 0, callback; (callback = callbacks[i++]);) {
  					callback(env);
  				}
  			}
  		},

  		Token: Token
  	};
  	_self.Prism = _;


  	// Typescript note:
  	// The following can be used to import the Token type in JSDoc:
  	//
  	//   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

  	/**
  	 * Creates a new token.
  	 *
  	 * @param {string} type See {@link Token#type type}
  	 * @param {string | TokenStream} content See {@link Token#content content}
  	 * @param {string|string[]} [alias] The alias(es) of the token.
  	 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
  	 * @class
  	 * @global
  	 * @public
  	 */
  	function Token(type, content, alias, matchedStr) {
  		/**
  		 * The type of the token.
  		 *
  		 * This is usually the key of a pattern in a {@link Grammar}.
  		 *
  		 * @type {string}
  		 * @see GrammarToken
  		 * @public
  		 */
  		this.type = type;
  		/**
  		 * The strings or tokens contained by this token.
  		 *
  		 * This will be a token stream if the pattern matched also defined an `inside` grammar.
  		 *
  		 * @type {string | TokenStream}
  		 * @public
  		 */
  		this.content = content;
  		/**
  		 * The alias(es) of the token.
  		 *
  		 * @type {string|string[]}
  		 * @see GrammarToken
  		 * @public
  		 */
  		this.alias = alias;
  		// Copy of the full string this token was created from
  		this.length = (matchedStr || '').length | 0;
  	}

  	/**
  	 * A token stream is an array of strings and {@link Token Token} objects.
  	 *
  	 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
  	 * them.
  	 *
  	 * 1. No adjacent strings.
  	 * 2. No empty strings.
  	 *
  	 *    The only exception here is the token stream that only contains the empty string and nothing else.
  	 *
  	 * @typedef {Array<string | Token>} TokenStream
  	 * @global
  	 * @public
  	 */

  	/**
  	 * Converts the given token or token stream to an HTML representation.
  	 *
  	 * The following hooks will be run:
  	 * 1. `wrap`: On each {@link Token}.
  	 *
  	 * @param {string | Token | TokenStream} o The token or token stream to be converted.
  	 * @param {string} language The name of current language.
  	 * @returns {string} The HTML representation of the token or token stream.
  	 * @memberof Token
  	 * @static
  	 */
  	Token.stringify = function stringify(o, language) {
  		if (typeof o == 'string') {
  			return o;
  		}
  		if (Array.isArray(o)) {
  			var s = '';
  			o.forEach(function (e) {
  				s += stringify(e, language);
  			});
  			return s;
  		}

  		var env = {
  			type: o.type,
  			content: stringify(o.content, language),
  			tag: 'span',
  			classes: ['token', o.type],
  			attributes: {},
  			language: language
  		};

  		var aliases = o.alias;
  		if (aliases) {
  			if (Array.isArray(aliases)) {
  				Array.prototype.push.apply(env.classes, aliases);
  			} else {
  				env.classes.push(aliases);
  			}
  		}

  		_.hooks.run('wrap', env);

  		var attributes = '';
  		for (var name in env.attributes) {
  			attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  		}

  		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
  	};

  	/**
  	 * @param {RegExp} pattern
  	 * @param {number} pos
  	 * @param {string} text
  	 * @param {boolean} lookbehind
  	 * @returns {RegExpExecArray | null}
  	 */
  	function matchPattern(pattern, pos, text, lookbehind) {
  		pattern.lastIndex = pos;
  		var match = pattern.exec(text);
  		if (match && lookbehind && match[1]) {
  			// change the match to remove the text matched by the Prism lookbehind group
  			var lookbehindLength = match[1].length;
  			match.index += lookbehindLength;
  			match[0] = match[0].slice(lookbehindLength);
  		}
  		return match;
  	}

  	/**
  	 * @param {string} text
  	 * @param {LinkedList<string | Token>} tokenList
  	 * @param {any} grammar
  	 * @param {LinkedListNode<string | Token>} startNode
  	 * @param {number} startPos
  	 * @param {RematchOptions} [rematch]
  	 * @returns {void}
  	 * @private
  	 *
  	 * @typedef RematchOptions
  	 * @property {string} cause
  	 * @property {number} reach
  	 */
  	function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
  		for (var token in grammar) {
  			if (!grammar.hasOwnProperty(token) || !grammar[token]) {
  				continue;
  			}

  			var patterns = grammar[token];
  			patterns = Array.isArray(patterns) ? patterns : [patterns];

  			for (var j = 0; j < patterns.length; ++j) {
  				if (rematch && rematch.cause == token + ',' + j) {
  					return;
  				}

  				var patternObj = patterns[j];
  				var inside = patternObj.inside;
  				var lookbehind = !!patternObj.lookbehind;
  				var greedy = !!patternObj.greedy;
  				var alias = patternObj.alias;

  				if (greedy && !patternObj.pattern.global) {
  					// Without the global flag, lastIndex won't work
  					var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
  					patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
  				}

  				/** @type {RegExp} */
  				var pattern = patternObj.pattern || patternObj;

  				for ( // iterate the token list and keep track of the current token/string position
  					var currentNode = startNode.next, pos = startPos;
  					currentNode !== tokenList.tail;
  					pos += currentNode.value.length, currentNode = currentNode.next
  				) {

  					if (rematch && pos >= rematch.reach) {
  						break;
  					}

  					var str = currentNode.value;

  					if (tokenList.length > text.length) {
  						// Something went terribly wrong, ABORT, ABORT!
  						return;
  					}

  					if (str instanceof Token) {
  						continue;
  					}

  					var removeCount = 1; // this is the to parameter of removeBetween
  					var match;

  					if (greedy) {
  						match = matchPattern(pattern, pos, text, lookbehind);
  						if (!match) {
  							break;
  						}

  						var from = match.index;
  						var to = match.index + match[0].length;
  						var p = pos;

  						// find the node that contains the match
  						p += currentNode.value.length;
  						while (from >= p) {
  							currentNode = currentNode.next;
  							p += currentNode.value.length;
  						}
  						// adjust pos (and p)
  						p -= currentNode.value.length;
  						pos = p;

  						// the current node is a Token, then the match starts inside another Token, which is invalid
  						if (currentNode.value instanceof Token) {
  							continue;
  						}

  						// find the last node which is affected by this match
  						for (
  							var k = currentNode;
  							k !== tokenList.tail && (p < to || typeof k.value === 'string');
  							k = k.next
  						) {
  							removeCount++;
  							p += k.value.length;
  						}
  						removeCount--;

  						// replace with the new match
  						str = text.slice(pos, p);
  						match.index -= pos;
  					} else {
  						match = matchPattern(pattern, 0, str, lookbehind);
  						if (!match) {
  							continue;
  						}
  					}

  					// eslint-disable-next-line no-redeclare
  					var from = match.index;
  					var matchStr = match[0];
  					var before = str.slice(0, from);
  					var after = str.slice(from + matchStr.length);

  					var reach = pos + str.length;
  					if (rematch && reach > rematch.reach) {
  						rematch.reach = reach;
  					}

  					var removeFrom = currentNode.prev;

  					if (before) {
  						removeFrom = addAfter(tokenList, removeFrom, before);
  						pos += before.length;
  					}

  					removeRange(tokenList, removeFrom, removeCount);

  					var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
  					currentNode = addAfter(tokenList, removeFrom, wrapped);

  					if (after) {
  						addAfter(tokenList, currentNode, after);
  					}

  					if (removeCount > 1) {
  						// at least one Token object was removed, so we have to do some rematching
  						// this can only happen if the current pattern is greedy

  						/** @type {RematchOptions} */
  						var nestedRematch = {
  							cause: token + ',' + j,
  							reach: reach
  						};
  						matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

  						// the reach might have been extended because of the rematching
  						if (rematch && nestedRematch.reach > rematch.reach) {
  							rematch.reach = nestedRematch.reach;
  						}
  					}
  				}
  			}
  		}
  	}

  	/**
  	 * @typedef LinkedListNode
  	 * @property {T} value
  	 * @property {LinkedListNode<T> | null} prev The previous node.
  	 * @property {LinkedListNode<T> | null} next The next node.
  	 * @template T
  	 * @private
  	 */

  	/**
  	 * @template T
  	 * @private
  	 */
  	function LinkedList() {
  		/** @type {LinkedListNode<T>} */
  		var head = { value: null, prev: null, next: null };
  		/** @type {LinkedListNode<T>} */
  		var tail = { value: null, prev: head, next: null };
  		head.next = tail;

  		/** @type {LinkedListNode<T>} */
  		this.head = head;
  		/** @type {LinkedListNode<T>} */
  		this.tail = tail;
  		this.length = 0;
  	}

  	/**
  	 * Adds a new node with the given value to the list.
  	 *
  	 * @param {LinkedList<T>} list
  	 * @param {LinkedListNode<T>} node
  	 * @param {T} value
  	 * @returns {LinkedListNode<T>} The added node.
  	 * @template T
  	 */
  	function addAfter(list, node, value) {
  		// assumes that node != list.tail && values.length >= 0
  		var next = node.next;

  		var newNode = { value: value, prev: node, next: next };
  		node.next = newNode;
  		next.prev = newNode;
  		list.length++;

  		return newNode;
  	}
  	/**
  	 * Removes `count` nodes after the given node. The given node will not be removed.
  	 *
  	 * @param {LinkedList<T>} list
  	 * @param {LinkedListNode<T>} node
  	 * @param {number} count
  	 * @template T
  	 */
  	function removeRange(list, node, count) {
  		var next = node.next;
  		for (var i = 0; i < count && next !== list.tail; i++) {
  			next = next.next;
  		}
  		node.next = next;
  		next.prev = node;
  		list.length -= i;
  	}
  	/**
  	 * @param {LinkedList<T>} list
  	 * @returns {T[]}
  	 * @template T
  	 */
  	function toArray(list) {
  		var array = [];
  		var node = list.head.next;
  		while (node !== list.tail) {
  			array.push(node.value);
  			node = node.next;
  		}
  		return array;
  	}


  	if (!_self.document) {
  		if (!_self.addEventListener) {
  			// in Node.js
  			return _;
  		}

  		if (!_.disableWorkerMessageHandler) {
  			// In worker
  			_self.addEventListener('message', function (evt) {
  				var message = JSON.parse(evt.data);
  				var lang = message.language;
  				var code = message.code;
  				var immediateClose = message.immediateClose;

  				_self.postMessage(_.highlight(code, _.languages[lang], lang));
  				if (immediateClose) {
  					_self.close();
  				}
  			}, false);
  		}

  		return _;
  	}

  	// Get current script and highlight
  	var script = _.util.currentScript();

  	if (script) {
  		_.filename = script.src;

  		if (script.hasAttribute('data-manual')) {
  			_.manual = true;
  		}
  	}

  	function highlightAutomaticallyCallback() {
  		if (!_.manual) {
  			_.highlightAll();
  		}
  	}

  	if (!_.manual) {
  		// If the document state is "loading", then we'll use DOMContentLoaded.
  		// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
  		// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
  		// might take longer one animation frame to execute which can create a race condition where only some plugins have
  		// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
  		// See https://github.com/PrismJS/prism/issues/2102
  		var readyState = document.readyState;
  		if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
  			document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
  		} else {
  			if (window.requestAnimationFrame) {
  				window.requestAnimationFrame(highlightAutomaticallyCallback);
  			} else {
  				window.setTimeout(highlightAutomaticallyCallback, 16);
  			}
  		}
  	}

  	return _;

  }(_self));

  if (module.exports) {
  	module.exports = Prism;
  }

  // hack for components to work correctly in node.js
  if (typeof commonjsGlobal !== 'undefined') {
  	commonjsGlobal.Prism = Prism;
  }

  // some additional documentation/types

  /**
   * The expansion of a simple `RegExp` literal to support additional properties.
   *
   * @typedef GrammarToken
   * @property {RegExp} pattern The regular expression of the token.
   * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
   * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
   * @property {boolean} [greedy=false] Whether the token is greedy.
   * @property {string|string[]} [alias] An optional alias or list of aliases.
   * @property {Grammar} [inside] The nested grammar of this token.
   *
   * The `inside` grammar will be used to tokenize the text value of each token of this kind.
   *
   * This can be used to make nested and even recursive language definitions.
   *
   * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
   * each another.
   * @global
   * @public
   */

  /**
   * @typedef Grammar
   * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
   * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
   * @global
   * @public
   */

  /**
   * A function which will invoked after an element was successfully highlighted.
   *
   * @callback HighlightCallback
   * @param {Element} element The element successfully highlighted.
   * @returns {void}
   * @global
   * @public
   */

  /**
   * @callback HookCallback
   * @param {Object<string, any>} env The environment variables of the hook.
   * @returns {void}
   * @global
   * @public
   */


  /* **********************************************
       Begin prism-markup.js
  ********************************************** */

  Prism.languages.markup = {
  	'comment': {
  		pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
  		greedy: true
  	},
  	'prolog': {
  		pattern: /<\?[\s\S]+?\?>/,
  		greedy: true
  	},
  	'doctype': {
  		// https://www.w3.org/TR/xml/#NT-doctypedecl
  		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
  		greedy: true,
  		inside: {
  			'internal-subset': {
  				pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
  				lookbehind: true,
  				greedy: true,
  				inside: null // see below
  			},
  			'string': {
  				pattern: /"[^"]*"|'[^']*'/,
  				greedy: true
  			},
  			'punctuation': /^<!|>$|[[\]]/,
  			'doctype-tag': /^DOCTYPE/i,
  			'name': /[^\s<>'"]+/
  		}
  	},
  	'cdata': {
  		pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
  		greedy: true
  	},
  	'tag': {
  		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
  		greedy: true,
  		inside: {
  			'tag': {
  				pattern: /^<\/?[^\s>\/]+/,
  				inside: {
  					'punctuation': /^<\/?/,
  					'namespace': /^[^\s>\/:]+:/
  				}
  			},
  			'special-attr': [],
  			'attr-value': {
  				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
  				inside: {
  					'punctuation': [
  						{
  							pattern: /^=/,
  							alias: 'attr-equals'
  						},
  						/"|'/
  					]
  				}
  			},
  			'punctuation': /\/?>/,
  			'attr-name': {
  				pattern: /[^\s>\/]+/,
  				inside: {
  					'namespace': /^[^\s>\/:]+:/
  				}
  			}

  		}
  	},
  	'entity': [
  		{
  			pattern: /&[\da-z]{1,8};/i,
  			alias: 'named-entity'
  		},
  		/&#x?[\da-f]{1,8};/i
  	]
  };

  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
  	Prism.languages.markup['entity'];
  Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function (env) {

  	if (env.type === 'entity') {
  		env.attributes['title'] = env.content.replace(/&amp;/, '&');
  	}
  });

  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  	/**
  	 * Adds an inlined language to markup.
  	 *
  	 * An example of an inlined language is CSS with `<style>` tags.
  	 *
  	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
  	 * case insensitive.
  	 * @param {string} lang The language key.
  	 * @example
  	 * addInlined('style', 'css');
  	 */
  	value: function addInlined(tagName, lang) {
  		var includedCdataInside = {};
  		includedCdataInside['language-' + lang] = {
  			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
  			lookbehind: true,
  			inside: Prism.languages[lang]
  		};
  		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

  		var inside = {
  			'included-cdata': {
  				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
  				inside: includedCdataInside
  			}
  		};
  		inside['language-' + lang] = {
  			pattern: /[\s\S]+/,
  			inside: Prism.languages[lang]
  		};

  		var def = {};
  		def[tagName] = {
  			pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
  			lookbehind: true,
  			greedy: true,
  			inside: inside
  		};

  		Prism.languages.insertBefore('markup', 'cdata', def);
  	}
  });
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
  	/**
  	 * Adds an pattern to highlight languages embedded in HTML attributes.
  	 *
  	 * An example of an inlined language is CSS with `style` attributes.
  	 *
  	 * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
  	 * case insensitive.
  	 * @param {string} lang The language key.
  	 * @example
  	 * addAttribute('style', 'css');
  	 */
  	value: function (attrName, lang) {
  		Prism.languages.markup.tag.inside['special-attr'].push({
  			pattern: RegExp(
  				/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
  				'i'
  			),
  			lookbehind: true,
  			inside: {
  				'attr-name': /^[^\s=]+/,
  				'attr-value': {
  					pattern: /=[\s\S]+/,
  					inside: {
  						'value': {
  							pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
  							lookbehind: true,
  							alias: [lang, 'language-' + lang],
  							inside: Prism.languages[lang]
  						},
  						'punctuation': [
  							{
  								pattern: /^=/,
  								alias: 'attr-equals'
  							},
  							/"|'/
  						]
  					}
  				}
  			}
  		});
  	}
  });

  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;

  Prism.languages.xml = Prism.languages.extend('markup', {});
  Prism.languages.ssml = Prism.languages.xml;
  Prism.languages.atom = Prism.languages.xml;
  Prism.languages.rss = Prism.languages.xml;


  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  (function (Prism) {

  	var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;

  	Prism.languages.css = {
  		'comment': /\/\*[\s\S]*?\*\//,
  		'atrule': {
  			pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
  			inside: {
  				'rule': /^@[\w-]+/,
  				'selector-function-argument': {
  					pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
  					lookbehind: true,
  					alias: 'selector'
  				},
  				'keyword': {
  					pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
  					lookbehind: true
  				}
  				// See rest below
  			}
  		},
  		'url': {
  			// https://drafts.csswg.org/css-values-3/#urls
  			pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
  			greedy: true,
  			inside: {
  				'function': /^url/i,
  				'punctuation': /^\(|\)$/,
  				'string': {
  					pattern: RegExp('^' + string.source + '$'),
  					alias: 'url'
  				}
  			}
  		},
  		'selector': {
  			pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
  			lookbehind: true
  		},
  		'string': {
  			pattern: string,
  			greedy: true
  		},
  		'property': {
  			pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
  			lookbehind: true
  		},
  		'important': /!important\b/i,
  		'function': {
  			pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
  			lookbehind: true
  		},
  		'punctuation': /[(){};:,]/
  	};

  	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

  	var markup = Prism.languages.markup;
  	if (markup) {
  		markup.tag.addInlined('style', 'css');
  		markup.tag.addAttribute('style', 'css');
  	}

  }(Prism));


  /* **********************************************
       Begin prism-clike.js
  ********************************************** */

  Prism.languages.clike = {
  	'comment': [
  		{
  			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
  			lookbehind: true,
  			greedy: true
  		},
  		{
  			pattern: /(^|[^\\:])\/\/.*/,
  			lookbehind: true,
  			greedy: true
  		}
  	],
  	'string': {
  		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  		greedy: true
  	},
  	'class-name': {
  		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
  		lookbehind: true,
  		inside: {
  			'punctuation': /[.\\]/
  		}
  	},
  	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  	'boolean': /\b(?:true|false)\b/,
  	'function': /\b\w+(?=\()/,
  	'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  	'punctuation': /[{}[\];(),.:]/
  };


  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism.languages.javascript = Prism.languages.extend('clike', {
  	'class-name': [
  		Prism.languages.clike['class-name'],
  		{
  			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:prototype|constructor))/,
  			lookbehind: true
  		}
  	],
  	'keyword': [
  		{
  			pattern: /((?:^|\})\s*)catch\b/,
  			lookbehind: true
  		},
  		{
  			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
  			lookbehind: true
  		},
  	],
  	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  	'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  });

  Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

  Prism.languages.insertBefore('javascript', 'keyword', {
  	'regex': {
  		// eslint-disable-next-line regexp/no-dupe-characters-character-class
  		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
  		lookbehind: true,
  		greedy: true,
  		inside: {
  			'regex-source': {
  				pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
  				lookbehind: true,
  				alias: 'language-regex',
  				inside: Prism.languages.regex
  			},
  			'regex-delimiter': /^\/|\/$/,
  			'regex-flags': /^[a-z]+$/,
  		}
  	},
  	// This must be declared before keyword because we use "function" inside the look-forward
  	'function-variable': {
  		pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
  		alias: 'function'
  	},
  	'parameter': [
  		{
  			pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		}
  	],
  	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });

  Prism.languages.insertBefore('javascript', 'string', {
  	'hashbang': {
  		pattern: /^#!.*/,
  		greedy: true,
  		alias: 'comment'
  	},
  	'template-string': {
  		pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
  		greedy: true,
  		inside: {
  			'template-punctuation': {
  				pattern: /^`|`$/,
  				alias: 'string'
  			},
  			'interpolation': {
  				pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
  				lookbehind: true,
  				inside: {
  					'interpolation-punctuation': {
  						pattern: /^\$\{|\}$/,
  						alias: 'punctuation'
  					},
  					rest: Prism.languages.javascript
  				}
  			},
  			'string': /[\s\S]+/
  		}
  	}
  });

  if (Prism.languages.markup) {
  	Prism.languages.markup.tag.addInlined('script', 'javascript');

  	// add attribute support for all DOM events.
  	// https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
  	Prism.languages.markup.tag.addAttribute(
  		/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
  		'javascript'
  	);
  }

  Prism.languages.js = Prism.languages.javascript;


  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {

  	if (typeof Prism === 'undefined' || typeof document === 'undefined') {
  		return;
  	}

  	// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  	if (!Element.prototype.matches) {
  		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  	}

  	var LOADING_MESSAGE = 'Loading…';
  	var FAILURE_MESSAGE = function (status, message) {
  		return '✖ Error ' + status + ' while fetching file: ' + message;
  	};
  	var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';

  	var EXTENSIONS = {
  		'js': 'javascript',
  		'py': 'python',
  		'rb': 'ruby',
  		'ps1': 'powershell',
  		'psm1': 'powershell',
  		'sh': 'bash',
  		'bat': 'batch',
  		'h': 'c',
  		'tex': 'latex'
  	};

  	var STATUS_ATTR = 'data-src-status';
  	var STATUS_LOADING = 'loading';
  	var STATUS_LOADED = 'loaded';
  	var STATUS_FAILED = 'failed';

  	var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
  		+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

  	var lang = /\blang(?:uage)?-([\w-]+)\b/i;

  	/**
  	 * Sets the Prism `language-xxxx` or `lang-xxxx` class to the given language.
  	 *
  	 * @param {HTMLElement} element
  	 * @param {string} language
  	 * @returns {void}
  	 */
  	function setLanguageClass(element, language) {
  		var className = element.className;
  		className = className.replace(lang, ' ') + ' language-' + language;
  		element.className = className.replace(/\s+/g, ' ').trim();
  	}


  	Prism.hooks.add('before-highlightall', function (env) {
  		env.selector += ', ' + SELECTOR;
  	});

  	Prism.hooks.add('before-sanity-check', function (env) {
  		var pre = /** @type {HTMLPreElement} */ (env.element);
  		if (pre.matches(SELECTOR)) {
  			env.code = ''; // fast-path the whole thing and go to complete

  			pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

  			// add code element with loading message
  			var code = pre.appendChild(document.createElement('CODE'));
  			code.textContent = LOADING_MESSAGE;

  			var src = pre.getAttribute('data-src');

  			var language = env.language;
  			if (language === 'none') {
  				// the language might be 'none' because there is no language set;
  				// in this case, we want to use the extension as the language
  				var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
  				language = EXTENSIONS[extension] || extension;
  			}

  			// set language classes
  			setLanguageClass(code, language);
  			setLanguageClass(pre, language);

  			// preload the language
  			var autoloader = Prism.plugins.autoloader;
  			if (autoloader) {
  				autoloader.loadLanguages(language);
  			}

  			// load file
  			var xhr = new XMLHttpRequest();
  			xhr.open('GET', src, true);
  			xhr.onreadystatechange = function () {
  				if (xhr.readyState == 4) {
  					if (xhr.status < 400 && xhr.responseText) {
  						// mark as loaded
  						pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

  						// highlight code
  						code.textContent = xhr.responseText;
  						Prism.highlightElement(code);

  					} else {
  						// mark as failed
  						pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

  						if (xhr.status >= 400) {
  							code.textContent = FAILURE_MESSAGE(xhr.status, xhr.statusText);
  						} else {
  							code.textContent = FAILURE_EMPTY_MESSAGE;
  						}
  					}
  				}
  			};
  			xhr.send(null);
  		}
  	});

  	Prism.plugins.fileHighlight = {
  		/**
  		 * Executes the File Highlight plugin for all matching `pre` elements under the given container.
  		 *
  		 * Note: Elements which are already loaded or currently loading will not be touched by this method.
  		 *
  		 * @param {ParentNode} [container=document]
  		 */
  		highlight: function highlight(container) {
  			var elements = (container || document).querySelectorAll(SELECTOR);

  			for (var i = 0, element; (element = elements[i++]);) {
  				Prism.highlightElement(element);
  			}
  		}
  	};

  	var logged = false;
  	/** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
  	Prism.fileHighlight = function () {
  		if (!logged) {
  			console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
  			logged = true;
  		}
  		Prism.plugins.fileHighlight.highlight.apply(this, arguments);
  	};

  }());
  }(prism));

  var Prism$1 = prism.exports;

  var dom = {
    select: function select(selector) {
      return document.querySelector(selector);
    },
    selectAll: function selectAll(selector) {
      return document.querySelectorAll(selector);
    },
    create: function create(name, props) {
      var _this = this;

      var element = document.createElement(name),
          propEntries = Object.entries(props),
          propsLength = propEntries.length;
      if (propsLength == 0) return element;
      propEntries.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (key == "parent") {
          return value.appendChild(element);
        }

        if (key == "attr") {
          return _this.setAttr(element, value);
        }

        if (key == "event") {
          return _this.addEvent(element, value);
        }

        if (key == "style") {
          return _this.addStyle(element, value);
        }

        element[key] = value;
      });
      return element;
    },
    setAttr: function setAttr(target, attrMap) {
      var attrEntries = Object.entries(attrMap);
      attrEntries.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        target.setAttribute(key, value);
      });
      return this;
    },
    addEvent: function addEvent(target, eventMap) {
      var isArray = Array.isArray(eventMap); // if not array wrap it into array

      var eventArr = isArray ? eventMap : [eventMap];
      eventArr.forEach(function (_ref5) {
        var name = _ref5.name,
            callback = _ref5.callback;
        target.addEventListener(name, callback, false);
      });
      return this;
    },
    addStyle: function addStyle(target, styleMap) {
      var styleEntries = Object.entries(styleMap);
      styleEntries.forEach(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
            key = _ref7[0],
            value = _ref7[1];

        target.style[key] = value;
      });
      return this;
    }
  };

  var History = /*#__PURE__*/function () {
    function History(editor) {
      _classCallCheck(this, History);

      this.editor = editor;
      this.stack = [];
      this.level = 0; // fill the stack for the first time

      this.record(0, "");
    }

    _createClass(History, [{
      key: "record",
      value: function record(cursor, value) {
        if (this.stack.length > 1000) {
          // limit stack size
          this.stack.shift();
        }

        var stringify = JSON.stringify;
        var lastHistory = this.stack.slice(-1)[0];
        var currHistory = {
          cursor: cursor,
          value: value
        };

        if (stringify(lastHistory) != stringify(currHistory)) {
          // avoid duplicated value
          this.stack.push(currHistory);
        }

        this.level = this.stack.length - 1;
      }
    }, {
      key: "undo",
      value: function undo() {
        if (this.level > 0) {
          this.level -= 1;
          this.restore();
        }
      }
    }, {
      key: "redo",
      value: function redo() {
        if (this.level < this.stack.length - 1) {
          this.level += 1;
          this.restore();
        }
      }
    }, {
      key: "restore",
      value: function restore() {
        var _this$stack$this$leve = this.stack[this.level],
            cursor = _this$stack$this$leve.cursor,
            value = _this$stack$this$leve.value;
        this.editor.setValue(value, false);
        this.editor.setCursor(cursor);
      }
    }]);

    return History;
  }();

  var languages = {
    require: {
      javascript: "clike",
      actionscript: "javascript",
      apex: ["clike", "sql"],
      arduino: "cpp",
      aspnet: ["markup", "csharp"],
      birb: "clike",
      bison: "c",
      c: "clike",
      csharp: "clike",
      cpp: "c",
      cfscript: "clike",
      chaiscript: ["clike", "cpp"],
      coffeescript: "javascript",
      crystal: "ruby",
      "css-extras": "css",
      d: "clike",
      dart: "clike",
      django: "markup-templating",
      ejs: ["javascript", "markup-templating"],
      etlua: ["lua", "markup-templating"],
      erb: ["ruby", "markup-templating"],
      fsharp: "clike",
      "firestore-security-rules": "clike",
      flow: "javascript",
      ftl: "markup-templating",
      gml: "clike",
      glsl: "c",
      go: "clike",
      groovy: "clike",
      haml: "ruby",
      handlebars: "markup-templating",
      haxe: "clike",
      hlsl: "c",
      idris: "haskell",
      java: "clike",
      javadoc: ["markup", "java", "javadoclike"],
      jolie: "clike",
      jsdoc: ["javascript", "javadoclike", "typescript"],
      "js-extras": "javascript",
      json5: "json",
      jsonp: "json",
      "js-templates": "javascript",
      kotlin: "clike",
      latte: ["clike", "markup-templating", "php"],
      less: "css",
      lilypond: "scheme",
      liquid: "markup-templating",
      markdown: "markup",
      "markup-templating": "markup",
      mongodb: "javascript",
      n4js: "javascript",
      objectivec: "c",
      opencl: "c",
      parser: "markup",
      php: "markup-templating",
      phpdoc: ["php", "javadoclike"],
      "php-extras": "php",
      plsql: "sql",
      processing: "clike",
      protobuf: "clike",
      pug: ["markup", "javascript"],
      purebasic: "clike",
      purescript: "haskell",
      qsharp: "clike",
      qml: "javascript",
      qore: "clike",
      racket: "scheme",
      jsx: ["markup", "javascript"],
      tsx: ["jsx", "typescript"],
      reason: "clike",
      ruby: "clike",
      sass: "css",
      scss: "css",
      scala: "java",
      "shell-session": "bash",
      smarty: "markup-templating",
      solidity: "clike",
      soy: "markup-templating",
      sparql: "turtle",
      sqf: "clike",
      squirrel: "clike",
      swift: "clike",
      "t4-cs": ["t4-templating", "csharp"],
      "t4-vb": ["t4-templating", "vbnet"],
      tap: "yaml",
      tt2: ["clike", "markup-templating"],
      textile: "markup",
      twig: "markup",
      typescript: "javascript",
      v: "clike",
      vala: "clike",
      vbnet: "basic",
      velocity: "markup",
      wiki: "markup",
      xeora: "markup",
      "xml-doc": "markup",
      xquery: "markup"
    },
    aliases: {
      html: "markup",
      xml: "markup",
      svg: "markup",
      mathml: "markup",
      ssml: "markup",
      atom: "markup",
      rss: "markup",
      js: "javascript",
      g4: "antlr4",
      adoc: "asciidoc",
      shell: "bash",
      shortcode: "bbcode",
      rbnf: "bnf",
      oscript: "bsl",
      cs: "csharp",
      dotnet: "csharp",
      cfc: "cfscript",
      coffee: "coffeescript",
      conc: "concurnas",
      jinja2: "django",
      "dns-zone": "dns-zone-file",
      dockerfile: "docker",
      gv: "dot",
      eta: "ejs",
      xlsx: "excel-formula",
      xls: "excel-formula",
      gamemakerlanguage: "gml",
      hbs: "handlebars",
      hs: "haskell",
      idr: "idris",
      gitignore: "ignore",
      hgignore: "ignore",
      npmignore: "ignore",
      webmanifest: "json",
      kt: "kotlin",
      kts: "kotlin",
      kum: "kumir",
      tex: "latex",
      context: "latex",
      ly: "lilypond",
      emacs: "lisp",
      elisp: "lisp",
      "emacs-lisp": "lisp",
      md: "markdown",
      moon: "moonscript",
      n4jsd: "n4js",
      nani: "naniscript",
      objc: "objectivec",
      qasm: "openqasm",
      objectpascal: "pascal",
      px: "pcaxis",
      pcode: "peoplecode",
      pq: "powerquery",
      mscript: "powerquery",
      pbfasm: "purebasic",
      purs: "purescript",
      py: "python",
      qs: "qsharp",
      rkt: "racket",
      rpy: "renpy",
      robot: "robotframework",
      rb: "ruby",
      "sh-session": "shell-session",
      shellsession: "shell-session",
      smlnj: "sml",
      sol: "solidity",
      sln: "solution-file",
      rq: "sparql",
      t4: "t4-cs",
      trig: "turtle",
      ts: "typescript",
      tsconfig: "typoscript",
      uscript: "unrealscript",
      uc: "unrealscript",
      url: "uri",
      vb: "visual-basic",
      vba: "visual-basic",
      mathematica: "wolfram",
      nb: "wolfram",
      wl: "wolfram",
      xeoracube: "xeora",
      yml: "yaml"
    }
  };

  var Loader = /*#__PURE__*/function () {
    function Loader() {
      _classCallCheck(this, Loader);

      this.baseURL = "https://unpkg.com/iblize/dist/";
      this.themes = [];
    }

    _createClass(Loader, [{
      key: "loadLanguage",
      value: function loadLanguage(name, path, callback) {
        var require = languages.require,
            aliases = languages.aliases;

        if (name in aliases) {
          // if language name is alias 
          // change with real name
          name = aliases[name];
        }

        if (name in Prism.languages) {
          // if language is exist stop 
          // execution and run callback
          return callback();
        }

        if (path == "") {
          path = this.baseURL + "languages/";
        }

        if (name in require) {
          // load language depedencies if required
          if (!Array.isArray(require[name])) {
            require[name] = [require[name]];
          }

          require[name].forEach(function (require) {
            if (require in Prism.languages) return;
            createScript(require);
          });
        } // load language


        createScript(name, callback);

        function createScript(name) {
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
          var script = dom.create("script", {
            parent: document.body,
            src: path + name + ".js",
            onload: function onload() {
              script.remove();
              callback();
            }
          });
        }
      }
    }, {
      key: "loadTheme",
      value: function loadTheme(name, path) {
        if (path == "") {
          path = this.baseURL + "themes/";
        }

        if (this.themes.includes(name)) {
          // if theme is exist, just update path/url.
          var link = dom.select("link[theme=\"".concat(name, "\"]"));
          return link.href = path + name + ".css";
        }

        var ref = dom.select("#iblize-base");
        ref.after(dom.create("link", {
          rel: "stylesheet",
          href: path + name + ".css",
          attr: {
            theme: name
          }
        }));
        this.themes.push(name);
      }
    }]);

    return Loader;
  }();

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".iblize{font:14px/1.75 Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;color:#3d525c;width:100%;height:100%;display:flex;position:relative;overflow:hidden}.iblize,.iblize *{box-sizing:border-box}.iblize *{font:inherit}.iblize_linenumber{display:flex;flex-direction:column}.iblize_linenumber_child{text-align:right;width:100%}.iblize_content{flex-grow:1;height:100%;position:relative;overflow:hidden}.iblize_pre,.iblize_textarea{width:100%;height:100%;padding:0;margin:0}.iblize_textarea{color:transparent;caret-color:#3d525c;white-space:pre;border:none;outline:none;background-color:transparent;position:relative;z-index:2;resize:none}.iblize_pre{position:absolute;top:0;left:0;pointer-events:none}";
  n(css,{"prepend":true,"attributes":{"id":"iblize-base"}});

  var Iblize = /*#__PURE__*/function () {
    function Iblize() {
      var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Iblize);

      this.version = "2.0.3";
      this.history = new History(this);
      this.loader = new Loader();

      if (container instanceof HTMLElement) {
        this.elementRoot = container;
      } else {
        this.elementRoot = dom.select(container);
      }

      if (!this.elementRoot) {
        throw Error("Iblize can't find the editor containers");
      } // default options


      this.options = {
        language: "javascript",
        languagesPath: "",
        lineNumber: true,
        readOnly: false,
        tabSize: 2,
        theme: "iblize-dark",
        themesPath: ""
      }; // prepare the editor

      this.setupEditor();
      this.setValue(null);
      this.loadTheme();
      this.loadLanguage();
      this.setOptions(options);
    } // Setup Editor


    _createClass(Iblize, [{
      key: "setupEditor",
      value: function setupEditor() {
        this.createEditorElement();
        this.attachTextareaEvent();
      }
    }, {
      key: "createEditorElement",
      value: function createEditorElement() {
        this.elementWrapper = dom.create("div", {
          parent: this.elementRoot,
          className: "iblize ".concat(this.options.theme)
        });
        this.elementLinenumber = dom.create("div", {
          parent: this.elementWrapper,
          className: "iblize_linenumber"
        });
        this.elementContent = dom.create("div", {
          parent: this.elementWrapper,
          className: "iblize_content"
        });
        this.elementPre = dom.create("pre", {
          parent: this.elementContent,
          className: "iblize_pre"
        });
        this.elementCode = dom.create("code", {
          parent: this.elementPre,
          className: "iblize_code"
        });
        this.elementTextarea = dom.create("textarea", {
          parent: this.elementContent,
          className: "iblize_textarea",
          attr: {
            spellcheck: "false",
            autocorrect: "off",
            autocomplete: "off",
            autocapitalize: "off"
          }
        });
      }
    }, {
      key: "attachTextareaEvent",
      value: function attachTextareaEvent() {
        dom.addEvent(this.elementTextarea, [{
          name: "input",
          callback: this.handleInput.bind(this)
        }, {
          name: "keydown",
          callback: this.handleKeydown.bind(this)
        }, {
          name: "scroll",
          callback: this.handleScroll.bind(this)
        }]);
      } // Textarea Event Handler

    }, {
      key: "handleScroll",
      value: function handleScroll() {
        var _this$elementTextarea = this.elementTextarea,
            width = _this$elementTextarea.scrollWidth,
            height = _this$elementTextarea.scrollHeight,
            top = _this$elementTextarea.scrollTop,
            left = _this$elementTextarea.scrollLeft;
        dom.addStyle(this.elementLinenumber, {
          height: height + "px",
          transform: "translateY(".concat(top * -1, "px)")
        });
        dom.addStyle(this.elementPre, {
          width: width + "px",
          height: height + "px",
          transform: "translate(".concat(left * -1, "px, ").concat(top * -1, "px)")
        });
      }
    }, {
      key: "handleInput",
      value: function handleInput() {
        var _this = this;

        if (this.typingTimeout != undefined) {
          clearTimeout(this.typingTimeout);
        }

        this.typingTimeout = setTimeout(function () {
          _this.recordHistory();
        }, 150);

        if (this.onUpdateCallback != undefined) {
          // run on update callback if exist
          this.onUpdateCallback(this.getValue());
        }

        this.closeCharacter();
        this.updateEditor();
      }
    }, {
      key: "handleKeydown",
      value: function handleKeydown(event) {
        if (event.key == "Tab") {
          event.preventDefault();
          this.insertTab();
        }

        if (event.keyCode == 13 || event.key == "Enter") {
          event.preventDefault();
          this.addLineIndent();
        }

        if (event.ctrlKey && event.key == "z") {
          event.preventDefault();
          this.undo();
        }

        if (event.ctrlKey && event.shiftKey && event.key == "Z") {
          event.preventDefault();
          this.redo();
        }
      } // Editor Internal Method

    }, {
      key: "updateEditor",
      value: function updateEditor() {
        this.countLinenumber();
        this.highlightSyntax();
      }
    }, {
      key: "countLinenumber",
      value: function countLinenumber() {
        var totalLines = this.getTotalLine();
        var childLength = this.elementLinenumber.childElementCount;

        if (totalLines != childLength && this.options.lineNumber) {
          var child = "";

          for (var i = 0; i < totalLines; i++) {
            child += "<span class=\"iblize_linenumber_child\">".concat(i + 1, "</span>");
          }

          this.elementLinenumber.innerHTML = child;
        }
      }
    }, {
      key: "highlightSyntax",
      value: function highlightSyntax() {
        var input = this.getValue();
        var language = this.options.language;
        var grammar = Prism$1.languages[language];

        if (grammar == undefined) {
          grammar = Prism$1.languages["plaintext"];
        }

        var output = Prism$1.highlight(input, grammar, language);
        this.elementCode.innerHTML = output;
      } // Editor Internal Method

    }, {
      key: "addLineIndent",
      value: function addLineIndent() {
        var cursor = this.getCursor();
        var value = this.getValue(); // get indent length from current active line

        var activeLine = this.getActiveLine();
        var lineValue = this.getLineValue(activeLine);
        var lineIndent = lineValue.match(/^\s{1,}/); // get the characters from before and after cursor

        var charBefore = value.charAt(cursor - 1);
        var charAfter = value.charAt(cursor);
        var indent = lineIndent == null ? 0 : lineIndent[0].length;

        if (charBefore == "(" && charAfter == ")" || charBefore == "{" && charAfter == "}" || charBefore == "[" && charAfter == "]" || charBefore == ">" && charAfter == "<") {
          var tabSize = this.options.tabSize;
          var string = "\n" + " ".repeat(indent + tabSize) + "\n" + " ".repeat(indent);
          this.insertText(cursor, string, {
            moveCursor: cursor + indent + tabSize + 1,
            recordHistory: "both"
          });
        } else {
          this.insertText(cursor, "\n" + " ".repeat(indent), {
            moveCursor: cursor + indent + 1,
            recordHistory: "both"
          });
        }
      }
    }, {
      key: "closeCharacter",
      value: function closeCharacter() {
        var _this2 = this;

        var cursor = this.getCursor();
        var value = this.getValue(); // get the characters from before and after cursor

        var charBefore = value.charAt(cursor - 1);
        var charAfter = value.charAt(cursor);
        var charList = [{
          open: "(",
          close: ")"
        }, {
          open: "{",
          close: "}"
        }, {
          open: "[",
          close: "]"
        }, {
          open: "<",
          close: ">"
        }, {
          open: "'",
          close: "'"
        }, {
          open: '"',
          close: '"'
        }, {
          open: "`",
          close: "`"
        }];

        if (!this.valueLengthReminder) {
          // make reminder for value length
          // to compare with current value.
          // to detect backspace on mobile browser.
          this.valueLengthReminder = 0;
        }

        if (value.length > this.valueLengthReminder) {
          charList.forEach(function (_char) {
            // skip char
            if (charBefore == _char.close && charAfter == _char.close) {
              _this2.removeText(cursor, cursor + 1);

              return;
            } // closing char


            if (charBefore == _char.open) {
              _this2.insertText(cursor, _char.close, {
                moveCursor: cursor
              });
            }
          });
        } else {
          // previous history before deleted
          var lastHistory = this.history.stack.slice(-1)[0].value;
          var previousChar = lastHistory.charAt(cursor);
          charList.forEach(function (_char2) {
            // delete char
            if (previousChar == _char2.open && charAfter == _char2.close) {
              _this2.removeText(cursor, cursor + 1);
            }
          });
        }

        this.valueLengthReminder = value.length;
      }
    }, {
      key: "valueFromComment",
      value: function valueFromComment() {
        var root = this.elementRoot;
        var what = NodeFilter.SHOW_COMMENT;
        var iterator = document.createNodeIterator(root, what);
        var comment = iterator.nextNode();

        if (comment != null) {
          return comment.nodeValue.replace(/\r?\n/, "");
        }

        return "";
      }
    }, {
      key: "recordHistory",
      value: function recordHistory() {
        var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (meta.cursor == undefined) {
          meta.cursor = this.getCursor();
        }

        if (meta.value == undefined) {
          meta.value = this.getValue();
        }

        this.history.record(meta.cursor, meta.value);
      }
    }, {
      key: "optionsValidator",
      value: function optionsValidator(options) {
        var _this3 = this;

        Object.entries(options).forEach(function (option) {
          var _option = _slicedToArray(option, 2),
              key = _option[0],
              value = _option[1];

          if (!_this3.options.hasOwnProperty(key)) {
            throw Error("Invalid Iblize option! unknown option {".concat(key, "}"));
          }

          var valueType = _typeof(_this3.options[key]);

          if (_typeof(value) != valueType) {
            throw Error("Invalid Iblize option! {".concat(key, "} value must be a ").concat(valueType));
          }
        });
      }
    }, {
      key: "loadLanguage",
      value: function loadLanguage() {
        var name = this.options.language;
        var path = this.options.languagesPath;
        var callback = this.highlightSyntax;
        this.loader.loadLanguage(name, path, callback.bind(this));
      }
    }, {
      key: "loadTheme",
      value: function loadTheme() {
        var name = this.options.theme;
        var path = this.options.themesPath;
        this.loader.loadTheme(name, path);
      } // Editor Event

    }, {
      key: "onUpdate",
      value: function onUpdate(callback) {
        if (typeof callback != "function") {
          throw Error("Invalid `onUpdate()` callback parameter! callback must be a function.");
        }

        this.onUpdateCallback = callback;
      } // Editor Public API

    }, {
      key: "getValue",
      value: function getValue() {
        var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var value = this.elementTextarea.value;

        if (from != null && to != null) {
          return value.substring(from, to);
        }

        if (from != null && to == null) {
          return value.substring(from);
        }

        return value;
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        var recordHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (value != null) {
          this.elementTextarea.value = value;
        } else {
          this.elementTextarea.value = this.valueFromComment();
        }

        this.updateEditor();
        if (recordHistory) this.recordHistory();
      }
    }, {
      key: "getOptions",
      value: function getOptions() {
        return this.options;
      }
    }, {
      key: "setOptions",
      value: function setOptions(options) {
        // run options validator
        this.optionsValidator(options); // assign new options

        Object.assign(this.options, options); // update element

        if (options.theme != undefined || options.themesPath != undefined) {
          this.elementWrapper.className = "iblize ".concat(this.options.theme);
          this.loadTheme();
        }

        if (options.language != undefined || options.languagesPath != undefined) {
          this.loadLanguage();
        }

        if (options.readOnly != undefined) {
          this.elementTextarea.readOnly = this.options.readOnly;
        }

        if (options.lineNumber != undefined) {
          this.elementLinenumber.style.display = this.options.lineNumber ? "" : "none";
          this.countLinenumber();
        }
      }
    }, {
      key: "getSelection",
      value: function getSelection() {
        var _this$elementTextarea2 = this.elementTextarea,
            start = _this$elementTextarea2.selectionStart,
            end = _this$elementTextarea2.selectionEnd,
            dir = _this$elementTextarea2.selectionDirection;
        return {
          start: start,
          end: end,
          dir: dir
        };
      }
    }, {
      key: "setSelection",
      value: function setSelection(start, end) {
        var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "none";
        this.elementTextarea.setSelectionRange(start, end, dir);
      }
    }, {
      key: "getCursor",
      value: function getCursor() {
        return this.getSelection().start;
      }
    }, {
      key: "setCursor",
      value: function setCursor(pos) {
        this.setSelection(pos, pos);
      }
    }, {
      key: "getActiveLine",
      value: function getActiveLine() {
        var cursor = this.getCursor();
        var value = this.getValue(0, cursor);
        return value.split("\n").length;
      }
    }, {
      key: "getTotalLine",
      value: function getTotalLine() {
        var value = this.getValue();
        return value.split("\n").length;
      }
    }, {
      key: "getLineValue",
      value: function getLineValue(line) {
        var value = this.getValue();
        return value.split("\n")[line - 1];
      }
    }, {
      key: "insertTab",
      value: function insertTab() {
        var cursor = this.getCursor();
        var tabSize = this.options.tabSize;
        this.insertText(cursor, " ".repeat(tabSize), {
          recordHistory: "both"
        });
      }
    }, {
      key: "insertText",
      value: function insertText(from, text) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var valueBefore = this.getValue(0, from);
        var valueAfter = this.getValue(from);
        var record = options.recordHistory || "after";
        var cursor = options.moveCursor || from + text.length;

        if (record == "before" || record == "both") {
          this.recordHistory();
        }

        this.setValue(valueBefore + text + valueAfter, false);
        this.setCursor(cursor);

        if (record == "after" || record == "both") {
          this.recordHistory();
        }
      }
    }, {
      key: "removeText",
      value: function removeText(from, to) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var valueBefore = this.getValue(0, from);
        var valueAfter = this.getValue(to);
        var record = options.recordHistory || "after";
        var cursor = options.moveCursor || from;

        if (record == "before" || record == "both") {
          this.recordHistory();
        }

        this.setValue(valueBefore + valueAfter, false);
        this.setCursor(cursor);

        if (record == "after" || record == "both") {
          this.recordHistory();
        }
      }
    }, {
      key: "undo",
      value: function undo() {
        this.history.undo();
      }
    }, {
      key: "redo",
      value: function redo() {
        this.history.redo();
      }
    }]);

    return Iblize;
  }();

  return Iblize;

}));
//# sourceMappingURL=iblize.js.map
