(() => {
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
})();
