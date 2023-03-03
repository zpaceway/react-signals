import { BehaviorSubject } from "rxjs";
export default class Polaris {
    static signals: Record<string, BehaviorSubject<unknown>>;
    static getOrCreateSignal<T>(name: string, context: string, initialValue: T): BehaviorSubject<T>;
}
