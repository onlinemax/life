import { Action, receiveAction, getDimension, getGamePermissions } from "./logic";
class View {
    private _context: CanvasRenderingContext2D;
    private _canvas: HTMLCanvasElement;
    private _counters: JQuery<HTMLDivElement>
    private _buttons: JQuery<HTMLButtonElement>
    constructor() {
        this._canvas = $("canvas").get(0) as HTMLCanvasElement;
        this._context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this._counters = $(".counter");
        this._buttons = $("#start, #reset, #paused");
    }
    setColor(color: string) {
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
}
const view = new View();

const colors = {
    lineColor: "#000000",
    aliveColor: "#000000",
    deadColor: "#ffffff",
}
const lineSize = 1;
function init() {
    view.canvas.width = Number.parseInt(window.getComputedStyle(view.canvas).width);
    view.canvas.height = Number.parseInt(window.getComputedStyle(view.canvas).height);
    view.counter.on("click", "button", function(evt) {
        const p = $(this).parent();
        const dim = p.attr("class");
        const number = Number.parseInt(p.find("div span").text())
        if (Number.isNaN(number)) {
            return;
        }
        const action = $(this).attr("class") == "up" ? "Increment" : "Decrement";
        receiveAction({
            name: "UPDATE",
            what: dim as string,
            currentValue: number,
            action: action,
        });
    });
    view.buttons.on("click", function(e) {
        const id = $(e.target).attr("id") as string;
        receiveAction({
            name: "CHANGE",
            what: "STATE",
            currentValue: "unknown",
            action: id,
        })
    });
    $(view.canvas).on("mousemove mouseup mousedown", receiveClick)
}
function getCellDims(rows: number, cols: number) {
    const { width, height } = view.canvas;
    return {
        cellWidth: Math.round(((width - lineSize * (cols - 1)) / cols) * 2) / 2,
        cellHeight: Math.round(((height - lineSize * (rows - 1)) / rows) * 2) / 2,
    }
}
function drawLines(rows: number, cols: number) {
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
function paintCells(gameCells: Array<Array<boolean>>) {
    view.setColor(colors.aliveColor);
    const rows = gameCells.length, cols = gameCells[0].length;
    const { cellWidth, cellHeight } = getCellDims(rows, cols);
    console.log(cellWidth, cellHeight)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!gameCells[i][j])
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
const receiveClick = (function() {
    const t = view.canvas.getBoundingClientRect().top;
    const l = view.canvas.getBoundingClientRect().left;
    let dragging = false;
    const set: Set<number> = new Set();
    return function(evt: JQuery.Event) {
        if (evt.type == "mousedown") {
            dragging = true;
        }
        if (evt.type == "mouseup") {
            dragging = false;
        }
        const { rows, cols } = getDimension();
        const { cellWidth, cellHeight } = getCellDims(rows, cols);
        const x = Math.floor((evt.clientX as number - l) / (lineSize + cellWidth));
        const y = Math.floor((evt.clientY as number - t) / (lineSize + cellHeight));
        receiveAction({
            name: evt.type == "mousedown" ? "UPDATE" : (evt.type == "mousedown" ? "END" : "APPEND"),
            what: dragging ? "CELL" : "NOTHING",
            currentValue: y * cols + x,
            action: "CHANGE",
        });
    }

})()
export function showToolTip(row: number, col: number, value: boolean) {
    $("#tooltip #row").text(row);
    $("#tooltip #col").text(col);
    $("#tooltip #index").text(row * getDimension().cols + col);
    $("#tooltip #state").text(value ? "alive" : "dead");
}
export function drawGrid(gameCells: Array<Array<boolean>>) {
    const rows = gameCells.length;
    const cols = gameCells[0].length;
    view.context.clearRect(0, 0, view.canvas.width, view.canvas.height);
    checkPermission();
    drawBackground();
    drawLines(rows, cols);
    paintCells(gameCells);
}
function checkPermission() {
    const permission = getGamePermissions();

    $("#start").attr("disabled", permission.start ? null : "disabled")
    $("#pause").attr("disabled", permission.pause ? null : "disabled")
    $("#reset").attr("disabled", permission.reset ? null : "disabled");
}
view.init();
