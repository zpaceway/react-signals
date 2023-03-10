"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSignal = exports.useSignal = exports.createSignal = void 0;
const react_1 = require("react");
const Polaris_1 = __importDefault(require("./Polaris"));
const pseudoUuid = () => {
    let random1 = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
        let random2 = Math.random() * 16;
        random2 = (random1 + random2) % 16 | 0;
        random1 = Math.floor(random1 / 16);
        return (character === "x" ? random2 : (random2 & 0x3) | 0x8).toString(16);
    });
};
const createSignal = ({ initialValue, }) => {
    return {
        name: pseudoUuid(),
        context: "default",
        initialValue,
    };
};
exports.createSignal = createSignal;
const useSignal = ({ name, context = "default", initialValue }, options = { subscribe: true }) => {
    const signalRef$ = (0, react_1.useRef)(Polaris_1.default.getOrCreateSignal(name, context, initialValue));
    const [state, setState] = (0, react_1.useState)(signalRef$.current.getValue());
    (0, react_1.useEffect)(() => {
        if (options.subscribe) {
            const subscription = signalRef$.current.subscribe((next) => {
                setState(next);
            });
            return () => subscription.unsubscribe();
        }
    }, [setState]);
    (0, react_1.useEffect)(() => {
        if (initialValue !== undefined &&
            signalRef$.current.getValue() === undefined) {
            signalRef$.current.next(initialValue);
        }
    }, []);
    const reset = (0, react_1.useCallback)(() => signalRef$.current.next(initialValue), []);
    const detectChanges = (0, react_1.useCallback)(() => setState(signalRef$.current.getValue()), [setState]);
    return {
        state,
        setState: (newState) => {
            signalRef$.current.next(newState);
        },
        reset,
        detectChanges,
    };
};
exports.useSignal = useSignal;
const loadSignal = ({ name, context = "default", initialValue, }) => {
    const signal$ = Polaris_1.default.getOrCreateSignal(name, context, initialValue);
    if (initialValue !== undefined && signal$.getValue() === undefined) {
        signal$.next(initialValue);
    }
    const reset = () => signal$.next(initialValue);
    return {
        signal$,
        setState: (newState) => {
            signal$.next(newState);
        },
        reset,
    };
};
exports.loadSignal = loadSignal;
