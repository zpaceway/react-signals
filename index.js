"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignal = void 0;
const react_1 = require("react");
const rxjs_1 = require("rxjs");
class Polaris {
    static getOrCreateSignal(name, context, defaultValue) {
        let signal = this.signals[`${name}/${context}`];
        if (!signal) {
            signal = new rxjs_1.BehaviorSubject(defaultValue);
            this.signals[`${name}/${context}`] = signal;
        }
        return signal;
    }
}
Polaris.signals = {};
const useSignal = ({ name, context = "default", defaultValue, }) => {
    const update$ = (0, react_1.useRef)(Polaris.getOrCreateSignal(name, context, defaultValue));
    const [state, setState] = (0, react_1.useState)(defaultValue || update$.current.getValue());
    (0, react_1.useEffect)(() => {
        const subscription = update$.current.subscribe((next) => {
            setState(next);
        });
        () => subscription.unsubscribe();
    }, [setState]);
    (0, react_1.useEffect)(() => {
        if (defaultValue !== undefined &&
            update$.current.getValue() === undefined) {
            update$.current.next(defaultValue);
        }
    }, []);
    return [
        () => state,
        (newState) => {
            update$.current.next(newState);
        },
    ];
};
exports.useSignal = useSignal;
