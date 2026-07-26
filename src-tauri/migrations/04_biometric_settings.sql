-- Preferencia de desbloqueo biométrico, por usuario.
--
-- Vive en `user_settings` y no en una tabla aparte porque es exactamente eso:
-- una preferencia del usuario, igual que el tema o el idioma.
--
-- A diferencia de los seeders (02 y 03), este script NO es idempotente:
-- `ALTER TABLE ADD COLUMN` falla si la columna ya existe. No hace falta que
-- lo sea, porque el plugin lleva registro de las versiones aplicadas y cada
-- migración se ejecuta una sola vez.

-- SQLite no tiene BOOLEAN: 0 = desactivado, 1 = activado.
ALTER TABLE user_settings
    ADD COLUMN biometric_enabled INTEGER NOT NULL DEFAULT 0;

-- NULL significa "todavía no se le ha ofrecido". Es lo que dispara el aviso
-- la primera vez que el usuario entra. Se guarda la fecha en vez de un simple
-- booleano para saber además cuándo se le preguntó.
ALTER TABLE user_settings
    ADD COLUMN biometric_prompted_at DATETIME;
