import { updateDimension, getGameCells, updateCells, resetGame } from "./storage";
import { drawGrid, showToolTip } from "./screen";
export interface Action {
    name: string,
    what: string,
    currentValue: string | number,
    action: string,
    options?: {
        pos?: {
            x: number,
            y: number,
        }
    }
}
export enum GameState {
    STOPPED,
    PAUSED,
    PLAYING,
}
let virtualGame: boolean[][] = [];

let currentState = GameState.STOPPED;
type Permission = {
    modifying: boolean,
    reset: boolean,
    pause: boolean,
    start: boolean,
}
export function getGamePermissions(): Permission {
    const permission: Permission = {
        modifying: true,
        reset: true,
        pause: false,
        start: true,
    }
    switch (currentState) {
        case GameState.STOPPED: {
            return permission;
        }
        case GameState.PAUSED: {
            permission.pause = false;
            permission.start = true;
            permission.reset = true;
            return permission;
        }
        case GameState.PLAYING: {
            permission.modifying = false;
            permission.start = false;
            permission.reset = false;
            return permission;
        }
    }
}
class Game {

}
const game = new Game();


export const receiveAction = (function() {
    let selectedCell: Array<[number, number]> = [];
    let value = false;
    return function(action: Action) {
        const n = virtualGame[0].length;
        if (action.name == "CHANGE" && action.what == "STATE") {
            if (action.action == "pause") {
                currentState = GameState.PAUSED;
            }
            if (action.action == "start") {
                currentState = GameState.PLAYING;
                startLoop();
            }
            if (action.action == "reset") {
                currentState = GameState.STOPPED;
                resetGame();
            }
        }
        let x, y;
        if (action.what == "NOTHING") {
            x = action.currentValue as number % n;
            y = Math.floor(action.currentValue as number / n);
            showToolTip(y, x, virtualGame[y][x])
        }
        if (action.what == "CELL")
            x = action.currentValue as number % n, y = Math.floor(action.currentValue as number / n);
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
    }
})();



function startGame() {
    updateDimension(0, 0);
    virtualGame = getGameCells();
}
export function getDimension() {
    return {
        rows: virtualGame.length,
        cols: virtualGame[0].length,
    };
}
startGame();

function startLoop() {
    let startTime: DOMHighResTimeStamp;
    function repeat(timestamp: DOMHighResTimeStamp) {
        if (currentState != GameState.PLAYING)
            return;
        if (startTime == undefined)
            startTime = timestamp;

        const elapsed = timestamp - startTime;
        if (30 * elapsed / 1000 > 1)
            requestAnimationFrame(repeat);
        virtualGame = getGameCells();
        handleGame();
        startTime = timestamp;

        requestAnimationFrame(repeat)
    }
    requestAnimationFrame(repeat);
}
function handleGame() {
    // The key represent an cell in the board and the value is the number of alive cell that are neihbors. 
    const neigbors: Map<number, number> = new Map();
    const rows = virtualGame.length, cols = virtualGame[0].length;
    function numberOfNeigbors(index: number) {
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
