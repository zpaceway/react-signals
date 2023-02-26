"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignal = exports.createSignal = void 0;
const react_1 = require("react");
const Polaris_1 = __importDefault(require("./Polaris"));
const createSignal = ({ initialValue, }) => {
    return {
        name: crypto.randomUUID(),
        context: "default",
        initialValue,
    };
};
exports.createSignal = createSignal;
const useSignal = ({ name, context = "default", initialValue }, options = { subscribe: true }) => {
    const signal$ = (0, react_1.useRef)(Polaris_1.default.getOrCreateSignal(name, context, initialValue));
    const [state, setState] = (0, react_1.useState)(signal$.current.getValue());
    (0, react_1.useEffect)(() => {
        if (options.subscribe) {
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
