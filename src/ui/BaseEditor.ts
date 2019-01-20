import { modules } from '../module';
import { BaseStore } from '../util/BaseStore';
import { Component } from "../util/Component";
import { DOMElement } from "../util/DOMElement";



export class BaseEditor extends Component {
  $store: BaseStore;
  $body: DOMElement;
  $root: DOMElement;
  opt: Component;

  initialize (externalModules = []): void { 
    this.$store = new BaseStore({
        modules: {
            ...modules,
            ...externalModules
        }
    });

    this.$body = new DOMElement(this.getContainer());
    this.$root = new DOMElement('div', 'summernote');

    this.$body.append(this.$root);        

    if (this.opt.type) {
        this.$root.addClass(this.opt.type);
    }

    this.render(this.$root);

    this.initializeEvent();           
  }

  getContainer (): Element {
    return this.opt.container || document.body;
  }   
}
