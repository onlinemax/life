(() => {
  // src/ts/screen.ts
  var View = class {
    _context;
    _canvas;
    _counters;
    _buttons;
    constructor() {
      this._canvas = $("canvas").get(0);
      this._context = this.canvas.getContext("2d");
      this._counters = $(".counter");
      this._buttons = $("#start, #reset, #paused");
    }
    setColor(color) {
      this._context.fillStyle = color;
    }
    get canvas() {
      return this._canvas;
    }
    get context() {
      return this._context;
    }
    get counter() {
      return this._counters;
    }
    get buttons() {
      return this._buttons;
    }
    init() {
      init();
    }
  };
  var view = new View();
  var colors = {
    lineColor: "#000000",
    aliveColor: "#000000",
    deadColor: "#ffffff"
  };
  var lineSize = 1;
  function init() {
    view.canvas.width = Number.parseInt(window.getComputedStyle(view.canvas).width);
    view.canvas.height = Number.parseInt(window.getComputedStyle(view.canvas).height);
    view.counter.on("click", "button", function(evt) {
      const p = $(this).parent();
      const dim = p.attr("class");
      const number = Number.parseInt(p.find("div span").text());
      if (Number.isNaN(number)) {
        return;
      }
      const action = $(this).attr("class") == "up" ? "Increment" : "Decrement";
      receiveAction({
        name: "UPDATE",
        what: dim,
        currentValue: number,
        action
      });
    });
    view.buttons.on("click", function(e) {
      const id = $(e.target).attr("id");
      receiveAction({
        name: "CHANGE",
        what: "STATE",
        currentValue: "unknown",
        action: id
      });
    });
    $(view.canvas).on("mousemove mouseup mousedown", receiveClick);
  }
  function getCellDims(rows, cols) {
    const { width, height } = view.canvas;
    return {
      cellWidth: Math.round((width - lineSize * (cols - 1)) / cols * 2) / 2,
      cellHeight: Math.round((height - lineSize * (rows - 1)) / rows * 2) / 2
    };
  }
  function drawLines(rows, cols) {
    const { width, height } = view.canvas;
    const { cellWidth, cellHeight } = getCellDims(rows, cols);
    view.context.fillStyle = colors.lineColor;
    for (let i = 0; i < cols - 1; i++) {
      view.context.fillRect((lineSize + cellWidth) * i + cellWidth, 0, lineSize, height);
    }
    for (let i = 0; i < rows - 1; i++) {
      view.context.fillRect(0, (lineSize + cellHeight) * i + cellHeight, width, lineSize);
    }
  }
  function drawBackground() {
    view.setColor(colors.deadColor);
    view.context.fillRect(0, 0, view.canvas.width, view.canvas.height);
  }
  function paintCells(gameCells2) {
    view.setColor(colors.aliveColor);
    const rows = gameCells2.length, cols = gameCells2[0].length;
    const { cellWidth, cellHeight } = getCellDims(rows, cols);
    console.log(cellWidth, cellHeight);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!gameCells2[i][j])
          continue;
        view.context.fillRect(
          j * (cellWidth + lineSize),
          i * (cellHeight + lineSize),
          cellWidth,
          cellHeight
        );
      }
    }
  }
  var receiveClick = function() {
    const t = view.canvas.getBoundingClientRect().top;
    const l = view.canvas.getBoundingClientRect().left;
    let dragging = false;
    const set = /* @__PURE__ */ new Set();
    return function(evt) {
      if (evt.type == "mousedown") {
        dragging = true;
      }
      if (evt.type == "mouseup") {
        dragging = false;
      }
      const { rows, cols } = getDimension();
      const { cellWidth, cellHeight } = getCellDims(rows, cols);
      const x = Math.floor((evt.clientX - l) / (lineSize + cellWidth));
      const y = Math.floor((evt.clientY - t) / (lineSize + cellHeight));
      receiveAction({
        name: evt.type == "mousedown" ? "UPDATE" : evt.type == "mousedown" ? "END" : "APPEND",
        what: dragging ? "CELL" : "NOTHING",
        currentValue: y * cols + x,
        action: "CHANGE"
      });
    };
  }();
  function showToolTip(row, col, value) {
    $("#tooltip #row").text(row);
    $("#tooltip #col").text(col);
    $("#tooltip #index").text(row * getDimension().cols + col);
    $("#tooltip #state").text(value ? "alive" : "dead");
  }
  function drawGrid(gameCells2) {
    const rows = gameCells2.length;
    const cols = gameCells2[0].length;
    view.context.clearRect(0, 0, view.canvas.width, view.canvas.height);
    checkPermission();
    drawBackground();
    drawLines(rows, cols);
    paintCells(gameCells2);
  }
  function checkPermission() {
    const permission = getGamePermissions();
    $("#start").attr("disabled", permission.start ? null : "disabled");
    $("#pause").attr("disabled", permission.pause ? null : "disabled");
    $("#reset").attr("disabled", permission.reset ? null : "disabled");
  }
  view.init();

  // src/ts/storage.ts
  var currentDimension = {
    rows: 29,
    cols: 57
  };
  var gameCells = newGameCell();
  function newGameCell() {
    const tmp = new Array(currentDimension.rows + 2);
    for (let i = 0; i < tmp.length; i++) {
      tmp[i] = new Array(currentDimension.cols + 2);
      for (let j = 0; j < tmp[i].length; j++) {
        tmp[i][j] = false;
      }
    }
    return tmp;
  }
  var gameHistory = [];
  function updateDimension(drow, dCol) {
    currentDimension.rows += drow;
    currentDimension.cols += dCol;
    resizeGameCell();
    drawGrid(gameCells);
  }
  function verifyCell(x, y) {
    return x < currentDimension.cols && y < currentDimension.rows;
  }
  function verifyDimension() {
    const { rows, cols } = currentDimension;
    if (rows + 2 != gameCells.length || cols + 2 != gameCells[0].length) {
      throw Error("The dimensions does not match");
    }
  }
  function resizeGameCell() {
    const tmp = newGameCell();
    const minRows = Math.min(tmp.length, gameCells.length);
    const minCols = Math.min(tmp[0].length, gameCells[0].length);
    for (let i = 0; i < minRows; i++) {
      for (let j = 0; j < minCols; j++) {
        if (!gameCells[i][j])
          continue;
        tmp[i][j] = true;
      }
    }
    const diff = [];
    if (tmp.length < gameCells.length) {
      for (let i = tmp.length; i < gameCells.length; i++) {
        for (let j = 0; j < gameCells[0].length; j++) {
          if (!gameCells[i][j])
            continue;
          diff.push(i * gameCells[0].length + j);
        }
      }
    }
    if (tmp[0].length < gameCells[0].length) {
      for (let i = 0; i < tmp.length; i++) {
        for (let j = tmp[0].length; j < gameCells[0].length; j++) {
          if (!gameCells[i][j])
            continue;
          diff.push(i * gameCells[0].length + j);
        }
      }
    }
    if (diff.length > 0) {
      gameHistory.push({
        name: 0 /* dimensionChanged */,
        dims: [currentDimension.rows, currentDimension.cols],
        data: diff
      });
    }
    gameCells = tmp;
  }
  function updateCells(changedCells, value) {
    const diff = [];
    verifyDimension();
    changedCells.forEach((cell) => {
      const [y, x] = cell;
      if (!verifyCell(x, y))
        throw Error(`Out of bounds x: ${x} and y: ${y}`);
      if (gameCells[y][x] == value)
        return;
      diff.push(y * n + x);
      gameCells[y][x] = value;
    });
    gameHistory.push({
      name: 1 /* cellsChanged */,
      dims: [currentDimension.rows, currentDimension.cols],
      data: diff
    });
    drawGrid(gameCells);
  }
  function resetGame() {
    verifyDimension();
    const diff = [];
    const { cols } = currentDimension;
    for (let row = 0; row < gameCells.length; row++) {
      for (let col = 0; col < gameCells[0].length; col++) {
        if (gameCells[row][col] == true)
          diff.push(row * cols + col);
        gameCells[row][col] = false;
      }
    }
    gameHistory.push({
      name: 1 /* cellsChanged */,
      dims: [currentDimension.rows, currentDimension.cols],
      data: diff
    });
    drawGrid(gameCells);
  }
  function getGameCells() {
    return gameCells;
  }

  // src/ts/logic.ts
  var GameState = /* @__PURE__ */ ((GameState2) => {
    GameState2[GameState2["STOPPED"] = 0] = "STOPPED";
    GameState2[GameState2["PAUSED"] = 1] = "PAUSED";
    GameState2[GameState2["PLAYING"] = 2] = "PLAYING";
    return GameState2;
  })(GameState || {});
  var virtualGame = [];
  var currentState = 0 /* STOPPED */;
  function getGamePermissions() {
    const permission = {
      modifying: true,
      reset: true,
      pause: false,
      start: true
    };
    switch (currentState) {
      case 0 /* STOPPED */: {
        return permission;
      }
      case 1 /* PAUSED */: {
        permission.pause = false;
        permission.start = true;
        permission.reset = true;
        return permission;
      }
      case 2 /* PLAYING */: {
        permission.modifying = false;
        permission.start = false;
        permission.reset = false;
        return permission;
      }
    }
  }
  var Game = class {
  };
  var game = new Game();
  var receiveAction = /* @__PURE__ */ function() {
    let selectedCell = [];
    let value = false;
    return function(action) {
      const n2 = virtualGame[0].length;
      if (action.name == "CHANGE" && action.what == "STATE") {
        if (action.action == "pause") {
          currentState = 1 /* PAUSED */;
        }
        if (action.action == "start") {
          currentState = 2 /* PLAYING */;
          startLoop();
        }
        if (action.action == "reset") {
          currentState = 0 /* STOPPED */;
          resetGame();
        }
      }
      let x, y;
      if (action.what == "NOTHING") {
        x = action.currentValue % n2;
        y = Math.floor(action.currentValue / n2);
        showToolTip(y, x, virtualGame[y][x]);
      }
      if (action.what == "CELL")
        x = action.currentValue % n2, y = Math.floor(action.currentValue / n2);
      if (action.name == "UPDATE" && action.what == "CELL") {
        value = !virtualGame[y][x];
      }
      if ((action.name == "UPDATE" || action.name == "APPEND") && action.what == "CELL") {
        selectedCell.push([x, y]);
        virtualGame[y][x] = value;
        drawGrid(virtualGame);
      }
      if (action.name == "END" && action.what == "CELL") {
        updateCells(selectedCell, value);
      }
    };
  }();
  function startGame() {
    updateDimension(0, 0);
    virtualGame = getGameCells();
  }
  function getDimension() {
    return {
      rows: virtualGame.length,
      cols: virtualGame[0].length
    };
  }
  startGame();
  function startLoop() {
    let startTime;
    function repeat(timestamp) {
      if (currentState != 2 /* PLAYING */)
        return;
      if (startTime == void 0)
        startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (30 * elapsed / 1e3 > 1)
        requestAnimationFrame(repeat);
      virtualGame = getGameCells();
      handleGame();
      startTime = timestamp;
      requestAnimationFrame(repeat);
    }
    requestAnimationFrame(repeat);
  }
  function handleGame() {
    const neigbors = /* @__PURE__ */ new Map();
    const rows = virtualGame.length, cols = virtualGame[0].length;
    function numberOfNeigbors(index) {
      const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
      for (const direction of directions) {
        const row = Math.floor(index / cols) + direction[0];
        const col = index % cols + direction[1];
        if (row < 0 || row >= rows || col < 0 || col >= cols)
          continue;
        neigbors.set(index, neigbors.get(index) ?? 0 + 1);
        neigbors.set(row * cols + col, neigbors.get(row * cols + col) ?? 0 + 1);
      }
    }
    for (let i = 0; i < virtualGame.length; i++) {
      for (let j = 0; j < virtualGame[0].length; j++) {
        if (!virtualGame[i][j])
          continue;
        numberOfNeigbors(i * cols + j);
      }
    }
    console.log(neigbors);
  }
})();
