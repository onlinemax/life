(() => {
  // src/ts/view/components.ts
  var Component = class {
    element;
    retriver;
    listeners = [];
    constructor(element, retriver) {
      this.element = element;
      this.retriver = retriver;
    }
    addListener(listener) {
      this.listeners.push(listener);
    }
    retrieveInfo() {
      this.retriver.retrieveInfo(this.element);
    }
    sendAction(action) {
      this.listeners.forEach((listener) => listener.receiveAction(action));
    }
  };
  var Button = class extends Component {
    constructor(element, retriever) {
      super(element, retriever);
      this.init();
    }
    init() {
      this.element.on("mouseup", this.handleEvent);
    }
    handleEvent(evt) {
      this.sendAction({
        from: evt.target,
        name: evt.type,
        informations: this.retriver.retrieveInfo($(evt.delegateTarget)),
        isCTRL: evt.ctrlKey,
        isALT: evt.altKey
      });
    }
  };
  var defaultButtonRetriever = {
    retrieveInfo: function(element) {
      return {
        info: {
          "id": element.attr("id"),
          "class": element.attr("class")
        }
      };
    }
  };
  var Counter = class {
    element;
    buttons;
    listeners = [];
    buttonListener = {
      receiveAction(action) {
        this.listeners.forEach((listener) => listener.receiveAction(action));
      }
    };
    counterRetriever = {
      retrieveInfo: function(element) {
        return {
          info: {
            "field": element.parent(".counter").attr("id"),
            "increment": element.attr("class") == "up"
          }
        };
      }
    };
    addListener(listener) {
      this.listeners.push(listener);
    }
    constructor(link) {
      this.element = $(link);
      this.buttons = [new Button(this.element.children(".up"), this.counterRetriever), new Button(this.element.children(".down"), this.counterRetriever)];
      for (let i = 0; i < 2; i++) {
        this.buttons[i].addListener(this.buttonListener);
      }
    }
  };
})();
