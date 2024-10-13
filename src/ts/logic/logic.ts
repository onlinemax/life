interface LogicInterface {
    startGame: () => void;
    pauseGame: () => void;
    resetGame: () => void;
    updateRow: (increment: boolean) => void;
    updateCol: (increment: boolean) => void;
}
enum GameState {
    Playing,
    Pause,
    Reseted,
}

class Logic implements LogicInterface {

    state = GameState.Reseted;
    constructor() {

    }


    startGame() {
        if (this.state == GameState.Playing)
            return;
    }
    pauseGame() {
        if (this.state == GameState.Pause)
            return;
    }
    resetGame() {

    }
    updateRow(increment: boolean) {

    }
    updateCol(increment: boolean) {

    }

}
const logic = new Logic();

export default logic;
