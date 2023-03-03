import { BehaviorSubject } from "rxjs";
export interface UseSignalReturnInterface<T> {
    state: T;
    setState: (newState: T) => void;
    reset: () => void;
    detectChanges: () => void;
}
export interface LoadSignalReturnInterface<T> {
    signal$: BehaviorSubject<T>;
    setState: (newState: T) => void;
    reset: () => void;
}
export interface CreateSignalProps<T> {
    initialValue: T;
}
export interface UseSignalProps<T> {
    name: string;
    context?: string;
    initialValue: T;
}
export interface UseSignalOptions {
    subscribe: boolean;
}
