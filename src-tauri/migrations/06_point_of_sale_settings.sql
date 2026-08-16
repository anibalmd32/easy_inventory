-- Configuración del punto de venta: con qué métodos se cobra y a cuánto
-- está el dólar frente al bolívar.

-- Formas de pago que acepta el negocio (efectivo, pago móvil, transferencia…).
CREATE TABLE IF NOT EXISTS payment_method (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Índice único PARCIAL, igual que en los demás catálogos: borrar un método
-- libera su nombre y permite crearlo de nuevo más adelante.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_method_name
    ON payment_method (name COLLATE NOCASE)
    WHERE deleted_at IS NULL;

-- Métodos de arranque, universales en Venezuela. Se siembran para que la
-- pantalla sea usable desde el primer momento; se pueden editar o borrar.
INSERT OR IGNORE INTO payment_method (name) VALUES
    ('Efectivo'),
    ('Pago móvil'),
    ('Transferencia'),
    ('Punto de venta');

-- Historial de la tasa de cambio (bolívares por dólar). Cada fila es un
-- cambio de tasa; la vigente es siempre la más reciente. Es append-only:
-- no se edita ni se borra, por eso no tiene deleted_at.
CREATE TABLE IF NOT EXISTS exchange_rate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Bolívares que vale un dólar: 36.5 significa 1 USD = 36,50 Bs.
    rate REAL NOT NULL CHECK (rate > 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
