import { StateCreator, StoreApi } from 'zustand';

type ExecuteApi<S> = {
  set: StoreApi<S>['setState'];
  get: StoreApi<S>['getState'];
};

type ExternalCallbacks<V> = {
  onSuccess?: (res?: V) => void;
  onError?: (errMsg: string) => void;
  onFinish?: () => void;
};

export type AsyncSlice<V> = {
  run: (externalCbs?: ExternalCallbacks<V>, values?: any) => Promise<void>;
  isLoading: boolean;
};

type CreateAsyncSliceFnPrams<BaseState, V> = {
  execute: (api: ExecuteApi<BaseState>, values?: V) => Promise<V | void>;
};

export type WithAsyncState<T> = T extends { __T: infer U } ? U : never;

export function createAsyncSlice<BaseState, V>({
  execute,
}: CreateAsyncSliceFnPrams<BaseState, V>): StateCreator<
  BaseState,
  [],
  [],
  AsyncSlice<V>
> {
  return (set, _, store) => {
    return {
      isLoading: false,
      run: async (externalCbs, values) => {
        set((prev) => ({ ...prev, isLoading: true }));

        try {
          const res = await execute(
            {
              get: store.getState,
              set: () => store.setState,
            },
            values,
          );
          externalCbs?.onSuccess?.(res ?? undefined);
        } catch (error: unknown) {
          const err = error as { message: string };
          externalCbs?.onError?.(err.message);
        } finally {
          set((prev) => ({ ...prev, isLoading: false }));
          externalCbs?.onFinish?.();
        }
      },
    };
  };
}
