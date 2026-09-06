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
  prefix_too_long = "pos.prefix_too_long",
  invoice_number_invalid = "pos.invoice_number_invalid",
  footer_too_long = "pos.footer_too_long",
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

export enum LOGO_VALIDATION_ERROR_MESSAGES {
  max_size = "logo.max_size",
  invalid_mime_type = "logo.invalid_mime_type",
}

export enum BUSINESS_VALIDATION_ERROR_MESSAGES {
  tax_id_too_long = "business.tax_id_too_long",
  address_too_long = "business.address_too_long",
  phone_too_long = "business.phone_too_long",
  phone_invalid = "business.phone_invalid",
}

export enum DEBT_VALIDATION_ERROR_MESSAGES {
  term_invalid = "debt.term_invalid",
  limit_invalid = "debt.limit_invalid",
}

export enum CUSTOMER_VALIDATION_ERROR_MESSAGES {
  name_too_short = "customer.name_too_short",
  name_too_long = "customer.name_too_long",
  document_too_long = "customer.document_too_long",
  phone_too_long = "customer.phone_too_long",
  phone_invalid = "customer.phone_invalid",
  notes_too_long = "customer.notes_too_long",
}

export enum SALE_VALIDATION_ERROR_MESSAGES {
  quantity_invalid = "sale.quantity_invalid",
  quantity_too_big = "sale.quantity_too_big",
  amount_invalid = "sale.amount_invalid",
  amount_too_big = "sale.amount_too_big",
  method_required = "sale.method_required",
  reference_too_long = "sale.reference_too_long",
  items_required = "sale.items_required",
  reason_too_long = "sale.reason_too_long",
}

export enum PRODUCT_VALIDATION_ERROR_MESSAGES {
  name_too_short = "product.name_too_short",
  name_too_long = "product.name_too_long",
  sku_too_long = "product.sku_too_long",
  unit_required = "product.unit_required",
  price_invalid = "product.price_invalid",
  price_too_big = "product.price_too_big",
  quantity_invalid = "product.quantity_invalid",
  quantity_too_big = "product.quantity_too_big",
  photo_max_size = "product.photo_max_size",
  photo_invalid_mime_type = "product.photo_invalid_mime_type",
}
