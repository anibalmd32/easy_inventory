-- Catálogo de preguntas de seguridad usado para recuperar la contraseña.
-- `question_key` es un slug estable: el texto visible se resuelve en el
-- frontend con i18n (`securityQuestions.<question_key>`), así el catálogo
-- no queda atado a un idioma.
CREATE TABLE IF NOT EXISTS security_question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_key TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Respuesta que cada usuario dio a la pregunta que eligió.
-- Se guarda normalizada (minúsculas, sin tildes, sin espacios de sobra)
-- para que la comparación al recuperar la contraseña no falle por tipeo.
CREATE TABLE IF NOT EXISTS user_security_answer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    security_question_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (security_question_id) REFERENCES security_question(id)
);

-- Seeder del catálogo. `INSERT OR IGNORE` + UNIQUE(question_key) lo hace
-- idempotente, así que volver a correr la migración nunca duplica filas.
INSERT OR IGNORE INTO security_question (question_key) VALUES
    ('pet_name'),
    ('mother_maiden_name'),
    ('birth_city'),
    ('first_school'),
    ('childhood_friend'),
    ('favorite_teacher');
