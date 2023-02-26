import { useEffect, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";

class Polaris {
  static signals = {} as Record<string, BehaviorSubject<any>>;

  static getOrCreateSignal<T>(name: string, context: string, defaultValue: T) {
    let signal = this.signals[`${name}/${context}`] as BehaviorSubject<T>;
    if (!signal) {
      signal = new BehaviorSubject<T>(defaultValue);
      this.signals[`${name}/${context}`] = signal;
    }

    return signal;
  }
}

type ReactSignalsReturnType<T> = [() => T, (newState: T) => void];

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
  const [state, setState] = useState(
    signal$.current.getValue() !== undefined
      ? signal$.current.getValue()
      : defaultValue
  );

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
    () => state,
    (newState: T) => {
      signal$.current.next(newState);
    },
  ];
};
