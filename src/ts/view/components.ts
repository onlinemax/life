export interface Action {
    name: string;
    from: Element;
    informations: ComponentInformation;
    isCTRL: boolean;
    isALT: boolean;
}
export interface ComponentInformation {
    info: Record<string, string | number | boolean>
}
export interface Retriver {
    retrieveInfo: (element: JQuery) => ComponentInformation;
}
interface Listener {
    receiveAction: (action: Action) => void;
}
interface Observer {
    addListener(listener: Listener): void;
}
class Component implements Observer {
    element: JQuery;
    protected retriver: Retriver;
    private listeners: Array<Listener> = [];

    constructor(element: typeof this.element, retriver: Retriver) {
        this.element = element;
        this.retriver = retriver;
    }
    public addListener(listener: Listener) {
        this.listeners.push(listener);
    }
    public retrieveInfo() {
        this.retriver.retrieveInfo(this.element);
    }
    protected sendAction(action: Action) {
        this.listeners.forEach(listener => listener.receiveAction(action))
    }
}

export class Button extends Component {
    constructor(element: JQuery<HTMLElement>, retriever: Retriver) {
        super(element, retriever);
        this.init()
    }
    private init() {
        this.element.on("mouseup", this.handleEvent);
    }
    private handleEvent(evt: JQuery.MouseUpEvent | JQuery.MouseDownEvent) {
        this.sendAction({
            from: evt.target,
            name: evt.type,
            informations: this.retriver.retrieveInfo($(evt.delegateTarget)),
            isCTRL: evt.ctrlKey,
            isALT: evt.altKey,
        });
    }

}
export const defaultButtonRetriever: Retriver = {
    retrieveInfo: function(element: JQuery<HTMLElement>) {
        return {
            info: {
                "id": element.attr("id") as string,
                "class": element.attr("class") as string,
            }
        }
    }
}
interface CounterInfo extends ComponentInformation {
    info: {
        field: string,
        increment: boolean,
    }
}
interface CounterRetriver extends Retriver {
    retrieveInfo: (element: JQuery<HTMLElement>) => CounterInfo;
};
export class Counter implements Observer {

    private element: JQuery<HTMLElement>;
    private buttons: Button[];
    private listeners: Array<Listener> = [];
    private buttonListener: Listener = {
        receiveAction(action) {
            this.listeners.forEach(listener => listener.receiveAction(action));
        },
    }
    private counterRetriever: CounterRetriver = {
        retrieveInfo: function(element: JQuery<HTMLElement>) {
            return {
                info: {
                    "field": element.parent(".counter").attr("id") as string,
                    "increment": element.attr("class") == "up",
                }
            }
        },

    }
    addListener(listener: Listener): void {
        this.listeners.push(listener);
    }
    constructor(link: string) {
        this.element = $(link);
        this.buttons = [new Button(this.element.children(".up"), this.counterRetriever), new Button(this.element.children(".down"), this.counterRetriever)]
        for (let i = 0; i < 2; i++) {
            this.buttons[i].addListener(this.buttonListener)
        }
    }


}
