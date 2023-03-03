import type { CreateSignalProps, LoadSignalReturnInterface, UseSignalOptions, UseSignalProps, UseSignalReturnInterface } from "./interfaces";
export declare const createSignal: <T>({ initialValue, }: CreateSignalProps<T>) => UseSignalProps<T>;
export declare const useSignal: <T>({ name, context, initialValue }: UseSignalProps<T>, options?: UseSignalOptions) => UseSignalReturnInterface<T>;
export declare const loadSignal: <T>({ name, context, initialValue, }: UseSignalProps<T>) => LoadSignalReturnInterface<T>;
