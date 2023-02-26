export interface UseSignalReturnInterface<T> {
  state: T;
  setState: (newState: T) => void;
  reset: () => void;
  detectChanges: () => void;
}

export interface UseSignalProps<T> {
  name: string;
  context?: string;
  initialValue: T;
}

export interface UseSignalOptions {
  subscribe: boolean;
}
