import type { DrizzleError } from "drizzle-orm";

import { findLocationByName, findUniqueSlug, insertLocation } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";
import slugify from "slug";

export default defineAuthenciatedEventHandler(async (event) => {
  // 后端做校验
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }
  const locationExist = await findLocationByName(result.data, event.context.user.id);
  if (locationExist) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "location name is already exist",
    }));
  }
  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return await insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;
    console.error("INSERT ERROR", error.cause);
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: (error?.cause as { message: string }).message || error.message,
    }));
  }
});
