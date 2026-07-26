const DIACRITICS = /\p{Diacritic}/gu;
const EXTRA_SPACES = /\s+/g;

/**
 * Deja la respuesta de seguridad en una forma comparable: sin tildes, en
 * minúsculas y con los espacios colapsados. Se guarda ya normalizada para
 * que al recuperar la contraseña "María José" y "maria jose" coincidan.
 */
export const normalizeSecurityAnswer = (answer: string): string =>
  answer
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .trim()
    .toLowerCase()
    .replace(EXTRA_SPACES, " ");
