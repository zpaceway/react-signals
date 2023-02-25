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

export const useSignal = <T,>({
  name,
  context = "default",
  defaultValue,
}: UseSignalProps<T>): ReactSignalsReturnType<T> => {
  const update$ = useRef(
    Polaris.getOrCreateSignal<T>(name, context, defaultValue)
  );
  const [state, setState] = useState(
    defaultValue || update$.current.getValue()
  );

  useEffect(() => {
    update$.current.subscribe((next) => {
      setState(next);
    });

    () => update$.current.unsubscribe();
  }, [setState]);

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      update$.current.getValue() === undefined
    ) {
      update$.current.next(defaultValue);
    }
  }, []);

  return [
    () => state,
    (newState: T) => {
      update$.current.next(newState);
    },
  ];
};
