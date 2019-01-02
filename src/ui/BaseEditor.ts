import Dom from "../util/Dom";
import UIElement from "./UIElement";
import BaseStore from "./BaseStore";

import ModuleList from '../module';


export default class BaseEditor extends UIElement {
  $store: BaseStore;
  $body: Dom;
  $root: Dom;
  opt: any;

    initialize (modules:any[] = []) { 
        this.$store = new BaseStore({
            modules: [
                ...ModuleList,
                ...modules
            ]
        });

        this.$body = new Dom(this.getContainer());
        this.$root = new Dom('div', 'summernote');

        this.$body.append(this.$root);        

        if (this.opt.type) {    // to change css style
            this.$root.addClass(this.opt.type);
        }

        this.render(this.$root)

        // 이벤트 연결 
        this.initializeEvent();           
    }

    getContainer () {
        return this.opt.container || document.body;
    }   
}
