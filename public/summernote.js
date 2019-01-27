var summernote = (function (exports) {
  'use strict';

  var OBSERVE_OPTIONS = {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true
  };
  var DOMObserver = /** @class */ (function () {
      function DOMObserver(editable) {
          var _this = this;
          this.editable = editable;
          this.observer = new MutationObserver(function (mutations) {
              return _this.handleMutations(mutations);
          });
      }
      DOMObserver.prototype.start = function () {
          this.observer.observe(this.editable, OBSERVE_OPTIONS);
      };
      DOMObserver.prototype.stop = function () {
          var records = this.observer.takeRecords();
          this.handleMutations(records);
          this.observer.disconnect();
      };
      DOMObserver.prototype.handleMutations = function (mutations) {
          // tslint:disable-next-line
          console.log(mutations);
      };
      return DOMObserver;
  }());

  /**
   * EditorView displays editor state in the DOM and handles user events.
   */
  var EditorView = /** @class */ (function () {
      function EditorView(editable) {
          this.editable = editable;
          this.domObserver = new DOMObserver(editable);
          this.domObserver.start();
      }
      return EditorView;
  }());
  //# sourceMappingURL=editor-view.js.map

  var Editor = /** @class */ (function () {
      function Editor(place) {
          this.place = place;
          var contentEditable = document.createElement('div');
          contentEditable.setAttribute('contentEditable', 'true');
          this.place.parentNode.appendChild(contentEditable);
          this.view = new EditorView(contentEditable);
      }
      return Editor;
  }());
  //# sourceMappingURL=editor.js.map

  function create(place) {
      var editor = new Editor(place);
      return editor;
  }
  //# sourceMappingURL=main.js.map

  exports.create = create;

  return exports;

}({}));
