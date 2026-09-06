-- Los clientes del negocio.
--
-- La mayoría de las ventas de mostrador son anónimas y pedir datos en cada
-- una sería insoportable, así que el cliente es OPCIONAL en la venta. Cuando
-- sí hace falta —una venta fiada, o alguien que vuelve— tiene que ser una
-- fila reutilizable y no texto suelto dentro de la factura: el módulo de
-- deudas necesita saber cuánto debe cada persona sumando varias ventas.
CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,

    -- Cédula o RIF. Opcional: mucha gente compra fiado sin dejar documento.
    document TEXT,
    phone TEXT,

    -- Para lo que el dueño quiera apuntarse ("el del taller de la esquina").
    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- El nombre NO es único a propósito: dos "José Pérez" son perfectamente
-- posibles y bloquear el segundo sería absurdo. El documento sí, porque
-- identifica a una persona; pero solo entre los que lo tienen, igual que el
-- código de los productos.
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_document
    ON customer (document COLLATE NOCASE)
    WHERE deleted_at IS NULL AND document IS NOT NULL;

-- El buscador de clientes ordena y filtra por nombre.
CREATE INDEX IF NOT EXISTS idx_customer_name
    ON customer (name COLLATE NOCASE)
    WHERE deleted_at IS NULL;
