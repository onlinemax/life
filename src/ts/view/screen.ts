import { Button, Counter, defaultButtonRetriever, Action } from "./components";
import logic from "../logic/logic.ts";
class Screen {
    private counters = [new Counter("#row"), new Counter("#cols")];
    private canvas = $("canvas");
    private buttons = {
        play: new Button($("#play"), defaultButtonRetriever),
        reset: new Button($("#reset"), defaultButtonRetriever),
        pause: new Button($("#pause"), defaultButtonRetriever),
    };
    constructor() {
        this.init()
    }
    private init() {
        this.buttons.pause.addListener({
            receiveAction: (action: Action) => {
                if (action.name == "mouseup") {
                    logic.pauseGame();
                }
            }
        })
        this.buttons.reset.addListener({
            receiveAction: (action: Action) => {
                if (action.name == "mouseup") {
                    logic.resetGame();
                }
            }
        })
        this.buttons.play.addListener({
            receiveAction: (action: Action) => {
                if (action.name == "mouseup") {
                    logic.startGame();
                }
            }
        })

        this.counters.forEach(counter => {
            counter.addListener({
                receiveAction: (action: Action) => {
                    if (action.informations.info.field == "rows") {
                        logic.updateRow(action.informations.info.increment as boolean)
                    } else {
                        logic.updateCol(action.informations.info.increment as boolean)
                    }
                }
            })
        });
        this.counters[0];
    }
}
const screen = new Screen();
export default screen;
