export interface BaseUseCase<T> {
  execute: () => Promise<T | T[] | void>;
  validate?: (fields: keyof T) => boolean | Error;
}
