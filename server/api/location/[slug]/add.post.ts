import type { DrizzleError } from "drizzle-orm";

import { findLocation } from "~~/lib/db/queries/location";
import { insertLocationLog } from "~~/lib/db/queries/location-log";
import { InsertLocationLog } from "~~/lib/db/schema";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";

export default defineAuthenciatedEventHandler(async (event) => {
  // 后端做校验
  const slug = getRouterParam(event, "slug") as string;

  const result = await readValidatedBody(event, InsertLocationLog.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "当前项不存在！",
    }));
  }

  try {
    return await insertLocationLog(result.data, location.id, event.context.user.id);
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
