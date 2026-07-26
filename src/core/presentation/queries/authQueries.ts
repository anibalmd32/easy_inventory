import { queryOptions } from "@tanstack/react-query";
import {
  securityQuestionRepository,
  userRepository,
} from "../../infrastructure/container";

export const authKeys = {
  all: [
    "auth",
  ] as const,
  superAdminExists: [
    "auth",
    "super-admin-exists",
  ] as const,
  securityQuestions: [
    "auth",
    "security-questions",
  ] as const,
};

/**
 * Decide si la app ya está configurada. Se consulta desde `beforeLoad`, por
 * eso conviene que quede cacheada: solo cambia cuando se crea el superadmin,
 * momento en el que la invalidamos a mano.
 */
export const superAdminExistsQueryOptions = queryOptions({
  queryKey: authKeys.superAdminExists,
  queryFn: () => userRepository.existsSuperAdmin(),
  staleTime: Number.POSITIVE_INFINITY,
});

/** Catálogo sembrado por la migración `02_security_questions.sql`. */
export const securityQuestionsQueryOptions = queryOptions({
  queryKey: authKeys.securityQuestions,
  queryFn: () => securityQuestionRepository.findAll(),
  staleTime: Number.POSITIVE_INFINITY,
});
