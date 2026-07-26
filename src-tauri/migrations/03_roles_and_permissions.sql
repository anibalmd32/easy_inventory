-- Seeder de roles y permisos.
--
-- Los índices únicos son lo que permite que este script sea idempotente:
-- sin ellos `INSERT OR IGNORE` no tendría ningún conflicto que ignorar y
-- cada corrida duplicaría las filas.
CREATE UNIQUE INDEX IF NOT EXISTS idx_role_name ON role (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_permission_name ON permission (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_role_permission_pair
    ON role_permission (role_id, permission_id);

INSERT OR IGNORE INTO role (name, description) VALUES
    ('superadmin', 'Control absoluto de la aplicación. Solo puede existir uno.'),
    ('admin', 'Acceso a todos los módulos funcionales, salvo la configuración de la app.'),
    ('contador', 'Consulta el inventario y gestiona facturación, deudas y reportes.'),
    ('vendedor', 'Registra ventas y deudas de sus clientes.');

INSERT OR IGNORE INTO permission (name, description) VALUES
    ('inventory.view', 'Ver el inventario'),
    ('inventory.create', 'Registrar productos'),
    ('inventory.update', 'Editar productos y existencias'),
    ('inventory.delete', 'Eliminar productos'),
    ('invoicing.view', 'Ver facturas'),
    ('invoicing.create', 'Emitir facturas'),
    ('invoicing.update', 'Editar facturas'),
    ('invoicing.delete', 'Anular facturas'),
    ('debts.view', 'Ver deudas'),
    ('debts.create', 'Registrar deudas'),
    ('debts.update', 'Registrar abonos y editar deudas'),
    ('debts.delete', 'Eliminar deudas'),
    ('reports.view', 'Ver reportes'),
    ('users.view', 'Ver usuarios'),
    ('users.create', 'Crear usuarios'),
    ('users.update', 'Editar usuarios'),
    ('users.delete', 'Eliminar usuarios'),
    ('roles.view', 'Ver roles y permisos'),
    ('roles.manage', 'Crear y editar roles y sus permisos'),
    ('settings.view', 'Ver la configuración de la app'),
    ('settings.manage', 'Modificar la configuración de la app');

-- superadmin: absolutamente todo.
INSERT OR IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM role r, permission p
WHERE r.name = 'superadmin';

-- admin: todo menos la configuración de la app.
INSERT OR IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM role r, permission p
WHERE r.name = 'admin'
  AND p.name NOT LIKE 'settings.%';

-- contador: lectura de inventario, más facturación, deudas y reportes.
INSERT OR IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM role r, permission p
WHERE r.name = 'contador'
  AND p.name IN (
      'inventory.view',
      'invoicing.view',
      'invoicing.create',
      'invoicing.update',
      'debts.view',
      'debts.create',
      'debts.update',
      'reports.view'
  );

-- vendedor: lo mínimo para vender y anotar lo que queda debiendo.
INSERT OR IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM role r, permission p
WHERE r.name = 'vendedor'
  AND p.name IN (
      'inventory.view',
      'invoicing.view',
      'invoicing.create',
      'debts.view',
      'debts.create'
  );
