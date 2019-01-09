import { BaseModule } from "../util/BaseModule";
import {ACTION, BaseStore, DefaultVariableType, GETTER} from "../util/BaseStore";

export class EditorManager extends BaseModule {

  [GETTER('editor.name')] ($store: BaseStore): DefaultVariableType {
    return $store.get('editor.name', 'summernote');
  }

  [GETTER('editor.savedata')] ($store: BaseStore): DefaultVariableType {
    return $store.get('editor.savedata');
  }

  [ACTION('editor.name')] ($store: BaseStore, name: string): void {
    $store.set('editor.name', name);
  }

  [ACTION('editor.save')] ($store: BaseStore): void {
    $store.set('editor.savedata', true);
    $store.emit('summernote.change');
  }
}
