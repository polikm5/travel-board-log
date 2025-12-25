import { findLocation } from "~~/lib/db/queries/location";
import { updateLocationLogById } from "~~/lib/db/queries/location-log";
import { InsertLocationLog } from "~~/lib/db/schema";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";
import z from "zod";

export default defineAuthenciatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocationLog.safeParse);
  const slug = getRouterParam(event, "slug") as string;
  if (!result.success) {
    return sendZodError(event, result.error);
  }
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
      statusMessage: "Error locationLog id",
    }));
  }
  const updated = await updateLocationLogById(Number(id), result.data, event.context.user.id);
  if (!updated) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Error locationLog data",
    }));
  }
});
