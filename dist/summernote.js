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

  function main() {
      var editor = new Editor();
      // tslint:disable-next-line
      console.log(editor.getName());
  }

  exports.create = create;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
