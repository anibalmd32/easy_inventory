import * as v from "valibot";

export type ValidationError<T> = {
  key: keyof T;
  message: string;
};

export type Validated<T> = {
  validData?: T;
  error?: ValidationError<T>[];
};

/**
 * Valida un objeto de datos contra un esquema de Valibot.
 * @param dto El esquema de validación de Valibot.
 * @param data Los datos a validar.
 * @returns Un objeto con los datos validados o una lista de errores.
 */
export function dtoValidator<
  T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(dto: T, data: unknown): Validated<v.InferOutput<T>> {
  const result = v.safeParse(dto, data);

  if (result.success) {
    return {
      validData: result.output,
    };
  } else {
    const errorList: ValidationError<v.InferOutput<T>>[] = result.issues.map(
      (issue) => {
        let key = "unknown" as keyof v.InferOutput<T>;

        if (issue.path && issue.path.length > 0) {
          key = issue.path[0].key as keyof v.InferOutput<T>;
        }

        return {
          key,
          message: issue.message,
        };
      },
    );

    return {
      error: errorList,
    };
  }
}
