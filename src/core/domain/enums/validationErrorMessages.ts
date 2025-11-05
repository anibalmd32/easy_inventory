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
}

export enum EMAIL_VALIDATION_ERROR_MESSAGES {
  invalid = "email.invalid",
}

export enum AVATAR_VALIDATION_ERROR_MESSAGES {
  max_size = "avatar.max_size",
  invalid_mime_type = "avatar.invalid_mime_type",
}
