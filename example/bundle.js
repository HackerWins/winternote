(function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var summernote = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory(exports);
	}(commonjsGlobal, function (exports) {
	  var Editor = /** @class */ (function () {
	      function Editor(place) {
	          this.place = place;
	      }
	      Editor.prototype.getName = function () {
	          return 'summernote';
	      };
	      return Editor;
	  }());

	  function create(place) {
	      var editor = new Editor(place);
	      return editor;
	  }

	  exports.create = create;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));
	});

	var summernote$1 = unwrapExports(summernote);

	const editor = summernote$1.create(
	  document.querySelector('#editor')
	);

}());
