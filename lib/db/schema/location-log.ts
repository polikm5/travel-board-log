import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~~/lib/zod-schema";
import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

import type { SelectLocationLogImage } from "./location-log-image";

import { user } from "./auth-schema";
import { location } from "./location";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelation = relations(locationLog, ({ one }) => {
  return {
    location: one(location, {
      fields: [locationLog.locationId],
      references: [location.id],
    }),
  };
});

export const InsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  locationId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((data, ctx) => {
  if (data.startedAt > data.endedAt || data.endedAt < data.startedAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "startedAt must be before endedAt",
      path: ["startedAt"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "endedAt must be after startedAt",
      path: ["endedAt"],
    });
  }
});

export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
export type LocationLog = typeof locationLog.$inferSelect;
export type SelectLocationLogWithImages = LocationLog & {
  images: SelectLocationLogImage[];
};
