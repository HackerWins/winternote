import { CHECK_PATTERN, CHECK_LOAD_PATTERN, LOAD_SAPARATOR} from './Event'
import Dom from './Dom'
import { isFunction, spread, pushArray} from '../util/func';
import EventParser from './EventParser';

export default class EventMachin {
  refs: any;
  children: any;
  childComponents: any;
  $el: any
  collapsedProps: Array<string>;
  $root: any;
  el: any;
  _bindings: any;

  constructor() { 
    this.refs = {} 
    this.children = {} 
    this.childComponents = this.components()
  }

  render ($container) {
    this.$el = this.parseTemplate(this.template())
    this.refs.$el = this.$el;   

    if ($container) $container.html(this.$el)

    this.load()    

    this.afterRender();
  }

  afterRender () {}
 
  /**
   * Define Child Component 
   */
  components () {
    return {} 
  }

  parseTemplate (html: string, isLoad?: boolean) {

    if (Array.isArray(html)) {
      html = html.join('')
    }

    const list = new Dom("div").html(html).children()
    
    var fragment = document.createDocumentFragment()

    list.forEach($el => {
      // ref element 정리 
      if ($el.attr('ref')) {
        this.refs[$el.attr('ref')] = $el; 
      }
      var refs = $el.$$('[ref]');

      [...refs].forEach($dom => {
        const name = $dom.attr('ref')
        this.refs[name] = $dom;
      })

      fragment.appendChild($el.el);

    })

    if (!isLoad) {
      return list[0];
    }

    return fragment
  }

  parseComponent () {
    const $el = this.$el; 
    Object.keys(this.childComponents).forEach(ComponentName => {

      const Component = this.childComponents[ComponentName]
      const targets = $el.$$(`${ComponentName.toLowerCase()}`);

      targets.forEach($dom => {
        let props = {};
        
        $dom.attrs().filter(t => {
          return ['ref'].indexOf(t.nodeName) < 0 
        }).forEach(t => {
          props[t.nodeName] = t.nodeValue 
        })
  
        const refName = $dom.attr('ref') || ComponentName
  
        if (refName) {
        
          if (Component) { 

            var instance = new Component(this, props);
            this.children[refName] = instance
            this.refs[refName] = instance.$el

            if (instance) {
              instance.render()
  
              $dom.replace(instance.$el)
            }
          }
  
        }
  
  
      })
    })
  }

  load () {
    this.filterProps(CHECK_LOAD_PATTERN).forEach(callbackName => {
      const elName = callbackName.split(LOAD_SAPARATOR)[1]
      if (this.refs[elName]) { 
        var fragment = this.parseTemplate(this[callbackName].call(this), true);
        this.refs[elName].html(fragment)
      }
    })

    this.parseComponent()
  }

  template () {
    return '<div></div>';
  }

  initialize() {

  }

  eachChildren (callback) {
    if (!isFunction(callback)) return; 

    Object.keys(this.children).forEach(ChildComponentName => {
      callback(this.children[ChildComponentName])
    })
  }

  initializeEvent () { 
    this.initializeEventMachin();

    this.eachChildren(Component => {
      Component.initializeEvent()
    })
  }

  destroy() {
    this.destroyEventMachin();
    // this.refs = {} 

    this.eachChildren(Component => {
      Component.destroy()
    })
  }

  destroyEventMachin () {
    this.removeEventAll();
  }

  initializeEventMachin () {
    this.filterProps(CHECK_PATTERN).forEach(this.parseEvent.bind(this));
  }

  collectProps (): Array<string> {

    if (!this.collapsedProps) {
      var p = Object.getPrototypeOf(this) 
      var results = [] 
      do {
        results = pushArray<string>(results, Object.getOwnPropertyNames(p))
        p  = Object.getPrototypeOf(p);
      } while( p );

      this.collapsedProps = results
    }

    return this.collapsedProps; 
  }

  filterProps (pattern) {
    return this.collectProps().filter(key => {
      return key.match(pattern);
    });
  }

  parseEvent (key: string) {
    EventParser.parse(key, this);
  }


  /* magic check method  */ 
  self (e: any) {
    return e.$delegateTarget.el == e.target; 
  }

  getBindings () {

    if (!this._bindings) {
      this.initBindings();
    }

    return this._bindings;
  }

  addBinding (obj) {
    this.getBindings().push(obj);
  }

  initBindings() {
    this._bindings = [];
  }


  removeEventAll () {
    EventParser.removeEventAll(this);
  }

}
