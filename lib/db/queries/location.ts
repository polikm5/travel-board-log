import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { InsertLocation } from "../schema";

import db from "../index";
import { location } from "../schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwsyz", 5);
export async function findLocationByName(existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return await db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await findLocationBySlug(slug));
  while (existing) {
    const idSlug = `${slug}-${nanoid()}`;
    existing = !!(await findLocationBySlug(idSlug));
    if (!existing) {
      slug = idSlug;
    }
  }
  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [inserted] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();
  return inserted;
}

export async function findLocations(userId: number) {
  const locations = db.query.location.findMany({
    where: eq(location.userId, userId),
  });

  return locations;
}

export async function findLocation(slug: string, userId: number) {
  const data = db.query.location.findFirst({
    where: and(
      eq(location.slug, slug),
      eq(location.userId, userId),
    ),
    with: {
      locationLog: true,
    },
  });

  return data;
}

export async function updateLocationBySlug(slug: string, updateable: InsertLocation, userId: number) {
  const [updated] = await db.update(location).set({
    ...updateable,
  }).where(
    and(
      eq(location.slug, slug),
      eq(location.userId, userId),
    ),
  ).returning();
  return updated;
}
