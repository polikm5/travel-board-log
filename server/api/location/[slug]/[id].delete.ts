import { findLocationBySlug } from "~~/lib/db/queries/location";
import { deleteLocationLogById } from "~~/lib/db/queries/location-log";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import z from "zod";

export default defineAuthenciatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const locationExist = await findLocationBySlug(slug);
  if (!locationExist) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "当前删除项不存在",
    }));
  }
  const id = getRouterParam(event, "id");
  if (!z.coerce.number().safeParse(id).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Error locationLog id",
    }));
  }
  const deleted = deleteLocationLogById(Number(id), event.context.user.id);
  if (!deleted) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "当前删除项不存在",
    }));
  }
  setResponseStatus(event, 204);
});
