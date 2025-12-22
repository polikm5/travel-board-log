import { findLocationByName, updateLocationBySlug } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";

export default defineAuthenciatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);
  const slug = getRouterParam(event, "slug") as string;
  if (!result.success) {
    return sendZodError(event, result.error);
  }
  const locationExist = await findLocationByName(result.data, event.context.user.id);
  if (locationExist && locationExist.slug !== slug) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "location name is already exist",
    }));
  }

  return updateLocationBySlug(slug, result.data, event.context.user.id);
});
