import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { EasyInventoryServerApp } from "../../../server/src/index";
import { env } from "./env";

export const client = hc<EasyInventoryServerApp>(env.serverUrl);

export const queryClient = new QueryClient();
