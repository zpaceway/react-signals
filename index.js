"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignal = void 0;
const react_1 = require("react");
const rxjs_1 = require("rxjs");
class Polaris {
    static getOrCreateSignal(name, context, initialValue) {
        const path = `${context}/${name}`;
        let signal = this.signals[path];
        if (!signal) {
            signal = new rxjs_1.BehaviorSubject(initialValue);
            this.signals[path] = signal;
        }
        return signal;
    }
}
Polaris.signals = {};
const useSignal = ({ name, context = "default", initialValue, subscribe = true, }) => {
    const signal$ = (0, react_1.useRef)(Polaris.getOrCreateSignal(name, context, initialValue));
    const [state, setState] = (0, react_1.useState)(signal$.current.getValue());
    (0, react_1.useEffect)(() => {
        if (subscribe) {
            const subscription = signal$.current.subscribe((next) => {
                setState(next);
            });
            return () => subscription.unsubscribe();
        }
    }, [setState]);
    (0, react_1.useEffect)(() => {
        if (initialValue !== undefined &&
            signal$.current.getValue() === undefined) {
            signal$.current.next(initialValue);
        }
    }, []);
    const reset = (0, react_1.useCallback)(() => signal$.current.next(initialValue), []);
    const detectChanges = (0, react_1.useCallback)(() => setState(signal$.current.getValue()), [setState]);
    return {
        state,
        setState: (newState) => {
            signal$.current.next(newState);
        },
        reset,
        detectChanges,
    };
};
exports.useSignal = useSignal;
