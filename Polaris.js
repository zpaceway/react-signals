"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = Polaris;
Polaris.signals = {};
