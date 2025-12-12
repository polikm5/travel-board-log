import { findLocation } from "~~/lib/db/queries/location";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenciatedEventHandler(async (event) => {
//   await new Promise(resolve => setTimeout(resolve, 2000));
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "location not found",
    }));
  }
  return location;
});
