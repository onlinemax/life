
interface GameStorageInterface {
    updateDimension: (dims: { rows: number, cols: number }) => void;
}

class GameStorage implements GameStorageInterface {
    private history;

    updateDimension({ rows, cols }: { rows: number; cols: number; }) => void {

    }
}

class GameHistory {

    constructor() {

    }
}


