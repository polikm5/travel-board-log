import { and, eq } from "drizzle-orm";

import type { InsertLocationLog } from "../schema";

import db from "../index";
import { locationLog } from "../schema";

export async function insertLocationLog(insertable: InsertLocationLog, locationId: number, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    userId,
    locationId,
  }).returning();

  return inserted;
}

export async function findLocationLog(id: number, userId: number) {
  const log = await db.query.locationLog.findFirst({
    where: and(
      eq(locationLog?.id, id),
      eq(locationLog?.userId, userId),
    ),
  });
  return log;
}
