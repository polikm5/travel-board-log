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
