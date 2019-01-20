import {Component} from "../util/Component";
import { CLICK } from "../util/EventUtil";

export class Toolbar extends Component {

  template (): string {
    return `
      <div class='summernote-toolbar'>
        <button type='button' ref="$clickButton" >Click</button>
      </div>
    `;
  }

  [CLICK('$clickButton')] (): void {
    this.dispatch('editor.save', { savedata: true });

    this.emit('SAVE');
  }
}
