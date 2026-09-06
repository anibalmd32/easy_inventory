-- Permite que la existencia de un producto quede en negativo.
--
-- DECISIÓN: cuando el carrito pide más de lo que hay registrado, el punto de
-- venta AVISA pero deja vender. En una bodega el inventario registrado casi
-- nunca cuadra con el real, y frenarle el cobro al cajero con el cliente
-- delante es peor que el descuadre. Una existencia negativa no es un error:
-- es justo la señal de que ese producto hay que recontarlo.
--
-- El `CHECK (quantity >= 0)` de la migración 12 lo impedía, y SQLite no sabe
-- quitar un CHECK: hay que rehacer la tabla. Se hace AHORA, antes de crear
-- las ventas, para que ninguna otra tabla apunte todavía a `product` y el
-- renombrado no tenga que arrastrar claves foráneas.
--
-- No es idempotente (usa ALTER TABLE y DROP TABLE) y no hace falta que lo
-- sea: el plugin lleva registro de versiones y no la reaplica.

ALTER TABLE product RENAME TO product_old;

-- Misma definición que la migración 12, con un único cambio: `quantity` ya no
-- lleva CHECK. Todo lo demás se conserva tal cual, comentarios incluidos.
CREATE TABLE product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,

    -- Código de barras del producto o código propio del negocio. Es opcional:
    -- hay mercancía a granel que sencillamente no trae código.
    sku TEXT,

    category_id INTEGER REFERENCES product_category (id),
    measurement_unit_id INTEGER NOT NULL REFERENCES measurement_unit (id),

    -- Precios en DÓLARES, igual que el resto de la app (ver la migración 08).
    sale_price REAL NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
    cost_price REAL NOT NULL DEFAULT 0 CHECK (cost_price >= 0),

    -- REAL y sin CHECK: hay productos que se venden por kilos o por litros, y
    -- puede quedar en negativo cuando se vendió más de lo que había apuntado.
    quantity REAL NOT NULL DEFAULT 0,

    min_quantity REAL CHECK (min_quantity IS NULL OR min_quantity >= 0),
    photo TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

INSERT INTO product (
    id, name, description, sku, category_id, measurement_unit_id,
    sale_price, cost_price, quantity, min_quantity, photo,
    created_at, updated_at, deleted_at
)
SELECT
    id, name, description, sku, category_id, measurement_unit_id,
    sale_price, cost_price, quantity, min_quantity, photo,
    created_at, updated_at, deleted_at
FROM product_old;

-- Los índices viejos siguen colgando de `product_old`: se van con ella, y por
-- eso los nuevos se crean DESPUÉS (si no, chocarían por nombre repetido).
DROP TABLE product_old;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_name
    ON product (name COLLATE NOCASE)
    WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_sku
    ON product (sku COLLATE NOCASE)
    WHERE deleted_at IS NULL AND sku IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_product_category
    ON product (category_id)
    WHERE deleted_at IS NULL;
