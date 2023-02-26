import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CreateSignalProps,
  UseSignalOptions,
  UseSignalProps,
  UseSignalReturnInterface,
} from "./interfaces";
import Polaris from "./Polaris";
import { uuid4 } from "./utils";

export const createSignal = <T>({
  initialValue,
}: CreateSignalProps<T>): UseSignalProps<T> => {
  return {
    name: uuid4(),
    context: "default",
    initialValue,
  };
};

export const useSignal = <T>(
  { name, context = "default", initialValue }: UseSignalProps<T>,
  options: UseSignalOptions = { subscribe: true }
): UseSignalReturnInterface<T> => {
  const signal$ = useRef(
    Polaris.getOrCreateSignal<T>(name, context, initialValue)
  );

  const [state, setState] = useState(signal$.current.getValue());

  useEffect(() => {
    if (options.subscribe) {
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
