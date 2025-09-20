import type { ValidationError } from "../../../../libs/dtoValidator";

export class ErrorHandlerService<T> {
  handleValiError(error: ValidationError<T>[]): void {
    error.forEach((err) => {
      console.error(`Validation error on ${String(err.key)}: ${err.message}`);
    });
  }
}
