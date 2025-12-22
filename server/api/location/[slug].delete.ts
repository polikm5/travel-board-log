import { deleteLocationBySlug, findLocationBySlug } from "~~/lib/db/queries/location";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenciatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  await new Promise(resolve => setTimeout(resolve, 5000));
  const locationExist = await findLocationBySlug(slug);
  if (!locationExist) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "当前删除项不存在",
    }));
  }

  const deleted = deleteLocationBySlug(slug, event.context.user.id);
  if (!deleted) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "当前删除项不存在",
    }));
  }
  return deleted;
});
