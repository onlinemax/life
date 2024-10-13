import { drawGrid } from "./screen.js";
var permissions = {
    modifying: true,
    pausing: false,
    resetting: false,
};
var currentDimension = {
    rows: 29,
    cols: 57
};
var HistoryName;
(function (HistoryName) {
    HistoryName[HistoryName["dimensionChanged"] = 0] = "dimensionChanged";
    HistoryName[HistoryName["cellsChanged"] = 1] = "cellsChanged";
})(HistoryName || (HistoryName = {}));
var gameCells = newGameCell();
function newGameCell() {
    var tmp = new Array(currentDimension.rows + 2);
    for (var i = 0; i < tmp.length; i++) {
        tmp[i] = new Array(currentDimension.cols + 2);
        for (var j = 0; j < tmp[i].length; j++) {
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
    return (x < currentDimension.cols && y < currentDimension.rows);
}
function resizeGameCell() {
    var tmp = newGameCell();
    var minRows = Math.min(tmp.length, gameCells.length);
    var minCols = Math.min(tmp[0].length, gameCells[0].length);
    for (var i = 0; i < minRows; i++) {
        for (var j = 0; j < minCols; j++) {
            if (!gameCells[i][j])
                continue;
            tmp[i][j] = true;
        }
    }
    var diff = [];
    if (tmp.length < gameCells.length) {
        for (var i = tmp.length; i < gameCells.length; i++) {
            for (var j = 0; j < gameCells[0].length; j++) {
                if (!gameCells[i][j])
                    continue;
                diff.push(i * gameCells[0].length + j);
            }
        }
    }
    if (tmp[0].length < gameCells[0].length) {
        for (var i = 0; i < tmp.length; i++) {
            for (var j = tmp[0].length; j < gameCells[0].length; j++) {
                if (!gameCells[i][j])
                    continue;
                diff.push(i * gameCells[0].length + j);
            }
        }
    }
    gameHistory.push({
        name: HistoryName.dimensionChanged,
        dims: [currentDimension.rows, currentDimension.cols],
        data: diff,
    });
    gameCells = tmp;
}
function updateCells(changedCells, value) {
    var diff = [];
    var m = currentDimension.rows, n = currentDimension.cols;
    if (m != gameCells.length || n != gameCells[0].length) {
        throw Error("m should be equal to gameCells.length");
    }
    changedCells.forEach(function (cell) {
        var y = cell[0], x = cell[1];
        if (!verifyCell(x, y))
            throw Error("Out of bounds x: ".concat(x, " and y: ").concat(y));
        if (gameCells[y][x] == value)
            return;
        diff.push(y * n + x);
        gameCells[y][x] = value;
    });
    gameHistory.push({
        name: HistoryName.cellsChanged,
        dims: [currentDimension.rows, currentDimension.cols],
        data: diff,
    });
    drawGrid(gameCells);
}
export function getDimension() {
    return currentDimension;
}
drawGrid(gameCells);
