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
    sendAction(action) {
      this.listeners.forEach((listener) => listener.receiveAction(action));
    }
  };
  var Button = class extends Component {
    constructor(element, retriever) {
      super(element, retriever);
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
    counterRetriever = {
      retrieveInfo: function(element) {
        return {
          info: {
            "field": element.parent(".counter").attr("id"),
            "increment": element.attr("class") == "up" ? 1 : -1
          }
        };
      }
    };
    constructor(link) {
      this.element = $(link);
    }
  };
})();
