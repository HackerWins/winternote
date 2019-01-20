import { ACTION_PREFIX, BaseStore, GETTER_PREFIX } from "./BaseStore";

export class BaseModule {
  constructor(private $store: BaseStore) {
    this.initialize();
  }
  afterDispatch(): void {

  }
  initialize(): void {
    this.filterProps(ACTION_PREFIX).forEach(key => {
      this.$store.action(key, this);
    });
    this.filterProps(GETTER_PREFIX).forEach(key => {
      this.$store.getter(key, this);
    });
  }
  getProto(): object {
    return Object.getPrototypeOf(this);
  }
  filterProps(pattern = '/'): string[] {
    return Object.getOwnPropertyNames(this.getProto()).filter(key => {
      return key.indexOf(pattern) === 0;
    });
  }
}
