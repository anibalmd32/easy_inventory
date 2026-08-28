-- Configuración del módulo de deudas: si el negocio vende a crédito ("fiado")
-- y bajo qué condiciones. Una sola fila, siempre id = 1.
--
-- Todavía no hay notificaciones; de momento estos valores solo se guardan y
-- servirán para marcar deudas vencidas y frenar ventas a crédito cuando el
-- módulo exista.
CREATE TABLE IF NOT EXISTS debt_setting (
    id INTEGER PRIMARY KEY,

    -- Interruptor maestro. Hay negocios que simplemente no fían, y para ellos
    -- el resto de los ajustes no significa nada.
    -- SQLite no tiene BOOLEAN: 0 = no vende a crédito, 1 = sí.
    credit_enabled INTEGER NOT NULL DEFAULT 1
        CHECK (credit_enabled IN (0, 1)),

    -- Días que se dan para pagar antes de considerar la deuda vencida.
    -- 0 significa "el mismo día".
    default_term_days INTEGER NOT NULL DEFAULT 15
        CHECK (default_term_days >= 0 AND default_term_days <= 365),

    -- Cuánto puede deber un cliente como máximo. 0 = sin límite.
    --
    -- En DÓLARES, igual que los precios (ver la migración 08): el importe en
    -- bolívares se deriva de la tasa vigente, así que un cambio de tasa no
    -- deja el límite desactualizado.
    customer_debt_limit REAL NOT NULL DEFAULT 0
        CHECK (customer_debt_limit >= 0),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- La fila única. `INSERT OR IGNORE` sobre la clave primaria lo hace idempotente.
INSERT OR IGNORE INTO debt_setting (id) VALUES (1);
