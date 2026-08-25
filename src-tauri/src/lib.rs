use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create user and user_session tables",
            sql: include_str!("../migrations/01_user_auth.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create security question catalog and seed it",
            sql: include_str!("../migrations/02_security_questions.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "seed roles, permissions and their relations",
            sql: include_str!("../migrations/03_roles_and_permissions.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "add biometric unlock preference to user settings",
            sql: include_str!("../migrations/04_biometric_settings.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create inventory settings: categories, units and low quantity threshold",
            sql: include_str!("../migrations/05_inventory_settings.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create payment methods and exchange rate history",
            sql: include_str!("../migrations/06_point_of_sale_settings.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "create business settings: name, logo and theme",
            sql: include_str!("../migrations/07_business_settings.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "create pos settings with the primary display currency",
            sql: include_str!("../migrations/08_pos_currency_settings.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "add tax id, address and phone to business settings",
            sql: include_str!("../migrations/09_business_contact_info.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "add invoice numbering and receipt options to pos settings",
            sql: include_str!("../migrations/10_invoice_settings.sql"),
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .setup(|_app| {
            // El plugin biométrico solo existe en móvil; en escritorio ni
            // siquiera se compila (ver el target en Cargo.toml).
            #[cfg(mobile)]
            _app.handle()
                .plugin(tauri_plugin_biometric::init())?;
            Ok(())
        })
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:easy_inventory_storage.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
