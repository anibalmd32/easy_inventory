import * as v from "valibot";
import { SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

export const SecurityAnswerSchema = v.pipe(
  v.string(SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.answer_too_short),
  v.trim(),
  v.minLength(2, SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.answer_too_short),
  v.maxLength(120, SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.answer_too_long),
);

/**
 * El `<select>` del formulario entrega el id como string; aquí se valida y
 * se convierte al número que espera la base de datos.
 */
export const SecurityQuestionIdSchema = v.pipe(
  v.string(SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.question_required),
  v.trim(),
  v.minLength(1, SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.question_required),
  v.transform(Number),
  v.number(SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.question_required),
  v.integer(SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.question_required),
  v.minValue(1, SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES.question_required),
);
