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

  // src/ts/logic/logic.ts
  var Logic = class {
    state = 2 /* Reseted */;
    constructor() {
    }
    startGame() {
      if (this.state == 0 /* Playing */)
        return;
    }
    pauseGame() {
      if (this.state == 1 /* Pause */)
        return;
    }
    resetGame() {
    }
    updateRow(increment) {
    }
    updateCol(increment) {
    }
  };
  var logic = new Logic();
  var logic_default = logic;

  // src/ts/view/screen.ts
  var Screen = class {
    counters = [new Counter("#row"), new Counter("#cols")];
    canvas = $("canvas");
    buttons = {
      play: new Button($("#play"), defaultButtonRetriever),
      reset: new Button($("#reset"), defaultButtonRetriever),
      pause: new Button($("#pause"), defaultButtonRetriever)
    };
    constructor() {
      this.init();
    }
    init() {
      this.buttons.pause.addListener({
        receiveAction: (action) => {
          if (action.name == "mouseup") {
            logic_default.pauseGame();
          }
        }
      });
      this.buttons.reset.addListener({
        receiveAction: (action) => {
          if (action.name == "mouseup") {
            logic_default.resetGame();
          }
        }
      });
      this.buttons.play.addListener({
        receiveAction: (action) => {
          if (action.name == "mouseup") {
            logic_default.startGame();
          }
        }
      });
      this.counters.forEach((counter) => {
        counter.addListener({
          receiveAction: (action) => {
            if (action.informations.info.field == "rows") {
              logic_default.updateRow(action.informations.info.increment);
            } else {
              logic_default.updateCol(action.informations.info.increment);
            }
          }
        });
      });
      this.counters[0];
    }
  };
  var screen = new Screen();
  var screen_default = screen;
})();
