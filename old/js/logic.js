var GameState;
(function (GameState) {
    GameState[GameState["STOPPED"] = 0] = "STOPPED";
    GameState[GameState["PAUSED"] = 1] = "PAUSED";
    GameState[GameState["PLAYING"] = 2] = "PLAYING";
})(GameState || (GameState = {}));
var currentState = GameState.STOPPED;
var Game = /** @class */ (function () {
    function Game() {
    }
    return Game;
}());
var game = new Game();
export function receiveAction(action) {
    console.log(action);
}
