var summernote = (function (exports) {
  'use strict';

  var Editor = /** @class */ (function () {
      function Editor() {
      }
      Editor.prototype.getName = function () {
          return 'summernote';
      };
      return Editor;
  }());

  function main() {
      var editor = new Editor();
      console.log(editor.getName());
  }

  exports.main = main;

  return exports;

}({}));
