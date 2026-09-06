-- Las ventas: la factura, lo que se llevó el cliente y con qué pagó.
--
-- REGLA DEL DINERO (migración 08): los precios se guardan SIEMPRE en dólares.
-- Aquí hay dos excepciones deliberadas, y las dos son por lo mismo: una
-- factura emitida NO PUEDE CAMBIAR NUNCA MÁS.
--
--   1. `sale.exchange_rate` congela la tasa del día. Sin ella, reimprimir un
--      recibo del mes pasado mostraría unos bolívares que el cliente jamás
--      pagó.
--   2. `sale_item.unit_price_usd` congela el precio de cada línea. Si mañana
--      el producto sube, la factura vieja tiene que seguir cuadrando.
--
-- Por la misma razón se copian los NOMBRES (producto, unidad, forma de pago):
-- el catálogo se borra en lógico y un producto retirado dejaría el recibo
-- mudo.

CREATE TABLE IF NOT EXISTS sale (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- El número tal cual se imprime, con el prefijo ya pegado ("A-000123").
    -- Se compone al emitir con `pos_setting.invoice_prefix`.
    invoice_number TEXT NOT NULL,
    -- El correlativo desnudo. Sirve para ordenar y para ver saltos, cosa que
    -- con el texto formateado no se puede hacer.
    invoice_serial INTEGER NOT NULL CHECK (invoice_serial >= 1),

    -- Sin cliente = venta de mostrador anónima, que es la mayoría.
    customer_id INTEGER REFERENCES customer (id),

    -- Quién la hizo. Es lo que convierte este módulo en algo que el dueño
    -- puede darle a un tercero: sin esto, el cierre de caja no existe y
    -- reconstruirlo después es imposible.
    user_id INTEGER NOT NULL REFERENCES user (id),

    -- Una venta no se borra: se anula, y la anulada sigue ocupando su número
    -- igual que en un talonario de papel.
    status TEXT NOT NULL DEFAULT 'issued'
        CHECK (status IN ('issued', 'voided')),

    -- 'credit' es el fiado: genera una fila en `debt` por lo que quede sin
    -- pagar. Ver la migración 16.
    sale_type TEXT NOT NULL DEFAULT 'cash'
        CHECK (sale_type IN ('cash', 'credit')),

    -- Todo en DÓLARES. Hoy no hay descuento en pantalla ni IVA (esto es un
    -- recibo de bodega, no un documento fiscal), así que `discount_usd` es
    -- siempre 0 y el total coincide con el subtotal. La columna está para no
    -- tener que rehacer la tabla el día que haya rebajas.
    subtotal_usd REAL NOT NULL DEFAULT 0 CHECK (subtotal_usd >= 0),
    discount_usd REAL NOT NULL DEFAULT 0 CHECK (discount_usd >= 0),
    total_usd REAL NOT NULL DEFAULT 0 CHECK (total_usd >= 0),

    -- Bolívares por dólar en el momento de emitir. NULL cuando el negocio
    -- todavía no ha fijado ninguna tasa: en ese caso solo se puede cobrar en
    -- dólares y el recibo sale sin bolívares.
    exchange_rate REAL CHECK (exchange_rate IS NULL OR exchange_rate > 0),

    -- El vuelto que se le devolvió al cliente, en dólares, y en qué moneda se
    -- le entregó. Se guarda porque en `sale_payment` está lo que ENTREGÓ el
    -- cliente, no lo que se quedó el negocio; la diferencia es esta.
    change_usd REAL NOT NULL DEFAULT 0 CHECK (change_usd >= 0),
    change_currency TEXT NOT NULL DEFAULT 'USD'
        CHECK (change_currency IN ('USD', 'VES')),

    -- Anulación. `void_reason` es libre y opcional.
    voided_at DATETIME,
    voided_by_user_id INTEGER REFERENCES user (id),
    void_reason TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- Sin `deleted_at` a propósito: una venta nunca se borra, se anula.
);

-- Único SIN `WHERE deleted_at IS NULL`, al revés que los catálogos: anular una
-- factura no libera su número. Si el dueño retrocede `invoice_next_number` en
-- los ajustes, este índice es lo que impide emitir dos veces el mismo.
CREATE UNIQUE INDEX IF NOT EXISTS idx_sale_invoice_number
    ON sale (invoice_number);

-- El historial del día y el cierre de caja filtran por fecha, y el cierre
-- además por cajero.
CREATE INDEX IF NOT EXISTS idx_sale_created_at ON sale (created_at);
CREATE INDEX IF NOT EXISTS idx_sale_user ON sale (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sale_customer ON sale (customer_id);

-- Las líneas de la venta.
CREATE TABLE IF NOT EXISTS sale_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL REFERENCES sale (id),

    -- Puede quedar apuntando a un producto ya retirado del catálogo; por eso
    -- el nombre y la unidad se copian y no se cruzan al leer.
    product_id INTEGER REFERENCES product (id),
    product_name TEXT NOT NULL,
    unit_abbreviation TEXT NOT NULL DEFAULT '',

    -- REAL: hay productos por kilo y por litro. Mayor que cero: una línea de
    -- cantidad 0 no es una venta, es un descuido.
    quantity REAL NOT NULL CHECK (quantity > 0),

    -- Congelados, en dólares.
    unit_price_usd REAL NOT NULL CHECK (unit_price_usd >= 0),
    -- Lo que le costaba al negocio ese día. No se enseña en ninguna pantalla:
    -- está para poder calcular la ganancia real más adelante, y ese dato es
    -- imposible de reconstruir después si no se guarda ahora.
    unit_cost_usd REAL NOT NULL DEFAULT 0 CHECK (unit_cost_usd >= 0),
    line_total_usd REAL NOT NULL CHECK (line_total_usd >= 0),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sale_item_sale ON sale_item (sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_item_product ON sale_item (product_id);

-- Con qué pagó el cliente. Una fila por forma de pago: así el pago mixto
-- (parte efectivo, parte pago móvil), que en Venezuela es lo normal, no
-- necesita ningún cambio de esquema.
CREATE TABLE IF NOT EXISTS sale_payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL REFERENCES sale (id),

    payment_method_id INTEGER REFERENCES payment_method (id),
    payment_method_name TEXT NOT NULL,

    -- En qué moneda entregó el dinero y cuánto entregó EN ESA MONEDA. Es lo
    -- que hay que enseñar en el recibo: si pagó 500 Bs, el recibo dice 500 Bs.
    currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
    amount REAL NOT NULL CHECK (amount > 0),

    -- Lo mismo convertido a dólares con la tasa CONGELADA de la venta. Es lo
    -- que suma contra el total, y lo que permite cuadrar el cierre de caja sin
    -- volver a convertir con una tasa que ya cambió.
    amount_usd REAL NOT NULL CHECK (amount_usd >= 0),

    -- Referencia del pago móvil o de la transferencia. Opcional.
    reference TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sale_payment_sale ON sale_payment (sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_payment_method
    ON sale_payment (payment_method_id);
