-- Los productos del negocio: lo que se vende, a cuánto, y cuánto queda.
--
-- Las categorías y las unidades de medida ya existen (migración 05); aquí solo
-- se apunta a ellas.
CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,

    -- Código de barras del producto o código propio del negocio. Es opcional:
    -- hay mercancía a granel que sencillamente no trae código.
    sku TEXT,

    -- La categoría es opcional a propósito: no se siembra ninguna, y obligar a
    -- crear una antes de poder registrar el primer producto sería una traba.
    -- Al borrar una categoría, sus productos se quedan sin ella (ON DELETE no
    -- aplica: el borrado es lógico, ver `InventoryService.deleteCategory`).
    category_id INTEGER REFERENCES product_category (id),

    -- La unidad sí es obligatoria: sin ella la cantidad no significa nada
    -- ("3" no es lo mismo que "3 kg" que "3 cajas").
    measurement_unit_id INTEGER NOT NULL REFERENCES measurement_unit (id),

    -- Precios en DÓLARES, igual que el resto de la app (ver la migración 08):
    -- el importe en bolívares se deriva de la tasa vigente, así que un cambio
    -- de tasa no obliga a reetiquetar el catálogo.
    sale_price REAL NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
    -- Lo que le cuesta al negocio. Sirve para saber la ganancia; nunca se
    -- muestra en el catálogo que se comparte con los clientes.
    cost_price REAL NOT NULL DEFAULT 0 CHECK (cost_price >= 0),

    -- REAL y no INTEGER: hay productos que se venden por kilos o por litros y
    -- pueden quedar 1,5.
    quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),

    -- Umbral propio de "queda poco". NULL = usar el general de la
    -- configuración de inventario (`inventory_setting.low_quantity_threshold`).
    min_quantity REAL CHECK (min_quantity IS NULL OR min_quantity >= 0),

    -- Foto opcional, como data URL ya reducida (igual que el logo del negocio).
    photo TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Índices únicos PARCIALES, como en los catálogos de configuración: la
-- condición `deleted_at IS NULL` hace que borrar un producto libere su nombre
-- y su código para volver a usarlos.
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_name
    ON product (name COLLATE NOCASE)
    WHERE deleted_at IS NULL;

-- El código solo es único entre los que lo tienen: varios productos a granel
-- sin código no se estorban entre sí.
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_sku
    ON product (sku COLLATE NOCASE)
    WHERE deleted_at IS NULL AND sku IS NOT NULL;

-- El listado filtra por categoría y ordena por nombre.
CREATE INDEX IF NOT EXISTS idx_product_category
    ON product (category_id)
    WHERE deleted_at IS NULL;
