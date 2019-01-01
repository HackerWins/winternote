import { ACTION_PREFIX, GETTER_PREFIX } from "../util/Store";
import BaseStore from "./BaseStore";

export default class BaseModule {
  $store: BaseStore;

  constructor ($store: BaseStore) {
      this.$store = $store;
      this.initialize();
  }

  afterDispatch() {
      
  }

  initialize() {
      this.filterProps(ACTION_PREFIX).forEach(key => {
          this.$store.action(key, this);
      });

      this.filterProps(GETTER_PREFIX).forEach(key => {
          this.$store.getter(key, this);
      });        
  }

  getProto () : any {
    return Object.getPrototypeOf(this)
  }

  filterProps (pattern = '/') {
      return Object.getOwnPropertyNames(this.getProto()).filter(key => {
          return key.startsWith(pattern);
      });
  }

}
