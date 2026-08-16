-- Configuración del negocio: nombre comercial, logo y tema de la interfaz.

CREATE TABLE IF NOT EXISTS business_setting (
    id INTEGER PRIMARY KEY,
    -- Nombre comercial. Vacío = el usuario todavía no lo ha personalizado y
    -- la app muestra su propio nombre provisional.
    name TEXT NOT NULL DEFAULT '',
    -- Logo como data URL: el WebView la dibuja directo y no hay sistema de
    -- archivos común donde guardar una ruta. NULL = sin logo.
    logo TEXT,
    -- Tema de daisyUI que se aplica a toda la interfaz. Debe existir en la
    -- lista de temas del CSS (index.css).
    theme TEXT NOT NULL DEFAULT 'business',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- La fila única. `INSERT OR IGNORE` sobre la clave primaria lo hace idempotente.
INSERT OR IGNORE INTO business_setting (id, name, theme)
VALUES (1, '', 'business');
