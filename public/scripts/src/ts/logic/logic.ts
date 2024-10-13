export getLogic
export interface LogicInterface = {
	pauseGame: () => void;
	resetGame: () => void;
	startGame: () => void;
}
class Logic implements LogicInterface {
	constructor() {

	}
	startSimulation() {

	}
}
export const logic = new Logic();

