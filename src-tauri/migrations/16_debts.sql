-- El fiado: lo que un cliente se llevó y todavía no ha pagado.
--
-- El punto de venta solo ESCRIBE en `debt`, al emitir una venta a crédito.
-- `debt_payment` se crea aquí, vacía, para que el módulo de deudas la herede
-- sin tener que rehacer el esquema: los abonos y el estado de una deuda son
-- suyos, pero son inseparables de la tabla que los suma.
--
-- Todo en DÓLARES, igual que `debt_setting.customer_debt_limit`.

CREATE TABLE IF NOT EXISTS debt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Sin cliente no hay fiado: a quién le cobras después. Por eso una venta
    -- a crédito exige cliente aunque las de mostrador no.
    customer_id INTEGER NOT NULL REFERENCES customer (id),

    -- De qué venta salió. Es NULL cuando el dueño carga una deuda a mano
    -- desde el módulo de deudas (por ejemplo, algo que ya venía de antes).
    sale_id INTEGER REFERENCES sale (id),

    -- Quién la concedió.
    user_id INTEGER NOT NULL REFERENCES user (id),

    -- Lo que se quedó a deber. Puede ser MENOS que el total de la venta: si el
    -- cliente abonó algo en el momento, ese abono va a `sale_payment` y aquí
    -- queda solo el resto.
    original_amount_usd REAL NOT NULL CHECK (original_amount_usd > 0),
    -- Lo abonado después. Lo mueve el módulo de deudas, no el punto de venta.
    paid_amount_usd REAL NOT NULL DEFAULT 0 CHECK (paid_amount_usd >= 0),

    -- 'cancelled' es la deuda que se anula porque se anuló su venta.
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'paid', 'cancelled')),

    -- Fecha límite para pagar, calculada al emitir con
    -- `debt_setting.default_term_days`.
    due_date DATETIME NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- Sin `deleted_at`: una deuda se salda o se cancela, no se borra.
);

-- Una venta genera como mucho una deuda. Si el índice salta al emitir es que
-- algo se escribió dos veces.
CREATE UNIQUE INDEX IF NOT EXISTS idx_debt_sale
    ON debt (sale_id)
    WHERE sale_id IS NOT NULL;

-- "¿Cuánto debe esta persona?" es la consulta que hace el punto de venta antes
-- de dejar fiar, y la que ordena la pantalla del módulo de deudas.
CREATE INDEX IF NOT EXISTS idx_debt_customer ON debt (customer_id, status);
CREATE INDEX IF NOT EXISTS idx_debt_due_date ON debt (due_date) WHERE status = 'open';

-- Los abonos. El punto de venta no escribe aquí.
CREATE TABLE IF NOT EXISTS debt_payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    debt_id INTEGER NOT NULL REFERENCES debt (id),
    user_id INTEGER NOT NULL REFERENCES user (id),

    payment_method_id INTEGER REFERENCES payment_method (id),
    payment_method_name TEXT NOT NULL,

    -- Mismo criterio que en `sale_payment`: lo que entregó el cliente en su
    -- moneda, su equivalente en dólares, y la tasa con la que se convirtió.
    currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
    amount REAL NOT NULL CHECK (amount > 0),
    amount_usd REAL NOT NULL CHECK (amount_usd > 0),
    exchange_rate REAL CHECK (exchange_rate IS NULL OR exchange_rate > 0),
    reference TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_debt_payment_debt ON debt_payment (debt_id);
