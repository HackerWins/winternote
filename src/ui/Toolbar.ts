import UIElement from "./UIElement";
import { CLICK } from "../util/Event";

export default class Toolbar extends UIElement {

  template () {
    return `
      <div class='summernote-toolbar'>
        <button type='button' ref="$clickButton" >Click</button>
      </div>
    `
  }

  [CLICK('$clickButton')] () {
    this.dispatch('editor.save', { savedata: true })

    console.log(this.read('editor.savedata'))
  }
}
