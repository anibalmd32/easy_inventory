export enum GENERIC_VALIDATION_ERROR_MESSAGES {
  required_field = "generic.required_field",
  invalid_format = "generic.invalid_format",
  too_short = "generic.too_short",
  too_long = "generic.too_long",
  must_string = "generic.must_string",
  must_number = "generic.must_number",
}

export enum PASSWORD_VALIDATION_ERROR_MESSAGES {
  min_length = "password.min_length",
  max_length = "password.max_length",
  min_lowercase = "password.min_lowercase",
  min_uppercase = "password.min_uppercase",
  min_numbers = "password.min_numbers",
  min_symbols = "password.min_symbols",
  max_repeating = "password.max_repeating",
  confirm_mismatch = "password.confirm_mismatch",
}

export enum CATALOG_VALIDATION_ERROR_MESSAGES {
  name_too_short = "catalog.name_too_short",
  name_too_long = "catalog.name_too_long",
  abbreviation_too_short = "catalog.abbreviation_too_short",
  abbreviation_too_long = "catalog.abbreviation_too_long",
  description_too_long = "catalog.description_too_long",
  quantity_invalid = "catalog.quantity_invalid",
  quantity_too_big = "catalog.quantity_too_big",
}

export enum POS_VALIDATION_ERROR_MESSAGES {
  rate_invalid = "pos.rate_invalid",
}

export enum SECURITY_ANSWER_VALIDATION_ERROR_MESSAGES {
  question_required = "security.question_required",
  answer_too_short = "security.answer_too_short",
  answer_too_long = "security.answer_too_long",
}

export enum EMAIL_VALIDATION_ERROR_MESSAGES {
  invalid = "email.invalid",
}

export enum AVATAR_VALIDATION_ERROR_MESSAGES {
  max_size = "avatar.max_size",
  invalid_mime_type = "avatar.invalid_mime_type",
}
