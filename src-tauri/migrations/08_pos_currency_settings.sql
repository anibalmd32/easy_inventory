-- Configuración general del punto de venta. Una sola fila, siempre id = 1.
--
-- DECISIÓN IMPORTANTE: los precios de los productos se guardan en DÓLARES.
-- El importe en bolívares nunca se almacena, se deriva de la tasa vigente
-- (tabla `exchange_rate`). Así, cuando la tasa cambia, todos los precios en
-- bolívares se actualizan solos y no hay que reetiquetar el catálogo.
--
-- `primary_currency` NO cambia dónde se guarda el dinero: solo decide cuál de
-- los dos importes se muestra grande. El otro se muestra siempre, más pequeño
-- y entre paréntesis.
CREATE TABLE IF NOT EXISTS pos_setting (
    id INTEGER PRIMARY KEY,
    primary_currency TEXT NOT NULL DEFAULT 'USD'
        CHECK (primary_currency IN ('USD', 'VES')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- La fila única. `INSERT OR IGNORE` sobre la clave primaria lo hace idempotente.
INSERT OR IGNORE INTO pos_setting (id, primary_currency) VALUES (1, 'USD');
