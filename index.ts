import { useCallback, useEffect, useRef, useState } from "react";
import type { UseSignalProps, UseSignalReturnInterface } from "./interfaces";
import Polaris from "./Polaris";

export const useSignal = <T>({
  name,
  context = "default",
  initialValue,
  subscribe = true,
}: UseSignalProps<T>): UseSignalReturnInterface<T> => {
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
