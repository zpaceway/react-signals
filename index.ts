import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CreateSignalProps,
  LoadSignalReturnInterface,
  UseSignalOptions,
  UseSignalProps,
  UseSignalReturnInterface,
} from "./interfaces";
import Polaris from "./Polaris";

const pseudoUuid = () => {
  let random1 = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      let random2 = Math.random() * 16;
      random2 = (random1 + random2) % 16 | 0;
      random1 = Math.floor(random1 / 16);
      return (character === "x" ? random2 : (random2 & 0x3) | 0x8).toString(16);
    }
  );
};

export const createSignal = <T>({
  initialValue,
}: CreateSignalProps<T>): UseSignalProps<T> => {
  return {
    name: pseudoUuid(),
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
