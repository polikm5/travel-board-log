import { findLocation } from "~~/lib/db/queries/location";
import { findLocationLog } from "~~/lib/db/queries/location-log";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import z from "zod";

export default defineAuthenciatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "location not found",
    }));
  }
  const id = getRouterParam(event, "id");
  if (!z.coerce.number().safeParse(id).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "invalid id",
    }));
  }
  const locationLog = await findLocationLog(Number(id), event.context.user.id);
  if (!locationLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "location Log not found",
    }));
  }
  return locationLog;
});
