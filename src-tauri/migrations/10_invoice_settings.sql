-- Configuración de la factura, sobre la fila única de `pos_setting`.

-- Prefijo opcional del número de factura ("A-", "FAC-"). Vacío = sin prefijo.
ALTER TABLE pos_setting
    ADD COLUMN invoice_prefix TEXT NOT NULL DEFAULT '';

-- Próximo número a emitir. Es configurable porque muchos negocios vienen de
-- un talonario en papel y necesitan continuar su correlativo, no empezar en 1.
-- La app lo incrementará al emitir cada factura.
ALTER TABLE pos_setting
    ADD COLUMN invoice_next_number INTEGER NOT NULL DEFAULT 1
        CHECK (invoice_next_number >= 1);

-- SQLite no tiene BOOLEAN: 0 = no mostrar, 1 = mostrar.
ALTER TABLE pos_setting
    ADD COLUMN invoice_show_business_info INTEGER NOT NULL DEFAULT 1
        CHECK (invoice_show_business_info IN (0, 1));

-- Nota al pie ("Gracias por su compra"). Vacía = no se imprime nada.
ALTER TABLE pos_setting
    ADD COLUMN invoice_footer_note TEXT NOT NULL DEFAULT '';
