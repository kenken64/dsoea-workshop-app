import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL || "file:workshop.db";

const client = createClient({
  url: databaseUrl,
});

export const db = drizzle(client, { schema });

export * from "./schema";
