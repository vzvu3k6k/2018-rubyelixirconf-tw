/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "data:application/vnd.ms-fontobject;base64,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"

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reveal_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reveal_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reveal_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reveal_js_css_reveal_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reveal_js_css_reveal_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_reveal_js_css_reveal_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_reveal_js_css_theme_solarized_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_reveal_js_css_theme_solarized_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_reveal_js_css_theme_solarized_css__);




__WEBPACK_IMPORTED_MODULE_0_reveal_js___default.a.initialize({
    // Display presentation control arrows
    controls: true,

    // Help the user learn the controls by providing hints, for example by
    // bouncing the down arrow when they first encounter a vertical slide
    controlsTutorial: true,

    // Determines where controls appear, "edges" or "bottom-right"
    controlsLayout: 'bottom-right',

    // Visibility rule for backwards navigation arrows; "faded", "hidden"
    // or "visible"
    controlsBackArrows: 'faded',

    // Display a presentation progress bar
    progress: true,

    // Set default timing of 2 minutes per slide
    defaultTiming: 120,

    // Display the page number of the current slide
    slideNumber: false,

    // Push each slide change to the browser history
    history: false,

    // Enable keyboard shortcuts for navigation
    keyboard: true,

    // Enable the slide overview mode
    overview: true,

    // Vertical centering of slides
    center: true,

    // Enables touch navigation on devices with touch input
    touch: true,

    // Loop the presentation
    loop: false,

    // Change the presentation direction to be RTL
    rtl: false,

    // Randomizes the order of slides each time the presentation loads
    shuffle: false,

    // Turns fragments on and off globally
    fragments: true,

    // Flags if the presentation is running in an embedded mode,
    // i.e. contained within a limited portion of the screen
    embedded: false,

    // Flags if we should show a help overlay when the questionmark
    // key is pressed
    help: true,

    // Flags if speaker notes should be visible to all viewers
    showNotes: false,

    // Global override for autoplaying embedded media (video/audio/iframe)
    // - null: Media will only autoplay if data-autoplay is present
    // - true: All media will autoplay, regardless of individual setting
    // - false: No media will autoplay, regardless of individual setting
    autoPlayMedia: null,

    // Number of milliseconds between automatically proceeding to the
    // next slide, disabled when set to 0, this value can be overwritten
    // by using a data-autoslide attribute on your slides
    autoSlide: 0,

    // Stop auto-sliding after user input
    autoSlideStoppable: true,

    // Use this method for navigation when auto-sliding
    autoSlideMethod: __WEBPACK_IMPORTED_MODULE_0_reveal_js___default.a.navigateNext,

    // Enable slide navigation via mouse wheel
    mouseWheel: false,

    // Hides the address bar on mobile devices
    hideAddressBar: true,

    // Opens links in an iframe preview overlay
    previewLinks: false,

    // Transition style
    transition: 'slide', // none/fade/slide/convex/concave/zoom

    // Transition speed
    transitionSpeed: 'default', // default/fast/slow

    // Transition style for full page slide backgrounds
    backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

    // Number of slides away from the current that are visible
    viewDistance: 3,

    // Parallax background image
    parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

    // Parallax background size
    parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

    // Number of pixels to move the parallax background per slide
    // - Calculated automatically unless specified
    // - Set to 0 to disable movement along an axis
    parallaxBackgroundHorizontal: null,
    parallaxBackgroundVertical: null,

    // The display mode that will be used to show slides
    display: 'block'
 });


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * reveal.js
 * http://revealjs.com
 * MIT licensed
 *
 * Copyright (C) 2017 Hakim El Hattab, http://hakim.se
 */
(function( root, factory ) {
	if( true ) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			root.Reveal = factory();
			return root.Reveal;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if( typeof exports === 'object' ) {
		// Node. Does not work with strict CommonJS.
		module.exports = factory();
	} else {
		// Browser globals.
		root.Reveal = factory();
	}
}( this, function() {

	'use strict';

	var Reveal;

	// The reveal.js version
	var VERSION = '3.6.0';

	var SLIDES_SELECTOR = '.slides section',
		HORIZONTAL_SLIDES_SELECTOR = '.slides>section',
		VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section',
		HOME_SLIDE_SELECTOR = '.slides>section:first-of-type',
		UA = navigator.userAgent,

		// Configuration defaults, can be overridden at initialization time
		config = {

			// The "normal" size of the presentation, aspect ratio will be preserved
			// when the presentation is scaled to fit different resolutions
			width: 960,
			height: 700,

			// Factor of the display size that should remain empty around the content
			margin: 0.04,

			// Bounds for smallest/largest possible scale to apply to content
			minScale: 0.2,
			maxScale: 2.0,

			// Display presentation control arrows
			controls: true,

			// Help the user learn the controls by providing hints, for example by
			// bouncing the down arrow when they first encounter a vertical slide
			controlsTutorial: true,

			// Determines where controls appear, "edges" or "bottom-right"
			controlsLayout: 'bottom-right',

			// Visibility rule for backwards navigation arrows; "faded", "hidden"
			// or "visible"
			controlsBackArrows: 'faded',

			// Display a presentation progress bar
			progress: true,

			// Display the page number of the current slide
			slideNumber: false,

			// Determine which displays to show the slide number on
			showSlideNumber: 'all',

			// Push each slide change to the browser history
			history: false,

			// Enable keyboard shortcuts for navigation
			keyboard: true,

			// Optional function that blocks keyboard events when retuning false
			keyboardCondition: null,

			// Enable the slide overview mode
			overview: true,

			// Vertical centering of slides
			center: true,

			// Enables touch navigation on devices with touch input
			touch: true,

			// Loop the presentation
			loop: false,

			// Change the presentation direction to be RTL
			rtl: false,

			// Randomizes the order of slides each time the presentation loads
			shuffle: false,

			// Turns fragments on and off globally
			fragments: true,

			// Flags if the presentation is running in an embedded mode,
			// i.e. contained within a limited portion of the screen
			embedded: false,

			// Flags if we should show a help overlay when the question-mark
			// key is pressed
			help: true,

			// Flags if it should be possible to pause the presentation (blackout)
			pause: true,

			// Flags if speaker notes should be visible to all viewers
			showNotes: false,

			// Global override for autolaying embedded media (video/audio/iframe)
			// - null:   Media will only autoplay if data-autoplay is present
			// - true:   All media will autoplay, regardless of individual setting
			// - false:  No media will autoplay, regardless of individual setting
			autoPlayMedia: null,

			// Controls automatic progression to the next slide
			// - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
			//           is present on the current slide or fragment
			// - 1+:     All slides will progress automatically at the given interval
			// - false:  No auto-sliding, even if data-autoslide is present
			autoSlide: 0,

			// Stop auto-sliding after user input
			autoSlideStoppable: true,

			// Use this method for navigation when auto-sliding (defaults to navigateNext)
			autoSlideMethod: null,

			// Enable slide navigation via mouse wheel
			mouseWheel: false,

			// Apply a 3D roll to links on hover
			rollingLinks: false,

			// Hides the address bar on mobile devices
			hideAddressBar: true,

			// Opens links in an iframe preview overlay
			previewLinks: false,

			// Exposes the reveal.js API through window.postMessage
			postMessage: true,

			// Dispatches all reveal.js events to the parent window through postMessage
			postMessageEvents: false,

			// Focuses body when page changes visibility to ensure keyboard shortcuts work
			focusBodyOnPageVisibilityChange: true,

			// Transition style
			transition: 'slide', // none/fade/slide/convex/concave/zoom

			// Transition speed
			transitionSpeed: 'default', // default/fast/slow

			// Transition style for full page slide backgrounds
			backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

			// Parallax background image
			parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

			// Parallax background size
			parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

			// Amount of pixels to move the parallax background per slide step
			parallaxBackgroundHorizontal: null,
			parallaxBackgroundVertical: null,

			// The maximum number of pages a single slide can expand onto when printing
			// to PDF, unlimited by default
			pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

			// Offset used to reduce the height of content within exported PDF pages.
			// This exists to account for environment differences based on how you
			// print to PDF. CLI printing options, like phantomjs and wkpdf, can end
			// on precisely the total height of the document whereas in-browser
			// printing has to end one pixel before.
			pdfPageHeightOffset: -1,

			// Number of slides away from the current that are visible
			viewDistance: 3,

			// The display mode that will be used to show slides
			display: 'block',

			// Script dependencies to load
			dependencies: []

		},

		// Flags if Reveal.initialize() has been called
		initialized = false,

		// Flags if reveal.js is loaded (has dispatched the 'ready' event)
		loaded = false,

		// Flags if the overview mode is currently active
		overview = false,

		// Holds the dimensions of our overview slides, including margins
		overviewSlideWidth = null,
		overviewSlideHeight = null,

		// The horizontal and vertical index of the currently active slide
		indexh,
		indexv,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		previousBackground,

		// Remember which directions that the user has navigated towards
		hasNavigatedRight = false,
		hasNavigatedDown = false,

		// Slides may hold a data-state attribute which we pick up and apply
		// as a class to the body. This list contains the combined state of
		// all current slides.
		state = [],

		// The current scale of the presentation (see width/height config)
		scale = 1,

		// CSS transform that is currently applied to the slides container,
		// split into two groups
		slidesTransform = { layout: '', overview: '' },

		// Cached references to DOM elements
		dom = {},

		// Features supported by the browser, see #checkCapabilities()
		features = {},

		// Client is a mobile device, see #checkCapabilities()
		isMobileDevice,

		// Client is a desktop Chrome, see #checkCapabilities()
		isChrome,

		// Throttles mouse wheel navigation
		lastMouseWheelStep = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Flags if the interaction event listeners are bound
		eventsAreBound = false,

		// The current auto-slide duration
		autoSlide = 0,

		// Auto slide properties
		autoSlidePlayer,
		autoSlideTimeout = 0,
		autoSlideStartTime = -1,
		autoSlidePaused = false,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startSpan: 0,
			startCount: 0,
			captured: false,
			threshold: 40
		},

		// Holds information about the keyboard shortcuts
		keyboardShortcuts = {
			'N  ,  SPACE':			'Next slide',
			'P':					'Previous slide',
			'&#8592;  ,  H':		'Navigate left',
			'&#8594;  ,  L':		'Navigate right',
			'&#8593;  ,  K':		'Navigate up',
			'&#8595;  ,  J':		'Navigate down',
			'Home':					'First slide',
			'End':					'Last slide',
			'B  ,  .':				'Pause',
			'F':					'Fullscreen',
			'ESC, O':				'Slide overview'
		};

	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize( options ) {

		// Make sure we only initialize once
		if( initialized === true ) return;

		initialized = true;

		checkCapabilities();

		if( !features.transforms2d && !features.transforms3d ) {
			document.body.setAttribute( 'class', 'no-transforms' );

			// Since JS won't be running any further, we load all lazy
			// loading elements upfront
			var images = toArray( document.getElementsByTagName( 'img' ) ),
				iframes = toArray( document.getElementsByTagName( 'iframe' ) );

			var lazyLoadable = images.concat( iframes );

			for( var i = 0, len = lazyLoadable.length; i < len; i++ ) {
				var element = lazyLoadable[i];
				if( element.getAttribute( 'data-src' ) ) {
					element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
					element.removeAttribute( 'data-src' );
				}
			}

			// If the browser doesn't support core features we won't be
			// using JavaScript to control the presentation
			return;
		}

		// Cache references to key DOM elements
		dom.wrapper = document.querySelector( '.reveal' );
		dom.slides = document.querySelector( '.reveal .slides' );

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener( 'load', layout, false );

		var query = Reveal.getQueryHash();

		// Do not accept new dependencies via query config to avoid
		// the potential of malicious script injection
		if( typeof query['dependencies'] !== 'undefined' ) delete query['dependencies'];

		// Copy options over to our config object
		extend( config, options );
		extend( config, query );

		// Hide the address bar in mobile browsers
		hideAddressBar();

		// Loads the dependencies and continues to #start() once done
		load();

	}

	/**
	 * Inspect the client to see what it's capable of, this
	 * should only happens once per runtime.
	 */
	function checkCapabilities() {

		isMobileDevice = /(iphone|ipod|ipad|android)/gi.test( UA );
		isChrome = /chrome/i.test( UA ) && !/edge/i.test( UA );

		var testElement = document.createElement( 'div' );

		features.transforms3d = 'WebkitPerspective' in testElement.style ||
								'MozPerspective' in testElement.style ||
								'msPerspective' in testElement.style ||
								'OPerspective' in testElement.style ||
								'perspective' in testElement.style;

		features.transforms2d = 'WebkitTransform' in testElement.style ||
								'MozTransform' in testElement.style ||
								'msTransform' in testElement.style ||
								'OTransform' in testElement.style ||
								'transform' in testElement.style;

		features.requestAnimationFrameMethod = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
		features.requestAnimationFrame = typeof features.requestAnimationFrameMethod === 'function';

		features.canvas = !!document.createElement( 'canvas' ).getContext;

		// Transitions in the overview are disabled in desktop and
		// Safari due to lag
		features.overviewTransitions = !/Version\/[\d\.]+.*Safari/.test( UA );

		// Flags if we should use zoom instead of transform to scale
		// up slides. Zoom produces crisper results but has a lot of
		// xbrowser quirks so we only use it in whitelsited browsers.
		features.zoom = 'zoom' in testElement.style && !isMobileDevice &&
						( isChrome || /Version\/[\d\.]+.*Safari/.test( UA ) );

	}

    /**
     * Loads the dependencies of reveal.js. Dependencies are
     * defined via the configuration option 'dependencies'
     * and will be loaded prior to starting/binding reveal.js.
     * Some dependencies may have an 'async' flag, if so they
     * will load after reveal.js has been started up.
     */
	function load() {

		var scripts = [],
			scriptsAsync = [],
			scriptsToPreload = 0;

		// Called once synchronous scripts finish loading
		function proceed() {
			if( scriptsAsync.length ) {
				// Load asynchronous scripts
				head.js.apply( null, scriptsAsync );
			}

			start();
		}

		function loadScript( s ) {
			head.ready( s.src.match( /([\w\d_\-]*)\.?js$|[^\\\/]*$/i )[0], function() {
				// Extension may contain callback functions
				if( typeof s.callback === 'function' ) {
					s.callback.apply( this );
				}

				if( --scriptsToPreload === 0 ) {
					proceed();
				}
			});
		}

		for( var i = 0, len = config.dependencies.length; i < len; i++ ) {
			var s = config.dependencies[i];

			// Load if there's no condition or the condition is truthy
			if( !s.condition || s.condition() ) {
				if( s.async ) {
					scriptsAsync.push( s.src );
				}
				else {
					scripts.push( s.src );
				}

				loadScript( s );
			}
		}

		if( scripts.length ) {
			scriptsToPreload = scripts.length;

			// Load synchronous scripts
			head.js.apply( null, scripts );
		}
		else {
			proceed();
		}

	}

	/**
	 * Starts up reveal.js by binding input events and navigating
	 * to the current URL deeplink if there is one.
	 */
	function start() {

		loaded = true;

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground( true );

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( function() {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove( 'no-transition' );

			dom.wrapper.classList.add( 'ready' );

			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );

		// Special setup and config is required when printing to PDF
		if( isPrintingPDF() ) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if( document.readyState === 'complete' ) {
				setupPDF();
			}
			else {
				window.addEventListener( 'load', setupPDF );
			}
		}

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add( 'no-transition' );

		if( isMobileDevice ) {
			dom.wrapper.classList.add( 'no-hover' );
		}
		else {
			dom.wrapper.classList.remove( 'no-hover' );
		}

		if( /iphone/gi.test( UA ) ) {
			dom.wrapper.classList.add( 'ua-iphone' );
		}
		else {
			dom.wrapper.classList.remove( 'ua-iphone' );
		}

		// Background element
		dom.background = createSingletonNode( dom.wrapper, 'div', 'backgrounds', null );

		// Progress bar
		dom.progress = createSingletonNode( dom.wrapper, 'div', 'progress', '<span></span>' );
		dom.progressbar = dom.progress.querySelector( 'span' );

		// Arrow controls
		dom.controls = createSingletonNode( dom.wrapper, 'aside', 'controls',
			'<button class="navigate-left" aria-label="previous slide"><div class="controls-arrow"></div></button>' +
			'<button class="navigate-right" aria-label="next slide"><div class="controls-arrow"></div></button>' +
			'<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>' +
			'<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>' );

		// Slide number
		dom.slideNumber = createSingletonNode( dom.wrapper, 'div', 'slide-number', '' );

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode( dom.wrapper, 'div', 'speaker-notes', null );
		dom.speakerNotes.setAttribute( 'data-prevent-swipe', '' );
		dom.speakerNotes.setAttribute( 'tabindex', '0' );

		// Overlay graphic which is displayed during the paused mode
		createSingletonNode( dom.wrapper, 'div', 'pause-overlay', null );

		dom.wrapper.setAttribute( 'role', 'application' );

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray( document.querySelectorAll( '.navigate-left' ) );
		dom.controlsRight = toArray( document.querySelectorAll( '.navigate-right' ) );
		dom.controlsUp = toArray( document.querySelectorAll( '.navigate-up' ) );
		dom.controlsDown = toArray( document.querySelectorAll( '.navigate-down' ) );
		dom.controlsPrev = toArray( document.querySelectorAll( '.navigate-prev' ) );
		dom.controlsNext = toArray( document.querySelectorAll( '.navigate-next' ) );

		// The right and down arrows in the standard reveal.js controls
		dom.controlsRightArrow = dom.controls.querySelector( '.navigate-right' );
		dom.controlsDownArrow = dom.controls.querySelector( '.navigate-down' );

		dom.statusDiv = createStatusDiv();
	}

	/**
	 * Creates a hidden div with role aria-live to announce the
	 * current slide content. Hide the div off-screen to make it
	 * available only to Assistive Technologies.
	 *
	 * @return {HTMLElement}
	 */
	function createStatusDiv() {

		var statusDiv = document.getElementById( 'aria-status-div' );
		if( !statusDiv ) {
			statusDiv = document.createElement( 'div' );
			statusDiv.style.position = 'absolute';
			statusDiv.style.height = '1px';
			statusDiv.style.width = '1px';
			statusDiv.style.overflow = 'hidden';
			statusDiv.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusDiv.setAttribute( 'id', 'aria-status-div' );
			statusDiv.setAttribute( 'aria-live', 'polite' );
			statusDiv.setAttribute( 'aria-atomic','true' );
			dom.wrapper.appendChild( statusDiv );
		}
		return statusDiv;

	}

	/**
	 * Converts the given HTML element into a string of text
	 * that can be announced to a screen reader. Hidden
	 * elements are excluded.
	 */
	function getStatusText( node ) {

		var text = '';

		// Text node
		if( node.nodeType === 3 ) {
			text += node.textContent;
		}
		// Element node
		else if( node.nodeType === 1 ) {

			var isAriaHidden = node.getAttribute( 'aria-hidden' );
			var isDisplayHidden = window.getComputedStyle( node )['display'] === 'none';
			if( isAriaHidden !== 'true' && !isDisplayHidden ) {

				toArray( node.childNodes ).forEach( function( child ) {
					text += getStatusText( child );
				} );

			}

		}

		return text;

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	function setupPDF() {

		var slideSize = getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		var pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin ) );

		// Dimensions of slides within the pages
		var slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		injectStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0px;}' );

		// Limit the size of certain elements to the dimensions of the slide
		injectStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.body.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Make sure stretch elements fit on slide
		layoutSlideContents( slideWidth, slideHeight );

		// Add each slide's index as attributes on itself, we need these
		// indices to generate slide numbers below
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );

			if( hslide.classList.contains( 'stack' ) ) {
				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );
				} );
			}
		} );

		// Slide and slide background layout
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				var left = ( pageWidth - slideWidth ) / 2,
					top = ( pageHeight - slideHeight ) / 2;

				var contentHeight = slide.scrollHeight;
				var numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min( numberOfPages, config.pdfMaxPagesPerSlide );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				var page = document.createElement( 'div' );
				page.className = 'pdf-page';
				page.style.height = ( ( pageHeight + config.pdfPageHeightOffset ) * numberOfPages ) + 'px';
				slide.parentNode.insertBefore( page, slide );
				page.appendChild( slide );

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {

					// Are there notes for this slide?
					var notes = getSlideNotes( slide );
					if( notes ) {

						var notesSpacing = 8;
						var notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						var notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.setAttribute( 'data-layout', notesLayout );
						notesElement.innerHTML = notes;

						if( notesLayout === 'separate-page' ) {
							page.parentNode.insertBefore( notesElement, page.nextSibling );
						}
						else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
							page.appendChild( notesElement );
						}

					}

				}

				// Inject slide numbers if `slideNumbers` are enabled
				if( config.slideNumber && /all|print/i.test( config.showSlideNumber ) ) {
					var slideNumberH = parseInt( slide.getAttribute( 'data-index-h' ), 10 ) + 1,
						slideNumberV = parseInt( slide.getAttribute( 'data-index-v' ), 10 ) + 1;

					var numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = formatSlideNumber( slideNumberH, '.', slideNumberV );
					page.appendChild( numberElement );
				}
			}

		} );

		// Show all fragments
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' .fragment' ) ).forEach( function( fragment ) {
			fragment.classList.add( 'visible' );
		} );

		// Notify subscribers that the PDF layout is good to go
		dispatchEvent( 'pdf-ready' );

	}

	/**
	 * This is an unfortunate necessity. Some actions – such as
	 * an input field being focused in an iframe or using the
	 * keyboard to expand text selection beyond the bounds of
	 * a slide – can trigger our content to be pushed out of view.
	 * This scrolling can not be prevented by hiding overflow in
	 * CSS (we already do) so we have to resort to repeatedly
	 * checking if the slides have been offset :(
	 */
	function setupScrollPrevention() {

		setInterval( function() {
			if( dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0 ) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000 );

	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 *
	 * @param {HTMLElement} container
	 * @param {string} tagname
	 * @param {string} classname
	 * @param {string} innerHTML
	 *
	 * @return {HTMLElement}
	 */
	function createSingletonNode( container, tagname, classname, innerHTML ) {

		// Find all nodes matching the description
		var nodes = container.querySelectorAll( '.' + classname );

		// Check all matches to find one which is a direct child of
		// the specified container
		for( var i = 0; i < nodes.length; i++ ) {
			var testNode = nodes[i];
			if( testNode.parentNode === container ) {
				return testNode;
			}
		}

		// If no node was found, create it now
		var node = document.createElement( tagname );
		node.className = classname;
		if( typeof innerHTML === 'string' ) {
			node.innerHTML = innerHTML;
		}
		container.appendChild( node );

		return node;

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	function createBackgrounds() {

		var printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( slideh ) {

			var backgroundStack = createBackground( slideh, dom.background );

			// Iterate over all vertical slides
			toArray( slideh.querySelectorAll( 'section' ) ).forEach( function( slidev ) {

				createBackground( slidev, backgroundStack );

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( config.parallaxBackgroundImage ) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( function() {
				dom.wrapper.classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove( 'has-parallax-background' );

		}

	}

	/**
	 * Creates a background for the given slide.
	 *
	 * @param {HTMLElement} slide
	 * @param {HTMLElement} container The element that the background
	 * should be appended to
	 * @return {HTMLElement} New background div
	 */
	function createBackground( slide, container ) {

		var data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' )
		};

		var element = document.createElement( 'div' );

		// Carry over custom classes from the slide to the background
		element.className = 'slide-background ' + slide.className.replace( /present|past|future/, '' );

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp)([?#]|$)/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.style.backgroundSize = data.backgroundSize;
		if( data.backgroundSize ) element.setAttribute( 'data-background-size', data.backgroundSize );
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundRepeat ) element.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) element.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		container.appendChild( element );

		// If backgrounds are being recreated, clear old classes
		slide.classList.remove( 'has-dark-background' );
		slide.classList.remove( 'has-light-background' );

		slide.slideBackgroundElement = element;

		// If this slide has a background color, add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be set
		var computedBackgroundStyle = window.getComputedStyle( element );
		if( computedBackgroundStyle && computedBackgroundStyle.backgroundColor ) {
			var rgb = colorToRgb( computedBackgroundStyle.backgroundColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( computedBackgroundStyle.backgroundColor ) < 128 ) {
					slide.classList.add( 'has-dark-background' );
				}
				else {
					slide.classList.add( 'has-light-background' );
				}
			}
		}

		return element;

	}

	/**
	 * Registers a listener to postMessage events, this makes it
	 * possible to call all reveal.js API methods from another
	 * window. For example:
	 *
	 * revealWindow.postMessage( JSON.stringify({
	 *   method: 'slide',
	 *   args: [ 2 ]
	 * }), '*' );
	 */
	function setupPostMessage() {

		if( config.postMessage ) {
			window.addEventListener( 'message', function ( event ) {
				var data = event.data;

				// Make sure we're dealing with JSON
				if( typeof data === 'string' && data.charAt( 0 ) === '{' && data.charAt( data.length - 1 ) === '}' ) {
					data = JSON.parse( data );

					// Check if the requested method can be found
					if( data.method && typeof Reveal[data.method] === 'function' ) {
						Reveal[data.method].apply( Reveal, data.args );
					}
				}
			}, false );
		}

	}

	/**
	 * Applies the configuration settings from the config
	 * object. May be called multiple times.
	 *
	 * @param {object} options
	 */
	function configure( options ) {

		var oldTransition = config.transition;

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if( typeof options === 'object' ) extend( config, options );

		// Abort if reveal.js hasn't finished loading, config
		// changes will be applied automatically once loading
		// finishes
		if( loaded === false ) return;

		var numberOfSlides = dom.wrapper.querySelectorAll( SLIDES_SELECTOR ).length;

		// Remove the previously configured transition class
		dom.wrapper.classList.remove( oldTransition );

		// Force linear transition based on browser capabilities
		if( features.transforms3d === false ) config.transition = 'linear';

		dom.wrapper.classList.add( config.transition );

		dom.wrapper.setAttribute( 'data-transition-speed', config.transitionSpeed );
		dom.wrapper.setAttribute( 'data-background-transition', config.backgroundTransition );

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';

		dom.controls.setAttribute( 'data-controls-layout', config.controlsLayout );
		dom.controls.setAttribute( 'data-controls-back-arrows', config.controlsBackArrows );

		if( config.shuffle ) {
			shuffle();
		}

		if( config.rtl ) {
			dom.wrapper.classList.add( 'rtl' );
		}
		else {
			dom.wrapper.classList.remove( 'rtl' );
		}

		if( config.center ) {
			dom.wrapper.classList.add( 'center' );
		}
		else {
			dom.wrapper.classList.remove( 'center' );
		}

		// Exit the paused mode if it was configured off
		if( config.pause === false ) {
			resume();
		}

		if( config.showNotes ) {
			dom.speakerNotes.setAttribute( 'data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline' );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		// Rolling 3D links
		if( config.rollingLinks ) {
			enableRollingLinks();
		}
		else {
			disableRollingLinks();
		}

		// Iframe link previews
		if( config.previewLinks ) {
			enablePreviewLinks();
			disablePreviewLinks( '[data-preview-link=false]' );
		}
		else {
			disablePreviewLinks();
			enablePreviewLinks( '[data-preview-link]:not([data-preview-link=false])' );
		}

		// Remove existing auto-slide controls
		if( autoSlidePlayer ) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if( numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable && features.canvas && features.requestAnimationFrame ) {
			autoSlidePlayer = new Playback( dom.wrapper, function() {
				return Math.min( Math.max( ( Date.now() - autoSlideStartTime ) / autoSlide, 0 ), 1 );
			} );

			autoSlidePlayer.on( 'click', onAutoSlidePlayerClick );
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if( config.fragments === false ) {
			toArray( dom.slides.querySelectorAll( '.fragment' ) ).forEach( function( element ) {
				element.classList.add( 'visible' );
				element.classList.remove( 'current-fragment' );
			} );
		}

		// Slide numbers
		var slideNumberDisplay = 'none';
		if( config.slideNumber && !isPrintingPDF() ) {
			if( config.showSlideNumber === 'all' ) {
				slideNumberDisplay = 'block';
			}
			else if( config.showSlideNumber === 'speaker' && isSpeakerNotes() ) {
				slideNumberDisplay = 'block';
			}
		}

		dom.slideNumber.style.display = slideNumberDisplay;

		sync();

	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener( 'hashchange', onWindowHashChange, false );
		window.addEventListener( 'resize', onWindowResize, false );

		if( config.touch ) {
			dom.wrapper.addEventListener( 'touchstart', onTouchStart, false );
			dom.wrapper.addEventListener( 'touchmove', onTouchMove, false );
			dom.wrapper.addEventListener( 'touchend', onTouchEnd, false );

			// Support pointer-style touch interaction as well
			if( window.navigator.pointerEnabled ) {
				// IE 11 uses un-prefixed version of pointer events
				dom.wrapper.addEventListener( 'pointerdown', onPointerDown, false );
				dom.wrapper.addEventListener( 'pointermove', onPointerMove, false );
				dom.wrapper.addEventListener( 'pointerup', onPointerUp, false );
			}
			else if( window.navigator.msPointerEnabled ) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener( 'MSPointerDown', onPointerDown, false );
				dom.wrapper.addEventListener( 'MSPointerMove', onPointerMove, false );
				dom.wrapper.addEventListener( 'MSPointerUp', onPointerUp, false );
			}
		}

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keypress', onDocumentKeyPress, false );
		}

		if( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', onProgressClicked, false );
		}

		if( config.focusBodyOnPageVisibilityChange ) {
			var visibilityChange;

			if( 'hidden' in document ) {
				visibilityChange = 'visibilitychange';
			}
			else if( 'msHidden' in document ) {
				visibilityChange = 'msvisibilitychange';
			}
			else if( 'webkitHidden' in document ) {
				visibilityChange = 'webkitvisibilitychange';
			}

			if( visibilityChange ) {
				document.addEventListener( visibilityChange, onPageVisibilityChange, false );
			}
		}

		// Listen to both touch and click events, in case the device
		// supports both
		var pointerEvents = [ 'touchstart', 'click' ];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if( UA.match( /android/gi ) ) {
			pointerEvents = [ 'touchstart' ];
		}

		pointerEvents.forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.addEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.addEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.addEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.addEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.addEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.addEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {

		eventsAreBound = false;

		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'keypress', onDocumentKeyPress, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		window.removeEventListener( 'resize', onWindowResize, false );

		dom.wrapper.removeEventListener( 'touchstart', onTouchStart, false );
		dom.wrapper.removeEventListener( 'touchmove', onTouchMove, false );
		dom.wrapper.removeEventListener( 'touchend', onTouchEnd, false );

		// IE11
		if( window.navigator.pointerEnabled ) {
			dom.wrapper.removeEventListener( 'pointerdown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'pointermove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'pointerup', onPointerUp, false );
		}
		// IE10
		else if( window.navigator.msPointerEnabled ) {
			dom.wrapper.removeEventListener( 'MSPointerDown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'MSPointerMove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'MSPointerUp', onPointerUp, false );
		}

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', onProgressClicked, false );
		}

		[ 'touchstart', 'click' ].forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.removeEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.removeEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.removeEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.removeEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.removeEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.removeEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Extend object a with the properties of object b.
	 * If there's a conflict, object b takes precedence.
	 *
	 * @param {object} a
	 * @param {object} b
	 */
	function extend( a, b ) {

		for( var i in b ) {
			a[ i ] = b[ i ];
		}

		return a;

	}

	/**
	 * Converts the target object to an array.
	 *
	 * @param {object} o
	 * @return {object[]}
	 */
	function toArray( o ) {

		return Array.prototype.slice.call( o );

	}

	/**
	 * Utility for deserializing a value.
	 *
	 * @param {*} value
	 * @return {*}
	 */
	function deserialize( value ) {

		if( typeof value === 'string' ) {
			if( value === 'null' ) return null;
			else if( value === 'true' ) return true;
			else if( value === 'false' ) return false;
			else if( value.match( /^-?[\d\.]+$/ ) ) return parseFloat( value );
		}

		return value;

	}

	/**
	 * Measures the distance in pixels between point a
	 * and point b.
	 *
	 * @param {object} a point with x/y properties
	 * @param {object} b point with x/y properties
	 *
	 * @return {number}
	 */
	function distanceBetween( a, b ) {

		var dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt( dx*dx + dy*dy );

	}

	/**
	 * Applies a CSS transform to the target element.
	 *
	 * @param {HTMLElement} element
	 * @param {string} transform
	 */
	function transformElement( element, transform ) {

		element.style.WebkitTransform = transform;
		element.style.MozTransform = transform;
		element.style.msTransform = transform;
		element.style.transform = transform;

	}

	/**
	 * Applies CSS transforms to the slides container. The container
	 * is transformed from two separate sources: layout and the overview
	 * mode.
	 *
	 * @param {object} transforms
	 */
	function transformSlides( transforms ) {

		// Pick up new transforms from arguments
		if( typeof transforms.layout === 'string' ) slidesTransform.layout = transforms.layout;
		if( typeof transforms.overview === 'string' ) slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if( slidesTransform.layout ) {
			transformElement( dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview );
		}
		else {
			transformElement( dom.slides, slidesTransform.overview );
		}

	}

	/**
	 * Injects the given CSS styles into the DOM.
	 *
	 * @param {string} value
	 */
	function injectStyleSheet( value ) {

		var tag = document.createElement( 'style' );
		tag.type = 'text/css';
		if( tag.styleSheet ) {
			tag.styleSheet.cssText = value;
		}
		else {
			tag.appendChild( document.createTextNode( value ) );
		}
		document.getElementsByTagName( 'head' )[0].appendChild( tag );

	}

	/**
	 * Find the closest parent that matches the given
	 * selector.
	 *
	 * @param {HTMLElement} target The child element
	 * @param {String} selector The CSS selector to match
	 * the parents against
	 *
	 * @return {HTMLElement} The matched parent or null
	 * if no matching parent was found
	 */
	function closestParent( target, selector ) {

		var parent = target.parentNode;

		while( parent ) {

			// There's some overhead doing this each time, we don't
			// want to rewrite the element prototype but should still
			// be enough to feature detect once at startup...
			var matchesMethod = parent.matches || parent.matchesSelector || parent.msMatchesSelector;

			// If we find a match, we're all set
			if( matchesMethod && matchesMethod.call( parent, selector ) ) {
				return parent;
			}

			// Keep searching
			parent = parent.parentNode;

		}

		return null;

	}

	/**
	 * Converts various color input formats to an {r:0,g:0,b:0} object.
	 *
	 * @param {string} color The string representation of a color
	 * @example
	 * colorToRgb('#000');
	 * @example
	 * colorToRgb('#000000');
	 * @example
	 * colorToRgb('rgb(0,0,0)');
	 * @example
	 * colorToRgb('rgba(0,0,0)');
	 *
	 * @return {{r: number, g: number, b: number, [a]: number}|null}
	 */
	function colorToRgb( color ) {

		var hex3 = color.match( /^#([0-9a-f]{3})$/i );
		if( hex3 && hex3[1] ) {
			hex3 = hex3[1];
			return {
				r: parseInt( hex3.charAt( 0 ), 16 ) * 0x11,
				g: parseInt( hex3.charAt( 1 ), 16 ) * 0x11,
				b: parseInt( hex3.charAt( 2 ), 16 ) * 0x11
			};
		}

		var hex6 = color.match( /^#([0-9a-f]{6})$/i );
		if( hex6 && hex6[1] ) {
			hex6 = hex6[1];
			return {
				r: parseInt( hex6.substr( 0, 2 ), 16 ),
				g: parseInt( hex6.substr( 2, 2 ), 16 ),
				b: parseInt( hex6.substr( 4, 2 ), 16 )
			};
		}

		var rgb = color.match( /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i );
		if( rgb ) {
			return {
				r: parseInt( rgb[1], 10 ),
				g: parseInt( rgb[2], 10 ),
				b: parseInt( rgb[3], 10 )
			};
		}

		var rgba = color.match( /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i );
		if( rgba ) {
			return {
				r: parseInt( rgba[1], 10 ),
				g: parseInt( rgba[2], 10 ),
				b: parseInt( rgba[3], 10 ),
				a: parseFloat( rgba[4] )
			};
		}

		return null;

	}

	/**
	 * Calculates brightness on a scale of 0-255.
	 *
	 * @param {string} color See colorToRgb for supported formats.
	 * @see {@link colorToRgb}
	 */
	function colorBrightness( color ) {

		if( typeof color === 'string' ) color = colorToRgb( color );

		if( color ) {
			return ( color.r * 299 + color.g * 587 + color.b * 114 ) / 1000;
		}

		return null;

	}

	/**
	 * Returns the remaining height within the parent of the
	 * target element.
	 *
	 * remaining height = [ configured parent height ] - [ current parent height ]
	 *
	 * @param {HTMLElement} element
	 * @param {number} [height]
	 */
	function getRemainingHeight( element, height ) {

		height = height || 0;

		if( element ) {
			var newHeight, oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';
			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			return newHeight;
		}

		return height;

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	function isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

	/**
	 * Hides the address bar if we're on a mobile device.
	 */
	function hideAddressBar() {

		if( config.hideAddressBar && isMobileDevice ) {
			// Events that should trigger the address bar to hide
			window.addEventListener( 'load', removeAddressBar, false );
			window.addEventListener( 'orientationchange', removeAddressBar, false );
		}

	}

	/**
	 * Causes the address bar to hide on mobile devices,
	 * more vertical space ftw.
	 */
	function removeAddressBar() {

		setTimeout( function() {
			window.scrollTo( 0, 1 );
		}, 10 );

	}

	/**
	 * Dispatches an event of the specified type from the
	 * reveal DOM element.
	 */
	function dispatchEvent( type, args ) {

		var event = document.createEvent( 'HTMLEvents', 1, 2 );
		event.initEvent( type, true, true );
		extend( event, args );
		dom.wrapper.dispatchEvent( event );

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		if( config.postMessageEvents && window.parent !== window.self ) {
			window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
		}

	}

	/**
	 * Wrap all links in 3D goodness.
	 */
	function enableRollingLinks() {

		if( features.transforms3d && !( 'msPerspective' in document.body.style ) ) {
			var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a' );

			for( var i = 0, len = anchors.length; i < len; i++ ) {
				var anchor = anchors[i];

				if( anchor.textContent && !anchor.querySelector( '*' ) && ( !anchor.className || !anchor.classList.contains( anchor, 'roll' ) ) ) {
					var span = document.createElement('span');
					span.setAttribute('data-title', anchor.text);
					span.innerHTML = anchor.innerHTML;

					anchor.classList.add( 'roll' );
					anchor.innerHTML = '';
					anchor.appendChild(span);
				}
			}
		}

	}

	/**
	 * Unwrap all 3D links.
	 */
	function disableRollingLinks() {

		var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a.roll' );

		for( var i = 0, len = anchors.length; i < len; i++ ) {
			var anchor = anchors[i];
			var span = anchor.querySelector( 'span' );

			if( span ) {
				anchor.classList.remove( 'roll' );
				anchor.innerHTML = span.innerHTML;
			}
		}

	}

	/**
	 * Bind preview frame links.
	 *
	 * @param {string} [selector=a] - selector for anchors
	 */
	function enablePreviewLinks( selector ) {

		var anchors = toArray( document.querySelectorAll( selector ? selector : 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.addEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Unbind preview frame links.
	 */
	function disablePreviewLinks( selector ) {

		var anchors = toArray( document.querySelectorAll( selector ? selector : 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.removeEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Opens a preview window for the target URL.
	 *
	 * @param {string} url - url for preview iframe src
	 */
	function showPreview( url ) {

		closeOverlay();

		dom.overlay = document.createElement( 'div' );
		dom.overlay.classList.add( 'overlay' );
		dom.overlay.classList.add( 'overlay-preview' );
		dom.wrapper.appendChild( dom.overlay );

		dom.overlay.innerHTML = [
			'<header>',
				'<a class="close" href="#"><span class="icon"></span></a>',
				'<a class="external" href="'+ url +'" target="_blank"><span class="icon"></span></a>',
			'</header>',
			'<div class="spinner"></div>',
			'<div class="viewport">',
				'<iframe src="'+ url +'"></iframe>',
				'<small class="viewport-inner">',
					'<span class="x-frame-error">Unable to load iframe. This is likely due to the site\'s policy (x-frame-options).</span>',
				'</small>',
			'</div>'
		].join('');

		dom.overlay.querySelector( 'iframe' ).addEventListener( 'load', function( event ) {
			dom.overlay.classList.add( 'loaded' );
		}, false );

		dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
			closeOverlay();
			event.preventDefault();
		}, false );

		dom.overlay.querySelector( '.external' ).addEventListener( 'click', function( event ) {
			closeOverlay();
		}, false );

		setTimeout( function() {
			dom.overlay.classList.add( 'visible' );
		}, 1 );

	}

	/**
	 * Open or close help overlay window.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * help is open, false means it's closed.
	 */
	function toggleHelp( override ){

		if( typeof override === 'boolean' ) {
			override ? showHelp() : closeOverlay();
		}
		else {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				showHelp();
			}
		}
	}

	/**
	 * Opens an overlay window with help material.
	 */
	function showHelp() {

		if( config.help ) {

			closeOverlay();

			dom.overlay = document.createElement( 'div' );
			dom.overlay.classList.add( 'overlay' );
			dom.overlay.classList.add( 'overlay-help' );
			dom.wrapper.appendChild( dom.overlay );

			var html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( var key in keyboardShortcuts ) {
				html += '<tr><td>' + key + '</td><td>' + keyboardShortcuts[ key ] + '</td></tr>';
			}

			html += '</table>';

			dom.overlay.innerHTML = [
				'<header>',
					'<a class="close" href="#"><span class="icon"></span></a>',
				'</header>',
				'<div class="viewport">',
					'<div class="viewport-inner">'+ html +'</div>',
				'</div>'
			].join('');

			dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
				closeOverlay();
				event.preventDefault();
			}, false );

			setTimeout( function() {
				dom.overlay.classList.add( 'visible' );
			}, 1 );

		}

	}

	/**
	 * Closes any currently open overlay.
	 */
	function closeOverlay() {

		if( dom.overlay ) {
			dom.overlay.parentNode.removeChild( dom.overlay );
			dom.overlay = null;
		}

	}

	/**
	 * Applies JavaScript-controlled layout rules to the
	 * presentation.
	 */
	function layout() {

		if( dom.wrapper && !isPrintingPDF() ) {

			var size = getComputedSlideSize();

			// Layout the contents of the slides
			layoutSlideContents( config.width, config.height );

			dom.slides.style.width = size.width + 'px';
			dom.slides.style.height = size.height + 'px';

			// Determine scale of content to fit within available space
			scale = Math.min( size.presentationWidth / size.width, size.presentationHeight / size.height );

			// Respect max/min scale settings
			scale = Math.max( scale, config.minScale );
			scale = Math.min( scale, config.maxScale );

			// Don't apply any scaling styles if scale is 1
			if( scale === 1 ) {
				dom.slides.style.zoom = '';
				dom.slides.style.left = '';
				dom.slides.style.top = '';
				dom.slides.style.bottom = '';
				dom.slides.style.right = '';
				transformSlides( { layout: '' } );
			}
			else {
				// Prefer zoom for scaling up so that content remains crisp.
				// Don't use zoom to scale down since that can lead to shifts
				// in text layout/line breaks.
				if( scale > 1 && features.zoom ) {
					dom.slides.style.zoom = scale;
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides( { layout: '' } );
				}
				// Apply scale transform as a fallback
				else {
					dom.slides.style.zoom = '';
					dom.slides.style.left = '50%';
					dom.slides.style.top = '50%';
					dom.slides.style.bottom = 'auto';
					dom.slides.style.right = 'auto';
					transformSlides( { layout: 'translate(-50%, -50%) scale('+ scale +')' } );
				}
			}

			// Select all slides, vertical and horizontal
			var slides = toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) );

			for( var i = 0, len = slides.length; i < len; i++ ) {
				var slide = slides[ i ];

				// Don't bother updating invisible slides
				if( slide.style.display === 'none' ) {
					continue;
				}

				if( config.center || slide.classList.contains( 'center' ) ) {
					// Vertical stacks are not centred since their section
					// children will be
					if( slide.classList.contains( 'stack' ) ) {
						slide.style.top = 0;
					}
					else {
						slide.style.top = Math.max( ( size.height - slide.scrollHeight ) / 2, 0 ) + 'px';
					}
				}
				else {
					slide.style.top = '';
				}

			}

			updateProgress();
			updateParallax();

			if( isOverview() ) {
				updateOverview();
			}

		}

	}

	/**
	 * Applies layout logic to the contents of all slides in
	 * the presentation.
	 *
	 * @param {string|number} width
	 * @param {string|number} height
	 */
	function layoutSlideContents( width, height ) {

		// Handle sizing of elements with the 'stretch' class
		toArray( dom.slides.querySelectorAll( 'section > .stretch' ) ).forEach( function( element ) {

			// Determine how much vertical space we can use
			var remainingHeight = getRemainingHeight( element, height );

			// Consider the aspect ratio of media elements
			if( /(img|video)/gi.test( element.nodeName ) ) {
				var nw = element.naturalWidth || element.videoWidth,
					nh = element.naturalHeight || element.videoHeight;

				var es = Math.min( width / nw, remainingHeight / nh );

				element.style.width = ( nw * es ) + 'px';
				element.style.height = ( nh * es ) + 'px';

			}
			else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}

		} );

	}

	/**
	 * Calculates the computed pixel size of our slides. These
	 * values are based on the width and height configuration
	 * options.
	 *
	 * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
	 * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
	 */
	function getComputedSlideSize( presentationWidth, presentationHeight ) {

		var size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= ( size.presentationWidth * config.margin );
		size.presentationHeight -= ( size.presentationHeight * config.margin );

		// Slide width may be a percentage of available width
		if( typeof size.width === 'string' && /%$/.test( size.width ) ) {
			size.width = parseInt( size.width, 10 ) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if( typeof size.height === 'string' && /%$/.test( size.height ) ) {
			size.height = parseInt( size.height, 10 ) / 100 * size.presentationHeight;
		}

		return size;

	}

	/**
	 * Stores the vertical index of a stack so that the same
	 * vertical slide can be selected when navigating to and
	 * from the stack.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 * @param {string|number} [v=0] Index to memorize
	 */
	function setPreviousVerticalIndex( stack, v ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' ) {
			stack.setAttribute( 'data-previous-indexv', v || 0 );
		}

	}

	/**
	 * Retrieves the vertical index which was stored using
	 * #setPreviousVerticalIndex() or 0 if no previous index
	 * exists.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 */
	function getPreviousVerticalIndex( stack ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains( 'stack' ) ) {
			// Prefer manually defined start-indexv
			var attributeName = stack.hasAttribute( 'data-start-indexv' ) ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt( stack.getAttribute( attributeName ) || 0, 10 );
		}

		return 0;

	}

	/**
	 * Displays the overview of slides (quick nav) by scaling
	 * down and arranging all slide elements.
	 */
	function activateOverview() {

		// Only proceed if enabled in config
		if( config.overview && !isOverview() ) {

			overview = true;

			dom.wrapper.classList.add( 'overview' );
			dom.wrapper.classList.remove( 'overview-deactivating' );

			if( features.overviewTransitions ) {
				setTimeout( function() {
					dom.wrapper.classList.add( 'overview-animated' );
				}, 1 );
			}

			// Don't auto-slide while in overview mode
			cancelAutoSlide();

			// Move the backgrounds element into the slide container to
			// that the same scaling is applied
			dom.slides.appendChild( dom.background );

			// Clicking on an overview slide navigates to it
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				if( !slide.classList.contains( 'stack' ) ) {
					slide.addEventListener( 'click', onOverviewSlideClicked, true );
				}
			} );

			// Calculate slide sizes
			var margin = 70;
			var slideSize = getComputedSlideSize();
			overviewSlideWidth = slideSize.width + margin;
			overviewSlideHeight = slideSize.height + margin;

			// Reverse in RTL mode
			if( config.rtl ) {
				overviewSlideWidth = -overviewSlideWidth;
			}

			updateSlidesVisibility();
			layoutOverview();
			updateOverview();

			layout();

			// Notify observers of the overview showing
			dispatchEvent( 'overviewshown', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}

	}

	/**
	 * Uses CSS transforms to position all slides in a grid for
	 * display inside of the overview mode.
	 */
	function layoutOverview() {

		// Layout slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );
			transformElement( hslide, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			if( hslide.classList.contains( 'stack' ) ) {

				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );

					transformElement( vslide, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
				} );

			}
		} );

		// Layout slide backgrounds
		toArray( dom.background.childNodes ).forEach( function( hbackground, h ) {
			transformElement( hbackground, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			toArray( hbackground.querySelectorAll( '.slide-background' ) ).forEach( function( vbackground, v ) {
				transformElement( vbackground, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
			} );
		} );

	}

	/**
	 * Moves the overview viewport to the current slides.
	 * Called each time the current slide changes.
	 */
	function updateOverview() {

		var vmin = Math.min( window.innerWidth, window.innerHeight );
		var scale = Math.max( vmin / 5, 150 ) / vmin;

		transformSlides( {
			overview: [
				'scale('+ scale +')',
				'translateX('+ ( -indexh * overviewSlideWidth ) +'px)',
				'translateY('+ ( -indexv * overviewSlideHeight ) +'px)'
			].join( ' ' )
		} );

	}

	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if( config.overview ) {

			overview = false;

			dom.wrapper.classList.remove( 'overview' );
			dom.wrapper.classList.remove( 'overview-animated' );

			// Temporarily add a class so that transitions can do different things
			// depending on whether they are exiting/entering overview, or just
			// moving from slide to slide
			dom.wrapper.classList.add( 'overview-deactivating' );

			setTimeout( function () {
				dom.wrapper.classList.remove( 'overview-deactivating' );
			}, 1 );

			// Move the background element back out
			dom.wrapper.appendChild( dom.background );

			// Clean up changes made to slides
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				transformElement( slide, '' );

				slide.removeEventListener( 'click', onOverviewSlideClicked, true );
			} );

			// Clean up changes made to backgrounds
			toArray( dom.background.querySelectorAll( '.slide-background' ) ).forEach( function( background ) {
				transformElement( background, '' );
			} );

			transformSlides( { overview: '' } );

			slide( indexh, indexv );

			layout();

			cueAutoSlide();

			// Notify observers of the overview hiding
			dispatchEvent( 'overviewhidden', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}
	}

	/**
	 * Toggles the slide overview mode on and off.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * overview is open, false means it's closed.
	 */
	function toggleOverview( override ) {

		if( typeof override === 'boolean' ) {
			override ? activateOverview() : deactivateOverview();
		}
		else {
			isOverview() ? deactivateOverview() : activateOverview();
		}

	}

	/**
	 * Checks if the overview is currently active.
	 *
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function isOverview() {

		return overview;

	}

	/**
	 * Checks if the current or specified slide is vertical
	 * (nested within another slide).
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to check
	 * orientation of
	 * @return {Boolean}
	 */
	function isVerticalSlide( slide ) {

		// Prefer slide argument, otherwise use current slide
		slide = slide ? slide : currentSlide;

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match( /section/i );

	}

	/**
	 * Handling the fullscreen functionality via the fullscreen API
	 *
	 * @see http://fullscreen.spec.whatwg.org/
	 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	 */
	function enterFullscreen() {

		var element = document.documentElement;

		// Check which implementation is available
		var requestMethod = element.requestFullscreen ||
							element.webkitRequestFullscreen ||
							element.webkitRequestFullScreen ||
							element.mozRequestFullScreen ||
							element.msRequestFullscreen;

		if( requestMethod ) {
			requestMethod.apply( element );
		}

	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {

		if( config.pause ) {
			var wasPaused = dom.wrapper.classList.contains( 'paused' );

			cancelAutoSlide();
			dom.wrapper.classList.add( 'paused' );

			if( wasPaused === false ) {
				dispatchEvent( 'paused' );
			}
		}

	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {

		var wasPaused = dom.wrapper.classList.contains( 'paused' );
		dom.wrapper.classList.remove( 'paused' );

		cueAutoSlide();

		if( wasPaused ) {
			dispatchEvent( 'resumed' );
		}

	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause( override ) {

		if( typeof override === 'boolean' ) {
			override ? pause() : resume();
		}
		else {
			isPaused() ? resume() : pause();
		}

	}

	/**
	 * Checks if we are currently in the paused mode.
	 *
	 * @return {Boolean}
	 */
	function isPaused() {

		return dom.wrapper.classList.contains( 'paused' );

	}

	/**
	 * Toggles the auto slide mode on and off.
	 *
	 * @param {Boolean} [override] Flag which sets the desired state.
	 * True means autoplay starts, false means it stops.
	 */

	function toggleAutoSlide( override ) {

		if( typeof override === 'boolean' ) {
			override ? resumeAutoSlide() : pauseAutoSlide();
		}

		else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}

	}

	/**
	 * Checks if the auto slide mode is currently on.
	 *
	 * @return {Boolean}
	 */
	function isAutoSliding() {

		return !!( autoSlide && !autoSlidePaused );

	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {number} [h=indexh] Horizontal index of the target slide
	 * @param {number} [v=indexv] Vertical index of the target slide
	 * @param {number} [f] Index of a fragment within the
	 * target slide to activate
	 * @param {number} [o] Origin for use in multimaster environments
	 */
	function slide( h, v, f, o ) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// Abort if there are no slides
		if( horizontalSlides.length === 0 ) return;

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if( v === undefined && !isOverview() ) {
			v = getPreviousVerticalIndex( horizontalSlides[ h ] );
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if( previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains( 'stack' ) ) {
			setPreviousVerticalIndex( previousSlide.parentNode, indexv );
		}

		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		var indexhBefore = indexh || 0,
			indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Apply the new state
		stateLoop: for( var i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for( var j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remains of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		// Update the overview if it's currently active
		if( isOverview() ) {
			updateOverview();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		var currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Show fragment, if specified
		if( typeof f !== 'undefined' ) {
			navigateFragment( f );
		}

		// Dispatch an event if the slide changed
		var slideChanged = ( indexh !== indexhBefore || indexv !== indexvBefore );
		if( slideChanged ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			} );
		}
		else {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if( previousSlide ) {
			previousSlide.classList.remove( 'present' );
			previousSlide.setAttribute( 'aria-hidden', 'true' );

			// Reset all slides upon navigate to home
			// Issue: #285
			if ( dom.wrapper.querySelector( HOME_SLIDE_SELECTOR ).classList.contains( 'present' ) ) {
				// Launch async task
				setTimeout( function () {
					var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.stack') ), i;
					for( i in slides ) {
						if( slides[i] ) {
							// Reset stack
							setPreviousVerticalIndex( slides[i], 0 );
						}
					}
				}, 0 );
			}
		}

		// Handle embedded content
		if( slideChanged || !previousSlide ) {
			stopEmbeddedContent( previousSlide );
			startEmbeddedContent( currentSlide );
		}

		// Announce the current slide contents, for screen readers
		dom.statusDiv.textContent = getStatusText( currentSlide );

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();

		// Update the URL hash
		writeURL();

		cueAutoSlide();

	}

	/**
	 * Syncs the presentation with the current DOM. Useful
	 * when new slides or control elements are added or when
	 * the configuration has changed.
	 */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		sortAllFragments();

		updateControls();
		updateProgress();
		updateSlideNumber();
		updateSlidesVisibility();
		updateBackground( true );
		updateNotesVisibility();
		updateNotes();

		formatEmbeddedContent();

		// Start or stop embedded content depending on global config
		if( config.autoPlayMedia === false ) {
			stopEmbeddedContent( currentSlide, { unloadIframes: false } );
		}
		else {
			startEmbeddedContent( currentSlide );
		}

		if( isOverview() ) {
			layoutOverview();
		}

	}

	/**
	 * Resets all vertical slides so that only the first
	 * is visible.
	 */
	function resetVerticalSlides() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				if( y > 0 ) {
					verticalSlide.classList.remove( 'present' );
					verticalSlide.classList.remove( 'past' );
					verticalSlide.classList.add( 'future' );
					verticalSlide.setAttribute( 'aria-hidden', 'true' );
				}

			} );

		} );

	}

	/**
	 * Sorts and formats all of fragments in the
	 * presentation.
	 */
	function sortAllFragments() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				sortFragments( verticalSlide.querySelectorAll( '.fragment' ) );

			} );

			if( verticalSlides.length === 0 ) sortFragments( horizontalSlide.querySelectorAll( '.fragment' ) );

		} );

	}

	/**
	 * Randomly shuffles all slides in the deck.
	 */
	function shuffle() {

		var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		slides.forEach( function( slide ) {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore( slide, slides[ Math.floor( Math.random() * slides.length ) ] );

		} );

	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 *
	 * @param {string} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {number} index The index of the slide that should be
	 * shown
	 *
	 * @return {number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of
	 * bounds.
	 */
	function updateSlides( selector, index ) {

		// Select all slides and convert the NodeList result to
		// an array
		var slides = toArray( dom.wrapper.querySelectorAll( selector ) ),
			slidesLength = slides.length;

		var printMode = isPrintingPDF();

		if( slidesLength ) {

			// Should the index loop?
			if( config.loop ) {
				index %= slidesLength;

				if( index < 0 ) {
					index = slidesLength + index;
				}
			}

			// Enforce max and minimum index bounds
			index = Math.max( Math.min( index, slidesLength - 1 ), 0 );

			for( var i = 0; i < slidesLength; i++ ) {
				var element = slides[i];

				var reverse = config.rtl && !isVerticalSlide( element );

				element.classList.remove( 'past' );
				element.classList.remove( 'present' );
				element.classList.remove( 'future' );

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute( 'hidden', '' );
				element.setAttribute( 'aria-hidden', 'true' );

				// If this element contains vertical slides
				if( element.querySelector( 'section' ) ) {
					element.classList.add( 'stack' );
				}

				// If we're printing static slides, all slides are "present"
				if( printMode ) {
					element.classList.add( 'present' );
					continue;
				}

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					element.classList.add( reverse ? 'future' : 'past' );

					if( config.fragments ) {
						var pastFragments = toArray( element.querySelectorAll( '.fragment' ) );

						// Show all fragments on prior slides
						while( pastFragments.length ) {
							var pastFragment = pastFragments.pop();
							pastFragment.classList.add( 'visible' );
							pastFragment.classList.remove( 'current-fragment' );
						}
					}
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add( reverse ? 'past' : 'future' );

					if( config.fragments ) {
						var futureFragments = toArray( element.querySelectorAll( '.fragment.visible' ) );

						// No fragments in future slides should be visible ahead of time
						while( futureFragments.length ) {
							var futureFragment = futureFragments.pop();
							futureFragment.classList.remove( 'visible' );
							futureFragment.classList.remove( 'current-fragment' );
						}
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );
			slides[index].removeAttribute( 'hidden' );
			slides[index].removeAttribute( 'aria-hidden' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			var slideState = slides[index].getAttribute( 'data-state' );
			if( slideState ) {
				state = state.concat( slideState.split( ' ' ) );
			}

		}
		else {
			// Since there are no slides we can't be anywhere beyond the
			// zeroth index
			index = 0;
		}

		return index;

	}

	/**
	 * Optimization method; hide all slides that are far away
	 * from the present slide.
	 */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ),
			horizontalSlidesLength = horizontalSlides.length,
			distanceX,
			distanceY;

		if( horizontalSlidesLength && typeof indexh !== 'undefined' ) {

			// The number of steps away from the present slide that will
			// be visible
			var viewDistance = isOverview() ? 10 : config.viewDistance;

			// Limit view distance on weaker devices
			if( isMobileDevice ) {
				viewDistance = isOverview() ? 6 : 2;
			}

			// All slides need to be visible when exporting to PDF
			if( isPrintingPDF() ) {
				viewDistance = Number.MAX_VALUE;
			}

			for( var x = 0; x < horizontalSlidesLength; x++ ) {
				var horizontalSlide = horizontalSlides[x];

				var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) ),
					verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs( ( indexh || 0 ) - x ) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if( config.loop ) {
					distanceX = Math.abs( ( ( indexh || 0 ) - x ) % ( horizontalSlidesLength - viewDistance ) ) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if( distanceX < viewDistance ) {
					loadSlide( horizontalSlide );
				}
				else {
					unloadSlide( horizontalSlide );
				}

				if( verticalSlidesLength ) {

					var oy = getPreviousVerticalIndex( horizontalSlide );

					for( var y = 0; y < verticalSlidesLength; y++ ) {
						var verticalSlide = verticalSlides[y];

						distanceY = x === ( indexh || 0 ) ? Math.abs( ( indexv || 0 ) - y ) : Math.abs( y - oy );

						if( distanceX + distanceY < viewDistance ) {
							loadSlide( verticalSlide );
						}
						else {
							unloadSlide( verticalSlide );
						}
					}

				}
			}

			// Flag if there are ANY vertical slides, anywhere in the deck
			if( dom.wrapper.querySelectorAll( '.slides>section>section' ).length ) {
				dom.wrapper.classList.add( 'has-vertical-slides' );
			}
			else {
				dom.wrapper.classList.remove( 'has-vertical-slides' );
			}

			// Flag if there are ANY horizontal slides, anywhere in the deck
			if( dom.wrapper.querySelectorAll( '.slides>section' ).length > 1 ) {
				dom.wrapper.classList.add( 'has-horizontal-slides' );
			}
			else {
				dom.wrapper.classList.remove( 'has-horizontal-slides' );
			}

		}

	}

	/**
	 * Pick up notes from the current slide and display them
	 * to the viewer.
	 *
	 * @see {@link config.showNotes}
	 */
	function updateNotes() {

		if( config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF() ) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';

		}

	}

	/**
	 * Updates the visibility of the speaker notes sidebar that
	 * is used to share annotated slides. The notes sidebar is
	 * only visible if showNotes is true and there are notes on
	 * one or more slides in the deck.
	 */
	function updateNotesVisibility() {

		if( config.showNotes && hasNotes() ) {
			dom.wrapper.classList.add( 'show-notes' );
		}
		else {
			dom.wrapper.classList.remove( 'show-notes' );
		}

	}

	/**
	 * Checks if there are speaker notes for ANY slide in the
	 * presentation.
	 */
	function hasNotes() {

		return dom.slides.querySelectorAll( '[data-notes], aside.notes' ).length > 0;

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	function updateProgress() {

		// Update progress if enabled
		if( config.progress && dom.progressbar ) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';

		}

	}

	/**
	 * Updates the slide number div to reflect the current slide.
	 *
	 * The following slide number formats are available:
	 *  "h.v":	horizontal . vertical slide number (default)
	 *  "h/v":	horizontal / vertical slide number
	 *    "c":	flattened slide number
	 *  "c/t":	flattened slide number / total slides
	 */
	function updateSlideNumber() {

		// Update slide number if enabled
		if( config.slideNumber && dom.slideNumber ) {

			var value = [];
			var format = 'h.v';

			// Check if a custom number format is available
			if( typeof config.slideNumber === 'string' ) {
				format = config.slideNumber;
			}

			switch( format ) {
				case 'c':
					value.push( getSlidePastCount() + 1 );
					break;
				case 'c/t':
					value.push( getSlidePastCount() + 1, '/', getTotalSlides() );
					break;
				case 'h/v':
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '/', indexv + 1 );
					break;
				default:
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '.', indexv + 1 );
			}

			dom.slideNumber.innerHTML = formatSlideNumber( value[0], value[1], value[2] );
		}

	}

	/**
	 * Applies HTML formatting to a slide number before it's
	 * written to the DOM.
	 *
	 * @param {number} a Current slide
	 * @param {string} delimiter Character to separate slide numbers
	 * @param {(number|*)} b Total slides
	 * @return {string} HTML string fragment
	 */
	function formatSlideNumber( a, delimiter, b ) {

		if( typeof b === 'number' && !isNaN( b ) ) {
			return  '<span class="slide-number-a">'+ a +'</span>' +
					'<span class="slide-number-delimiter">'+ delimiter +'</span>' +
					'<span class="slide-number-b">'+ b +'</span>';
		}
		else {
			return '<span class="slide-number-a">'+ a +'</span>';
		}

	}

	/**
	 * Updates the state of all control/navigation arrows.
	 */
	function updateControls() {

		var routes = availableRoutes();
		var fragments = availableFragments();

		// Remove the 'enabled' class from all directions
		dom.controlsLeft.concat( dom.controlsRight )
						.concat( dom.controlsUp )
						.concat( dom.controlsDown )
						.concat( dom.controlsPrev )
						.concat( dom.controlsNext ).forEach( function( node ) {
			node.classList.remove( 'enabled' );
			node.classList.remove( 'fragmented' );

			// Set 'disabled' attribute on all directions
			node.setAttribute( 'disabled', 'disabled' );
		} );

		// Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
		if( routes.left ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.up ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.down ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Prev/next buttons
		if( routes.left || routes.up ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right || routes.down ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Highlight fragment directions
		if( currentSlide ) {

			// Always apply fragment decorator to prev/next buttons
			if( fragments.prev ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			if( fragments.next ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if( isVerticalSlide( currentSlide ) ) {
				if( fragments.prev ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}
			else {
				if( fragments.prev ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}

		}

		if( config.controlsTutorial ) {

			// Highlight control arrows with an animation to ensure
			// that the viewer knows how to navigate
			if( !hasNavigatedDown && routes.down ) {
				dom.controlsDownArrow.classList.add( 'highlight' );
			}
			else {
				dom.controlsDownArrow.classList.remove( 'highlight' );

				if( !hasNavigatedRight && routes.right && indexv === 0 ) {
					dom.controlsRightArrow.classList.add( 'highlight' );
				}
				else {
					dom.controlsRightArrow.classList.remove( 'highlight' );
				}
			}

		}

	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	function updateBackground( includeAll ) {

		var currentBackground = null;

		// Reverse past/future classes when in RTL mode
		var horizontalPast = config.rtl ? 'future' : 'past',
			horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray( dom.background.childNodes ).forEach( function( backgroundh, h ) {

			backgroundh.classList.remove( 'past' );
			backgroundh.classList.remove( 'present' );
			backgroundh.classList.remove( 'future' );

			if( h < indexh ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indexh ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indexh ) {
				toArray( backgroundh.querySelectorAll( '.slide-background' ) ).forEach( function( backgroundv, v ) {

					backgroundv.classList.remove( 'past' );
					backgroundv.classList.remove( 'present' );
					backgroundv.classList.remove( 'future' );

					if( v < indexv ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indexv ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indexh ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop content inside of previous backgrounds
		if( previousBackground ) {

			stopEmbeddedContent( previousBackground );

		}

		// Start content in the current background
		if( currentBackground ) {

			startEmbeddedContent( currentBackground );

			var backgroundImageURL = currentBackground.style.backgroundImage || '';

			// Restart GIFs (doesn't work in Firefox)
			if( /\.gif/i.test( backgroundImageURL ) ) {
				currentBackground.style.backgroundImage = '';
				window.getComputedStyle( currentBackground ).opacity;
				currentBackground.style.backgroundImage = backgroundImageURL;
			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			var previousBackgroundHash = previousBackground ? previousBackground.getAttribute( 'data-background-hash' ) : null;
			var currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground ) {
				dom.background.classList.add( 'no-transition' );
			}

			previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			[ 'has-light-background', 'has-dark-background' ].forEach( function( classToBubble ) {
				if( currentSlide.classList.contains( classToBubble ) ) {
					dom.wrapper.classList.add( classToBubble );
				}
				else {
					dom.wrapper.classList.remove( classToBubble );
				}
			} );
		}

		// Allow the first background to apply without transition
		setTimeout( function() {
			dom.background.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	function updateParallax() {

		if( config.parallaxBackgroundImage ) {

			var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
				verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

			var backgroundSize = dom.background.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			var slideWidth = dom.background.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof config.parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			var slideHeight = dom.background.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof config.parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indexv : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	/**
	 * Called when the given slide is within the configured view
	 * distance. Shows the slide element and loads any content
	 * that is set to load lazily (data-src).
	 *
	 * @param {HTMLElement} slide Slide to show
	 */
	function loadSlide( slide, options ) {

		options = options || {};

		// Show the slide element
		slide.style.display = config.display;

		// Media elements with data-src attributes
		toArray( slide.querySelectorAll( 'img[data-src], video[data-src], audio[data-src]' ) ).forEach( function( element ) {
			element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
			element.setAttribute( 'data-lazy-loaded', '' );
			element.removeAttribute( 'data-src' );
		} );

		// Media elements with <source> children
		toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( media ) {
			var sources = 0;

			toArray( media.querySelectorAll( 'source[data-src]' ) ).forEach( function( source ) {
				source.setAttribute( 'src', source.getAttribute( 'data-src' ) );
				source.removeAttribute( 'data-src' );
				source.setAttribute( 'data-lazy-loaded', '' );
				sources += 1;
			} );

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if( sources > 0 ) {
				media.load();
			}
		} );


		// Show the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'block';

			// If the background contains media, load it
			if( background.hasAttribute( 'data-loaded' ) === false ) {
				background.setAttribute( 'data-loaded', 'true' );

				var backgroundImage = slide.getAttribute( 'data-background-image' ),
					backgroundVideo = slide.getAttribute( 'data-background-video' ),
					backgroundVideoLoop = slide.hasAttribute( 'data-background-video-loop' ),
					backgroundVideoMuted = slide.hasAttribute( 'data-background-video-muted' ),
					backgroundIframe = slide.getAttribute( 'data-background-iframe' );

				// Images
				if( backgroundImage ) {
					background.style.backgroundImage = 'url('+ backgroundImage +')';
				}
				// Videos
				else if ( backgroundVideo && !isSpeakerNotes() ) {
					var video = document.createElement( 'video' );

					if( backgroundVideoLoop ) {
						video.setAttribute( 'loop', '' );
					}

					if( backgroundVideoMuted ) {
						video.muted = true;
					}

					// Inline video playback works (at least in Mobile Safari) as
					// long as the video is muted and the `playsinline` attribute is
					// present
					if( isMobileDevice ) {
						video.muted = true;
						video.autoplay = true;
						video.setAttribute( 'playsinline', '' );
					}

					// Support comma separated lists of video sources
					backgroundVideo.split( ',' ).forEach( function( source ) {
						video.innerHTML += '<source src="'+ source +'">';
					} );

					background.appendChild( video );
				}
				// Iframes
				else if( backgroundIframe && options.excludeIframes !== true ) {
					var iframe = document.createElement( 'iframe' );
					iframe.setAttribute( 'allowfullscreen', '' );
					iframe.setAttribute( 'mozallowfullscreen', '' );
					iframe.setAttribute( 'webkitallowfullscreen', '' );

					// Only load autoplaying content when the slide is shown to
					// avoid having it play in the background
					if( /autoplay=(1|true|yes)/gi.test( backgroundIframe ) ) {
						iframe.setAttribute( 'data-src', backgroundIframe );
					}
					else {
						iframe.setAttribute( 'src', backgroundIframe );
					}

					iframe.style.width  = '100%';
					iframe.style.height = '100%';
					iframe.style.maxHeight = '100%';
					iframe.style.maxWidth = '100%';

					background.appendChild( iframe );
				}
			}

		}

	}

	/**
	 * Unloads and hides the given slide. This is called when the
	 * slide is moved outside of the configured view distance.
	 *
	 * @param {HTMLElement} slide
	 */
	function unloadSlide( slide ) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'none';
		}

		// Reset lazy-loaded media elements with src attributes
		toArray( slide.querySelectorAll( 'video[data-lazy-loaded][src], audio[data-lazy-loaded][src]' ) ).forEach( function( element ) {
			element.setAttribute( 'data-src', element.getAttribute( 'src' ) );
			element.removeAttribute( 'src' );
		} );

		// Reset lazy-loaded media elements with <source> children
		toArray( slide.querySelectorAll( 'video[data-lazy-loaded] source[src], audio source[src]' ) ).forEach( function( source ) {
			source.setAttribute( 'data-src', source.getAttribute( 'src' ) );
			source.removeAttribute( 'src' );
		} );

	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
	 */
	function availableRoutes() {

		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		var routes = {
			left: indexh > 0 || config.loop,
			right: indexh < horizontalSlides.length - 1 || config.loop,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// reverse horizontal controls for rtl
		if( config.rtl ) {
			var left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;

	}

	/**
	 * Returns an object describing the available fragment
	 * directions.
	 *
	 * @return {{prev: boolean, next: boolean}}
	 */
	function availableFragments() {

		if( currentSlide && config.fragments ) {
			var fragments = currentSlide.querySelectorAll( '.fragment' );
			var hiddenFragments = currentSlide.querySelectorAll( '.fragment:not(.visible)' );

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		}
		else {
			return { prev: false, next: false };
		}

	}

	/**
	 * Enforces origin-specific format rules for embedded media.
	 */
	function formatEmbeddedContent() {

		var _appendParamToIframeSource = function( sourceAttribute, sourceURL, param ) {
			toArray( dom.slides.querySelectorAll( 'iframe['+ sourceAttribute +'*="'+ sourceURL +'"]' ) ).forEach( function( el ) {
				var src = el.getAttribute( sourceAttribute );
				if( src && src.indexOf( param ) === -1 ) {
					el.setAttribute( sourceAttribute, src + ( !/\?/.test( src ) ? '?' : '&' ) + param );
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource( 'src', 'youtube.com/embed/', 'enablejsapi=1' );
		_appendParamToIframeSource( 'data-src', 'youtube.com/embed/', 'enablejsapi=1' );

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource( 'src', 'player.vimeo.com/', 'api=1' );
		_appendParamToIframeSource( 'data-src', 'player.vimeo.com/', 'api=1' );

		// Always show media controls on mobile devices
		if( isMobileDevice ) {
			toArray( dom.slides.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				el.controls = true;
			} );
		}

	}

	/**
	 * Start playback of any embedded content inside of
	 * the given element.
	 *
	 * @param {HTMLElement} element
	 */
	function startEmbeddedContent( element ) {

		if( element && !isSpeakerNotes() ) {

			// Restart GIFs
			toArray( element.querySelectorAll( 'img[src$=".gif"]' ) ).forEach( function( el ) {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute( 'src', el.getAttribute( 'src' ) );
			} );

			// HTML5 media elements
			toArray( element.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				// Prefer an explicit global autoplay setting
				var autoplay = config.autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if( typeof autoplay !== 'boolean' ) {
					autoplay = el.hasAttribute( 'data-autoplay' ) || !!closestParent( el, '.slide-background' );
				}

				if( autoplay && typeof el.play === 'function' ) {

					if( el.readyState > 1 ) {
						startEmbeddedMedia( { target: el } );
					}
					else {
						el.removeEventListener( 'loadeddata', startEmbeddedMedia ); // remove first to avoid dupes
						el.addEventListener( 'loadeddata', startEmbeddedMedia );
					}

				}
			} );

			// Normal iframes
			toArray( element.querySelectorAll( 'iframe[src]' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				startEmbeddedIframe( { target: el } );
			} );

			// Lazy loading iframes
			toArray( element.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				if( el.getAttribute( 'src' ) !== el.getAttribute( 'data-src' ) ) {
					el.removeEventListener( 'load', startEmbeddedIframe ); // remove first to avoid dupes
					el.addEventListener( 'load', startEmbeddedIframe );
					el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
				}
			} );

		}

	}

	/**
	 * Starts playing an embedded video/audio element after
	 * it has finished loading.
	 *
	 * @param {object} event
	 */
	function startEmbeddedMedia( event ) {

		var isAttachedToDOM = !!closestParent( event.target, 'html' ),
			isVisible  		= !!closestParent( event.target, '.present' );

		if( isAttachedToDOM && isVisible ) {
			event.target.currentTime = 0;
			event.target.play();
		}

		event.target.removeEventListener( 'loadeddata', startEmbeddedMedia );

	}

	/**
	 * "Starts" the content of an embedded iframe using the
	 * postMessage API.
	 *
	 * @param {object} event
	 */
	function startEmbeddedIframe( event ) {

		var iframe = event.target;

		if( iframe && iframe.contentWindow ) {

			var isAttachedToDOM = !!closestParent( event.target, 'html' ),
				isVisible  		= !!closestParent( event.target, '.present' );

			if( isAttachedToDOM && isVisible ) {

				// Prefer an explicit global autoplay setting
				var autoplay = config.autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if( typeof autoplay !== 'boolean' ) {
					autoplay = iframe.hasAttribute( 'data-autoplay' ) || !!closestParent( iframe, '.slide-background' );
				}

				// YouTube postMessage API
				if( /youtube\.com\/embed\//.test( iframe.getAttribute( 'src' ) ) && autoplay ) {
					iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
				}
				// Vimeo postMessage API
				else if( /player\.vimeo\.com\//.test( iframe.getAttribute( 'src' ) ) && autoplay ) {
					iframe.contentWindow.postMessage( '{"method":"play"}', '*' );
				}
				// Generic postMessage API
				else {
					iframe.contentWindow.postMessage( 'slide:start', '*' );
				}

			}

		}

	}

	/**
	 * Stop playback of any embedded content inside of
	 * the targeted slide.
	 *
	 * @param {HTMLElement} element
	 */
	function stopEmbeddedContent( element, options ) {

		options = extend( {
			// Defaults
			unloadIframes: true
		}, options || {} );

		if( element && element.parentNode ) {
			// HTML5 media elements
			toArray( element.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.pause === 'function' ) {
					el.setAttribute('data-paused-by-reveal', '');
					el.pause();
				}
			} );

			// Generic postMessage API for non-lazy loaded iframes
			toArray( element.querySelectorAll( 'iframe' ) ).forEach( function( el ) {
				if( el.contentWindow ) el.contentWindow.postMessage( 'slide:stop', '*' );
				el.removeEventListener( 'load', startEmbeddedIframe );
			});

			// YouTube postMessage API
			toArray( element.querySelectorAll( 'iframe[src*="youtube.com/embed/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && el.contentWindow && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				}
			});

			// Vimeo postMessage API
			toArray( element.querySelectorAll( 'iframe[src*="player.vimeo.com/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && el.contentWindow && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			});

			if( options.unloadIframes === true ) {
				// Unload lazy-loaded iframes
				toArray( element.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
					// Only removing the src doesn't actually unload the frame
					// in all browsers (Firefox) so we set it to blank first
					el.setAttribute( 'src', 'about:blank' );
					el.removeAttribute( 'src' );
				} );
			}
		}

	}

	/**
	 * Returns the number of past slides. This can be used as a global
	 * flattened index for slides.
	 *
	 * @return {number} Past slide count
	 */
	function getSlidePastCount() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		// The number of past slides
		var pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for( var i = 0; i < horizontalSlides.length; i++ ) {

			var horizontalSlide = horizontalSlides[i];
			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );

			for( var j = 0; j < verticalSlides.length; j++ ) {

				// Stop as soon as we arrive at the present
				if( verticalSlides[j].classList.contains( 'present' ) ) {
					break mainLoop;
				}

				pastCount++;

			}

			// Stop as soon as we arrive at the present
			if( horizontalSlide.classList.contains( 'present' ) ) {
				break;
			}

			// Don't count the wrapping section for vertical slides
			if( horizontalSlide.classList.contains( 'stack' ) === false ) {
				pastCount++;
			}

		}

		return pastCount;

	}

	/**
	 * Returns a value ranging from 0-1 that represents
	 * how far into the presentation we have navigated.
	 *
	 * @return {number}
	 */
	function getProgress() {

		// The number of past and total slides
		var totalCount = getTotalSlides();
		var pastCount = getSlidePastCount();

		if( currentSlide ) {

			var allFragments = currentSlide.querySelectorAll( '.fragment' );

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if( allFragments.length > 0 ) {
				var visibleFragments = currentSlide.querySelectorAll( '.fragment.visible' );

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				var fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += ( visibleFragments.length / allFragments.length ) * fragmentWeight;
			}

		}

		return pastCount / ( totalCount - 1 );

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 *
	 * @return {boolean}
	 */
	function isSpeakerNotes() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {

		var hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		var bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is invalid and there is a name we can
		// assume that this is a named link
		if( isNaN( parseInt( bits[0], 10 ) ) && name.length ) {
			var element;

			// Ensure the named link is a valid HTML ID attribute
			if( /^[a-zA-Z][\w:.-]*$/.test( name ) ) {
				// Find the slide with the specified ID
				element = document.getElementById( name );
			}

			if( element ) {
				// Find the position of the named slide and navigate to it
				var indices = Reveal.getIndices( element );
				slide( indices.h, indices.v );
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh || 0, indexv || 0 );
			}
		}
		else {
			// Read the index components of the hash
			var h = parseInt( bits[0], 10 ) || 0,
				v = parseInt( bits[1], 10 ) || 0;

			if( h !== indexh || v !== indexv ) {
				slide( h, v );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {number} delay The time in ms to wait before
	 * writing the hash
	 */
	function writeURL( delay ) {

		if( config.history ) {

			// Make sure there's never more than one timeout running
			clearTimeout( writeURLTimeout );

			// If a delay is specified, timeout this call
			if( typeof delay === 'number' ) {
				writeURLTimeout = setTimeout( writeURL, delay );
			}
			else if( currentSlide ) {
				var url = '/';

				// Attempt to create a named link based on the slide's ID
				var id = currentSlide.getAttribute( 'id' );
				if( id ) {
					id = id.replace( /[^a-zA-Z0-9\-\_\:\.]/g, '' );
				}

				// If the current slide has an ID, use that as a named link
				if( typeof id === 'string' && id.length ) {
					url = '/' + id;
				}
				// Otherwise use the /h/v index
				else {
					if( indexh > 0 || indexv > 0 ) url += indexh;
					if( indexv > 0 ) url += '/' + indexv;
				}

				window.location.hash = url;
			}
		}

	}
	/**
	 * Retrieves the h/v location and fragment of the current,
	 * or specified, slide.
	 *
	 * @param {HTMLElement} [slide] If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {{h: number, v: number, f: number}}
	 */
	function getIndices( slide ) {

		// By default, return the current indices
		var h = indexh,
			v = indexv,
			f;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			var isVertical = isVerticalSlide( slide );
			var slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( toArray( slide.parentNode.querySelectorAll( 'section' ) ).indexOf( slide ), 0 );
			}
		}

		if( !slide && currentSlide ) {
			var hasFragments = currentSlide.querySelectorAll( '.fragment' ).length > 0;
			if( hasFragments ) {
				var currentFragment = currentSlide.querySelector( '.current-fragment' );
				if( currentFragment && currentFragment.hasAttribute( 'data-fragment-index' ) ) {
					f = parseInt( currentFragment.getAttribute( 'data-fragment-index' ), 10 );
				}
				else {
					f = currentSlide.querySelectorAll( '.fragment.visible' ).length - 1;
				}
			}
		}

		return { h: h, v: v, f: f };

	}

	/**
	 * Retrieves all slides in this presentation.
	 */
	function getSlides() {

		return toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ));

	}

	/**
	 * Retrieves the total number of slides in this presentation.
	 *
	 * @return {number}
	 */
	function getTotalSlides() {

		return getSlides().length;

	}

	/**
	 * Returns the slide element matching the specified index.
	 *
	 * @return {HTMLElement}
	 */
	function getSlide( x, y ) {

		var horizontalSlide = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR )[ x ];
		var verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll( 'section' );

		if( verticalSlides && verticalSlides.length && typeof y === 'number' ) {
			return verticalSlides ? verticalSlides[ y ] : undefined;
		}

		return horizontalSlide;

	}

	/**
	 * Returns the background element for the given slide.
	 * All slides, even the ones with no background properties
	 * defined, have a background element so as long as the
	 * index is valid an element will be returned.
	 *
	 * @param {number} x Horizontal background index
	 * @param {number} y Vertical background index
	 * @return {(HTMLElement[]|*)}
	 */
	function getSlideBackground( x, y ) {

		var slide = getSlide( x, y );
		if( slide ) {
			return slide.slideBackgroundElement;
		}

		return undefined;

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. As an <aside class="notes"> inside of the slide
	 *
	 * @param {HTMLElement} [slide=currentSlide]
	 * @return {(string|null)}
	 */
	function getSlideNotes( slide ) {

		// Default to the current slide
		slide = slide || currentSlide;

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using an <aside class="notes"> element
		var notesElement = slide.querySelector( 'aside.notes' );
		if( notesElement ) {
			return notesElement.innerHTML;
		}

		return null;

	}

	/**
	 * Retrieves the current state of the presentation as
	 * an object. This state can then be restored at any
	 * time.
	 *
	 * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
	 */
	function getState() {

		var indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: isOverview()
		};

	}

	/**
	 * Restores the presentation to the given state.
	 *
	 * @param {object} state As generated by getState()
	 * @see {@link getState} generates the parameter `state`
	 */
	function setState( state ) {

		if( typeof state === 'object' ) {
			slide( deserialize( state.indexh ), deserialize( state.indexv ), deserialize( state.indexf ) );

			var pausedFlag = deserialize( state.paused ),
				overviewFlag = deserialize( state.overview );

			if( typeof pausedFlag === 'boolean' && pausedFlag !== isPaused() ) {
				togglePause( pausedFlag );
			}

			if( typeof overviewFlag === 'boolean' && overviewFlag !== isOverview() ) {
				toggleOverview( overviewFlag );
			}
		}

	}

	/**
	 * Return a sorted fragments list, ordered by an increasing
	 * "data-fragment-index" attribute.
	 *
	 * Fragments will be revealed in the order that they are returned by
	 * this function, so you can use the index attributes to control the
	 * order of fragment appearance.
	 *
	 * To maintain a sensible default fragment order, fragments are presumed
	 * to be passed in document order. This function adds a "fragment-index"
	 * attribute to each node if such an attribute is not already present,
	 * and sets that attribute to an integer value which is the position of
	 * the fragment within the fragments list.
	 *
	 * @param {object[]|*} fragments
	 * @return {object[]} sorted Sorted array of fragments
	 */
	function sortFragments( fragments ) {

		fragments = toArray( fragments );

		var ordered = [],
			unordered = [],
			sorted = [];

		// Group ordered and unordered elements
		fragments.forEach( function( fragment, i ) {
			if( fragment.hasAttribute( 'data-fragment-index' ) ) {
				var index = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );

				if( !ordered[index] ) {
					ordered[index] = [];
				}

				ordered[index].push( fragment );
			}
			else {
				unordered.push( [ fragment ] );
			}
		} );

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat( unordered );

		// Manually count the index up per group to ensure there
		// are no gaps
		var index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach( function( group ) {
			group.forEach( function( fragment ) {
				sorted.push( fragment );
				fragment.setAttribute( 'data-fragment-index', index );
			} );

			index ++;
		} );

		return sorted;

	}

	/**
	 * Navigate to the specified slide fragment.
	 *
	 * @param {?number} index The index of the fragment that
	 * should be shown, -1 means all are invisible
	 * @param {number} offset Integer offset to apply to the
	 * fragment index
	 *
	 * @return {boolean} true if a change was made in any
	 * fragments visibility as part of this call
	 */
	function navigateFragment( index, offset ) {

		if( currentSlide && config.fragments ) {

			var fragments = sortFragments( currentSlide.querySelectorAll( '.fragment' ) );
			if( fragments.length ) {

				// If no index is specified, find the current
				if( typeof index !== 'number' ) {
					var lastVisibleFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();

					if( lastVisibleFragment ) {
						index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
					else {
						index = -1;
					}
				}

				// If an offset is specified, apply it to the index
				if( typeof offset === 'number' ) {
					index += offset;
				}

				var fragmentsShown = [],
					fragmentsHidden = [];

				toArray( fragments ).forEach( function( element, i ) {

					if( element.hasAttribute( 'data-fragment-index' ) ) {
						i = parseInt( element.getAttribute( 'data-fragment-index' ), 10 );
					}

					// Visible fragments
					if( i <= index ) {
						if( !element.classList.contains( 'visible' ) ) fragmentsShown.push( element );
						element.classList.add( 'visible' );
						element.classList.remove( 'current-fragment' );

						// Announce the fragments one by one to the Screen Reader
						dom.statusDiv.textContent = getStatusText( element );

						if( i === index ) {
							element.classList.add( 'current-fragment' );
							startEmbeddedContent( element );
						}
					}
					// Hidden fragments
					else {
						if( element.classList.contains( 'visible' ) ) fragmentsHidden.push( element );
						element.classList.remove( 'visible' );
						element.classList.remove( 'current-fragment' );
					}

				} );

				if( fragmentsHidden.length ) {
					dispatchEvent( 'fragmenthidden', { fragment: fragmentsHidden[0], fragments: fragmentsHidden } );
				}

				if( fragmentsShown.length ) {
					dispatchEvent( 'fragmentshown', { fragment: fragmentsShown[0], fragments: fragmentsShown } );
				}

				updateControls();
				updateProgress();

				return !!( fragmentsShown.length || fragmentsHidden.length );

			}

		}

		return false;

	}

	/**
	 * Navigate to the next slide fragment.
	 *
	 * @return {boolean} true if there was a next fragment,
	 * false otherwise
	 */
	function nextFragment() {

		return navigateFragment( null, 1 );

	}

	/**
	 * Navigate to the previous slide fragment.
	 *
	 * @return {boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	function previousFragment() {

		return navigateFragment( null, -1 );

	}

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {

		cancelAutoSlide();

		if( currentSlide && config.autoSlide !== false ) {

			var fragment = currentSlide.querySelector( '.current-fragment' );

			// When the slide first appears there is no "current" fragment so
			// we look for a data-autoslide timing on the first fragment
			if( !fragment ) fragment = currentSlide.querySelector( '.fragment' );

			var fragmentAutoSlide = fragment ? fragment.getAttribute( 'data-autoslide' ) : null;
			var parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute( 'data-autoslide' ) : null;
			var slideAutoSlide = currentSlide.getAttribute( 'data-autoslide' );

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if( fragmentAutoSlide ) {
				autoSlide = parseInt( fragmentAutoSlide, 10 );
			}
			else if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide, 10 );
			}
			else if( parentAutoSlide ) {
				autoSlide = parseInt( parentAutoSlide, 10 );
			}
			else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments.
			// playbackRate is accounted for in the duration.
			if( currentSlide.querySelectorAll( '.fragment' ).length === 0 ) {
				toArray( currentSlide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
					if( el.hasAttribute( 'data-autoplay' ) ) {
						if( autoSlide && (el.duration * 1000 / el.playbackRate ) > autoSlide ) {
							autoSlide = ( el.duration * 1000 / el.playbackRate ) + 1000;
						}
					}
				} );
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if( autoSlide && !autoSlidePaused && !isPaused() && !isOverview() && ( !Reveal.isLastSlide() || availableFragments().next || config.loop === true ) ) {
				autoSlideTimeout = setTimeout( function() {
					typeof config.autoSlideMethod === 'function' ? config.autoSlideMethod() : navigateNext();
					cueAutoSlide();
				}, autoSlide );
				autoSlideStartTime = Date.now();
			}

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( autoSlideTimeout !== -1 );
			}

		}

	}

	/**
	 * Cancels any ongoing request to auto-slide.
	 */
	function cancelAutoSlide() {

		clearTimeout( autoSlideTimeout );
		autoSlideTimeout = -1;

	}

	function pauseAutoSlide() {

		if( autoSlide && !autoSlidePaused ) {
			autoSlidePaused = true;
			dispatchEvent( 'autoslidepaused' );
			clearTimeout( autoSlideTimeout );

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( false );
			}
		}

	}

	function resumeAutoSlide() {

		if( autoSlide && autoSlidePaused ) {
			autoSlidePaused = false;
			dispatchEvent( 'autoslideresumed' );
			cueAutoSlide();
		}

	}

	function navigateLeft() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || nextFragment() === false ) && availableRoutes().left ) {
				slide( indexh + 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || previousFragment() === false ) && availableRoutes().left ) {
			slide( indexh - 1 );
		}

	}

	function navigateRight() {

		hasNavigatedRight = true;

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || previousFragment() === false ) && availableRoutes().right ) {
				slide( indexh - 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || nextFragment() === false ) && availableRoutes().right ) {
			slide( indexh + 1 );
		}

	}

	function navigateUp() {

		// Prioritize hiding fragments
		if( ( isOverview() || previousFragment() === false ) && availableRoutes().up ) {
			slide( indexh, indexv - 1 );
		}

	}

	function navigateDown() {

		hasNavigatedDown = true;

		// Prioritize revealing fragments
		if( ( isOverview() || nextFragment() === false ) && availableRoutes().down ) {
			slide( indexh, indexv + 1 );
		}

	}

	/**
	 * Navigates backwards, prioritized in the following order:
	 * 1) Previous fragment
	 * 2) Previous vertical slide
	 * 3) Previous horizontal slide
	 */
	function navigatePrev() {

		// Prioritize revealing fragments
		if( previousFragment() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				var previousSlide;

				if( config.rtl ) {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.future' ) ).pop();
				}
				else {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.past' ) ).pop();
				}

				if( previousSlide ) {
					var v = ( previousSlide.querySelectorAll( 'section' ).length - 1 ) || undefined;
					var h = indexh - 1;
					slide( h, v );
				}
			}
		}

	}

	/**
	 * The reverse of #navigatePrev().
	 */
	function navigateNext() {

		hasNavigatedRight = true;
		hasNavigatedDown = true;

		// Prioritize revealing fragments
		if( nextFragment() === false ) {
			if( availableRoutes().down ) {
				navigateDown();
			}
			else if( config.rtl ) {
				navigateLeft();
			}
			else {
				navigateRight();
			}
		}

	}

	/**
	 * Checks if the target element prevents the triggering of
	 * swipe navigation.
	 */
	function isSwipePrevented( target ) {

		while( target && typeof target.hasAttribute === 'function' ) {
			if( target.hasAttribute( 'data-prevent-swipe' ) ) return true;
			target = target.parentNode;
		}

		return false;

	}


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
	 * Called by all event handlers that are based on user
	 * input.
	 *
	 * @param {object} [event]
	 */
	function onUserInput( event ) {

		if( config.autoSlideStoppable ) {
			pauseAutoSlide();
		}

	}

	/**
	 * Handler for the document level 'keypress' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyPress( event ) {

		// Check if the pressed key is question mark
		if( event.shiftKey && event.charCode === 63 ) {
			toggleHelp();
		}

	}

	/**
	 * Handler for the document level 'keydown' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyDown( event ) {

		// If there's a condition specified and it returns false,
		// ignore this event
		if( typeof config.keyboardCondition === 'function' && config.keyboardCondition() === false ) {
			return true;
		}

		// Remember if auto-sliding was paused so we can toggle it
		var autoSlideWasPaused = autoSlidePaused;

		onUserInput( event );

		// Check if there's a focused element that could be using
		// the keyboard
		var activeElementIsCE = document.activeElement && document.activeElement.contentEditable !== 'inherit';
		var activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test( document.activeElement.tagName );
		var activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test( document.activeElement.className);

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if( activeElementIsCE || activeElementIsInput || activeElementIsNotes || (event.shiftKey && event.keyCode !== 32) || event.altKey || event.ctrlKey || event.metaKey ) return;

		// While paused only allow resume keyboard events; 'b', 'v', '.'
		var resumeKeyCodes = [66,86,190,191];
		var key;

		// Custom key bindings for togglePause should be able to resume
		if( typeof config.keyboard === 'object' ) {
			for( key in config.keyboard ) {
				if( config.keyboard[key] === 'togglePause' ) {
					resumeKeyCodes.push( parseInt( key, 10 ) );
				}
			}
		}

		if( isPaused() && resumeKeyCodes.indexOf( event.keyCode ) === -1 ) {
			return false;
		}

		var triggered = false;

		// 1. User defined key bindings
		if( typeof config.keyboard === 'object' ) {

			for( key in config.keyboard ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === event.keyCode ) {

					var value = config.keyboard[ key ];

					// Callback function
					if( typeof value === 'function' ) {
						value.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof value === 'string' && typeof Reveal[ value ] === 'function' ) {
						Reveal[ value ].call();
					}

					triggered = true;

				}

			}

		}

		// 2. System defined key bindings
		if( triggered === false ) {

			// Assume true and try to prove false
			triggered = true;

			switch( event.keyCode ) {
				// p, page up
				case 80: case 33: navigatePrev(); break;
				// n, page down
				case 78: case 34: navigateNext(); break;
				// h, left
				case 72: case 37: navigateLeft(); break;
				// l, right
				case 76: case 39: navigateRight(); break;
				// k, up
				case 75: case 38: navigateUp(); break;
				// j, down
				case 74: case 40: navigateDown(); break;
				// home
				case 36: slide( 0 ); break;
				// end
				case 35: slide( Number.MAX_VALUE ); break;
				// space
				case 32: isOverview() ? deactivateOverview() : event.shiftKey ? navigatePrev() : navigateNext(); break;
				// return
				case 13: isOverview() ? deactivateOverview() : triggered = false; break;
				// two-spot, semicolon, b, v, period, Logitech presenter tools "black screen" button
				case 58: case 59: case 66: case 86: case 190: case 191: togglePause(); break;
				// f
				case 70: enterFullscreen(); break;
				// a
				case 65: if ( config.autoSlideStoppable ) toggleAutoSlide( autoSlideWasPaused ); break;
				default:
					triggered = false;
			}

		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if ( ( event.keyCode === 27 || event.keyCode === 79 ) && features.transforms3d ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				toggleOverview();
			}

			event.preventDefault && event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		cueAutoSlide();

	}

	/**
	 * Handler for the 'touchstart' event, enables support for
	 * swipe and pinch gestures.
	 *
	 * @param {object} event
	 */
	function onTouchStart( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

		// If there's two touches we need to memorize the distance
		// between those two points to detect pinching
		if( event.touches.length === 2 && config.overview ) {
			touch.startSpan = distanceBetween( {
				x: event.touches[1].clientX,
				y: event.touches[1].clientY
			}, {
				x: touch.startX,
				y: touch.startY
			} );
		}

	}

	/**
	 * Handler for the 'touchmove' event.
	 *
	 * @param {object} event
	 */
	function onTouchMove( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		// Each touch should only trigger one action
		if( !touch.captured ) {
			onUserInput( event );

			var currentX = event.touches[0].clientX;
			var currentY = event.touches[0].clientY;

			// If the touch started with two points and still has
			// two active touches; test for the pinch gesture
			if( event.touches.length === 2 && touch.startCount === 2 && config.overview ) {

				// The current distance in pixels between the two touch points
				var currentSpan = distanceBetween( {
					x: event.touches[1].clientX,
					y: event.touches[1].clientY
				}, {
					x: touch.startX,
					y: touch.startY
				} );

				// If the span is larger than the desire amount we've got
				// ourselves a pinch
				if( Math.abs( touch.startSpan - currentSpan ) > touch.threshold ) {
					touch.captured = true;

					if( currentSpan < touch.startSpan ) {
						activateOverview();
					}
					else {
						deactivateOverview();
					}
				}

				event.preventDefault();

			}
			// There was only one touch point, look for a swipe
			else if( event.touches.length === 1 && touch.startCount !== 2 ) {

				var deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateLeft();
				}
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateRight();
				}
				else if( deltaY > touch.threshold ) {
					touch.captured = true;
					navigateUp();
				}
				else if( deltaY < -touch.threshold ) {
					touch.captured = true;
					navigateDown();
				}

				// If we're embedded, only block touch events if they have
				// triggered an action
				if( config.embedded ) {
					if( touch.captured || isVerticalSlide( currentSlide ) ) {
						event.preventDefault();
					}
				}
				// Not embedded? Block them all to avoid needless tossing
				// around of the viewport in iOS
				else {
					event.preventDefault();
				}

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( UA.match( /android/gi ) ) {
			event.preventDefault();
		}

	}

	/**
	 * Handler for the 'touchend' event.
	 *
	 * @param {object} event
	 */
	function onTouchEnd( event ) {

		touch.captured = false;

	}

	/**
	 * Convert pointer down to touch start.
	 *
	 * @param {object} event
	 */
	function onPointerDown( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" ) {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart( event );
		}

	}

	/**
	 * Convert pointer move to touch move.
	 *
	 * @param {object} event
	 */
	function onPointerMove( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove( event );
		}

	}

	/**
	 * Convert pointer up to touch end.
	 *
	 * @param {object} event
	 */
	function onPointerUp( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd( event );
		}

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 *
	 * @param {object} event
	 */
	function onDocumentMouseScroll( event ) {

		if( Date.now() - lastMouseWheelStep > 600 ) {

			lastMouseWheelStep = Date.now();

			var delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else if( delta < 0 ) {
				navigatePrev();
			}

		}

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 *
	 * @param {object} event
	 */
	function onProgressClicked( event ) {

		onUserInput( event );

		event.preventDefault();

		var slidesTotal = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).length;
		var slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		if( config.rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide( slideIndex );

	}

	/**
	 * Event handler for navigation control buttons.
	 */
	function onNavigateLeftClicked( event ) { event.preventDefault(); onUserInput(); navigateLeft(); }
	function onNavigateRightClicked( event ) { event.preventDefault(); onUserInput(); navigateRight(); }
	function onNavigateUpClicked( event ) { event.preventDefault(); onUserInput(); navigateUp(); }
	function onNavigateDownClicked( event ) { event.preventDefault(); onUserInput(); navigateDown(); }
	function onNavigatePrevClicked( event ) { event.preventDefault(); onUserInput(); navigatePrev(); }
	function onNavigateNextClicked( event ) { event.preventDefault(); onUserInput(); navigateNext(); }

	/**
	 * Handler for the window level 'hashchange' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowHashChange( event ) {

		readURL();

	}

	/**
	 * Handler for the window level 'resize' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowResize( event ) {

		layout();

	}

	/**
	 * Handle for the window level 'visibilitychange' event.
	 *
	 * @param {object} [event]
	 */
	function onPageVisibilityChange( event ) {

		var isHidden =  document.webkitHidden ||
						document.msHidden ||
						document.hidden;

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if( isHidden === false && document.activeElement !== document.body ) {
			// Not all elements support .blur() - SVGs among them.
			if( typeof document.activeElement.blur === 'function' ) {
				document.activeElement.blur();
			}
			document.body.focus();
		}

	}

	/**
	 * Invoked when a slide is and we're in the overview.
	 *
	 * @param {object} event
	 */
	function onOverviewSlideClicked( event ) {

		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if( eventsAreBound && isOverview() ) {
			event.preventDefault();

			var element = event.target;

			while( element && !element.nodeName.match( /section/gi ) ) {
				element = element.parentNode;
			}

			if( element && !element.classList.contains( 'disabled' ) ) {

				deactivateOverview();

				if( element.nodeName.match( /section/gi ) ) {
					var h = parseInt( element.getAttribute( 'data-index-h' ), 10 ),
						v = parseInt( element.getAttribute( 'data-index-v' ), 10 );

					slide( h, v );
				}

			}
		}

	}

	/**
	 * Handles clicks on links that are set to preview in the
	 * iframe overlay.
	 *
	 * @param {object} event
	 */
	function onPreviewLinkClicked( event ) {

		if( event.currentTarget && event.currentTarget.hasAttribute( 'href' ) ) {
			var url = event.currentTarget.getAttribute( 'href' );
			if( url ) {
				showPreview( url );
				event.preventDefault();
			}
		}

	}

	/**
	 * Handles click on the auto-sliding controls element.
	 *
	 * @param {object} [event]
	 */
	function onAutoSlidePlayerClick( event ) {

		// Replay
		if( Reveal.isLastSlide() && config.loop === false ) {
			slide( 0, 0 );
			resumeAutoSlide();
		}
		// Resume
		else if( autoSlidePaused ) {
			resumeAutoSlide();
		}
		// Pause
		else {
			pauseAutoSlide();
		}

	}


	// --------------------------------------------------------------------//
	// ------------------------ PLAYBACK COMPONENT ------------------------//
	// --------------------------------------------------------------------//


	/**
	 * Constructor for the playback component, which displays
	 * play/pause/progress controls.
	 *
	 * @param {HTMLElement} container The component will append
	 * itself to this
	 * @param {function} progressCheck A method which will be
	 * called frequently to get the current progress on a range
	 * of 0-1
	 */
	function Playback( container, progressCheck ) {

		// Cosmetics
		this.diameter = 100;
		this.diameter2 = this.diameter/2;
		this.thickness = 6;

		// Flags if we are currently playing
		this.playing = false;

		// Current progress on a 0-1 range
		this.progress = 0;

		// Used to loop the animation smoothly
		this.progressOffset = 1;

		this.container = container;
		this.progressCheck = progressCheck;

		this.canvas = document.createElement( 'canvas' );
		this.canvas.className = 'playback';
		this.canvas.width = this.diameter;
		this.canvas.height = this.diameter;
		this.canvas.style.width = this.diameter2 + 'px';
		this.canvas.style.height = this.diameter2 + 'px';
		this.context = this.canvas.getContext( '2d' );

		this.container.appendChild( this.canvas );

		this.render();

	}

	/**
	 * @param value
	 */
	Playback.prototype.setPlaying = function( value ) {

		var wasPlaying = this.playing;

		this.playing = value;

		// Start repainting if we weren't already
		if( !wasPlaying && this.playing ) {
			this.animate();
		}
		else {
			this.render();
		}

	};

	Playback.prototype.animate = function() {

		var progressBefore = this.progress;

		this.progress = this.progressCheck();

		// When we loop, offset the progress so that it eases
		// smoothly rather than immediately resetting
		if( progressBefore > 0.8 && this.progress < 0.2 ) {
			this.progressOffset = this.progress;
		}

		this.render();

		if( this.playing ) {
			features.requestAnimationFrameMethod.call( window, this.animate.bind( this ) );
		}

	};

	/**
	 * Renders the current progress and playback state.
	 */
	Playback.prototype.render = function() {

		var progress = this.playing ? this.progress : 0,
			radius = ( this.diameter2 ) - this.thickness,
			x = this.diameter2,
			y = this.diameter2,
			iconSize = 28;

		// Ease towards 1
		this.progressOffset += ( 1 - this.progressOffset ) * 0.1;

		var endAngle = ( - Math.PI / 2 ) + ( progress * ( Math.PI * 2 ) );
		var startAngle = ( - Math.PI / 2 ) + ( this.progressOffset * ( Math.PI * 2 ) );

		this.context.save();
		this.context.clearRect( 0, 0, this.diameter, this.diameter );

		// Solid background color
		this.context.beginPath();
		this.context.arc( x, y, radius + 4, 0, Math.PI * 2, false );
		this.context.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
		this.context.fill();

		// Draw progress track
		this.context.beginPath();
		this.context.arc( x, y, radius, 0, Math.PI * 2, false );
		this.context.lineWidth = this.thickness;
		this.context.strokeStyle = 'rgba( 255, 255, 255, 0.2 )';
		this.context.stroke();

		if( this.playing ) {
			// Draw progress on top of track
			this.context.beginPath();
			this.context.arc( x, y, radius, startAngle, endAngle, false );
			this.context.lineWidth = this.thickness;
			this.context.strokeStyle = '#fff';
			this.context.stroke();
		}

		this.context.translate( x - ( iconSize / 2 ), y - ( iconSize / 2 ) );

		// Draw play/pause icons
		if( this.playing ) {
			this.context.fillStyle = '#fff';
			this.context.fillRect( 0, 0, iconSize / 2 - 4, iconSize );
			this.context.fillRect( iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize );
		}
		else {
			this.context.beginPath();
			this.context.translate( 4, 0 );
			this.context.moveTo( 0, 0 );
			this.context.lineTo( iconSize - 4, iconSize / 2 );
			this.context.lineTo( 0, iconSize );
			this.context.fillStyle = '#fff';
			this.context.fill();
		}

		this.context.restore();

	};

	Playback.prototype.on = function( type, listener ) {
		this.canvas.addEventListener( type, listener, false );
	};

	Playback.prototype.off = function( type, listener ) {
		this.canvas.removeEventListener( type, listener, false );
	};

	Playback.prototype.destroy = function() {

		this.playing = false;

		if( this.canvas.parentNode ) {
			this.container.removeChild( this.canvas );
		}

	};


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	Reveal = {
		VERSION: VERSION,

		initialize: initialize,
		configure: configure,
		sync: sync,

		// Navigation methods
		slide: slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Fragment methods
		navigateFragment: navigateFragment,
		prevFragment: previousFragment,
		nextFragment: nextFragment,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Forces an update in slide layout
		layout: layout,

		// Randomizes the order of slides
		shuffle: shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes: availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments: availableFragments,

		// Toggles a help overlay with keyboard shortcuts
		toggleHelp: toggleHelp,

		// Toggles the overview mode on/off
		toggleOverview: toggleOverview,

		// Toggles the "black screen" mode on/off
		togglePause: togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide: toggleAutoSlide,

		// State checks
		isOverview: isOverview,
		isPaused: isPaused,
		isAutoSliding: isAutoSliding,
		isSpeakerNotes: isSpeakerNotes,

		// Slide preloading
		loadSlide: loadSlide,
		unloadSlide: unloadSlide,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Facility for persisting and restoring the presentation state
		getState: getState,
		setState: setState,

		// Presentation progress
		getSlidePastCount: getSlidePastCount,

		// Presentation progress on range of 0-1
		getProgress: getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices: getIndices,

		// Returns an Array of all slides
		getSlides: getSlides,

		// Returns the total number of slides
		getTotalSlides: getTotalSlides,

		// Returns the slide element at the specified index
		getSlide: getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground: getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes: getSlideNotes,

		// Returns the previous slide element, may be null
		getPreviousSlide: function() {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: function() {
			return currentSlide;
		},

		// Returns the current scale of the presentation content
		getScale: function() {
			return scale;
		},

		// Returns the current configuration object
		getConfig: function() {
			return config;
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: function() {
			var query = {};

			location.search.replace( /[A-Z0-9]+?=([\w\.%-]*)/gi, function(a) {
				query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
			} );

			// Basic deserialization
			for( var i in query ) {
				var value = query[ i ];

				query[ i ] = deserialize( unescape( value ) );
			}

			return query;
		},

		// Returns true if we're currently on the first slide
		isFirstSlide: function() {
			return ( indexh === 0 && indexv === 0 );
		},

		// Returns true if we're currently on the last slide
		isLastSlide: function() {
			if( currentSlide ) {
				// Does this slide has next a sibling?
				if( currentSlide.nextElementSibling ) return false;

				// If it's vertical, does its parent have a next sibling?
				if( isVerticalSlide( currentSlide ) && currentSlide.parentNode.nextElementSibling ) return false;

				return true;
			}

			return false;
		},

		// Checks if reveal.js has been loaded and is ready for use
		isReady: function() {
			return loaded;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).addEventListener( type, listener, useCapture );
			}
		},
		removeEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).removeEventListener( type, listener, useCapture );
			}
		},

		// Programatically triggers a keyboard event
		triggerKey: function( keyCode ) {
			onDocumentKeyDown( { keyCode: keyCode } );
		},

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: function( key, value ) {
			keyboardShortcuts[key] = value;
		}
	};

	return Reveal;

}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(6);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../css-loader/index.js!./reveal.css", function() {
		var newContent = require("!!../../css-loader/index.js!./reveal.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*!\n * reveal.js\n * http://revealjs.com\n * MIT licensed\n *\n * Copyright (C) 2017 Hakim El Hattab, http://hakim.se\n */\n/*********************************************\n * RESET STYLES\n *********************************************/\nhtml, body, .reveal div, .reveal span, .reveal applet, .reveal object, .reveal iframe,\n.reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6, .reveal p, .reveal blockquote, .reveal pre,\n.reveal a, .reveal abbr, .reveal acronym, .reveal address, .reveal big, .reveal cite, .reveal code,\n.reveal del, .reveal dfn, .reveal em, .reveal img, .reveal ins, .reveal kbd, .reveal q, .reveal s, .reveal samp,\n.reveal small, .reveal strike, .reveal strong, .reveal sub, .reveal sup, .reveal tt, .reveal var,\n.reveal b, .reveal u, .reveal center,\n.reveal dl, .reveal dt, .reveal dd, .reveal ol, .reveal ul, .reveal li,\n.reveal fieldset, .reveal form, .reveal label, .reveal legend,\n.reveal table, .reveal caption, .reveal tbody, .reveal tfoot, .reveal thead, .reveal tr, .reveal th, .reveal td,\n.reveal article, .reveal aside, .reveal canvas, .reveal details, .reveal embed,\n.reveal figure, .reveal figcaption, .reveal footer, .reveal header, .reveal hgroup,\n.reveal menu, .reveal nav, .reveal output, .reveal ruby, .reveal section, .reveal summary,\n.reveal time, .reveal mark, .reveal audio, .reveal video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline; }\n\n.reveal article, .reveal aside, .reveal details, .reveal figcaption, .reveal figure,\n.reveal footer, .reveal header, .reveal hgroup, .reveal menu, .reveal nav, .reveal section {\n  display: block; }\n\n/*********************************************\n * GLOBAL STYLES\n *********************************************/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\nbody {\n  position: relative;\n  line-height: 1;\n  background-color: #fff;\n  color: #000; }\n\n/*********************************************\n * VIEW FRAGMENTS\n *********************************************/\n.reveal .slides section .fragment {\n  opacity: 0;\n  visibility: hidden;\n  transition: all .2s ease; }\n  .reveal .slides section .fragment.visible {\n    opacity: 1;\n    visibility: inherit; }\n\n.reveal .slides section .fragment.grow {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.grow.visible {\n    -webkit-transform: scale(1.3);\n            transform: scale(1.3); }\n\n.reveal .slides section .fragment.shrink {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.shrink.visible {\n    -webkit-transform: scale(0.7);\n            transform: scale(0.7); }\n\n.reveal .slides section .fragment.zoom-in {\n  -webkit-transform: scale(0.1);\n          transform: scale(0.1); }\n  .reveal .slides section .fragment.zoom-in.visible {\n    -webkit-transform: none;\n            transform: none; }\n\n.reveal .slides section .fragment.fade-out {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.fade-out.visible {\n    opacity: 0;\n    visibility: hidden; }\n\n.reveal .slides section .fragment.semi-fade-out {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.semi-fade-out.visible {\n    opacity: 0.5;\n    visibility: inherit; }\n\n.reveal .slides section .fragment.strike {\n  opacity: 1;\n  visibility: inherit; }\n  .reveal .slides section .fragment.strike.visible {\n    text-decoration: line-through; }\n\n.reveal .slides section .fragment.fade-up {\n  -webkit-transform: translate(0, 20%);\n          transform: translate(0, 20%); }\n  .reveal .slides section .fragment.fade-up.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.fade-down {\n  -webkit-transform: translate(0, -20%);\n          transform: translate(0, -20%); }\n  .reveal .slides section .fragment.fade-down.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.fade-right {\n  -webkit-transform: translate(-20%, 0);\n          transform: translate(-20%, 0); }\n  .reveal .slides section .fragment.fade-right.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.fade-left {\n  -webkit-transform: translate(20%, 0);\n          transform: translate(20%, 0); }\n  .reveal .slides section .fragment.fade-left.visible {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.reveal .slides section .fragment.current-visible {\n  opacity: 0;\n  visibility: hidden; }\n  .reveal .slides section .fragment.current-visible.current-fragment {\n    opacity: 1;\n    visibility: inherit; }\n\n.reveal .slides section .fragment.highlight-red,\n.reveal .slides section .fragment.highlight-current-red,\n.reveal .slides section .fragment.highlight-green,\n.reveal .slides section .fragment.highlight-current-green,\n.reveal .slides section .fragment.highlight-blue,\n.reveal .slides section .fragment.highlight-current-blue {\n  opacity: 1;\n  visibility: inherit; }\n\n.reveal .slides section .fragment.highlight-red.visible {\n  color: #ff2c2d; }\n\n.reveal .slides section .fragment.highlight-green.visible {\n  color: #17ff2e; }\n\n.reveal .slides section .fragment.highlight-blue.visible {\n  color: #1b91ff; }\n\n.reveal .slides section .fragment.highlight-current-red.current-fragment {\n  color: #ff2c2d; }\n\n.reveal .slides section .fragment.highlight-current-green.current-fragment {\n  color: #17ff2e; }\n\n.reveal .slides section .fragment.highlight-current-blue.current-fragment {\n  color: #1b91ff; }\n\n/*********************************************\n * DEFAULT ELEMENT STYLES\n *********************************************/\n/* Fixes issue in Chrome where italic fonts did not appear when printing to PDF */\n.reveal:after {\n  content: '';\n  font-style: italic; }\n\n.reveal iframe {\n  z-index: 1; }\n\n/** Prevents layering issues in certain browser/transition combinations */\n.reveal a {\n  position: relative; }\n\n.reveal .stretch {\n  max-width: none;\n  max-height: none; }\n\n.reveal pre.stretch code {\n  height: 100%;\n  max-height: 100%;\n  box-sizing: border-box; }\n\n/*********************************************\n * CONTROLS\n *********************************************/\n@-webkit-keyframes bounce-right {\n  0%, 10%, 25%, 40%, 50% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0); }\n  20% {\n    -webkit-transform: translateX(10px);\n            transform: translateX(10px); }\n  30% {\n    -webkit-transform: translateX(-5px);\n            transform: translateX(-5px); } }\n@keyframes bounce-right {\n  0%, 10%, 25%, 40%, 50% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0); }\n  20% {\n    -webkit-transform: translateX(10px);\n            transform: translateX(10px); }\n  30% {\n    -webkit-transform: translateX(-5px);\n            transform: translateX(-5px); } }\n\n@-webkit-keyframes bounce-down {\n  0%, 10%, 25%, 40%, 50% {\n    -webkit-transform: translateY(0);\n            transform: translateY(0); }\n  20% {\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px); }\n  30% {\n    -webkit-transform: translateY(-5px);\n            transform: translateY(-5px); } }\n\n@keyframes bounce-down {\n  0%, 10%, 25%, 40%, 50% {\n    -webkit-transform: translateY(0);\n            transform: translateY(0); }\n  20% {\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px); }\n  30% {\n    -webkit-transform: translateY(-5px);\n            transform: translateY(-5px); } }\n\n.reveal .controls {\n  display: none;\n  position: absolute;\n  top: auto;\n  bottom: 12px;\n  right: 12px;\n  left: auto;\n  z-index: 1;\n  color: #000;\n  pointer-events: none;\n  font-size: 10px; }\n  .reveal .controls button {\n    position: absolute;\n    padding: 0;\n    background-color: transparent;\n    border: 0;\n    outline: 0;\n    cursor: pointer;\n    color: currentColor;\n    -webkit-transform: scale(0.9999);\n            transform: scale(0.9999);\n    transition: color 0.2s ease, opacity 0.2s ease, -webkit-transform 0.2s ease;\n    transition: color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;\n    z-index: 2;\n    pointer-events: auto;\n    font-size: inherit;\n    visibility: hidden;\n    opacity: 0;\n    -webkit-appearance: none;\n    -webkit-tap-highlight-color: transparent; }\n  .reveal .controls .controls-arrow:before,\n  .reveal .controls .controls-arrow:after {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 2.6em;\n    height: 0.5em;\n    border-radius: 0.25em;\n    background-color: currentColor;\n    transition: all 0.15s ease, background-color 0.8s ease;\n    -webkit-transform-origin: 0.2em 50%;\n            transform-origin: 0.2em 50%;\n    will-change: transform; }\n  .reveal .controls .controls-arrow {\n    position: relative;\n    width: 3.6em;\n    height: 3.6em; }\n    .reveal .controls .controls-arrow:before {\n      -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(45deg);\n              transform: translateX(0.5em) translateY(1.55em) rotate(45deg); }\n    .reveal .controls .controls-arrow:after {\n      -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(-45deg);\n              transform: translateX(0.5em) translateY(1.55em) rotate(-45deg); }\n    .reveal .controls .controls-arrow:hover:before {\n      -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(40deg);\n              transform: translateX(0.5em) translateY(1.55em) rotate(40deg); }\n    .reveal .controls .controls-arrow:hover:after {\n      -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(-40deg);\n              transform: translateX(0.5em) translateY(1.55em) rotate(-40deg); }\n    .reveal .controls .controls-arrow:active:before {\n      -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(36deg);\n              transform: translateX(0.5em) translateY(1.55em) rotate(36deg); }\n    .reveal .controls .controls-arrow:active:after {\n      -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(-36deg);\n              transform: translateX(0.5em) translateY(1.55em) rotate(-36deg); }\n  .reveal .controls .navigate-left {\n    right: 6.4em;\n    bottom: 3.2em;\n    -webkit-transform: translateX(-10px);\n            transform: translateX(-10px); }\n  .reveal .controls .navigate-right {\n    right: 0;\n    bottom: 3.2em;\n    -webkit-transform: translateX(10px);\n            transform: translateX(10px); }\n    .reveal .controls .navigate-right .controls-arrow {\n      -webkit-transform: rotate(180deg);\n              transform: rotate(180deg); }\n    .reveal .controls .navigate-right.highlight {\n      -webkit-animation: bounce-right 2s 50 both ease-out;\n              animation: bounce-right 2s 50 both ease-out; }\n  .reveal .controls .navigate-up {\n    right: 3.2em;\n    bottom: 6.4em;\n    -webkit-transform: translateY(-10px);\n            transform: translateY(-10px); }\n    .reveal .controls .navigate-up .controls-arrow {\n      -webkit-transform: rotate(90deg);\n              transform: rotate(90deg); }\n  .reveal .controls .navigate-down {\n    right: 3.2em;\n    bottom: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px); }\n    .reveal .controls .navigate-down .controls-arrow {\n      -webkit-transform: rotate(-90deg);\n              transform: rotate(-90deg); }\n    .reveal .controls .navigate-down.highlight {\n      -webkit-animation: bounce-down 2s 50 both ease-out;\n              animation: bounce-down 2s 50 both ease-out; }\n  .reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-left.enabled,\n  .reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-up.enabled {\n    opacity: 0.3; }\n    .reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-left.enabled:hover,\n    .reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-up.enabled:hover {\n      opacity: 1; }\n  .reveal .controls[data-controls-back-arrows=\"hidden\"] .navigate-left.enabled,\n  .reveal .controls[data-controls-back-arrows=\"hidden\"] .navigate-up.enabled {\n    opacity: 0;\n    visibility: hidden; }\n  .reveal .controls .enabled {\n    visibility: visible;\n    opacity: 0.9;\n    cursor: pointer;\n    -webkit-transform: none;\n            transform: none; }\n  .reveal .controls .enabled.fragmented {\n    opacity: 0.5; }\n  .reveal .controls .enabled:hover,\n  .reveal .controls .enabled.fragmented:hover {\n    opacity: 1; }\n\n.reveal:not(.has-vertical-slides) .controls .navigate-left {\n  bottom: 1.4em;\n  right: 5.5em; }\n\n.reveal:not(.has-vertical-slides) .controls .navigate-right {\n  bottom: 1.4em;\n  right: 0.5em; }\n\n.reveal:not(.has-horizontal-slides) .controls .navigate-up {\n  right: 1.4em;\n  bottom: 5em; }\n\n.reveal:not(.has-horizontal-slides) .controls .navigate-down {\n  right: 1.4em;\n  bottom: 0.5em; }\n\n.reveal.has-dark-background .controls {\n  color: #fff; }\n\n.reveal.has-light-background .controls {\n  color: #000; }\n\n.reveal.no-hover .controls .controls-arrow:hover:before,\n.reveal.no-hover .controls .controls-arrow:active:before {\n  -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(45deg);\n          transform: translateX(0.5em) translateY(1.55em) rotate(45deg); }\n\n.reveal.no-hover .controls .controls-arrow:hover:after,\n.reveal.no-hover .controls .controls-arrow:active:after {\n  -webkit-transform: translateX(0.5em) translateY(1.55em) rotate(-45deg);\n          transform: translateX(0.5em) translateY(1.55em) rotate(-45deg); }\n\n@media screen and (min-width: 500px) {\n  .reveal .controls[data-controls-layout=\"edges\"] {\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0; }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-left,\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-right,\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-up,\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-down {\n    bottom: auto;\n    right: auto; }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-left {\n    top: 50%;\n    left: 8px;\n    margin-top: -1.8em; }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-right {\n    top: 50%;\n    right: 8px;\n    margin-top: -1.8em; }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-up {\n    top: 8px;\n    left: 50%;\n    margin-left: -1.8em; }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-down {\n    bottom: 8px;\n    left: 50%;\n    margin-left: -1.8em; } }\n\n/*********************************************\n * PROGRESS BAR\n *********************************************/\n.reveal .progress {\n  position: absolute;\n  display: none;\n  height: 3px;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  background-color: rgba(0, 0, 0, 0.2);\n  color: #fff; }\n\n.reveal .progress:after {\n  content: '';\n  display: block;\n  position: absolute;\n  height: 10px;\n  width: 100%;\n  top: -10px; }\n\n.reveal .progress span {\n  display: block;\n  height: 100%;\n  width: 0px;\n  background-color: currentColor;\n  transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n\n/*********************************************\n * SLIDE NUMBER\n *********************************************/\n.reveal .slide-number {\n  position: fixed;\n  display: block;\n  right: 8px;\n  bottom: 8px;\n  z-index: 31;\n  font-family: Helvetica, sans-serif;\n  font-size: 12px;\n  line-height: 1;\n  color: #fff;\n  background-color: rgba(0, 0, 0, 0.4);\n  padding: 5px; }\n\n.reveal .slide-number-delimiter {\n  margin: 0 3px; }\n\n/*********************************************\n * SLIDES\n *********************************************/\n.reveal {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  -ms-touch-action: none;\n      touch-action: none; }\n\n@media only screen and (orientation: landscape) {\n  .reveal.ua-iphone {\n    position: fixed; } }\n\n.reveal .slides {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  pointer-events: none;\n  overflow: visible;\n  z-index: 1;\n  text-align: center;\n  -webkit-perspective: 600px;\n          perspective: 600px;\n  -webkit-perspective-origin: 50% 40%;\n          perspective-origin: 50% 40%; }\n\n.reveal .slides > section {\n  -ms-perspective: 600px; }\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  display: none;\n  position: absolute;\n  width: 100%;\n  padding: 20px 0px;\n  pointer-events: auto;\n  z-index: 10;\n  -webkit-transform-style: flat;\n          transform-style: flat;\n  transition: -webkit-transform-origin 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), -webkit-transform 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), visibility 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), opacity 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  transition: transform-origin 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), transform 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), visibility 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), opacity 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n\n/* Global transition speed settings */\n.reveal[data-transition-speed=\"fast\"] .slides section {\n  transition-duration: 400ms; }\n\n.reveal[data-transition-speed=\"slow\"] .slides section {\n  transition-duration: 1200ms; }\n\n/* Slide-specific transition speed overrides */\n.reveal .slides section[data-transition-speed=\"fast\"] {\n  transition-duration: 400ms; }\n\n.reveal .slides section[data-transition-speed=\"slow\"] {\n  transition-duration: 1200ms; }\n\n.reveal .slides > section.stack {\n  padding-top: 0;\n  padding-bottom: 0; }\n\n.reveal .slides > section.present,\n.reveal .slides > section > section.present {\n  display: block;\n  z-index: 11;\n  opacity: 1; }\n\n.reveal .slides > section:empty,\n.reveal .slides > section > section:empty,\n.reveal .slides > section[data-background-interactive],\n.reveal .slides > section > section[data-background-interactive] {\n  pointer-events: none; }\n\n.reveal.center,\n.reveal.center .slides,\n.reveal.center .slides section {\n  min-height: 0 !important; }\n\n/* Don't allow interaction with invisible slides */\n.reveal .slides > section.future,\n.reveal .slides > section > section.future,\n.reveal .slides > section.past,\n.reveal .slides > section > section.past {\n  pointer-events: none; }\n\n.reveal.overview .slides > section,\n.reveal.overview .slides > section > section {\n  pointer-events: auto; }\n\n.reveal .slides > section.past,\n.reveal .slides > section.future,\n.reveal .slides > section > section.past,\n.reveal .slides > section > section.future {\n  opacity: 0; }\n\n/*********************************************\n * Mixins for readability of transitions\n *********************************************/\n/*********************************************\n * SLIDE TRANSITION\n * Aliased 'linear' for backwards compatibility\n *********************************************/\n.reveal.slide section {\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal .slides > section[data-transition=slide].past,\n.reveal .slides > section[data-transition~=slide-out].past,\n.reveal.slide .slides > section:not([data-transition]).past {\n  -webkit-transform: translate(-150%, 0);\n          transform: translate(-150%, 0); }\n\n.reveal .slides > section[data-transition=slide].future,\n.reveal .slides > section[data-transition~=slide-in].future,\n.reveal.slide .slides > section:not([data-transition]).future {\n  -webkit-transform: translate(150%, 0);\n          transform: translate(150%, 0); }\n\n.reveal .slides > section > section[data-transition=slide].past,\n.reveal .slides > section > section[data-transition~=slide-out].past,\n.reveal.slide .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate(0, -150%);\n          transform: translate(0, -150%); }\n\n.reveal .slides > section > section[data-transition=slide].future,\n.reveal .slides > section > section[data-transition~=slide-in].future,\n.reveal.slide .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate(0, 150%);\n          transform: translate(0, 150%); }\n\n.reveal.linear section {\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal .slides > section[data-transition=linear].past,\n.reveal .slides > section[data-transition~=linear-out].past,\n.reveal.linear .slides > section:not([data-transition]).past {\n  -webkit-transform: translate(-150%, 0);\n          transform: translate(-150%, 0); }\n\n.reveal .slides > section[data-transition=linear].future,\n.reveal .slides > section[data-transition~=linear-in].future,\n.reveal.linear .slides > section:not([data-transition]).future {\n  -webkit-transform: translate(150%, 0);\n          transform: translate(150%, 0); }\n\n.reveal .slides > section > section[data-transition=linear].past,\n.reveal .slides > section > section[data-transition~=linear-out].past,\n.reveal.linear .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate(0, -150%);\n          transform: translate(0, -150%); }\n\n.reveal .slides > section > section[data-transition=linear].future,\n.reveal .slides > section > section[data-transition~=linear-in].future,\n.reveal.linear .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate(0, 150%);\n          transform: translate(0, 150%); }\n\n/*********************************************\n * CONVEX TRANSITION\n * Aliased 'default' for backwards compatibility\n *********************************************/\n.reveal .slides section[data-transition=default].stack,\n.reveal.default .slides section.stack {\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal .slides > section[data-transition=default].past,\n.reveal .slides > section[data-transition~=default-out].past,\n.reveal.default .slides > section:not([data-transition]).past {\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0); }\n\n.reveal .slides > section[data-transition=default].future,\n.reveal .slides > section[data-transition~=default-in].future,\n.reveal.default .slides > section:not([data-transition]).future {\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0); }\n\n.reveal .slides > section > section[data-transition=default].past,\n.reveal .slides > section > section[data-transition~=default-out].past,\n.reveal.default .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0);\n          transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0); }\n\n.reveal .slides > section > section[data-transition=default].future,\n.reveal .slides > section > section[data-transition~=default-in].future,\n.reveal.default .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0);\n          transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0); }\n\n.reveal .slides section[data-transition=convex].stack,\n.reveal.convex .slides section.stack {\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal .slides > section[data-transition=convex].past,\n.reveal .slides > section[data-transition~=convex-out].past,\n.reveal.convex .slides > section:not([data-transition]).past {\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0); }\n\n.reveal .slides > section[data-transition=convex].future,\n.reveal .slides > section[data-transition~=convex-in].future,\n.reveal.convex .slides > section:not([data-transition]).future {\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0); }\n\n.reveal .slides > section > section[data-transition=convex].past,\n.reveal .slides > section > section[data-transition~=convex-out].past,\n.reveal.convex .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0);\n          transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0); }\n\n.reveal .slides > section > section[data-transition=convex].future,\n.reveal .slides > section > section[data-transition~=convex-in].future,\n.reveal.convex .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0);\n          transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0); }\n\n/*********************************************\n * CONCAVE TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=concave].stack,\n.reveal.concave .slides section.stack {\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal .slides > section[data-transition=concave].past,\n.reveal .slides > section[data-transition~=concave-out].past,\n.reveal.concave .slides > section:not([data-transition]).past {\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0); }\n\n.reveal .slides > section[data-transition=concave].future,\n.reveal .slides > section[data-transition~=concave-in].future,\n.reveal.concave .slides > section:not([data-transition]).future {\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0); }\n\n.reveal .slides > section > section[data-transition=concave].past,\n.reveal .slides > section > section[data-transition~=concave-out].past,\n.reveal.concave .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate3d(0, -80%, 0) rotateX(-70deg) translate3d(0, -80%, 0);\n          transform: translate3d(0, -80%, 0) rotateX(-70deg) translate3d(0, -80%, 0); }\n\n.reveal .slides > section > section[data-transition=concave].future,\n.reveal .slides > section > section[data-transition~=concave-in].future,\n.reveal.concave .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate3d(0, 80%, 0) rotateX(70deg) translate3d(0, 80%, 0);\n          transform: translate3d(0, 80%, 0) rotateX(70deg) translate3d(0, 80%, 0); }\n\n/*********************************************\n * ZOOM TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=zoom],\n.reveal.zoom .slides section:not([data-transition]) {\n  transition-timing-function: ease; }\n\n.reveal .slides > section[data-transition=zoom].past,\n.reveal .slides > section[data-transition~=zoom-out].past,\n.reveal.zoom .slides > section:not([data-transition]).past {\n  visibility: hidden;\n  -webkit-transform: scale(16);\n          transform: scale(16); }\n\n.reveal .slides > section[data-transition=zoom].future,\n.reveal .slides > section[data-transition~=zoom-in].future,\n.reveal.zoom .slides > section:not([data-transition]).future {\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n.reveal .slides > section > section[data-transition=zoom].past,\n.reveal .slides > section > section[data-transition~=zoom-out].past,\n.reveal.zoom .slides > section > section:not([data-transition]).past {\n  -webkit-transform: translate(0, -150%);\n          transform: translate(0, -150%); }\n\n.reveal .slides > section > section[data-transition=zoom].future,\n.reveal .slides > section > section[data-transition~=zoom-in].future,\n.reveal.zoom .slides > section > section:not([data-transition]).future {\n  -webkit-transform: translate(0, 150%);\n          transform: translate(0, 150%); }\n\n/*********************************************\n * CUBE TRANSITION\n *\n * WARNING:\n * this is deprecated and will be removed in a\n * future version.\n *********************************************/\n.reveal.cube .slides {\n  -webkit-perspective: 1300px;\n          perspective: 1300px; }\n\n.reveal.cube .slides section {\n  padding: 30px;\n  min-height: 700px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  box-sizing: border-box;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal.center.cube .slides section {\n  min-height: 0; }\n\n.reveal.cube .slides section:not(.stack):before {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.1);\n  border-radius: 4px;\n  -webkit-transform: translateZ(-20px);\n          transform: translateZ(-20px); }\n\n.reveal.cube .slides section:not(.stack):after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 90%;\n  height: 30px;\n  left: 5%;\n  bottom: 0;\n  background: none;\n  z-index: 1;\n  border-radius: 4px;\n  box-shadow: 0px 95px 25px rgba(0, 0, 0, 0.2);\n  -webkit-transform: translateZ(-90px) rotateX(65deg);\n          transform: translateZ(-90px) rotateX(65deg); }\n\n.reveal.cube .slides > section.stack {\n  padding: 0;\n  background: none; }\n\n.reveal.cube .slides > section.past {\n  -webkit-transform-origin: 100% 0%;\n          transform-origin: 100% 0%;\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg); }\n\n.reveal.cube .slides > section.future {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg);\n          transform: translate3d(100%, 0, 0) rotateY(90deg); }\n\n.reveal.cube .slides > section > section.past {\n  -webkit-transform-origin: 0% 100%;\n          transform-origin: 0% 100%;\n  -webkit-transform: translate3d(0, -100%, 0) rotateX(90deg);\n          transform: translate3d(0, -100%, 0) rotateX(90deg); }\n\n.reveal.cube .slides > section > section.future {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(0, 100%, 0) rotateX(-90deg);\n          transform: translate3d(0, 100%, 0) rotateX(-90deg); }\n\n/*********************************************\n * PAGE TRANSITION\n *\n * WARNING:\n * this is deprecated and will be removed in a\n * future version.\n *********************************************/\n.reveal.page .slides {\n  -webkit-perspective-origin: 0% 50%;\n          perspective-origin: 0% 50%;\n  -webkit-perspective: 3000px;\n          perspective: 3000px; }\n\n.reveal.page .slides section {\n  padding: 30px;\n  min-height: 700px;\n  box-sizing: border-box;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n\n.reveal.page .slides section.past {\n  z-index: 12; }\n\n.reveal.page .slides section:not(.stack):before {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.1);\n  -webkit-transform: translateZ(-20px);\n          transform: translateZ(-20px); }\n\n.reveal.page .slides section:not(.stack):after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 90%;\n  height: 30px;\n  left: 5%;\n  bottom: 0;\n  background: none;\n  z-index: 1;\n  border-radius: 4px;\n  box-shadow: 0px 95px 25px rgba(0, 0, 0, 0.2);\n  -webkit-transform: translateZ(-90px) rotateX(65deg); }\n\n.reveal.page .slides > section.stack {\n  padding: 0;\n  background: none; }\n\n.reveal.page .slides > section.past {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(-40%, 0, 0) rotateY(-80deg);\n          transform: translate3d(-40%, 0, 0) rotateY(-80deg); }\n\n.reveal.page .slides > section.future {\n  -webkit-transform-origin: 100% 0%;\n          transform-origin: 100% 0%;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0); }\n\n.reveal.page .slides > section > section.past {\n  -webkit-transform-origin: 0% 0%;\n          transform-origin: 0% 0%;\n  -webkit-transform: translate3d(0, -40%, 0) rotateX(80deg);\n          transform: translate3d(0, -40%, 0) rotateX(80deg); }\n\n.reveal.page .slides > section > section.future {\n  -webkit-transform-origin: 0% 100%;\n          transform-origin: 0% 100%;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0); }\n\n/*********************************************\n * FADE TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=fade],\n.reveal.fade .slides section:not([data-transition]),\n.reveal.fade .slides > section > section:not([data-transition]) {\n  -webkit-transform: none;\n          transform: none;\n  transition: opacity 0.5s; }\n\n.reveal.fade.overview .slides section,\n.reveal.fade.overview .slides > section > section {\n  transition: none; }\n\n/*********************************************\n * NO TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=none],\n.reveal.none .slides section:not([data-transition]) {\n  -webkit-transform: none;\n          transform: none;\n  transition: none; }\n\n/*********************************************\n * PAUSED MODE\n *********************************************/\n.reveal .pause-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: black;\n  visibility: hidden;\n  opacity: 0;\n  z-index: 100;\n  transition: all 1s ease; }\n\n.reveal.paused .pause-overlay {\n  visibility: visible;\n  opacity: 1; }\n\n/*********************************************\n * FALLBACK\n *********************************************/\n.no-transforms {\n  overflow-y: auto; }\n\n.no-transforms .reveal .slides {\n  position: relative;\n  width: 80%;\n  height: auto !important;\n  top: 0;\n  left: 50%;\n  margin: 0;\n  text-align: center; }\n\n.no-transforms .reveal .controls,\n.no-transforms .reveal .progress {\n  display: none !important; }\n\n.no-transforms .reveal .slides section {\n  display: block !important;\n  opacity: 1 !important;\n  position: relative !important;\n  height: auto;\n  min-height: 0;\n  top: 0;\n  left: -50%;\n  margin: 70px 0;\n  -webkit-transform: none;\n          transform: none; }\n\n.no-transforms .reveal .slides section section {\n  left: 0; }\n\n.reveal .no-transition,\n.reveal .no-transition * {\n  transition: none !important; }\n\n/*********************************************\n * PER-SLIDE BACKGROUNDS\n *********************************************/\n.reveal .backgrounds {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  -webkit-perspective: 600px;\n          perspective: 600px; }\n\n.reveal .slide-background {\n  display: none;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  visibility: hidden;\n  overflow: hidden;\n  background-color: transparent;\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  transition: all 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n\n.reveal .slide-background.stack {\n  display: block; }\n\n.reveal .slide-background.present {\n  opacity: 1;\n  visibility: visible;\n  z-index: 2; }\n\n.print-pdf .reveal .slide-background {\n  opacity: 1 !important;\n  visibility: visible !important; }\n\n/* Video backgrounds */\n.reveal .slide-background video {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  max-height: none;\n  top: 0;\n  left: 0;\n  -o-object-fit: cover;\n     object-fit: cover; }\n\n.reveal .slide-background[data-background-size=\"contain\"] video {\n  -o-object-fit: contain;\n     object-fit: contain; }\n\n/* Immediate transition style */\n.reveal[data-background-transition=none] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=none] {\n  transition: none; }\n\n/* Slide */\n.reveal[data-background-transition=slide] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=slide] {\n  opacity: 1;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=slide] {\n  -webkit-transform: translate(-100%, 0);\n          transform: translate(-100%, 0); }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=slide] {\n  -webkit-transform: translate(100%, 0);\n          transform: translate(100%, 0); }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=slide] {\n  -webkit-transform: translate(0, -100%);\n          transform: translate(0, -100%); }\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=slide] {\n  -webkit-transform: translate(0, 100%);\n          transform: translate(0, 100%); }\n\n/* Convex */\n.reveal[data-background-transition=convex] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0); }\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0); }\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, -100%, 0) rotateX(90deg) translate3d(0, -100%, 0);\n          transform: translate3d(0, -100%, 0) rotateX(90deg) translate3d(0, -100%, 0); }\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=convex] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, 100%, 0) rotateX(-90deg) translate3d(0, 100%, 0);\n          transform: translate3d(0, 100%, 0) rotateX(-90deg) translate3d(0, 100%, 0); }\n\n/* Concave */\n.reveal[data-background-transition=concave] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0); }\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0); }\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, -100%, 0) rotateX(-90deg) translate3d(0, -100%, 0);\n          transform: translate3d(0, -100%, 0) rotateX(-90deg) translate3d(0, -100%, 0); }\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=concave] {\n  opacity: 0;\n  -webkit-transform: translate3d(0, 100%, 0) rotateX(90deg) translate3d(0, 100%, 0);\n          transform: translate3d(0, 100%, 0) rotateX(90deg) translate3d(0, 100%, 0); }\n\n/* Zoom */\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=zoom] {\n  transition-timing-function: ease; }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(16);\n          transform: scale(16); }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(16);\n          transform: scale(16); }\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n/* Global transition speed settings */\n.reveal[data-transition-speed=\"fast\"] > .backgrounds .slide-background {\n  transition-duration: 400ms; }\n\n.reveal[data-transition-speed=\"slow\"] > .backgrounds .slide-background {\n  transition-duration: 1200ms; }\n\n/*********************************************\n * OVERVIEW\n *********************************************/\n.reveal.overview {\n  -webkit-perspective-origin: 50% 50%;\n          perspective-origin: 50% 50%;\n  -webkit-perspective: 700px;\n          perspective: 700px; }\n  .reveal.overview .slides {\n    -moz-transform-style: preserve-3d; }\n  .reveal.overview .slides section {\n    height: 100%;\n    top: 0 !important;\n    opacity: 1 !important;\n    overflow: hidden;\n    visibility: visible !important;\n    cursor: pointer;\n    box-sizing: border-box; }\n  .reveal.overview .slides section:hover,\n  .reveal.overview .slides section.present {\n    outline: 10px solid rgba(150, 150, 150, 0.4);\n    outline-offset: 10px; }\n  .reveal.overview .slides section .fragment {\n    opacity: 1;\n    transition: none; }\n  .reveal.overview .slides section:after,\n  .reveal.overview .slides section:before {\n    display: none !important; }\n  .reveal.overview .slides > section.stack {\n    padding: 0;\n    top: 0 !important;\n    background: none;\n    outline: none;\n    overflow: visible; }\n  .reveal.overview .backgrounds {\n    -webkit-perspective: inherit;\n            perspective: inherit;\n    -moz-transform-style: preserve-3d; }\n  .reveal.overview .backgrounds .slide-background {\n    opacity: 1;\n    visibility: visible;\n    outline: 10px solid rgba(150, 150, 150, 0.1);\n    outline-offset: 10px; }\n  .reveal.overview .backgrounds .slide-background.stack {\n    overflow: visible; }\n\n.reveal.overview .slides section,\n.reveal.overview-deactivating .slides section {\n  transition: none; }\n\n.reveal.overview .backgrounds .slide-background,\n.reveal.overview-deactivating .backgrounds .slide-background {\n  transition: none; }\n\n/*********************************************\n * RTL SUPPORT\n *********************************************/\n.reveal.rtl .slides,\n.reveal.rtl .slides h1,\n.reveal.rtl .slides h2,\n.reveal.rtl .slides h3,\n.reveal.rtl .slides h4,\n.reveal.rtl .slides h5,\n.reveal.rtl .slides h6 {\n  direction: rtl;\n  font-family: sans-serif; }\n\n.reveal.rtl pre,\n.reveal.rtl code {\n  direction: ltr; }\n\n.reveal.rtl ol,\n.reveal.rtl ul {\n  text-align: right; }\n\n.reveal.rtl .progress span {\n  float: right; }\n\n/*********************************************\n * PARALLAX BACKGROUND\n *********************************************/\n.reveal.has-parallax-background .backgrounds {\n  transition: all 0.8s ease; }\n\n/* Global transition speed settings */\n.reveal.has-parallax-background[data-transition-speed=\"fast\"] .backgrounds {\n  transition-duration: 400ms; }\n\n.reveal.has-parallax-background[data-transition-speed=\"slow\"] .backgrounds {\n  transition-duration: 1200ms; }\n\n/*********************************************\n * LINK PREVIEW OVERLAY\n *********************************************/\n.reveal .overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1000;\n  background: rgba(0, 0, 0, 0.9);\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease; }\n\n.reveal .overlay.visible {\n  opacity: 1;\n  visibility: visible; }\n\n.reveal .overlay .spinner {\n  position: absolute;\n  display: block;\n  top: 50%;\n  left: 50%;\n  width: 32px;\n  height: 32px;\n  margin: -16px 0 0 -16px;\n  z-index: 10;\n  background-image: url(data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D);\n  visibility: visible;\n  opacity: 0.6;\n  transition: all 0.3s ease; }\n\n.reveal .overlay header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 40px;\n  z-index: 2;\n  border-bottom: 1px solid #222; }\n\n.reveal .overlay header a {\n  display: inline-block;\n  width: 40px;\n  height: 40px;\n  line-height: 36px;\n  padding: 0 10px;\n  float: right;\n  opacity: 0.6;\n  box-sizing: border-box; }\n\n.reveal .overlay header a:hover {\n  opacity: 1; }\n\n.reveal .overlay header a .icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background-position: 50% 50%;\n  background-size: 100%;\n  background-repeat: no-repeat; }\n\n.reveal .overlay header a.close .icon {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABkklEQVRYR8WX4VHDMAxG6wnoJrABZQPYBCaBTWAD2g1gE5gg6OOsXuxIlr40d81dfrSJ9V4c2VLK7spHuTJ/5wpM07QXuXc5X0opX2tEJcadjHuV80li/FgxTIEK/5QBCICBD6xEhSMGHgQPgBgLiYVAB1dpSqKDawxTohFw4JSEA3clzgIBPCURwE2JucBR7rhPJJv5OpJwDX+SfDjgx1wACQeJG1aChP9K/IMmdZ8DtESV1WyP3Bt4MwM6sj4NMxMYiqUWHQu4KYA/SYkIjOsm3BXYWMKFDwU2khjCQ4ELJUJ4SmClRArOCmSXGuKma0fYD5CbzHxFpCSGAhfAVSSUGDUk2BWZaff2g6GE15BsBQ9nwmpIGDiyHQddwNTMKkbZaf9fajXQca1EX44puJZUsnY0ObGmITE3GVLCbEhQUjGVt146j6oasWN+49Vph2w1pZ5EansNZqKBm1txbU57iRRcZ86RWMDdWtBJUHBHwoQPi1GV+JCbntmvok7iTX4/Up9mgyTc/FJYDTcndgH/AA5A/CHsyEkVAAAAAElFTkSuQmCC); }\n\n.reveal .overlay header a.external .icon {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAcElEQVRYR+2WSQoAIQwEzf8f7XiOMkUQxUPlGkM3hVmiQfQR9GYnH1SsAQlI4DiBqkCMoNb9y2e90IAEJPAcgdznU9+engMaeJ7Azh5Y1U67gAho4DqBqmB1buAf0MB1AlVBek83ZPkmJMGc1wAR+AAqod/B97TRpQAAAABJRU5ErkJggg==); }\n\n.reveal .overlay .viewport {\n  position: absolute;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  top: 40px;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n\n.reveal .overlay.overlay-preview .viewport iframe {\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  border: 0;\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease; }\n\n.reveal .overlay.overlay-preview.loaded .viewport iframe {\n  opacity: 1;\n  visibility: visible; }\n\n.reveal .overlay.overlay-preview.loaded .viewport-inner {\n  position: absolute;\n  z-index: -1;\n  left: 0;\n  top: 45%;\n  width: 100%;\n  text-align: center;\n  letter-spacing: normal; }\n\n.reveal .overlay.overlay-preview .x-frame-error {\n  opacity: 0;\n  transition: opacity 0.3s ease 0.3s; }\n\n.reveal .overlay.overlay-preview.loaded .x-frame-error {\n  opacity: 1; }\n\n.reveal .overlay.overlay-preview.loaded .spinner {\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transform: scale(0.2);\n          transform: scale(0.2); }\n\n.reveal .overlay.overlay-help .viewport {\n  overflow: auto;\n  color: #fff; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner {\n  width: 600px;\n  margin: auto;\n  padding: 20px 20px 80px 20px;\n  text-align: center;\n  letter-spacing: normal; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner .title {\n  font-size: 20px; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table {\n  border: 1px solid #fff;\n  border-collapse: collapse;\n  font-size: 16px; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table th,\n.reveal .overlay.overlay-help .viewport .viewport-inner table td {\n  width: 200px;\n  padding: 14px;\n  border: 1px solid #fff;\n  vertical-align: middle; }\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table th {\n  padding-top: 20px;\n  padding-bottom: 20px; }\n\n/*********************************************\n * PLAYBACK COMPONENT\n *********************************************/\n.reveal .playback {\n  position: absolute;\n  left: 15px;\n  bottom: 20px;\n  z-index: 30;\n  cursor: pointer;\n  transition: all 400ms ease;\n  -webkit-tap-highlight-color: transparent; }\n\n.reveal.overview .playback {\n  opacity: 0;\n  visibility: hidden; }\n\n/*********************************************\n * ROLLING LINKS\n *********************************************/\n.reveal .roll {\n  display: inline-block;\n  line-height: 1.2;\n  overflow: hidden;\n  vertical-align: top;\n  -webkit-perspective: 400px;\n          perspective: 400px;\n  -webkit-perspective-origin: 50% 50%;\n          perspective-origin: 50% 50%; }\n\n.reveal .roll:hover {\n  background: none;\n  text-shadow: none; }\n\n.reveal .roll span {\n  display: block;\n  position: relative;\n  padding: 0 2px;\n  pointer-events: none;\n  transition: all 400ms ease;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.reveal .roll:hover span {\n  background: rgba(0, 0, 0, 0.5);\n  -webkit-transform: translate3d(0px, 0px, -45px) rotateX(90deg);\n          transform: translate3d(0px, 0px, -45px) rotateX(90deg); }\n\n.reveal .roll span:after {\n  content: attr(data-title);\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 0 2px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n  -webkit-transform: translate3d(0px, 110%, 0px) rotateX(-90deg);\n          transform: translate3d(0px, 110%, 0px) rotateX(-90deg); }\n\n/*********************************************\n * SPEAKER NOTES\n *********************************************/\n.reveal aside.notes {\n  display: none; }\n\n.reveal .speaker-notes {\n  display: none;\n  position: absolute;\n  width: 25vw;\n  height: 100%;\n  top: 0;\n  left: 100%;\n  padding: 14px 18px 14px 18px;\n  z-index: 1;\n  font-size: 18px;\n  line-height: 1.4;\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  color: #222;\n  background-color: #f5f5f5;\n  overflow: auto;\n  box-sizing: border-box;\n  text-align: left;\n  font-family: Helvetica, sans-serif;\n  -webkit-overflow-scrolling: touch; }\n  .reveal .speaker-notes .notes-placeholder {\n    color: #ccc;\n    font-style: italic; }\n  .reveal .speaker-notes:focus {\n    outline: none; }\n  .reveal .speaker-notes:before {\n    content: 'Speaker notes';\n    display: block;\n    margin-bottom: 10px;\n    opacity: 0.5; }\n\n.reveal.show-notes {\n  max-width: 75vw;\n  overflow: visible; }\n\n.reveal.show-notes .speaker-notes {\n  display: block; }\n\n@media screen and (min-width: 1600px) {\n  .reveal .speaker-notes {\n    font-size: 20px; } }\n\n@media screen and (max-width: 1024px) {\n  .reveal.show-notes {\n    border-left: 0;\n    max-width: none;\n    max-height: 70%;\n    overflow: visible; }\n  .reveal.show-notes .speaker-notes {\n    top: 100%;\n    left: 0;\n    width: 100%;\n    height: 42.8571428571%; } }\n\n@media screen and (max-width: 600px) {\n  .reveal.show-notes {\n    max-height: 60%; }\n  .reveal.show-notes .speaker-notes {\n    top: 100%;\n    height: 66.6666666667%; }\n  .reveal .speaker-notes {\n    font-size: 14px; } }\n\n/*********************************************\n * ZOOM PLUGIN\n *********************************************/\n.zoomed .reveal *,\n.zoomed .reveal *:before,\n.zoomed .reveal *:after {\n  -webkit-backface-visibility: visible !important;\n          backface-visibility: visible !important; }\n\n.zoomed .reveal .progress,\n.zoomed .reveal .controls {\n  opacity: 0; }\n\n.zoomed .reveal .roll span {\n  background: none; }\n\n.zoomed .reveal .roll span:after {\n  visibility: hidden; }\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(9);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../css-loader/index.js!./solarized.css", function() {
		var newContent = require("!!../../../css-loader/index.js!./solarized.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports
exports.i(__webpack_require__(10), "");
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);", ""]);

// module
exports.push([module.i, "/**\n * Solarized Light theme for reveal.js.\n * Author: Achim Staebler\n */\n/**\n * Solarized colors by Ethan Schoonover\n */\nhtml * {\n  color-profile: sRGB;\n  rendering-intent: auto; }\n\n/*********************************************\n * GLOBAL STYLES\n *********************************************/\nbody {\n  background: #fdf6e3;\n  background-color: #fdf6e3; }\n\n.reveal {\n  font-family: \"Lato\", sans-serif;\n  font-size: 40px;\n  font-weight: normal;\n  color: #657b83; }\n\n::selection {\n  color: #fff;\n  background: #d33682;\n  text-shadow: none; }\n\n::-moz-selection {\n  color: #fff;\n  background: #d33682;\n  text-shadow: none; }\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  line-height: 1.3;\n  font-weight: inherit; }\n\n/*********************************************\n * HEADERS\n *********************************************/\n.reveal h1,\n.reveal h2,\n.reveal h3,\n.reveal h4,\n.reveal h5,\n.reveal h6 {\n  margin: 0 0 20px 0;\n  color: #586e75;\n  font-family: \"League Gothic\", Impact, sans-serif;\n  font-weight: normal;\n  line-height: 1.2;\n  letter-spacing: normal;\n  text-transform: uppercase;\n  text-shadow: none;\n  word-wrap: break-word; }\n\n.reveal h1 {\n  font-size: 3.77em; }\n\n.reveal h2 {\n  font-size: 2.11em; }\n\n.reveal h3 {\n  font-size: 1.55em; }\n\n.reveal h4 {\n  font-size: 1em; }\n\n.reveal h1 {\n  text-shadow: none; }\n\n/*********************************************\n * OTHER\n *********************************************/\n.reveal p {\n  margin: 20px 0;\n  line-height: 1.3; }\n\n/* Ensure certain elements are never larger than the slide itself */\n.reveal img,\n.reveal video,\n.reveal iframe {\n  max-width: 95%;\n  max-height: 95%; }\n\n.reveal strong,\n.reveal b {\n  font-weight: bold; }\n\n.reveal em {\n  font-style: italic; }\n\n.reveal ol,\n.reveal dl,\n.reveal ul {\n  display: inline-block;\n  text-align: left;\n  margin: 0 0 0 1em; }\n\n.reveal ol {\n  list-style-type: decimal; }\n\n.reveal ul {\n  list-style-type: disc; }\n\n.reveal ul ul {\n  list-style-type: square; }\n\n.reveal ul ul ul {\n  list-style-type: circle; }\n\n.reveal ul ul,\n.reveal ul ol,\n.reveal ol ol,\n.reveal ol ul {\n  display: block;\n  margin-left: 40px; }\n\n.reveal dt {\n  font-weight: bold; }\n\n.reveal dd {\n  margin-left: 40px; }\n\n.reveal blockquote {\n  display: block;\n  position: relative;\n  width: 70%;\n  margin: 20px auto;\n  padding: 5px;\n  font-style: italic;\n  background: rgba(255, 255, 255, 0.05);\n  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2); }\n\n.reveal blockquote p:first-child,\n.reveal blockquote p:last-child {\n  display: inline-block; }\n\n.reveal q {\n  font-style: italic; }\n\n.reveal pre {\n  display: block;\n  position: relative;\n  width: 90%;\n  margin: 20px auto;\n  text-align: left;\n  font-size: 0.55em;\n  font-family: monospace;\n  line-height: 1.2em;\n  word-wrap: break-word;\n  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3); }\n\n.reveal code {\n  font-family: monospace;\n  text-transform: none; }\n\n.reveal pre code {\n  display: block;\n  padding: 5px;\n  overflow: auto;\n  max-height: 400px;\n  word-wrap: normal; }\n\n.reveal table {\n  margin: auto;\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n.reveal table th {\n  font-weight: bold; }\n\n.reveal table th,\n.reveal table td {\n  text-align: left;\n  padding: 0.2em 0.5em 0.2em 0.5em;\n  border-bottom: 1px solid; }\n\n.reveal table th[align=\"center\"],\n.reveal table td[align=\"center\"] {\n  text-align: center; }\n\n.reveal table th[align=\"right\"],\n.reveal table td[align=\"right\"] {\n  text-align: right; }\n\n.reveal table tbody tr:last-child th,\n.reveal table tbody tr:last-child td {\n  border-bottom: none; }\n\n.reveal sup {\n  vertical-align: super; }\n\n.reveal sub {\n  vertical-align: sub; }\n\n.reveal small {\n  display: inline-block;\n  font-size: 0.6em;\n  line-height: 1.2em;\n  vertical-align: top; }\n\n.reveal small * {\n  vertical-align: top; }\n\n/*********************************************\n * LINKS\n *********************************************/\n.reveal a {\n  color: #268bd2;\n  text-decoration: none;\n  -webkit-transition: color .15s ease;\n  -moz-transition: color .15s ease;\n  transition: color .15s ease; }\n\n.reveal a:hover {\n  color: #78b9e6;\n  text-shadow: none;\n  border: none; }\n\n.reveal .roll span:after {\n  color: #fff;\n  background: #1a6091; }\n\n/*********************************************\n * IMAGES\n *********************************************/\n.reveal section img {\n  margin: 15px 0px;\n  background: rgba(255, 255, 255, 0.12);\n  border: 4px solid #657b83;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }\n\n.reveal section img.plain {\n  border: 0;\n  box-shadow: none; }\n\n.reveal a img {\n  -webkit-transition: all .15s linear;\n  -moz-transition: all .15s linear;\n  transition: all .15s linear; }\n\n.reveal a:hover img {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: #268bd2;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55); }\n\n/*********************************************\n * NAVIGATION CONTROLS\n *********************************************/\n.reveal .controls {\n  color: #268bd2; }\n\n/*********************************************\n * PROGRESS BAR\n *********************************************/\n.reveal .progress {\n  background: rgba(0, 0, 0, 0.2);\n  color: #268bd2; }\n\n.reveal .progress span {\n  -webkit-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  -moz-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(11);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n    font-family: 'League Gothic';\n    src: url(" + escape(__webpack_require__(2)) + ");\n    src: url(" + escape(__webpack_require__(2)) + "?#iefix) format('embedded-opentype'),\n         url(" + escape(__webpack_require__(12)) + ") format('woff'),\n         url(" + escape(__webpack_require__(13)) + ") format('truetype');\n\n    font-weight: normal;\n    font-style: normal;\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:font/woff;base64,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"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:font/ttf;base64,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4fofAslYWP03BeH88jExAw788jExAw65R0e4AAACABQAAAN1BdEAFQAcAJ8AAbAdL7AA1rEVEemwFjKwFRCxEAErtA8RABAEK7APELEKASuxCRHpsR4BK7A2GrrAoPcWABUrCgSwAC4OsAHABLEVGfkOsBPAsxQVExMrshQVEyCKIIojBg4REjkAtAABExQVLi4uLi4BsgETFC4uLrBAGgGxEBURErECHDk5sA8RswUEFxgkFzmwChKyBxkbOTk5sAkRsQgaOTkAMDEbATMTNzMXEzMTIwMHIycDIwMHIycDJzM3FzMnIxSmrFALCApQrKa9QQgNClZ7VgoMCUEEvD4/vY7bBGD7oAIXPz/96QRg/bdAQAJJ/bdAQAJJuUdHuAAAAAACAA4AAAKuB1IACwASADoAAbATL7AA1rELEumwCxCxBgErsQUS6bEUASuxCwARErAMObAGEbYBAwQNDxESJBc5sAUSsBA5ADAxGwERMxETIwMHIycDJzM3FzMnIw7i3eHZbwYEBm+BvT1AvI3bBeH8oP1/AoEDYP4fDg4B4blHR7gAAAACABn+bwJiBdEAGQAgAEsAsA0vsQgG6QGwIS+wANaxGQ3psBkQsRQBK7ETDemxIgErsRkAERK0AQoLGiAkFzmwFBGxGx05ObATErEeHzk5ALEIDRESsAs5MDEbARQHBgcOASciJxUWOwEyNzY3EyMDByMnAyczNxczJyMZvggSMhVFBAoCMhEZclNKEMbKUgQJBFKdvD1AvI3bBGD7fyIbQSYQBgQCuARkWYAEtP1QOTkCsLlHR7gAAwAQAAACsAcvAAsADwATAD4AAbAUL7AA1rELEumwCxCxBgErsQUS6bEVASuxCwARErEMDzk5sAYRtgEDBA0OEBMkFzmwBRKxERI5OQAwMRsBETMREyMDByMnAyczNSMFMzUjEOLd4dlvBgQGb3i+vgEgv78F4fyg/X8CgQNg/h8ODgHhhcnJyQAAAAACABQAAAJeB1IACQANACYAAbAOL7EAASu0ARQABwQrsAQysQ8BK7EBABESsgMKDDk5OQAwMTMhNSEBNSEVIQETMzcjFAJK/qABYP3oASn+pYifotfbBCvb2/voBay4AAACAAwAAAIEBdEACQANACYAAbAOL7EAASu0ARQACQQrsAQysQ8BK7EBABESsgMKDDk5OQAwMTMh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ArwADgJyABQCGgBSAxgACAIaADkETQA1BLoASgQAASUClQAxAq4AUgKFAEICrgBKApMAQgHbABQCvAAMArIAUgFyAFIBbP/TAoEAUgFyAFID/QBSArIAUgKRAD8CrgBSAq4ASgH3AFICdgAlAfUAFAKyAE4CWgAQA4kAFAJqABACegAZAhQADAKwAD0BZABSArAAOQUAAHECcAA1AnAANQE7AAABgwBKAnwAQgMxAAQC0AAZBAABEAZsADUBvABKBmwANQQAATkEAAGaANcAAAQAAaoChQApAv0AFAL9ABQC/QAUAv0AFAL9ABQC/QAUBEsAEALEAEQCdABSAnQAUgJ0AFICdABSAZH/+gGRAFIBcv++AXT/ywL5ABQDKABSAtQARALUAEQC1ABEAtQARALUAEQC1AA7Au0AUALtAFAC7QBQAu0AUALAABAC1ABSAt0AQgKpADECqQAxAqkAMQKpADECqQAxAqkAMQPdADEChQBCApMAQgKTAEICkwBCApMAQgFy/98BcgBSAXL/vgF0/8sCoQBMArIAUgKRAD8CkQA/ApEAPwKRAD8CkQA/ApEAPwKyAE4CsgBOArIATgKyAE4CegAZAq4AUgJ6ABkC/QAUAqkAMQL9ABQCqQAxAv0AFAKpADECxABEAoUAQgLEAEQChQBCAsQARAKFAEICxABEAoUAQgL5AFID4wBKAvn/2QKuAEoCdABSApMAQgJ0AFICkwBCAnQAUgKTAEICdABSApMAQgJ0AEICkwBCAuEAQQK8AAwC4QBBArwADALhAEECvAAMAuEAQQK8AAwDCgBSArIAUgMKAAICsgAEAYH//AFy//YBgf/8AXL/9gGB/+EBcv/bAYH/5wFyABcBgQBSAXIAUgMoAFIC3wBSAaf/2wFs/74DAABSAoEAUgKBAFICXABSAXIAGwJcAFIBcgBSAlwAUgKnAFICXABSAkkAUgJ0ACkB1AAfAygAUgKyAFIDKABSArIAUgMoAFICsgBSArIABAMoAFICsgBSAtQARAKRAD8C1ABEApEAPwLUADUCkQASA9cARAPjAD8C4wBSAfcAUgLjAFIB9wBSAuMAUgH3AAQCvgAlAnYAJQK+ACUCdgAlAr4AJQJ2ACUCvgAlAnYAJQKHAAQDKwAUAocABAH1ABQC7QBQArIATgLtAFACsgBOAu0AUAKyAE4C7QBQArIATgLtAEICsgAjAu0AUAKyAE4EDAAZA4kAFAK8AA4CegAZAsAAEAJyABQCFAAMAnIAFAIUAAwCcgAUAhQADAHbACUChwAEAfUAFAP9AQQD/QEEBAABHwP9AZgD/QFmBAABXAQAATkEAADXA88AAAeeAAADzwAAB54AAAKKAAAB5wAAAUUAAAFFAAAA8wAAAYYAAABsAAABvABKAbwASgG8AEoDJgBKA8wASgE1ADEBNQAtATUALQJwADUCcAA1AnAANQJwADUClwBSA8QANQGGAAAB5wAAAy0ANQOpAEoDCABKBFwAAAMEABQAFAAAAAAAAAAAAAAAAAAgAFYBWgHgAqIDQANgA44DvAPaA/IEEgQuBEgEgATkBQoFWAXyBiIGjAcKBygHvAg6CFgIfAiSCKYIvAkaCb4J8gpaCsgLEAs4C1gL0gvoC/4MJAxSDGwMyAziDUYNgA36DkwOxg7kDyYPUg+iEDwQbBCUELYQ8BEUESgRPhFWEeASPhKaEvoTZhOkFHoUsBTOFQwVYBV2FcYV/BZeFr4XHBdOF8YYChhCGHAY4hlcGaYZzho6GlIavBsIGzQbXhteG3wbzByOHPIdEh3cHeoerB7KHuIe/B8eH3ofuh/4ID4gtCD+IXYhziJOIn4iriLiIxojLiNAI1gjcCPGJDYkpiUWJY4mLiaoJ2wnvigOKGQovij4KTIpmiowKsYrYiwkLMItgC5ILrgvMi+sMCwwrjDCMNQw7DEEMYgx+jJkMtAzQDPaNEw1LDVsNao17DYwNog25jdGN4g4Hjh+OTI5pDpmOuI7TDvOPEA8vD0mPag+Gj5yPt4/Tj/QQABAekDIQWJBkkIMQoBDOENaQ9pEYkVCReRG2kdcSDZIvkmgScBKHkp8SuhLQEuYS7xL4EwYTFBMrE0ITSZNPE1sTbZN6E46TnJO0E8kT0pPXk+IT65P2E/uUBRQJlBCUGpQilDGUOpRKlFQUZJR1FJCUqhTGlOGVBhUolUcVY5V8FacVvhXNleSV9RYNlh6WP5ZgloMWphbIluqXDZcxFzyXUBdiF3sXnxe8F9CX4Jf+GBaYNphWGGyYfhihGMSY3Jj9mQ4ZJRk2mUKZTplamWaZc5l8GYcZkpmnma+ZuBnEmcuZ3Rnrmf8aBxoHGgcaBxoHGgcaBxoHGgcaBxoHGgcaCpoOGhGaGJoemicaMJo4mkOaThpYmmOabhp4GngaeBqamq6atZq/mtEa4gAAQAAAVkAbQAFAAAAAAACAAEAAgAWAAABAAGXAAAAAAAAAA8AugADAAEECQAAAFAAAAADAAEECQABABoAUAADAAEECQACAA4AagADAAEECQADAD4AeAADAAEECQAEACoAtgADAAEECQAFAHgA4AADAAEECQAGACgBWAADAAEECQAJADYBgAADAAEECQAMAEQBtgADAAEECQASACoB+gADAAEECQDIABYCJAADAAEECQDJADACOgADAAEECQDKAAACagADAAEECQDLAAoCagADAAEECdkDABoCdAAyADAAMAA5ACAALQAgADIAMAAxADEALAAgAFQAaABlACAATABlAGEAZwB1AGUAIABvAGYAIABNAG8AdgBlAGEAYgBsAGUAIABUAHkAcABlAEwAZQBhAGcAdQBlACAARwBvAHQAaABpAGMAUgBlAGcAdQBsAGEAcgAxAC4ANQA2ADAAOwBVAEsAVwBOADsATABlAGEAZwB1AGUARwBvAHQAaABpAGMALQBSAGUAZwB1AGwAYQByAEwAZQBhAGcAdQBlACAARwBvAHQAaABpAGMAIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAxAC4ANQA2ADAAOwBQAFMAIAAwADAAMQAuADUANgAwADsAaABvAHQAYwBvAG4AdgAgADEALgAwAC4ANQA2ADsAbQBhAGsAZQBvAHQAZgAuAGwAaQBiADIALgAwAC4AMgAxADMAMgA1AEwAZQBhAGcAdQBlAEcAbwB0AGgAaQBjAC0AUgBlAGcAdQBsAGEAcgBUAGgAZQAgAEwAZQBhAGcAdQBlACAAbwBmACAATQBvAHYAZQBhAGIAbABlACAAVAB5AHAAZQBoAHQAdABwADoALwAvAHQAaABlAGwAZQBhAGcAdQBlAG8AZgBtAG8AdgBlAGEAYgBsAGUAdAB5AHAAZQAuAGMAbwBtAEwAZQBhAGcAdQBlACAARwBvAHQAaABpAGMAIABSAGUAZwB1AGwAYQByAFcAZQBiAGYAbwBuAHQAIAAxAC4AMABUAHUAZQAgAEoAYQBuACAAIAA2ACAAMAA2ADoAMQA5ADoANQA5ACAAMgAwADEANQBvAHIAaQBvAG4ARgBvAG4AdAAgAFMAcQB1AGkAcgByAGUAbAACAAAAAAAA/2cAZgAAAAAAAAAAAAAAAAAAAAAAAAAAAVkAAAABAAIAAwAEAAUABgAHAAgACQAKAAsADAANAA4ADwAQABEAEgATABQAFQAWABcAGAAZABoAGwAcAB0AHgAfACAAIQAiACMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AD4APwBAAEEAQgBDAEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQBeAF8AYABhAQIBAwEEAKMAhACFAJYAjgCLAQUAigDaAI0AwwDeAKIArQDJAMcArgBiAGMAkABkAMsAZQDIAMoAzwDMAM0AzgDpAGYA0wDQANEArwBnAJEA1gDUANUAaADrAO0AiQBqAGkAawBtAGwAbgCgAG8AcQBwAHIAcwB1AHQAdgB3AOoAeAB6AHkAewB9AHwAoQB/AH4AgACBAOwA7gC6AQYBBwEIAQkBCgELAP0A/gEMAQ0BDgEPAP8BAAEQAREBEgEBARMBFAEVARYBFwEYARkBGgEbARwBHQEeAPgA+QEfASABIQEiASMBJAElASYBJwEoASkBKgErASwBLQEuAPoA1wEvATABMQEyATMBNAE1ATYBNwE4ATkBOgE7ATwBPQDiAOMBPgE/AUABQQFCAUMBRAFFAUYBRwFIAUkBSgFLAUwAsACxAU0BTgFPAVABUQFSAVMBVAFVAVYA+wD8AOQA5QFXAVgBWQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoAuwFrAWwBbQFuAOYA5wFvAXABcQDYAOEA2wDcAN0A4ADZAN8BcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/ALIAswC2ALcAxAC0ALUAxQGAAIcAqwGBAYIBgwCMAO8BhADAAMEHdW5pMDA5Mwd1bmkwMDk0B3VuaTAwQTAHdW5pMDBBRAdBbWFjcm9uB2FtYWNyb24GQWJyZXZlBmFicmV2ZQdBb2dvbmVrB2FvZ29uZWsLQ2NpcmN1bWZsZXgLY2NpcmN1bWZsZXgKQ2RvdGFjY2VudApjZG90YWNjZW50BkRjYXJvbgZkY2Fyb24GRGNyb2F0B0VtYWNyb24HZW1hY3JvbgZFYnJldmUGZWJyZXZlCkVkb3RhY2NlbnQKZWRvdGFjY2VudAdFb2dvbmVrB2VvZ29uZWsGRWNhcm9uBmVjYXJvbgtHY2lyY3VtZmxleAtnY2lyY3VtZmxleApHZG90YWNjZW50Cmdkb3RhY2NlbnQMR2NvbW1hYWNjZW50DGdjb21tYWFjY2VudAtIY2lyY3VtZmxleAtoY2lyY3VtZmxleARIYmFyBGhiYXIGSXRpbGRlBml0aWxkZQdJbWFjcm9uB2ltYWNyb24GSWJyZXZlBmlicmV2ZQdJb2dvbmVrB2lvZ29uZWsCSUoCaWoLSmNpcmN1bWZsZXgLamNpcmN1bWZsZXgMS2NvbW1hYWNjZW50DGtjb21tYWFjY2VudAxrZ3JlZW5sYW5kaWMGTGFjdXRlBmxhY3V0ZQxMY29tbWFhY2NlbnQMbGNvbW1hYWNjZW50BkxjYXJvbgZsY2Fyb24ETGRvdARsZG90Bk5hY3V0ZQZuYWN1dGUMTmNvbW1hYWNjZW50DG5jb21tYWFjY2VudAZOY2Fyb24GbmNhcm9uC25hcG9zdHJvcGhlA0VuZwNlbmcHT21hY3JvbgdvbWFjcm9uBk9icmV2ZQZvYnJldmUNT2h1bmdhcnVtbGF1dA1vaHVuZ2FydW1sYXV0BlJhY3V0ZQZyYWN1dGUMUmNvbW1hYWNjZW50DHJjb21tYWFjY2VudAZSY2Fyb24GcmNhcm9uBlNhY3V0ZQZzYWN1dGULU2NpcmN1bWZsZXgLc2NpcmN1bWZsZXgGVGNhcm9uBnRjYXJvbgRUYmFyBHRiYXIGVXRpbGRlBnV0aWxkZQdVbWFjcm9uB3VtYWNyb24GVWJyZXZlBnVicmV2ZQVVcmluZwV1cmluZw1VaHVuZ2FydW1sYXV0DXVodW5nYXJ1bWxhdXQHVW9nb25lawd1b2dvbmVrC1djaXJjdW1mbGV4C3djaXJjdW1mbGV4C1ljaXJjdW1mbGV4C3ljaXJjdW1mbGV4BlphY3V0ZQZ6YWN1dGUKWmRvdGFjY2VudAp6ZG90YWNjZW50BWxvbmdzB3VuaTAyMUEHdW5pMDIxQgd1bmkyMDAwB3VuaTIwMDEHdW5pMjAwMgd1bmkyMDAzB3VuaTIwMDQHdW5pMjAwNQd1bmkyMDA2B3VuaTIwMDcHdW5pMjAwOAd1bmkyMDA5B3VuaTIwMEEHdW5pMjAxMAd1bmkyMDExCmZpZ3VyZWRhc2gHdW5pMjAxRgd1bmkyMDJGB3VuaTIwNUYERXVybwd1bmkyNUZDuAH/hbABjQBLsAhQWLEBAY5ZsUYGK1ghsBBZS7AUUlghsIBZHbAGK1xYALADIEWwAytEsAQgRbIDLgIrsAMrRLAFIEWyBDICK7ADK0SwBiBFsgXzAiuwAytEsAcgRbIGdgIrsAMrRLAIIEWyBz4CK7ADK0SwCSBFsggyAiuwAytEsAogRbIJtQIrsAMrRLALIEWyCnoCK7ADK0SwDCBFsgsuAiuwAytEAbANIEWwAytEsA4gRbINfQIrsQNGditEsA8gRbIOoQIrsQNGditEsBAgRbIPvAIrsQNGditEsBEgRbIQYAIrsQNGditEsBIgRbIRVQIrsQNGditEsBMgRbISQQIrsQNGditEsBQgRbITLQIrsQNGditEWbAUKwAAAAFUq8TfAAA="

/***/ })
/******/ ]);