export interface Action {
    name: string;
    what: string;
    currentValue: string | number;
    action: string;
}
export declare function receiveAction(action: Action): void;
 