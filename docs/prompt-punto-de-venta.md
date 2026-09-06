# Módulo de Punto de Venta — Easy Inventory

## Contexto

Easy Inventory es una app local-first en **Tauri v2 + React + SQLite en el
dispositivo**, para un negocio pequeño venezolano (tipo bodega o abasto).
Es **mobile-first**: responsive siempre, pero se diseña primero para móvil.

Ya están construidos y funcionando: autenticación completa (setup del dueño,
login, recuperación por pregunta de seguridad, biometría), el módulo de
**Configuración** entero, el **Perfil**, y el módulo de **Inventario** con
productos.

Falta el **Punto de Venta**: la ruta `/$role/invoicing` es todavía un
`ModulePlaceholder`.

Este módulo lo van a usar sobre todo los **vendedores/cajeros**, no el dueño.
Diséñalo para alguien que está de pie, con una mano, atendiendo a un cliente
que espera. La velocidad importa más que la elegancia.

## Antes de escribir una sola línea

1. **Lee el inventario ya construido** y cópiale el patrón. Es el módulo más
   parecido a lo que vas a hacer:
   - `src/routes/$role/inventory/index.tsx`
   - `src/core/infrastructure/repositories/ProductRepository.ts`
   - `src/core/infrastructure/services/useCasesServices/InventoryService.ts`
2. **Lee el subagente `settings-module`**
   (`.claude/agents/settings-module.md`). Aunque es de otro módulo, contiene
   las convenciones del proyecto y **ocho trampas que ya costaron tiempo**
   (errores de SQLite, `bun run build`, CRLF, enums mixtos…). Aplícalas.
3. **Carga la skill `daisyui`** siempre que vayas a generar JSX.
4. **Propón el plan de la base de datos antes de implementarlo.** Este módulo
   escribe dinero e inventario; un esquema mal pensado sale caro después.

## Lo que ya existe y DEBES consumir, no reinventar

| Pieza | Dónde | Para qué |
|---|---|---|
| `product` | migración 12 | `sale_price` y `cost_price` en USD, `quantity` REAL, `sku` opcional (código de barras) |
| `ProductRepository` | `findPage`, `findOptions`, `findByIds`, `countLowStock` | búsqueda y listado de productos |
| `BarcodeScannerService` | `sharedServices/` | `isAvailable()` y `scanProductCode()`, ya montado sobre `@tauri-apps/plugin-barcode-scanner` |
| `FileDeliveryService` | `sharedServices/` | compartir archivos, montado sobre sharekit |
| `pos_setting` | migración 08 y 10 | `primary_currency`, `invoice_prefix`, `invoice_next_number`, `invoice_show_business_info`, `invoice_footer_note` |
| `payment_method` | migración 06 | catálogo editable: Efectivo, Pago móvil, Transferencia, Punto de venta |
| `exchange_rate` | migración 06 | historial de tasa Bs/USD, append-only. La vigente es la más reciente |
| `business_setting` | migraciones 07 y 09 | nombre, logo, RIF, dirección, teléfono para la factura |
| `debt_setting` | migración 11 | `credit_enabled`, `default_term_days`, `customer_debt_limit` |
| `PriceDisplay` / `usePriceFormatter` | `presentation/` | precio con importe principal grande y el otro entre paréntesis |
| `CatalogSection`, `FormDialog`, `ConfirmDialog`, `TextInput`, `SelectInput`, `SubmitBtn`, `FormAlert` | `presentation/components/` | reutilízalos |

**Regla de oro del dinero:** los precios se guardan **siempre en dólares**. El
importe en bolívares se deriva de la tasa vigente y **nunca se almacena**
(salvo la excepción del punto 3 de abajo).

## Tareas

### 1. Carrito de venta

- Agregar producto por **búsqueda de nombre**, por **código** y por **escaneo
  de código de barras** (el servicio ya existe; en escritorio no hay cámara,
  así que el botón debe ocultarse solo).
- Cambiar cantidad de una línea, quitar líneas, vaciar el carrito.
- La cantidad es **REAL**, no entera: hay productos por kilo y por litro.
- Mostrar subtotal y total con `PriceDisplay`.
- **Avisar si no hay existencias suficientes.** Decide conmigo si se bloquea
  la venta o solo se advierte.

### 2. Cliente

- Datos del cliente: nombre, documento/cédula, teléfono. Todos opcionales
  salvo cuando la venta es a crédito.
- **Hace falta una tabla `customer`, que todavía no existe.** Un cliente se
  reutiliza entre ventas y lo necesitará también el módulo de deudas, así que
  no lo metas como texto suelto dentro de la factura.
- Poder vender sin cliente: la mayoría de las ventas de mostrador son
  anónimas y pedir datos cada vez sería insoportable.

### 3. Cobro

- Elegir **método de pago** del catálogo existente.
- Poder cobrar **en bolívares o en dólares**, y calcular el **vuelto**.
- **Guarda la tasa usada en cada venta.** Es la única excepción a la regla del
  dinero: si no la congelas, reimprimir una factura de hace un mes mostraría
  bolívares distintos a los que el cliente pagó.
- **Guarda también el precio unitario de cada línea.** Si el producto sube de
  precio mañana, la factura vieja no puede cambiar.
- Decide conmigo si hace falta **pago mixto** (parte efectivo, parte
  transferencia). Es común en Venezuela, pero complica bastante.

### 4. Venta a crédito

- Solo si `debt_setting.credit_enabled` está activo.
- Exige cliente, respeta `customer_debt_limit` y usa `default_term_days` para
  la fecha de vencimiento.
- La venta a crédito **debe generar la deuda**. Coordina el esquema conmigo
  para que el módulo de deudas lo herede sin rehacerlo.

### 5. Factura

- Numeración con `invoice_prefix` + `invoice_next_number` de `pos_setting`,
  **incrementando el correlativo al emitir**. Ojo con las condiciones de
  carrera y con el aviso sobre transacciones del punto de abajo.
- Respetar `invoice_show_business_info` y `invoice_footer_note`.
- Generar la factura e imprimirla. **Investiga primero** formatos y la
  integración con impresora térmica, y **preséntame las opciones antes de
  implementar**: es la parte con más incertidumbre de todo el módulo.
  - Considera el ancho de papel típico (58 mm y 80 mm).
  - `FileDeliveryService` ya existe para compartir; puede que compartir un PDF
    o una imagen por WhatsApp sea más útil que imprimir, para empezar.
- **Descontar del inventario** al emitir la venta.

### 6. Lo que creo que se te escapa

Estas no estaban en tu lista y creo que las vas a necesitar. **Decidamos juntas
cuáles entran ahora y cuáles después**, no las hagas todas por tu cuenta:

- **Historial de ventas del día.** Sin esto el cajero no puede comprobar nada
  ni reimprimir un recibo. Yo lo pondría en el MVP.
- **Anular una venta.** Se cobra de más, el cliente se arrepiente, se escanea
  dos veces el mismo producto. Tiene que devolver la mercancía al inventario.
  También lo pondría en el MVP.
- **Cierre de caja.** Cuánto vendió cada cajero y cuánto debería haber en la
  gaveta. Es justo lo que un dueño quiere de un módulo que usan terceros.
- **Quién hizo cada venta.** Guardar el `user_id` en la venta. Es barato
  ahora y reconstruirlo después es imposible.
- **Permisos.** Ya están sembrados `invoicing.view`, `invoicing.create`,
  `invoicing.update`, `invoicing.delete` y el store tiene `hasPermission()`,
  pero **todavía no se usan en ninguna pantalla**. Este módulo, que usan
  cajeros, es el sitio natural para empezar a aplicarlos.
- **Qué pasa si no hay tasa de cambio fijada.** Hoy `PriceDisplay` cae en
  mostrar solo dólares, pero una venta necesita un total concreto. Decide qué
  hacer antes de que aparezca el caso.

## Avisos técnicos que te van a morder

1. **Las transacciones no son fiables tal cual.** `tauri-plugin-sql` manda
   cada sentencia a un pool de sqlx, así que un `BEGIN`/`COMMIT` de Kysely no
   está atado a una conexión. Con escrituras secuenciales el pool reutiliza la
   misma y funciona, pero **una venta escribe en varias tablas a la vez**
   (venta, líneas, inventario, deuda, correlativo) y es justo el caso donde
   una escritura a medias deja el negocio descuadrado. Está documentado en
   `UserRepository.storeUser`. **Plantéame si toca moverlo a un comando de
   Rust antes de escribir la venta.**
2. **`bun run build` es `tsc && vite build`** y es el `beforeBuildCommand` de
   Tauri: cualquier error de tipos impide compilar el APK.
3. **El escáner y el compartir solo existen en móvil.** En escritorio el
   `invoke` falla; degrada en silencio como hace `BiometricService`.
4. **`quantity` es REAL.** No asumas enteros en ninguna cuenta.

## Cómo verificas

Escribe un script en el scratchpad que corra las migraciones en orden contra
`bun:sqlite` en memoria y compruebe lo que de verdad importa: que una venta
descuenta del inventario, que el correlativo avanza, que la tasa y el precio
quedan congelados, que anular devuelve la mercancía, y que los `CHECK`
rechazan valores imposibles.

Después, siempre las cuatro:

```bash
bunx tsc --noEmit                 # vacío
bunx --bun biome check .          # sin errores
bun run build                     # tsc && vite build
cd src-tauri && cargo check       # valida los include_str! de las migraciones
```

Y comprueba la simetría es/en de las claves i18n.

**Sé honesto con lo que no probaste.** La UI no se puede ejecutar en la
sesión: si no la he visto yo en el emulador, dilo en vez de dar por hecho que
funciona.

## Cómo quiero trabajar

- **Por partes, y preguntando.** Empieza proponiendo el esquema de base de
  datos y las decisiones abiertas (pago mixto, bloquear o advertir sin
  existencias, alcance del MVP). Cuando lo acordemos, implementas.
- Textos **sin jerga**, como hablaría el dueño de una bodega. Nada de "SKU",
  "stock" ni "transacción" en pantalla.
- Español e inglés siempre simétricos, en los dos namespaces (`translation` y
  `validations`).
- Si algo de lo que te pido te parece mala idea, dímelo antes de construirlo.

## Al terminar

Crea un subagente `pos-module` en `.claude/agents/`, con el mismo criterio que
`settings-module.md`: las convenciones del módulo, las decisiones que tomamos
y por qué, y las trampas concretas que aparezcan por el camino.
