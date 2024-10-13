import { receiveAction } from "./logic.js";
import { getDimension } from "./storage.js";
var View = /** @class */ (function () {
    function View() {
        this._canvas = $("canvas").get(0);
        this._context = this.canvas.getContext("2d");
        this._counters = $(".counter");
        this._buttons = $("#start, #reset, #paused");
    }
    View.prototype.setColor = function (color) {
        this._context.fillStyle = color;
    };
    Object.defineProperty(View.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "counter", {
        get: function () {
            return this._counters;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "buttons", {
        get: function () {
            return this._buttons;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.init = function () {
        init();
    };
    return View;
}());
var view;
view.init();
var colors = {
    lineColor: "#000000",
    aliveColor: "#000000",
    deadColor: "#ffffff",
};
var lineSize = 1;
function init() {
    var _this = this;
    view.canvas.width = Number.parseInt(window.getComputedStyle(view.canvas).width);
    view.canvas.height = Number.parseInt(window.getComputedStyle(view.canvas).height);
    view.counter.on("click", "button", function (evt) {
        var p = $(this).parent();
        var dim = p.attr("class");
        var number = Number.parseInt(p.find("div span").text());
        if (Number.isNaN(number)) {
            return;
        }
        var action = $(this).attr("class") == "up" ? "Increment" : "Decrement";
        receiveAction({
            name: "UPDATE",
            what: dim,
            currentValue: number,
            action: action,
        });
    });
    view.buttons.on("click", function () {
        var _a;
        var id = ((_a = $(_this).attr("id")) === null || _a === void 0 ? void 0 : _a.split('').map(function (v, i) { return i != 0 ? v : v.toUpperCase(); }).join('')) + "State";
        receiveAction({
            name: "CHANGE",
            what: "state",
            currentValue: "unknown",
            action: id,
        });
    });
    $(view.canvas).on("mousemove mouseup mousedown", receiveClick);
}
function getCellDims(rows, cols) {
    var _a = view.canvas, width = _a.width, height = _a.height;
    return {
        cellWidth: Math.round((width - lineSize * (cols - 1)) / cols),
        cellHeight: Math.round((height - lineSize * (rows - 1)) / rows),
    };
}
function drawLines(rows, cols) {
    var _a = view.canvas, width = _a.width, height = _a.height;
    var _b = getCellDims(rows, cols), cellWidth = _b.cellWidth, cellHeight = _b.cellHeight;
    for (var i = 0; i < cols - 1; i++) {
        view.context.fillRect((lineSize + cellWidth) * i + cellWidth, 0, lineSize, height);
    }
    for (var i = 0; i < rows - 1; i++) {
        view.context.fillRect(0, (lineSize + cellHeight) * i + cellHeight, width, lineSize);
    }
}
function drawBackground() {
    view.setColor(colors.deadColor);
    view.context.fillRect(0, 0, view.canvas.width, view.canvas.height);
}
function paintCells(gameCells) {
    view.setColor(colors.aliveColor);
    var rows = gameCells.length, cols = gameCells[0].length;
    var _a = getCellDims(rows, cols), cellWidth = _a.cellWidth, cellHeight = _a.cellHeight;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (!gameCells[i][j])
                continue;
            view.context.fillRect(j * (cellWidth + lineSize), i * (cellHeight + lineSize), cellWidth, cellHeight);
        }
    }
}
var receiveClick = (function () {
    var t = view.canvas.getBoundingClientRect().top;
    var l = view.canvas.getBoundingClientRect().left;
    var dragging = false;
    var set = new Set();
    return function (evt) {
        if (evt.type == "mousedown") {
            dragging = true;
        }
        if (!dragging || evt.type == "mouseup") {
            dragging = false;
            return;
        }
        var _a = getDimension(), rows = _a.rows, cols = _a.cols;
        var _b = getCellDims(rows, cols), cellWidth = _b.cellWidth, cellHeight = _b.cellHeight;
        var x = Math.floor((evt.clientX - l) / (lineSize + cellWidth));
        var y = Math.floor((evt.clientY - t) / (lineSize + cellHeight));
        receiveAction({
            name: evt.type == "mousedown" ? "UPDATE" : "CHANGE",
            what: "CELL",
            currentValue: y * cols + x,
            action: "CHANGE",
        });
    };
})();
export function drawGrid(gameCells) {
    if (view == undefined)
        view = new View();
    var rows = gameCells.length;
    var cols = gameCells[0].length;
    view.context.clearRect(0, 0, view.canvas.width, view.canvas.height);
    drawBackground();
    drawLines(rows, cols);
    paintCells(gameCells);
}
