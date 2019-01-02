import BaseEditor from "./ui/BaseEditor";
import Toolbar from "./ui/Toolbar";
import { EVENT } from "./ui/UIElement";

export class Editor extends BaseEditor {

  constructor(opt: object, props?: object) {
    super(opt, props);
  }

  initialize () {
    super.initialize();

    this.$root.cssText(`
      width: 400px;
      height: 400px;
      background-color: yellow;
    `);

    this.$el.cssText(`
      position: relative;
      width: 100%;
      height: 100%;
    `);
  }

  template (): string {
    return `
      <div class='summernote-layout'>
        <Toolbar></Toolbar>
        <div class='summernote-editable'></div>
        <div class='summernote-codable'></div>
      </div>
    `;
  }

  components(): object {
    return { Toolbar };
  }

  [EVENT('SAVE')] () {
    console.log('fire save event');
  }
}
