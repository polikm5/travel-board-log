import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  email_verified: integer({ mode: "boolean" }).notNull(),
  created_at: integer().notNull(),
  updated_at: integer().notNull(),
});
