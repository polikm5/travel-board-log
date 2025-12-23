import type z from "zod";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~~/lib/zod-schema";
import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { LocationLog } from "./location-log";

import { user } from "./auth-schema";
import { locationLog } from "./location-log";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.userId, t.name),
]);

export const locationRelation = relations(location, ({ many }) => {
  return {
    locationLog: many(locationLog),
  };
});

export const InsertLocation = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const SelectLocation = createSelectSchema(location);
export type InsertLocation = z.infer<typeof InsertLocation>;

export type SelectLocationType = typeof location.$inferSelect;

export type SelectLocationWithLogs = typeof location.$inferSelect & {
  locationLog: LocationLog[];
};
