import { QueryClient } from "@tanstack/react-query";

// ---------------------------------------------------------------------------
// Cliente RPC de la futura versión web (Hono).
//
// Comentado a propósito, no eliminado: el tipo del servidor vive en un
// repositorio hermano (`../../../server`) que todavía no existe, así que `tsc`
// no puede resolverlo y aborta. Eso rompía `bun run build`, que es el
// `beforeBuildCommand` de Tauri, y por tanto impedía compilar el APK de
// release.
//
// Para reactivarlo cuando exista el servidor, basta con descomentar estas
// líneas y su import de `env`:
//
// import { hc } from "hono/client";
// import type { EasyInventoryServerApp } from "../../../server/src/index";
// import { env } from "./env";
//
// export const client = hc<EasyInventoryServerApp>(env.serverUrl);
// ---------------------------------------------------------------------------

export const queryClient = new QueryClient();
