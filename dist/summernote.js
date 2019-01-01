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
      // tslint:disable-next-line
      console.log(editor.getName());
  }

  exports.main = main;

  return exports;

}({}));
