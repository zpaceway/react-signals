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
    const signal$ = (0, react_1.useRef)(Polaris.getOrCreateSignal(name, context, defaultValue));
    const [state, setState] = (0, react_1.useState)(signal$.current.getValue() !== undefined
        ? signal$.current.getValue()
        : defaultValue);
    (0, react_1.useEffect)(() => {
        const subscription = signal$.current.subscribe((next) => {
            setState(next);
        });
        return () => subscription.unsubscribe();
    }, [setState]);
    (0, react_1.useEffect)(() => {
        if (defaultValue !== undefined &&
            signal$.current.getValue() === undefined) {
            signal$.current.next(defaultValue);
        }
    }, []);
    return [
        state,
        (newState) => {
            signal$.current.next(newState);
        },
    ];
};
exports.useSignal = useSignal;
