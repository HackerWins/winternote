import { ACTION, GETTER } from "../util/Store";
import BaseStore from "../ui/BaseStore";
import BaseModule from "../ui/BaseModule";

export default class EditorManager extends BaseModule {

  [GETTER('editor.name')] ($store: BaseStore) {
    return $store.get('editor.name', 'summernote');
  }

  [GETTER('editor.savedata')] ($store: BaseStore) {
    return $store.get('editor.savedata');
  }

  [ACTION('editor.name')] ($store: BaseStore, name: string) {
    $store.set('editor.name', name);
  }

  [ACTION('editor.save')] ($store: BaseStore, value: any) {
    $store.set('editor.savedata', value || false)
    $store.emit('summernote.change');
  }


}
