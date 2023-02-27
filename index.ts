import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CreateSignalProps,
  LoadSignalReturnInterface,
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
  const signalRef$ = useRef(
    Polaris.getOrCreateSignal<T>(name, context, initialValue)
  );

  const [state, setState] = useState(signalRef$.current.getValue());

  useEffect(() => {
    if (options.subscribe) {
      const subscription = signalRef$.current.subscribe((next) => {
        setState(next);
      });

      return () => subscription.unsubscribe();
    }
  }, [setState]);

  useEffect(() => {
    if (
      initialValue !== undefined &&
      signalRef$.current.getValue() === undefined
    ) {
      signalRef$.current.next(initialValue);
    }
  }, []);

  const reset = useCallback(() => signalRef$.current.next(initialValue), []);
  const detectChanges = useCallback(
    () => setState(signalRef$.current.getValue()),
    [setState]
  );

  return {
    state,
    setState: (newState: T) => {
      signalRef$.current.next(newState);
    },
    reset,
    detectChanges,
  };
};

export const loadSignal = <T>({
  name,
  context = "default",
  initialValue,
}: UseSignalProps<T>): LoadSignalReturnInterface<T> => {
  const signal$ = Polaris.getOrCreateSignal<T>(name, context, initialValue);

  if (initialValue !== undefined && signal$.getValue() === undefined) {
    signal$.next(initialValue);
  }

  const reset = () => signal$.next(initialValue);

  return {
    signal$,
    setState: (newState: T) => {
      signal$.next(newState);
    },
    reset,
  };
};
