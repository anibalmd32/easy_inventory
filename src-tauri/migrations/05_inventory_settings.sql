-- Configuración del módulo de inventario: con qué agrupa el usuario sus
-- productos, cómo los mide, y cuándo quiere que le avisemos de que se están
-- acabando.

-- Categorías con las que el negocio agrupa sus productos (bebidas, limpieza…).
-- No se siembra ninguna a propósito: dependen por completo del negocio.
CREATE TABLE IF NOT EXISTS product_category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Formas de medir un producto: por unidad, por kilo, por caja…
CREATE TABLE IF NOT EXISTS measurement_unit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    -- Abreviatura corta para las etiquetas y los listados ("kg", "cja").
    abbreviation TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Índices únicos PARCIALES: la condición `deleted_at IS NULL` es lo que hace
-- que borrar "Bebidas" permita volver a crear otra categoría con ese nombre
-- más adelante, en vez de dejar el nombre bloqueado para siempre.
-- COLLATE NOCASE evita que convivan "Bebidas" y "bebidas".
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_category_name
    ON product_category (name COLLATE NOCASE)
    WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_measurement_unit_name
    ON measurement_unit (name COLLATE NOCASE)
    WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_measurement_unit_abbreviation
    ON measurement_unit (abbreviation COLLATE NOCASE)
    WHERE deleted_at IS NULL;

-- Ajustes generales del inventario. Una sola fila, siempre con id = 1.
CREATE TABLE IF NOT EXISTS inventory_setting (
    id INTEGER PRIMARY KEY,
    -- A partir de esta cantidad (o menos) se considera que a un producto le
    -- queda poco. Todavía no hay notificaciones; de momento solo se guarda.
    low_quantity_threshold INTEGER NOT NULL DEFAULT 5
        CHECK (low_quantity_threshold >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- La fila única. `INSERT OR IGNORE` sobre la clave primaria lo hace idempotente.
INSERT OR IGNORE INTO inventory_setting (id, low_quantity_threshold)
VALUES (1, 5);

-- Unidades de medida de arranque. Se siembran porque son universales y así el
-- usuario encuentra la pantalla usable desde el primer momento; puede editar o
-- borrar cualquiera de ellas.
INSERT OR IGNORE INTO measurement_unit (name, abbreviation) VALUES
    ('Unidad', 'u'),
    ('Kilogramo', 'kg'),
    ('Gramo', 'g'),
    ('Litro', 'L'),
    ('Caja', 'cja'),
    ('Paquete', 'paq'),
    ('Bolsa', 'bls'),
    ('Docena', 'dz');
