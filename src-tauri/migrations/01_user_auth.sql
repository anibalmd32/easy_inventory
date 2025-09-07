-- Tabla base para propiedades comunes
-- (No se crea tabla, solo se replica en cada entidad)

-- Tabla de permisos
CREATE TABLE permission (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

-- Tabla de roles
CREATE TABLE role (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

-- Relación muchos a muchos entre roles y permisos
CREATE TABLE role_permission (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
);

-- Tabla de credenciales de usuario
CREATE TABLE user_credential (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Tabla de configuración de usuario
CREATE TABLE user_settings (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    theme TEXT NOT NULL,
    language TEXT NOT NULL
);

-- Tabla de perfil de usuario
CREATE TABLE user_profile (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT
);

-- Tabla de usuario
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    credential_id TEXT NOT NULL,
    settings_id TEXT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES user_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (credential_id) REFERENCES user_credential(id) ON DELETE CASCADE,
    FOREIGN KEY (settings_id) REFERENCES user_settings(id) ON DELETE CASCADE
);

-- Relación muchos a muchos entre usuarios y roles
CREATE TABLE user_role (
    user_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

-- Tabla de sesiones de usuario
CREATE TABLE user_session (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Tabla de dispositivos de sesión de usuario
CREATE TABLE user_device_session (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    user_session_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    device_type TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    last_active_at TEXT NOT NULL,
    FOREIGN KEY (user_session_id) REFERENCES user_session(id) ON DELETE CASCADE
);
