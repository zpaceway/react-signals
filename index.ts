import { useEffect, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";

class Polaris {
  static signals: Record<string, BehaviorSubject<unknown>> = {};

  static getOrCreateSignal<T>(name: string, context: string, defaultValue: T) {
    const path = `${context}/${name}`;
    let signal = this.signals[path] as BehaviorSubject<T>;
    if (!signal) {
      signal = new BehaviorSubject(defaultValue);
      this.signals[path] = signal as BehaviorSubject<unknown>;
    }

    return signal;
  }
}

type ReactSignalsReturnType<T> = [T, (newState: T) => void];

interface UseSignalProps<T> {
  name: string;
  context?: string;
  defaultValue: T;
}

export const useSignal = <T>({
  name,
  context = "default",
  defaultValue,
}: UseSignalProps<T>): ReactSignalsReturnType<T> => {
  const signal$ = useRef(
    Polaris.getOrCreateSignal<T>(name, context, defaultValue)
  );
  const [state, setState] = useState(signal$.current.getValue());

  useEffect(() => {
    const subscription = signal$.current.subscribe((next) => {
      setState(next);
    });

    return () => subscription.unsubscribe();
  }, [setState]);

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      signal$.current.getValue() === undefined
    ) {
      signal$.current.next(defaultValue);
    }
  }, []);

  return [
    state,
    (newState: T) => {
      signal$.current.next(newState);
    },
  ];
};
