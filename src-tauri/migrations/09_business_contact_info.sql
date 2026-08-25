-- Datos fiscales y de contacto del negocio. Van aquí y no en el punto de
-- venta porque describen al negocio, no la forma de cobrar; la factura solo
-- los consume.
--
-- Cadena vacía = el usuario no lo ha rellenado. Se usa '' en vez de NULL para
-- que la app no tenga que distinguir entre "sin dato" y "dato vacío".
ALTER TABLE business_setting
    ADD COLUMN tax_id TEXT NOT NULL DEFAULT '';

ALTER TABLE business_setting
    ADD COLUMN address TEXT NOT NULL DEFAULT '';

ALTER TABLE business_setting
    ADD COLUMN phone TEXT NOT NULL DEFAULT '';
