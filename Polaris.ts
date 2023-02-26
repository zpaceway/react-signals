import { BehaviorSubject } from "rxjs";

export default class Polaris {
  static signals: Record<string, BehaviorSubject<unknown>> = {};

  static getOrCreateSignal<T>(name: string, context: string, initialValue: T) {
    const path = `${context}/${name}`;
    let signal = this.signals[path];
    if (!signal) {
      signal = new BehaviorSubject<unknown>(initialValue);
      this.signals[path] = signal;
    }

    return signal as BehaviorSubject<T>;
  }
}
