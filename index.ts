import { useCallback, useEffect, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";

class Polaris {
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

type UseSignalReturnType<T> = {
  state: T;
  setState: (newState: T) => void;
  reset: () => void;
  detectChanges: () => void;
};

interface UseSignalProps<T> {
  name: string;
  context?: string;
  initialValue: T;
  subscribe?: boolean;
}

export const useSignal = <T>({
  name,
  context = "default",
  initialValue,
  subscribe = true,
}: UseSignalProps<T>): UseSignalReturnType<T> => {
  const signal$ = useRef(
    Polaris.getOrCreateSignal<T>(name, context, initialValue)
  );

  const [state, setState] = useState(signal$.current.getValue());

  useEffect(() => {
    if (subscribe) {
      const subscription = signal$.current.subscribe((next) => {
        setState(next);
      });

      return () => subscription.unsubscribe();
    }
  }, [setState]);

  useEffect(() => {
    if (
      initialValue !== undefined &&
      signal$.current.getValue() === undefined
    ) {
      signal$.current.next(initialValue);
    }
  }, []);

  const reset = useCallback(() => signal$.current.next(initialValue), []);
  const detectChanges = useCallback(
    () => setState(signal$.current.getValue()),
    [setState]
  );

  return {
    state,
    setState: (newState: T) => {
      signal$.current.next(newState);
    },
    reset,
    detectChanges,
  };
};
