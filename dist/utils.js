"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid4 = void 0;
const uuid4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (seed) => {
        const number = parseInt(seed);
        return (number ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (number / 4)))).toString(16);
    });
};
exports.uuid4 = uuid4;
