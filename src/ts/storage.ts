import { GameState } from "./logic";
import { drawGrid } from "./screen";


const currentDimension = {
    rows: 29,
    cols: 57
}
enum HistoryName {
    dimensionChanged,
    cellsChanged
}
type HistoryItem = {
    name: HistoryName,
    dims: [number, number],
    data: Array<number>
}
let gameCells = newGameCell();
function newGameCell() {
    const tmp = new Array(currentDimension.rows + 2);
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = new Array(currentDimension.cols + 2);
        for (let j = 0; j < tmp[i].length; j++) {
            tmp[i][j] = false;
        }
    }
    return tmp as boolean[][];
}

const gameHistory: Array<HistoryItem> = [];
export function updateDimension(drow: number, dCol: number) {
    currentDimension.rows += drow;
    currentDimension.cols += dCol;
    resizeGameCell();
    drawGrid(gameCells);
}
function verifyCell(x: number, y: number) {
    return (x < currentDimension.cols && y < currentDimension.rows);
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
    const diff: Array<number> = [];
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
            name: HistoryName.dimensionChanged,
            dims: [currentDimension.rows, currentDimension.cols],
            data: diff,
        });
    }
    gameCells = tmp;
}
export function updateCells(changedCells: Array<[number, number]>, value: boolean) {
    const diff: Array<number> = [];
    verifyDimension();
    changedCells.forEach(cell => {
        const [y, x] = cell;
        if (!verifyCell(x, y))
            throw Error(`Out of bounds x: ${x} and y: ${y}`)
        if (gameCells[y][x] == value)
            return;
        diff.push(y * gameCells[0].length + x);
        gameCells[y][x] = value;
    });
    gameHistory.push({
        name: HistoryName.cellsChanged,
        dims: [currentDimension.rows, currentDimension.cols],
        data: diff,
    });
    drawGrid(gameCells);
}
export function resetGame() {
    verifyDimension();
    const diff: number[] = [];
    const { cols } = currentDimension;
    for (let row = 0; row < gameCells.length; row++) {
        for (let col = 0; col < gameCells[0].length; col++) {
            if (gameCells[row][col] == true)
                diff.push(row * cols + col);
            gameCells[row][col] = false;
        }
    }
    gameHistory.push({
        name: HistoryName.cellsChanged,
        dims: [currentDimension.rows, currentDimension.cols],
        data: diff,
    });
    drawGrid(gameCells);
}
export function getGameCells() {
    return gameCells;
}
