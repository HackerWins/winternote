(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.summernote = {}));
}(this, function (exports) { 'use strict';

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
